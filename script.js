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
      if (window.matchMedia('(max-width: 850px)').matches) {
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

  // Two-step appointment-request preview. Wire a real endpoint before publishing.
  const form = document.querySelector('#appointment-form');
  if (form) {
    const steps = [...form.querySelectorAll('.form-step')];
    const progress = form.querySelector('.progress-fill');
    const markers = [...document.querySelectorAll('.step-marker')];
    const status = form.querySelector('#form-status');
    const success = form.querySelector('.form-success');

    const setStep = index => {
      steps.forEach((step, i) => step.classList.toggle('active', i === index));
      if (progress) progress.style.width = index === 0 ? '50%' : '100%';
      markers.forEach((marker, i) => marker.classList.toggle('active', i <= index));
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
      const fields = [...steps[1].querySelectorAll('input,select,textarea')];
      const invalid = fields.find(field => field.required && !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      steps.forEach(step => { step.hidden = true; step.classList.remove('active'); });
      if (progress) progress.style.width = '100%';
      if (success) success.hidden = false;
      if (status) status.textContent = '';
    });

    form.querySelector('.reset-form')?.addEventListener('click', () => {
      form.reset();
      if (success) success.hidden = true;
      steps.forEach(step => { step.hidden = false; });
      setStep(0);
    });
  }

  // A service-process carousel replaces placeholder customer quotes until real reviews are supplied.
  const slides = [
    {quote:'Start with what you have noticed: a sound, a warning light, a change in the way the vehicle feels, or a service coming due.',name:'First, we listen.',meta:'01 — Understand the concern'},
    {quote:'The recommendation should make sense to you. Ask what was found, why it matters, and what the estimate includes.',name:'Then, we explain.',meta:'02 — Review the findings'},
    {quote:'You should have the information you need to decide how to proceed. If something is unclear, ask before authorizing the work.',name:'You decide.',meta:'03 — Choose the next step'}
  ];
  let slideIndex = 0;
  const quote = document.querySelector('#review-quote');
  const slideName = document.querySelector('#review-name');
  const slideMeta = document.querySelector('#review-meta');
  const slideCounter = document.querySelector('#review-counter');
  const card = document.querySelector('.review-carousel');
  const dots = [...document.querySelectorAll('.review-dots span')];

  const showSlide = index => {
    slideIndex = (index + slides.length) % slides.length;
    if (card) card.classList.add('review-changing');
    window.setTimeout(() => {
      const slide = slides[slideIndex];
      if (quote) quote.textContent = slide.quote;
      if (slideName) slideName.textContent = slide.name;
      if (slideMeta) slideMeta.textContent = slide.meta;
      if (slideCounter) slideCounter.textContent = String(slideIndex + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
      if (card) card.classList.remove('review-changing');
    }, 100);
  };

  document.querySelector('#review-prev')?.addEventListener('click', () => showSlide(slideIndex - 1));
  document.querySelector('#review-next')?.addEventListener('click', () => showSlide(slideIndex + 1));
})();