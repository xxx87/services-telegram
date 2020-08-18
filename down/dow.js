var download = require("./download");

download(
  "https://tracker.0day.kiev.ua/download.php?id=146389&name=Sander%20van%20Doorn%20-%20Identity%20560%20%2814-08-2020%29.mp3.torrent",
  "./downloads"
)
  .then(function (id) {
    console.log("Arquivo gravado com id %s", id);
  })
  .catch(function (err) {
    console.log("Deu pau..");
    console.log(err.stack);
  });

// Ou como callback
download(
  "https://tracker.0day.kiev.ua/download.php?id=146389&name=Sander%20van%20Doorn%20-%20Identity%20560%20%2814-08-2020%29.mp3.torrent",
  "./downloads",
  function (err, id) {
    if (err) throw err;

    console.log("Arquivo gravado com id %s", id);
  }
);
