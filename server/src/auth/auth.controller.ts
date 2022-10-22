import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Request() req, @Body() _signInInfo: SignInDto) {
    return this.authService.signIn(req.user);
  }
  @ApiBearerAuth()
  @Get('verify-token')
  getProfile(@Request() req) {
    return req.user;
  }
}
