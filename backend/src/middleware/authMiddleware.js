import jwt  from 'jsonwebtoken'

const authMiddleware =(req, res, next) => {
const token = req.headers.authorization;
if(!token || token === undefined){
    return res.status(401).send('Provide JWT token');
}
try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
} catch (error) {
    res.status(401).send('Invalid or expired token')
}
}
export default authMiddleware

