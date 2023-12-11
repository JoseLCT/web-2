import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const getAccommodationList = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/accommodations`)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const getAccommodation = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/accommodations/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const getAccommodationListByUser = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/api/accommodations_token/me`, {
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

export const createAccommodation = (token, accommodation) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/accommodations`, accommodation, {
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

export const insertImage = (token, id, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/accommodations/${id}/images`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
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

export const updateAccommodation = (token, id, accommodation) => {
    return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/api/accommodations/${id}`, accommodation, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const deleteAccommodation = (token, id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/api/accommodations/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const deleteImage = (token, id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/api/accommodations/images/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const deleteAllImages = (token, id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/api/accommodations_all/${id}/images`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}