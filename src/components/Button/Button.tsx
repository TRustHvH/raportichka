import React from "react"
import styles from "./Button.module.css"

export const Button = ({ children, onClick }: { children?: string, onClick?: () => void }) => {
    return (
        <div className={styles.button} onClick={onClick}>{children}</div>
    )
}