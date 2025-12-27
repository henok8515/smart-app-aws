const memjs = require("memjs");

const cache = memjs.Client.create("127.0.0.1:11211");

(async () => {
  await cache.set("ping", "pong", { expires: 30 });
  const result = await cache.get("ping");

  console.log(result.value.toString());
})();
