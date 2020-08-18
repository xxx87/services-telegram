require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const Telegraf = require("telegraf");
const Transmission = require("transmission");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const url = require("url");
const bot = new Telegraf(TOKEN);
const fs = require("fs");
const https = require("https");
const request = require("request");

transmission = new Transmission({
  port: 9091, // DEFAULT : 9091
  host: "127.0.0.1", // DEAFULT : 127.0.0.1
  username: "", // DEFAULT : BLANK
  password: "" // DEFAULT : BLANK
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

// bot.action("Plain", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.editMessageCaption(
//     "Caption",
//     Markup.inlineKeyboard([Markup.callbackButton("Plain", "Plaint"), Markup.callbackButton("Italic", "Italict")])
//   );
// });

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

bot.launch();
