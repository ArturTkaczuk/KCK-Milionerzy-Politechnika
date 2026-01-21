import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Button, Table, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [key, setKey] = useState('subjects');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [questions, setQuestions] = useState([]);

    // Stan formularzy
    const [newSubjectName, setNewSubjectName] = useState('');


    // Formularz pytania
    const [editingQuestion, setEditingQuestion] = useState(null); // null = nowe
    const [qForm, setQForm] = useState({ content: '', answer_a: '', answer_b: '', answer_c: '', answer_d: '', correct_answer: 'A', difficulty: 1 });
    const [showQModal, setShowQModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchQuestions(selectedSubject.slug);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            const res = await axios.get(`${API_URL}/subjects`, { withCredentials: true });
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchQuestions = async (slug) => {
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            const res = await axios.get(`${API_URL}/subjects/${slug}/questions`, { withCredentials: true });
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        const slug = newSubjectName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            await axios.post(`${API_URL}/subjects`, { name: newSubjectName, slug }, { withCredentials: true });
            setNewSubjectName('');
            fetchSubjects();
        } catch (err) {
            alert(err.response?.data?.error || 'Błąd podczas tworzenia przedmiotu');
        }
    };

    const handleSaveQuestion = async () => {
        if (!selectedSubject) return;
        try {
            // Dostosuj formularz do formatu oczekiwanego przez API
            const payload = {
                content: qForm.content,
                answers: { A: qForm.answer_a, B: qForm.answer_b, C: qForm.answer_c, D: qForm.answer_d },
                correct_answer: qForm.correct_answer,
                difficulty: parseInt(qForm.difficulty)
            };

            const API_URL = `http://${window.location.hostname}:5000/api`;
            if (editingQuestion) {
                // AKTUALIZACJA
                await axios.put(`${API_URL}/questions/${editingQuestion.id}`, payload, { withCredentials: true });
                alert('Pytanie zaktualizowane!');
            } else {
                // UTWÓRZ
                await axios.post(`${API_URL}/subjects/${selectedSubject.slug}/questions`, payload, { withCredentials: true });
                alert('Pytanie utworzone!');
            }

            setShowQModal(false);
            setEditingQuestion(null); // Resetuj
            fetchQuestions(selectedSubject.slug);
        } catch (err) {
            alert(err.response?.data?.error || 'Błąd zapisywania pytania');
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to pytanie?")) return;
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            await axios.delete(`${API_URL}/questions/${id}`, { withCredentials: true });
            fetchQuestions(selectedSubject.slug);
        } catch (err) {
            alert('Błąd usuwania pytania');
        }
    };

    const openEditModal = (q) => {
        setEditingQuestion(q);
        setQForm({
            content: q.content,
            answer_a: q.answer_a,
            answer_b: q.answer_b,
            answer_c: q.answer_c,
            answer_d: q.answer_d,
            correct_answer: q.correct_answer,
            difficulty: q.difficulty
        });
        setShowQModal(true);
    };



    const handleDeleteSubject = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten przedmiot? To usunie WSZYSTKIE powiązane pytania.")) return;
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            await axios.delete(`${API_URL}/subjects/${id}`, { withCredentials: true });
            fetchSubjects();
            setSelectedSubject(null);
        } catch (err) {
            alert('Błąd usuwania przedmiotu');
        }
    };

    return (
        <Container fluid className="min-vh-100 py-4">
            <Container className="p-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Panel Administratora</h2>
                    <Button variant="outline-secondary" onClick={() => navigate('/')}>Powrót do strony głównej</Button>
                </div>

                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                    <Tab eventKey="subjects" title="Przedmioty">
                        <Row>
                            <Col md={4}>
                                <div className="p-3 border rounded bg-light mb-3">
                                    <h5>Utwórz nowy przedmiot</h5>
                                    <Form onSubmit={handleCreateSubject}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nazwa przedmiotu</Form.Label>
                                            <Form.Control type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} required />
                                        </Form.Group>
                                        <Button type="submit" variant="success">Utwórz</Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <h5>Istniejące przedmioty</h5>
                                <Table striped hover>
                                    <thead><tr><th>ID</th><th>Nazwa</th><th>Slug</th><th>Akcje</th></tr></thead>
                                    <tbody>
                                        {subjects.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.id}</td>
                                                <td>{s.name}</td>
                                                <td>{s.slug}</td>
                                                <td>
                                                    <Button size="sm" variant="primary" className="me-2" onClick={() => { setSelectedSubject(s); setKey('questions'); }}>Zarządzaj pytaniami</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDeleteSubject(s.id)}>Usuń</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="questions" title="Pytania" disabled={!selectedSubject}>
                        {selectedSubject && (
                            <div>
                                <h4>Zarządzanie: <span className="text-primary">{selectedSubject.name}</span></h4>
                                <div className="d-flex gap-2 mb-3">
                                    <Button variant="success" onClick={() => { setEditingQuestion(null); setQForm({ content: '', answer_a: '', answer_b: '', answer_c: '', answer_d: '', correct_answer: 'A', difficulty: 1 }); setShowQModal(true); }}>
                                        + Dodaj nowe pytanie
                                    </Button>
                                </div>



                                <Table striped bordered responsive>
                                    <thead><tr><th>#</th><th>Trudność</th><th>Pytanie</th><th>Poprawna</th><th>Akcje</th></tr></thead>
                                    <tbody>
                                        {questions.map((q, idx) => (
                                            <tr key={q.id}>
                                                <td>{idx + 1}</td>
                                                <td><span className={`badge bg-${q.difficulty === 1 ? 'success' : q.difficulty === 2 ? 'info' : q.difficulty === 3 ? 'warning' : 'danger'}`}>Trud. {q.difficulty}</span></td>
                                                <td>{q.content.substring(0, 50)}...</td>
                                                <td>{q.correct_answer}</td>
                                                <td>
                                                    <Button size="sm" variant="warning" className="me-2" onClick={() => openEditModal(q)}>Edytuj</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDeleteQuestion(q.id)}>Usuń</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {questions.length === 0 && <tr><td colSpan="5" className="text-center">Brak pytań. Dodaj jakieś!</td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Tab>
                </Tabs>

                {/* Dodawanie/Edycja Pytania */}
                <Modal show={showQModal} onHide={() => setShowQModal(false)} size="lg">
                    <Modal.Header closeButton><Modal.Title>{editingQuestion ? 'Edytuj pytanie' : 'Dodaj pytanie'}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Treść pytania</Form.Label>
                                <Form.Control as="textarea" rows={3} value={qForm.content} onChange={e => setQForm({ ...qForm, content: e.target.value })} />
                            </Form.Group>
                            <Row>
                                <Col><Form.Group className="mb-2"><Form.Label>Odpowiedź A</Form.Label><Form.Control value={qForm.answer_a} onChange={e => setQForm({ ...qForm, answer_a: e.target.value })} /></Form.Group></Col>
                                <Col><Form.Group className="mb-2"><Form.Label>Odpowiedź B</Form.Label><Form.Control value={qForm.answer_b} onChange={e => setQForm({ ...qForm, answer_b: e.target.value })} /></Form.Group></Col>
                            </Row>
                            <Row>
                                <Col><Form.Group className="mb-2"><Form.Label>Odpowiedź C</Form.Label><Form.Control value={qForm.answer_c} onChange={e => setQForm({ ...qForm, answer_c: e.target.value })} /></Form.Group></Col>
                                <Col><Form.Group className="mb-2"><Form.Label>Odpowiedź D</Form.Label><Form.Control value={qForm.answer_d} onChange={e => setQForm({ ...qForm, answer_d: e.target.value })} /></Form.Group></Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3"><Form.Label>Poprawna odpowiedź</Form.Label>
                                        <Form.Select value={qForm.correct_answer} onChange={e => setQForm({ ...qForm, correct_answer: e.target.value })}>
                                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                        </Form.Select></Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3"><Form.Label>Trudność (1-4)</Form.Label>
                                        <Form.Select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })}>
                                            <option value="1">1 (Łatwy)</option><option value="2">2 (Średni)</option><option value="3">3 (Trudny)</option><option value="4">4 (Ekspert)</option>
                                        </Form.Select></Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowQModal(false)}>Anuluj</Button>
                        <Button variant="primary" onClick={handleSaveQuestion}>Zapisz pytanie</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Container>
    );
};

export default AdminDashboard;
