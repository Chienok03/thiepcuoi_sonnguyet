// --- Slideshow (giữ nguyên) ---
let slides = document.querySelectorAll(".slideshow .slide");
let index = 0;
if (slides.length) slides[index].classList.add("active");
setInterval(() => {
  if (!slides.length) return;
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 5000);

// --- Floating hearts (giữ nguyên) ---
const heartsContainer = document.querySelector(".hearts-container");

setInterval(() => {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💗";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 2 + "s";
  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}, 500);

// --- Audio controls (sửa) ---
const btn = document.getElementById("musicBtn");
const music = document.getElementById("bgMusic");

// Helper: set UI state based on playing boolean
function setPlayingUI(isPlaying) {
  if (!btn) return;
  if (isPlaying) {
    btn.textContent = "🧿";
    btn.classList.add("playing");
  } else {
    btn.textContent = "🎵";
    btn.classList.remove("playing");
  }
}

// Sync UI with actual audio events (covers cases audio is paused/ended externally)
if (music) {
  music.addEventListener("play", () => setPlayingUI(true));
  music.addEventListener("pause", () => setPlayingUI(false));
  music.addEventListener("ended", () => setPlayingUI(false));
}

// Try autoplay strategy:
// 1) Try to play muted (muted autoplay allowed in many browsers).
// 2) If success, unmute after user interaction (or unmute right away if allowed).
// 3) If muted-play rejected or not desired, show play button so user can tap.
window.addEventListener("load", async () => {
  if (!music) return;
  // First try muted autoplay (more likely to succeed)
  music.muted = true;
  try {
    await music.play();
    // muted autoplay succeeded
    // unmute if browser allows (may still keep muted until user interacts on some mobile)
    try {
      music.muted = false;
    } catch (e) {
      /* ignore */
    }
    setPlayingUI(!music.paused);
  } catch (err) {
    // muted autoplay failed (very restrictive browser). show play icon and wait for user gesture.
    setPlayingUI(false);
  }
});

// Toggle when user clicks button (user gesture will allow playback/unmute)
if (btn && music) {
  btn.addEventListener("click", async () => {
    try {
      if (music.paused) {
        // ensure unmuted when user explicitly requests sound
        music.muted = false;
        await music.play();
        setPlayingUI(true);
      } else {
        music.pause();
        setPlayingUI(false);
      }
    } catch (err) {
      // If play() rejected for some reason, show play icon (user may need to tap again)
      console.warn("Play failed:", err);
      setPlayingUI(false);
    }
  });
}
