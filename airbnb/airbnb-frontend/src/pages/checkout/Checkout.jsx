import './checkout.css';
import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { getAccommodation } from '../../services/AccommodationService';
import { insertReservation } from '../../services/ReservationService';
import { Toast } from 'primereact/toast';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const data = location.state;
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiration, setCardExpiration] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [accommodation, setAccommodation] = useState(null);
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!data) {
            return;
        }
        if (!token) {
            navigate('/');
        }
        fetchAccommodation();
    }, [data]);


    const fetchAccommodation = () => {
        getAccommodation(data.id)
            .then(response => {
                setAccommodation(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onNumberCardChange = (e) => {
        const value = e.target.value;
        if (value.length < cardNumber.length) {
            setCardNumber(value);
            return;
        }
        setCardNumber(value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim());
    }

    const onExpirationCardChange = (e) => {
        const value = e.target.value;
        if (value.length < cardExpiration.length) {
            setCardExpiration(value);
            return;
        }
        if (value.length === 2) {
            setCardExpiration(value + '/');
            return;
        } else {
            setCardExpiration(value);
        }
    }

    const onReservation = () => {
        const body = {
            owner_id: accommodation.user_id,
            accommodation_id: accommodation.id,
            start_date: data.arrivalDate,
            end_date: data.departureDate,
            card_name: cardName,
            card_number: cardNumber.replace(/\s?/g, ''),
            card_expiration: cardExpiration,
            card_cvv: cardCvv,
        }
        insertReservation(token, body)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Reserva realizada', detail: 'Tu reserva se realizó con éxito', life: 3000 });
                navigate('/');
            })
            .catch(error => {
                console.log(error);
            });
    }

    const formatDate = (inputDate) => {
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        // eslint-disable-next-line no-unused-vars
        const [year, month, day] = inputDate.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const abbreviatedMonth = months[monthIndex];
        return `${day} ${abbreviatedMonth}.`;
    };


    return (
        <div className="checkout_container">
            <Toast ref={toast} />
            <div className="checkout_header">
                <div className="logo_container" onClick={() => navigate('/')}>
                    <img className='logo' src="/src/assets/logo.png" alt="logo" />
                </div>
            </div>
            <div className="checkout_content">
                <div className="checkout_information_container">
                    <div className="checkout_title_container">
                        <Button className="checkout_button" icon="pi pi-chevron-left" onClick={() => navigate('/accommodation/1')} />
                        <h1>Solicita reservar</h1>
                    </div>
                    <div className="data_container">
                        <h2>Tu viaje</h2>
                        <h3>Fechas</h3>
                        <p>{formatDate(data.arrivalDate)} - {formatDate(data.departureDate)}</p>
                        <h3>Huéspedes</h3>
                        <p>{data.guests > 1 ? `${data.guests} huéspedes` : `${data.guests} huésped`}</p>
                        <Divider className='divider' />
                        <div className="payment_container">
                            <div className="header_payment">
                                <h2>Paga con</h2>
                                <div className="methods_container">
                                    <img src="/src/assets/logo_visa.svg" alt="visa" />
                                    <img src="/src/assets/logo_amex.svg" alt="amex" />
                                    <img src="/src/assets/logo_mastercard.svg" alt="mastercard" />
                                    <img src="/src/assets/logo_discover.svg" alt="discover" />
                                    <img src="/src/assets/logo_paypal.svg" alt="paypal" />
                                    <img src="/src/assets/logo_googlepay.svg" alt="googlepay" />
                                </div>
                            </div>
                            <div className="card_container">
                                <InputText
                                    id="card_name"
                                    name="card_name"
                                    type='text'
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder='Nombre de la tarjeta'
                                />
                                <span className="p-input-icon-left">
                                    <i className="pi pi-credit-card"></i>
                                    <InputText
                                        keyfilter="pint"
                                        placeholder="Número de tarjeta"
                                        id="card_number"
                                        name="card_number"
                                        onChange={onNumberCardChange}
                                        value={cardNumber}
                                        maxLength={19}
                                    />
                                </span>
                                <div className="card_footer">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-calendar"></i>
                                        <InputText
                                            placeholder="MM/AA"
                                            id="card_expiration"
                                            name="card_expiration"
                                            keyfilter={/^[0-9]+$/}
                                            maxLength={5}
                                            onChange={onExpirationCardChange}
                                            value={cardExpiration}
                                        />
                                    </span>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-lock"></i>
                                        <InputText
                                            placeholder="CVV"
                                            type='password'
                                            id="card_cvv"
                                            name="card_cvv"
                                            keyfilter={/^[0-9]+$/}
                                            maxLength={3}
                                            onChange={(e) => setCardCvv(e.target.value)}
                                            value={cardCvv}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='checkout_accommodation_container'>
                    {accommodation &&
                        <div className="accommodation_content">
                            <div className="accommodation_header">
                                <img src={apiUrl + accommodation?.images[0].url} alt="accommodation" />
                                <div className='title_container'>
                                    <p>{accommodation.location.city}</p>
                                    <h2>{accommodation.name}</h2>
                                </div>
                            </div>
                            <Divider className='divider' />
                            <div className='price_checkout'>
                                <h3>Información del precio</h3>
                                <div className="price_container">
                                    <div className="price">
                                        <p>Bs. {accommodation.night_price} x {data.nights} noches</p>
                                        <p>Bs. {accommodation.night_price * data.nights}</p>
                                    </div>
                                    <div className="price">
                                        <p>Tarifa de limpieza</p>
                                        <p>Bs. {accommodation.cleaning_fee}</p>
                                    </div>
                                    <div className="price">
                                        <p>Tarifa por servicio de Airbnb</p>
                                        <p>Bs. {((accommodation.night_price * data.nights) * 0.1).toFixed(2)}</p>
                                    </div>
                                </div>
                                <Divider className='divider' />
                                <div className="price total">
                                    <p>Total</p>
                                    <p>Bs. {data.total}</p>
                                </div>
                            </div>
                        </div>
                    }
                    <Button className="checkout_button" label="Solicitar reserva" onClick={onReservation} />
                </div>
            </div>
        </div>
    );
}

export default Checkout;