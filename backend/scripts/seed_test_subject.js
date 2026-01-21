const db = require('../db');

async function seedTest() {
    console.log('Seeding "Test" subject...');

    try {
        // 1. Utwórz Przedmiot
        let subject = await db.getSubjectBySlug('test');
        if (!subject) {
            console.log('Creating subject "Test"...');
            subject = await db.createSubject('Test', 'test');
        } else {
            console.log('Subject "Test" already exists (ID: ' + subject.id + ').');
        }

        // 2. Wyczyść istniejące pytania dla tego przedmiotu, aby uniknąć duplikatów, jeśli uruchomiono wielokrotnie
        await db.deleteSubject(subject.id);
        subject = await db.createSubject('Test', 'test');

        console.log('Subject "Test" created/reset with ID:', subject.id);

        // 3. Dodaj Pytania
        const questions = [];

        for (let diff = 1; diff <= 4; diff++) {
            for (let i = 1; i <= 3; i++) {
                questions.push({
                    subject_id: subject.id,
                    content: `Test Question Diff ${diff} - #${i} (Answer is A)`,
                    answer_a: "Correct Answer A",
                    answer_b: "Wrong B",
                    answer_c: "Wrong C",
                    answer_d: "Wrong D",
                    correct_answer: "A",
                    difficulty: diff
                });
            }
        }

        for (const q of questions) {
            await db.createQuestion(q);
        }

        console.log(`Successfully added ${questions.length} questions to "Test" subject.`);

    } catch (err) {
        console.error('Error seeding test data:', err);
    }
}

seedTest();
