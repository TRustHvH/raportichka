import styles from "./Layout.module.css"
import React from "react"
import { Container } from "@/components/Layout/Container"



export const Layout = ({children}: {children?: React.ReactNode}) => {
    return (
        <div className={styles.layout}>
            <Container>{children}</Container>
        </div>
    )
}