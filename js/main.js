/**
 * GreenRadius Main JavaScript
 * ============================
 * Handles: Modal, Forms, Notifications, FAQ, Tabs, etc.
 * Include this file at the end of <body>.
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('[Main] Initializing...');

  // Wait for components to load before initializing
  document.addEventListener('componentsLoaded', initAfterComponents);

  // Also try to init immediately for pages without components
  setTimeout(initAll, 100);
});

function initAfterComponents() {
  console.log('[Main] Components loaded, initializing...');
  initAll();
}

function initAll() {
  initMobileMenu();
  initWaitlistModal();
  initFAQ();
  initTabs();
  initSmoothScroll();
  initSocialProof();
  console.log('[Main] All initialized');
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ==================== WAITLIST MODAL ====================
function initWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  if (!modal) {
    console.log('[Main] Modal not found, skipping modal init');
    return;
  }

  const closeBtn = document.getElementById('close-modal');
  const modalContent = modal.querySelector('.bg-white'); // The white content box
  const modalForm = document.getElementById('modal-waitlist-form');
  const emailInput = document.getElementById('modal-email');

  // Open modal function
  window.openWaitlistModal = function (prefillEmail = '') {
    console.log('[Main] Opening modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset form state
    if (modalForm) {
      modalForm.classList.remove('hidden');
      modalForm.reset();
    }

    // Reset any previous messages
    const messageDiv = document.getElementById('modal-form-message');
    if (messageDiv) {
      messageDiv.classList.add('hidden');
      messageDiv.innerHTML = '';
    }

    // Reset modal title
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
      modalTitle.textContent = 'Join the Waitlist';
    }

    if (prefillEmail && emailInput) {
      emailInput.value = prefillEmail;
    }

    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="hidden"])');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  // Close modal function
  window.closeWaitlistModal = function () {
    console.log('[Main] Closing modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Close on backdrop click (clicking the modal overlay itself)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeWaitlistModal();
    }
  });

  // Close on X button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWaitlistModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeWaitlistModal();
    }
  });

  // Prevent close when clicking inside modal content
  if (modalContent) {
    modalContent.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // Handle modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', handleModalFormSubmit);
  }

  // Attach click handlers to all "Join Waitlist" buttons
  document.querySelectorAll('.join-waitlist-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      // Check if there's a linked email input to prefill
      const emailInputId = btn.dataset.emailInput;
      let prefillEmail = '';

      if (emailInputId) {
        const linkedInput = document.getElementById(emailInputId);
        if (linkedInput && linkedInput.value) {
          prefillEmail = linkedInput.value;
        }
      }

      openWaitlistModal(prefillEmail);
    });
  });

  console.log('[Main] Modal initialized');
}

async function handleModalFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  const messageDiv = document.getElementById('modal-form-message');

  // Get form data - standardized format for Mailchimp API
  const formData = {
    email_address: document.getElementById('modal-email')?.value || '',
    merge_fields: {
      FNAME: document.getElementById('modal-first-name')?.value || '',
      LNAME: document.getElementById('modal-last-name')?.value || '',
      CITY: document.getElementById('modal-city')?.value || '',
      STATE: document.getElementById('modal-state')?.value || '',
      COMPANY: document.getElementById('modal-company')?.value || '',
      COMMENT: document.getElementById('modal-comment')?.value || ''
    }
  };

  const firstName = formData.merge_fields.FNAME;

  // Validate
  if (!formData.email_address || !firstName) {
    showFormMessage(messageDiv, 'Please fill in required fields (First Name and Email).', 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="animate-pulse">Joining...</span>';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Track Lead event with Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: 'Waitlist Signup',
          content_category: 'signup'
        });
      }

      // Update modal title
      const modalTitle = document.getElementById('modal-title');
      if (modalTitle) {
        modalTitle.textContent = "You're In! 🎉";
      }

      // Show success
      form.classList.add('hidden');
      if (messageDiv) {
        messageDiv.classList.remove('hidden');
        messageDiv.innerHTML = `
          <div class="text-center py-8">
            <div class="text-6xl mb-4 success-checkmark">✅</div>
            <h3 class="text-2xl font-bold text-emerald-600 mb-2">You're on the list!</h3>
            <p class="text-gray-600 mb-4">Thanks for joining${firstName ? ', ' + firstName : ''}!</p>
            <p class="text-sm text-gray-500">Check your email for confirmation.</p>
          </div>
        `;
      }

      // Refresh subscriber notifications
      fetchRecentSubscribers();

      // Close modal after 4 seconds
      setTimeout(closeWaitlistModal, 4000);
    } else {
      throw new Error(result.error || 'Subscription failed');
    }
  } catch (error) {
    console.error('[Main] Form submission error:', error);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    showFormMessage(messageDiv, error.message || 'Something went wrong. Please try again.', 'error');
  }
}

function showFormMessage(container, message, type) {
  if (!container) return;

  container.className = type === 'error'
    ? 'mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm'
    : 'mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm';
  container.textContent = message;
  container.classList.remove('hidden');
}

// ==================== FAQ TOGGLE ====================
function initFAQ() {
  // Make toggleFaq available globally
  window.toggleFaq = function (id) {
    const content = document.getElementById(`faq-content-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);

    if (content && icon) {
      content.classList.toggle('hidden');
      icon.textContent = content.classList.contains('hidden') ? '+' : '−';
    }
  };
}

// ==================== TABS ====================
function initTabs() {
  // Make setActiveTab available globally
  window.setActiveTab = function (tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });

    // Reset all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('bg-emerald-600', 'text-white');
      btn.classList.add('text-gray-600');
    });

    // Show selected content
    const selectedContent = document.getElementById(`content-${tabName}`);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }

    // Activate selected tab
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
      selectedTab.classList.remove('text-gray-600');
      selectedTab.classList.add('bg-emerald-600', 'text-white');
    }
  };
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==================== SOCIAL PROOF NOTIFICATIONS ====================
let recentSubscribers = [];
let currentNotificationIndex = 0;

function initSocialProof() {
  const notification = document.getElementById('notification');
  if (!notification) return;

  // Fetch real subscriber data
  fetchRecentSubscribers();

  // Show first notification after 8 seconds
  setTimeout(showNotification, 8000);

  // Then show every 45 seconds
  setInterval(showNotification, 45000);
}

async function fetchRecentSubscribers() {
  try {
    const response = await fetch('/api/recent-subscribers');
    if (response.ok) {
      const data = await response.json();
      if (data.subscribers && data.subscribers.length > 0) {
        recentSubscribers = data.subscribers;
        console.log('[Main] Got real subscriber data:', recentSubscribers.length, 'subscribers');
      }
    }
  } catch (error) {
    console.log('[Main] Could not fetch subscribers, using fallback');
  }
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
    // Fallback when no subscriber data available
    locationEl.textContent = 'Someone';
    messageEl.textContent = 'joined the waitlist recently! 🎉';
  }

  notification.classList.remove('hidden');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 5000);
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
