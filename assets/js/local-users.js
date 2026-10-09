export const REGISTERED_USERS_KEY = 'fsociety_registered_users';

export const getRegisteredUsers = () => {
  const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!storedUsers) return [];

  const users = JSON.parse(storedUsers);
  return Array.isArray(users) ? users : [];
};

export const registerUser = ({ name, email, phone }) => {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return { duplicate: true };
  }

  const user = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, user]));
  return { duplicate: false, user };
};