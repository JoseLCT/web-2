import './menu.css';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from 'primereact/autocomplete';
import { getLocationList } from '../services/LocationService';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import { login, register } from '../services/AccountService';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

const Menu = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);
    const [dates, setDates] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [authDialogVisible, setAuthDialogVisible] = useState(false);
    const [authDialogType, setAuthDialogType] = useState('login');
    const toast = useRef(null);
    const [showFilters, setShowFilters] = useState(false);
    const [rangeValues, setRangeValues] = useState([1, 100]);
    const[wifi , setWifi] = useState(null);
    const [beds, setBeds] = useState(null);
    const [baths, setBaths] = useState(null);
    const [bedrooms, setBedrooms] = useState(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = () => {
        getLocationList()
            .then(response => {
                response.forEach(location => {
                    location.label = `${location.city}, ${location.country}`;
                });
                setLocations(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const autocomplete = (event) => {
        setTimeout(() => {
            let filteredLocations;
            if (!event.query.trim().length) {
                filteredLocations = [...locations];
            }
            else {
                filteredLocations = locations.filter((location) => {
                    return location.country.toLowerCase().startsWith(event.query.toLowerCase()) || location.city.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredLocations(filteredLocations);
        }, 250);
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

    const onAdultsChange = (value) => {
        if (value < 1) {
            if (kids == 0) {
                setAdults(0);
            } else {
                setAdults(1);
            }
        } else if ((value + kids) > 15) {
            setAdults(15 - kids);
        } else {
            setAdults(value);
        }
    }

    const onSearchClick = () => {
        setDialogVisible(false);
        const data = {
            location: selectedLocation,
            guests: adults + kids,
            dates: dates,
            wifi: wifi,
            beds: beds,
            baths: baths,
            bedrooms: bedrooms,
            rangeValues: rangeValues
        };
        navigate('/filtered', { state: data });
    }

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.fullName && authDialogType === 'register') {
                errors.fullName = 'El nombre completo es requerido.';
            }
            if (!data.email) {
                errors.email = 'El correo electrónico es requerido.';
            }
            if (!data.password) {
                errors.password = 'La contraseña es requerida.';
            }
            return errors;
        },
        onSubmit: (data) => {
            if (authDialogType === 'register') {
                register(data.fullName, data.email, data.password).then(() => {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso. Por favor inicia sesión.' });
                    formik.resetForm();
                    setAuthDialogType('login');
                }).catch(error => {
                    if (error.response.status === 400) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El correo electrónico ya existe.' });
                    }
                });
            } else if (authDialogType === 'login') {
                login(data.email, data.password).then(response => {
                    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso.' });
                    localStorage.setItem('token', response.access_token);
                    formik.resetForm();
                    setAuthDialogVisible(false);
                }).catch(error => {
                    if (error.response.status === 401) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Correo electrónico o contraseña incorrectos.' });
                    }
                });
            }
        }
    });

    const onUserClick = () => {
        if (localStorage.getItem('token')) {
            navigate('/user');
        } else {
            setAuthDialogVisible(true);
        }
    }

    const onHideDialog = () => {
        setAuthDialogVisible(false);
        formik.resetForm();
    }

    const onFooterActionClick = () => {
        setAuthDialogType(authDialogType === 'login' ? 'register' : 'login');
        formik.resetForm();
    }

    const onFilterClick = () => {
        setShowFilters(true);
    }

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-valid"></small>;
    };

    return (
        <div className="menu">
            <Toast ref={toast} />
            <div className="logo_container" onClick={() => navigate('/')}>
                <img className='logo' src="/src/assets/logo.png" alt="logo" />
            </div>
            <div className="options_container">
                <div className='input_container'>
                    <AutoComplete id='places' placeholder="Explora destinos" value={selectedLocation} suggestions={filteredLocations} completeMethod={autocomplete} field="label" onChange={(e) => setSelectedLocation(e.value)} />
                    <label htmlFor="places">Dónde</label>
                </div>
                <div className='input_container'>
                    <Calendar id='dates' selectionMode="range" dateFormat="dd M" value={dates} onChange={(e) => setDates(e.value)} readOnlyInput minDate={new Date()} placeholder="Fecha de llegada y salida" />
                    <label htmlFor="dates">Llegada y salida</label>
                </div>
                <div className='input_container guests_container'>
                    <InputText id='guests' value={(adults + kids) > 0 ? `${adults + kids} huésped(es)` : ''} readOnly onClick={() => setDialogVisible(true)} placeholder='Cuántos?' />
                    <label htmlFor="guests">Huéspedes</label>
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
                        </div>
                    }
                </div>
                <Button icon="pi pi-search" className="btn_search p-button-rounded" onClick={onSearchClick} />
                <Button icon="pi pi-filter" className="btn_filter p-button-rounded" onClick={onFilterClick} />
            </div>
            <div className='user_container' onClick={onUserClick}>
                <span className="material-icons menu_icon">menu</span>
                <span className="material-icons user_icon">account_circle</span>
            </div>
            <Dialog className='auth_dialog' header="Iniciar sesión o registrarse" visible={authDialogVisible} draggable={false} onHide={onHideDialog}
                style={{ width: '570px' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <h2>Te damos la bienvenida a Airbnb</h2>
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    {authDialogType === 'register' &&
                        <div className="input_form">
                            <span className="p-float-label">
                                <InputText
                                    id="fullName"
                                    name="fullName"
                                    value={formik.values.fullName}
                                    onChange={(e) => {
                                        formik.setFieldValue('fullName', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('fullName') })}
                                />
                                <label htmlFor="fullName">Nombre completo</label>
                            </span>
                            {getFormErrorMessage('fullName')}
                        </div>
                    }
                    <div className="input_form">
                        <span className="p-float-label">
                            <InputText
                                id="email"
                                name="email"
                                type='email'
                                value={formik.values.email}
                                onChange={(e) => {
                                    formik.setFieldValue('email', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
                            />
                            <label htmlFor="email">Correo electrónico</label>
                        </span>
                        {getFormErrorMessage('email')}
                    </div>
                    <div className="input_form">
                        <span className="p-float-label">
                            <Password
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={(e) => {
                                    formik.setFieldValue('password', e.target.value);
                                }}
                                toggleMask
                                feedback={false}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('password') })}
                            />
                            <label htmlFor="password">Contraseña</label>
                        </span>
                        {getFormErrorMessage('password')}
                    </div>
                    <Button className='btn_save' type="submit" label={authDialogType === 'login' ? 'Iniciar sesión' : 'Registrarse'} />
                    <p className='auth_dialog_footer'>{authDialogType === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'} <span className='link' onClick={onFooterActionClick}>{authDialogType === 'login' ? 'Regístrate' : 'Inicia sesión'}</span></p>
                </form>
            </Dialog>

            <Dialog className='filters_dialog' header="Filtros" visible={showFilters} draggable={false} onHide={() => setShowFilters(false)}
                style={{ width: '570px' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <h2>Filtros</h2>
                <div className="input_form">
                    <span className="p-float-label">
                        <InputText
                            id="places"
                            name="places"
                            value={selectedLocation?.label}
                            readOnly
                        />
                        <label htmlFor="places">Dónde</label>
                    </span>
                </div>
                <div className='input_container'>
                    <Calendar id='dates' selectionMode="range" dateFormat="dd M" value={dates} onChange={(e) => setDates(e.value)} readOnlyInput minDate={new Date()} placeholder="Fecha de llegada y salida" />
                    <label htmlFor="dates">Llegada y salida</label>
                </div>
                <InputText value={rangeValues} readOnly />
                <Slider value={rangeValues} onChange={(e) => setRangeValues(e.value)} range  min={1} max={100} style={{ width: '100%' }} />
                <Divider />
                <TriStateCheckbox value={wifi} onChange={(e) => setWifi(e.value)} />
                <InputText value={wifi} readOnly placeholder='Wifi' />
                <Divider />
                <InputText value={beds} type='number' onChange={(e) => setBeds(e.target.value)} placeholder='Camas' />
                <Divider />
                <InputText value={baths} type='number' onChange={(e) => setBaths(e.target.value)} placeholder='Baños' />
                <Divider />
                <InputText value={bedrooms} type='number' onChange={(e) => setBedrooms(e.target.value)} placeholder='Habitaciones' />
                <Divider />
                
                <div className='input_container guests_container'>
                    <InputText id='guests' value={(adults + kids) > 0 ? `${adults + kids} huésped(es)` : ''} readOnly onClick={() => setDialogVisible(true)} placeholder='Cuántos?' />
                    <label htmlFor="guests">Huéspedes</label>
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
                                    <Button icon
                                        ="pi pi-plus" className='increment' onClick={() => onKidsChange(kids + 1)} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <Button className='btn_save' label='Aplicar filtros' onClick={onSearchClick} />
            </Dialog>
        </div >
    );
}
export default Menu;