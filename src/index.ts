import chalk from "chalk";
import fs from "fs";
import { ogBot } from "./classes/ogbot";
import { getRandomProxy, loadProxies } from "./classes/proxy";
import { logMessage, prompt } from "./utils/logger";

async function main(): Promise<void> {
  console.log(
    chalk.cyan(`
░▄▀▄░█▀▀
░█/█░█░█
░░▀░░▀▀▀
  By : El Puqus Airdrop
   Use it at your own risk
  `)
  );

  const total = parseInt(await prompt(chalk.yellow("Total transaction perday? ")));
  const accounts = fs
    .readFileSync("privatekey.txt", "utf8")
    .split("\n")
    .filter(Boolean);
  const count = accounts.length;

  const proxiesLoaded = loadProxies();
  if (!proxiesLoaded) {
    logMessage(null, null, "No Proxy. Using default IP", "debug");
  }

  let successful = 0;

  for (let i = 0; i < count; i++) {
    console.log(chalk.white("-".repeat(85)));
    logMessage(i + 1, count, "Processing Transaction", "debug");
    const privkey = accounts[i];
    const currentProxy = await getRandomProxy(i + 1, count);
    const og = new ogBot(privkey, currentProxy, i + 1, count);

    try {
      const totalTransaction = total;
      let txCount = 0;

      while (txCount < totalTransaction) {
        const randomAction = Math.floor(Math.random() * 3);
        logMessage(i + 1, count, `Total Transaction: ${txCount + 1}/${totalTransaction}`, "debug");
        switch (randomAction) {
          case 0:
            await og.processSwapUsdtBtc();
            break;
          case 1:
            await og.processSwapUsdtEth();
            break;
          default:
            break;
        }

        txCount++;
      }

      successful++;
    } catch (err) {
      logMessage(i + 1, count, `Error: ${(err as any).message}`, "error");
    }
  }

  console.log(chalk.white("-".repeat(85)));

  const sleepTime = 24 * 60 * 60 * 1000;
  logMessage(null, null, `Sleeping for 24 hours before restarting...`, "success");
  await new Promise(resolve => setTimeout(resolve, sleepTime));

  main();
}

main().catch((err) => {
  console.error(chalk.red("Error occurred:"), err);
  process.exit(1);
});
