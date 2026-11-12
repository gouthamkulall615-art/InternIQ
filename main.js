/**
 * Intelligence Designed To Evolve — Video-Background Landing Page
 * Vanilla JavaScript (No Framework)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Stats Counter Animation
  // ------------------------------------------------------------------------
  const statItems = document.querySelectorAll('.stat-item');
  let countersStarted = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statItems.forEach((item, i) => {
      const target = parseFloat(item.dataset.target);
      const suffix = item.dataset.suffix || '';
      const decimals = parseInt(item.dataset.decimals || '0', 10);
      const valueEl = item.querySelector('.stat-value');
      if (!valueEl || isNaN(target)) return;

      const duration = 1500 + i * 80;
      const startOffset = 480 + i * 90;

      setTimeout(() => {
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentVal = easeOutCubic(progress) * target;

          valueEl.textContent = `${currentVal.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            valueEl.textContent = `${target.toFixed(decimals)}${suffix}`;
          }
        }

        requestAnimationFrame(step);
      }, startOffset);
    });
  }

  // IntersectionObserver for stats counter
  const statsFooter = document.querySelector('.stats-footer');
  if (statsFooter && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(statsFooter);
  } else {
    // Fallback if IntersectionObserver not available or footer already in viewport
    startCounters();
  }

  // ------------------------------------------------------------------------
  // 2. Mobile Menu Sheet & Overlay Logic
  // ------------------------------------------------------------------------
  const burgerBtn = document.getElementById('burger-btn');
  const mobileSheet = document.getElementById('mobile-sheet');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMenu() {
    if (!burgerBtn || !mobileSheet || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay.removeAttribute('hidden');
    mobileSheet.removeAttribute('hidden');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!burgerBtn || !mobileSheet || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileOverlay.setAttribute('hidden', '');
    mobileSheet.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isOpen = burgerBtn && burgerBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      closeMenu();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close when clicking any link inside mobile sheet
  if (mobileSheet) {
    const mobileLinks = mobileSheet.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Close on resize if wider than 720px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
});

