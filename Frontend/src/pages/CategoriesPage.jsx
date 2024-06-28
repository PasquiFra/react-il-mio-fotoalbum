// import utils
import axiosCustom from '../utils/axiosInterceptor'
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useGlobal } from '../contexts/GlobalContext';
import {
    RxCross2 as CancelCross
} from "react-icons/rx";



const CategoriesPage = () => {

    const [categories, setCategories] = useState([]);
    const { isLogged, setIsLogged } = useAuth();
    const { setErrors } = useGlobal()
    const [categoryToCreate, setCategoryToCreate] = useState('')

    const fetchCategories = async () => {
        try {
            const endpoint = `http://localhost:3000/categories`

            const response = await axiosCustom.get(endpoint)
            const categoriesData = response.data
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
        const value = categoryToCreate

        try {
            const payload = { "name": value }
            const endpoint = `http://localhost:3000/categories`

            const response = await axiosCustom.post(endpoint, payload)

            fetchCategories()
            setCategoryToCreate('')
        } catch (err) {
            setErrors([err.response.data.error])
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

            <h3 className='text-center my-2'>Categorie</h3>

            <form onSubmit={(event) => addCategory(event)}
                className='text-center'>
                <input
                    className='my-3'
                    type="text"
                    name='category'
                    placeholder="Inserisci categoria"
                    value={categoryToCreate}
                    onChange={(event) => setCategoryToCreate(event.target.value)}
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