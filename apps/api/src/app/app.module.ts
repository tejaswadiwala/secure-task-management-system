import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestImportController } from './test-import.controller';

@Module({
  imports: [
    // Simple config - just loads .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Basic TypeORM setup
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'secure_task_management',
      autoLoadEntities: true,
      synchronize: true, // Only for development/assessment
    }),
  ],
  controllers: [AppController, TestImportController],
  providers: [AppService],
})
export class AppModule {}
