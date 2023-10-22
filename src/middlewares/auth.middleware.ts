// authMiddleware.ts
import { SECRET_KEY } from '@/config';
import { AuthRequest } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function AuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const tokenHeader = req.header('Authorization' || 'authorization');
  // Check if the request is for the Swagger documentation
  if (req.originalUrl.startsWith('/docs')) {
    // Allow access to the Swagger documentation without authentication
    return next();
  }

  if (!tokenHeader) return res.status(401).send('Access denied. No token provided.');
  const tokenParts = tokenHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(403).send('Access denied. Invalid token format.');
  }

  const token = tokenParts[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    console.log('user : ', user);
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send('Access denied. Token has expired.');
      }
      return res.status(403).send('Access denied. Invalid token.');
    }
    req.user = user as User;

    next();
  });
}
