/* Add a new station by copying one block below and editing the values.
   logo: path to an image file (put it in assets/logos/)
   stream: the HLS .m3u8 playlist URL, or a direct mp3/aac stream URL
   type: "hls" for .m3u8, "audio" for a direct mp3/aac link
   accent: any CSS color used to tint the tile */
window.STATIONS = [
  {
    id: "fm961",
    name: "FM 96.1",
    subtitle: "加拿大中文電台",
    logo: "assets/logos/fm961.jpg",
    stream: "https://stream.eseenet.com/radio/fm961.stream/playlist.m3u8",
    type: "hls",
    accent: "#e11d48"
  },
  {
    id: "sbspowerfm",
    name: "SBS Power FM",
    subtitle: "SBS 파워FM 107.7",
    logo: "assets/logos/sbspowerfm.jpg",
    stream: "",
    type: "hls",
    accent: "#2563eb",
    resolve: function () {
      return fetch("https://gorealrainteraction.radio.sbs.co.kr/simple/powerfm")
        .then(function (r) {
          if (!r.ok) throw new Error("station");
          return r.json();
        })
        .then(function (data) {
          return fetch(data.data.onair.stream_api);
        })
        .then(function (r) {
          if (!r.ok) throw new Error("stream");
          return r.text();
        })
        .then(function (t) {
          t = t.trim();
          if (t.charAt(0) === '"') {
            try {
              t = JSON.parse(t);
            } catch (e) {}
          }
          if (!/^https?:\/\//.test(t)) throw new Error("stream");
          return t;
        });
    }
  },
  {
    id: "am1320",
    name: "AM 1320",
    subtitle: "加拿大溫哥華 華僑之聲",
    logo: "assets/logos/am1320.png",
    stream: "https://stream.radiojar.com/nugqupcv8qzuv.mp3",
    type: "audio",
    accent: "#e11d48"
  }
];
