/**
 * GreenRadius Component Loader
 * ============================
 * Loads shared HTML components to avoid code repetition.
 * Include this file AFTER the DOM is ready or at the end of <body>.
 */

const ComponentLoader = {
  // Cache for loaded components
  cache: {},
  
  /**
   * Load a component from the components directory
   * @param {string} name - Component name (without .html)
   * @returns {Promise<string>} - HTML content
   */
  async load(name) {
    // Return cached version if available
    if (this.cache[name]) {
      return this.cache[name];
    }
    
    try {
      const response = await fetch(`/components/${name}.html`);
      if (!response.ok) {
        throw new Error(`Component not found: ${name}`);
      }
      const html = await response.text();
      this.cache[name] = html;
      return html;
    } catch (error) {
      console.error(`[Components] Failed to load ${name}:`, error);
      return '';
    }
  },
  
  /**
   * Insert a component into a target element
   * @param {string} name - Component name
   * @param {string|Element} target - CSS selector or element
   * @param {string} position - 'replace', 'prepend', 'append' (default: 'replace')
   */
  async insert(name, target, position = 'replace') {
    const html = await this.load(name);
    if (!html) return;
    
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (!element) {
      console.warn(`[Components] Target not found: ${target}`);
      return;
    }
    
    switch (position) {
      case 'prepend':
        element.insertAdjacentHTML('afterbegin', html);
        break;
      case 'append':
        element.insertAdjacentHTML('beforeend', html);
        break;
      case 'replace':
      default:
        element.innerHTML = html;
        break;
    }
    
    console.log(`[Components] Loaded: ${name}`);
  },
  
  /**
   * Initialize all components marked with data-component attribute
   * Usage: <div data-component="navbar"></div>
   */
  async initAll() {
    const elements = document.querySelectorAll('[data-component]');
    
    if (elements.length === 0) {
      console.log('[Components] No components to load');
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
      return;
    }
    
    const promises = Array.from(elements).map(async (el) => {
      const componentName = el.dataset.component;
      const position = el.dataset.position || 'replace';
      await this.insert(componentName, el, position);
    });
    
    await Promise.all(promises);
    
    // After all components are loaded, run post-init
    this.postInit();
  },
  
  /**
   * Run after all components are loaded
   * Handles things like active nav states, re-initializing event listeners
   */
  postInit() {
    // Set active nav link based on current page
    this.setActiveNavLink();
    
    // Re-initialize mobile menu after navbar is loaded
    this.initMobileMenu();
    
    // Dispatch event for other scripts
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
    
    console.log('[Components] All components initialized');
  },
  
  /**
   * Set active state on navigation links based on current page
   */
  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '');
    
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPage = link.dataset.page;
      if (linkPage === pageName || (pageName === 'index' && !linkPage)) {
        link.classList.add('active', 'text-emerald-600', 'font-medium');
        link.classList.remove('text-gray-700');
      }
    });
  },
  
  /**
   * Initialize mobile menu toggle
   */
  initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
      // Remove existing listeners by cloning
      const newBtn = menuBtn.cloneNode(true);
      menuBtn.parentNode.replaceChild(newBtn, menuBtn);
      
      newBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ComponentLoader.initAll());
} else {
  ComponentLoader.initAll();
}

// Expose globally
window.ComponentLoader = ComponentLoader;
