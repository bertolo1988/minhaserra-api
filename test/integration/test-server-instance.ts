import { ApiServer, defaultServerOptions } from '../../src/server';

export default class TestServerSingleton {
  private static instance: ApiServer;

  private constructor() {}

  public static PORT = 8087;

  public static async getInstance() {
    if (!TestServerSingleton.instance) {
      TestServerSingleton.instance = new ApiServer({
        ...defaultServerOptions,
        port: TestServerSingleton.PORT,
      });
      await TestServerSingleton.instance.start();
    }
    return TestServerSingleton.instance;
  }
}
