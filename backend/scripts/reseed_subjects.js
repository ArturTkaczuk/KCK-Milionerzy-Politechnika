const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/database.sqlite');
const db = new sqlite3.Database(DB_PATH);

const subjects = [
    {
        name: 'Sieci komputerowe',
        slug: 'sieci-komputerowe',
        questions: [
            // Difficulty 1 (Easy)
            { content: 'Co oznacza skrót LAN?', answers: { A: 'Local Area Network', B: 'Long Area Network', C: 'Lost Area Network', D: 'Large Area Network' }, correct_answer: 'A', difficulty: 1 },
            { content: 'Który protokół służy do przesyłania stron WWW?', answers: { A: 'FTP', B: 'HTTP', C: 'SMTP', D: 'SSH' }, correct_answer: 'B', difficulty: 1 },
            { content: 'Ile bitów ma adres IPv4?', answers: { A: '32', B: '64', C: '128', D: '16' }, correct_answer: 'A', difficulty: 1 },
            // Difficulty 2 (Medium)
            { content: 'Która warstwa modelu OSI odpowiada za routing?', answers: { A: 'Fizyczna', B: 'Sieci', C: 'Transportowa', D: 'Aplikacji' }, correct_answer: 'B', difficulty: 2 },
            { content: 'Co to jest DNS?', answers: { A: 'System nazw domenowych', B: 'Dynamiczny serwer nazw', C: 'Domenowy numer seryjny', D: 'Dedykowany numer serwera' }, correct_answer: 'A', difficulty: 2 },
            { content: 'Które polecenie w systemie Windows wyświetla konfigurację IP?', answers: { A: 'ifconfig', B: 'ipconfig', C: 'netstat', D: 'ping' }, correct_answer: 'B', difficulty: 2 },
            // Difficulty 3 (Hard)
            { content: 'Który port jest domyślny dla protokołu HTTPS?', answers: { A: '80', B: '443', C: '22', D: '21' }, correct_answer: 'B', difficulty: 3 },
            { content: 'Co oznacza skrót NAT?', answers: { A: 'Network Address Translation', B: 'Network Access Token', C: 'New Address Type', D: 'Node Access Table' }, correct_answer: 'A', difficulty: 3 },
            { content: 'Jaki jest maksymalny rozmiar ramki Ethernet (MTU) bez jumbo frames?', answers: { A: '1500 bajtów', B: '1492 bajty', C: '9000 bajtów', D: '1024 bajty' }, correct_answer: 'A', difficulty: 3 },
            // Difficulty 4 (Expert)
            { content: 'Który protokół routingu jest protokołem stanu łącza (Link-State)?', answers: { A: 'RIP', B: 'EIGRP', C: 'OSPF', D: 'BGP' }, correct_answer: 'C', difficulty: 4 },
            { content: 'W której klasie adresów IP znajduje się adres 192.168.1.1?', answers: { A: 'Klasa A', B: 'Klasa B', C: 'Klasa C', D: 'Klasa D' }, correct_answer: 'C', difficulty: 4 },
            { content: 'Co oznacza flaga SYN w nagłówku TCP?', answers: { A: 'Zakończenie połączenia', B: 'Synchronizacja numerów sekwencyjnych', C: 'Potwierdzenie odbioru', D: 'Reset połączenia' }, correct_answer: 'B', difficulty: 4 }
        ]
    },
    {
        name: 'Bazy danych SQL',
        slug: 'bazy-danych-sql',
        questions: [
            // Difficulty 1 (Easy)
            { content: 'Które słowo kluczowe służy do pobierania danych z bazy?', answers: { A: 'GET', B: 'SELECT', C: 'FETCH', D: 'PULL' }, correct_answer: 'B', difficulty: 1 },
            { content: 'Co oznacza skrót SQL?', answers: { A: 'Structured Query Language', B: 'Simple Query Language', C: 'Strong Question Language', D: 'Structured Question List' }, correct_answer: 'A', difficulty: 1 },
            { content: 'Które polecenie usuwa tabelę z bazy danych?', answers: { A: 'DELETE TABLE', B: 'REMOVE TABLE', C: 'DROP TABLE', D: 'ERASE TABLE' }, correct_answer: 'C', difficulty: 1 },
            // Difficulty 2 (Medium)
            { content: 'Co to jest klucz podstawowy (Primary Key)?', answers: { A: 'Klucz do szyfrowania bazy', B: 'Unikalny identyfikator rekordu', C: 'Hasło administratora', D: 'Pierwsza kolumna w tabeli' }, correct_answer: 'B', difficulty: 2 },
            { content: 'Które słowo kluczowe służy do filtrowania wyników?', answers: { A: 'ORDER BY', B: 'GROUP BY', C: 'WHERE', D: 'FILTER' }, correct_answer: 'C', difficulty: 2 },
            { content: 'Jaki typ złączenia (JOIN) zwraca tylko pasujące rekordy z obu tabel?', answers: { A: 'LEFT JOIN', B: 'RIGHT JOIN', C: 'INNER JOIN', D: 'FULL JOIN' }, correct_answer: 'C', difficulty: 2 },
            // Difficulty 3 (Hard)
            { content: 'Co to jest normalizacja bazy danych?', answers: { A: 'Proces usuwania zduplikowanych danych', B: 'Tworzenie kopii zapasowej', C: 'Zwiększanie rozmiaru bazy', D: 'Szyfrowanie danych' }, correct_answer: 'A', difficulty: 3 },
            { content: 'Która funkcja agregująca zlicza liczbę wierszy?', answers: { A: 'SUM()', B: 'TOTAL()', C: 'COUNT()', D: 'NUMBER()' }, correct_answer: 'C', difficulty: 3 },
            { content: 'Co oznacza akronim ACID w kontekście transakcji?', answers: { A: 'Atomicity, Consistency, Isolation, Durability', B: 'Access, Control, Identify, Delete', C: 'Automatic, Consistent, Internal, Direct', D: 'Active, Current, Immediate, Done' }, correct_answer: 'A', difficulty: 3 },
            // Difficulty 4 (Expert)
            { content: 'Czym jest "SQL Injection"?', answers: { A: 'Metodą optymalizacji zapytań', B: 'Atakiem polegającym na wstrzyknięciu kodu SQL', C: 'Rodzajem indeksu w bazie', D: 'Nową wersją standardu SQL' }, correct_answer: 'B', difficulty: 4 },
            { content: 'Które z poniższych nie jest typem ograniczenia (constraint) w SQL?', answers: { A: 'FOREIGN KEY', B: 'UNIQUE', C: 'CHECK', D: 'LIMIT' }, correct_answer: 'D', difficulty: 4 },
            { content: 'Jaki jest wynik zapytania SELECT NULL + 1?', answers: { A: '1', B: '0', C: 'NULL', D: 'Błąd' }, correct_answer: 'C', difficulty: 4 }
        ]
    },
    {
        name: 'Cyberbezpieczeństwo',
        slug: 'cyberbezpieczenstwo',
        questions: [
            // Difficulty 1 (Easy)
            { content: 'Co to jest Phishing?', answers: { A: 'Łowienie ryb', B: 'Wyłudzanie danych przez podszywanie się', C: 'Skanowanie portów', D: 'Rodzaj wirusa' }, correct_answer: 'B', difficulty: 1 },
            { content: 'Co oznacza skrót VPN?', answers: { A: 'Virtual Private Network', B: 'Very Private Network', C: 'Visual Public Network', D: 'Virtual Public Node' }, correct_answer: 'A', difficulty: 1 },
            { content: 'Jakie hasło jest najbezpieczniejsze?', answers: { A: '123456', B: 'admin1', C: 'P@sw0rd!2024', D: 'imie123' }, correct_answer: 'C', difficulty: 1 },
            // Difficulty 2 (Medium)
            { content: 'Co to jest Firewall?', answers: { A: 'Program antywirusowy', B: 'Ściana ogniowa chroniąca sieć', C: 'System chłodzenia serwera', D: 'Kabel sieciowy' }, correct_answer: 'B', difficulty: 2 },
            { content: 'Co to jest 2FA?', answers: { A: 'Dwa szybkie ataki', B: 'Uwierzytelnianie dwuskładnikowe', C: 'Drugi format adresu', D: 'Dwukrotne szyfrowanie' }, correct_answer: 'B', difficulty: 2 },
            { content: 'Co oznacza DDoS?', answers: { A: 'Download Data on Speed', B: 'Distributed Denial of Service', C: 'Direct Domain System', D: 'Double Data Security' }, correct_answer: 'B', difficulty: 2 },
            // Difficulty 3 (Hard)
            { content: 'Co to jest ransomware?', answers: { A: 'Oprogramowanie szpiegujące', B: 'Oprogramowanie szyfrujące dane dla okupu', C: 'Darmowe oprogramowanie', D: 'Oprogramowanie do kopania kryptowalut' }, correct_answer: 'B', difficulty: 3 },
            { content: 'Jaki protokół jest następcą SSL?', answers: { A: 'TLS', B: 'SSH', C: 'HTTPS', D: 'WPA' }, correct_answer: 'A', difficulty: 3 },
            { content: 'Co to jest atak Man-in-the-Middle?', answers: { A: 'Atak na serwerownię', B: 'Podsłuch i modyfikacja transmisji między dwiema stronami', C: 'Atak z wewnątrz firmy', D: 'Atak na bazę danych' }, correct_answer: 'B', difficulty: 3 },
            // Difficulty 4 (Expert)
            { content: 'Co to jest Zero-Day Exploit?', answers: { A: 'Atak, który trwa zero dni', B: 'Atak wykorzystujący nieznaną lukę', C: 'Atak, który nie wyrządził szkód', D: 'Atak przeprowadzony w nocy' }, correct_answer: 'B', difficulty: 4 },
            { content: 'Co oznacza skrót CIA w bezpieczeństwie informacji?', answers: { A: 'Central Intelligence Agency', B: 'Confidentiality, Integrity, Availability', C: 'Control, Identity, Access', D: 'Computer, Internet, Antivirus' }, correct_answer: 'B', difficulty: 4 },
            { content: 'Jak działa atak SQL Injection?', answers: { A: 'Przepełnia bufor pamięci', B: 'Wstrzykuje złośliwy kod SQL do zapytania bazy danych', C: 'Przechwytuje ciasteczka sesji', D: 'Podmienia adres DNS' }, correct_answer: 'B', difficulty: 4 }
        ]
    }
];

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const seed = async () => {
    console.log('Starting Aggressive Re-Seed...');

    // Enable Foreign Keys
    await run("PRAGMA foreign_keys = OFF"); // Disable FK to allow manual cleanup without constraint errors first

    for (const subject of subjects) {
        console.log(`Processing: ${subject.name}`);

        try {
            // Find Existing
            const existing = await get("SELECT id FROM subjects WHERE slug = ?", [subject.slug]);

            if (existing) {
                console.log(`Found existing subject (ID: ${existing.id}). Deleting references...`);

                // Manual Cascade Delete
                await run("DELETE FROM game_answers WHERE leaderboard_id IN (SELECT id FROM leaderboard WHERE subject_id = ?)", [existing.id]);
                await run("DELETE FROM leaderboard WHERE subject_id = ?", [existing.id]);
                await run("DELETE FROM questions WHERE subject_id = ?", [existing.id]);
                await run("DELETE FROM subjects WHERE id = ?", [existing.id]);

                console.log("Deleted old subject and references.");
            }

            // Create Subject
            const subRes = await run("INSERT INTO subjects (name, slug) VALUES (?, ?)", [subject.name, subject.slug]);
            const subId = subRes.id;
            console.log(`Created subject ${subject.name} (ID: ${subId})`);

            // Add Questions
            for (const q of subject.questions) {
                await run(
                    "INSERT INTO questions (subject_id, content, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [subId, q.content, q.answers.A, q.answers.B, q.answers.C, q.answers.D, q.correct_answer, q.difficulty]
                );
            }
            console.log(`Added ${subject.questions.length} questions.`);

        } catch (err) {
            console.error(`Error processing ${subject.name}:`, err);
        }
    }

    await run("PRAGMA foreign_keys = ON");
    console.log("Done.");
};

setTimeout(seed, 1000);
