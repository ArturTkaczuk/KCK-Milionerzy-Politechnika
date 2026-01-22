/**
 * Middleware: Authentication
 * Description: Validates the 'User' cookie to ensure requests are from authorized users.
 */

const db = require('../db');

const checkAuth = async (req, res, next) => {
    const userId = req.cookies.User;

    if (!userId) {
        return res.status(403).json({ error: 'Unauthorized: Missing credentials' });
    }

    try {
        const user = await db.getUserById(userId);

        if (!user) {
            console.warn(`Auth: User ID ${userId} from cookie not found in DB.`);
            return res.status(403).json({ error: 'Unauthorized: Invalid session' });
        }

        // Attach user to request for downstream use
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal Auth Error' });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
};

module.exports = { checkAuth, requireAdmin };
