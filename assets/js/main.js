// Capitar Ventures - Interactive States and Animations

document.addEventListener('DOMContentLoaded', () => {
  // Trigger page fade-in
  document.body.classList.add('page-loaded');

  initStickyHeader();
  initMobileMenu();
  initFaqAccordion();
  initFadeUpObserver();
  initContactForm();
  initPortfolioModal();
  initWhyCapitarPipeline();
  initPageTransitions();
});

// 1. Sticky Header scroll styling
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on initial load
}

// 2. Mobile Menu toggle and overlay handling
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (!hamburger || !navMenu) return;

  // Create overlay if not present
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

// 3. FAQ Accordion functionality
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

// 4. Fade Up & Section Intersection Observer
function initFadeUpObserver() {
  const fadeElements = document.querySelectorAll('.fade-up-element, .fade-in-element, .fade-left-element, .fade-right-element');
  const sections = document.querySelectorAll('section');
  if (fadeElements.length === 0 && sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
  sections.forEach(sec => observer.observe(sec));
}

// 5. Contact Form handling (simulate premium toast on submit)
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verify fields are valid (basic check)
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const inquiryType = document.getElementById('form-inquiry-type').value;

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Determine custom message based on routing type
    let successMsg = 'Inquiry received. A managing partner will respond to your registered email shortly.';
    if (inquiryType === 'founder') {
      successMsg = 'Credit Application routing active. A member of our Risk & Underwriting team will contact you within 48 hours.';
    } else if (inquiryType === 'investor') {
      successMsg = 'LP Relations routing active. A Designated Partner will contact you regarding PPM details shortly.';
    } else if (inquiryType === 'media') {
      successMsg = 'Press Desk routing active. Our Corporate Relations team will review your query within 24 hours.';
    } else if (inquiryType === 'general') {
      successMsg = 'General Operations routing active. Your message has been routed to our support desk.';
    }

    // Show custom success alert
    const alertBox = document.getElementById('contact-success-alert');
    if (alertBox) {
      const span = alertBox.querySelector('span');
      if (span) span.innerText = successMsg;
      
      alertBox.style.display = 'flex';
      contactForm.reset();
      
      // Auto scroll to success message
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Hide after 6 seconds
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 6000);
    }
  });
}

