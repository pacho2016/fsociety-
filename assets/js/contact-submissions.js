const form = document.querySelector('#contact-submission-form');
const status = document.querySelector('#contact-submission-status');
const submitUrl = 'https://formsubmit.co/ajax/SEMSEPIOLL1@gmail.com';

if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = Object.fromEntries(new FormData(form).entries());
    formData._subject = 'Новая заявка с сайта FSOCIETY';
    submitButton.disabled = true;
    status.textContent = 'Отправляем заявку...';
    status.classList.remove('is-error');

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error('Form submission failed');
      }

      form.reset();
      status.textContent = 'Заявка отправлена. Спасибо!';
    } catch {
      status.textContent = 'Не удалось отправить заявку. Попробуйте позже.';
      status.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
    }
  });
}