/**
 * GreenRadius Analytics & Meta Pixel
 * ===================================
 * This file handles all tracking functionality.
 * Include this file in the <head> of every page.
 */

// ===========================================
// META PIXEL CONFIGURATION
// ===========================================
const META_PIXEL_ID = '1869362300613991';

// Debug mode - set to true to see console logs
const ANALYTICS_DEBUG = true;

// ===========================================
// META PIXEL INITIALIZATION
// ===========================================
(function() {
  // Check if pixel already loaded
  if (window.fbq) {
    if (ANALYTICS_DEBUG) console.log('[Analytics] Pixel already loaded');
    return;
  }

  // Create fbq function
  var n = window.fbq = function() {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  // Load the Facebook pixel script
  var t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(t, s);

  if (ANALYTICS_DEBUG) console.log('[Analytics] Meta Pixel script loading...');
})();

// Initialize pixel with your ID
fbq('init', META_PIXEL_ID);
if (ANALYTICS_DEBUG) console.log('[Analytics] Pixel initialized with ID:', META_PIXEL_ID);

// Track page view
fbq('track', 'PageView');
if (ANALYTICS_DEBUG) console.log('[Analytics] PageView tracked');

// ===========================================
// TRACKING HELPER FUNCTIONS
// ===========================================

/**
 * Track a Meta Pixel event
 * @param {string} eventName - The event name (e.g., 'Lead', 'CompleteRegistration')
 * @param {object} params - Optional parameters for the event
 */
function trackEvent(eventName, params = {}) {
  if (typeof fbq === 'function') {
    fbq('track', eventName, params);
    if (ANALYTICS_DEBUG) {
      console.log('[Analytics] Event tracked:', eventName, params);
    }
    return true;
  } else {
    if (ANALYTICS_DEBUG) {
      console.warn('[Analytics] fbq not available. Event not tracked:', eventName);
    }
    return false;
  }
}

/**
 * Track a custom event (for custom conversions)
 * @param {string} eventName - Custom event name
 * @param {object} params - Optional parameters
 */
function trackCustomEvent(eventName, params = {}) {
  if (typeof fbq === 'function') {
    fbq('trackCustom', eventName, params);
    if (ANALYTICS_DEBUG) {
      console.log('[Analytics] Custom event tracked:', eventName, params);
    }
    return true;
  }
  return false;
}

/**
 * Track a Lead event (for waitlist signups)
 * @param {string} source - Where the signup came from (e.g., 'hero', 'footer', 'modal')
 */
function trackLead(source = 'unknown') {
  return trackEvent('Lead', {
    content_name: 'Waitlist Signup',
    content_category: 'signup',
    source: source
  });
}

/**
 * Track button clicks
 * @param {string} buttonName - Name of the button clicked
 */
function trackButtonClick(buttonName) {
  return trackCustomEvent('ButtonClick', {
    button_name: buttonName
  });
}

/**
 * Track page scroll depth
 * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
 */
function trackScrollDepth(percentage) {
  return trackCustomEvent('ScrollDepth', {
    depth: percentage
  });
}

// ===========================================
// AUTOMATIC SCROLL TRACKING
// ===========================================
(function() {
  var scrollMarkers = [25, 50, 75, 100];
  var trackedMarkers = [];

  function checkScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrollPercent = Math.round((scrollTop / docHeight) * 100);

    scrollMarkers.forEach(function(marker) {
      if (scrollPercent >= marker && trackedMarkers.indexOf(marker) === -1) {
        trackedMarkers.push(marker);
        trackScrollDepth(marker);
      }
    });
  }

  // Throttle scroll events
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(function() {
      scrollTimeout = null;
      checkScroll();
    }, 250);
  });
})();

// ===========================================
// DEBUG UTILITIES
// ===========================================

/**
 * Check if Meta Pixel is working
 * Call this from browser console: checkPixelStatus()
 */
function checkPixelStatus() {
  console.log('=== Meta Pixel Status ===');
  console.log('fbq available:', typeof fbq === 'function');
  console.log('Pixel ID:', META_PIXEL_ID);
  
  if (typeof fbq === 'function' && fbq.getState) {
    console.log('Pixel state:', fbq.getState());
  }
  
  // Check if pixel helper extension detected
  if (window._fbq_pixel_helper) {
    console.log('Pixel Helper detected: Yes');
  }
  
  console.log('========================');
  console.log('To test Lead tracking, run: testLeadEvent()');
}

/**
 * Test firing a Lead event
 * Call from console: testLeadEvent()
 */
function testLeadEvent() {
  console.log('Firing test Lead event...');
  var success = trackLead('console_test');
  if (success) {
    console.log('✅ Lead event fired! Check Meta Events Manager or Pixel Helper.');
  } else {
    console.log('❌ Lead event failed. Pixel may not be loaded.');
  }
}

// Make debug functions available globally
window.checkPixelStatus = checkPixelStatus;
window.testLeadEvent = testLeadEvent;
window.trackEvent = trackEvent;
window.trackLead = trackLead;
window.trackButtonClick = trackButtonClick;

// Log helpful message on load
if (ANALYTICS_DEBUG) {
  console.log('[Analytics] GreenRadius Analytics loaded. Run checkPixelStatus() to verify pixel.');
}
