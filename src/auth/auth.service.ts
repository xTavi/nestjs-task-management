import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  public signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log(authCredentialsDto);
    return this.userRepository.createUser(authCredentialsDto);
  }

  public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
