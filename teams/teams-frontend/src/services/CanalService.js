import axios from "axios";

const API_URL = 'http://localhost:8080/teams/index.php?controller=canal';

export const getListaCanales = (fk_equipo) => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + '&action=listByEquipo&id=' + fk_equipo)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const insertCanal = (canal) => {
    return new Promise((resolve, reject) => {
        axios.post(API_URL + '&action=insert', canal)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const updateCanal = (canal, id) => {
    return new Promise((resolve, reject) => {
        axios.put(API_URL + '&action=update&id=' + id, canal)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const deleteCanal = (id) => {
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