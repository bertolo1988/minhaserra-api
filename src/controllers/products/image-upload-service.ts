import AWS from 'aws-sdk';
import CONFIG from '../../config';
import { ImageBase64Utils } from '../../utils/image-base-64-utils';
import { CreateProductImageDto } from './products.types';

export class ImageUploadService {
  s3: AWS.S3;
  bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      apiVersion: '2010-12-01',
      accessKeyId: CONFIG.aws.accessKeyId,
      secretAccessKey: CONFIG.aws.secretAccessKey,
      sslEnabled: true,
      region: CONFIG.aws.region,
    });
    this.bucketName = CONFIG.aws.productImagesBucketName as string;
  }

  async uploadImage(
    userId: string,
    productId: string,
    data: CreateProductImageDto,
  ): Promise<string> {
    const imageName = this.getImageName(data);
    const imageBuffer = ImageBase64Utils.getBufferFromBase64Image(
      data.base64Image,
    );
    return await this.uploadBufferImage(
      userId,
      productId,
      imageName,
      imageBuffer,
      data.description,
    );
  }

  getImageName(data: CreateProductImageDto): string {
    const imageExtension = ImageBase64Utils.getBase64ImageExtension(
      data.base64Image,
    );
    return `${Date.now()}-${data.name}.${imageExtension}`;
  }

  getImageUrl(userId: string, productId: string, imageId: string): string {
    const imageRemoteName = this.getImageRemoteName(userId, productId, imageId);
    return `https://${this.bucketName}.s3.${CONFIG.aws.region}.amazonaws.com/${imageRemoteName}`;
  }

  getImageRemoteName(
    userId: string,
    productId: string,
    imageId: string,
  ): string {
    return `userId_${userId}/productId_${productId}/${imageId}`;
  }

  private async uploadBufferImage(
    userId: string,
    productId: string,
    imageId: string,
    imageData: Buffer,
    description?: string,
  ): Promise<string> {
    const metadata: AWS.S3.Metadata = {
      userId,
      productId,
      imageId,
    };
    if (description != null) {
      metadata.description = description;
    }
    const imageRemoteName = this.getImageRemoteName(userId, productId, imageId);
    const uploadResponse = await this.putObjectS3(
      imageRemoteName,
      metadata,
      imageData,
    );
    if (!uploadResponse || !uploadResponse.ETag) {
      throw new Error('Failed to upload image');
    } else {
      return this.getImageUrl(userId, productId, imageId);
    }
  }

  async putObjectS3(
    imageRemoteName: string,
    metadata: AWS.S3.Metadata,
    imageData: Buffer,
  ): Promise<{
    ETag: string;
    ServerSideEncryption: string;
  }> {
    const putPromise: Promise<AWS.S3.PutObjectOutput> = this.s3
      .putObject({
        Bucket: this.bucketName,
        Body: imageData,
        Key: imageRemoteName,
        Metadata: metadata,
      })
      .promise();
    return (await putPromise) as unknown as {
      ETag: string;
      ServerSideEncryption: string;
    };
  }
}
