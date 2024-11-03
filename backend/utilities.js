const jwt = require("jsonwebtoken");

function authenticationToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extracts the token part

    if (!token) {
        return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: true, message: "Forbidden" });
        req.user = user; // Attach the decoded user to the request object
        next();
    });
}

module.exports = { authenticationToken };
