import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserCookie } from '@/lib/cookies';
import { UserRole } from '@/types/user';

export const dynamic = 'force-dynamic';

// Получение списка учителей
export async function GET() {
    try {
        const cookieUser = getUserCookie();
        if (!cookieUser) {
            return NextResponse.json(
                { error: 'Не авторизован' },
                { status: 401 }
            );
        }

        const result = await db.query(
            `SELECT t.id, t.full_name, u.username 
             FROM teachers t
             JOIN users u ON t.id = u.id
             ORDER BY t.full_name`
        );

        return NextResponse.json({ teachers: result.rows });
    } catch (error) {
        console.error('Ошибка при получении списка учителей:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

// Создание нового учителя (только для администраторов)
export async function POST(request: Request) {
    try {
        const cookieUser = getUserCookie();
        if (!cookieUser || cookieUser.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Доступ запрещен' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { full_name, username, password } = body;

        // Проверяем, существует ли уже пользователь с таким username
        const existingUser = await db.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: 'Пользователь с таким логином уже существует' },
                { status: 400 }
            );
        }

        // Начинаем транзакцию
        await db.query('BEGIN');

        try {
            // Создаем пользователя без хеширования пароля
            const userResult = await db.query(
                `INSERT INTO users (username, password, role)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [username, password, 'teacher']
            );

            const userId = userResult.rows[0].id;

            // Создаем запись учителя
            const teacherResult = await db.query(
                `INSERT INTO teachers (id, full_name)
                 VALUES ($1, $2)
                 RETURNING id, full_name`,
                [userId, full_name]
            );

            await db.query('COMMIT');

            return NextResponse.json({ 
                teacher: {
                    id: teacherResult.rows[0].id,
                    full_name: teacherResult.rows[0].full_name,
                    username
                }
            });
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Ошибка при создании учителя:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}