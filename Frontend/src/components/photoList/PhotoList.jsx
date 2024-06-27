import { useGlobal } from '../../contexts/GlobalContext'
import { useEffect, useState } from "react";
import axiosCustom from '../../utils/axiosInterceptor'
import { Link } from "react-router-dom";
import './photolist.scss'
const PhotoList = () => {

    const { setErrors } = useGlobal()
    const [photos, setPhotos] = useState([])
    const [images, setImages] = useState({});
    const [pageInfo, setPageInfo] = useState({
        page: null,
        totalPages: null
    });
    let endpoint = `http://localhost:3000/photos`;

    const fetchPhotoList = async (changePage) => {

        try {
            if (changePage) {
                endpoint = `http://localhost:3000/photos?page=${changePage}`
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

    useEffect(() => {
        fetchPhotoList(pageInfo.page)
    }, [pageInfo.page])

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
        }
    };

    const handleNextPage = () => {
        if (pageInfo.page < pageInfo.totalPages) {
            setPageInfo(prev => ({ ...prev, page: parseInt(prev.page) + 1 }));
        }
    };

    return (
        <section id='photo-list'>

            <ul className='row row-cols-3'>
                {
                    photos.map((photo, index) => {
                        return (
                            <li className='card col' key={`${photo}-${index}`}>
                                <Link className='text-decoration-none'>
                                    <figure>
                                        <img src={images[photo.title]} alt={photo.title} />
                                    </figure>
                                    <h4 className='text-center'>
                                        {photo.title}
                                    </h4>
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
}

export default PhotoList