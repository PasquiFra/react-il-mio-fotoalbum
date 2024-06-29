// import utils
import { useEffect, useState } from "react";
import { useGlobal } from '../contexts/GlobalContext'
import axiosCustom from '../utils/axiosInterceptor'
import { useNavigate } from 'react-router-dom';
// import componenti


const AddPhotoPage = () => {

    const navigate = useNavigate();

    const inputs = [
        {
            label: "Titolo",
            type: 'text',
            name: 'title',
            placeholder: 'Inserisci un titolo...',
            className: 'form-control'
        },
        {
            label: "Descrizione",
            type: 'text',
            name: "description",
            placeholder: 'Inserisci una descrizione...',
            className: 'form-control'
        },
        {
            label: "Immagine",
            type: 'file',
            name: "image",
            placeholder: 'Inserisci un\'immagine',
            className: 'form-control'
        },
        {
            label: "Categorie",
            type: 'checkbox',
            name: "category",
            className: 'ms-2'
        },
        {
            label: "Visibile",
            type: 'checkbox',
            name: "visible",
            className: 'ms-2'
        },
    ]

    const { setErrors, category } = useGlobal();

    // Setto l'oggetto data del form per raccogliere i vari campi input
    const setupFormData = {
        title: "",
        description: "",
        image: null,
        category: [],
        visible: false,
    }

    const [formData, setFormData] = useState(setupFormData);

    const handleInputField = (name, value, catName) => {
        if (name === "category") {
            setFormData(current => {
                const updatedCategories = value
                    ? [...current.category, catName]
                    : current.category.filter(cat => cat !== catName);
                return {
                    ...current,
                    category: updatedCategories
                };
            });
        } else if (name === "image") {
            if (value instanceof File) {
                setFormData(current => ({
                    ...current,
                    image: value
                }));
            }
        } else {
            setFormData(current => ({
                ...current,
                [name]: value
            }));
        }
    }

    const submitForm = async (event) => {
        event.preventDefault()
        const sendPhotoEndpoint = "http://localhost:3000/photos"
        setFormData(formData)

        console.log(formData)
        const formDataToSend = new FormData();

        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('published', formData.visible);

        // Gestione speciale per l'immagine, se presente
        if (formData.image instanceof File) {
            formDataToSend.append('image', formData.image);
        }

        // Gestione speciale per categories
        formData.category.forEach((cat, index) => {
            formDataToSend.append(`category[]`, cat);
        });

        try {
            const response = await axiosCustom.post(sendPhotoEndpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const fetchedPhoto = response.data
            console.log('Photo added successfully:', fetchedPhoto);
            setFormData(setupFormData)

            if (response.status < 400) {
                navigate(`photos`)
            }
        }
        catch (err) {
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

    useEffect(() => {

    }, [])


    return (
        <section className="container">
            <h1 className='text-center'>Aggiungi Foto</h1>
            <form onSubmit={submitForm}>
                {/* //! Creazione inputs del form */}
                {inputs.map((input) => {
                    switch (input.type) {
                        case 'checkbox':
                            if (input.name === "category") {
                                return (
                                    <div className="w-100 my-2" key={input.name}>
                                        <label className="form-check-label w-100">
                                            <strong>{input.label}</strong>
                                        </label>
                                        {category.map(cat => {
                                            return (
                                                <label
                                                    key={`cat-${cat.name.toLowerCase().split(' ').join('-')}`}
                                                    className="me-4">
                                                    {cat.name}
                                                    <input
                                                        id={`cat-${cat.name.toLowerCase().split(' ').join('-')}`}
                                                        type={input.type}
                                                        name={input.name}
                                                        onChange={(event) => handleInputField(input.name, event.target.checked, cat.name)}
                                                        className={input.className}
                                                    />
                                                </label>
                                            )
                                        })}

                                    </div>
                                );
                            } else {
                                return (
                                    <div className="w-100 my-2" key={input.name}>
                                        <label className="form-check-label" htmlFor={`input-${input.name}`}>
                                            <strong>{input.label}</strong>
                                        </label>
                                        <input
                                            id={`input-${input.name}`}
                                            type={input.type}
                                            name={input.name}
                                            onChange={(event) => handleInputField(input.name, event.target.checked)}
                                            className={input.className}
                                        />
                                    </div>
                                )
                            }

                        case 'select':
                            return (
                                <div key={input.name}>
                                    <label className="form-check-label w-100" htmlFor={`input-${input.name}`}>
                                        <strong>{input.label}</strong>
                                    </label>
                                    <select
                                        className={input.className}
                                        id={`input-${input.name}`}
                                        onChange={(event) => handleInputField(input.name, event.target.value)}
                                        name={input.name}
                                    >
                                        <option defaultValue={'selected'}>{input.placeholder}</option>
                                        {categories.map(({ name, id }) => {
                                            return (
                                                <option key={`cat-${name}`} value={id}>{name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            );

                        case 'file':
                            return (
                                <div key={input.name}>
                                    <label className="form-check-label w-100" htmlFor={"imageUpload"}>
                                        <strong>{input.label}</strong>
                                    </label>
                                    <input
                                        className={input.className}
                                        id="imageUpload"
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={(event) => handleInputField(input.name, event.target.files[0])}
                                        name={input.name}
                                    >
                                    </input>
                                </div>
                            );

                        default:
                            return (
                                <div key={input.name} className=" my-2">
                                    <label className="form-check-label" htmlFor={`input-${input.name}`}>
                                        <strong>{input.label}</strong>
                                    </label>
                                    <input
                                        id={`input-${input.name}`}
                                        type={input.type}
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        onChange={(event) => handleInputField(input.name, event.target.value)}
                                        className={input.className}
                                    />
                                </div>
                            )
                    }
                })}

                <button type="submit" className="btn btn-success my-3">Aggiungi</button>
            </form>
        </section>
    )
}

export default AddPhotoPage