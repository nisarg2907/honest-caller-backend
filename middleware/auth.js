
exports.verifyToken=(req, res, next)=> {
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET 
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    // for further use
    req.user = user;
    next();
  });
}


