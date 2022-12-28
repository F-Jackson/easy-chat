import styles from './App.module.scss';
import Communication from './Components/Communication';
import Header from './Components/Header';
import Introdution from './Components/Introdution';
import { RecoilRoot } from "recoil";


export default function App() {
    return (
        <RecoilRoot>
            <Header />
            <main>
                {/* <Introdution /> */}
                <Communication />
            </main>
        </RecoilRoot>
    );
}