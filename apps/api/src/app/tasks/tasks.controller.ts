import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';

// Import from libs
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskResponseDto, 
  TaskQueryDto 
} from '@data';
import { JwtAuthGuard, CurrentUser } from '@auth';

// Local service
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Protect all endpoints with JWT authentication
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() currentUser: any
  ): Promise<TaskResponseDto> {
    return await this.tasksService.createTask(createTaskDto, currentUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTasks(
    @Query() queryDto: TaskQueryDto,
    @CurrentUser() currentUser: any
  ): Promise<TaskResponseDto[]> {
    return await this.tasksService.findAllTasks(queryDto, currentUser);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTaskById(
    @Param('id') taskId: string,
    @CurrentUser() currentUser: any
  ): Promise<TaskResponseDto> {
    return await this.tasksService.findTaskById(taskId, currentUser);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() currentUser: any
  ): Promise<TaskResponseDto> {
    return await this.tasksService.updateTask(taskId, updateTaskDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @Param('id') taskId: string,
    @CurrentUser() currentUser: any
  ): Promise<void> {
    return await this.tasksService.deleteTask(taskId, currentUser);
  }
} 