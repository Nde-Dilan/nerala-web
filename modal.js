  document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('exit-modal');
    const closeBtn = document.querySelector('.exit-modal-close');
    const form = document.getElementById('exit-form');
    const successMessage = document.getElementById('exit-form-success');
    const errorMessage = document.getElementById('exit-form-error');
    
    let modalShown = false;
    let formSubmitted = false;
    let exitIntentDelay = 5000; // 5 seconds minimum delay before showing modal
    let pageLoadTime = new Date().getTime();
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('exit-email').value;
      
      // Email validation
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Save email via Formspree
      saveEmailViaFormspree(email);
    });
    
    // Email validation function
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    // Function to save email via Formspree
    function saveEmailViaFormspree(email) {
      // Replace with your Formspree endpoint
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdkznvlo';
      
      // Show loading state
      const submitBtn = document.querySelector('.exit-submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          source: 'exit-intent',
          message: `New subscriber from exit intent: ${email}`
        })
      })
      .then(response => {
        if (response.ok) {
          // Success - show success message
          form.style.display = 'none';
          successMessage.style.display = 'block';
          formSubmitted = true;
          
          // Set cookie to remember submission
          setCookie('neralaEmailSubmitted', 'true', 30);
          
          // Close modal after delay
          setTimeout(() => {
            modal.style.display = 'none';
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Show error message
        errorMessage.style.display = 'block';
        
        // Reset form
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide error after delay
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 3000);
      });
    }
    
    // Show modal when user attempts to leave
    document.addEventListener('mouseleave', function(event) {
      const now = new Date().getTime();
      if (event.clientY <= 0 && !modalShown && !formSubmitted && 
          now - pageLoadTime > exitIntentDelay && !getCookie('neralaEmailSubmitted')) {
        modal.style.display = 'block';
        modalShown = true;
      }
    }, false);
    
    // For mobile devices, detect back button or tab switching
    let hiddenTime;
    document.addEventListener('visibilitychange', function() {
      const now = new Date().getTime();
      if (document.hidden) {
        hiddenTime = now;
      } else if (hiddenTime && now - hiddenTime > 1000 && 
                now - pageLoadTime > exitIntentDelay && 
                !modalShown && !formSubmitted && 
                !getCookie('neralaEmailSubmitted')) {
        modal.style.display = 'block';
        modalShown = true;
      }
    });
    
    // Cookie helper functions
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }
    
    function getCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  });

