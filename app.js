require("dotenv").config();
const port = process.env.PORT || 3343;
const pathToNewTorrent = process.env.PATH_NEW_TORRENT;
const app = require("./src/services/express");
const download = require("./src/services/download");
const { bot, Extra, Markup } = require("./src/telega");
const tm = require("./src/services/transmission");

app.get("/", async (req, res) => {
  res.sendStatus(200);
});

app.get("/downloadComplete/:id", async (req, res) => {
  let fileID = req.params.id;
  console.log("downloadComplete ID: ", fileID);
  if (fileID) tm.getTorrentDetails(fileID);
  res.sendStatus(200);
});
tm.getTransmissionStats();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  // console.log("Response time: %sms", ms);
});

bot.on("document", async (ctx, next) => {
  let docInfo = ctx.update.message.document;
  let docType = docInfo.mime_type;
  let fullName = docInfo.file_name;
  let truncName = fullName.substring(0, fullName.lastIndexOf("."));
  if (docType === "application/x-bittorrent") {
    // ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    console.log("document ctx: ", ctx.message);
    ctx.telegram.getFileLink(docInfo.file_id).then(async (url) => {
      tm.addTorrent(url);
      // await download(url, `${pathToNewTorrent}${fullName}`);
      // console.log(11, url);
      ctx.reply(`Torrent File "${truncName}" Download Start... `);
    });
  }
  next();
});

bot.on("text", (ctx, next) => {
  ctx.reply(`${ctx.message.text}`);
  next();
});
