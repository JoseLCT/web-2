import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardSubtitle, CardTitle, Form, Modal } from "react-bootstrap";
import { getListaMensajes, insertMensaje, updateMensaje, deleteMensaje, saveImage } from '../services/MensajeService.js';

const Canal = () => {
    const navigate = useNavigate();
    const [mensajeList, setMensajeList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const [id, setId] = useState(0);
    const { fk_canal } = useParams();
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [imagen, setImagen] = useState(null);
    const [tipo, setTipo] = useState('');

    useEffect(() => {
        if (!fk_canal) navigate('/');
        fetchListaMensajes();
    }, [fk_canal])

    const fetchListaMensajes = () => {
        getListaMensajes(fk_canal).then(response => {
            setMensajeList(response)
        }).catch((error) => {
            console.log(error);
        });
    }

    const onEditClick = (canal) => {
        setId(canal.id);
        setNombreUsuario(canal.nombre_usuario);
        setTitulo(canal.titulo);
        setContenido(canal.contenido);
        setTipo(canal.tipo);
        setShowModal(true);
    }

    const onDeleteClick = (id) => {
        const confirm = window.confirm('Estas seguro de eliminar este mensaje?');
        if (!confirm) return;
        deleteMensaje(id).then(response => {
            console.log(response);
            fetchListaMensajes();
        }).catch((error) => {
            console.log(error);
        });
    }

    const onFormSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        const isValid = form.checkValidity();
        setValidated(true);
        if (!isValid) return;
        guardar();
        setValidated(false);
    }

    const guardar = () => {
        if (id) {
            updateMensaje(
                {
                    nombre_usuario,
                    titulo,
                    contenido,
                    tipo,
                    fk_canal
                },
                id
            ).then(response => {
                console.log(response);
                if (tipo == 2 && imagen) {
                    saveImage(imagen, id).then(response => {
                        console.log(response);
                        setShowModal(false);
                        fetchListaMensajes();
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    setShowModal(false);
                    fetchListaMensajes();
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            insertMensaje(
                {
                    nombre_usuario,
                    titulo,
                    contenido,
                    tipo,
                    fk_canal
                }
            ).then(response => {
                console.log(response);
                if (tipo == 2) {
                    saveImage(imagen, response.id).then(response => {
                        console.log(response);
                        setShowModal(false);
                        fetchListaMensajes();
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    setShowModal(false);
                    fetchListaMensajes();
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const hideModal = () => {
        setValidated(false);
        setShowModal(false);
    }

    const onCreateMessageClick = () => {
        setId(0);
        setNombreUsuario('');
        setTitulo('');
        setContenido('');
        setTipo(1);
        setShowModal(true);
    }

    const onCreateImageClick = () => {
        setId(0);
        setNombreUsuario('');
        setTitulo('');
        setContenido('');
        setTipo(2);
        setShowModal(true);
    }

    return (
        <div className="container" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Volver
                </Button>
                <h1>Chat</h1>
                <Button variant="secondary" onClick={() => onCreateMessageClick()}>
                    Nuevo mensaje
                </Button>
                <Button variant="success" onClick={() => onCreateImageClick()}>
                    Nuevo mensaje con imagen
                </Button>
            </div>
            {mensajeList && mensajeList.map((mensaje) => (
                <Card key={mensaje.id} style={{ marginTop: '1rem' }} className="message">
                    <CardHeader className="message_header">
                        <CardSubtitle>Remitente: {mensaje.nombre_usuario}</CardSubtitle>
                        <CardTitle>{mensaje.titulo}</CardTitle>
                        <Button variant="primary" onClick={() => onEditClick(mensaje)} style={{ marginRight: '0.5rem' }}>
                            Editar
                        </Button>
                        <Button variant="danger" onClick={() => onDeleteClick(mensaje.id)}>
                            Eliminar
                        </Button>
                    </CardHeader>
                    <CardBody>
                        {mensaje.tipo == 1 ?
                            <p>{mensaje.contenido}</p>
                            :
                            <img src={"http://localhost:8080/teams/img/mensajes/" + mensaje.id + "." + mensaje.contenido} style={{ height: '500px' }} />
                        }
                    </CardBody>
                </Card>
            ))}
            <Modal
                show={showModal}
                onHide={() => hideModal()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                        <div>
                            <Form.Label>Nombre del emisor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del emisor"
                                name="nombre"
                                value={nombre_usuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese un nombre.
                            </Form.Control.Feedback>
                        </div>
                        <div>
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Titulo"
                                name="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese un titulo.
                            </Form.Control.Feedback>
                        </div>
                        {tipo == 1 ?
                            <div>
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mensaje"
                                    name="mensaje"
                                    value={contenido}
                                    onChange={(e) => setContenido(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un mensaje.
                                </Form.Control.Feedback>
                            </div>
                            :
                            <div>
                                <Form.Label>Imagen</Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Imagen"
                                    accept=".jpg, .jpeg, .png"
                                    name="imagen"
                                    onChange={(e) => {
                                        setImagen(e.target.files[0])
                                        setContenido(e.target.files[0].name.split('.')[1])
                                    }}
                                    required={id == 0}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese una imagen.
                                </Form.Control.Feedback>
                            </div>
                        }
                        <Button variant="primary" type="submit" style={{ marginTop: '1rem', float: 'right' }}>
                            Guardar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Canal;