import AWS from 'aws-sdk';

import CONFIG from '../../config';
import { ImageUtils } from '../../utils/image-utils';
import { CreateProductImageDto, ProductImageModel } from './products.types';

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

  async deleteImage(image: ProductImageModel) {
    const imageKey = this.getImageRemoteNameFromModel(image);
    const result = await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: imageKey,
      })
      .promise();
    if (
      result.$response.httpResponse.statusCode >= 200 &&
      result.$response.httpResponse.statusCode < 300
    ) {
      return true;
    } else {
      throw new Error(`Failed to delete image from S3 with id: ${image.id}`);
    }
  }

  async uploadImage(
    productImageId: string,
    userId: string,
    productId: string,
    data: CreateProductImageDto,
    compress = true,
  ): Promise<string> {
    let imageBuffer = ImageUtils.getBufferFromBase64Image(data.base64Image);

    if (compress) {
      imageBuffer = await ImageUtils.getCompressedWebpImage(imageBuffer);
    }

    return await this.uploadBufferImage(
      productImageId,
      userId,
      productId,
      imageBuffer,
      data,
    );
  }

  getImageName(id: string): string {
    return `${id}.webp`;
  }

  getImageRemoteNameFromModel(data: ProductImageModel): string {
    return this.getImageRemoteName(data.productId, this.getImageName(data.id));
  }

  getImageRemoteName(productId: string, imageName: string): string {
    return `productId_${productId}/${imageName}`;
  }

  getImageUrl(productId: string, imageName: string): string {
    const imageRemoteName = this.getImageRemoteName(productId, imageName);
    return `https://${this.bucketName}.s3.${CONFIG.aws.region}.amazonaws.com/${imageRemoteName}`;
  }

  private async uploadBufferImage(
    productImageId: string,
    userId: string,
    productId: string,
    imageData: Buffer,
    data: CreateProductImageDto,
  ): Promise<string> {
    const imageName = this.getImageName(productImageId);
    const imageRemoteName = this.getImageRemoteName(productId, imageName);

    const metadata: AWS.S3.Metadata = {
      userId,
      productId,
      name: data.name,
    };
    if (data.description != null) {
      metadata.description = data.description;
    }

    const uploadResponse = await this.putObjectS3(
      imageRemoteName,
      metadata,
      imageData,
    );
    if (!uploadResponse || !uploadResponse.ETag) {
      throw new Error('Failed to upload image');
    } else {
      return this.getImageUrl(productId, imageName);
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
