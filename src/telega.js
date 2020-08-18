require("dotenv").config();
const { Telegraf, Extra, Markup } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const urlWebHook = process.env.URL_WEBHOOK;
const workingMode = process.env.MODE || "polling";
const bot = new Telegraf(TOKEN);
const app = require("./services/express");

async function startDevMode() {
  console.log("Polling mode...");
  await bot.telegram.deleteWebhook();
  bot.startPolling();
}
function startProdMode() {
  console.log("Webhook mode...");
  app.use(bot.webhookCallback(`/bot${TOKEN}`));
  bot.telegram.setWebhook(`${urlWebHook}/bot${TOKEN}`);
}

switch (workingMode) {
  case "polling":
    startDevMode();
    break;
  case "webhook":
    startProdMode();
    break;
  default:
    break;
}

module.exports = { bot, Extra, Markup };
