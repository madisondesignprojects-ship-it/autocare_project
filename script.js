(() => {
  const nav = document.querySelector('#primary-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuItems = [...document.querySelectorAll('.nav-item')];

  const closeMenus = (except = null) => {
    menuItems.forEach(item => {
      if (item === except) return;
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  menuItems.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');
    const panel = item.querySelector('.mega-menu, .simple-dropdown');
    if (!trigger || !panel) return;

    // Desktop hover is handled by CSS; this click behavior supports touch and keyboard users.
    trigger.addEventListener('click', event => {
      event.preventDefault();
      const isOpen = item.classList.contains('open');
      closeMenus(item);
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    item.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('menu-open', isOpen);
      if (!isOpen) closeMenus();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      // Internal anchors and service links close the mobile menu before navigation.
      if (window.matchMedia('(max-width: 930px)').matches) {
        nav.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        document.body.classList.remove('menu-open');
        closeMenus();
      }
    }));
  }

  document.addEventListener('click', event => {
    if (!event.target.closest('.main-nav')) closeMenus();
  });

  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Add restrained scroll reveals to content cards and major sections.
  const revealTargets = document.querySelectorAll(
    '.reference-intro-text, .reference-intro-image-wrap, .reference-text-grid > div, .reference-feature-image, .reference-feature-copy, .inspection-copy, .inspection-card-list article, .reference-faq-grid > div, .award-list > div, .reference-amenities-grid article, .why-grid article, .owner-photo, .owner-copy, .reference-service-list a, .specials-inner > div, .appointment-intro, .appointment-form, .reviews-intro, .review-carousel'
  );
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }

  // Two-step appointment request form. Demo only: no data is sent to a server.
  const form = document.querySelector('#appointment-form');
  if (form) {
    const steps = [...form.querySelectorAll('.form-step')];
    const progress = form.querySelector('.progress-fill');
    const stepMarkers = [...document.querySelectorAll('.step-marker')];
    const status = form.querySelector('#form-status');
    const success = form.querySelector('.form-success');
    let activeStep = 0;

    const setStep = index => {
      activeStep = index;
      steps.forEach((step, i) => step.classList.toggle('active', i === index));
      if (progress) progress.style.width = index === 0 ? '50%' : '100%';
      stepMarkers.forEach((marker, i) => marker.classList.toggle('active', i <= index));
      if (status) status.textContent = '';
    };

    form.querySelectorAll('.next-step').forEach(button => button.addEventListener('click', () => {
      const fields = [...steps[0].querySelectorAll('input,select,textarea')];
      const invalid = fields.find(field => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      setStep(1);
      const dateInput = form.querySelector('input[name="date"]');
      if (dateInput) {
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        dateInput.min = localDate;
      }
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));

    form.querySelectorAll('.previous-step').forEach(button => button.addEventListener('click', () => {
      setStep(0);
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!steps[1].querySelector('input[name="date"]').checkValidity() ||
          !steps[1].querySelector('select[name="time"]').checkValidity() ||
          !steps[1].querySelector('select[name="service"]').checkValidity()) {
        const invalid = [...steps[1].querySelectorAll('input,select,textarea')].find(field => !field.checkValidity());
        if (invalid) invalid.reportValidity();
        return;
      }
      steps.forEach(step => { step.hidden = true; step.classList.remove('active'); });
      if (progress) progress.style.width = '100%';
      if (success) success.hidden = false;
      if (status) status.textContent = '';
    });

    const reset = form.querySelector('.reset-form');
    if (reset) reset.addEventListener('click', () => {
      form.reset();
      if (success) success.hidden = true;
      steps.forEach(step => { step.hidden = false; });
      setStep(0);
    });
  }

  // Review carousel is intentionally populated with a clearly marked placeholder
  // until approved, verified customer reviews are supplied by the shop.
  const reviewData = [
    { quote: 'Replace this sample with an approved, verified customer review before launch.', name: 'Customer testimonial placeholder', meta: 'Verified review to be added' },
    { quote: 'Use this space for a real customer experience, with permission to publish the wording and name.', name: 'Customer testimonial placeholder', meta: 'Add an approved review' },
    { quote: 'Honest feedback helps drivers know what to expect. Add an actual review before this site goes live.', name: 'Customer testimonial placeholder', meta: 'Add an approved review' }
  ];
  let reviewIndex = 0;
  const quote = document.querySelector('#review-quote');
  const reviewName = document.querySelector('#review-name');
  const reviewMeta = document.querySelector('#review-meta');
  const reviewCounter = document.querySelector('#review-counter');
  const showReview = index => {
    reviewIndex = (index + reviewData.length) % reviewData.length;
    const card = document.querySelector('.review-carousel');
    if (card) card.classList.add('review-changing');
    window.setTimeout(() => {
      const review = reviewData[reviewIndex];
      if (quote) quote.textContent = review.quote;
      if (reviewName) reviewName.textContent = review.name;
      if (reviewMeta) reviewMeta.textContent = review.meta;
      if (reviewCounter) reviewCounter.textContent = String(reviewIndex + 1).padStart(2, '0') + ' / ' + String(reviewData.length).padStart(2, '0');
      if (card) card.classList.remove('review-changing');
    }, 130);
  };
  document.querySelector('#review-prev')?.addEventListener('click', () => showReview(reviewIndex - 1));
  document.querySelector('#review-next')?.addEventListener('click', () => showReview(reviewIndex + 1));
})();