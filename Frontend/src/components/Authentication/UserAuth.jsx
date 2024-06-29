import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function ({ children }) {

    const { isLogged, setIsLogged } = useAuth();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (token) {
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        };
        checkToken();
    }, [setIsLogged]);

    if (!isLogged) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}