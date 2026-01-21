import React, { useState } from 'react';
import { Card, Button, Container, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WikampLogin = () => {
    const [debugUser, setDebugUser] = useState('265123');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]); // Dynamiczna lista użytkowników
    const { loginSimulation } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = `http://${window.location.hostname}:5000/api`;
                // Pobierz Przedmioty
                const subRes = await fetch(`${API_URL}/subjects`);
                if (subRes.ok) {
                    const data = await subRes.json();
                    setSubjects(data);
                    if (data.length > 0) setSelectedSubject('main_menu');
                }

                // Pobierz Użytkowników
                const userRes = await fetch(`${API_URL}/users`);
                if (userRes.ok) {
                    const data = await userRes.json();
                    setUsers(data);
                    // Domyślnie pierwszy student jeśli dostępny, w przeciwnym razie pierwszy użytkownik
                    if (data.length > 0) {
                        const student = data.find(u => u.role === 'student');
                        setDebugUser(student ? student.id : data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);

    const handleLogin = async () => {
        await loginSimulation(debugUser);
        if (selectedSubject === 'main_menu') {
            navigate('/');
        } else if (selectedSubject) {
            navigate(`/${selectedSubject}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <Container style={{ maxWidth: '500px' }}>
                <Card className="shadow-lg border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Card.Header className="bg-primary text-white text-center py-4">
                        <h2 className="mb-0">Logowanie Wikamp</h2>
                    </Card.Header>
                    <Card.Body className="p-4">


                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Wybierz użytkownika</Form.Label>
                            <Form.Select
                                size="lg"
                                value={debugUser}
                                onChange={(e) => setDebugUser(e.target.value)}
                                disabled={users.length === 0}
                            >
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.role === 'admin' ? 'Admin/Wykładowca' : 'Student'} - {u.id})
                                    </option>
                                ))}
                            </Form.Select>
                            {users.length === 0 && <Form.Text className="text-muted">Ładowanie użytkowników...</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Wybierz przedmiot</Form.Label>
                            <Form.Select
                                size="lg"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={subjects.length === 0}
                            >
                                <option value="main_menu" style={{ color: 'orange', fontWeight: 'bold' }}>Strona Główna</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.slug} style={{ color: 'black' }}>{s.name}</option>
                                ))}
                            </Form.Select>
                            {subjects.length === 0 && <Form.Text className="text-muted">Ładowanie przedmiotów...</Form.Text>}
                        </Form.Group>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100"
                            onClick={handleLogin}
                        >
                            {selectedSubject === 'main_menu' ? 'Zaloguj się' : 'Zaloguj i Rozpocznij'}
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default WikampLogin;
