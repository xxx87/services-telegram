require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const urlWebHook = process.env.URL_WEBHOOK;
const { Telegraf } = require("telegraf");
const express = require("express");
const port = process.env.PORT || 3343;
const app = express();
const workingMode = process.env.MODE || "polling";

const bot = new Telegraf(TOKEN);
// switch (workingMode) {
//   case "polling":
//     console.log("Polling mode...");
//     break;
//   case "webhook":
//     console.log("Webhook mode...");
//     app.use(bot.webhookCallback(`/bot${TOKEN}`));
//     bot.setWebHook(`${urlWebHook}/bot${TOKEN}`);
//     break;
//   default:
//     break;
// }
app.use(bot.webhookCallback(`/bot${TOKEN}`));
bot.telegram.setWebHook(`${urlWebHook}/bot${TOKEN}`);

app.get("/", (req, res) => {
  res.send('HELLO');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});

bot.on("text", (ctx, next) => {
  ctx.reply(`${ctx.message.text}`);
  next();
});
