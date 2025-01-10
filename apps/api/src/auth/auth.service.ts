import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { SignInInput } from './dtos/sign-in.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signIn(signInInput: SignInInput): Promise<User> {
    const user = await this.userService.findOneByEmail(signInInput.email);
    if (!user) {
      return null;
    }
    if (!user.localProvider) {
      return null;
    }
    const passwordIsValid = bcrypt.compareSync(
      signInInput.password,
      user.localProvider.password,
    );
    if (!passwordIsValid) {
      return null;
    }
    return user;
  }
}
