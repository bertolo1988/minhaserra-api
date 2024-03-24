import fs from 'fs/promises';
import path from 'path';

export class ImageBase64Utils {
  /**
   * @param base64StringLength
   * @returns estimation of original image size in bytes before encoding to base64
   */
  static reverseEstimateBase64Size(base64StringLength: number): number {
    return Math.ceil(base64StringLength / 4) * 3;
  }

  static async getImageInBase64(fileName: string): Promise<string> {
    const imageType = path.extname(fileName);
    const imagePath = path.resolve(fileName);
    const base64Image = await fs.readFile(imagePath, {
      encoding: 'base64',
    });
    return `data:image/${imageType};base64,${base64Image}`;
  }

  static getBufferFromBase64Image(base64Data: string): Buffer {
    return Buffer.from(
      base64Data.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
  }

  static getBase64ImageExtension(base64Data: string): string {
    return base64Data.split(';')[0].split('/')[1];
  }
}
