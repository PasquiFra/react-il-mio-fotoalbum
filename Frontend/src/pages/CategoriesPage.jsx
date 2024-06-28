// import utils
import axiosCustom from '../utils/axiosInterceptor'
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useGlobal } from '../contexts/GlobalContext';
import {
    RxCross2 as CancelCross
} from "react-icons/rx";

// import componenti


const CategoriesPage = () => {

    const [categories, setCategories] = useState([]);
    const { isLogged, setIsLogged } = useAuth();
    const { setErrors } = useGlobal()

    const fetchCategories = async () => {

        try {

            const endpoint = `http://localhost:3000/categories`

            const response = await axiosCustom.get(endpoint)
            const categoriesData = response.data
            console.log(categoriesData)
            setCategories(categoriesData)

        } catch (err) {
            setErrors([err.message])
        }
    }

    const cancelCategory = async (id) => {
        try {
            const endpoint = `http://localhost:3000/categories/${id}`

            const response = await axiosCustom.delete(endpoint)

            fetchCategories()

        } catch (err) {
            setErrors([err.message])
        }
    }

    const addCategory = async (event) => {
        event.preventDefault();
        const value = event.target.category.value;

        try {
            const payload = { "name": value }
            const endpoint = `http://localhost:3000/categories`

            const response = await axiosCustom.post(endpoint, payload)

            fetchCategories()

        } catch (err) {
            setErrors([err.message])
        }
    }

    useEffect(() => {
        if (localStorage.token) {
            setIsLogged(true)
        }
        fetchCategories()
    }, [])

    return (
        <section id='categories-page'>

            <h4 className='text-center mb-5'>Categorie</h4>
            <form onSubmit={(event) => addCategory(event)}>
                <input
                    className='my-3'
                    type="text"
                    name='category'
                    placeholder="Inserisci categoria"
                />
                <div className='submit'>
                    <button type='submit' className="btn btn-success">Aggiungi</button>
                </div>
            </form>

            <ul className='row row-cols-4'>
                {
                    categories.map((cat, index) => {
                        return (
                            <li className='card col-3 m-2' key={`${cat}-${index}`}>
                                <h4 className='text-center'>
                                    {cat.name}
                                </h4>
                                <button>
                                    <CancelCross onClick={() => cancelCategory(cat.name)} />
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    )
}

export default CategoriesPage