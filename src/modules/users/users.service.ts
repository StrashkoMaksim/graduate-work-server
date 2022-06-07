import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user-dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private usersRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async getAllUsers() {
    const clients = await this.usersRepository.findAll({
      include: { all: true },
    });
    return clients;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('ADMIN');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }
}
