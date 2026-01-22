/**
 * Server Entry Point
 * Configures Express, Middleware, and Routes.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Configuration ---

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow:
        // 1. Localhost (standard dev)
        // 2. Local LAN IPs (192.168.x.x) for testing on other devices
        // 3. Any origin running on port 3000 (React default)
        const isAllowed =
            origin.endsWith(':3000') ||
            origin.includes('192.168.') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1');

        if (isAllowed) {
            return callback(null, true);
        } else {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(cookieParser());

// --- Routes ---

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// is running Check
app.get('/', (req, res) => {
    res.send('Milionerzy PŁ API Running');
});

// --- Global Error Handler ---

app.use((err, req, res, next) => {
    console.error('[ServerError]', err.stack);
    res.status(500).send('Something broke!');
});

// --- Start Server ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: Localhost, 192.168.x.x, *.3000`);
});
