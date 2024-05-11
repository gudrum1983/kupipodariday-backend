import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
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

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  findOne1(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOneOrFail(query);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateOne1(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Если есть новый пароль в данных
    if (password) {
      // Хешируем новый пароль
      const hashedPassword = await hashValue(updateUserDto.password);
      // Заменяем поле пароля на новый хеш
      updateUserDto.password = hashedPassword;
    }

    // Сохраняем обновленного пользователя в базе данных
    return await this.usersRepository.save(updateUserDto);
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async updateOne(user: User, updateUserDto: UpdateUserDto ): Promise<any> {
    //const user = await this.usersRepository.findOne(query);
    if (!user) {
      throw new Error('User not found');
    }
    if (updateUserDto.password) {
      // Хешируем новый пароль
      const hashedPassword = await hashValue(updateUserDto.password);
      // Заменяем поле пароля на новый хеш
      updateUserDto.password = hashedPassword;
    }

    // Сохраняем обновленного пользователя в базе данных
    //return await this.usersRepository.save(updateUserDto);

    const updatedUser = Object.assign(user, updateUserDto);
    //return this.usersRepository.save(updatedUser);

    const userWithPassword = await this.usersRepository.save(updatedUser);
    const userWithoutPassword = instanceToPlain(userWithPassword);
    return userWithoutPassword;

  }
}
