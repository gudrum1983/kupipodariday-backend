import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { hashValue } from '../helpers/hash';
import { instanceToPlain } from 'class-transformer';
import { FindUsersDto } from './dto/find-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  instanceUserToPlain(user: User): UserProfileResponseDto {
    return <UserProfileResponseDto>instanceToPlain(user);
  }

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { password } = createUserDto;
    const hashedPassword = await hashValue(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const userWithPassword = await this.usersRepository.save(newUser);
    return await this.instanceUserToPlain(userWithPassword);
  }

  async findByUsername(username: string): Promise<UserProfileResponseDto> {
    const user = await this.findOne({
      where: { username },
    });
    return this.instanceUserToPlain(user);
  }

  //findOne по полю userName
  async findMany(query: FindManyOptions<User>): Promise<User[]> {
    const users = await this.usersRepository.find(query);
    return users;
  }

  async findByMailOrName(
    body: FindUsersDto,
  ): Promise<Array<UserProfileResponseDto>> {
    const { query } = body;
    return await this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }

  async findOneForValidate(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
  }

  async updateOne(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    if (!user) {
      throw new Error('User not found');
    }
    if (updateUserDto.password) {
      // Хешируем новый пароль
      const hashedPassword = await hashValue(updateUserDto.password);
      // Заменяем поле пароля на новый хеш
      updateUserDto.password = hashedPassword;
    }
    const updatedUser = Object.assign(user, updateUserDto);
    const userWithPassword = await this.usersRepository.save(updatedUser);
    return await this.instanceUserToPlain(userWithPassword);
  }
}
