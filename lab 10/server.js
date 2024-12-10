const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];

// Маршрут для получения списка пользователей
app.get('/users', (req, res) => {
    res.json(users);
});

// Маршрут для добавления нового пользователя
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Проверка на наличие данных
    if (!name || !email) {
        return res.status(400).json({ error: 'Имя и email обязательны' });
    }

    // Проверка уникальности email
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    users.push({ name, email });
    res.status(201).json({ message: 'Пользователь добавлен' });
});

// Маршрут для удаления пользователя
app.delete('/users/:email', (req, res) => {
    const email = req.params.email;
    const initialLength = users.length;
    users = users.filter(user => user.email !== email);

    if (users.length === initialLength) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь удален' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
