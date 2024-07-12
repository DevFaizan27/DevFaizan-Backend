import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateUserDetail = async (req, res, next) => {
    try {
      // Extract token from headers, cookies, or request body
      const token = req.header("auth-token"); 
      
      console.log(token);// Assuming "Bearer <token>"
  
      if (!token) {
        throw new Error("No token, authorization denied");
      }
  
      // Verify token
      const decoded = jwt.verify(token, '123456');
      console.log(decoded);
  
      // console.log("decoded", decoded);
  
      // Fetch user from database using decoded token data
      req.user = await User.findById(decoded.id);
  
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  };
  
