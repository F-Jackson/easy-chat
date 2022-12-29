import uniqid from "uniqid";
import styles from "./Alert.module.scss";


interface Props {
    errors?: string[]
}

export default function Alert(props: Props) {
    return (
        <section
            className={styles.alert__container}
        >
            <ul
                className={styles.errors__list}
            >
                {
                    props.errors?.map((error) => (
                        <li
                            key={uniqid()}
                        >
                            <p>
                                {error}
                            </p>
                        </li>
                    ))
                }
            </ul>
        </section>
    );
}