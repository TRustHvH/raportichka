import { NextResponse } from 'next/server';
import { groupQueries } from '@/db/queries';

export async function GET() {
    try {
        const groups = await groupQueries.getAllGroups();
        return NextResponse.json({ groups });
    } catch (error) {
        console.error('Ошибка получения групп:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 