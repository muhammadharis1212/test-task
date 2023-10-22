import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { User } from '@interfaces/users.interface';
import jwt from 'jsonwebtoken';

export function generateToken(user: User): string {
  const payload = { id: user.id, email: user.email, role: user.role };
  console.log('Secret Key : ', SECRET_KEY);
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

@Service()
@EntityRepository()
export class AuthService {
  public login(userData: User) {
    const expiresIn: number = 60 * 60;
    const token = generateToken(userData);
    return { accessToken: token, expiresIn };
  }

  // public async logout(userData: User): Promise<User> {
  //   const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   return findUser;
  // }
}
