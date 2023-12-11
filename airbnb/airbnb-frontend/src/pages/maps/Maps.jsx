import './maps.css';
import { useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, InfoWindowF } from '@react-google-maps/api';
import { useEffect, useState } from "react";
import { getAccommodationList } from "../../services/AccommodationService";
import Menu from '../../components/Menu';
import { InputText } from 'primereact/inputtext';
import { Galleria } from 'primereact/galleria';

const Maps = () => {
    const [accommodationList, setAccommodationList] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [map, setMap] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const refAutocomplete = useRef(null);
    const center = { lat: -17.783333, lng: -63.166667 };


    useEffect(() => {
        fetchAccommodationList();
    }, []);

    const fetchAccommodationList = () => {
        getAccommodationList()
            .then(response => {
                setAccommodationList(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onMarkerClick = (item) => {
        setActiveMarker(item);
        setShowInfoWindow(true);
    }

    const itemTemplate = (item) => {
        return <img src={`${apiUrl}${item.url}`} style={{ width: '100%', display: 'block' }} />;
    }

    const onAutoCompleteLoad = (autocomplete) => {
        refAutocomplete.current = autocomplete;
    };

    const onMapLoad = (map) => {
        setMap(map);
    };

    const formatDate = (inputDate) => {
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        // eslint-disable-next-line no-unused-vars
        const [year, month, day] = inputDate.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const abbreviatedMonth = months[monthIndex];
        return `${day} ${abbreviatedMonth}.`;
    };

    const onPlaceChanged = () => {
        if (refAutocomplete.current !== null) {
            const place = refAutocomplete.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                map.panTo({ lat, lng });
                map.setZoom(16);
            }
        }
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    return isLoaded ? (
        <div className='maps_container'>
            <div className="maps_menu_container">
                <Menu />
            </div>
            <div className="google_map_container">
                <GoogleMap
                    onLoad={onMapLoad}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={12}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        zoomControl: false,
                        clickableIcons: false,
                    }}
                >
                    {accommodationList && accommodationList.map(item =>
                        <Marker key={item.id} position={{ lat: parseFloat(item.lat), lng: parseFloat(item.lng) }} onClick={() => onMarkerClick(item)} />
                    )}
                    {showInfoWindow &&
                        <InfoWindowF position={{ lat: parseFloat(activeMarker.lat), lng: parseFloat(activeMarker.lng) }} onCloseClick={() => setShowInfoWindow(false)} >
                            <>
                                <Galleria className='galleria' value={activeMarker.images} circular style={{ maxWidth: '640px' }}
                                    showIndicators showThumbnails={false} item={itemTemplate} showIndicatorsOnItem={true} />
                                <div className="info_window_information">
                                    <h3 className='title'>{activeMarker.name}</h3>
                                    <div className='footer'>
                                        <p className='price'>Bs.{activeMarker.night_price} <span>noche</span></p>
                                        <p>{formatDate(activeMarker.start_date)} - {formatDate(activeMarker.end_date)}</p>
                                    </div>
                                </div>
                            </>
                        </InfoWindowF>
                    }
                </GoogleMap>
                <Autocomplete className='autocomplete' onLoad={onAutoCompleteLoad} onPlaceChanged={onPlaceChanged} >
                    <InputText placeholder='Buscar ubicación' />
                </Autocomplete>
            </div>
        </div>
    ) : <></>
}

export default Maps;