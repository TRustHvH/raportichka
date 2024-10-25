import React from "react"
import classNames from "classnames"

import styles from "./Input.module.css"

type TextInputType = "text" | "password" | "tel"

interface TextInputProps {
    className?: string
    label: string
    id?: string
    placeholder?: string
    value?: string
    type?: TextInputType
    valid?: boolean
    available?: boolean
    maxLength?: number,
    small?: boolean

    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export function TextInput(props: TextInputProps) {
    const {
        className,
        label,
        id,
        placeholder,
        type = "text",
        valid = true,
        available = true,
        maxLength,
        small,

        onChange,
    } = props

    return (
        <div className={classNames(className, styles["input-container"], { "small": small })}>
            <label htmlFor={id}>{label}</label>
            <input className={classNames(styles["input-field"], { "invalid": !valid })}
                   type={type}
                   name={id}
                   onChange={onChange}
                   placeholder={placeholder}
                   disabled={!available}
                   maxLength={maxLength}
            />
        </div>
    )
}
