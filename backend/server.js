const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Programy pośredniczące (Middleware)
app.use(cors({
    origin: function (origin, callback) {
        // Pozwól na żądania bez 'origin' (np. aplikacje mobilne lub postman)
        if (!origin) return callback(null, true);

        // Sprawdź czy origin jest dozwolony (localhost lub LAN IP na porcie 3000)
        // Dla uproszczenia developerskiego, pozwalamy na wszystko co kończy się na :3000
        if (origin.endsWith(':3000')) {
            return callback(null, true);
        } else {
            // W trybie developerskim pozwólmy na wszystko (niebezpieczne na prod!)
            // Lepsze rozwiązanie: sprawdź czy to IP z sieci lokalnej (192.168.x.x)
            if (origin.includes('192.168.') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Poly-Millionaire API Running');
});

// Obsługa błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
