import TestServerSingleton from './test-server-instance';

export function getTestServerUrl(
  pathname: string,
  port = TestServerSingleton.PORT,
): URL {
  const url = new URL(pathname, `http://localhost:${port}`);
  return url;
}
