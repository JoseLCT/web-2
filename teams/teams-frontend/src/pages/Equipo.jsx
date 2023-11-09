import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Form, Modal } from "react-bootstrap";
import { getListaCanales, insertCanal, updateCanal, deleteCanal } from '../services/CanalService.js';

const Equipo = () => {
    const navigate = useNavigate();
    const [canalList, setCanalList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const [id, setId] = useState(0);
    const { fk_equipo } = useParams();
    const [nombre, setNombre] = useState('');
    
    useEffect(() => {
        if (!fk_equipo) navigate('/');
        fetchListaCanales();
    }, [fk_equipo])

    const fetchListaCanales = () => {
        getListaCanales(fk_equipo)
            .then(response => {
                setCanalList(response)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onEditClick = (canal) => {
        setId(canal.id);
        setNombre(canal.nombre);
        setShowModal(true);
    }

    const onDeleteClick = (id) => {
        const confirm = window.confirm('Estas seguro de eliminar este canal?');
        if (!confirm) return;
        deleteCanal(id)
            .then(response => {
                console.log(response);
                fetchListaCanales();
            })
            .catch((error) => {
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
            update();
        } else {
            insert();
        }
    }

    const onCreateClick = () => {
        setId(0);
        setNombre('');
        setShowModal(true);
    }

    const insert = () => {
        insertCanal({ nombre, fk_equipo })
            .then(response => {
                console.log(response);
                setShowModal(false);
                fetchListaCanales();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const update = () => {
        updateCanal({nombre, fk_equipo}, id)
            .then(response => {
                console.log(response);
                setShowModal(false);
                fetchListaCanales();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const hideModal = () => {
        setValidated(false);
        setShowModal(false);
    }

    return (
        <div className="container" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Volver
                </Button>
                <h1>Lista de canales</h1>
                <Button variant="primary" style={{ marginLeft: 'auto' }} onClick={() => onCreateClick()}>
                    Nuevo canal
                </Button>
            </div>
            {canalList && canalList.map((canal) => (
                <Card key={canal.id} style={{ marginTop: '1rem' }}>
                    <CardHeader>
                        <CardTitle>{canal.nombre}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '0.5rem' }}>
                            <Button variant="primary" onClick={() => navigate('/canal/' + canal.id)}>
                                Chat
                            </Button>
                            <Button variant="warning" onClick={() => onEditClick(canal)}>
                                Editar
                            </Button>
                            <Button variant="danger" onClick={() => onDeleteClick(canal.id)}>
                                Eliminar
                            </Button>
                        </div>
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
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese un nombre.
                            </Form.Control.Feedback>
                        </div>
                        <Button variant="primary" type="submit" style={{ marginTop: '1rem', float: 'right' }}>
                            Guardar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Equipo;