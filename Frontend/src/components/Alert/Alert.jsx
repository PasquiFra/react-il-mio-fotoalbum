import './alert.scss'
import { useGlobal } from '../../contexts/GlobalContext';
import { useEffect, useState } from "react";

const Alert = () => {
    const [dismiss, setDismiss] = useState(false)
    const { errors, setErrors } = useGlobal();

    const dismissAlert = () => {

        setDismiss(true)
        setErrors([])

    }

    useEffect(() => {
        if (errors && errors.length > 0) {
            setDismiss(false);
        }
    }, [errors]);

    if (!errors || errors.length === 0) {
        return null;
    }

    if (errors && errors.length > 0) {
        return (
            <div className={`alert ${dismiss === true ? 'd-none' : ''}`}>
                <ul>
                    {
                        errors?.map((err, index) => {
                            return <li
                                key={`error-${index}`}
                                className='text-danger'>
                                {err}
                            </li>
                        })
                    }
                </ul>
                <button className='btn btn-danger' onClick={dismissAlert}>Dismiss</button>
            </div>
        )
    }

}

export default Alert