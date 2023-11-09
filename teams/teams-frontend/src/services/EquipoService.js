import axios from "axios";

const API_URL = 'http://localhost:8080/teams/index.php?controller=equipo';

export const getListaEquipos = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + '&action=list')
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const insertEquipo = (equipo) => {
    return new Promise((resolve, reject) => {
        axios.post(API_URL + '&action=insert', equipo)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

export const updateEquipo = (canal, id) => {
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

export const deleteEquipo = (id) => {
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