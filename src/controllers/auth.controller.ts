import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { users } from '@/utils/users';

export class AuthController {
  public auth = Container.get(AuthService);

  // public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const userData: User = req.body;
  //     const signUpUserData: User = await this.auth.signup(userData);

  //     res.status(201).json({ data: signUpUserData, message: 'signup' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find the user by username and password
      const user: User = users.find(u => u.email === email && u.password === password);

      if (!user) {
        res.status(401).send('Invalid username or password.');
      } else {
        const token = this.auth.login(user);
        res.status(200).json({ ...token, message: 'login' });
      }
    } catch (error) {
      next(error);
    }
  };

  // public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const userData: User = req.user;
  //     const logOutUserData: User = await this.auth.logout(userData);

  //     res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
  //     res.status(200).json({ data: logOutUserData, message: 'logout' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
