import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';

// Import from libs
import { RegisterDto, AuthResponseDto } from '@data';

// Local service
import { AuthApplicationService } from './auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // Exclude sensitive fields like password
export class AuthController {
  constructor(
    private authApplicationService: AuthApplicationService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authApplicationService.register(registerDto);
  }
} 