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

export const insertLocation = (token, location) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/locations`, location, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}