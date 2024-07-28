const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".wrapper-image img");
const musicName = wrapper.querySelector(".wrapper-song-name");
const musicArtist = wrapper.querySelector(".wrapper-song-artist");
const playlistLoopedBtn = wrapper.querySelector("#repeatIcon");
const prevBtn = wrapper.querySelector("#previousIcon");
const playPauseBtn = wrapper.querySelector(".playPause");
const playPauseIcon = playPauseBtn.querySelector("i");
const nextBtn = wrapper.querySelector("#nextIcon");
const playlistBtn = wrapper.querySelector("#playlistIcon");
const closeBtn = wrapper.querySelector("#close");
const mainAudio = wrapper.querySelector("#main-audio");
const progress = wrapper.querySelector(".wrapper-progress");
const progressBar = wrapper.querySelector(".wrapper-progress-bar");
const musicList = wrapper.querySelector(".wrapper-music-list");
const repeatBtn = wrapper.querySelector("#repeatIcon");
const ulTag = wrapper.querySelector(".music-playlist");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
let isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNum) {
  musicName.innerText = allMusic[indexNum - 1].name;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `images/${allMusic[indexNum - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNum - 1].src}.mp3`;
  mainAudio.volume = 0.2;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseIcon.classList.replace("fa-circle-play", "fa-circle-pause");
  mainAudio.play();
  isMusicPaused = false;
  playingSong();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseIcon.classList.replace("fa-circle-pause", "fa-circle-play");
  mainAudio.pause();
  isMusicPaused = true;
  playingSong();
}

playPauseBtn.addEventListener("click", () => {
  const isPaused = wrapper.classList.contains("paused");
  isPaused ? pauseMusic() : playMusic();
});

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

prevBtn.addEventListener("click", () => {
  prevMusic();
});

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

nextBtn.addEventListener("click", () => {
  nextMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".wrapper-bottom-timer-current"),
    musicDuration = wrapper.querySelector(".wrapper-bottom-timer-max");

  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progress.addEventListener("click", (e) => {
  let progressWidth = progress.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.classList.contains("fa-rotate")
    ? "repeat"
    : repeatBtn.classList.contains("fa-repeat")
    ? "repeat_one"
    : "shuffle";

  switch (getText) {
    case "repeat":
      repeatBtn.classList.replace("fa-rotate", "fa-repeat");
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.classList.replace("fa-repeat", "fa-random");
      repeatBtn.setAttribute("title", "Playback Shuffled");
      break;
    case "shuffle":
      repeatBtn.classList.replace("fa-random", "fa-rotate");
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.classList.contains("fa-rotate")
    ? "repeat"
    : repeatBtn.classList.contains("fa-repeat")
    ? "repeat_one"
    : "shuffle";

  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;

    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

playlistBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeBtn.addEventListener("click", () => {
  musicList.classList.remove("show");
});

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
    <li li-index="${i + 1}">
        <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
        </div>
        <span class="audio-duration" id="${allMusic[i].src}">3:40</span>
        <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
        <span class="status"></span> <!-- Status for Playing/Paused -->
    </li>
  `;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".status");
    let durationTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      audioTag.innerText = "";
      durationTag.style.display = "inline";
    }

    if (allLiTag[j].classList.contains("paused")) {
      allLiTag[j].classList.remove("paused");
      audioTag.innerText = "";
      durationTag.style.display = "inline";
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      durationTag.style.display = "none";
      if (mainAudio.paused) {
        allLiTag[j].classList.add("paused");
        audioTag.innerText = "Paused";
      } else {
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
