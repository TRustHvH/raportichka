-- Удаление индексов
DROP INDEX IF EXISTS idx_attendance_lists_group_date;
DROP INDEX IF EXISTS idx_attendance_lists_status;
DROP INDEX IF EXISTS idx_attendance_lists_teacher;

-- Удаление таблицы
DROP TABLE IF EXISTS attendance_lists;

-- Удаление enum
DROP TYPE IF EXISTS attendance_list_status; 