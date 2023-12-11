import './filtered.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import { useEffect, useState } from "react";
import { getAccommodationList } from "../../services/AccommodationService";
import { Galleria } from 'primereact/galleria';
import { GoogleMap, InfoWindowF, Marker, useJsApiLoader } from '@react-google-maps/api';

const Filtered = () => {
    const location = useLocation();
    const data = location.state;
    const [accommodationList, setAccommodationList] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const center = { lat: -17.783333, lng: -63.166667 };
    const navigate = useNavigate();

    useEffect(() => {
        fetchAccommodationList();
    }, []);

    const fetchAccommodationList = () => {
        getAccommodationList()
            .then(response => {
                let filteredList = [];
                
                if (data.start_date && data.end_date) {
                    filteredList = response.filter(item => {
                        const startDate = new Date(data.start_date);
                        const endDate = new Date(data.end_date);
                        const itemStartDate = new Date(item.start_date);
                        const itemEndDate = new Date(item.end_date);
                        return (itemStartDate >= startDate && itemEndDate <= endDate);
                    });

                }
                if (data.location) {
                    for (let item of response) {
                        let countryAux = item.location.country;
                        let cityAux = item.location.city;
                        let country = data.location.country;
                        let city = data.location.city;
                        if (countryAux.toLowerCase() === country.toLowerCase() && cityAux.toLowerCase() === city.toLowerCase()) {
                            filteredList.push(item);
                        }
                    }
                }
                if (data.guests) {
                    filteredList = [...filteredList, ...response.filter(item => item.capacity >= data.guests)];
                }
                if (data.beds) {
                    filteredList = [...filteredList, ...response.filter(item => item.beds >= data.beds)];
                }
                if (data.baths) {
                    filteredList = [...filteredList, ...response.filter(item => item.baths >= data.baths)];
                }
                if (data.bedrooms) {
                    filteredList = [...filteredList, ...response.filter(item => item.bedrooms >= data.bedrooms)];
                }
                if (data.wifi) {
                    filteredList = [...filteredList, ...response.filter(item => item.wifi === data.wifi)];
                }
                if (data.rangeValues) {
                    filteredList = [...filteredList, ...response.filter(item => item.night_price >= data.rangeValues[0] && item.night_price <= data.rangeValues[1])];
                }

                setAccommodationList(filteredList);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onMarkerClick = (item) => {
        setActiveMarker(item);
        setShowInfoWindow(true);
    }

    const formatDate = (inputDate) => {
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        // eslint-disable-next-line no-unused-vars
        const [year, month, day] = inputDate.split('-');
        const monthIndex = parseInt(month, 10) - 1;
        const abbreviatedMonth = months[monthIndex];
        return `${day} ${abbreviatedMonth}.`;
    };

    const itemTemplate = (item) => {
        return <img src={`${apiUrl}${item.url}`} style={{ width: '100%', display: 'block' }} />;
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    return (
        <div className="filtered_container">
            <div className="filtered_menu_container">
                <Menu />
            </div>
            <div className="content">
                <div className="accommodation_list_container">
                    <div className="title_container">
                        <h3 className='title'>{accommodationList.length} alojamientos encontrados</h3>
                    </div>
                    <div className="accommodation_list">
                        {accommodationList && accommodationList.map(item =>
                            <div key={item.id} className='accommodation' onMouseEnter={() => onMarkerClick(item)} onMouseLeave={() => setShowInfoWindow(false)} >
                                <Galleria value={item.images} circular style={{ maxWidth: '640px' }}
                                    showIndicators showThumbnails={false} item={itemTemplate} showIndicatorsOnItem={true} />
                                <h3 className='title'>{item.name}</h3>
                                <p className='address'>{item.address}</p>
                                <div className='footer' onClick={() => navigate(`/accommodation/${item.id}`)}>
                                    <p>Bs. {item.night_price}</p>
                                    <div className="beds_quantity">
                                        <p className='beds'>{item.beds}</p>
                                        <span className='material-icons'>bed</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="map_container">
                    {isLoaded &&
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={center}
                            zoom={12}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
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
                                        <div className="info_window_information" onClick={() => navigate(`/accommodation/${activeMarker.id}`)}>
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
                    }
                </div>
            </div>
        </div>
    );
}

export default Filtered;