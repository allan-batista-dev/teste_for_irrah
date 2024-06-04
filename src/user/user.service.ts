import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {

    const existingUserWithEmail = await this.findByEmail(createUserDto.email);
    if (existingUserWithEmail) {
      throw new ConflictException('Email já está cadastrado');
    }

    const data: Prisma.UsersCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.users.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.prisma.users.findUnique({
      where: {
        id
      }
    })
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.prisma.users.findUnique({
      where: {
        email
      }
    })
  }
  
}
