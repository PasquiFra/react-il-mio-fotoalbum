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
            if (!contactEmail.trim() || !contactMessage.trim()) {
                return setErrors(['Devi riempire tutti i campi'])
            }

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

    return (
        <section className="contact-form container">
            <div>
                <h3 >Contattaci</h3>
            </div>
            {
                !isFormSubmitted ?
                    <form onSubmit={sendContactForm}
                        className='text-center'
                    >
                        <div>

                            <div className='d-flex'>
                                <label htmlFor="contact-form-email">Email</label>
                                <input
                                    id='contact-form-email'
                                    className='my-3'
                                    type="text"
                                    name='email'
                                    placeholder="Inserisci email"
                                    value={contactEmail}
                                    onChange={(event) => setContactEmail(event.target.value)}
                                />

                            </div>
                            <div className='d-flex'>

                                <label htmlFor="contact-form-message">Messaggio</label>

                                <textarea
                                    id='contact-form-message'
                                    className='my-3'
                                    name='message'
                                    placeholder="Inserisci messaggio..."
                                    value={contactMessage}
                                    onChange={(event) => setContactMessage(event.target.value)}
                                />

                            </div>
                        </div>
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