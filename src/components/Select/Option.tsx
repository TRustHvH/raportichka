interface OptionProps {
    children: string;
    value?: string;
}

export const Option = ({ children, value }: OptionProps) => {
    return (
        <option value={value || children}>
            {children}
        </option>
    );
};