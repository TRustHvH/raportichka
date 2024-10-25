"use client"

import { Layout } from "@/components/Layout/Layout"
import { Box } from "@/components/Box/Box"
import { TextInput } from "@/components/Input/Input"
import { Button } from "@/components/Button/Button"
import { useRouter } from "next/navigation"
import { useState } from "react"

const IndexPage = () => {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [tip, setTip] = useState<undefined | string >(undefined)

    const onClick = () => {
        if (code === "111" && password === "admin") {
            router.push("/profile")
        }else{
            setTip("Неверный логин или пароль")
        }
    }

    return (
        <Layout>
            <Box>
                <div className="login-inputs">
                    <TextInput
                        id="input-code"
                        label="Код"
                        type="tel"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <TextInput
                        id="input-pass"
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    { tip != undefined ? <p className="tip">{tip}</p> : undefined }
                    <Button onClick={onClick}>Войти</Button>
                </div>
            </Box>
        </Layout>
    )
}

export default IndexPage