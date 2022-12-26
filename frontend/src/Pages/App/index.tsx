import styles from './App.module.scss';
import Communication from './Components/Communication';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Introdution from './Components/Introdution';

export default function App() {
    return (
        <>
            <Header />
            <main>
                <Introdution />
                <Communication />
            </main>
            <Footer />
        </>
    );
}