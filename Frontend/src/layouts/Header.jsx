import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"
import { createContext, useContext, useEffect, useState } from "react";


const Header = () => {
    const navigate = useNavigate();

    const { isLogged, setIsLogged } = useAuth()

    const logout = () => {
        localStorage.setItem('token', null);
        localStorage.setItem('username', null);
        localStorage.setItem('email', null);
        setIsLogged(false)
    }

    useEffect(() => {
        setIsLogged(isLogged)
    }, [isLogged])

    return (
        <nav className='header-nav'>
            <div id='logo-img'>
                <img src="LogoApp-1.jpg" alt="logo" />
            </div>
            <div>
                <h1 className='text-center'>Il mio Fotoalbum</h1>
            </div>
            <div id="auth-logs">
                {
                    !isLogged ? <button className='btn btn-primary' onClick={() => navigate("login")}>Login</button>
                        : <button className='btn btn-secondary' onClick={logout}>Logout</button>
                }
            </div>
        </nav>
    )
}

export default Header