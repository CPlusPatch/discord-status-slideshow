const rpc = require("discord-rpc");
const config = require("./config/auth.json");
const rpcConfig = require("./config/rpc.json");

const client = new rpc.Client({
  transport: "ipc",
});

client.on("ready", async () => {
  console.log("RPC has loaded.");
  console.log("Starting up cool buttons");

  // Loops over every activity card in the config file
  while (true) {
    for (i in rpcConfig) {
      currentButton = rpcConfig[i];

      /* console.log(currentButton)
			console.log(typeof currentButton.buttons == "undefined") */

      client.request("SET_ACTIVITY", {
        pid: process.pid,
        activity: {
          details: currentButton.details ?? undefined,
          state: currentButton.state ?? undefined,
          assets: {
            large_image: currentButton.assets.largeImageName,
            large_text: currentButton.assets.largeImageText,
			small_image: currentButton.assets.smallImageName ?? undefined,
			small_text: currentButton.assets.smallImageText ?? undefined,
          },
          ...(typeof currentButton.buttons != "undefined" && {
            buttons: [
              {
                label: currentButton.buttons.primary.label ?? undefined,
                url: currentButton.buttons.primary.url ?? undefined,
              },
            ],
          }),
        },
      });
      // Waits 10.1s (due to rate limits being 10s)
      await new Promise((r) => setTimeout(r, 10100));
    }
  }
});

client.login({ clientId: config.clientId }).catch(console.error);
