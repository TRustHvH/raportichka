-- Удаляем индекс
DROP INDEX IF EXISTS idx_users_role;

-- Удаляем ограничение
ALTER TABLE users
DROP CONSTRAINT IF EXISTS check_valid_role;

-- Удаляем колонку role
ALTER TABLE users 
DROP COLUMN IF EXISTS role;

-- Удаляем тип user_role
DROP TYPE IF EXISTS user_role; 