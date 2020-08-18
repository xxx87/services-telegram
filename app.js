require("dotenv").config();
const port = process.env.PORT || 3343;
const app = require("./src/services/express");
const { bot, Extra, Markup } = require("./src/telega");

app.get("/", async (req, res) => {
  res.send(await bot.telegram.getWebhookInfo());
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
