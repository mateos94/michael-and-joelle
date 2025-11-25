// ----- Countdown Timer with language localization -----
(function () {


 let autoScrollTimeout = null;
  let autoScrollCanceled = false;

// ---------- Auto-scroll + safe parallax (drop-in replacement) ----------
window.addEventListener("load", () => {
  const firstHero = document.querySelector(".hero:not(.second-image)");
  const secondHero = document.querySelector(".hero.second-image");
  if (!firstHero || !secondHero) return;

  // ---- AUTO-SCROLL (safe) ----
  let autoScrollTimeout = null;
  let autoScrollCanceled = false;

  // Cancel auto-scroll on any user scroll or touch
  const cancelAutoScroll = () => {
    autoScrollCanceled = true;
    window.removeEventListener("scroll", cancelAutoScroll);
    window.removeEventListener("touchstart", cancelAutoScroll);
    if (autoScrollTimeout) clearTimeout(autoScrollTimeout);
  };
  window.addEventListener("scroll", cancelAutoScroll, { once: true, passive: true });
  window.addEventListener("touchstart", cancelAutoScroll, { once: true, passive: true });

  // Enable/disable easily
  const enableAutoScroll = true;

  if (enableAutoScroll) {
    autoScrollTimeout = setTimeout(() => {
      if (autoScrollCanceled) return;

      // subtle fade-out of the first hero (keeps visual continuity)
      firstHero.classList.add("fade-section-out");

      // small delay so fade begins before scrolling
      setTimeout(() => {
        if (autoScrollCanceled) return;

        // Compute destination. Subtract a small offset so the second hero sits nicely (not behind gradient).
        // Adjust offset if you have top padding or overlays (140 is your earlier padding, but we use a safer 20 here).
        const dest = document.documentElement.scrollHeight - window.innerHeight;

        // If user interacts, abort auto-scroll
        let userInterrupted = false;
        const onUserDuringAuto = () => { userInterrupted = true; };
        window.addEventListener("wheel", onUserDuringAuto, { once: true, passive: true });
        window.addEventListener("touchstart", onUserDuringAuto, { once: true, passive: true });
        window.addEventListener("keydown", onUserDuringAuto, { once: true, passive: true });

        // start smooth scroll
        window.scrollTo({ top: dest, behavior: "smooth" });

        // monitor progress: stop when close enough or user interrupts or timeout (4s)
        let checks = 0;
        const maxChecks = 80; // ~4s (80 * 50ms)
        const checkInterval = 50;
        const monitor = setInterval(() => {
          checks++;
          const current = window.scrollY || window.pageYOffset;
          if (userInterrupted || Math.abs(current - dest) < 3 || checks >= maxChecks) {
            clearInterval(monitor);
            // final snap to exact destination (ensures consistent layout)
            if (!userInterrupted) window.scrollTo({ top: dest, behavior: "auto" });
            // cleanup listeners
            window.removeEventListener("wheel", onUserDuringAuto);
            window.removeEventListener("touchstart", onUserDuringAuto);
            window.removeEventListener("keydown", onUserDuringAuto);
          }
        }, checkInterval);

      }, 300); // small fade delay
    }, 3000); // your original 3s delay
  }

  // ---- SAFER PARALLAX (rAF + clamped) ----
  let ticking = false;
  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function onScrollParallax() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;

      // conservative parallax strength and clamp values
      const firstOffset = clamp(scrollY * 0.12, -120, 120);
      firstHero.style.backgroundPosition = `center calc(50% + ${firstOffset}px)`;

      // second hero offset based on scroll distance from its top
      const base = scrollY - secondHero.offsetTop;
      const secondOffset = clamp(base * 0.12, -100, 100);
      secondHero.style.backgroundPosition = `center calc(50% + ${secondOffset}px)`;

      // Fade between heroes (safe clamping)
      const triggerPoint = Math.max(1, secondHero.offsetTop * 0.6);
      const ratio = clamp(scrollY / triggerPoint, 0, 1);
      firstHero.style.opacity = (1 - ratio).toString();
      secondHero.style.opacity = ratio.toString();

      ticking = false;
    });
  }

  // initialize once (in case user landed mid-page)
  onScrollParallax();
  window.addEventListener("scroll", onScrollParallax, { passive: true });
});



  // ---- Petals ----
