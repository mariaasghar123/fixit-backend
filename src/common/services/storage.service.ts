import { Injectable } from '@nestjs/common';
import { ImageType } from '../enums/image-type.enum';

@Injectable()
export class StorageService {

  async upload(file: any, type: ImageType): Promise<string> {
    let folder: string;

    switch (type) {
      case ImageType.PROFILE:
        folder = 'profiles';
        break;

      case ImageType.PORTFOLIO:
        folder = 'portfolios';
        break;

      case ImageType.LICENSE:
        folder = 'licenses'; // PRIVATE
        break;

      default:
        folder = 'others';
    }

    //  here future logic AWS S3 / R2 
    const fileName = `${Date.now()}-${file.originalname}`;
    return `https://cdn.yourapp.com/${folder}/${fileName}`;
  }
}
