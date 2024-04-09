import TestServerSingleton from './test-server-instance';

export function getTestServerUrl(
  pathname: string,
  queryParams?: Record<string, string | number>,
  port = TestServerSingleton.PORT,
): URL {
  const url = new URL(pathname, `http://localhost:${port}`);
  if (queryParams != null) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, `${value}`);
    });
  }
  return url;
}
