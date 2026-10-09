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
  }
];
