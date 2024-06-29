// import e creazione context
import { createContext, useContext, useEffect, useState } from "react";
import { useGlobal } from '../contexts/GlobalContext'
const GlobalContext = createContext();

// import componenti
import axiosCustom from "../utils/axiosInterceptor";

// dichiarazione endpoints
const loginEndpoint = "http://localhost:3000/auth/login"

const AuthProvider = ({ children }) => {

    const { setErrors } = useGlobal()
    const [isLogged, setIsLogged] = useState(false)

    const login = async (payload) => {
        try {
            const response = await axiosCustom.post(loginEndpoint, payload)
            const loginInfo = response.data

            console.log("login successful")

            localStorage.setItem('token', loginInfo.token);
            localStorage.setItem('username', JSON.stringify(loginInfo.data.username));
            localStorage.setItem('email', JSON.stringify(loginInfo.data.email));

        } catch (err) {
            let errorMessage;
            if (err.response.data.error) {
                errorMessage = err.response.data.error
                setErrors([errorMessage])
            } else if (err.response.data.errors) {
                let errors = err.response.data.errors;
                let sendErrors = []
                errors.forEach(item => {
                    sendErrors.push(item.msg)
                });
                setErrors(sendErrors)
            }
        }
    }

    useEffect(() => {
        if (localStorage.token) {
            setIsLogged(true)
        }
    }, [])

    const value = {
        login,
        setIsLogged,
        isLogged
    }

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

const useAuth = () => {
    const value = useContext(GlobalContext);
    //se non sono in un consumer del GlobalContext.Provider, value sarà undefined
    if (value === undefined) {
        throw new Error('Non sei dentro al Auth Provider');
    }
    return value;
}

export { AuthProvider, useAuth }