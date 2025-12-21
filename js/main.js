/**
 * GreenRadius Main JavaScript
 * ============================
 * Shared functionality across all pages.
 * Include this file at the end of <body> on every page.
 */

// ===========================================
// MOBILE MENU
// ===========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

// ===========================================
// WAITLIST MODAL
// ===========================================
function initWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('close-modal');
  const joinButtons = document.querySelectorAll('.join-waitlist-btn');
  
  if (!modal) return;
  
  function openModal(prefilledEmail = '') {
    // Track button click
    if (typeof trackButtonClick === 'function') {
      trackButtonClick('open_waitlist_modal');
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Prefill email if provided
    const emailInput = document.getElementById('modal-email');
    if (emailInput && prefilledEmail) {
      emailInput.value = prefilledEmail;
    }
    
    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"])');
      if (firstInput) firstInput.focus();
    }, 100);
  }
  
  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  
  // Open modal from buttons
  joinButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Check if there's an associated email input
      const emailInputId = this.dataset.emailInput;
      let email = '';
      if (emailInputId) {
        const emailInput = document.getElementById(emailInputId);
        if (emailInput) email = emailInput.value;
      }
      
      openModal(email);
    });
  });
  
  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  // Expose functions globally
  window.openWaitlistModal = openModal;
  window.closeWaitlistModal = closeModal;
}

// ===========================================
// WAITLIST FORM SUBMISSION
// ===========================================
function initWaitlistForm() {
  const form = document.getElementById('modal-waitlist-form');
  const formMessage = document.getElementById('modal-form-message');
  const modalTitle = document.getElementById('modal-title');
  
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="animate-pulse">Joining...</span>';
    submitBtn.disabled = true;
    
    // Gather form data
    const formData = {
      first_name: document.getElementById('modal-first-name')?.value || '',
      last_name: document.getElementById('modal-last-name')?.value || '',
      email_address: document.getElementById('modal-email')?.value || '',
      city: document.getElementById('modal-city')?.value || '',
      state: document.getElementById('modal-state')?.value || '',
      company: document.getElementById('modal-company')?.value || '',
      comment: document.getElementById('modal-comment')?.value || ''
    };
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update modal to success state
        if (modalTitle) {
          modalTitle.textContent = "You're In! 🎉";
        }
        
        form.classList.add('hidden');
        if (formMessage) {
          formMessage.classList.remove('hidden');
          formMessage.innerHTML = `
            <div class="text-center py-4">
              <div class="text-4xl mb-2">✅</div>
              <p class="text-lg font-semibold text-emerald-600">You've joined the waitlist!</p>
              <p class="text-sm text-gray-600 mt-2">We'll notify you when GreenRadius launches in your area. Check your inbox for a confirmation email.</p>
            </div>
          `;
        }
        
        // 🎯 FIRE META PIXEL LEAD EVENT
        if (typeof trackLead === 'function') {
          trackLead('modal_form');
          console.log('[Form] Lead event fired successfully');
        } else {
          console.warn('[Form] trackLead function not available');
        }
        
        // Refresh subscriber data
        if (typeof fetchRecentSubscribers === 'function') {
          fetchRecentSubscribers();
        }
        
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
      
    } catch (error) {
      console.error('[Form] Submission error:', error);
      
      if (formMessage) {
        formMessage.classList.remove('hidden');
        formMessage.innerHTML = `
          <p class="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
        `;
      }
      
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===========================================
// SIMPLE EMAIL FORM (for features/about pages)
// ===========================================
function initSimpleEmailForms() {
  const forms = document.querySelectorAll('[data-waitlist-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      if (!emailInput || !emailInput.value) return;
      
      // Show loading state
      submitBtn.innerHTML = '<span class="animate-pulse">Joining...</span>';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email_address: emailInput.value })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Replace form with success message
          form.innerHTML = `
            <div class="text-center py-4">
              <div class="text-4xl mb-2">🎉</div>
              <p class="text-lg font-semibold">You're on the list!</p>
              <p class="text-sm opacity-75">Check your email for confirmation.</p>
            </div>
          `;
          
          // 🎯 FIRE META PIXEL LEAD EVENT
          if (typeof trackLead === 'function') {
            const formSource = form.dataset.waitlistForm || 'email_form';
            trackLead(formSource);
          }
          
        } else {
          throw new Error(data.error || 'Failed');
        }
        
      } catch (error) {
        console.error('[Form] Error:', error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    });
  });
}

