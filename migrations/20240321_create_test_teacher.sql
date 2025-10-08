-- Создание тестового учителя в таблице users
INSERT INTO users (username, password_hash, role)
VALUES (
    'teacher',
    '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E9vpo9tXhK6eG', -- пароль: 123
    'teacher'
)
RETURNING id;

-- Создание записи в таблице teachers с тем же id
INSERT INTO teachers (id, full_name)
SELECT id, 'Иванов Иван Иванович'
FROM users
WHERE username = 'teacher';

-- Проверка создания
SELECT t.id, t.full_name, u.username, u.role 
FROM teachers t
JOIN users u ON t.id = u.id
WHERE u.username = 'teacher'; 