import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Form, Modal } from "react-bootstrap";
import { getListaEquipos, insertEquipo, updateEquipo, deleteEquipo } from '../services/EquipoService.js';

const App = () => {
    const navigate = useNavigate();
    const [equipoList, setEquipoList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const [id, setId] = useState(0);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        fetchListaEquipos();
    }, [])

    const fetchListaEquipos = () => {
        getListaEquipos().then(response => {
            setEquipoList(response)
        }).catch((error) => {
            console.log(error);
        });
    }

    const onEditClick = (equipo) => {
        setId(equipo.id);
        setNombre(equipo.nombre);
        setDescripcion(equipo.descripcion);
        setShowModal(true);
    }

    const onDeleteClick = (id) => {
        const confirm = window.confirm('Estas seguro de eliminar este equipo?');
        if (!confirm) return;
        deleteEquipo(id).then(response => {
            console.log(response);
            fetchListaEquipos();
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
            update();
        } else {
            insert();
        }
    }

    const onCreateClick = () => {
        setId(0);
        setNombre('');
        setDescripcion('');
        setShowModal(true);
    }

    const insert = () => {
        insertEquipo({ nombre, descripcion })
            .then(response => {
                console.log(response);
                setShowModal(false);
                fetchListaEquipos();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const update = () => {
        updateEquipo({ nombre, descripcion }, id)
            .then(response => {
                console.log(response);
                setShowModal(false);
                fetchListaEquipos();
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Lista de equipos</h1>
                <Button variant="primary" onClick={() => onCreateClick()}>
                    Nuevo equipo
                </Button>
            </div>
            {equipoList && equipoList.map((equipo) => (
                <Card key={equipo.id} style={{ marginTop: '1rem' }}>
                    <CardHeader>
                        <CardTitle>{equipo.nombre}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <p>{equipo.descripcion}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '0.5rem' }}>
                            <Button variant="primary" onClick={() => navigate('/equipo/' + equipo.id)}>
                                Ver canales
                            </Button>
                            <Button variant="warning" onClick={() => onEditClick(equipo)}>
                                Editar
                            </Button>
                            <Button variant="danger" onClick={() => onDeleteClick(equipo.id)}>
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
                        <div>
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese una descripcion.
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

export default App