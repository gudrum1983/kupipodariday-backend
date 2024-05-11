import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from '../helpers/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, avatar, about } = createUserDto;
    const hashedPassword = await hashValue(password);
    const newUser = this.usersRepository.create({
      username,
      email,
      avatar,
      about,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const hashedPassword = await hashValue(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOneOrFail(query);
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
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
}
