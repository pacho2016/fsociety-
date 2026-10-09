const counters = document.querySelectorAll('[data-count]');

const revealTargets = document.querySelectorAll(
  '.hero-copy > *, .hero-visual, .section-heading, .info-card, .about-wrap > *, .case-item, .contact-box > *, .volunteer-card, .support-grid > *, .local-registration, .donation-panel > *, .contact-hero > *, .contact-panel'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealGroups = new Map();
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((element) => {
    const group = element.closest('.hero-stats, .cta-group, .cards-grid, .cases-grid, .volunteer-grid, .support-grid') || element.parentElement;
    const index = revealGroups.get(group) || 0;
    revealGroups.set(group, index + 1);
    element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 80}ms`);
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1400;
  const start = performance.now();

  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const value = target * progress;

    if (target % 1 !== 0) {
      element.textContent = value.toFixed(1);
    } else {
      element.textContent = Math.floor(value);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target % 1 === 0 ? target : target.toFixed(1);
    }
  };

  requestAnimationFrame(step);
};

counters.forEach((counter) => {
  animateCounter(counter);
});

const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.18)';
  } else {
    header.style.boxShadow = 'none';
  }
});

const donationForm = document.querySelector('#donation-form');

if (donationForm) {
  const amountInput = donationForm.querySelector('#donation-amount');
  const amountOptions = donationForm.querySelectorAll('[data-amount]');
  const status = donationForm.querySelector('#donation-status');

  amountOptions.forEach((option) => {
    option.addEventListener('click', () => {
      amountInput.value = option.dataset.amount;
      amountOptions.forEach((item) => {
        const isSelected = item === option;
        item.classList.toggle('is-selected', isSelected);
        item.setAttribute('aria-pressed', String(isSelected));
      });
      status.textContent = '';
    });
  });

  amountInput.addEventListener('input', () => {
    amountOptions.forEach((option) => {
      const isSelected = Number(option.dataset.amount) === Number(amountInput.value);
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
    status.textContent = '';
  });

  donationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!amountInput.reportValidity()) {
      return;
    }

    const amount = Number(amountInput.value);
    if (!Number.isInteger(amount) || amount < 10 || amount > 100000) {
      status.textContent = 'Укажите целую сумму от 10 до 100 000 ₽.';
      amountInput.focus();
      return;
    }

    const cardNumber = (donationForm.dataset.cardNumber || '2200 7021 7678 8706').trim();
    const tbankUrl = (donationForm.dataset.tbankUrl || 'https://www.tbank.ru/payments').trim();

    status.textContent = `Перевод на карту: ${cardNumber}. Сумма: ${amount} ₽. Открываю Т-Банк.`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(cardNumber.replace(/\s+/g, '')).catch(() => {});
    }

    window.open(tbankUrl, '_blank', 'noopener,noreferrer');
  });
}


