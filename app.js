require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const { spawn, exec } = require("child_process");
const TOKEN = process.env.BOT_TOKEN;
const urlWebHook = process.env.URL_WEBHOOK;
const port = process.env.PORT || 3343;
const workingMode = process.env.MODE || "polling";
const adminChatId = process.env.ADM_CHAT_ID || null;
app.use(express.json());

let bot;
switch (workingMode) {
  case "polling":
    bot = new TelegramBot(TOKEN, { polling: true });
    break;
  case "webhook":
    bot = new TelegramBot(TOKEN);
    bot.setWebHook(`${urlWebHook}/bot${TOKEN}`);
    break;
  default:
    break;
}

app.post(`/bot${TOKEN}`, (req, res) => {
  // console.log("app.post - bot: ", req.body);
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  if (adminChatId)
    bot.sendMessage(adminChatId, "Server started successfully. Telegram Bot working!", {
      reply_markup: {
        keyboard: [["start"]]
      }
    });
  console.log(`Express server is listening on ${port}`);
});
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
    reply_markup: {
      keyboard: [["Кнопка 1", "Кнопка 2"], ["Кнопка 3"], ["Кнопка 4"]]
    }
  });
});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  // console.log("Button pressed: ", msg.text);
  if (msg.text === "start") {
    bot.sendMessage(msg.chat.id, "Welcome", {
      reply_markup: {
        keyboard: [["Кнопка 1", "Кнопка 2"], ["Кнопка 3"], ["reboot"]]
      }
    });
  } else if (msg.text === "reboot") {
    exec(`pm2 restart services-telegram`, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
      }
      console.log("Success bot reboot!");
    });
  } else {
    bot.sendMessage(chatId, "Received your message: " + msg.text);
  }
});
