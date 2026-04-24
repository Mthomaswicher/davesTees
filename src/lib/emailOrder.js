import emailjs from '@emailjs/browser'

// ─── EmailJS credentials ────────────────────────────────────────────────────
// Sign up free at https://emailjs.com, then:
//  1. Add a service (Gmail, AOL, etc.) → copy the Service ID
//  2. Create a template (see README or ask Dave) → copy the Template ID
//  3. Account → API Keys → copy the Public Key
export const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
export const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
export const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

// Resize & compress the design image before embedding in email (max 600px wide, 70% JPEG)
function compressImage(dataUrl, maxWidth = 600) {
  return new Promise((resolve) => {
    if (!dataUrl) return resolve('')
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => resolve('')
    img.src = dataUrl
  })
}

export async function sendOrder({ form, design }) {
  const designImage = await compressImage(design.imageSrc)

  const colorNames = {
    '#fbf8f3': 'Bone', '#e8ddc9': 'Sand', '#ff5a3c': 'Sunset',
    '#ffb199': 'Coral', '#0aa39a': 'Teal', '#1b3b5f': 'Navy',
    '#6b7a3b': 'Olive', '#2b2f38': 'Charcoal', '#0b0f17': 'Black',
  }
  const colorLabel = colorNames[design.color.toLowerCase()] ?? design.color.toUpperCase()

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:     'dvvr2@aol.com',
      from_name:    form.name,
      from_email:   form.email,
      phone:        form.phone || 'Not provided',
      order_type:   form.type,
      quantity:     form.qty,
      details:      form.details,
      shirt_color:  colorLabel,
      shirt_size:   design.size,
      shirt_qty:    String(design.qty),
      price_total:  `$${design.total}`,
      price_each:   `$${design.priceEach}/shirt`,
      design_image: designImage,
    },
    EMAILJS_PUBLIC_KEY
  )
}
