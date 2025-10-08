import { ReactNode } from "react";
import styles from "./Select.module.css";
import classNames from "classnames"

interface SelectProps {
    children: ReactNode;
    description: string;
    className?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const Select = ({ children, description, className, onChange, disabled }: SelectProps) => {
    return (
        <div className={classNames(styles["select-container"], className)}>
            <label>{description}</label>
            <select 
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className={styles.select}
            >
                <option value="">Выберите...</option>
                {children}
            </select>
        </div>
    );
};