import './auth.scss'
import { useGlobal } from '../../contexts/GlobalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [dismiss, setDismiss] = useState(false)

    const { login, isLogged, setIsLogged } = useAuth()
    const { setErrors } = useGlobal()

    const defaultFormData = {
        email: '',
        password: ''
    }

    const [formData, setFormData] = useState(defaultFormData);

    const handleInputField = (name, value) => {
        setFormData(current => ({
            ...current,
            [name]: value
        }));
    }

    const handleLogin = async event => {
        event.preventDefault();
        try {
            await login(formData);

            setFormData(defaultFormData)
            setIsLogged(true)
            setDismiss(true)

        } catch (err) {
            setErrors([err.message])
        }
    }

    const dismissModal = () => {
        setDismiss(true)
        navigate("/")
    }

    return (
        <div className={`login-modal d-flex ${dismiss === true ? 'd-none' : ''}`}>
            <button className='close-login-modal btn btn-danger' onClick={dismissModal}>Chiudi</button>
            <form onSubmit={handleLogin}>
                <h4 className='text-center mb-5'>Effettua il Login</h4>
                <input
                    className='my-3'
                    type="text"
                    name='email'
                    placeholder="Email"
                    onChange={(event) => handleInputField('email', event.target.value)}
                />
                <input
                    className='mb-3'
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(event) => handleInputField("password", event.target.value)}
                />
                <div className='submit'>
                    <button type='submit' className="btn btn-success">Effettua il Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login