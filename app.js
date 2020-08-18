require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const urlWebHook = process.env.URL_WEBHOOK;
const { Telegraf } = require("telegraf");
const express = require("express");
const port = process.env.PORT || 3343;
const expressApp = express();

const bot = new Telegraf(TOKEN);
expressApp.use(bot.webhookCallback(`/bot${TOKEN}`));
bot.telegram.setWebhook(`${urlWebHook}`);

expressApp.get("/", (req, res) => {
  res.send("Hello World!");
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
