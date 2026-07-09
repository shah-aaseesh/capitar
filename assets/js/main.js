// Capitar Ventures - Interactive States and Animations

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFaqAccordion();
  initFadeUpObserver();
  initContactForm();
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
  const fadeElements = document.querySelectorAll('.fade-up-element');
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


