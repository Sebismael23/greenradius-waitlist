# GreenRadius Waitlist Landing Page

A modern, component-based landing page for collecting waitlist signups before the full GreenRadius app launches.

## 🚀 Quick Start

### Local Development

```bash
# Start a simple HTTP server (components require it)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

**Note:** Opening `index.html` directly won't work because components are loaded via fetch, which requires an HTTP server.

### Deploy to Vercel

```bash
vercel
```

## 📁 Structure

```
greenradius-waitlist/
├── index.html           # Main landing page
├── about.html           # About page
├── features.html        # Features page
├── components/          # Reusable HTML components
│   ├── navbar.html      # Navigation bar
│   ├── footer.html      # Footer section
│   ├── cta-section.html # Call-to-action section
│   ├── waitlist-modal.html # Waitlist signup modal
│   └── notification.html # Social proof notification
├── js/
│   ├── components.js    # Component loader system
│   └── main.js          # Main JavaScript (modal, forms, etc.)
├── api/                 # Vercel serverless functions
│   ├── subscribe.js     # Mailchimp subscription endpoint
│   └── recent-subscribers.js # Social proof data
├── css/
│   └── styles.css       # Additional styles
└── images/
    └── green-logo.png
```

## ✨ Features

- **Component System** - Reusable HTML components loaded via JavaScript
- **Waitlist Modal** - Beautiful signup modal with full form
- **Mailchimp Integration** - Direct integration with Mailchimp API
- **Social Proof** - Shows recent signups from real data
- **FAQ Section** - Expandable FAQ with smooth animations
- **Mobile Responsive** - Works beautifully on all devices
- **Animations** - Smooth, engaging micro-interactions
- **Meta Pixel** - Facebook/Meta tracking integration
- **No Build Step** - Pure HTML + Tailwind CDN

## 🔧 Configuration

### Environment Variables (Vercel)

Set these in your Vercel project settings:

```
MAILCHIMP_API_KEY=your-api-key-here
MAILCHIMP_LIST_ID=your-list-id-here
MAILCHIMP_SERVER_PREFIX=us21  # or your server prefix
```

See `MAILCHIMP_SETUP.md` for detailed setup instructions.

### Meta Pixel

The Meta Pixel is already integrated. Update the Pixel ID in the `<head>` section of each page if needed:

```javascript
fbq('init', 'YOUR_PIXEL_ID');
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

The API endpoints in `/api` will automatically become serverless functions.

### Other Platforms

For Netlify or other platforms, you'll need to:
1. Create equivalent serverless functions
2. Update the API endpoints in `main.js` if paths differ

## 📊 Analytics

Meta Pixel is pre-configured. Events tracked:
- `PageView` - On every page load
- `Lead` - When someone joins the waitlist

## 🧩 Component System

Components are loaded using `data-component` attributes:

```html
<!-- Load the navbar component -->
<div data-component="navbar"></div>

<!-- Load the footer component -->
<div data-component="footer"></div>
```

The `components.js` file handles:
- Loading components via fetch
- Caching loaded components
- Setting active navigation states
- Initializing mobile menu after load

## 📝 Development

### Adding a New Page

1. Create a new HTML file (copy structure from `about.html`)
2. Add components using `data-component` attributes
3. Include the scripts at the bottom:
   ```html
   <script src="js/components.js"></script>
   <script src="js/main.js"></script>
   ```

### Modifying Components

Edit files in the `/components` directory. Changes will reflect on all pages.

## 📝 License

MIT - Use freely for your projects!
