-- Добавляем тип для ролей пользователей
CREATE TYPE user_role AS ENUM ('duty', 'teacher', 'student');

-- Добавляем колонку role в таблицу users
ALTER TABLE users 
ADD COLUMN role user_role NOT NULL DEFAULT 'student';

-- Обновляем существующих пользователей (пример)
-- UPDATE users SET role = 'teacher' WHERE id IN (1, 2, 3); -- Здесь укажите ID учителей
-- UPDATE users SET role = 'duty' WHERE id IN (4, 5, 6); -- Здесь укажите ID дежурных

-- Создаем индекс для быстрого поиска по роли
CREATE INDEX idx_users_role ON users(role);

-- Добавляем проверку на роль
ALTER TABLE users
ADD CONSTRAINT check_valid_role CHECK (role IN ('duty', 'teacher', 'student')); 