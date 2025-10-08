-- Удаляем старые колонки
ALTER TABLE teachers DROP COLUMN IF EXISTS username;
ALTER TABLE teachers DROP COLUMN IF EXISTS password_hash;
ALTER TABLE teachers DROP COLUMN IF EXISTS created_at;

-- Добавляем внешний ключ на users
ALTER TABLE teachers ADD CONSTRAINT fk_teachers_users FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE;

-- Удаляем старый индекс
DROP INDEX IF EXISTS idx_teachers_username; 