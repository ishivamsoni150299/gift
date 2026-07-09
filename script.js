const reveals = document.querySelectorAll(".reveal");
const replay = document.querySelector("#playAgain");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item) => observer.observe(item));

replay.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  reveals.forEach((item) => item.classList.remove("is-visible"));

  window.setTimeout(() => {
    reveals.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight) {
        item.classList.add("is-visible");
      }
    });
  }, 450);
});

window.addEventListener("load", () => {
  document.querySelector(".hero__content")?.classList.add("is-visible");
});
