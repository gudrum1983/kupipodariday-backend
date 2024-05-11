import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from '../helpers/hash';
import { instanceToPlain } from 'class-transformer';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { password } = createUserDto;
    const hashedPassword = await hashValue(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const userWithPassword = await this.usersRepository.save(newUser);
    const userWithoutPassword = instanceToPlain(userWithPassword);
    return userWithoutPassword;
  }

  //findOne по полю userName
  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }


  async updateOne(user: User, updateUserDto: UpdateUserDto): Promise<any> {
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
    const userWithoutPassword = instanceToPlain(userWithPassword);
    return userWithoutPassword;
  }
}
