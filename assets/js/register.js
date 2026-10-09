import { registerUser } from './local-users.js';

const form = document.querySelector('#local-registration-form');
const status = document.querySelector('#registration-status');

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    try {
      const result = registerUser({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        phone: String(formData.get('phone')),
      });

      if (result.duplicate) {
        status.textContent = 'Этот email уже зарегистрирован в этом браузере.';
        status.classList.add('is-error');
        return;
      }

      form.reset();
      status.textContent = 'Регистрация сохранена в этом браузере. Спасибо!';
      status.classList.remove('is-error');
    } catch {
      status.textContent = 'Не удалось сохранить регистрацию. Проверьте настройки хранения браузера.';
      status.classList.add('is-error');
    }
  });
}