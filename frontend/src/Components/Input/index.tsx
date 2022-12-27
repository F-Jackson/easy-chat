import styles from "./Input.module.scss";


interface Props {
    type?: string,
    name: string,
    label?: string,
    placeholder?: string,
    title?: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function Input(props: Props) {
    return (
        <>
            <label htmlFor={props.name}>{props.label}</label>
            <input
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                title={props.title}
                className={styles.input}
                value={props.value}
                onChange={(e) => props.setValue((_) => e.target.value)}
            />
        </>
    );
}