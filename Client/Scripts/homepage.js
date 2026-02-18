let slide_number = 1;
const totalSlides = 5;

function showSlide(n) {
    for (let i = 1; i <= totalSlides; i++) {
        const slide = document.getElementById("feature" + i);
        slide.classList.remove("active"); // remove active class from all
    }
    document.getElementById("feature" + n).classList.add("active"); // show current slide
}

showSlide(slide_number);
setInterval(() => {
    slide_number++;
    if (slide_number > totalSlides) slide_number = 1;
    showSlide(slide_number);
}, 3000);

