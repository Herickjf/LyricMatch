import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocalizationService } from './localization.service';
import { CreateLocalizationDto } from './dto/create-localization.dto';
import { UpdateLocalizationDto } from './dto/update-localization.dto';

@Controller('localization')
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Post()
  create(@Body() createLocalizationDto: CreateLocalizationDto) {
    return this.localizationService.create(createLocalizationDto);
  }

  @Get()
  findAll() {
    return this.localizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localizationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocalizationDto: UpdateLocalizationDto,
  ) {
    return this.localizationService.update(+id, updateLocalizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localizationService.remove(+id);
  }
}
