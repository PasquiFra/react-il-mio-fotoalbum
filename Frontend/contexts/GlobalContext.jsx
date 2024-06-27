// import e creazione context
import { createContext, useContext, useEffect, useState } from "react";
const GlobalContext = createContext();

// import componenti
import axios from "axios";

const GlobalProvider = ({ children }) => {



    const value = {

    }

    return (
        <GlobalContext.provider value={value} >
            {children}
        </GlobalContext.provider>
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