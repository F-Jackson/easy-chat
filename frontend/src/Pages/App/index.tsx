import { errorAtom } from '../../States/error';
import Alert from './Components/Alert';
import Communication from './Components/Communication';
import Header from './Components/Header';
import Introdution from './Components/Introdution';
import { useRecoilValue } from "recoil";
import styles from './App.module.scss';


export default function App() {
    const errorState = useRecoilValue(errorAtom);

    return (
        <>
            <Header />
            { errorState.length > 0 ? <Alert errors={errorState}/> : <></>}
            <main className={styles.main}>
                {/* <Introdution /> */}
                <Communication />
            </main>
        </>
    );
}