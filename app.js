(function () {
  "use strict";

  var el = {
    grid: document.getElementById("stations"),
    nowPlaying: document.getElementById("nowPlaying"),
    npLogo: document.getElementById("npLogo"),
    npPlaceholder: document.getElementById("npPlaceholder"),
    npName: document.getElementById("npName"),
    npSub: document.getElementById("npSub"),
    npStatus: document.getElementById("npStatus"),
    npPlay: document.getElementById("npPlay"),
    hint: document.getElementById("hint")
  };

  var audio = new Audio();
  audio.preload = "none";
  audio.setAttribute("playsinline", "");

  var hls = null;
  var current = null;
  var wantPlay = false;

  function setState(state, statusText) {
    el.nowPlaying.dataset.state = state;
    el.npStatus.textContent = statusText || "";
    el.npPlay.disabled = !current;
    el.npPlay.setAttribute(
      "aria-label",
      state === "playing" ? "Pause" : "Play"
    );
  }

  function destroyHls() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  }

  function stopAudio() {
    wantPlay = false;
    try {
      audio.pause();
    } catch (e) {}
    audio.removeAttribute("src");
    audio.load();
  }

  function showStation(station) {
    el.npName.textContent = station.name;
    el.npSub.textContent = station.subtitle || "Live radio";
    if (station.logo) {
      el.npLogo.src = station.logo;
      el.npLogo.alt = station.name;
      el.npLogo.hidden = false;
      el.npPlaceholder.hidden = true;
    } else {
      el.npLogo.hidden = true;
      el.npPlaceholder.hidden = false;
      el.npPlaceholder.textContent = station.name.charAt(0);
    }
  }

  function markActive(id) {
    var tiles = el.grid.querySelectorAll(".station");
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].classList.toggle("is-active", tiles[i].dataset.id === id);
    }
  }

  function play(station) {
    destroyHls();
    stopAudio();
    current = station;
    wantPlay = true;
    showStation(station);
    markActive(station.id);
    setState("loading", "Loading\u2026");
    try {
      localStorage.setItem("radio.lastStation", station.id);
    } catch (e) {}

    var useNativeHls = station.type === "hls" && !(window.Hls && window.Hls.isSupported());

    if (station.type === "hls" && window.Hls && window.Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(station.stream);
      hls.attachMedia(audio);
      hls.on(Hls.Events.ERROR, function (evt, data) {
        if (data && data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setState("error", "Can't reach this station. Tap to retry.");
          }
        }
      });
    } else {
      audio.src = station.stream;
      if (useNativeHls) audio.load();
    }

    audio.play().catch(function () {
      if (wantPlay) setState("paused", "Tap the big orange button to listen");
    });
  }

  function toggle() {
    if (!current) return;
    if (audio.paused) {
      wantPlay = true;
      setState("loading", "Loading\u2026");
      audio.play().catch(function () {
        setState("error", "Can't reach this station. Tap to retry.");
      });
    } else {
      wantPlay = false;
      audio.pause();
    }
  }

  audio.addEventListener("playing", function () {
    setState("playing", "Playing live \u25B6");
  });
  audio.addEventListener("waiting", function () {
    if (wantPlay) setState("loading", "Loading\u2026");
  });
  audio.addEventListener("pause", function () {
    if (current && !audio.ended) setState("paused", "Paused");
  });
  audio.addEventListener("stalled", function () {
    if (wantPlay) setState("loading", "Buffering\u2026");
  });
  audio.addEventListener("error", function () {
    if (current) setState("error", "Can't reach this station. Tap to retry.");
  });

  el.npPlay.addEventListener("click", toggle);

  function makeTile(station) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "station";
    btn.dataset.id = station.id;
    btn.setAttribute("aria-label", "Play " + station.name);

    var art = document.createElement("div");
    art.className = "station-art";
    if (station.logo) {
      var img = document.createElement("img");
      img.src = station.logo;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () {
        art.innerHTML = '<span class="station-fallback">' + station.name.charAt(0) + "</span>";
      };
      art.appendChild(img);
    } else {
      art.innerHTML = '<span class="station-fallback">' + station.name.charAt(0) + "</span>";
    }

    var text = document.createElement("div");
    var name = document.createElement("div");
    name.className = "station-name";
    name.textContent = station.name;
    text.appendChild(name);
    if (station.subtitle) {
      var sub = document.createElement("div");
      sub.className = "station-sub";
      sub.textContent = station.subtitle;
      text.appendChild(sub);
    }

    var action = document.createElement("div");
    action.className = "station-play";
    action.innerHTML = '<span class="dot"></span><span class="label">Listen</span>';

    btn.appendChild(art);
    btn.appendChild(text);
    btn.appendChild(action);

    btn.addEventListener("click", function () {
      if (current && current.id === station.id && !audio.paused) {
        toggle();
      } else {
        play(station);
      }
    });

    return btn;
  }

  function render() {
    var list = window.STATIONS || [];
    el.grid.innerHTML = "";
    list.forEach(function (station) {
      el.grid.appendChild(makeTile(station));
    });

    var last = null;
    try {
      last = localStorage.getItem("radio.lastStation");
    } catch (e) {}
    var lastStation = list.filter(function (s) {
      return s.id === last;
    })[0];
    if (lastStation) {
      current = lastStation;
      wantPlay = false;
      showStation(lastStation);
      markActive(lastStation.id);
      setState("paused", "Tap the big orange button to listen");
    }
  }

  render();
})();
