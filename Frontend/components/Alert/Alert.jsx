import './alert.scss'
import { useGlobal } from '../../contexts/GlobalContext';
import { useEffect, useState } from "react";

const Alert = () => {
    const [dismiss, setDismiss] = useState(false)
    const { errors, setErrors } = useGlobal([]);

    const dismissAlert = () => {
        setDismiss(true)
        setErrors([])
    }

    useEffect(() => {
        if (errors) {
            setDismiss(false);
        }
    }, [errors])

    if (!errors) {
        return null;
    }

    return (
        <div className={`alert ${dismiss === true ? 'close' : ''}`}>
            <ul>
                {
                    errors.map(err => {
                        return <li>{err}</li>
                    })
                }
            </ul>
            <button className='btn btn-danger' onClick={dismissAlert}>Dismiss</button>
        </div>
    )
}

export default Alert