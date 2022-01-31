import DB from "./db";
import App from "./app";
import config from "./config";

(async () => {
  try {
    const db = new DB(config.env, config.db);
    await db.connect();

    const app = new App();
    app.listen();
  } catch (err: any) {
    console.error(
      "Something went wrong when initializing the server:\n",
      err.stack
    );
  }
})();
