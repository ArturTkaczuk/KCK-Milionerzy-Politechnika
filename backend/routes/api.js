const express = require('express');
const router = express.Router();
const db = require('../db');
const { checkAuth, requireAdmin } = require('../middleware/auth');


// GET /me (Chronione)
router.get('/me', checkAuth, (req, res) => {
    res.json(req.user);
});

// GET /users (Publiczny do symulacji logowania)
router.get('/users', async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PRZEDMIOTY
// GET /subjects (Publiczny endpoint do listowania przedmiotów)
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await db.getSubjects();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/subjects', checkAuth, requireAdmin, async (req, res) => {
    const { name, slug } = req.body;
    try {
        await db.createSubject(name, slug);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/subjects/:id', checkAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await db.deleteSubject(id);
        if (!deleted) return res.status(404).json({ error: 'Subject not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PYTANIA (Admin)
router.get('/subjects/:slug/questions', checkAuth, requireAdmin, async (req, res) => {
    const { slug } = req.params;
    try {
        const subject = await db.getSubjectBySlug(slug);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const questions = await db.getQuestionsBySubjectId(subject.id);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/subjects/:slug/questions', checkAuth, requireAdmin, async (req, res) => {
    const { slug } = req.params;
    const { content, answers, correct_answer, difficulty } = req.body;

    try {
        console.log('DEBUG: Creating question. Slug:', slug);
        console.log('DEBUG: Body:', JSON.stringify(req.body));
        const subject = await db.getSubjectBySlug(slug);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        await db.createQuestion({
            subject_id: subject.id,
            content,
            answer_a: answers.A,
            answer_b: answers.B,
            answer_c: answers.C,
            answer_d: answers.D,
            correct_answer,
            difficulty
        });

        res.json({ success: true });
    } catch (err) {
        console.error('DEBUG: Error in create question:', err);
        res.status(500).json({ error: err.message });
    }
});



// GRA
router.get('/subjects/:slug/questions/game', checkAuth, async (req, res) => {
    const { slug } = req.params;
    console.log(`DEBUG: Fetching game for slug: '${slug}'`);
    try {
        const subject = await db.getSubjectBySlug(slug);
        console.log(`DEBUG: Found subject:`, subject);

        if (!subject) {
            const all = await db.getSubjects();
            console.log(`DEBUG: Lookup failed. Available slugs: ${all.map(s => s.slug).join(', ')}`);
            return res.status(404).json({ error: `Subject not found: ${slug}` });
        }

        // Pobierz 3 pytania dla każdego poziomu trudności
        const gameQuestions = [];
        for (let diff = 1; diff <= 4; diff++) {
            const questions = await db.getQuestionsBySubjectIdAndDifficulty(subject.id, diff);

            // Wylosuj i wybierz 3
            const shuffled = questions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            if (selected.length < 3) {
                return res.status(400).json({ error: `Not enough questions for difficulty ${diff} (Only ${selected.length}/3)` });
            }
            gameQuestions.push(...selected);
        }

        res.json(gameQuestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/game/submit', checkAuth, async (req, res) => {
    const { subject_slug, score, answers } = req.body;
    const userId = req.user.id;

    try {
        const subject = await db.getSubjectBySlug(subject_slug);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const leaderboardEntry = await db.addToLeaderboard({
            user_id: userId,
            subject_id: subject.id,
            score
        });

        // Zapisz historię, jeśli podano odpowiedzi
        if (answers && Array.isArray(answers)) {
            await db.saveGameAnswers(leaderboardEntry.id, answers);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// RANKING
router.get('/leaderboard', checkAuth, async (req, res) => {
    try {
        const leaderboard = await db.getGlobalLeaderboard();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HISTORIA
router.get('/history', checkAuth, async (req, res) => {
    try {
        const games = await db.getUserGames(req.user.id);
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/history/:gameId', checkAuth, async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const details = await db.getGameDetails(gameId);
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /questions/:id
router.put('/questions/:id', checkAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { content, answers, correct_answer, difficulty } = req.body;

    try {
        const updated = await db.updateQuestion(id, {
            content,
            answer_a: answers.A,
            answer_b: answers.B,
            answer_c: answers.C,
            answer_d: answers.D,
            correct_answer,
            difficulty
        });

        if (!updated) return res.status(404).json({ error: 'Question not found' });
        res.json({ success: true, question: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /questions/:id
router.delete('/questions/:id', checkAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await db.deleteQuestion(id);
        if (!deleted) return res.status(404).json({ error: 'Question not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
