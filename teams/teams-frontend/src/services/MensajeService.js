import axios from "axios";

const API_URL = 'http://localhost:8080/teams/index.php?controller=mensaje';

export const getListaMensajes = (fk_canal) => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + '&action=listByCanal&id=' + fk_canal)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const insertMensaje = (mensaje) => {
    return new Promise((resolve, reject) => {
        axios.post(API_URL + '&action=insert', mensaje)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const updateMensaje = (mensaje, id) => {
    return new Promise((resolve, reject) => {
        axios.put(API_URL + '&action=update&id=' + id, mensaje)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const deleteMensaje = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(API_URL + '&action=delete&id=' + id)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const saveImage = (file, id) => {
    const formData = new FormData();
    formData.append('img', file);
    return new Promise((resolve, reject) => {
        axios.post(API_URL + '&action=saveImage&id=' + id, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                resolve(response.data);
            }
            ).catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}