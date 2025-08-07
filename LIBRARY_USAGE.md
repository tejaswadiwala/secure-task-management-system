# Using Shared Libraries in the API App

## Overview

Your NX monorepo now includes two shared libraries:
- `@data` - Shared TypeScript interfaces, DTOs, and data models
- `@auth` - Reusable RBAC logic, decorators, and guards

## Path Mappings

The libraries are accessible via path aliases defined in `tsconfig.base.json`:

```typescript
// Instead of relative imports like this:
import { User } from '../../../libs/data/src/lib/models/user.model';

// Use clean path aliases like this:
import { User, Task, CreateTaskDto } from '@data';
import { JwtAuthGuard, Roles, RbacGuard } from '@auth';
```

## How to Use in API App

### 1. In Controllers (`packages/apps/api/src/app/`)

```typescript
// packages/apps/api/src/app/tasks/tasks.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles, RbacGuard, CurrentUser } from '@auth';
import { Task, CreateTaskDto, User } from '@data';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  
  @Post()
  @Roles('admin', 'owner')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User
  ): Promise<Task> {
    // Only admin and owner roles can create tasks
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @Roles('admin', 'owner', 'viewer')
  async getTasks(@CurrentUser() user: User): Promise<Task[]> {
    // All roles can view tasks (filtered by their access level)
    return this.tasksService.findAllForUser(user);
  }
}
```

### 2. In Services

```typescript
// packages/apps/api/src/app/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { RbacService } from '@auth';
import { Task, User, CreateTaskDto } from '@data';

@Injectable()
export class TasksService {
  constructor(private rbacService: RbacService) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Use RBAC service to check permissions
    const canCreate = await this.rbacService.canUserPerformAction(
      user, 
      'create', 
      'task'
    );
    
    if (!canCreate) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    // Create task logic
  }
}
```

### 3. In Modules

```typescript
// packages/apps/api/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { AuthService, RbacService } from '@auth';

@Module({
  imports: [
    // Other imports
  ],
  providers: [
    AuthService,
    RbacService,
    // Other providers
  ],
  // ...
})
export class AppModule {}
```

## Building and Testing

### Build Libraries
```bash
# Build individual libraries
nx build data
nx build auth

# Build all libraries
nx run-many --target=build --projects=data,auth
```

### Test Libraries
```bash
# Test individual libraries
nx test data
nx test auth

# Test all libraries
nx run-many --target=test --projects=data,auth
```

### Build API with Libraries
```bash
# The API app will automatically use the built libraries
nx build api
```

## Key Benefits of This Setup

1. **Type Safety**: Shared interfaces ensure type consistency across frontend and backend
2. **Code Reuse**: RBAC logic can be reused across different modules
3. **Maintainability**: Changes to data models or auth logic are centralized
4. **Clean Imports**: Path aliases make imports readable and maintainable
5. **NX Benefits**: Dependency graph tracking, affected project detection, etc.

## Next Steps

1. Implement the actual data models in `libs/data/src/lib/models/`
2. Implement RBAC guards and decorators in `libs/auth/src/lib/`
3. Use these libraries in your API controllers and services
4. Optionally, create a frontend library for shared Angular components

## Library Structure

```
libs/
├── data/                    # Shared data models and DTOs
│   ├── src/
│   │   ├── lib/
│   │   │   ├── models/      # Database entities (User, Task, etc.)
│   │   │   ├── dtos/        # API request/response DTOs
│   │   │   └── interfaces/  # Shared TypeScript interfaces
│   │   └── index.ts         # Main export file
│   └── project.json
│
└── auth/                    # Reusable RBAC logic
    ├── src/
    │   ├── lib/
    │   │   ├── guards/      # Authentication & authorization guards
    │   │   ├── decorators/  # Role & permission decorators
    │   │   ├── services/    # Auth & RBAC services
    │   │   └── strategies/  # Passport.js strategies
    │   └── index.ts         # Main export file
    └── project.json
``` 