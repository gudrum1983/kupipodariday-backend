import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [PassportModule],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [LocalAuthGuard],
})
export class AuthModule {}
