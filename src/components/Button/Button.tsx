import React from "react"
import styles from "./Button.module.css"
import classNames from "classnames";

interface ButtonProps {
    children?: string
    onClick?: () => void
    disabled?: boolean
    className?: string
}

export const Button = ({ children, onClick, disabled, className }: ButtonProps) => {
    return (
        <button
            className={classNames(styles.button, className)}
            onClick={onClick}
            disabled={disabled}

        >
            {children}
        </button>
    )
}