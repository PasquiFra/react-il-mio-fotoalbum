// import e creazione context
import { createContext, useContext, useEffect, useState } from "react";
const GlobalContext = createContext();

// import componenti
import axios from "axios";

const GlobalProvider = ({ children }) => {

    const [errors, setErrors] = useState([]);
    const [previousPage, setPreviousPage] = useState('/');

    const pagesList = [
        {
            "name": "Home",
            "path": "/"
        },
        {
            "name": "Gallery",
            "path": "/gallery"
        },
        {
            "name": "Categories",
            "path": "/categories"
        },
        {
            "name": "Contacts",
            "path": "/contacts"
        }
    ]

    const value = {
        setErrors,
        errors,
        setPreviousPage,
        previousPage,
        pagesList
    }

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

const useGlobal = () => {
    const value = useContext(GlobalContext);
    //se non sono in un consumer del GlobalContext.Provider, value sarà undefined
    if (value === undefined) {
        throw new Error('Non sei dentro al Global Provider');
    }
    return value;
}

export { GlobalProvider, useGlobal }