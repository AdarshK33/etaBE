const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(400).json({ message: 'Invalid or expired token' });

        req.user = user; // Add user information to the request
        next();
    });
}

module.exports = authenticateToken;
