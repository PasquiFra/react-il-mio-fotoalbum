import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function ({ children }) {

    const { isLogged } = useAuth();

    const checkLog = () => {
        if (!isLogged) { return <Navigate to="login" /> }
    }

    useEffect(() => {
        checkLog()
    }, [])

    return (
        <>
            {children}
        </>
    );
}