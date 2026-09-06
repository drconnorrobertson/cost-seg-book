/* ==========================================================================
   Cost Segregation Savings Calculator
   "Should I Get a Cost Segregation Study?" by AE Tax Advisors
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('calc-form');
  var resultsDiv = document.getElementById('calc-results');

  // Reclassification percentages by property type
  var reclassRates = {
    'str': 0.35,
    'ltr': 0.30,
    'commercial': 0.25,
    'self-storage': 0.40,
    'hotel': 0.38,
    'restaurant': 0.42
  };

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var purchasePrice = parseFloat(
        document.getElementById('purchase-price').value.replace(/,/g, '')
      );
      var propertyType = document.getElementById('property-type').value;
      var sqft = parseFloat(
        document.getElementById('square-footage').value.replace(/,/g, '')
      );
      var taxBracket = parseFloat(
        document.getElementById('tax-bracket').value
      ) / 100;

      if (!purchasePrice || !propertyType || !sqft || !taxBracket) {
        alert('Please fill in all fields.');
        return;
      }

      var reclassRate = reclassRates[propertyType];
      var reclassifiedAmount = purchasePrice * reclassRate;
      var bonusDepreciation = reclassifiedAmount * 1.0; // 100% bonus depreciation
      var taxSavings = bonusDepreciation * taxBracket;
      var studyCost = sqft * 1; // $1 per square foot
      var netBenefit = taxSavings - studyCost;
      var roi = (netBenefit / studyCost) * 100;

      // Update result values in the DOM
      document.getElementById('result-reclassified').textContent =
        formatCurrency(reclassifiedAmount);
      document.getElementById('result-depreciation').textContent =
        formatCurrency(bonusDepreciation);
      document.getElementById('result-tax-savings').textContent =
        formatCurrency(taxSavings);
      document.getElementById('result-study-cost').textContent =
        formatCurrency(studyCost);
      document.getElementById('result-net-benefit').textContent =
        formatCurrency(netBenefit);
      document.getElementById('result-roi').textContent =
        roi.toFixed(0) + '%';

      // Show results with animation
      resultsDiv.classList.remove('hidden');
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Animate each result item in sequence
      var resultItems = resultsDiv.querySelectorAll('.result-item');
      resultItems.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(function() {
          item.style.transition = 'all 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });
  }

  /**
   * Format a number as US currency (no decimals).
   */
  function formatCurrency(num) {
    return '$' + num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Format purchase price input with commas as the user types
  var priceInput = document.getElementById('purchase-price');
  if (priceInput) {
    priceInput.addEventListener('input', function(e) {
      var value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        value = parseInt(value, 10).toLocaleString();
      }
      e.target.value = value;
    });
  }

  // Format square footage input with commas as the user types
  var sqftInput = document.getElementById('square-footage');
  if (sqftInput) {
    sqftInput.addEventListener('input', function(e) {
      var value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        value = parseInt(value, 10).toLocaleString();
      }
      e.target.value = value;
    });
  }

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
});
