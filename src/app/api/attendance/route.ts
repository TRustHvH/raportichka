import { NextResponse } from 'next/server';
import { attendanceQueries } from '@/db/queries';

export async function POST(request: Request) {
    try {
        const { studentId, date, reason } = await request.json();

        if (!studentId || !date) {
            return NextResponse.json(
                { error: 'Требуются ID студента и дата' },
                { status: 400 }
            );
        }

        const attendance = await attendanceQueries.addAttendance(
            studentId,
            new Date(date),
            reason
        );

        return NextResponse.json({ attendance });
    } catch (error) {
        console.error('Ошибка добавления записи:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json(
                { error: 'Требуется дата' },
                { status: 400 }
            );
        }

        const attendance = await attendanceQueries.getAttendanceByDate(new Date(date));
        return NextResponse.json({ attendance });
    } catch (error) {
        console.error('Ошибка получения записей:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
} 