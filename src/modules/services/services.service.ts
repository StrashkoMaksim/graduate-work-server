import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './services.model';
import { CategoryService } from '../category/category.service';
import { GetServicesDto } from './dto/get-services-dto';
import { CreateServiceDto } from './dto/create-service-dto';
import { UpdateServiceDto } from './dto/update-service-dto';
import { exceptionCatcher } from '../../exceptions/exception-catcher';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private servicesRepository: typeof Service,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  async getServices(dto: GetServicesDto): Promise<any[]> {
    const services = await this.servicesRepository.findAll({
      [dto.category && 'where']: { categoryId: dto.category },
      limit: dto.limit,
      offset: dto.offset,
      order: [['createdAt', 'DESC']],
    });

    return services;
  }

  async createService(dto: CreateServiceDto) {
    try {
      const category = await this.categoryService.getCategoryById(
        dto.categoryId,
      );

      if (!category) {
        throw new NotFoundException('Выбранной категории не существует');
      }

      await this.servicesRepository.create({
        name: dto.name,
        price: dto.price,
        categoryId: dto.categoryId,
      });
      return { message: 'Услуга успешно добавлена' };
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async updateService(id: number, dto: UpdateServiceDto) {
    try {
      const service = await this.servicesRepository.findByPk(id);

      if (dto.name) {
        service.name = dto.name;
      }

      if (dto.price) {
        service.price = dto.price;
      }

      if (dto.categoryId) {
        service.categoryId = dto.categoryId;
      }

      await service.save();

      return 'Услуга успешно изменена';
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async deleteService(id: number) {
    const service = await this.servicesRepository.findByPk(id);

    if (service) {
      await service.destroy();
    }

    return 'Услуга успешно удалена';
  }
}
