import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserCookie } from '@/lib/cookies';
import { UserRole } from '@/types/user';

export const dynamic = 'force-dynamic';

// Получение списков для учителя
export async function GET(request: Request) {
    try {
        const cookieUser = getUserCookie();
        if (!cookieUser) {
            return NextResponse.json(
                { error: 'Не авторизован' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const date = searchParams.get('date');

        let query = `
            SELECT al.*, g.name as group_name, u.username as student_username
            FROM attendance_lists al
            JOIN groups g ON al.group_id = g.id
            JOIN users u ON al.created_by_student_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramCount = 1;

        // Если запрос от учителя
        if (cookieUser.role === UserRole.TEACHER) {
            query += ` AND al.sent_to_teacher_id = $${paramCount}`;
            params.push(cookieUser.id);
            paramCount++;
        }

        // Фильтр по статусу
        if (status) {
            query += ` AND al.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        // Фильтр по дате
        if (date) {
            query += ` AND al.date = $${paramCount}`;
            params.push(date);
            paramCount++;
        }

        query += ` ORDER BY al.date DESC, al.created_at DESC`;

        const result = await db.query(query, params);

        return NextResponse.json({ lists: result.rows });
    } catch (error) {
        console.error('Ошибка при получении списков:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

// Создание или обновление списка
export async function POST(request: Request) {
    try {
        const cookieUser = getUserCookie();
        if (!cookieUser) {
            return NextResponse.json(
                { error: 'Не авторизован' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { group_id, date, teacher_id, status, list_id } = body;

        // Проверяем наличие обязательных полей
        if (!group_id) {
            return NextResponse.json(
                { error: 'Отсутствует обязательное поле group_id' },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                { error: 'Отсутствует обязательное поле date' },
                { status: 400 }
            );
        }

        // Проверяем существование списка
        const existingList = await db.query(
            'SELECT * FROM attendance_lists WHERE group_id = $1 AND date = $2',
            [group_id, date]
        );

        if (existingList.rows.length > 0) {
            // Обновляем существующий список
            const result = await db.query(
                `UPDATE attendance_lists 
                 SET status = $1, sent_to_teacher_id = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE group_id = $3 AND date = $4
                 RETURNING *`,
                [status, teacher_id, group_id, date]
            );
            return NextResponse.json({ list: result.rows[0] });
        } else {
            // Создаем новый список
            const result = await db.query(
                `INSERT INTO attendance_lists 
                 (group_id, date, created_by_student_id, sent_to_teacher_id, status)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [group_id, date, cookieUser.id, teacher_id, status]
            );
            return NextResponse.json({ list: result.rows[0] });
        }
    } catch (error) {
        console.error('Ошибка при создании/обновлении списка:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 