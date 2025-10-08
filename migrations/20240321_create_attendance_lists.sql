-- Создание enum для статусов списка
CREATE TYPE attendance_list_status AS ENUM ('draft', 'sent_to_teacher', 'approved_by_teacher', 'sent_to_duty', 'approved_by_duty');

-- Создание таблицы для хранения статусов списков
CREATE TABLE IF NOT EXISTS attendance_lists (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id),
    date DATE NOT NULL,
    created_by_student_id INTEGER NOT NULL REFERENCES users(id),
    sent_to_teacher_id INTEGER REFERENCES teachers(id),
    status attendance_list_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, date)
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_attendance_lists_group_date ON attendance_lists(group_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_lists_status ON attendance_lists(status);
CREATE INDEX IF NOT EXISTS idx_attendance_lists_teacher ON attendance_lists(sent_to_teacher_id); 