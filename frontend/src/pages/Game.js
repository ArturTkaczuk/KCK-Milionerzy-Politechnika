/**
 * Component: Game
 * Description: Main game controller.
 * Handles the game loop, timer, lifelines, and score submission.
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MONEY_LADDER = [
    500, 1000, 2000, 5000, 10000,
    20000, 40000, 75000, 125000,
    250000, 500000, 1000000
];

const Game = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [gameState, setGameState] = useState('loading');  // loading, playing, won, lost, error
    const [timer, setTimer] = useState(600); // 10 minut
    const [lifelines, setLifelines] = useState({ fifty: true, audience: true, phone: true });
    const [hiddenAnswers, setHiddenAnswers] = useState([]); // Tablica 'A', 'B'...
    const [modalContent, setModalContent] = useState(null); // { title: '', body: '' }

    useEffect(() => {
        fetchGame();
    }, [slug]);

    // Timer Logic: Decrement every second if game is active
    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    endGame('lost'); // Auto-lose when time expires
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState]);

    const fetchGame = async () => {
        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            const res = await axios.get(`${API_URL}/subjects/${slug}/questions/game`, { withCredentials: true });
            if (res.data.length < 12) {
                setGameState('error');
            } else {
                setQuestions(res.data);
                setGameState('playing');
                setTimer(600);
            }
        } catch (err) {
            console.error(err);
            setGameState('error');
            setModalContent({ title: 'Error', body: err.response?.data?.error || err.message });
        }
    };

    const [history, setHistory] = useState([]); // [{ question_id, selected_answer, is_correct }]

    const endGame = async (result) => {
        // wynik: 'won', 'lost', 'walkaway'
        setGameState(result);

        let score = 0;
        const currentMoney = currentQIndex > 0 ? MONEY_LADDER[currentQIndex - 1] : 0;

        if (result === 'won') {
            score = 1000000;
        } else if (result === 'walkaway') {
            score = currentMoney;
        } else {
            // Przegrana - Logika progów gwarantowanych (0, 1000, 40000)
            if (currentQIndex > 6) score = 40000;
            else if (currentQIndex > 1) score = 1000;
            else score = 0;
        }

        try {
            const API_URL = `http://${window.location.hostname}:5000/api`;
            await axios.post(`${API_URL}/game/submit`, {
                subject_slug: slug,
                score,
                answers: history
            }, { withCredentials: true });
        } catch (err) {
            console.error(err);
        }
    };


    const handleWalkAway = () => {
        if (window.confirm("Czy na pewno chcesz zakończyć grę i odebrać obecną wygraną?")) {
            endGame('walkaway');
        }
    };

    const handleAnswer = (choice) => {
        const currentQ = questions[currentQIndex];
        const isCorrect = choice === currentQ.correct_answer;

        // Dodaj do historii
        const newHistory = [...history, {
            question_id: currentQ.id,
            selected_answer: choice,
            is_correct: isCorrect
        }];
        setHistory(newHistory);

        if (isCorrect) {
            // Poprawna
            import('../utils/audio').then(a => a.playCorrect());
            if (currentQIndex === 11) {
                import('../utils/audio').then(a => a.playWin());
                endGame('won');
            } else {
                setCurrentQIndex(prev => prev + 1);
                setHiddenAnswers([]);
                setTimer(600);
            }
        } else {
            // Błędna
            import('../utils/audio').then(a => a.playWrong());
            endGame('lost');
        }
    };

    const useFiftyFifty = () => {
        if (!lifelines.fifty) return;
        setLifelines(prev => ({ ...prev, fifty: false }));

        const currentQ = questions[currentQIndex];
        const wrongs = ['A', 'B', 'C', 'D'].filter(k => k !== currentQ.correct_answer);
        // Ukryj 2 losowe błędne
        const shuffled = wrongs.sort(() => 0.5 - Math.random());
        setHiddenAnswers(shuffled.slice(0, 2));
    };

    const useAudience = () => {
        if (!lifelines.audience) return;
        setLifelines(prev => ({ ...prev, audience: false }));

        const currentQ = questions[currentQIndex];
        // Fałszywe statystyki: Poprawna odpowiedź otrzymuje 40-80%, inne dzielą resztę
        const correct = currentQ.correct_answer;
        const correctPerc = Math.floor(Math.random() * 40) + 40; // 40-80
        const remainder = 100 - correctPerc;

        setModalContent({
            title: 'Pytanie do Publiczności',
            body: `Publiczność zagłosowała:\n${correct}: ${correctPerc}%\n(Reszta: ${remainder}%)` // Uproszczone wyświetlanie
        });
    };

    const usePhone = () => {
        if (!lifelines.phone) return;
        setLifelines(prev => ({ ...prev, phone: false }));

        const currentQ = questions[currentQIndex];
        // Logika podpowiedzi: Poprawna odpowiedź z 80% pewności jeśli Łatwe, 50% jeśli Trudne
        const confidence = currentQ.difficulty === 1 ? 0.9 : currentQ.difficulty >= 3 ? 0.4 : 0.7;
        const isCorrect = Math.random() < confidence;
        const suggested = isCorrect ? currentQ.correct_answer : 'A'; // Zapasowa błędna

        setModalContent({
            title: 'Telefon do Przyjaciela',
            body: `Przyjaciel mówi: "Jestem na ${Math.floor(confidence * 100)}% pewien, że to ${suggested}."`
        });
    };

    if (gameState === 'loading') return <Container className="mt-5 text-center"><h2>Ładowanie gry dla przedmiotu: {slug}...</h2></Container>;
    if (gameState === 'error') return <Container className="mt-5 text-center"><Alert variant="danger">Błąd: {modalContent?.body || 'Nie udało się załadować gry.'}</Alert><Button onClick={() => navigate('/')}>Powrót</Button></Container>;
    if (gameState === 'won') return <Container className="mt-5 text-center"><div className="display-1 text-success">WYGRAŁEŚ MILION!</div><Button size="lg" className="mt-3" onClick={() => navigate('/')}>Strona Główna</Button></Container>;
    if (gameState === 'walkaway') {
        return (
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="p-5 rounded text-center text-dark" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', width: '100%' }}>
                    <div className="display-1 text-primary fw-bold mb-4">Koniec Gry</div>
                    <h3 className="mb-4">Zdecydowałeś się odejść z kwotą: <span className="text-warning fw-bold">{currentQIndex > 0 ? MONEY_LADDER[currentQIndex - 1] : 0} $</span></h3>
                    <Button size="lg" variant="primary" className="px-5" onClick={() => navigate('/')}>Strona Główna</Button>
                </div>
            </Container>
        );
    }
    if (gameState === 'lost') {
        let score = 0;
        // Przeliczanie dla spójności wyświetlania (lub można zapisać w stanie)
        if (currentQIndex > 6) score = 40000;
        else if (currentQIndex > 1) score = 1000;
        return (
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="p-5 rounded text-center text-dark" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', width: '100%' }}>
                    <div className="display-1 text-danger fw-bold mb-4">PRZEGRANA</div>
                    <h3 className="mb-4">Wygrywasz: <span className="text-primary fw-bold">{score} $</span></h3>
                    <Button size="lg" variant="primary" className="px-5" onClick={() => navigate('/')}>Strona Główna</Button>
                </div>
            </Container>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <Container fluid className="min-vh-100 text-white p-4">
            <Row className="h-100 g-4">
                <Col md={9} className="d-flex flex-column justify-content-center p-4 rounded" style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                    <div className="mb-4 d-flex justify-content-between">
                        <h3>Pytanie {currentQIndex + 1}/12</h3>
                        <h3><Badge bg="secondary">Czas: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</Badge></h3>
                    </div>

                    <Card className="text-dark mb-4 text-center p-4">
                        <Card.Body>
                            <Card.Title className="display-6">{currentQ.content}</Card.Title>
                        </Card.Body>
                    </Card>

                    <Row className="g-3">
                        {['A', 'B', 'C', 'D'].map(opt => (
                            <Col md={6} key={opt}>
                                <Button
                                    variant="outline-light"
                                    className="w-100 p-3 fs-4 text-start"
                                    onClick={() => handleAnswer(opt)}
                                    disabled={hiddenAnswers.includes(opt)}
                                    style={{ visibility: hiddenAnswers.includes(opt) ? 'hidden' : 'visible' }}
                                >
                                    <span className="text-warning fw-bold">{opt}:</span> {currentQ[`answer_${opt.toLowerCase()}`]}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-5 d-flex flex-wrap gap-3 justify-content-center align-items-center">
                        <Button variant={lifelines.fifty ? "primary" : "secondary"} disabled={!lifelines.fifty} onClick={useFiftyFifty} className="flex-grow-1">50:50</Button>
                        <Button variant={lifelines.audience ? "primary" : "secondary"} disabled={!lifelines.audience} onClick={useAudience} className="flex-grow-1">Pytanie do Publiczności</Button>
                        <Button variant={lifelines.phone ? "primary" : "secondary"} disabled={!lifelines.phone} onClick={usePhone} className="flex-grow-1">Telefon do Przyjaciela</Button>
                        <div className="vr mx-2 bg-secondary d-none d-md-block"></div>
                        <div className="w-100 d-md-none"></div> {/* Spacer for mobile */}
                        <Button variant="danger" onClick={handleWalkAway} className="flex-grow-1">Zakończ grę</Button>
                    </div>
                </Col>

                <Col md={3} className="border-start border-secondary p-4 rounded" style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                    <ul className="list-group">
                        {[...MONEY_LADDER].reverse().map((amt, idx) => {
                            const realIdx = 11 - idx;
                            const active = realIdx === currentQIndex;
                            const passed = realIdx < currentQIndex;
                            const isGuaranteed = realIdx === 1 || realIdx === 6; // $1000 and $40000

                            let liClass = 'list-group-item d-flex justify-content-between ';
                            if (active) liClass += 'active ';
                            else if (passed) liClass += 'list-group-item-success ';
                            else if (isGuaranteed) liClass += 'text-warning fw-bold bg-transparent '; // Podświetl gwarantowane
                            else liClass += 'bg-transparent text-white ';

                            return (
                                <li key={realIdx} className={liClass}>
                                    <span className={isGuaranteed ? "fw-bold" : ""}>{realIdx + 1}</span>
                                    <span className={isGuaranteed ? "fw-bold" : ""}>{amt} $</span>
                                </li>
                            );
                        })}
                    </ul>
                </Col>
            </Row>

            <Modal show={!!modalContent} onHide={() => setModalContent(null)} centered>
                <Modal.Header closeButton className="text-dark"><Modal.Title>{modalContent?.title}</Modal.Title></Modal.Header>
                <Modal.Body className="text-dark fs-5">{modalContent?.body}</Modal.Body>
                <Modal.Footer><Button onClick={() => setModalContent(null)}>Zamknij</Button></Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Game;
