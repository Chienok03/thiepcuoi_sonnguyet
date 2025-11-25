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

// --- Lightbox Gallery ---
const images = document.querySelectorAll(".album-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const prevBtn = document.querySelector(".lightbox .prev");
const nextBtn = document.querySelector(".lightbox .next");

let currentIndex = 0;

function showImage(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex].src;
  lightbox.style.display = "flex";
}

images.forEach((img, i) => {
  img.addEventListener("click", () => showImage(i));
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});

// Vuốt trái/phải trên điện thoại
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (diff > 50) prevBtn.click();
  if (diff < -50) nextBtn.click();
});

// 🕒 Ngày cưới - chỉnh tại đây
const weddingDate = new Date("2025-11-30T10:00:00").getTime();

const countdown = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    clearInterval(countdown);
    document.querySelector(".countdown").innerHTML =
      "<p>Chúc mừng ngày cưới!</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("hours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").innerText = seconds
    .toString()
    .padStart(2, "0");
}, 1000);

// ------- PHÓNG TO QR ------- //
const qrImages = document.querySelectorAll(".qr-img");
const qrLightbox = document.getElementById("qrLightbox");
const qrZoomImg = document.getElementById("qrZoomImg");
const qrCloseBtn = document.querySelector(".qr-close");

qrImages.forEach(img => {
  img.addEventListener("click", () => {
    qrZoomImg.src = img.src;
    qrLightbox.style.display = "flex";
  });
});

qrCloseBtn.addEventListener("click", () => {
  qrLightbox.style.display = "none";
});

// Click ra ngoài cũng tắt
qrLightbox.addEventListener("click", (e) => {
  if (e.target === qrLightbox) {
    qrLightbox.style.display = "none";
  }
});

// --- Hiệu ứng xuất hiện thông tin cô dâu chú rể ---
document.addEventListener("DOMContentLoaded", () => {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll(".groom-info, .bride-info").forEach(el => {
    observer.observe(el);
  });

});

