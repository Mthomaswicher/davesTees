/**
 * Client-side background removal via corner-sampled color key, with
 * compositing-correct color decontamination for anti-aliased edges.
 *
 * Why edges used to look washed out:
 *   An anti-aliased pixel on a white background is a blend of bg and the
 *   true foreground, e.g. a black edge pixel might arrive as (230, 230, 230).
 *   Naively setting its alpha to ~10% still renders a light gray dot —
 *   visible as a halo when composited over a dark shirt. The fix is to
 *   "un-blend" bg from each partial-alpha pixel so the surviving color is
 *   the true foreground:
 *       P = α F + (1-α) B   ⇒   F = (P − (1-α) B) / α
 *
 * Best suited for logos / flat-bg art. Won't cleanly cut a subject from a
 * busy photo — that needs an ML model.
 */

const HARD_BASE = 45   // distance ≤ HARD ⇒ fully transparent
const SOFT_BASE = 130  // distance ≥ SOFT ⇒ fully opaque
const MAX_DIM = 1600

export function removeBackground(src, { tolerance = 1 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        resolve(processImage(img, tolerance))
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = src
  })
}

function processImage(img, tolerance) {
  let { naturalWidth: w, naturalHeight: h } = img
  const scale = Math.min(1, MAX_DIM / Math.max(w, h))
  w = Math.round(w * scale)
  h = Math.round(h * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)

  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data

  const bg = sampleBackground(data, w, h)

  // Tolerance widens both thresholds together (0.6 = strict, 1.4 = aggressive).
  const HARD = HARD_BASE * tolerance
  const SOFT = SOFT_BASE * tolerance
  const RANGE = SOFT - HARD

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const dist = colorDistance(r, g, b, bg.r, bg.g, bg.b)

    if (dist <= HARD) {
      // Fully transparent
      data[i + 3] = 0
      continue
    }

    if (dist >= SOFT) {
      // Fully opaque — leave as-is
      continue
    }

    // Partial-alpha ramp (eased: aggressive near bg, full opacity arrives sooner)
    let t = (dist - HARD) / RANGE
    t = t * t   // ease-in
    const newAlpha = Math.round(data[i + 3] * t)

    // Color decontamination — remove the bg contribution so the surviving
    // color is the true foreground, not a bg-tinted halo.
    if (t > 0.01) {
      const invT = 1 - t
      data[i]     = clip((r - invT * bg.r) / t)
      data[i + 1] = clip((g - invT * bg.g) / t)
      data[i + 2] = clip((b - invT * bg.b) / t)
    }
    data[i + 3] = newAlpha
  }

  // Erosion pass: any opaque pixel bordering a fully transparent pixel
  // loses a bit of alpha. Shrinks the foreground by ~1 px and kills the
  // last traces of halo that the math above can't catch (e.g. JPEG blocks).
  erode(data, w, h)

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

function clip(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

/**
 * Luminance-weighted RGB distance — green differences feel bigger than blue,
 * matching human perception better than naive Euclidean.
 */
function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db)
}

/**
 * Sample border points, greedy-cluster near-identical colors, return the
 * dominant cluster's mean. More robust than plain corner averaging when one
 * corner has a shadow or different color.
 */
function sampleBackground(data, w, h) {
  const points = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
    [Math.floor(w / 4), 0], [Math.floor((3 * w) / 4), 0],
    [Math.floor(w / 4), h - 1], [Math.floor((3 * w) / 4), h - 1],
  ]

  const samples = points.map(([x, y]) => {
    const i = (y * w + x) * 4
    return { r: data[i], g: data[i + 1], b: data[i + 2] }
  })

  const clusters = []
  for (const s of samples) {
    let hit = null
    for (const c of clusters) {
      if (colorDistance(s.r, s.g, s.b, c.mean.r, c.mean.g, c.mean.b) < 22) {
        hit = c
        break
      }
    }
    if (hit) {
      hit.members.push(s)
      hit.mean = mean(hit.members)
    } else {
      clusters.push({ members: [s], mean: s })
    }
  }

  clusters.sort((a, b) => b.members.length - a.members.length)
  return clusters[0].mean
}

function mean(arr) {
  const n = arr.length
  return {
    r: arr.reduce((s, p) => s + p.r, 0) / n,
    g: arr.reduce((s, p) => s + p.g, 0) / n,
    b: arr.reduce((s, p) => s + p.b, 0) / n,
  }
}

/**
 * Single-pixel erosion: any pixel with a fully-transparent 4-neighbor gets
 * its alpha cut. Wipes residual halos around anti-aliased edges.
 */
function erode(data, w, h) {
  // Snapshot the alpha channel so we erode based on the original, not the
  // in-progress mutation.
  const alphaSnap = new Uint8ClampedArray(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      alphaSnap[y * w + x] = data[(y * w + x) * 4 + 3]
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      const a = alphaSnap[idx]
      if (a === 0 || a === 255) continue // only touch edges

      let hasTransparentNeighbor = false
      if (x > 0     && alphaSnap[idx - 1]     === 0) hasTransparentNeighbor = true
      if (x < w - 1 && alphaSnap[idx + 1]     === 0) hasTransparentNeighbor = true
      if (y > 0     && alphaSnap[idx - w]     === 0) hasTransparentNeighbor = true
      if (y < h - 1 && alphaSnap[idx + w]     === 0) hasTransparentNeighbor = true

      if (hasTransparentNeighbor) {
        data[idx * 4 + 3] = Math.round(a * 0.6)
      }
    }
  }
}
