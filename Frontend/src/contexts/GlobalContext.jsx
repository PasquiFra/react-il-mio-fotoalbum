// import e creazione context
import { createContext, useContext, useEffect, useState } from "react";
const GlobalContext = createContext();

// import componenti
import axiosCustom from '../utils/axiosInterceptor'

const GlobalProvider = ({ children }) => {

    const [errors, setErrors] = useState([]);
    const [previousPage, setPreviousPage] = useState('/');
    const [category, setCategory] = useState([])

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
        },
        {
            "name": "Add photo",
            "path": "/add-photo"
        }
    ]

    const fetchData = async () => {
        const categoriesEndpoint = "http://127.0.0.1:3000/categories";

        try {
            const categories = await axiosCustom.get(categoriesEndpoint);

            setCategory(categories.data);
        }
        catch (err) {
            console.log(err)
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
        fetchData()
    }, [])

    const value = {
        setErrors,
        errors,
        setPreviousPage,
        previousPage,
        pagesList,
        category
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