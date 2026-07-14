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

  // ==========================================
  // 7. Interactive Particle Network (Hero Section)
  // ==========================================
  const canvas = document.getElementById('hero-particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('home');
    let animationFrameId = null;
    let particles = [];
    let width = 0;
    let height = 0;
    
    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    const colors = [
      'rgba(0, 242, 254, 0.6)',  // Accent Cyan
      'rgba(79, 172, 254, 0.6)', // Accent Blue
      'rgba(127, 0, 255, 0.6)'    // Accent Violet
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const density = Math.min(Math.floor((width * height) / 15000), 60);
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw line to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(127, 0, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      if (window.innerWidth >= 992) {
        width = canvas.width = heroSection.offsetWidth;
        height = canvas.height = heroSection.offsetHeight;
        initParticles();
        if (!animationFrameId) {
          animate();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth >= 992) {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }
});
