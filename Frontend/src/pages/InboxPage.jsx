// import utils
import axiosCustom from '../utils/axiosInterceptor'
import { useEffect, useState } from "react";
// import componenti



const InboxPage = () => {

    const [messages, setMessages] = useState([])

    const fetchContactMessages = async () => {
        let endpoint = `http://localhost:3000/contacts`;
        const response = await axiosCustom.get(endpoint)
        console.log(response.data)
        setMessages(response.data)
    }

    useEffect(() => {
        fetchContactMessages()
    }, [])

    return (
        <section>
            <h1 className='text-center'>Messaggi ricevuti</h1>
            <ul>
                {
                    messages.map(mess => {
                        return (
                            <li>
                                <h5><strong>Email: </strong>{mess.email}</h5>
                                <p><strong>Messaggio: </strong>{mess.message}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    )
}

export default InboxPage