const petalContainer = document.getElementById("petal-container");
let petalsStarted = false;

function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 4 + Math.random() * 4 + "s";
  petal.style.opacity = 0.7 + Math.random() * 0.3;
  
  petalContainer.appendChild(petal);

  setTimeout(() => petal.remove(), 8000);
}

function startPetals() {
  if (petalsStarted) return; // <-- prevents infinite creation
  petalsStarted = true;

  const interval = setInterval(createPetal, 250);

  // stop after 3 seconds
  setTimeout(() => clearInterval(interval), 3000);
}

window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.2) {
    startPetals();
  }
});



  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  // Event date (set to midnight of date; adjust time if required)
  const weddingDate = new Date("2026-05-23T00:00:00").getTime();

  // labels by language code
  const LABELS = {
    en: { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds', finished: 'Happily Ever After!' },
    ar: { days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثواني', finished: 'حياة سعيدة للأبد!' }
  };

  // determine page language (fallback to 'en')
  const pageLang = (document.documentElement.lang || 'en').slice(0,2).toLowerCase();
  const labels = LABELS[pageLang] || LABELS.en;

  function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
      countdownEl.innerHTML = `<div class="arabic-body">${labels.finished}</div>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // render numbers with the same digits, but localized labels
    countdownEl.innerHTML = `
      <div class="time-box"><div class="number">${days}</div><div class="label">${labels.days}</div></div>
      <div class="time-box"><div class="number">${hours}</div><div class="label">${labels.hours}</div></div>
      <div class="time-box"><div class="number">${minutes}</div><div class="label">${labels.minutes}</div></div>
      <div class="time-box"><div class="number">${seconds}</div><div class="label">${labels.seconds}</div></div>
    `;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();


// ----- Fade-in Animation (IntersectionObserver) -----
(function () {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders || faders.length === 0) return;

  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
})();


// ----- Envelope Intro video behavior (kept consistent with your original) -----
(function initEnvelope() {
  const container = document.querySelector('.envelope-container');
  const video = document.getElementById('envelopeVideo');
  const audio = document.getElementById('backgroundSong');

  const preview = document.querySelector('.envelope-preview');
  const languageSelection = document.getElementById('language-selection');
  const languagebackground = document.getElementById('language-background');

  // Start background music immediately
  if (audio) {
  // Preload muted on page load (allowed everywhere)
  audio.muted = true;
  audio.play().catch(e => console.log('Muted preload failed (expected on some browsers):', e));

  // Function to start/unmute on user gesture
  function startAudio() {
    audio.muted = false;
    audio.play().then(() => {
    }).catch(e => {
      console.error('Audio play failed:', e);
      // Fallback: Show toggle button if direct play fails
    });
  }

  // Attach to first user gesture (e.g., on page load, listen for any click/touch)
  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });

  // Optional: Manual toggle if needed
}

  // Safety checks
  if (!container || !video || !preview) return;

  // Ensure video is hidden initially
  video.style.display = 'none';

  // --------- NEW BEHAVIOR: auto-start after 1 second ---------
  setTimeout(() => {
    // Fade out preview
    preview.style.opacity = '0';

    setTimeout(() => {
      preview.style.display = 'none';

      // Show and play the video muted
      video.style.display = 'block';
      video.muted = true;
      video.play();
    }, 200);

  }, 1000); // <-- delay before the opening animation starts
  // ------------------------------------------------------------

  // When the video finishes:
  video.addEventListener('ended', () => {
    // Fade the video to white
    video.classList.add('video-fade-out');

    setTimeout(() => {
      video.style.display = 'none';

      // Reveal language selector
      if (languageSelection) {
        languagebackground.classList.remove('hidden');
        languagebackground.classList.add('show');
        languageSelection.classList.remove('hidden');
        languageSelection.classList.add('show');
      }
    }, 1000); // matches fade-to-white timing
  });

  document.addEventListener('DOMContentLoaded', initEnvelope);
})();

