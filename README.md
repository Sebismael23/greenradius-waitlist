# GreenRadius Waitlist Landing Page

A standalone landing page for collecting waitlist signups before the full GreenRadius app launches.

## 🚀 Quick Start

Just open `index.html` in your browser - no build process needed!

```bash
# On macOS
open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Structure

```
greenradius-waitlist/
├── index.html      # Main landing page
├── images/
│   └── green-logo.png
└── README.md
```

## ✨ Features

- **Waitlist signup forms** - Hero section and footer
- **Local storage** - Stores emails locally for demo (replace with your email service)
- **Social proof** - Shows signup count
- **FAQ section** - Common questions answered
- **Mobile responsive** - Works on all devices
- **Animations** - Smooth, engaging interactions
- **No dependencies** - Pure HTML + Tailwind CDN

## 🔧 Customization

### Connect to Email Service

Replace the `handleWaitlistSubmit` function in the `<script>` section with your email service:

**Mailchimp:**
```javascript
// Replace localStorage with Mailchimp API call
fetch('YOUR_MAILCHIMP_ENDPOINT', {
  method: 'POST',
  body: JSON.stringify({ email: email }),
  headers: { 'Content-Type': 'application/json' }
});
```

**ConvertKit:**
```javascript
fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
  method: 'POST',
  body: JSON.stringify({ 
    api_key: 'YOUR_API_KEY',
    email: email 
  }),
  headers: { 'Content-Type': 'application/json' }
});
```

**Supabase:**
```javascript
const { error } = await supabase
  .from('waitlist')
  .insert({ email: email, joined_at: new Date() });
```

### Update Content

- Edit text directly in `index.html`
- Change colors by modifying Tailwind classes (e.g., `emerald-600` to `green-600`)
- Update the base waitlist count (currently 847) in the JavaScript section

## 🌐 Deployment

This is a static site - deploy anywhere:

- **Vercel**: Drag & drop the folder
- **Netlify**: Connect to Git or drag & drop
- **GitHub Pages**: Push to a repo and enable Pages
- **Cloudflare Pages**: Connect to Git

## 📊 Analytics

Add your analytics snippet before `</body>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 📝 License

MIT - Use freely for your projects!
# greenradius-waitlist
