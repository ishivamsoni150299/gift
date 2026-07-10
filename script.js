const gates = {
  "first-meet": {
    answer: "9 november 2025",
    unlock: "meeting",
    success: "You unlocked the day everything quietly began.",
    soft: "Close, Gudiya. I will not make you stuck here.",
    options: ["4 November 2025", "9 November 2025", "14 November 2025", "9 December 2025", "8 July 2026", "14 June 2026"]
  },
  "said-yes": {
    answer: "14 june 2026",
    unlock: "yes",
    success: "You unlocked the day my future became clearer.",
    soft: "Not that one, Sneha. Here are softer clues.",
    options: ["9 November 2025", "10 June 2026", "14 June 2026", "17 June 2026", "8 July 2026", "17 July 2026"]
  },
  chocolate: {
    answer: "8 july 2026",
    unlock: "chocolate",
    success: "You unlocked the sweetest little memory.",
    soft: "Almost. This memory is sweet, so I will make it easier.",
    options: ["1 July 2026", "8 July 2026", "14 June 2026", "9 July 2026", "17 July 2026", "9 November 2025"]
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
const toast = document.querySelector(".unlock-toast");
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

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function burstHearts(origin = "50%") {
  const layer = document.createElement("div");
  layer.className = "heart-burst";
  layer.style.left = origin;

  for (let index = 0; index < 10; index += 1) {
    const heart = document.createElement("span");
    heart.textContent = "♥";
    heart.style.setProperty("--x", `${(index - 4.5) * 18}px`);
    heart.style.setProperty("--delay", `${index * 35}ms`);
    layer.append(heart);
  }

  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 1400);
}

function renderOptions(form, gate) {
  if (form.querySelector(".answer-options")) return;

  const options = document.createElement("div");
  options.className = "answer-options";
  options.setAttribute("aria-label", "Choose one answer");

  gate.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => {
      form.querySelector("input").value = option;
      form.requestSubmit();
    });
    options.append(button);
  });

  const help = document.createElement("p");
  help.className = "help-line";
  help.innerHTML = 'Still confused? Call Shivam: <a href="tel:9473903051">9473903051</a>';

  form.append(options, help);
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
      form.querySelectorAll(".answer-options button").forEach((button) => button.setAttribute("disabled", "true"));
      showToast(gate.success);
      burstHearts();
      navigator.vibrate?.(35);
      showStep(gate.unlock);
      return;
    }

    const attempts = Number(form.dataset.attempts || "0") + 1;
    form.dataset.attempts = String(attempts);
    setFeedback(
      form,
      attempts === 1 ? `${gate.soft} Choose from these six memories, or call me if you want my voice.` : "This one is not the key, but the right memory is still here.",
      "is-soft"
    );
    renderOptions(form, gate);
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
    form.dataset.attempts = "0";
    form.querySelector("input").removeAttribute("disabled");
    form.querySelector("button").removeAttribute("disabled");
    form.querySelector(".answer-options")?.remove();
    form.querySelector(".help-line")?.remove();
    const feedback = form.querySelector(".feedback");
    feedback.textContent = "";
    feedback.classList.remove("is-good", "is-soft");
  });

  setProgress("start");
  document.body.classList.remove("is-celebrating");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#finalPromise")?.addEventListener("click", () => {
  const promise = document.querySelector("#secretPromise");
  promise?.classList.add("is-visible");
  document.querySelector("#finalPromise")?.setAttribute("disabled", "true");
  showToast("One last promise unlocked for Sneha.");
  burstHearts("50%");
  navigator.vibrate?.([30, 40, 30]);
});

window.addEventListener("load", () => {
  setProgress("start");
  document.querySelectorAll(".lock-screen .reveal").forEach((item) => item.classList.add("is-visible"));
});
