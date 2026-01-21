import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from '../components/SidebarMenu';

const SubjectSelection = () => {
    const [subjects, setSubjects] = useState([]);
    const [debugUser, setDebugUser] = useState('265123');
    const { user, loading, loginSimulation, logout } = useAuth();
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!user && !loading) {
            navigate('/wikamp');
        } else if (user) {
            fetchSubjects();
        }
    }, [user, loading, navigate]);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/subjects', { withCredentials: true });
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubjectClick = (slug) => {
        navigate(`/${slug}`);
    };

    return (
        <div className="min-vh-100 bg-light py-5">
            <Container>
                <div className="d-flex align-items-center mb-4 position-relative">
                    <h1 className="flex-grow-1 text-center m-0 display-4 fw-bold text-primary">Milionerzy PŁ</h1>
                </div>

                {!user ? (
                    <div className="text-center">
                        <p>Przekierowanie do logowania...</p>
                    </div>
                ) : (
                    <div className="mb-5 text-start">
                        <h4 className="mb-3">Witaj, <span className="text-primary">{user.name}</span> ({user.role})</h4>
                        <div className="d-flex justify-content-start gap-3">
                            <Button variant="outline-secondary" size="lg" onClick={() => setShowMenu(true)} className="px-4">
                                <i className="bi bi-list"></i> Menu
                            </Button>
                            <Button variant="outline-danger" size="lg" onClick={logout} className="px-4">Wyloguj</Button>
                        </div>
                    </div>
                )}

                {user?.role === 'admin' && (
                    <div className="mb-4 text-center">
                        <Button variant="dark" size="lg" onClick={() => navigate('/admin')}>Panel Administratora</Button>
                    </div>
                )}

                <h3 className="mb-3">Wybierz przedmiot</h3>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {subjects.map(subject => (
                        <Col key={subject.id}>
                            <Card className="h-100 shadow-sm hover-effect" onClick={() => handleSubjectClick(subject.slug)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center p-5 text-center">
                                    <Card.Title className="fs-3">{subject.name}</Card.Title>
                                    <Button variant="primary" className="mt-3 stretched-link">Rozpocznij grę</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {subjects.length === 0 && (
                        <Col>
                            <Alert variant="info">Brak dostępnych przedmiotów. Administratorzy mogą je dodać.</Alert>
                        </Col>
                    )}
                </Row>
            </Container>

            <SidebarMenu show={showMenu} handleClose={() => setShowMenu(false)} />
        </div>
    );
};

export default SubjectSelection;
