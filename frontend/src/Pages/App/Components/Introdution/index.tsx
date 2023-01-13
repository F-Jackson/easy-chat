import { FaBoxOpen } from 'react-icons/fa';
import { GiChatBubble } from 'react-icons/gi';
import { HiPencil } from 'react-icons/hi';
import { BsFillGearFill } from 'react-icons/bs';
import { IoMailSharp } from 'react-icons/io5';
import styles from './Introdution.module.scss';
import classNames from 'classnames';


export default function Introdution() {
    const mailNumbers = [1,2,3,4,5];
    const gearNumbers = [1, 2];
    const titleLines = [1, 2, 3];

    return (
        <section className={styles.introdution}>
            <div className={styles.icons__container}>
                <FaBoxOpen className={styles.box}/>
                <GiChatBubble className={styles.chat}/>
                <HiPencil className={styles.pencil}/>
                {
                    gearNumbers.map(gearNumber => (
                        <BsFillGearFill className={classNames({
                            [styles.gear]: true,
                            [styles[`gear--${gearNumber}`]]: true
                        })} key={`gear--${gearNumber}`}/>
                    ))
                }
                {
                    mailNumbers.map(mailNumber => (
                        <IoMailSharp className={classNames({
                            [styles.mail]: true,
                            [styles[`mail--${mailNumber}`]]: true
                        })} key={`mail--${mailNumber}`}/>
                    ))
                }
            </div>
            <div className={styles.title__container}>
                <h1 className={styles.title}>
                    <strong>Easy Chat</strong> {"...-"} encrypted messages
                </h1>
                {
                    titleLines.map(titleLine => (
                        <span 
                            className={classNames({
                                [styles[`title__line`]]: true,
                                [styles[`title__line--${titleLine}`]]: true
                            })}
                            key={`title__line--${titleLine}`}
                        >
                        </span>
                    ))
                }
            </div>
        </section>
    );
}