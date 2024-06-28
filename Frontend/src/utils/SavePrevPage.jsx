
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';

const SavePreviousPage = ({ children }) => {
    const { setPreviousPage } = useGlobal();
    const location = useLocation();

    useEffect(() => {
        setPreviousPage(location.pathname);
    }, [location]);

    return children;
};

export default SavePreviousPage;