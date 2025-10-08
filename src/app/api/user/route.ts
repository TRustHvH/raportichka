import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setUserCookie, getUserCookie, removeUserCookie, setCookieInResponse, removeCookieInResponse } from '@/lib/cookies';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// Функция для генерации токена сессии
function generateSessionToken(): string {
    return randomBytes(32).toString('hex');
}

// Функция для создания новой сессии
async function createSession(userId: number, expiresIn: number = 7 * 24 * 60 * 60 * 1000) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + expiresIn);

    await db.query(
        `INSERT INTO sessions (user_id, session_token, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, sessionToken, expiresAt]
    );

    return sessionToken;
}

// Функция для проверки сессии
async function validateSession(sessionToken: string) {
    const result = await db.query(
        `SELECT s.*, u.username, u.role
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
        [sessionToken]
    );

    if (result.rows.length === 0) {
        return null;
    }

    // Обновляем время последней активности
    await db.query(
        'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = $1',
        [sessionToken]
    );

    return result.rows[0];
}

export async function GET(request: Request) {
    try {
        // Получаем токен из cookie
        const cookieUser = getUserCookie();
        if (!cookieUser) {
            return NextResponse.json(
                { error: 'Не авторизован' },
                { status: 401 }
            );
        }

        // Проверяем сессию
        const session = await validateSession(cookieUser.sessionToken);
        if (!session) {
            // Если сессия недействительна, удаляем cookie
            const response = NextResponse.json(
                { error: 'Сессия истекла' },
                { status: 401 }
            );
            removeCookieInResponse(response);
            return response;
        }

        // Преобразуем роль из строки в число
        const roleMapping = {
            'student': 0,
            'duty': 1,
            'teacher': 2
        };

        const userData = {
            id: session.user_id,
            username: session.username,
            role: roleMapping[session.role as keyof typeof roleMapping]
        };

        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Получаем пользователя напрямую по логину и паролю
        const user = await db.query(
            'SELECT id, username, role FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (!user.rows[0]) {
            return NextResponse.json(
                { error: 'Неверный логин или пароль' },
                { status: 401 }
            );
        }

        // Создаем новую сессию
        const sessionToken = await createSession(user.rows[0].id);

        const roleMapping = {
            'student': 0,
            'duty': 1,
            'teacher': 2
        };

        const userData = {
            id: user.rows[0].id,
            username: user.rows[0].username,
            role: roleMapping[user.rows[0].role as keyof typeof roleMapping],
            sessionToken
        };

        // Создаем ответ с cookie
        const response = NextResponse.json({ user: userData });
        setCookieInResponse(response, userData);

        return response;
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieUser = getUserCookie();
        if (cookieUser?.sessionToken) {
            // Удаляем сессию из базы данных
            await db.query(
                'DELETE FROM sessions WHERE session_token = $1',
                [cookieUser.sessionToken]
            );
        }

        // Создаем ответ с удалением cookie
        const response = NextResponse.json({ success: true });
        removeCookieInResponse(response);

        return response;
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 