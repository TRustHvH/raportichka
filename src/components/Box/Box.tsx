import React from "react"

import styles from "./Box.module.css";

export const Box = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={styles.box}>
            {children}
        </div>
    )
}