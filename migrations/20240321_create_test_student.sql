-- Создание тестового студента
INSERT INTO users (username, password_hash, role)
VALUES (
    'student',
    '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E9vpo9tXhK6eG', -- пароль: 123
    'student'
);

-- Проверка создания
SELECT id, username, role FROM users WHERE username = 'student'; 