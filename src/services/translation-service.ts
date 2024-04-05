import {
  TranslateClient,
  TranslateClientConfigType,
  TranslateTextCommand,
  TranslateTextCommandInput,
  TranslateTextCommandOutput,
} from '@aws-sdk/client-translate';

import CONFIG from '../config';
import { Language } from '../types';

/**
 * Translation service
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-translate/
 */
export class TranslationService {
  client: TranslateClient;

  constructor() {
    const config: TranslateClientConfigType = {
      region: CONFIG.aws.region,
      credentials: {
        accessKeyId: CONFIG.aws.accessKeyId as string,
        secretAccessKey: CONFIG.aws.secretAccessKey as string,
      },
    };
    this.client = new TranslateClient(config);
  }

  async translateToEnglish(
    input: string,
    sourceLanguageCode: Language,
  ): Promise<string> {
    if (sourceLanguageCode === Language.ENGLISH) {
      return input;
    }
    return this.translate(input, sourceLanguageCode, Language.ENGLISH);
  }

  async translate(
    input: string,
    sourceLanguageCode: Language,
    targetLanguageCode: Language,
  ): Promise<string> {
    const commandConfig: TranslateTextCommandInput = {
      Text: input,
      SourceLanguageCode: sourceLanguageCode,
      TargetLanguageCode: targetLanguageCode,
    };
    const command = new TranslateTextCommand(commandConfig);
    const response: TranslateTextCommandOutput =
      await this.client.send(command);
    if (!response || !response.TranslatedText) {
      throw new Error('Translation service failed!');
    }
    return response.TranslatedText;
  }
}
