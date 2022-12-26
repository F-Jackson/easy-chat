import styles from "./Input.module.scss";


interface Props {
    type?: string,
    name: string,
    label?: string,
    placeholder?: string,
    title?: string
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
            />
        </>
    );
}