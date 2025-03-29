import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getAllImages(): string[] {
    return this.imageService.getAllImages();
  }

  @Get(':filename')
  getImage(@Param('filename') filename: string, @Res() res: Response): void {
    const filePath = this.imageService.getImage(filename);
    if (!filePath) {
      throw new NotFoundException('Image not found');
    }
    res.sendFile(filePath);
  }
}
