import React from "react"

import styles from "./Box.module.css";
import "../../../styles/global.css"
import classNames from "classnames"

export const Box = ({children, className}: {children: React.ReactNode, className?: string}) => {
    return (
        <div className={classNames(styles.box, className)}>
            {children}
        </div>
    )
}