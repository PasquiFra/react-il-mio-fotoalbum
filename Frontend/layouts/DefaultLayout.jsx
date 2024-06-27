// import utils
import { Outlet } from 'react-router-dom';

// import componenti
import Footer from "./Footer"
import Header from "./Header"
import Alert from "../components/Alert/Alert"

const DefaultLayout = () => {


    return (
        <>
            <Header></Header>
            <main className='container'>
                <Outlet />
            </main>
            <Footer></Footer>
            <Alert></Alert>
        </>
    )
}

export default DefaultLayout