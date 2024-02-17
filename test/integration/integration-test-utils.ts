import { defaultServerOptions } from '../../src/server';

export function getTestServerUrl(pathname: string): URL {
  const url = new URL(
    pathname,
    `http://localhost:${defaultServerOptions.port}`,
  );
  return url;
}
