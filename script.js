// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // Check saved theme or prefer-color-scheme
  const savedTheme = localStorage.getItem('portfolio-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply saved theme
  if (savedTheme === 'dark') {
    body.classList.remove('light');
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
    themeToggle.textContent = '🌙';
  }
  
  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    
    if (isDark) {
      body.classList.remove('dark');
      body.classList.add('light');
      themeToggle.textContent = '🌙';
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
      themeToggle.textContent = '☀️';
      localStorage.setItem('portfolio-theme', 'dark');
    }
    
    // Add rotation animation
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
  });

  // ===== TYPING ANIMATION =====
  const nameText = "Tharindu Thennakoon";
  const typingElement = document.getElementById('typing-name');
  let charIndex = 0;
  let typingTimer = null;
  
  function typeName() {
    if (charIndex < nameText.length) {
      typingElement.textContent += nameText.charAt(charIndex);
      charIndex++;
      
      // Add slight randomness to typing speed for natural feel
      const speed = 80 + Math.random() * 40;
      typingTimer = setTimeout(typeName, speed);
    } else {
      // Animation complete - mark complete (stops cursor via CSS)
      typingElement.classList.add('typing-complete');
      typingTimer = null;
    }
  }
  
  function startTyping(delay = 200) {
    if (!typingElement) return;

    // Clear any ongoing timer
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }

    // Reset
    charIndex = 0;
    typingElement.textContent = '';
    typingElement.classList.remove('typing-complete');

    // Start after a short delay
    setTimeout(typeName, delay);
  }

  // Start on first load
  startTyping(500);

  // Restart typing whenever Home section comes into view
  const homeSection = document.getElementById('home');
  if (homeSection) {
    const homeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTyping(200);
        }
      });
    }, { threshold: 0.6 });

    homeObserver.observe(homeSection);
  }

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just #
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(href.substring(1));
      }
    });
  });

  // ===== ACTIVE NAV LINK UPDATE =====
  function updateActiveNavLink(sectionId) {
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Update active nav on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      updateActiveNavLink(currentSection);
    }
  });

  // ===== BACK TO TOP BUTTON =====
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.style.display = 'none';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add click animation
      backToTopBtn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        backToTopBtn.style.transform = 'scale(1)';
      }, 150);
    });
  }

  // ===== SKILL BARS ANIMATION =====
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.bar div');
    
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = '0%';
      
      // Animate after a short delay
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }
  
  // ===== INTERSECTION OBSERVER =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animate-in');
        
        // Animate skill bars
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
        
        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // ===== FORM SUBMISSION =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name') || this.querySelector('input[type="text"]').value;
      const email = formData.get('email') || this.querySelector('input[type="email"]').value;
      const message = formData.get('message') || this.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }
      
      if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // In a real app, you would send this to a server
      // For demo purposes, we'll just show a success message
      showNotification(`Thank you, ${name}! Your message has been sent.`, 'success');
      
      // Reset form
      this.reset();
    });
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    
    // Add styles for animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // ===== DOWNLOAD PDF FUNCTION =====
  window.downloadPDF = function() {
    // Create a modal for download confirmation
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 15px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
          <h3 style="color: var(--accent); margin-bottom: 1rem;">Download Resume</h3>
          <p style="margin-bottom: 1.5rem;">In a production environment, this would download your actual resume PDF. For this demo, we're showing this message.</p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="printBtn" class="btn small" style="background: var(--accent); color: white; border: none;">Print Preview</button>
            <button id="closeModal" class="btn small outline">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal buttons
    modal.querySelector('#printBtn').addEventListener('click', () => {
      window.print();
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#closeModal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.querySelector('div[style*="position: fixed"]').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.body.removeChild(modal);
      }
    });
  };

  // ===== CURRENT YEAR IN FOOTER =====
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // ===== PROJECT CARD INTERACTIONS =====
  document.querySelectorAll('.project-actions .btn').forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.textContent.includes('Demo') || this.textContent.includes('Prototype')) {
        e.preventDefault();
        showNotification('Project demo would open here in a real portfolio.', 'info');
      }
    });
  });

  // ===== CERTIFICATE LINK HOVER EFFECTS =====
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ===== INITIALIZE ANIMATIONS =====
  // Add initial styles for animations
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .typing-complete::after {
      animation: none;
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
  
  // Initialize skill bars at 0
  document.querySelectorAll('.bar div').forEach(bar => {
    bar.style.width = '0%';
  });
});