// ===========================================
// SOCIAL PROOF NOTIFICATIONS
// ===========================================
let recentSubscribers = [];
let currentNotificationIndex = 0;

async function fetchRecentSubscribers() {
  try {
    const response = await fetch('/api/recent-subscribers');
    const data = await response.json();
    
    if (data.subscribers && data.subscribers.length > 0) {
      recentSubscribers = data.subscribers;
    }
    
    // Update waitlist count
    if (data.totalCount) {
      updateWaitlistCount(data.totalCount);
    }
    
  } catch (error) {
    console.log('[Notifications] Could not fetch subscribers:', error.message);
  }
}

function updateWaitlistCount(count) {
  const countEl = document.getElementById('waitlist-count');
  const footerCountEl = document.getElementById('footer-count');
  
  if (countEl) countEl.textContent = count + ' people';
  if (footerCountEl) footerCountEl.textContent = count;
}

function getTimeAgo(timestamp) {
  if (!timestamp) return 'recently';
  
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return 'recently';
}

function showNotification() {
  const notification = document.getElementById('notification');
  const locationEl = document.getElementById('notification-location');
  const messageEl = document.getElementById('notification-message');
  
  if (!notification || !locationEl || !messageEl) return;
  
  if (recentSubscribers.length > 0) {
    const subscriber = recentSubscribers[currentNotificationIndex];
    
    // Build location string
    const city = subscriber.city?.trim() || '';
    const state = subscriber.state?.trim() || '';
    let location = '';
    
    if (city && state) {
      location = `${city}, ${state}`;
    } else if (city) {
      location = city;
    } else if (state) {
      location = state;
    } else if (subscriber.location?.trim()) {
      location = subscriber.location.trim();
    }
    
    const timeAgo = getTimeAgo(subscriber.timestamp);
    
    locationEl.textContent = location ? `Someone from ${location}` : 'Someone';
    messageEl.textContent = `joined the waitlist${timeAgo ? ' ' + timeAgo : ''}! 🎉`;
    
    // Cycle through subscribers
    currentNotificationIndex = (currentNotificationIndex + 1) % recentSubscribers.length;
    
  } else {
    locationEl.textContent = 'Someone';
    messageEl.textContent = 'joined the waitlist recently! 🎉';
  }
  
  notification.classList.remove('hidden');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 5000);
}

function initNotifications() {
  // Fetch subscriber data
  fetchRecentSubscribers();
  
  // Show first notification after 5 seconds
  setTimeout(() => {
    showNotification();
  }, 5000);
  
  // Show notifications periodically
  setInterval(() => {
    showNotification();
  }, 60000);
}

// ===========================================
// FAQ TOGGLE
// ===========================================
function toggleFaq(index) {
  const content = document.getElementById('faq-content-' + index);
  const icon = document.getElementById('faq-icon-' + index);
  
  if (content && icon) {
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      icon.textContent = '−';
    } else {
      content.classList.add('hidden');
      icon.textContent = '+';
    }
  }
}

// Expose FAQ toggle globally
window.toggleFaq = toggleFaq;

// ===========================================
// TAB FUNCTIONALITY
// ===========================================
function setActiveTab(tabId) {
  // Hide all content
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  
  // Show selected content
  const content = document.getElementById('content-' + tabId);
  if (content) content.classList.remove('hidden');
  
  // Update button styles
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600', 'text-white');
    btn.classList.add('text-gray-600');
  });
  
  const activeTab = document.getElementById('tab-' + tabId);
  if (activeTab) {
    activeTab.classList.add('bg-emerald-600', 'text-white');
    activeTab.classList.remove('text-gray-600');
  }
}

// Expose globally
window.setActiveTab = setActiveTab;

// ===========================================
// SMOOTH SCROLL
// ===========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
      }
    });
  });
}

// ===========================================
// INITIALIZE EVERYTHING
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Main] Initializing GreenRadius...');
  
  initMobileMenu();
  initWaitlistModal();
  initWaitlistForm();
  initSimpleEmailForms();
  initSmoothScroll();
  
  // Only init notifications on homepage
  if (document.getElementById('notification')) {
    initNotifications();
  }
  
  console.log('[Main] GreenRadius initialized.');
});

// Expose fetch function for manual refresh
window.fetchRecentSubscribers = fetchRecentSubscribers;
