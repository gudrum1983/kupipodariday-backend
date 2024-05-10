import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, avatar, about } = createUserDto;
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({
      username,
      email,
      avatar,
      about,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    }); // return `This action returns a #${id} user`;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    let userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Если есть новый пароль в данных
    if (updateUserDto.password) {
      // Хешируем новый пароль
      const hashedPassword = await this.hashService.hashPassword(updateUserDto.password);
      // Заменяем поле пароля на новый хеш
      updateUserDto.password = hashedPassword;
    }

    // Обновляем поля пользователя с помощью новых данных
    Object.assign(userToUpdate, updateUserDto);

    // Сохраняем обновленного пользователя в базе данных
    userToUpdate = await this.userRepository.save(userToUpdate);

    return userToUpdate;
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }
}
