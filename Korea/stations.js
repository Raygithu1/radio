/* Korean stations. Same format as the main page's stations.js:
   logo: path to an image file (put it in assets/logos/)
   stream: the HLS .m3u8 playlist URL, or a direct mp3/aac stream URL
   type: "hls" for .m3u8, "audio" for a direct mp3/aac link
   accent: any CSS color used to tint the tile */
window.STATIONS = [
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
    id: "mbcfm4u",
    name: "MBC FM4U 91.9",
    subtitle: "한국 FM 91.9",
    logo: "assets/logos/mbcfm4u.png",
    stream: "",
    type: "hls",
    accent: "#ec008c",
    resolve: function () {
      return new Promise(function (resolve, reject) {
        var cb = "__mbcFm4u" + Math.random().toString(36).slice(2);
        var s = document.createElement("script");
        function cleanup() {
          if (s && s.parentNode) s.parentNode.removeChild(s);
          try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        }
        window[cb] = function (data) {
          cleanup();
          if (data && data.AACLiveURL) resolve(data.AACLiveURL);
          else reject(new Error("station"));
        };
        s.src = "https://sminiplay.imbc.com/aacplay.ashx?channel=mfm&protocol=M3U8&agent=webapp&callback=" + cb;
        s.onerror = function () { cleanup(); reject(new Error("station")); };
        document.head.appendChild(s);
      });
    }
  }
];