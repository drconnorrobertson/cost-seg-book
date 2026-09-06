/* ==========================================================================
   FAQ Accordion and Shared UI Interactions
   "Should I Get a Cost Segregation Study?" by AE Tax Advisors
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        // Close all other items
        faqItems.forEach(function(other) {
          if (other !== item) {
            other.classList.remove('active');
          }
        });

        // Toggle the current item
        item.classList.toggle('active');
      });
    }
  });

  // --------------------------------------------------------------------------
  // Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    var navItems = navLinks.querySelectorAll('a');
    navItems.forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Scroll Animation Observer
  // --------------------------------------------------------------------------
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll for Anchor Links
  // --------------------------------------------------------------------------
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
