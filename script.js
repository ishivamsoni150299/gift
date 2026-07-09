const gates = {
  "first-meet": {
    answer: "9 november 2025",
    unlock: "meeting",
    success: "You unlocked the day everything quietly began.",
    soft: "Close, but not that day. Think November, the first time our story started."
  },
  "said-yes": {
    answer: "14 june 2026",
    unlock: "yes",
    success: "You unlocked the day my future became clearer.",
    soft: "Not that one. It was in June, and it gave me a reason to dream bigger."
  },
  chocolate: {
    answer: "8 july 2026",
    unlock: "chocolate",
    success: "You unlocked the sweetest little memory.",
    soft: "Almost. It was in July, and the photo has the red wrapper."
  }
};

const aliases = new Map([
  ["09 november 2025", "9 november 2025"],
  ["9 nov 2025", "9 november 2025"],
  ["09 nov 2025", "9 november 2025"],
  ["9/11/2025", "9 november 2025"],
  ["09/11/2025", "9 november 2025"],
  ["14 jun 2026", "14 june 2026"],
  ["14/06/2026", "14 june 2026"],
  ["14-06-2026", "14 june 2026"],
  ["8 july 2026", "8 july 2026"],
  ["08 july 2026", "8 july 2026"],
  ["8 jul 2026", "8 july 2026"],
  ["08 jul 2026", "8 july 2026"],
  ["8/7/2026", "8 july 2026"],
  ["08/07/2026", "8 july 2026"],
  ["8-7-2026", "8 july 2026"],
  ["08-07-2026", "8 july 2026"]
]);

const reveals = document.querySelectorAll(".reveal");
const progressDots = document.querySelectorAll("[data-progress-dot]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((item) => observer.observe(item));

function setProgress(id) {
  let hasReachedTarget = true;

  progressDots.forEach((dot) => {
    dot.classList.toggle("is-active", hasReachedTarget);
    if (dot.dataset.progressDot === id) {
      hasReachedTarget = false;
    }
  });
}

function normalizeAnswer(value) {
  const cleaned = value.trim().toLowerCase().replace(/[,]+/g, "").replace(/\s+/g, " ");
  return aliases.get(cleaned) || cleaned;
}

function showStep(id) {
  const step = document.querySelector(`[data-step="${id}"]`);
  if (!step) return;

  step.classList.remove("locked");
  step.classList.add("unlocked");
  setProgress(id);

  if (id === "meeting") {
    document.body.classList.add("is-celebrating");
    window.setTimeout(() => document.body.classList.remove("is-celebrating"), 1200);
  }

  window.setTimeout(() => {
    step.scrollIntoView({ behavior: "smooth", block: "start" });
    step.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }, 120);
}

function setFeedback(form, message, kind) {
  const feedback = form.querySelector(".feedback");
  feedback.textContent = message;
  feedback.classList.remove("is-good", "is-soft");
  feedback.classList.add(kind);
}

document.querySelectorAll("form[data-gate]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const gate = gates[form.dataset.gate];
    const input = form.querySelector("input");
    const answer = normalizeAnswer(input.value);

    if (answer === gate.answer) {
      setFeedback(form, gate.success, "is-good");
      input.setAttribute("disabled", "true");
      form.querySelector("button").setAttribute("disabled", "true");
      showStep(gate.unlock);
      return;
    }

    setFeedback(form, gate.soft, "is-soft");
    input.select();
  });
});

document.querySelectorAll("[data-unlock]").forEach((button) => {
  button.addEventListener("click", () => showStep(button.dataset.unlock));
});

document.querySelector("#replay")?.addEventListener("click", () => {
  document.querySelectorAll("[data-step]").forEach((step) => {
    step.classList.add("locked");
    step.classList.remove("unlocked");
  });

  document.querySelectorAll("form[data-gate]").forEach((form) => {
    form.reset();
    form.querySelector("input").removeAttribute("disabled");
    form.querySelector("button").removeAttribute("disabled");
    const feedback = form.querySelector(".feedback");
    feedback.textContent = "";
    feedback.classList.remove("is-good", "is-soft");
  });

  setProgress("start");
  document.body.classList.remove("is-celebrating");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("load", () => {
  setProgress("start");
  document.querySelectorAll(".lock-screen .reveal").forEach((item) => item.classList.add("is-visible"));
});
