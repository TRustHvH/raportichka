import React from "react"

import styles from "./Select.module.css"
import classNames from "classnames"

export const Select = ({ children, description, className }: { children: React.ReactNode, description: string, className?: string }) => {
    return(
        <div className={classNames(styles["select-container"], className)}>
            <label>{description}</label>
            <select className={styles.select}>
                {children}
            </select>
        </div>
    )
}