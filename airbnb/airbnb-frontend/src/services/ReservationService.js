import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const getReservationList = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/reservations_token/me`, {
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

export const insertReservation = (token, body) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/reservations`, body, {
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

export const getReservationListByAccommodation = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/reservations_accommodation/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}