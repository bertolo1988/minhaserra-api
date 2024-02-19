import { defaultServerOptions } from '../../src/server';

export function getTestServerUrl(
  pathname: string,
  port = defaultServerOptions.port,
): URL {
  const url = new URL(pathname, `http://localhost:${port}`);
  return url;
}
