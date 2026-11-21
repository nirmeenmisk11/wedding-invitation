
// =====================================
// Wedding Invitation
// Ahmad & Nirmeen
// =====================================

// Wedding date in Jordan timezone (UTC+3)
const weddingDate = new Date("2027-07-27T19:00:00+03:00");

// WhatsApp number for RSVP
// Example: 9627XXXXXXXX
// Replace this with the real number.
const whatsappNumber = "962796079701";

// Elements
const openingScreen = document.getElementById("openingScreen");
const openEnvelope = document.getElementById("openEnvelope");
const mainContent = document.getElementById("mainContent");

const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");

let invitationOpened = false;

// =====================================
// 1. Open Envelope
// =====================================

openEnvelope.addEventListener("click", () => {
  if (invitationOpened) return;

  invitationOpened = true;

  openEnvelope.classList.add("opening");
  openEnvelope.disabled = true;

  // Wait for envelope animation
  setTimeout(() => {
    openingScreen.classList.add("hide");

    mainContent.classList.add("visible");
    mainContent.setAttribute("aria-hidden", "false");

    document.body.classList.remove("locked");

    musicButton.hidden = false;

    window.scrollTo(0, 0);

    startRevealAnimations();

    // Try to play music after user interaction
    playMusic();
  }, 2200);

  // Remove opening screen after transition
  setTimeout(() => {
    openingScreen.remove();
  }, 3500);
});

// =====================================
// 2. Background Music
// =====================================

backgroundMusic.volume = 0.35;

async function playMusic() {
  try {
    await backgroundMusic.play();

    musicButton.classList.add("playing");
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-pressed", "true");
  } catch (error) {
    // Browsers may block delayed playback.
    // The guest can press the music button.
    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
    musicButton.setAttribute("aria-pressed", "false");
  }
}

musicButton.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    await playMusic();
  } else {
    backgroundMusic.pause();

    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

// =====================================
// 3. Countdown Timer
// =====================================

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    document.getElementById("countdownMessage").textContent =
      "اليوم يوم فرحتنا! ❤️";

    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================
// 4. Scroll Reveal Animation
// =====================================

function startRevealAnimations() {
  const sections = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    sections.forEach(section => {
      section.classList.add("active");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  sections.forEach(section => observer.observe(section));
}

// =====================================
// 5. RSVP Form
// =====================================

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const guestName = document.getElementById("guestName").value.trim();
  const guestCount = document.getElementById("guestCount").value;
  const attendance = document.getElementById("attendance").value;

  if (!guestName) return;

  const message =
    `تأكيد حضور زفاف أحمد ونيرمين ❤️\n\n` +
    `الاسم: ${guestName}\n` +
    `عدد الأشخاص: ${guestCount}\n` +
    `الحضور: ${attendance}\n\n` +
    `27 يوليو 2027 | DUNES CLUB`;

  if (whatsappNumber) {
    const url =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");

    rsvpStatus.textContent =
      "تم فتح واتساب. يرجى الضغط على إرسال لتأكيد الرد.";
  } else {
    try {
      await navigator.clipboard.writeText(message);

      rsvpStatus.textContent =
        "تم نسخ الرد. أضيفي رقم واتساب في script.js لتفعيل الإرسال.";
    } catch (error) {
      rsvpStatus.textContent =
        "أضيفي رقم واتساب في script.js لتفعيل إرسال الردود.";
    }
  }
});

// =====================================
// 6. Add to Calendar
// =====================================

const calendarButton = document.getElementById("calendarButton");

const calendarStart = "20270727T160000Z";
const calendarEnd = "20270727T200000Z";

const calendarUrl = new URL(
  "https://calendar.google.com/calendar/render"
);

calendarUrl.searchParams.set("action", "TEMPLATE");
calendarUrl.searchParams.set("text", "زفاف أحمد ونيرمين ❤️");
calendarUrl.searchParams.set(
  "dates",
  `${calendarStart}/${calendarEnd}`
);
calendarUrl.searchParams.set("details", "Celebrate With Us ❤️");
calendarUrl.searchParams.set("location", "DUNES CLUB");
calendarUrl.searchParams.set("ctz", "Asia/Amman");

calendarButton.href = calendarUrl.toString();
calendarButton.target = "_blank";
calendarButton.rel = "noopener noreferrer";