// 6. Portfolio Case Study Modal
function initPortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  if (!modal) return;

  const modalWrapper = modal.querySelector('.modal-wrapper');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  const modalContent = modal.querySelector('.modal-content');
  const cards = document.querySelectorAll('.portfolio-card');

  const openModal = (card) => {
    // Read datasets
    const company = card.getAttribute('data-company') || '';
    const desc = card.getAttribute('data-desc') || '';
    const sector = card.getAttribute('data-sector') || '';
    const stage = card.getAttribute('data-stage') || '';
    const size = card.getAttribute('data-deal-size') || '';
    const logoText = card.getAttribute('data-logo-text') || '';
    const logoBg = card.getAttribute('data-logo-bg') || '';
    const logoColor = card.getAttribute('data-logo-color') || '';
    const highlightsStr = card.getAttribute('data-highlights') || '';
    
    // Split highlights by semicolon
    const highlights = highlightsStr.split(';').filter(h => h.trim().length > 0);
    
    // Build highlights HTML
    let highlightsHtml = '';
    if (highlights.length > 0) {
      highlightsHtml = `
        <div style="margin-top: 1.5rem;">
          <h3 style="font-size: 1.15rem; color: var(--brand-navy); margin-bottom: 0.75rem;">Structure & Highlights</h3>
          <ul class="modal-highlights">
            ${highlights.map(h => `<li>${h.trim()}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Build modal body HTML
    modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-company-logo" style="background-color: ${logoBg}; color: ${logoColor};">
          ${logoText}
        </div>
        <div class="modal-company-info">
          <h2>${company}</h2>
          <span style="font-size: 0.9rem; color: var(--accent-copper); font-weight: 500;">Capitar Partner Company</span>
        </div>
      </div>
      <div class="modal-meta-grid">
        <div class="modal-meta-item">
          <span class="modal-meta-label">Sector</span>
          <span class="modal-meta-val">${sector}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-label">Stage</span>
          <span class="modal-meta-val">${stage}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-label">Deal Size</span>
          <span class="modal-meta-val">${size}</span>
        </div>
      </div>
      <div class="modal-body">
        <h3 style="font-size: 1.15rem; color: var(--brand-navy); margin-bottom: 0.5rem;">Overview</h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${desc}</p>
        ${highlightsHtml}
      </div>
    `;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 100);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Add click handlers on cards
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) return;
      openModal(card);
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Keyboard navigation (ESC to close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// 7. Why Capitar Deal-flow Pipeline Drawing
function initWhyCapitarPipeline() {
  const container = document.querySelector('.why-capitar-pipeline-container');
  const svg = document.querySelector('.why-capitar-pipeline-canvas');
  const mainLine = document.getElementById('pipeline-main-line');
  const activePath = document.getElementById('pipeline-active-path');
  const pulseDot = document.getElementById('pipeline-pulse-dot');
  const items = document.querySelectorAll('.pipeline-item');

  if (!container || !svg || items.length === 0) return;

  // Clear any existing dynamically generated connectors
  const removeOldConnectors = () => {
    const dynamicLines = svg.querySelectorAll('.pipeline-connector-line');
    dynamicLines.forEach(l => l.remove());
  };

  const updatePipeline = () => {
    removeOldConnectors();
    const containerRect = container.getBoundingClientRect();
    const badgeCenters = [];

    // 1. Calculate X position of vertical pipeline line (center of node badge)
    const firstNode = items[0].querySelector('.pipeline-node-badge');
    if (!firstNode) return;
    const firstNodeRect = firstNode.getBoundingClientRect();
    const pipelineX = firstNodeRect.left + firstNodeRect.width / 2 - containerRect.left;

    if (mainLine) {
      mainLine.setAttribute('x1', pipelineX);
      mainLine.setAttribute('x2', pipelineX);
    }

    // 2. Position horizontal connector lines for each step
    items.forEach((item) => {
      const node = item.querySelector('.pipeline-node-badge');
      const card = item.querySelector('.pipeline-card');
      
      if (!node || !card) return;
      
      const nodeRect = node.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      const nodeY = nodeRect.top + nodeRect.height / 2 - containerRect.top;
      const nodeCenterX = nodeRect.left + nodeRect.width / 2 - containerRect.left;
      
      const cardLeftX = cardRect.left - containerRect.left;
      const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;

      badgeCenters.push({ x: nodeCenterX, y: nodeY });

      // Create horizontal connection line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'pipeline-connector-line');
      line.setAttribute('x1', nodeCenterX);
      line.setAttribute('y1', nodeY);
      line.setAttribute('x2', cardLeftX);
      line.setAttribute('y2', cardCenterY);
      
      // Dynamic hover styles for connector line
      item.addEventListener('mouseenter', () => {
        line.style.stroke = 'var(--accent-copper)';
        line.style.strokeWidth = '2';
        line.style.strokeDasharray = 'none';
      });
      
      item.addEventListener('mouseleave', () => {
        line.style.stroke = '';
        line.style.strokeWidth = '';
        line.style.strokeDasharray = '';
      });

      svg.appendChild(line);
    });

    // 3. Draw active pipeline overlay path
    if (badgeCenters.length >= 2 && activePath) {
      let d = `M ${badgeCenters[0].x} ${badgeCenters[0].y}`;
      for (let i = 1; i < badgeCenters.length; i++) {
        d += ` L ${badgeCenters[i].x} ${badgeCenters[i].y}`;
      }
      activePath.setAttribute('d', d);
      
      const pathLength = activePath.getTotalLength();
      activePath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      activePath.style.strokeDashoffset = pathLength;

      return { pathLength, badgeCenters };
    }
  };

  let pipelineData = updatePipeline();
  let pathLength = pipelineData ? pipelineData.pathLength : 0;
  let badgeCenters = pipelineData ? pipelineData.badgeCenters : [];

  const handleScroll = () => {
    if (!pathLength || badgeCenters.length === 0) return;
    
    const containerRect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll percentage through pipeline container
    const startPoint = windowHeight * 0.8;
    const endPoint = windowHeight * 0.2;
    const progressRange = containerRect.height + startPoint - endPoint;
    
    const scrolled = startPoint - containerRect.top;
    const percentage = Math.max(0, Math.min(1, scrolled / progressRange));
    
    activePath.style.strokeDashoffset = pathLength * (1 - percentage);

    // Pulse dot flows along path coordinate
    if (pulseDot) {
      const currentProgressY = badgeCenters[0].y + (badgeCenters[badgeCenters.length - 1].y - badgeCenters[0].y) * percentage;
      pulseDot.setAttribute('cx', badgeCenters[0].x);
      pulseDot.setAttribute('cy', currentProgressY);
      pulseDot.style.opacity = percentage > 0.02 && percentage < 0.98 ? '1' : '0';
    }

    // Toggle active state for elements passing screen threshold
    items.forEach((item, idx) => {
      const nodeY = badgeCenters[idx].y;
      const absoluteNodeY = containerRect.top + nodeY;
      
      if (absoluteNodeY < windowHeight * 0.65) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  // Recalculate coordinates on size change
  window.addEventListener('resize', () => {
    setTimeout(() => {
      const updated = updatePipeline();
      if (updated) {
        pathLength = updated.pathLength;
        badgeCenters = updated.badgeCenters;
        handleScroll();
      }
    }, 150);
  });

  window.addEventListener('scroll', handleScroll);
  
  // Stagger slightly for styles to settle
  setTimeout(() => {
    const updated = updatePipeline();
    if (updated) {
      pathLength = updated.pathLength;
      badgeCenters = updated.badgeCenters;
      handleScroll();
    }
  }, 100);
}

// 8. Dynamic Page Exit Transitions
function initPageTransitions() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Only target local relative links
    if (!href || href.startsWith('http') || href.startsWith('#') || link.getAttribute('target') === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      // Don't intercept middle clicks/new tabs
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
        return;
      }
      
      // Let modal links pass through
      if (link.classList.contains('view-summary-btn')) return;

      e.preventDefault();
      document.body.classList.add('page-fade-out');
      
      setTimeout(() => {
        window.location.href = href;
      }, 350); // Match CSS fade-out duration
    });
  });
}


