/**
 * GreenRadius Main JavaScript
 * ============================
 * Handles: Modal, Forms, Notifications, FAQ, Tabs, etc.
 * Include this file at the end of <body>.
 */

document.addEventListener('DOMContentLoaded', function() {
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
  initWaitlistForms();
  initSimpleEmailForms();
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
    menuBtn.addEventListener('click', function() {
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
  
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('close-modal');
  const modalContent = document.getElementById('modal-content');
  const modalForm = document.getElementById('modal-waitlist-form');
  const emailInput = document.getElementById('modal-email');
  
  // Open modal function
  window.openWaitlistModal = function(prefillEmail = '') {
    console.log('[Main] Opening modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
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
  window.closeWaitlistModal = function() {
    console.log('[Main] Closing modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };
  
  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', closeWaitlistModal);
  }
  
  // Close on X button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWaitlistModal);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeWaitlistModal();
    }
  });
  
  // Prevent close when clicking inside modal content
  if (modalContent) {
    modalContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Handle modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', handleModalFormSubmit);
  }
  
  // Attach click handlers to all "Join Waitlist" buttons
  document.querySelectorAll('.join-waitlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
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
  
  // Get form data
  const formData = {
    email: document.getElementById('modal-email')?.value || '',
    firstName: document.getElementById('modal-first-name')?.value || '',
    lastName: document.getElementById('modal-last-name')?.value || '',
    city: document.getElementById('modal-city')?.value || '',
    state: document.getElementById('modal-state')?.value || '',
    company: document.getElementById('modal-company')?.value || '',
    comment: document.getElementById('modal-comment')?.value || ''
  };
  
  // Validate
  if (!formData.email || !formData.firstName) {
    showFormMessage(messageDiv, 'Please fill in required fields.', 'error');
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="animate-pulse">Joining...</span>';
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: formData.email,
        merge_fields: {
          FNAME: formData.firstName,
          LNAME: formData.lastName,
          CITY: formData.city,
          STATE: formData.state,
          COMPANY: formData.company,
          COMMENT: formData.comment
        }
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Track Lead event
      if (typeof trackLead === 'function') {
        trackLead('modal_form');
      }
      
      // Show success
      form.innerHTML = `
        <div class="text-center py-8">
          <div class="text-6xl mb-4 success-checkmark">✅</div>
          <h3 class="text-2xl font-bold text-emerald-600 mb-2">You're on the list!</h3>
          <p class="text-gray-600 mb-4">Thanks for joining, ${formData.firstName}!</p>
          <p class="text-sm text-gray-500">Check your email for confirmation.</p>
        </div>
      `;
      
      // Close modal after 3 seconds
      setTimeout(closeWaitlistModal, 3000);
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

// ==================== SIMPLE WAITLIST FORMS ====================
function initWaitlistForms() {
  // Handle forms with data-waitlist-form attribute
  document.querySelectorAll('form[data-waitlist-form]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formSource = form.dataset.waitlistForm || 'unknown';
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (!emailInput || !emailInput.value) {
        alert('Please enter your email address.');
        return;
      }
      
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="animate-pulse">Joining...</span>';
      
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_address: emailInput.value,
            merge_fields: {}
          })
        });
        
        if (response.ok) {
          if (typeof trackLead === 'function') {
            trackLead(formSource);
          }
          
          form.innerHTML = `
            <div class="text-center py-4">
              <div class="text-4xl mb-2">🎉</div>
              <p class="text-lg font-semibold">You're on the list!</p>
              <p class="text-sm opacity-75">Check your email for confirmation.</p>
            </div>
          `;
        } else {
          throw new Error('Failed to subscribe');
        }
      } catch (error) {
        console.error('[Main] Simple form error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Something went wrong. Please try again.');
      }
    });
  });
}

// ==================== SIMPLE EMAIL FORMS ====================
function initSimpleEmailForms() {
  // Handle simple inline email forms that open the modal
  document.querySelectorAll('form[data-open-modal]').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';
      openWaitlistModal(email);
    });
  });
}

// ==================== FAQ TOGGLE ====================
function initFAQ() {
  // Make toggleFaq available globally
  window.toggleFaq = function(id) {
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
  window.setActiveTab = function(tabName) {
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
    anchor.addEventListener('click', function(e) {
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
function initSocialProof() {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  const locationSpan = document.getElementById('notification-location');
  const messageSpan = document.getElementById('notification-message');
  
  // Sample data (will be replaced with real API data)
  const sampleNotifications = [
    { location: 'Someone in Salt Lake City', time: '2 minutes ago' },
    { location: 'Someone in Provo', time: '5 minutes ago' },
    { location: 'Someone in Park City', time: '12 minutes ago' },
    { location: 'Someone in Ogden', time: '18 minutes ago' }
  ];
  
  let notificationIndex = 0;
  
  function showNotification() {
    const data = sampleNotifications[notificationIndex];
    
    if (locationSpan) locationSpan.textContent = data.location;
    if (messageSpan) messageSpan.textContent = `joined the waitlist ${data.time}`;
    
    notification.classList.remove('hidden');
    notification.style.animation = 'slide-in 0.5s ease-out';
    
    // Hide after 5 seconds
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 5000);
    
    notificationIndex = (notificationIndex + 1) % sampleNotifications.length;
  }
  
  // Show first notification after 8 seconds
  setTimeout(showNotification, 8000);
  
  // Then show every 30 seconds
  setInterval(showNotification, 30000);
  
  // Try to fetch real data
  fetchRecentSubscribers();
}

async function fetchRecentSubscribers() {
  try {
    const response = await fetch('/api/recent-subscribers');
    if (response.ok) {
      const data = await response.json();
      if (data.subscribers && data.subscribers.length > 0) {
        console.log('[Main] Got real subscriber data');
        // Could update notification system with real data here
      }
    }
  } catch (error) {
    // Silently fail, will use sample data
  }
}
