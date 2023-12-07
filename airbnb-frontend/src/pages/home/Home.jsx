
import './Home.css';
import { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { getAccommodationList } from "../../services/AccommodationService";
import { Galleria } from 'primereact/galleria';
import "primereact/resources/themes/lara-light-indigo/theme.css";

import 'primeicons/primeicons.css';
import Menu from '../../components/Menu';



const Home = () => {
    const API_URL = "http://127.0.0.1:8000";
    const [accommodationList, setAccommodationList] = useState([]);
    const itemTemplate = (item) => {
        return <img src={`${API_URL}${item.url}`} style={{ width: '100%', display: 'block' }} />;
    }

    useEffect(() => {
        fetchAccommodationList();
    }, []);

    const fetchAccommodationList = () => {
        getAccommodationList()
            .then(response => {
                setAccommodationList(response);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onClickMap = () => {
        window.location.href = "/map";
    }

    return (
        <div className='container'>
            <Menu />
            <div className="accommodation_container">
                {accommodationList && accommodationList.map(item =>
                    <div key={item.id} className='accommodation'>
                        <Galleria value={item.images} circular style={{ maxWidth: '640px' }}
                            showIndicators showThumbnails={false} item={itemTemplate} showIndicatorsOnItem={true} />
                        <h3 className='title'>{item.name}</h3>
                        <p className='address'>{item.address}</p>
                        <div className='footer'>
                            <p>Bs. {item.night_price}</p>
                            <div className="beds_quantity">
                                <p className='beds'>{item.beds}</p>
                                <span className='material-icons'>bed</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Button label="Mostrar mapa" icon="pi pi-map" severity="secondary" className="btn_map p-button-rounded" onClick={onClickMap} />
        </div>
    );
}
export default Home;
