import { Injectable } from '@nestjs/common';
import { CreateLocalizationDto } from './dto/create-localization.dto';
import { UpdateLocalizationDto } from './dto/update-localization.dto';

@Injectable()
export class LocalizationService {
  create(createLocalizationDto: CreateLocalizationDto) {
    return 'This action adds a new localization';
  }

  findAll() {
    return `This action returns all localization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} localization`;
  }

  update(id: number, updateLocalizationDto: UpdateLocalizationDto) {
    return `This action updates a #${id} localization`;
  }

  remove(id: number) {
    return `This action removes a #${id} localization`;
  }
}
