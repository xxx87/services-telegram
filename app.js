require("dotenv").config();
const path = require("path");
const TOKEN = process.env.BOT_TOKEN;
const Telegraf = require("telegraf");
const express = require("express");
const app = express();
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const urlWebHook = process.env.URL_WEBHOOK;
const port = process.env.PORT || 3343;
const workingMode = process.env.MODE || "polling";
const adminChatId = process.env.ADM_CHAT_ID || null;
const { spawn, exec } = require("child_process");
const bot = new Telegraf(TOKEN);
const rp = require("request-promise");

app.use(express.json());

workingMode === "webhook" ? startProdMode(bot) : startDevMode(bot);

app.get(`/tele/:code/`, (req, res) => {
  if (req.params.code === adminChatId) {
    res.sendFile(path.join(__dirname + "/html/index.html"));
  } else {
    res.send("Error");
  }
});
// app.post(`/bot${TOKEN}`, (req, res) => {
//   // console.log("app.post - bot: ", req.body);
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });

app.listen(port, () => {
  // if (adminChatId)
  //   bot.sendMessage(adminChatId, "Server started successfully. Telegram Bot working!", {
  //     reply_markup: {
  //       keyboard: [["start"]]
  //     }
  //   });
  console.log(`Express server is listening on ${port}`);
});

bot.use(async (ctx, next) => {
  // console.log("CTX >>>>>> > ", ctx.update.message.document);
  // ctx.telegram.getFileLink(ctx.update.message.document.file_id).then((url) => {
  //   console.log(11, url);
  //   // axios({url, responseType: 'stream'}).then(response => {
  //   //     return new Promise((resolve, reject) => {
  //   //         response.data.pipe(fs.createWriteStream(`${config.basePath}/public/images/profiles/${ctx.update.message.from.id}.jpg`))
  //   //                     .on('finish', () => /* File is saved. */)
  //   //                     .on('error', e => /* An error has occured */)
  //   //             });
  //   //         })
  // });
  // ctx.telegram.getFile(ctx.update.message.document.file_id).then((url) => {
  //   console.log(22, url);
  //   // axios({url, responseType: 'stream'}).then(response => {
  //   //     return new Promise((resolve, reject) => {
  //   //         response.data.pipe(fs.createWriteStream(`${config.basePath}/public/images/profiles/${ctx.update.message.from.id}.jpg`))
  //   //                     .on('finish', () => /* File is saved. */)
  //   //                     .on('error', e => /* An error has occured */)
  //   //             });
  //   //         })
  // });
  const start = new Date();
  await next();
  const ms = new Date() - start;
  // console.log("Response time: %sms", ms);
});

bot.on("document", async (ctx, next) => {
  let docInfo = ctx.update.message.document;
  let docType = docInfo.mime_type;
  if (docType === "application/x-bittorrent") {
    ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    console.log("document ctx: ", ctx.message);
    ctx.reply(`Torrent File Download Start... `);
  }

  next();
});
bot.on("text", async (ctx, next) => {
  // const current_url = new URL(ctx.message.text);
  // console.log("current_url >>> ", current_url.href);
  // const search_params = current_url.searchParams;
  // const name = search_params.get("name");

  // let resp = await downloadTorrent(current_url.href, `./files/${name}`);
  // console.log("RESPONSE DOWNLOAD:::: ", resp);
  // const file = fs.createWriteStream(`./files/${name}`);
  // const request = https.get(ctx.message.text, function (response) {
  //   response.pipe(file);
  // });

  // download(ctx.message.text, `./files/${name}`, function (resp) {
  //   console.log("done: ", resp);
  //   move(`./files/${name}`, `C:/Users/xxx87/Desktop/trans/add/${name}`, function () {
  //     console.log("Move DOne! ");
  //   });
  //   // getTransmissionStats();
  // });
  // addTorrent(ctx.message.text);
  ctx.reply(`${ctx.message.text}`);
  next();
});

// bot.on('text', (ctx) => ctx.reply('Hello World'))

bot.command("onetime", ({ reply }) =>
  reply("One time keyboard", Markup.keyboard(["/simple", "/inline", "/pyramid"]).oneTime().resize().extra())
);

bot.command("custom", ({ reply }) => {
  return reply(
    "Custom buttons keyboard",
    Markup.keyboard([
      ["🔍 Search", "😎 Popular"], // Row1 with 2 buttons
      ["☸ Setting", "📞 Feedback"], // Row2 with 2 buttons
      ["📢 Ads", "⭐️ Rate us", "👥 Share"] // Row3 with 3 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

bot.hears("🔍 Search", (ctx) => ctx.reply("Yay!"));
bot.hears("📢 Ads", (ctx) => ctx.reply("Free hugs. Call now!"));

bot.command("special", (ctx) => {
  return ctx.reply(
    "Special buttons keyboard",
    Extra.markup((markup) => {
      return markup
        .resize()
        .keyboard([markup.contactRequestButton("Send contact"), markup.locationRequestButton("Send location")]);
    })
  );
});

bot.command("pyramid", (ctx) => {
  return ctx.reply(
    "Keyboard wrap",
    Extra.markup(
      Markup.keyboard(["one", "two", "three", "four", "five", "six"], {
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
      })
    )
  );
});

bot.command("simple", (ctx) => {
  return ctx.replyWithHTML("<b>Coke</b> or <i>Pepsi?</i>", Extra.markup(Markup.keyboard(["Coke", "Pepsi"])));
});

bot.command("inline", (ctx) => {
  return ctx.reply(
    "<b>Coke</b> or <i>Pepsi?</i>",
    Extra.HTML().markup((m) => m.inlineKeyboard([m.callbackButton("Coke", "Coke"), m.callbackButton("Pepsi", "Pepsi")]))
  );
});

bot.command("random", (ctx) => {
  return ctx.reply(
    "random example",
    Markup.inlineKeyboard([
      Markup.callbackButton("Coke", "Coke"),
      Markup.callbackButton("Dr Pepper", "Dr Pepper", Math.random() > 0.5),
      Markup.callbackButton("Pepsi", "Pepsi")
    ]).extra()
  );
});

bot.command("caption", (ctx) => {
  return ctx.replyWithPhoto(
    { url: "https://picsum.photos/200/300/?random" },
    Extra.load({ caption: "Caption" })
      .markdown()
      .markup((m) => m.inlineKeyboard([m.callbackButton("Plain", "Plain"), m.callbackButton("Italic", "Italic")]))
  );
});

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply(
    "Keyboard wrap",
    Extra.markup(
      Markup.keyboard(["one", "two", "three", "four", "five", "six"], {
        columns: parseInt(ctx.match[1])
      })
    )
  );
});

bot.action("Dr Pepper", (ctx, next) => {
  return ctx.reply("👍").then(() => next());
});

bot.action("Italic", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageCaption(
    "_Caption_",
    Extra.markdown().markup(
      Markup.inlineKeyboard([Markup.callbackButton("_Plain_", "Plain"), Markup.callbackButton("* Italic *", "Italic")])
    )
  );
});

bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`);
});

function startDevMode(bot) {
  rp(`https://api.telegram.org/bot${TOKEN}/deleteWebhook`)
    .then(() => bot.startPolling())
    .catch(err => {
      console.log("EROOR! : ", err);
    });
}

async function startProdMode(bot) {
  await bot.telegram.setWebhook(`${urlWebHook}/bot${TOKEN}`);
  // await bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, +process.env.WEBHOOK_PORT);
  const webhookStatus = await bot.getWebhookInfo();
  console.log("Webhook status", webhookStatus);
}
