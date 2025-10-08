import { NextResponse } from 'next/server';
import { userQueries } from '@/db/queries';

export async function POST(request: Request) {
    try {
        const { code, password } = await request.json();

        if (!code || !password) {
            return NextResponse.json(
                { error: 'Требуются код и пароль' },
                { status: 400 }
            );
        }

        const user = await userQueries.login(code, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Неверный код или пароль' },
                { status: 401 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Ошибка входа:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 