// Элементы DOM
const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const message = document.getElementById('message');

// Функция для отображения пользователей
async function loadUsers() {
    try {
        const response = await fetch('/users');
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');

        const users = await response.json();
        userList.innerHTML = ''; // Очистка списка пользователей
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.name} ${user.email}`;
            listItem.dataset.email = user.email;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.onclick = () => deleteUser(user.email);
            listItem.appendChild(deleteBtn);
            userList.appendChild(listItem);
        });
    } catch (error) {
        message.textContent = 'Ошибка загрузки данных';
    }
}

// Функция для добавления нового пользователя
userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData.entries());

    // Проверка уникальности email
    const existingUser = Array.from(userList.children).find(item => item.dataset.email === data.email);
    if (existingUser) {
        message.textContent = 'Этот email уже зарегистрирован';
        return;
    }

    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            message.textContent = 'Пользователь успешно зарегистрирован';
            loadUsers(); // Обновляем список пользователей
            userForm.reset();
        } else {
            message.textContent = 'Ошибка регистрации пользователя';
        }
    } catch (error) {
        message.textContent = 'Ошибка соединения с сервером';
    }
});

// Функция для удаления пользователя
async function deleteUser(email) {
    try {
        const response = await fetch(`/users/${email}`, { method: 'DELETE' });
        if (response.ok) {
            message.textContent = 'Пользователь успешно удален';
            loadUsers(); // Обновляем список пользователей
        } else {
            message.textContent = 'Ошибка при удалении пользователя';
        }
    } catch (error) {
        message.textContent = 'Ошибка соединения с сервером';
    }
}

// Загрузка пользователей при загрузке страницы
loadUsers();
