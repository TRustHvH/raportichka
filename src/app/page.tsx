"use client"

import { Layout } from "@/components/Layout/Layout"
import { Box } from "@/components/Box/Box"
import { TextInput } from "@/components/Input/Input"
import { Button } from "@/components/Button/Button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const IndexPage = () => {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [tip, setTip] = useState<undefined | string>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    router.push("/profile");
                }
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
            }
        };

        checkAuth();
    }, [router]);

    const onClick = async () => {
        try {
            setIsLoading(true)
            setTip(undefined)

            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: code, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setTip(data.error || 'Ошибка при входе')
                return
            }

            router.push("/profile")
        } catch (err) {
            setTip('Произошла ошибка при входе')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout>
            <Box>
                <h1 className="login-h1">Вход</h1>
                <div className="login-inputs">
                    <TextInput
                        id="input-code"
                        label="Код"
                        type="tel"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextInput
                        id="input-pass"
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    {tip && <p className="tip">{tip}</p>}
                    <Button onClick={onClick} disabled={isLoading}>
                        {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                </div>
            </Box>
        </Layout>
    )
}

export default IndexPage