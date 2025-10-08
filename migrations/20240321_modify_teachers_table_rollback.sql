-- Удаляем внешний ключ
ALTER TABLE teachers DROP CONSTRAINT IF EXISTS fk_teachers_users;

-- Восстанавливаем старые колонки
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Восстанавливаем индекс
CREATE INDEX IF NOT EXISTS idx_teachers_username ON teachers(username); 