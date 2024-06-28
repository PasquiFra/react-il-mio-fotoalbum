import './auth.scss'
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom";
import {
    IoIosArrowDown as ArrowDown,
    IoIosArrowForward as ArrowRight
} from "react-icons/io";

export default function () {
    const { isLogged, setIsLogged } = useAuth()
    const [username, setUsername] = useState()
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        setUsername(localStorage.getItem("username").replace(/^"|"$/g, ''));
    }, [isLogged]);

    return (
        <div className='dashboard'>
            <span role='button'
                className='username text-center'
                onClick={() => setIsActive(!isActive)}>
                {username}
                {
                    isActive ? <ArrowDown className='ms-1' /> : <ArrowRight className='ms-1' />
                }
            </span>
            {isActive &&
                <ul className='user-options'>
                    <li>
                        <Link to={"inbox"}>Messaggi</Link>
                    </li>
                    <li>
                        <Link to={"add-photo"}>Aggiungi Foto</Link>
                    </li>
                    <li>
                        <Link to={"profile"}>Profilo</Link>
                    </li>
                </ul>
            }
        </div>
    );
}