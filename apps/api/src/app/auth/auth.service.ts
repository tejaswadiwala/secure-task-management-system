import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Import from libs
import { User, Organization, Role, RegisterDto, AuthResponseDto, UserProfile, RoleType } from '@data';
import { AuthService } from '@auth';

@Injectable()
export class AuthApplicationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private authService: AuthService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, organizationId, roleId } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Verify organization exists
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId }
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Get role - use provided roleId or default to VIEWER role
    let role: Role;
    if (roleId) {
      role = await this.roleRepository.findOne({
        where: { id: roleId }
      });
      if (!role) {
        throw new BadRequestException('Role not found');
      }
    } else {
      // Default to VIEWER role
      role = await this.roleRepository.findOne({
        where: { name: RoleType.VIEWER }
      });
      if (!role) {
        throw new BadRequestException('Default VIEWER role not found in system');
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      organizationId,
      roleId: role.id,
      isActive: true
    });

    // Save user to database
    const savedUser = await this.userRepository.save(newUser);

    // Load user with relations for JWT payload
    const userWithRelations = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['organization', 'role']
    });

    if (!userWithRelations) {
      throw new BadRequestException('Failed to create user');
    }

    // Generate JWT token using library service
    const tokenResult = await this.authService.login(userWithRelations);

    // Create user profile (without password)
    const userProfile: UserProfile = {
      id: userWithRelations.id,
      email: userWithRelations.email,
      firstName: userWithRelations.firstName,
      lastName: userWithRelations.lastName,
      role: userWithRelations.role.name,
      organizationId: userWithRelations.organizationId,
      isActive: userWithRelations.isActive,
      createdAt: userWithRelations.createdAt,
      updatedAt: userWithRelations.updatedAt
    };

    return {
      access_token: tokenResult.access_token,
      user: userProfile
    };
  }
} 