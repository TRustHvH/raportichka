import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserCookie } from '@/lib/cookies';

export const dynamic = 'force-dynamic';

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
            `SELECT g.*
             FROM groups g
             JOIN user_groups ug ON g.id = ug.group_id
             WHERE ug.user_id = $1`,
            [cookieUser.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ group: null });
        }

        return NextResponse.json({ group: result.rows[0] });
    } catch (error) {
        console.error('Ошибка при получении группы пользователя:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 