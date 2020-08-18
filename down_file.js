const https = require("https");
const fs = require("fs");
const URL = require("url");

let url =
  "https://tracker.0day.kiev.ua/download.php?id=146389&name=Sander%20van%20Doorn%20-%20Identity%20560%20%2814-08-2020%29.mp3.torrent";
var parsedUrl = URL.parse(url);
var url_options = {
  hostname: parsedUrl.hostname,
  path: parsedUrl.path,
  method: "GET",
};
console.log(url_options);

function download() {
  https
    .get(
      url,
      {
        headers: {
          "Content-Type": "application/x-bittorrent"
        }
      },
      (res) => {
        if ([301, 302].indexOf(res.statusCode) > -1) {
          download(res.headers.location);
          return;
        }
        console.log(1, res.statusCode);
      }
    )
    .end();
}
download();
// const request = https.get(
//   "https://tracker.0day.kiev.ua/download.php?id=146389&name=Sander%20van%20Doorn%20-%20Identity%20560%20%2814-08-2020%29.mp3.torrent",
//   function (response) {
//     console.log("response: ", response.statusCode);
//     const file = fs.createWriteStream(
//       "C:/Users/xxx87/Desktop/trans/add/Sander van Doorn - Identity 560 (14-08-2020).mp3.torrent"
//     );

//     response.pipe(file);
//   }
// );
