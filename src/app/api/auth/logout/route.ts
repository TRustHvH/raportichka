import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        // Получаем объект cookies
        const cookieStore = cookies();
        
        // Удаляем cookie user_session
        cookieStore.delete('user_session');
        
        return NextResponse.json({ 
            success: true, 
            message: 'Успешный выход из системы' 
        });
    } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        return NextResponse.json(
            { error: 'Ошибка при выходе из системы' },
            { status: 500 }
        );
    }
} 