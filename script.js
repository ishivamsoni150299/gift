const giftContent = document.querySelector("#giftContent");
const openButton = document.querySelector("#openGift");
const confettiLayer = document.querySelector(".confetti-layer");
const moodNote = document.querySelector("#moodNote");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

function celebrate() {
  const colors = ["#d94b64", "#f7c95c", "#66c9c0", "#9a7bb8", "#ffffff"];

  for (let index = 0; index < 30; index += 1) {
    const piece = document.createElement("span");
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--delay", `${Math.random() * 260}ms`);
    piece.style.setProperty("--spin", `${Math.random() * 540 - 270}deg`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    if (index % 6 === 0) {
      piece.classList.add("is-heart");
      piece.textContent = "\u2665";
    }
    confettiLayer.append(piece);
  }

  window.setTimeout(() => confettiLayer.replaceChildren(), 2200);
}

function openGift() {
  giftContent.classList.remove("is-hidden");
  giftContent.setAttribute("aria-hidden", "false");
  openButton.setAttribute("disabled", "true");
  openButton.querySelector("span:last-child").textContent = "Gift opened 💖";
  document.body.classList.add("gift-is-open");
  celebrate();
  navigator.vibrate?.([24, 36, 24]);

  window.setTimeout(() => {
    document.querySelector("#story")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 520);
}

openButton?.addEventListener("click", openGift);

document.querySelectorAll(".mood-photo").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mood-photo").forEach((photo) => {
      photo.classList.remove("is-selected");
      photo.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");
    moodNote.textContent = button.dataset.note;
    moodNote.classList.remove("is-popping");
    window.requestAnimationFrame(() => moodNote.classList.add("is-popping"));
    navigator.vibrate?.(16);
  });
});

document.querySelectorAll(".tiny-note").forEach((button) => {
  button.addEventListener("click", () => {
    const reply = document.querySelector("#tinyReply");
    document.querySelectorAll(".tiny-note").forEach((note) => {
      note.classList.remove("is-open");
      note.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-open");
    button.setAttribute("aria-pressed", "true");
    reply.textContent = button.dataset.message;
    reply.classList.remove("is-popping");
    window.requestAnimationFrame(() => reply.classList.add("is-popping"));
    navigator.vibrate?.(16);
  });
});

document.querySelector("#playAgain")?.addEventListener("click", () => {
  giftContent.classList.add("is-hidden");
  giftContent.setAttribute("aria-hidden", "true");
  openButton.removeAttribute("disabled");
  openButton.querySelector("span:last-child").textContent = "Open my gift 🎁";
  document.body.classList.remove("gift-is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
