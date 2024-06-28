import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from "../contexts/GlobalContext"
import { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './header.scss'

//import componente
import UserDashboard from '../components/Authentication/UserDashboard'

const Header = () => {
    const navigate = useNavigate();

    const { isLogged, setIsLogged } = useAuth()
    const { pagesList } = useGlobal()

    const logout = () => {
        setIsLogged(false)
        localStorage.setItem('token', '');
        localStorage.setItem('username', '');
        localStorage.setItem('email', '');
    }

    useEffect(() => {
        if (localStorage.token) {
            setIsLogged(true)
        }
    }, [localStorage.token])

    return (
        <>
            <nav>
                <div className='header-nav'>
                    <Link id='logo-img' to={'/'}>
                        <img src="LogoApp-1.jpg" alt="logo" />
                    </Link>
                    <div>
                        <h1 className='text-center'>Il mio Fotoalbum</h1>
                    </div>
                    <div id="authentication">
                        <div>
                            {isLogged &&
                                <UserDashboard />
                            }
                        </div>
                        <div >
                            {
                                !isLogged ? <button className='btn btn-login' onClick={() => navigate("login")}>Login</button>
                                    : <button className='btn btn-logout' onClick={logout}>Logout</button>
                            }
                        </div>
                    </div>

                </div>
                <div className='pages-navbar'>
                    <ul className='d-flex'>

                        {
                            pagesList.map((page, index) => {
                                return (
                                    <li key={`page-${index}`}>
                                        <Link to={page.path}>{page.name}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </nav>
        </>

    )
}

export default Header