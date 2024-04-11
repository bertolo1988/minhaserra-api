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

  /**
   * Translates input text to English
   * @param input text to translate
   * @param sourceLanguageCode source language code
   * @returns translated text in English
   */
  async translateToEnglish(
    input: string,
    sourceLanguageCode: Language,
  ): Promise<string> {
    if (sourceLanguageCode === Language.ENGLISH) {
      return input;
    }
    return this.translate(input, sourceLanguageCode, Language.ENGLISH);
  }

  /**
   * Translate the input text from source language to target language
   * @param input text to translate
   * @param sourceLanguageCode source language code
   * @param targetLanguageCode target language code
   * @returns translated text in target language
   */
  async translate(
    input: string,
    sourceLanguageCode: Language | 'auto',
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

  /**
   * Detects the language of the input text and translates it to English
   * @param input text to translate in any language
   * @returns translated text in english
   */
  async translateToEnglishAuto(input: string): Promise<string> {
    return this.translate(input, 'auto', Language.ENGLISH);
  }
}
