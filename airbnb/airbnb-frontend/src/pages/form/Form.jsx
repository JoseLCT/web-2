import './form.css';
import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';
import { useFormik } from 'formik';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { createAccommodation, deleteImage, getAccommodation, insertImage, updateAccommodation } from '../../services/AccommodationService';
import { getLocationList, insertLocation } from '../../services/LocationService';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

const Form = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const center = { lat: -17.783333, lng: -63.166667 };
    const [map, setMap] = useState(null);
    const refAutocomplete = React.useRef(null);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [locationList, setLocationList] = useState([]);
    const toast = useRef(null);
    const [files, setFiles] = useState([]);
    const [formType, setFormType] = useState('create');
    const [accommodation, setAccommodation] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const accommodationTypes = [
        { name: 'Casa', code: 'house' },
        { name: 'Apartamento', code: 'apartment' },
        { name: 'Hotel', code: 'hotel' }
    ];


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        if (data && data.id) {
            setFormType('update');
            fetchAccommodation();
            return;
        }
        fetchLocationList();
    }, [token]);

    const fetchLocationList = () => {
        getLocationList()
            .then(response => {
                setLocationList(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onImageDelete = (id) => {
        setImagesToDelete([...imagesToDelete, id]);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'La imagen se eliminará al guardar', life: 3000 });
    }

    const fetchAccommodation = () => {
        getAccommodation(data.id)
            .then(response => {
                setAccommodation(response);
                formik.setFieldValue('name', response.name);
                formik.setFieldValue('address', response.address);
                formik.setFieldValue('type', accommodationTypes.find(item => item.name === response.type.charAt(0).toUpperCase() + response.type.slice(1)));
                formik.setFieldValue('description', response.description);
                formik.setFieldValue('rooms', response.rooms);
                formik.setFieldValue('beds', response.beds);
                formik.setFieldValue('bathrooms', response.bathrooms);
                formik.setFieldValue('capacity', response.capacity);
                formik.setFieldValue('wifi', response.wifi);
                formik.setFieldValue('nightPrice', response.night_price);
                formik.setFieldValue('cleaningFee', response.cleaning_fee);
                formik.setFieldValue('dates', [new Date(response.start_date), new Date(response.end_date)]);
                setLat(response.lat);
                setLng(response.lng);
                setCountry(response.location.country);
                setCity(response.location.city);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onAutoCompleteLoad = (autocomplete) => {
        refAutocomplete.current = autocomplete;
    };

    const onMapLoad = (map) => {
        setMap(map);
    };

    const onPlaceChanged = () => {
        if (refAutocomplete.current !== null) {
            const place = refAutocomplete.current.getPlace();
            const country = place.address_components.find(item => item.types.includes('country'));
            const city = place.address_components.find(item => item.types.includes('locality'));
            setCountry(country.long_name);
            setCity(city.long_name);
            if (place.geometry && place.geometry.location) {
                setLat(place.geometry.location.lat());
                setLng(place.geometry.location.lng());
                map.panTo(place.geometry.location.lat(), place.geometry.location.lng());
                map.setZoom(15);
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    }

    const onMapClick = (e) => {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    const onFileSelected = (e) => {
        setFiles(e.files);
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            type: '',
            description: '',
            rooms: null,
            beds: null,
            bathrooms: null,
            capacity: null,
            wifi: false,
            nightPrice: null,
            cleaningFee: null,
            dates: '',
            lat: '',
            lng: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.name) {
                errors.name = 'El nombre es requerido';
            }
            if (!data.address) {
                errors.address = 'La dirección es requerida';
            }
            if (!data.type) {
                errors.type = 'El tipo de alojamiento es requerido';
            }
            if (!data.description) {
                errors.description = 'La descripción es requerida';
            }
            if (!data.rooms) {
                errors.rooms = 'El número de habitaciones es requerido';
            }
            if (!data.beds) {
                errors.beds = 'El número de camas es requerido';
            }
            if (!data.bathrooms) {
                errors.bathrooms = 'El número de baños es requerido';
            }
            if (!data.capacity) {
                errors.capacity = 'La capacidad es requerida';
            }
            if (!data.nightPrice) {
                errors.nightPrice = 'El precio por noche es requerido';
            }
            if (!data.cleaningFee) {
                errors.cleaningFee = 'La tarifa de limpieza es requerida';
            }
            if (!data.dates) {
                errors.dates = 'Las fechas son requeridas';
            }
            return errors;
        },
        onSubmit: (data) => {
            const body = {};
            if (!lat && !lng) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Seleccione una ubicación', life: 3000 });
                return;
            }
            console.log(files);
            if (files.length === 0 && formType === 'create') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Seleccione al menos una imagen', life: 3000 });
                return;
            }
            const date_start_aux = data.dates[0].toISOString();
            const date_end_aux = data.dates[1].toISOString();
            body.lat = lat.toString();
            body.lng = lng.toString();
            body.start_date = date_start_aux.substring(0, 10);
            body.end_date = date_end_aux.substring(0, 10);
            body.cleaning_fee = data.cleaningFee;
            body.night_price = data.nightPrice;
            body.type = data.type.name.charAt(0).toLowerCase() + data.type.name.slice(1);
            body.wifi = data.wifi;
            body.capacity = data.capacity;
            body.bathrooms = data.bathrooms;
            body.beds = data.beds;
            body.rooms = data.rooms;
            body.description = data.description;
            body.address = data.address;
            body.name = data.name;
            if (formType === 'update') {
                body.location_id = accommodation.location_id;
                body.user_id = accommodation.user_id;
                updateAccommodation(token, accommodation.id, body).then(response => {
                    console.log(response);
                    for (let file of files) {
                        insertImage(token, data.id, file).then(response => {
                            console.log(response);
                        }).catch(error => {
                            console.log(error);
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir las imágenes', life: 3000 });
                        });
                    }
                    for (let id of imagesToDelete) {
                        deleteImage(token, id).then(response => {
                            console.log(response);
                        }).catch(error => {
                            console.log(error);
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar las imágenes', life: 3000 });
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
                return;
            }
            const location = locationList.find(item => item.city === city && item.country === country);
            if (location) {
                body.location_id = location.id;
                createAccommodation(token, body).then(response => {
                    console.log(response);
                    for (let file of files) {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Alojamiento registrado', life: 3000 });
                        insertImage(token, response.id, file).then(response => {
                            console.log(response);
                        }).catch(error => {
                            console.log(error);
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir las imágenes', life: 3000 });
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                const bodyLocation = {
                    city: city,
                    country: country,
                };
                insertLocation(token, bodyLocation).then(response => {
                    body.location_id = response.id;
                    createAccommodation(token, body).then(response => {
                        console.log(response);
                        for (let file of files) {
                            insertImage(token, response.id, file).then(response => {
                                console.log(response);
                            }).catch(error => {
                                console.log(error);
                                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir las imágenes', life: 3000 });
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    });

    return (
        <div className="form_page_container">
            <Toast ref={toast} />
            <div className="form_container">
                <div className="form_header">
                    <Button icon="pi pi-angle-left" className="btn_back p-button-rounded" onClick={() => navigate('/')} />
                    <h1>Formulario de registro</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="title"
                                value={formik.values.name}
                                onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                className={formik.errors.name ? 'p-invalid' : ''}
                            />
                            <label htmlFor="title">Título</label>
                        </span>

                        {formik.errors.name && <small className="p-error">{formik.errors.name}</small>}

                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="address"
                                value={formik.values.address}
                                onChange={(e) => formik.setFieldValue('address', e.target.value)}
                                className={formik.errors.address ? 'p-invalid' : ''}
                            />
                            <label htmlFor="address">Dirección</label>
                        </span>
                        {formik.errors.address && <small className="p-error">{formik.errors.address}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <Dropdown value={formik.values.type} id="type"
                                options={accommodationTypes} onChange={(e) => formik.setFieldValue('type', e.value)}
                                optionLabel="name" placeholder="Seleccione un tipo de alojamiento" />
                            <label htmlFor="type">Tipo de alojamiento</label>
                        </span>
                        {formik.errors.type && <small className="p-error">{formik.errors.type}</small>}
                    </div>

                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="description"
                                value={formik.values.description}
                                onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                className={formik.errors.description ? 'p-invalid' : ''}
                            />
                            <label htmlFor="description">Descripción</label>
                        </span>
                        {formik.errors.description && <small className="p-error">{formik.errors.description}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="rooms"
                                type='number'
                                value={formik.values.rooms}
                                onChange={(e) => formik.setFieldValue('rooms', e.target.value)}
                                className={formik.errors.rooms ? 'p-invalid' : ''}
                            />
                            <label htmlFor="rooms">Habitaciones</label>
                        </span>
                        {formik.errors.rooms && <small className="p-error">{formik.errors.rooms}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="beds"
                                type='number'
                                value={formik.values.beds}
                                onChange={(e) => formik.setFieldValue('beds', e.target.value)}
                                className={formik.errors.beds ? 'p-invalid' : ''}
                            />
                            <label htmlFor="beds">Camas</label>
                        </span>
                        {formik.errors.beds && <small className="p-error">{formik.errors.beds}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="bathrooms"
                                type='number'
                                value={formik.values.bathrooms}
                                onChange={(e) => formik.setFieldValue('bathrooms', e.target.value)}
                                className={formik.errors.bathrooms ? 'p-invalid' : ''}
                            />
                            <label htmlFor="bathrooms">Baños</label>
                        </span>
                        {formik.errors.bathrooms && <small className="p-error">{formik.errors.bathrooms}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="capacity"
                                type='number'
                                value={formik.values.capacity}
                                onChange={(e) => formik.setFieldValue('capacity', e.target.value)}
                                className={formik.errors.capacity ? 'p-invalid' : ''}
                            />
                            <label htmlFor="capacity">Capacidad</label>
                        </span>
                        {formik.errors.capacity && <small className="p-error">{formik.errors.capacity}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p">
                            <InputSwitch
                                id="wifi"
                                checked={formik.values.wifi}
                                onChange={(e) => formik.setFieldValue('wifi', e.value)}
                                className={formik.errors.wifi ? 'p-invalid' : ''}
                            />
                            <label htmlFor="wifi">Wifi</label>
                        </span>
                        {formik.errors.wifi && <small className="p-error">{formik.errors.wifi}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="nightPrice"
                                type='number'
                                value={formik.values.nightPrice}
                                onChange={(e) => formik.setFieldValue('nightPrice', e.target.value)}
                                className={formik.errors.nightPrice ? 'p-invalid' : ''}
                            />
                            <label htmlFor="nightPrice">Precio por noche</label>
                        </span>
                        {formik.errors.nightPrice && <small className="p-error">{formik.errors.nightPrice}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <InputText
                                id="cleaningFee"
                                type='number'
                                value={formik.values.cleaningFee}
                                onChange={(e) => formik.setFieldValue('cleaningFee', e.target.value)}
                                className={formik.errors.cleaningFee ? 'p-invalid' : ''}
                            />
                            <label htmlFor="cleaningFee">Tarifa de limpieza</label>
                        </span>
                        {formik.errors.cleaningFee && <small className="p-error">{formik.errors.cleaningFee}</small>}
                    </div>
                    <div className="form_input_container">
                        <span className="p-float-label">
                            <Calendar
                                id="dates"
                                value={formik.values.dates}
                                onChange={(e) => formik.setFieldValue('dates', e.value)}
                                className={formik.errors.dates ? 'p-invalid' : ''}
                                selectionMode="range"
                            />
                            <label htmlFor="dates">Fechas</label>
                        </span>
                        {formik.errors.dates && <small className="p-error">{formik.errors.dates}</small>}
                    </div>
                    <FileUpload
                        name="image"
                        url={'/api/upload'}
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={(e) => setFiles(e.files)}
                        onClear={() => setFiles([])}
                        onSelect={onFileSelected}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                    <Button type="submit" label="Submit" />
                </form>
                {formType === 'update' && accommodation && accommodation.images.map(item =>
                    <div className="img_url" key={item.id} style={{ width: '640px', height: '480px'}}>
                        <img key={item.id} src={apiUrl + item.url} alt="accommodation" />
                        <Button icon="pi pi-trash" className="btn_delete p-button-rounded" onClick={() => onImageDelete(item.id)} />
                    </div>
                )}
            </div>
            <div>
                {isLoaded &&
                    <div className="maps_form_container">
                        <GoogleMap
                            onLoad={onMapLoad}
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={center}
                            zoom={12}
                            onClick={onMapClick}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                                clickableIcons: false,
                            }}
                        >
                            {lat && lng &&
                                <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lng) }} />
                            }
                        </GoogleMap>
                        <Autocomplete className='autocomplete' onLoad={onAutoCompleteLoad} onPlaceChanged={onPlaceChanged} >
                            <InputText placeholder='Buscar ubicación' />
                        </Autocomplete>
                    </div>
                }
            </div>
        </div>
    );
}

export default Form;    