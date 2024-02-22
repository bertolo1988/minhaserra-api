export class CaseConverter {
  static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static snakeToCamel(str: string): string {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
  }

  static objectKeysCamelToSnake(obj: Record<string, any>): Record<string, any> {
    if (!obj) return obj;
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      newObj[CaseConverter.camelToSnake(key)] = obj[key];
    });
    return newObj;
  }

  static objectKeysSnakeToCamel(obj: Record<string, any>): Record<string, any> {
    if (!obj) return obj;
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      newObj[CaseConverter.snakeToCamel(key)] = obj[key];
    });
    return newObj;
  }
}
