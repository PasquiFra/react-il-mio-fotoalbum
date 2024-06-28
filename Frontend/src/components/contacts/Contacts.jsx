import './contact.scss'
import { useEffect, useState } from "react";
import { useGlobal } from '../../contexts/GlobalContext'
import axiosCustom from "../../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
const Contacts = () => {
    const navigate = useNavigate();

    const { setErrors } = useGlobal()
    const [contactEmail, setContactEmail] = useState('')
    const [contactMessage, setContactMessage] = useState('')
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [messageInfo, setMessageInfo] = useState(null)

    const redirect = () => {
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    const sendContactForm = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                "email": contactEmail,
                "message": contactMessage
            }
            const contactEndpoint = 'http://127.0.0.1:3000/contacts'
            const response = await axiosCustom.post(contactEndpoint, payload)
            setMessageInfo(response.data)
            setIsFormSubmitted(true)

            redirect()

        } catch (err) {
            const errorMessage = err.response.data.error
            const errorMessage1 = err.response.data.errors[0].msg
            console.log(err)
            console.log(errorMessage)
            console.log(errorMessage1)
            setErrors([errorMessage || errorMessage1])
        }

    }

    useEffect(() => {
        console.log(isFormSubmitted)
    }, [isFormSubmitted])

    return (
        <section className="contact-form">
            <h3 >Contattaci</h3>
            {
                !isFormSubmitted ?
                    <form onSubmit={sendContactForm}
                        className='text-center'
                    >
                        <input
                            className='my-3'
                            type="text"
                            name='email'
                            placeholder="Inserisci email"
                            value={contactEmail}
                            onChange={(event) => setContactEmail(event.target.value)}
                        />
                        <input
                            className='my-3'
                            type="text"
                            name='message'
                            placeholder="Inserisci messaggio..."
                            value={contactMessage}
                            onChange={(event) => setContactMessage(event.target.value)}
                        />
                        <div className='submit'>
                            <button type='submit' className="btn btn-success">Inviaci una Richiesta</button>
                        </div>
                    </form>
                    :
                    <div className="text-center">

                        <p>Grazie per averci contattato. Risponderemo al più presto.</p>

                    </div>
            }
        </section>
    )
}

export default Contacts