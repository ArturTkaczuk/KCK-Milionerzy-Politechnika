import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from '../components/SidebarMenu';

/**
 * Component: SubjectSelection
 * Description: The main dashboard where users select a subject to play.
 * Handles fetching available subjects and managing the sidebar menu state.
 */

const SubjectSelection = () => {
    // Core data state
    const [subjects, setSubjects] = useState([]);
    const [debugUser, setDebugUser] = useState('265123'); // Default debug user ID

    // Context & Routing
    const { user, loading, logout } = useAuth(); // Removed unused loginSimulation
    const navigate = useNavigate();

    // UI state
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Redirect to login if no user is found
    useEffect(() => {
        if (!user && !loading) {
            navigate('/wikamp');
        } else if (user) {
            // If user is authenticated, load the subjects
            fetchSubjects();
        }
    }, [user, loading, navigate]);

    // Fetch subjects from the backend
    const fetchSubjects = async () => {
        try {
            // Using window.location.hostname to support LAN access
            const API_URL = `http://${window.location.hostname}:5000/api`;
            const res = await axios.get(`${API_URL}/subjects`, { withCredentials: true });

            // Assuming the API returns a clean array of subjects
            setSubjects(res.data);
        } catch (err) {
            console.error("Failed to fetch subjects:", err);
            // Could add UI error handling here later if needed
        }
    };

    // Navigation handler
    const handleSubjectClick = (slug) => {
        navigate(`/${slug}`);
    };

    return (
        <div className="min-vh-100 py-5">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-4">
                    <div className="d-inline-block p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <h1 className="m-0 display-4 fw-bold text-primary">Milionerzy PŁ</h1>
                    </div>
                </div>

                {/* User Info & Menu Controls */}
                {!user ? (
                    <div className="text-center">
                        <p>Przekierowanie do logowania...</p>
                    </div>
                ) : (
                    <div className="mb-4 p-4 rounded text-dark" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="m-0">
                                Witaj, <span className="text-primary">{user.name}</span> <small className="text-muted">({user.role})</small>
                            </h4>
                            <div className="d-flex gap-3">
                                <Button
                                    variant="outline-secondary"
                                    size="lg"
                                    onClick={() => setIsMenuOpen(true)}
                                    className="px-4"
                                >
                                    <i className="bi bi-list"></i> Menu
                                </Button>
                                <Button variant="outline-danger" size="lg" onClick={logout} className="px-4">
                                    Wyloguj
                                </Button>
                            </div>
                        </div>
                        <h3>Wybierz przedmiot</h3>
                    </div>
                )}

                {/* Admin Controls (Only visible to admin role) */}
                {user?.role === 'admin' && (
                    <div className="mb-4 text-center">
                        <Button variant="dark" size="lg" onClick={() => navigate('/admin')}>
                            Panel Administratora
                        </Button>
                    </div>
                )}

                {/* Subjects Grid */}
                <Row xs={1} md={2} lg={3} className="g-4">
                    {subjects.map(subject => (
                        <Col key={subject.id}>
                            <Card
                                className="h-100 shadow-sm hover-effect border-0"
                                onClick={() => handleSubjectClick(subject.slug)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }}
                            >
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center p-5 text-center">
                                    <Card.Title className="fs-3">{subject.name}</Card.Title>
                                    <Button variant="primary" className="mt-3 stretched-link">
                                        Rozpocznij grę
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {/* Empty State */}
                    {subjects.length === 0 && (
                        <Col className="w-100">
                            <Alert variant="info" className="text-center">
                                Brak dostępnych przedmiotów. Poproś prowadzącego o dodanie treści.
                            </Alert>
                        </Col>
                    )}
                </Row>
            </Container >

            {/* Sidebar Overlay */}
            <SidebarMenu show={isMenuOpen} handleClose={() => setIsMenuOpen(false)} />
        </div >
    );
};

export default SubjectSelection;
