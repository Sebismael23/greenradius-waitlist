/**
 * GreenRadius Analytics & Meta Pixel
 * ===================================
 * Include this file in <head> of all pages.
 */

// Debug mode - set to false for production
const ANALYTICS_DEBUG = true;

// Meta Pixel ID
const META_PIXEL_ID = '1869362300613991';

// Initialize Meta Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', META_PIXEL_ID);
fbq('track', 'PageView');

if (ANALYTICS_DEBUG) {
  console.log('[Analytics] Meta Pixel initialized:', META_PIXEL_ID);
  console.log('[Analytics] PageView tracked');
}

/**
 * Track a custom event
 * @param {string} eventName - Event name (e.g., 'Lead', 'CompleteRegistration')
 * @param {object} params - Optional parameters
 */
function trackEvent(eventName, params = {}) {
  if (typeof fbq === 'function') {
    fbq('track', eventName, params);
    if (ANALYTICS_DEBUG) {
      console.log(`[Analytics] Event tracked: ${eventName}`, params);
    }
  } else {
    console.warn('[Analytics] fbq not available');
  }
}

/**
 * Track a Lead event (waitlist signup)
 * @param {string} source - Where the lead came from
 */
function trackLead(source = 'unknown') {
  trackEvent('Lead', { 
    content_name: 'Waitlist Signup',
    content_category: 'Signup',
    source: source
  });
}

/**
 * Track a custom event
 * @param {string} eventName - Custom event name
 * @param {object} params - Event parameters
 */
function trackCustomEvent(eventName, params = {}) {
  if (typeof fbq === 'function') {
    fbq('trackCustom', eventName, params);
    if (ANALYTICS_DEBUG) {
      console.log(`[Analytics] Custom event: ${eventName}`, params);
    }
  }
}

/**
 * Track button clicks
 * @param {string} buttonName - Name/ID of button
 */
function trackButtonClick(buttonName) {
  trackCustomEvent('ButtonClick', { button: buttonName });
}

/**
 * Debug: Check if pixel is working
 */
function checkPixelStatus() {
  if (typeof fbq === 'function') {
    console.log('[Analytics] ✅ Meta Pixel is loaded');
    console.log('[Analytics] Pixel ID:', META_PIXEL_ID);
    return true;
  } else {
    console.log('[Analytics] ❌ Meta Pixel NOT loaded');
    return false;
  }
}

/**
 * Debug: Fire a test Lead event
 */
function testLeadEvent() {
  console.log('[Analytics] Firing test Lead event...');
  trackLead('console_test');
  console.log('[Analytics] Check Meta Pixel Helper or Events Manager');
}

// Track scroll depth
let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };

window.addEventListener('scroll', function() {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  
  [25, 50, 75, 100].forEach(depth => {
    if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
      scrollDepthTracked[depth] = true;
      trackCustomEvent('ScrollDepth', { depth: depth });
    }
  });
});

// Expose functions globally
window.trackEvent = trackEvent;
window.trackLead = trackLead;
window.trackCustomEvent = trackCustomEvent;
window.trackButtonClick = trackButtonClick;
window.checkPixelStatus = checkPixelStatus;
window.testLeadEvent = testLeadEvent;
