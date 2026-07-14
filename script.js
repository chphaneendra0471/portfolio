/**
 * PREMIUM PORTFOLIO JAVASCRIPT
 * Dynamic features, active scrolling, typing animation, stats counters
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Dynamic Text Typing Animation
  // ==========================================
  class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
      this.txtElement = txtElement;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
    }

    type() {
      // Current index of word
      const current = this.wordIndex % this.words.length;
      // Get full text of current word
      const fullTxt = this.words[current];

      // Check if deleting
      if (this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      // Insert txt into element
      this.txtElement.innerHTML = `<span class="txt">${this.txt}</span><span class="typed-cursor">|</span>`;

      // Initial Type Speed
      let typeSpeed = 100;

      if (this.isDeleting) {
        typeSpeed /= 2; // Deleting is faster
      }

      // If word is complete
      if (!this.isDeleting && this.txt === fullTxt) {
        // Make pause at end
        typeSpeed = this.wait;
        // Set delete to true
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to next word
        this.wordIndex++;
        // Pause before typing next word
        typeSpeed = 500;
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  }

  // Init TypeWriter
  const txtElement = document.querySelector('.typing-text');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
  }


  // ==========================================
  // 2. Sticky Navbar scroll state & Scrollspy
  // ==========================================
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll state navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active class handler
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================
  // 3. Stats Counters (Animated on Scroll)
  // ==========================================
  const statsSection = document.getElementById('about');
  const statsElements = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounters = () => {
    statsElements.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const speed = 100; // lower is faster
      const increment = target / speed;

      const updateCount = () => {
        const count = +stat.innerText.replace('+', '');
        if (count < target) {
          stat.innerText = `${Math.ceil(count + increment)}+`;
          setTimeout(updateCount, 15);
        } else {
          stat.innerText = `${target}+`;
        }
      };
      updateCount();
    });
  };

  // Check visibility for counters
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateCounters();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }



  // ==========================================
  // 5. Portfolio Project Category Filtering
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCols = document.querySelectorAll('.portfolio-grid > div');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to current
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCols.forEach(col => {
        const itemCategory = col.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          col.classList.remove('filtered-out');
        } else {
          col.classList.add('filtered-out');
        }
      });
    });
  });


  // ==========================================
  // 6. Back-To-Top Button Logic
  // ==========================================
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
