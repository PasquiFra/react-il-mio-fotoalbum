import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from "../contexts/GlobalContext"
import { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './header.scss'

const Header = () => {
    const navigate = useNavigate();

    const { isLogged, setIsLogged } = useAuth()
    const { pagesList } = useGlobal()

    const logout = () => {
        localStorage.setItem('token', null);
        localStorage.setItem('username', null);
        localStorage.setItem('email', null);
        setIsLogged(false)
    }

    useEffect(() => {
        if (localStorage.token) {
            setIsLogged(true)
        }
    }, [localStorage.token])

    return (
        <>
            <nav className='header-nav'>
                <Link id='logo-img' to={'/'}>
                    <img src="LogoApp-1.jpg" alt="logo" />
                </Link>
                <div>
                    <h1 className='text-center'>Il mio Fotoalbum</h1>
                </div>
                <div id="auth-logs">
                    {
                        !isLogged ? <button className='btn btn-login' onClick={() => navigate("login")}>Login</button>
                            : <button className='btn btn-logout' onClick={logout}>Logout</button>
                    }
                </div>
            </nav>
            <nav className='pages-navbar'>
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
            </nav>
        </>

    )
}

export default Header