import { useGlobal } from '../../contexts/GlobalContext'
import { useEffect, useState } from "react";
import axiosCustom from '../../utils/axiosInterceptor'
import { Link } from "react-router-dom";
import './photolist.scss'
const PhotoList = () => {

    const { setErrors } = useGlobal()
    const [photos, setPhotos] = useState([])
    const [images, setImages] = useState('');
    const [pageInfo, setPageInfo] = useState({
        page: null,
        totalPages: null
    });

    const setupFilters = {
        searchTerm: "",
        orderBy: ""
    }
    const [filters, setFilters] = useState(setupFilters);

    const handleFilter = (name, value) => {
        setFilters(current => ({
            ...current,
            [name]: value
        }));
    }
    const handleFiltersSubmit = (e) => {
        //e.preventDefault()
        const filterSearchTerm = `${filters.searchTerm ? `searchTerm=${filters.searchTerm}` : ''}`
        const filterOrderBy = `${filters.orderBy ? `orderBy=${filters.orderBy}` : ''}`
        let filter;
        if (filterSearchTerm && filterOrderBy) {
            filter = `?${filterSearchTerm}&${filterOrderBy}`
        } else {
            if (filterSearchTerm) { filter = `?${filterSearchTerm}` }
            else { filter = `?${filterOrderBy}` }
        }

        fetchPhotoList(null, filter)
    }

    const fetchPhotoList = async (changePage, filter) => {
        let endpoint = `http://localhost:3000/photos`;

        try {
            if (changePage) {
                endpoint = `http://localhost:3000/photos?page=${changePage}`
            }


            if (filter) {
                endpoint = `http://localhost:3000/photos${filter}`
            }

            const response = await axiosCustom.get(endpoint)
            const photoData = response.data.data

            setPageInfo({
                page: response.data.page,
                totalPages: response.data.totalPages
            })

            setPhotos(photoData)

        } catch (err) {
            setErrors([err.message])
        }
    }

    const fetchPic = async (imageName, title) => {
        const imagesEndpoint = "http://127.0.0.1:3000/photos";
        try {
            const res = await axiosCustom.get(`${imagesEndpoint}/${imageName}`, { responseType: 'blob' });
            const image = URL.createObjectURL(res.data)
            setImages(prevImages => ({ ...prevImages, [title]: image }));
            // salvataggio delle immagini

        } catch (error) {
            console.error("immagine non trovata")
        }
    }

    const formattedTitle = (title) => {
        return title.split("-").join(' ')
    }

    useEffect(() => {
        fetchPhotoList(pageInfo.page)
    }, [])

    useEffect(() => {
        photos.forEach(photo => {
            if (photo.image) {
                fetchPic(photo.image, photo.title);
            }
        });
    }, [photos])


    const handlePrevPage = () => {
        if (pageInfo.page > 1) {
            setPageInfo(prev => ({ ...prev, page: parseInt(prev.page) - 1 }));
            fetchPhotoList(parseInt(pageInfo.page - 1))
        }
    };

    const handleNextPage = () => {

        if (pageInfo.page < pageInfo.totalPages) {
            setPageInfo(prev => ({ ...prev, page: parseInt(prev.page) + 1 }));
            fetchPhotoList(parseInt(pageInfo.page + 1))
        }
    };

    return (
        <>
            {
                photos && photos.length > 0 ?
                    (
                        <section id='photo-list'>
                            <div>
                                <h3 className='text-center mb-4'>Galleria</h3>
                                <form onSubmit={handleFiltersSubmit}>
                                    <div className="input-group input-group-sm mb-3">
                                        <span className="input-group-text" >Filtra per:</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='searchTerm'
                                            placeholder="Inserisci un testo da filtrare"
                                            onChange={(event) => handleFilter('searchTerm', event.target.value)}
                                        />
                                    </div>
                                    <select
                                        className="form-select"
                                        name='orderBy'
                                        onChange={(event) => handleFilter('orderBy', event.target.value)}>
                                        <option defaultValue>Ordina per data</option>
                                        <option value="asc">Crescente</option>
                                        <option value="desc">Descrescente</option>
                                    </select>
                                    <div className='submit'>
                                        <button type='submit' className="btn btn-success">Filtra</button>
                                    </div>
                                </form>
                            </div>
                            <ul className='row row-cols-3'>
                                {
                                    photos.map((photo, index) => {
                                        return (
                                            <li className='card col' key={`${photo}-${index}`}>
                                                <Link className='text-decoration-none'>
                                                    <figure>
                                                        <img src={images[photo.title]} alt={photo.title} />
                                                    </figure>
                                                    <h5 className='text-center'>
                                                        {formattedTitle(photo.title)}
                                                    </h5>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                            <div className='text-center my-4'>
                                <div className='pagination text-center'>
                                    <button
                                        onClick={handlePrevPage}
                                        className={pageInfo.page == 1 ? "disabled" : ''}>
                                        Previous
                                    </button>

                                    <button className='isActive'>
                                        {pageInfo.page} di {pageInfo.totalPages}
                                    </button>

                                    <button
                                        onClick={handleNextPage}
                                        className={pageInfo.page == pageInfo.totalPages ? "disabled" : ''}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </section>
                    )
                    :
                    (
                        <section id='photo-list'>
                            <h3 className='text-center mb-4'>Non ho trovato foto da mostrare</h3>
                        </section>
                    )

            }
        </>
    )
}

export default PhotoList