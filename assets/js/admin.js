import { getRegisteredUsers, REGISTERED_USERS_KEY } from './local-users.js';

const usersStatus = document.querySelector('#users-status');
const usersList = document.querySelector('#users-list');
const refreshButton = document.querySelector('#refresh-users');
const exportButton = document.querySelector('#export-users');

const renderUsers = () => {
  try {
    const users = getRegisteredUsers().sort((first, second) => second.createdAt.localeCompare(first.createdAt));
    usersList.replaceChildren();
    exportButton.disabled = users.length === 0;

    for (const user of users) {
      const row = document.createElement('tr');
      const date = new Date(user.createdAt);
      const values = [
        Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU'),
        user.name,
        user.email,
        user.phone || '—',
      ];

      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }
      usersList.append(row);
    }

    if (users.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'admin-table-empty';
      cell.textContent = 'Регистраций пока нет.';
      row.append(cell);
      usersList.append(row);
    }

    usersStatus.textContent = `Всего участников: ${users.length}`;
    usersStatus.classList.remove('is-error');
  } catch {
    usersList.replaceChildren();
    usersStatus.textContent = 'Не удалось прочитать регистрации. Проверьте настройки хранения браузера.';
    usersStatus.classList.add('is-error');
    exportButton.disabled = true;
  }
};

const csvCell = (value) => {
  const safeValue = /^[=+\-@\t\r]/.test(String(value)) ? `'${value}` : value;
  return `"${String(safeValue).replaceAll('"', '""')}"`;
};

refreshButton.addEventListener('click', renderUsers);
exportButton.addEventListener('click', () => {
  try {
    const users = getRegisteredUsers();
    const rows = [
      ['Дата регистрации', 'Имя', 'Email', 'Телефон'],
      ...users.map((user) => [user.createdAt, user.name, user.email, user.phone || '']),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(';')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fsociety-users.csv';
    link.click();
    URL.revokeObjectURL(url);
  } catch {
    usersStatus.textContent = 'Не удалось экспортировать список.';
    usersStatus.classList.add('is-error');
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === REGISTERED_USERS_KEY) renderUsers();
});

renderUsers();