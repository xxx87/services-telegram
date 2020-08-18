require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const urlWebHook = process.env.URL_WEBHOOK;
const { Telegraf } = require("telegraf");
const express = require("express");
const port = process.env.PORT || 3343;
const expressApp = express();

const bot = new Telegraf(TOKEN);
expressApp.use(bot.webhookCallback(`/bot${TOKEN}`));
bot.telegram.setWebhook(`${urlWebHook}/bot${TOKEN}`);

expressApp.get("/", async (req, res) => {
  res.send(await bot.telegram.getWebhookInfo());
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});

bot.on("text", async (ctx, next) => {
  ctx.reply(`${ctx.message.text}`);
  next();
});
