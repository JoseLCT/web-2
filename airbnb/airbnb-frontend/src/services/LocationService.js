import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const getLocationList = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/locations`)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}