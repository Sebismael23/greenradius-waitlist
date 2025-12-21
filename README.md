# GreenRadius Waitlist Landing Page

A polished, component-based landing page for collecting waitlist signups with Meta Pixel tracking.

## 📁 Project Structure

```
greenradius-waitlist/
├── index.html              # Main landing page
├── features.html           # Features page
├── about.html              # About page
├── components/             # Reusable HTML components
│   ├── navbar.html         # Navigation bar
│   ├── footer.html         # Footer
│   ├── waitlist-modal.html # Signup modal
│   ├── notification.html   # Social proof popup
│   └── cta-section.html    # Call-to-action section
├── css/
│   └── styles.css          # Shared styles & animations
├── js/
│   ├── analytics.js        # Meta Pixel + tracking (load in <head>)
│   ├── components.js       # Component loader
│   └── main.js             # Shared functionality (load at end of <body>)
├── images/
│   └── green-logo.png      # Logo (add your own)
├── api/                    # Vercel serverless functions
│   ├── subscribe.js        # Mailchimp subscription
│   └── recent-subscribers.js
├── vercel.json             # Vercel configuration
└── README.md
```

## 🧩 Component System

This project uses a simple component system to avoid repeating code. Components are loaded dynamically via JavaScript.

### How It Works

1. Create a placeholder div with `data-component` attribute:
```html
<div data-component="navbar"></div>
```

2. The `components.js` script automatically loads the HTML from `/components/navbar.html`

### Available Components

| Component | File | Description |
|-----------|------|-------------|
| `navbar` | navbar.html | Navigation bar with mobile menu |
| `footer` | footer.html | Footer with links and social |
| `waitlist-modal` | waitlist-modal.html | Signup form modal |
| `notification` | notification.html | Social proof popup |
| `cta-section` | cta-section.html | Call-to-action with form |

### Adding a New Component

1. Create the HTML file in `/components/your-component.html`
2. Use it in any page: `<div data-component="your-component"></div>`
3. That's it!

## 🚀 Quick Start

### Local Development

```bash
# Option 1: Simple HTTP server (Python)
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 2: Vercel CLI (recommended - tests API functions)
npm i -g vercel
vercel dev
# Visit http://localhost:3000
```

### Deploy to Vercel

```bash
vercel
```

## 📊 Meta Pixel Setup

### Your Pixel ID
Your Meta Pixel ID is: `1869362300613991`

### How It Works

1. **analytics.js** loads in the `<head>` of every page
2. **PageView** is tracked automatically on every page load
3. **Lead** event fires when someone submits a waitlist form
4. **Custom events** track scroll depth and button clicks

### Testing the Pixel

#### Step 1: Install Meta Pixel Helper
- Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

#### Step 2: Check PageView
1. Open your deployed site (NOT localhost, NOT file://)
2. Click the Pixel Helper extension icon
3. You should see: ✅ PageView

#### Step 3: Check Lead Event
1. Submit the waitlist form with a test email
2. Check Pixel Helper again
3. You should see: ✅ Lead

#### Step 4: Debug via Console
Open browser console and run:

```javascript
// Check pixel status
checkPixelStatus()

// Test firing a Lead event
testLeadEvent()
```

### Common Issues

| Problem | Solution |
|---------|----------|
| Pixel not firing | Make sure you're on the deployed URL, not localhost or file:// |
| Pixel blocked | Disable ad blockers (uBlock, Brave Shields, etc.) |
| Lead event not firing | Check that form submission succeeded first |
| "fbq not defined" | analytics.js not loading - check network tab |

### Verify in Meta Events Manager

1. Go to [Meta Events Manager](https://www.facebook.com/events_manager)
2. Select your pixel
3. Go to "Test Events" tab
4. Open your site in another tab
5. Events should appear in real-time

## 📧 Email Integration

### Current Setup: Mailchimp

Set these environment variables in Vercel:

```
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER_PREFIX=us21
```

See `MAILCHIMP_SETUP.md` for detailed instructions.

## 🎯 Tracking Events

### Automatic Events
- **PageView** - Every page load
- **ScrollDepth** - At 25%, 50%, 75%, 100% scroll

### Manual Events
- **Lead** - Waitlist form submission
- **ButtonClick** - CTA button clicks

### Using trackEvent

```javascript
// Track a standard event
trackEvent('Lead', {
  content_name: 'Waitlist Signup',
  source: 'homepage'
});

// Track a custom event
trackCustomEvent('ButtonClick', {
  button_name: 'Join Waitlist'
});
```

## 🔧 Customization

### Change Pixel ID

Edit `js/analytics.js`, line 9:
```javascript
const META_PIXEL_ID = 'YOUR_NEW_PIXEL_ID';
```

### Disable Debug Mode

Edit `js/analytics.js`, line 12:
```javascript
const ANALYTICS_DEBUG = false;
```

## 📱 Pages Overview

### index.html (Homepage)
- Hero with waitlist form
- How it works section
- Features grid
- Impact stats
- FAQ
- Final CTA

### features.html
- All features in detail
- Category navigation
- Footer waitlist form

### about.html
- Mission and story
- The problem we solve
- Our approach
- Timeline/roadmap
- Footer waitlist form

## 📝 License

MIT - Use freely for your projects!
