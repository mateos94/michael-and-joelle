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
          const envelopeContainer = document.querySelector('.envelope-page');
    if (envelopeContainer) envelopeContainer.style.display = 'none';

    // Then show German or Arabic section
    showEl(germanSection);
    setupScrollEffects();
      }
    }, 1000); // matches fade-to-white timing
  });

  document.addEventListener('DOMContentLoaded', initEnvelope);
})();


/* ======= Minimal single-page wiring (non-invasive) =======
   - Uses inline style.display toggles (no CSS edits)
   - Keeps original script.js untouched
   - Append this at the end of your js/script.js or the inline snippet
=========================================================== */
(function () {
  // Look up elements (ids/classes you already use)
  const languageSelection = document.getElementById('language-selection');
  const languageBackground = document.getElementById('language-background');
  const langBtns = document.querySelectorAll('.language-btn'); // buttons with data-lang
  const germanSection = document.getElementById('german-section');
  const arabicSection = document.getElementById('arabic-section');
  const envelopeVideo = document.getElementById('envelopeVideo');
  const envelopePreview = document.querySelector('.envelope-preview');
  const audio = document.getElementById('backgroundSong');

  if (!languageSelection || !langBtns.length || !germanSection || !arabicSection) {
    // required elements missing — bail out silently
    return;
  }

  // Helper to hide an element (preserve inline display removal)
  function hideEl(el) {
    if (!el) return;
    el.style.display = 'none';
    el.classList.add('hidden'); // keep your class toggles too for compatibility
  }
  function showEl(el) {
    if (!el) return;
    el.style.display = ''; // fallback to CSS-controlled display
    el.classList.remove('hidden');
  }

  // On initial load: ensure only the envelope or nothing is visible.
  // We hide both invitation sections and language overlay/background.
  hideEl(germanSection);
  hideEl(arabicSection);
  hideEl(languageSelection);
  hideEl(languageBackground);

  // If your envelope preview is shown & video exists, make sure it's visible
  if (envelopePreview) envelopePreview.style.display = '';

  // When the envelope video ends your original script adds .show or removes .hidden.
  // To be safe, intercept Mutation or add a small fallback: observe the video 'ended' event
  if (envelopeVideo) {
    envelopeVideo.addEventListener('ended', () => {
      // ensure language overlay/background are actually visible (not just class toggles)
      showEl(languageBackground);
      showEl(languageSelection);

      // scroll to top so overlay sits at the top (catches the "big white box" problem)
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // If users click the preview to play the video (your original handler), keep that behavior:
    if (envelopePreview) {
      envelopePreview.addEventListener('click', () => {
        // preview hidden in original code; ensure it's hidden here too
        envelopePreview.style.display = 'none';
        if (envelopeVideo) envelopeVideo.style.display = 'block';
      });
    }
  }

  // Start music helper (user gesture must be on this page)
  function startMusic() {
    if (!audio) return;
    try {
      audio.muted = false;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          // allow resume on next user gesture if blocked
          const resume = () => { audio.play().catch(()=>{}); document.removeEventListener('touchstart', resume); document.removeEventListener('click', resume); };
          document.addEventListener('touchstart', resume, { once: true });
          document.addEventListener('click', resume, { once: true });
        });
      }
    } catch (e) { /* ignore */ }
  }

  // Main language button behavior: hide overlay, start music, show requested invitation
  langBtns.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();

      const lang = btn.dataset && btn.dataset.lang ? btn.dataset.lang : btn.getAttribute('data-lang');

      // user gesture -> start music
      startMusic();

      // hide overlay/background (force hide so it won't remain in layout)
      hideEl(languageSelection);
      hideEl(languageBackground);

      // hide both invitations first, then show the selected one
      hideEl(germanSection);
      hideEl(arabicSection);

      if (lang === 'de' || lang === 'deu' || lang === 'german') {
        showEl(germanSection);
        germanSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else if (lang === 'ar' || lang === 'arabic') {
        showEl(arabicSection);
        arabicSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        // default: german
        showEl(germanSection);
        germanSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      }

document.querySelectorAll('.hero').forEach(h => h.style.opacity = '1');
window.scrollTo({ top: 0, behavior: 'instant' });

      // For safety: hide envelope video/preview so it doesn't reserve vertical space
      if (envelopeVideo) { envelopeVideo.style.display = 'none'; }
      if (envelopePreview) { envelopePreview.style.display = 'none'; }

// ---------- AUTO-SCROLL AFTER LANGUAGE SELECTION (cancellable) ----------
let langAutoScrollCanceled = false;

// if the user scrolls themselves, cancel the upcoming auto-scroll
const cancelLangAutoScroll = () => {
  langAutoScrollCanceled = true;
  window.removeEventListener("scroll", cancelLangAutoScroll);
};
window.addEventListener("scroll", cancelLangAutoScroll, { passive: true });

setTimeout(() => {
  if (langAutoScrollCanceled) return; // user scrolled already, don't force scroll

  const dest = document.documentElement.scrollHeight - window.innerHeight;

  window.scrollTo({ top: dest, behavior: "smooth" });

  // safety snap after animation completes
  setTimeout(() => {
    if (langAutoScrollCanceled) return; // if they scrolled during the smooth scroll, don't snap
    window.scrollTo({ top: dest, behavior: "auto" });
    
  }, 3000);
}, 4000);


    }, { passive: false });
  });

  // Optional: expose a go-back helper if you want to test returning to language overlay
  window.__showLanguageOverlay = function() {
    // hide sections
    hideEl(germanSection);
    hideEl(arabicSection);
    // show overlay
    showEl(languageBackground);
    showEl(languageSelection);
    window.scrollTo({ top:0, behavior:'instant' });
  };

})(); 


//fit footer in 1 line
function fitOneLine(el, maxSize = 16, minSize = 10) {
  if (!el) return;
  
  let size = maxSize;
  el.style.whiteSpace = "nowrap";
  el.style.fontSize = size + "px";
  el.style.textOverflow = "clip"; // no ellipsis

  // shrink until it fits
  while (el.scrollWidth > el.clientWidth && size > minSize) {
    size -= 0.5;
    el.style.fontSize = size + "px";
  }
}

// Run after language loads
window.addEventListener("load", () => {
  const footer = document.querySelector(".footer-text");
  fitOneLine(footer, 16, 10);
});

// Also run after language selection because text appears then
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const footer = document.querySelector(".footer-text");
    fitOneLine(footer, 16, 10);
  }, 1000);
});


