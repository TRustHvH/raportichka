-- Добавляем новый статус в перечисление attendance_list_status
ALTER TYPE attendance_list_status ADD VALUE IF NOT EXISTS 'rejected';

-- Обновляем существующие записи, если необходимо
UPDATE attendance_lists 
SET status = 'rejected' 
WHERE status = 'rejected_by_teacher'; 