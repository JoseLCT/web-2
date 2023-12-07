import './menu.css';
import { useEffect, useState } from "react";
import { AutoComplete } from 'primereact/autocomplete';
import { getLocationList } from '../services/LocationService';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';


const Menu = () => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [dates, setDates] = useState(null);
    const [adults, setAdults] = useState(0);
    const [kids, setKids] = useState(0);

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
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const search = (event) => {
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

    return (
        <div className="menu">
            <AutoComplete placeholder="Lugar" value={selectedLocation} suggestions={filteredLocations} completeMethod={search} field="label" onChange={(e) => setSelectedLocation(e.value)} />
            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput minDate={new Date()} placeholder="Fecha" />
            <InputNumber inputId="adults" value={adults} onValueChange={(e) => setAdults(e.value)} showButtons min={0} max={25} />
            <InputNumber inputId="kids" value={kids} onValueChange={(e) => setKids(e.value)} showButtons min={0} max={25} />
            <Button icon="pi pi-user" rounded severity="secondary" aria-label="User" />
        </div>
    );
}
export default Menu;