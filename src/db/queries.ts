import pool from '../config/database';

export interface User {
    id: number;
    code: string;
    created_at: Date;
}

export interface Group {
    id: number;
    name: string;
    class_owner: string;
}

export interface Student {
    id: number;
    full_name: string;
    group_id: number;
}

export interface Attendance {
    id: number;
    student_id: number;
    date: Date;
    reason: string | null;
    created_at: Date;
}

export const userQueries = {
    login: async (code: string, password: string): Promise<User | null> => {
        const query = `
            SELECT u.id, u.username, u.role, ug.group_id
            FROM users u
            LEFT JOIN user_groups ug ON u.id = ug.user_id
            WHERE u.username = $1 AND u.password = $2
        `;
        const result = await pool.query(query, [code, password]);
        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return user;
    },

    createUser: async (code: string, password: string): Promise<User> => {
        const query = `
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username, created_at
        `;
        
        const result = await pool.query(query, [code, password]);
        return result.rows[0];
    },

    // Получить группу пользователя
    getUserGroup: async (userId: number): Promise<Group | null> => {
        const query = `
            SELECT g.*
            FROM groups g
            JOIN user_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0] || null;
    }
};

export const groupQueries = {
    // Получить все группы
    getAllGroups: async (): Promise<Group[]> => {
        const query = 'SELECT * FROM groups ORDER BY name';
        const result = await pool.query(query);
        return result.rows;
    },

    // Получить группу по ID
    getGroupById: async (id: number): Promise<Group | null> => {
        const query = 'SELECT * FROM groups WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    // Получить студентов группы
    getStudentsByGroupId: async (groupId: number): Promise<Student[]> => {
        const query = 'SELECT * FROM students WHERE group_id = $1 ORDER BY full_name';
        const result = await pool.query(query, [groupId]);
        return result.rows;
    }
};

export const attendanceQueries = {
    // Добавить запись о пропуске/опоздании
    addAttendance: async (studentId: number, date: Date, reason: string): Promise<Attendance> => {
        const query = `
            INSERT INTO attendance (student_id, date, reason)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [studentId, date, reason]);
        return result.rows[0];
    },

    // Получить записи о пропусках/опозданиях за определенную дату
    getAttendanceByDate: async (date: Date): Promise<Attendance[]> => {
        const query = `
            SELECT a.*, s.full_name as student_name, g.name as group_name
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN groups g ON s.group_id = g.id
            WHERE DATE(a.date) = DATE($1)
            ORDER BY g.name, s.full_name
        `;
        const result = await pool.query(query, [date]);
        return result.rows;
    }
}; 