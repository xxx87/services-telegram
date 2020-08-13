//Express.js example integration   app_telegraf
require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const port = process.env.PORT || 3343;
const urlWebHook = process.env.URL_WEBHOOK;
const { Telegraf } = require("telegraf");
const express = require("express");
const expressApp = express();

const bot = new Telegraf(TOKEN);
expressApp.use(bot.webhookCallback(`/bot${TOKEN}`));
bot.telegram.setWebhook(`https://services-telegram.ddns.net/bot${TOKEN}`);

expressApp.get("/", (req, res) => {
  res.send("Hello World!");
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});
