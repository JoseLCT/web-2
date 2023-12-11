import './user.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount } from "../../services/AccountService";
import { Button } from 'primereact/button';
import { deleteAccommodation, deleteAllImages, getAccommodationListByUser } from '../../services/AccommodationService';
import { Galleria } from 'primereact/galleria';
import { getReservationList } from '../../services/ReservationService';

const User = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [activeOption, setActiveOption] = useState('properties');
    const [accommodationList, setAccommodationList] = useState([]);
    const [reservationList, setReservationList] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        fetchUser();
    }, [token]);


    const itemTemplate = (item) => {
        return <img src={`${apiUrl}${item.url}`} style={{ width: '100%', display: 'block' }} />;
    }

    const fetchUser = () => {
        getAccount(token)
            .then(response => {
                setUser(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fetchAccommodationList = () => {
        getAccommodationListByUser(token)
            .then(response => {
                setAccommodationList(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fetchReservationList = () => {
        getReservationList(token)
            .then(response => {
                setReservationList(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    const onReservationClick = () => {
        setActiveOption('reservations');
        fetchReservationList();
    }

    const onPropertyClick = () => {
        setActiveOption('properties');
        fetchAccommodationList();
    }

    const onPropertyDelete = (id) => {
        deleteAllImages(token, id)
            .then(response => {
                console.log(response);
                deleteAccommodation(token, id)
                    .then(() => {
                        fetchAccommodationList();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });

    }

    const onReservationClickProperty = (id) => {
        setShowDialog(true);
    }

    return (
        <div className="user_page_container">
            <div className="user_header">
                <div className="logo_container" onClick={() => navigate('/')}>
                    <img className='logo' src="/src/assets/logo.png" alt="logo" />
                </div>
                <Button icon="pi pi-sign-out" className="logout_btn" onClick={onLogout} />
            </div>
            <div className="user_content">
                <div className="user_page_title_container">
                    <h1 className='user_page_title'>Cuenta</h1>
                    <p>{user?.fullname}, {user?.email}</p>
                </div>
                <div className="user_options">
                    <div className='option' onClick={onPropertyClick}>
                        <span className="pi pi-building"></span>
                        <p className='option_title'>Mis propiedades</p>
                        <p className='option_description'>Lista de propiedades registradas</p>
                    </div>
                    <div className='option' onClick={onReservationClick}>
                        <span className="pi pi-list"></span>
                        <p className='option_title'>Mis reservas</p>
                        <p className='option_description'>Lista de reservas realizadas</p>
                    </div>
                    <div className='option'>
                        <span className="pi pi-user-edit"></span>
                        <p className='option_title'>Editar perfil</p>
                        <p className='option_description'>Editar información de perfil</p>
                    </div>
                </div>
                {activeOption === 'properties' &&
                    <div className="user_properties">
                        <h2>Lista de propiedades</h2>
                        <Button label="Agregar propiedad" icon="pi pi-plus" className="btn_add p-button-rounded" onClick={() => navigate('/form')} />
                        <div className="properties_container">
                            {accommodationList && accommodationList.map(item =>
                                <div key={item.id} className='property'>
                                    <Galleria value={item.images} circular style={{ maxWidth: '640px' }}
                                        showIndicators showThumbnails={false} item={itemTemplate} showIndicatorsOnItem={true} />
                                    <div className="property_info">
                                        <h3>{item.name}</h3>
                                        <p>{item.address}</p>
                                        <div className="property_footer">
                                            <p>Bs. {item.night_price}</p>
                                            <div className="beds_quantity">
                                                <p>{item.beds}</p>
                                                <span className="pi pi-bed"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button label="Editar" icon="pi pi-pencil" className="btn_edit p-button-rounded" onClick={() => navigate('/form',
                                        { state: { id: item.id } }
                                    )} />
                                    <Button label="Eliminar" icon="pi pi-trash" className="btn_delete p-button-rounded" onClick={() => onPropertyDelete(item.id)} />
                                    <Button label="Ver reservas" icon="pi pi-list" className="btn_reservations p-button-rounded" onClick={onReservationClickProperty} />
                                </div>
                            )
                            }
                        </div>
                    </div>
                }
                {
                    activeOption === 'reservations' &&
                    <div className="user_reservations">
                        <h2>Lista de reservas</h2>
                        <div className="reservations_container">
                            {reservationList && reservationList.map(item =>
                                <div key={item.id} className='reservation'>
                                    <div className="reservation_info">
                                        <h3>{item.accommodation.name}</h3>
                                        <p>{item.accommodation.address}</p>
                                        <div className="reservation_footer">
                                            <p>Bs. {item.accommodation.night_price}</p>
                                            <div className="beds_quantity">
                                                <p>{item.accommodation.beds}</p>
                                                <span className="pi pi-bed"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button label="Ver detalles" icon="pi pi-list" className="btn_details p-button-rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default User;