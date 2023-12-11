import './detail.css';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccommodation } from '../../services/AccommodationService';
import Menu from '../../components/Menu';
import { Divider } from 'primereact/divider';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

const Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [accommodation, setAccommodation] = useState(null);
    const [dates, setDates] = useState([]);
    const [adults, setAdults] = useState(1);
    const [kids, setKids] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [nightsQuantity, setNightsQuantity] = useState(0);
    const [totalNights, setTotalNights] = useState(0);
    const [totalServiceFee, setTotalServiceFee] = useState(0);
    const [total, setTotal] = useState(0);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchAccommodation();
    }, [id]);

    const fetchAccommodation = () => {
        getAccommodation(id)
            .then(response => {
                if (response) {
                    if (response.start_date && response.end_date) {
                        const now = new Date();
                        if (response.start_date < now) {
                            setMinDate(now);
                        }
                        if (response.end_date < now) {
                            setMaxDate(now);
                        }
                        const startDate = new Date(response.start_date);
                        const endDate = new Date(response.end_date);
                        setMinDate(startDate);
                        setMaxDate(endDate);
                    }
                }
                setAccommodation(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onKidsChange = (value) => {
        if (value < 0) {
            setKids(0);
        } else if ((value + adults) > 15) {
            setKids(15 - adults);
        } else {
            if (adults == 0) {
                setAdults(1);
            }
            setKids(value);
        }
    }

    const getTotal = (value) => {
        if (value && value[0] && value[1]) {
            let nights = value[1].getDate() - value[0].getDate();
            if (nights < 0) {
                nights = nights * -1;
            }
            const subtotal = accommodation.night_price * parseInt(nights);
            const serviceFee = subtotal * 0.1;
            const cleaningFee = parseInt(accommodation.cleaning_fee);
            const total = parseFloat(subtotal + serviceFee + cleaningFee).toFixed(2);
            setNightsQuantity(nights);
            setTotalNights(subtotal);
            setTotalServiceFee(serviceFee);
            setTotal(total);
        }
    }

    const onDateChange = (e) => {
        setDates(e.value);
        getTotal(e.value);
    }


    const onAdultsChange = (value) => {
        if (value < 1) {
            setAdults(1);
        } else if ((value + kids) > 15) {
            setAdults(15 - kids);
        } else {
            setAdults(value);
        }
    }

    const onReservationClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe iniciar sesión para reservar', life: 3000 });
            return;
        }
        if (!dates || !dates[0] || !dates[1]) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar las fechas de llegada y salida', life: 3000 });
            return;
        }
        if (adults == 0 && kids == 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos un huésped', life: 3000 });
            return;
        }
        const data = {
            id: accommodation.id,
            arrivalDate: dates[0].toISOString().split('T')[0],
            departureDate: dates[1].toISOString().split('T')[0],
            guests: adults + kids,
            total: total,
            nights: nightsQuantity,
        };
        navigate(`/checkout`, { state: data });
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    return (
        <div className='detail_container'>
            <Toast ref={toast} />
            <div className="detail_menu_container">
                <Menu />
            </div>
            <div className="content">
                <h1 className='title'>{accommodation?.name}</h1>
                <div className="images_container">
                    <img src={apiUrl + accommodation?.images[0].url} alt={accommodation?.name} className='main_image' />
                    <div className="secondary_images">
                        {accommodation?.images.slice(1, 5).map(image =>
                            <img key={image.id} src={apiUrl + image.url} alt={accommodation?.name} />
                        )}
                    </div>
                </div>
                <div className="information_container">
                    <div className="information">
                        <p>
                            <span>{accommodation?.capacity} huéspedes</span> · <span>{accommodation?.type.charAt(0).toUpperCase() + accommodation?.type.slice(1)}</span> · <span>{accommodation?.beds} camas</span> · <span>{accommodation?.bathrooms} baños</span> · <span>{accommodation?.wifi ? 'Con wifi' : 'Sin wifi'}</span>
                        </p>
                        <p className='description'>{accommodation?.description}</p>
                        <Divider />
                        <div className="host_container">
                            <span className='material-icons'>account_circle</span>
                            <div className="host_information">
                                <h3>Anfitrión: {accommodation?.user.first_name}</h3>
                                <p>{accommodation?.user.email}</p>
                            </div>
                        </div>
                        <Divider />
                        <div className="address_container">
                            <h3>Dirección</h3>
                            <p>{accommodation?.address}</p>
                            <div className="google_map_container">
                                {isLoaded &&
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={{ lat: parseFloat(accommodation?.lat), lng: parseFloat(accommodation?.lng) }}
                                        zoom={15}
                                        options={{
                                            streetViewControl: false,
                                            mapTypeControl: false,
                                            fullscreenControl: false,
                                            clickableIcons: false,
                                        }}
                                    >
                                        <Marker key={accommodation?.id} position={{ lat: parseFloat(accommodation?.lat), lng: parseFloat(accommodation?.lng) }} />
                                    </GoogleMap>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="reservation_container">
                        <div className="reservation">
                            <div className="price_container">
                                <h3 className='price'>Bs. {accommodation?.night_price} <span>noche</span></h3>
                            </div>
                            <div className="options_reservation_container">
                                <div className='option'>
                                    <Calendar id='dates_reservation' selectionMode="range" dateFormat="dd M" value={dates} onChange={onDateChange} readOnlyInput minDate={minDate} maxDate={maxDate} placeholder="Fecha de llegada y salida" />
                                    <label htmlFor="dates_reservation">Llegada y salida</label>
                                </div>
                                <div className='option'>
                                    <InputText id='guests_reservation' value={(adults + kids) > 1 ? `${adults + kids} huéspedes` : `${adults + kids} huésped`} readOnly onClick={() => setDialogVisible(true)} />
                                    <label htmlFor="guests_reservation">Huéspedes</label>
                                    {dialogVisible &&
                                        <div className='guests_dialog'>
                                            <div className='guests_container'>
                                                <div className="info">
                                                    <h4>Adultos</h4>
                                                    <p>Edad: 13 o más</p>
                                                </div>
                                                <div className="guest_input_container">
                                                    <Button icon="pi pi-minus" className='decrement' onClick={() => onAdultsChange(adults - 1)} />
                                                    <p>{adults}</p>
                                                    <Button icon="pi pi-plus" className='increment' onClick={() => onAdultsChange(adults + 1)} />
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className='guests_container'>
                                                <div className="info">
                                                    <h4>Niños</h4>
                                                    <p>Edad: 2 a 12</p>
                                                </div>
                                                <div className="guest_input_container">
                                                    <Button icon="pi pi-minus" className='decrement' onClick={() => onKidsChange(kids - 1)} />
                                                    <p>{kids}</p>
                                                    <Button icon="pi pi-plus" className='increment' onClick={() => onKidsChange(kids + 1)} />
                                                </div>
                                            </div>
                                            <div className="btn_container">
                                                <Button label="Cerrar" className='btn_close' onClick={() => setDialogVisible(false)} />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <Button label="Reservar" className='btn_reservation' onClick={onReservationClick} />
                            {dates && dates[0] && dates[1] &&
                                <div className="total_container">
                                    <p className='info'>No se hará ningún cargo por el momento</p>
                                    <div className="total_content">
                                        <p>Bs. {accommodation.night_price} x {nightsQuantity} {nightsQuantity > 1 ? 'noches' : 'noche'}</p>
                                        <p>Bs. {totalNights}</p>
                                    </div>
                                    <div className="total_content">
                                        <p>Tarifa de limpieza</p>
                                        <p>Bs. {accommodation.cleaning_fee}</p>
                                    </div>
                                    <div className="total_content">
                                        <p>Tarifa por servicio de Airbnb</p>
                                        <p>Bs. {totalServiceFee}</p>
                                    </div>
                                    <Divider className='total_divider' />
                                    <div className="total_content total">
                                        <p>Total</p>
                                        <p>Bs. {total}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;