import styles from './Introdution.module.scss';


export default function Introdution() {
    return (
        <section className={styles.introdution}>
            <img src="" alt="Introdution" className={styles.img} />
            <h1 className={styles.title}>
                <strong>Easy Chat</strong> - encrypted messages
            </h1>
        </section>
    );
}