-- Удаление индексов
DROP INDEX IF EXISTS idx_sessions_token;
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_expires_at;

-- Удаление таблицы сессий
DROP TABLE IF EXISTS sessions; 