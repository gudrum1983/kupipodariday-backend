import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtConfigFactory } from '../config/jwt-config.factory';
import { JwtStrategy } from './strategies/jwt.strategy.st';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    ConfigModule.forRoot(), // убедитесь, что ConfigModule зарегистрирован
    JwtModule.registerAsync({
      //imports: [ConfigModule], // здесь мы импортируем ConfigModule, чтобы он мог быть внедрен в JwtConfigFactory
      useClass: JwtConfigFactory, // здесь мы используем класс JwtConfigFactory для создания опций JWT
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigFactory],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
