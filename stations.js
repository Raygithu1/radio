/* Add a new station by copying one block below and editing the values.
   logo: path to an image file (put it in assets/logos/)
   stream: the HLS .m3u8 playlist URL, or a direct mp3/aac stream URL
   type: "hls" for .m3u8, "audio" for a direct mp3/aac link
   accent: any CSS color used to tint the tile */
window.STATIONS = [
  {
    id: "am1320",
    name: "AM 1320",
    subtitle: "加拿大溫哥華 華僑之聲",
    logo: "assets/logos/am1320.png",
    stream: "https://stream.radiojar.com/nugqupcv8qzuv.mp3",
    type: "audio",
    accent: "#e11d48",
    section: "Vancouver"
  },
  {
    id: "fm961",
    name: "FM 96.1",
    subtitle: "加拿大中文電台",
    logo: "assets/logos/fm961.jpg",
    stream: "https://stream.eseenet.com/radio/fm961.stream/playlist.m3u8",
    type: "hls",
    accent: "#e11d48",
    section: "Vancouver"
  },
  {
    id: "am1430",
    name: "AM 1430",
    subtitle: "Fairchild Radio",
    logo: "assets/logos/am1430.jpg",
    stream: "https://stream.eseenet.com/radio/am1430.stream/playlist.m3u8",
    type: "hls",
    accent: "#e11d48",
    section: "Toronto"
  },
  {
    id: "fm889",
    name: "FM 88.9",
    subtitle: "Fairchild Radio",
    logo: "assets/logos/fm889.jpg",
    stream: "https://stream.eseenet.com/radio/fm889.stream/playlist.m3u8",
    type: "hls",
    accent: "#e11d48",
    section: "Toronto"
  },
  {
    id: "fm919",
    name: "FM 91.9",
    subtitle: "Sing Tao A1 Chinese Radio",
    logo: "",
    stream: "https://ice24.securenetsystems.net/CHINFM1",
    type: "audio",
    accent: "#2563eb",
    section: "Toronto"
  },
  {
    id: "fm1007",
    name: "FM 100.7",
    subtitle: "Sing Tao A1 Chinese Radio",
    logo: "",
    stream: "https://ice7.securenetsystems.net/CHINFM",
    type: "audio",
    accent: "#2563eb",
    section: "Toronto"
  }
];
