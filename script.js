// Script cho slideshow tự động
let index = 0;
const slides = document.querySelectorAll(".slideshow img");

function showSlide() {
  slides.forEach((img, i) => {
    img.classList.toggle("active", i === index);
  });
  index = (index + 1) % slides.length;
}

showSlide();
setInterval(showSlide, 4000); // đổi ảnh mỗi 4 giây
