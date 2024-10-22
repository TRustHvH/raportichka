import React from "react"
import { Metadata } from "next"

import "../../styles/global.css"


export const metadata: Metadata = {
    title: "Рапортичка",
    icons: [
        "/favicon.svg"
    ],
    description: "Рапортичка БТТ",
    openGraph: {
        siteName: "Рапортичка",
        title: "Рапортичка",
        type: "article"
    }
}

const RootLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout