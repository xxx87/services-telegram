require("dotenv").config();
const transmissionHost = process.env.TRANSMISSION_HOST;
const Transmission = require("transmission");

let transmission = new Transmission({
  port: 9091, // DEFAULT : 9091
  host: transmissionHost, // DEAFULT : 127.0.0.1
  username: "",// "transmission", // DEFAULT : BLANK
  password: "", //"{8de3ee1ce95b64ad82efb6eca47df60e4f29f85182yQQVWx" // DEFAULT : BLANK
});

module.exports = {
  // Get details of all torrents currently queued in transmission app
  getTransmissionStats: function () {
    transmission.sessionStats(function (err, result) {
      if (err) {
        console.log("getTransmissionStats error: ", err);
      } else {
        console.log("getTransmissionStats result: ", result);
      }
    });
  },

  // Add a torrent by passing a URL to .torrent file or a magnet link
  addTorrent: function (url) {
    transmission.addUrl(url, function (err, result) {
      if (err) {
        return console.log("addTorrent error: ", err);
      }
      var id = result.id;
      console.log("Just added a new torrent.");
      console.log("Torrent ID: " + id);
    });
  },

  // Get various stats about a torrent in the queue
  getTorrentDetails: async function (id) {
    await transmission.get(id, function (err, result) {
      console.log(id);
      console.log(result);
      if (err) {
        console.log("getTorrentDetails error: ", err);
      }
      if (result.torrents.length > 0) {
        // console.log(result.torrents[0]);			// Gets all details
        console.log("Name = " + result.torrents[0].name);
        console.log("Download Rate = " + result.torrents[0].rateDownload / 1000);
        console.log("Upload Rate = " + result.torrents[0].rateUpload / 1000);
        console.log("Completed = " + result.torrents[0].percentDone * 100);
        console.log("ETA = " + result.torrents[0].eta / 3600);
        console.log("Status = " + getStatusType(result.torrents[0].status));
      }
    });
  },

  deleteTorrent: function (id) {
    transmission.remove(id, true, function (err, result) {
      if (err) {
        console.log("deleteTorrent error: ", err);
      } else {
        transmission.get(id, function (err, result) {
          //err no torrent found...
        });
      }
    });
  },

  // To start a paused / stopped torrent which is still in queue
  startTorrent: function (id) {
    transmission.start(id, function (err, result) {});
  },

  // To get list of all torrents currently in queue (downloading + paused)
  // NOTE : This may return null if all torrents are in paused state
  getAllActiveTorrents: function () {
    transmission.active(function (err, result) {
      if (err) {
        console.log("getAllActiveTorrents error: ", err);
      } else {
        for (var i = 0; i < result.torrents.length; i++) {
          console.log(result.torrents[i].id);
          console.log(result.torrents[i].name);
        }
      }
    });
  },

  // Pause / Stop a torrent
  stopTorrent: function (id) {
    transmission.stop(id, function (err, result) {});
  },

  // Pause / Stop all torrent
  stopAllActiveTorrents: function () {
    transmission.active(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < result.torrents.length; i++) {
          stopTorrents(result.torrents[i].id);
        }
      }
    });
  },

  // Remove a torrent from download queue
  // NOTE : This does not trash torrent data i.e. does not remove it from disk
  removeTorrent: function (id) {
    transmission.remove(id, function (err) {
      if (err) {
        throw err;
      }
      console.log("torrent was removed");
    });
  },

  // Get torrent state
  getStatusType: function (type) {
    return transmission.statusArray[type];
    if (type === 0) {
      return "STOPPED";
    } else if (type === 1) {
      return "CHECK_WAIT";
    } else if (type === 2) {
      return "CHECK";
    } else if (type === 3) {
      return "DOWNLOAD_WAIT";
    } else if (type === 4) {
      return "DOWNLOAD";
    } else if (type === 5) {
      return "SEED_WAIT";
    } else if (type === 6) {
      return "SEED";
    } else if (type === 7) {
      return "ISOLATED";
    }
  }
};
