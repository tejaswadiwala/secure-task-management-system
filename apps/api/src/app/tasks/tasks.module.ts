import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import entities from libs
import { Task, User, Organization, Role } from '@data';
import { AuthService, JwtStrategy } from '@auth';

// Local components
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    // Import entities for repository injection
    TypeOrmModule.forFeature([Task, User, Organization, Role]),
    
    // Passport for authentication strategies
    PassportModule,
    
    // JWT module configuration (same as AuthModule)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    AuthService, // For JWT functionality
    JwtStrategy, // For route protection
  ],
  exports: [TasksService],
})
export class TasksModule {} 