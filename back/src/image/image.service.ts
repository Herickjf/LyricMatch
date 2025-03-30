import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly imagesPath = path.join(
    process.cwd(),
    'src',
    'image',
    'images',
  );

  getAllImages(): string[] {
    if (!fs.existsSync(this.imagesPath)) {
      return [];
    }
    return fs
      .readdirSync(this.imagesPath)
      .filter((file) => {
        const filePath = path.join(this.imagesPath, file);
        return fs.statSync(filePath).isFile();
      })
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
        return numA - numB;
      })
      .map((file) => `http://localhost:4000/images/${file}`);
  }

  getImage(filename: string): string | null {
    const filePath = path.join(this.imagesPath, filename);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
    return null;
  }
}
