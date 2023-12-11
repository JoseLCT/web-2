import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/login`, { email, password })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const register = (fullName, email, password) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/register`, { fullname: fullName, email, password })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });

}

export const getAccount = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/me`, {
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