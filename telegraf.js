require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const bot = new Telegraf(TOKEN);

// bot.start((ctx) => ctx.reply("Welcome"));
// bot.help((ctx) => ctx.reply("Send me a sticker"));
// bot.on("sticker", (ctx) => ctx.reply("👍"));
// bot.hears("hi", (ctx) => ctx.reply("Hey there"));
// bot.launch();

// bot.command("oldschool", (ctx) => ctx.reply("Hello"));
// bot.command("modern", ({ reply }) => reply("Yo"));
// bot.command("hipster", Telegraf.reply("λ"));
// bot.launch();

// bot.use(Telegraf.log());

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});

// bot.use((ctx, next) => {
//   console.log(2, ctx.message);
//   next();
// });
bot.context.db = {
  getScores: () => {
    return 42;
  }
};

// bot.use((ctx, next) => {
//   ctx.state.role = getUserRole(ctx.message)
//   return next()
// })

bot.on('text', (ctx) => {
  return ctx.reply(`Hello ${ctx.state.role}`)
})

// bot.on("text", async (ctx, next) => {
//   const scores = ctx.db.getScores(ctx.message.from.username);
//   console.log(await ctx.getMyCommands());
//   ctx.reply(`${ctx.message.from.username}: ${await ctx.getMyCommands()}`);
//   next();
// });

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
