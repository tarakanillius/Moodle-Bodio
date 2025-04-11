import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function createJSONToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

function validateJSONToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

async function isValidPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

function checkAuthorization(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const authFragments = req.headers.authorization.split(' ');

    if (authFragments.length !== 2) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    const authToken = authFragments[1];

    try {
        req.user = validateJSONToken(authToken);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export { createJSONToken, validateJSONToken, isValidPassword, checkAuthorization };
