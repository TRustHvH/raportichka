import { cookies } from 'next/headers';
import { UserRole } from '@/types/user';

interface UserCookie {
    id: number;
    username: string;
    role: UserRole;
    sessionToken: string;
}

const COOKIE_NAME = 'user_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 дней в секундах

export function setUserCookie(user: UserCookie) {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
}

export function getUserCookie(): UserCookie | null {
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    
    if (!cookie) return null;
    
    try {
        return JSON.parse(cookie.value);
    } catch {
        return null;
    }
}

export function removeUserCookie() {
    const cookieStore = cookies();
    cookieStore.delete(COOKIE_NAME);
}

// Функция для установки cookie в ответе
export function setCookieInResponse(response: Response, user: UserCookie) {
    response.headers.set(
        'Set-Cookie',
        `${COOKIE_NAME}=${JSON.stringify(user)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax`
    );
}

// Функция для удаления cookie в ответе
export function removeCookieInResponse(response: Response) {
    response.headers.set(
        'Set-Cookie',
        `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
    );
} 