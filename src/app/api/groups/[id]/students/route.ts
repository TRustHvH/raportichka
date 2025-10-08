import { NextResponse } from 'next/server';
import { groupQueries } from '@/db/queries';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const groupId = parseInt(params.id);
        if (isNaN(groupId)) {
            return NextResponse.json(
                { error: 'Неверный ID группы' },
                { status: 400 }
            );
        }

        const students = await groupQueries.getStudentsByGroupId(groupId);
        return NextResponse.json({ students });
    } catch (error) {
        console.error('Ошибка получения студентов:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 