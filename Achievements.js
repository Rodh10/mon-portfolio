



/* ==========================
      CURSEUR + ANTI-BLINK
   ========================== */

const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

let idleTimeout;
let blinkInterval;
let isBlinking = false;
let showCursorTimeout;

// --------- MOUVEMENT SOURIS : stop blink ---------
window.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';

  if (isBlinking) {
    clearInterval(blinkInterval);
    cursor.style.opacity = '1';
    isBlinking = false;
  }

  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    startBlinking();
  }, 1000);
});

function startBlinking() {
  if (isBlinking) return;
  isBlinking = true;

  blinkInterval = setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
  }, 500);
}

// --------- DISPARITION DU CURSEUR SUR MENUS ---------
function hideCursor() {
  clearTimeout(showCursorTimeout);
  cursor.style.display = 'none';

  // empêche le clignotement pendant le hover
  if (isBlinking) {
    clearInterval(blinkInterval);
    isBlinking = false;
    cursor.style.opacity = '1';
  }
}

function delayedShowCursor() {
  showCursorTimeout = setTimeout(() => {
    cursor.style.display = 'block';
  }, 500);
}

// --------- ÉLÉMENTS QUI DÉSACTIVENT LE CURSEUR ---------
const nav = document.querySelector('.navigation');
const cmdlinks = document.querySelectorAll('.cmd-link p');
const resume = document.getElementById('resume');
const socialLinks = document.querySelectorAll('#icon .icon-link');
const diteBonjour = document.getElementById('ditebonjour');

if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
}


cmdlinks.forEach(el => {
  el.addEventListener('mouseenter', hideCursor);
  el.addEventListener('mouseleave', delayedShowCursor);
});




const leaveEffectTimersLinks = new WeakMap();

function appearLinks() {
  const links = document.querySelectorAll('.icon-link');

  links.forEach((el, index) => {
    const text = el.textContent;
    el.textContent = '';

    // Création des spans
    const letters = text.split('');
    letters.forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      el.appendChild(span);
    });

    let timeouts = [];
    el.isAppeared = true;

    function playCmdEffect(delayStart = 0, colorNormal = '#000000', colorAfter = '#808080') {
      timeouts.forEach(t => clearTimeout(t));
      timeouts = [];

      const spans = el.querySelectorAll('span');
      spans.forEach((span, i) => {
        const timeout1 = setTimeout(() => {
          span.style.color = colorNormal;
          span.style.backgroundColor = 'white';
        }, delayStart + i * 30);
        timeouts.push(timeout1);

        const timeout2 = setTimeout(() => {
          span.style.color = colorAfter;
          span.style.backgroundColor = 'transparent';
        }, delayStart + i * 30 + 10);
        timeouts.push(timeout2);
      });
    }

    // Apparition initiale pour tous les liens
    playCmdEffect(300);
    el.style.pointerEvents = 'auto';

    // Hover
    el.addEventListener('mouseenter', () => {
      playCmdEffect(0, '#000000', '#b8b8b8');
    });

    // Leave
    el.addEventListener('mouseleave', () => {
      timeouts.forEach(t => clearTimeout(t));
      timeouts = [];

      const spans = el.querySelectorAll('span');
      const lastIndex = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (lastIndex - i) * 30;

        const timeout1 = setTimeout(() => {
          span.style.color = '#000000';
          span.style.backgroundColor = '#808080';
        }, delay);
        timeouts.push(timeout1);

        const timeout2 = setTimeout(() => {
          span.style.color = '#808080';
          span.style.backgroundColor = 'transparent';
        }, delay + 20);
        timeouts.push(timeout2);
      });
    });

    // Dans ta fonction qui gère l'apparition des liens
    el.addEventListener('click', (e) => {
      e.preventDefault(); // Empêche ouverture immédiate
      const linkUrl = el.getAttribute('href');

      const spans = el.querySelectorAll('span');

      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.backgroundColor = 'white'; // Fond blanc visible
          span.style.color = '#000000'; // Noir pendant le balayage
        }, i * 40);

        setTimeout(() => {
          span.style.backgroundColor = 'transparent'; // Enlève le fond
          span.style.color = '#ffffffff'; // Reste noir après
        }, i * 40 + 20);
      });

      // Durée totale avant ouverture du lien
      const totalTime = spans.length * 40 + 200;
      setTimeout(() => {
        window.location.href = linkUrl;
      }, totalTime);
    });

  });
}

function leaveEffectLinks() {
  const links = document.querySelectorAll('.icon-link');
  if (!links.length) return;

  links.forEach(el => {
    if (!el.isAppeared) return;

    const timers = leaveEffectTimersLinks.get(el) || [];
    timers.forEach(t => clearTimeout(t));
    leaveEffectTimersLinks.set(el, []);

    const spans = el.querySelectorAll('span');
    if (!spans.length) return;

    spans.forEach(span => {
      span.style.color = '#808080';
      span.style.backgroundColor = 'transparent';
      span.style.opacity = '1';
    });

    const lastIndex = spans.length - 1;
    spans.forEach((span, i) => {
      const delay = (lastIndex - i) * 30;

      const t1 = setTimeout(() => {
        span.style.color = '#000000';
        span.style.backgroundColor = 'white';
        span.style.opacity = '1';
      }, delay);
      leaveEffectTimersLinks.get(el).push(t1);

      const t2 = setTimeout(() => {
        span.style.opacity = '0';
        span.style.color = '#000000';
        span.style.backgroundColor = 'transparent';
      }, delay + 20);
      leaveEffectTimersLinks.get(el).push(t2);
    });

    const totalTime = (lastIndex + 1) * 30 + 20;
    setTimeout(() => {
      el.style.pointerEvents = 'none';
    }, totalTime);

    el.isAppeared = false;
  });
}











/* ===========================
   NAVIGATION STYLE "CMD"
   =========================== */

function enhanceNavLinks() {
  const links = document.querySelectorAll('.nav');

  links.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';

    // Création des spans lettre par lettre
    const letters = text.split('');
    letters.forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.color = "#808080"; // gris par défaut
      el.appendChild(span);
    });

    let timeouts = [];

    /* ============ HOVER CMD ============ */
    el.addEventListener('mouseenter', () => {
      if (el.classList.contains("active-page")) return;

      const spans = el.querySelectorAll("span");
      timeouts.forEach(t => clearTimeout(t));
      timeouts = [];

      spans.forEach((span, i) => {
        const t1 = setTimeout(() => {
          span.style.color = "#000000";
          span.style.backgroundColor = "white";
        }, i * 30);
        timeouts.push(t1);

        const t2 = setTimeout(() => {
          span.style.color = "#808080";
          span.style.backgroundColor = "transparent";
        }, i * 30 + 20);
        timeouts.push(t2);

        const t3 = setTimeout(() => {
          span.style.color = "#b8b8b8";
          span.style.backgroundColor = "transparent";
        }, i * 30 + 30);
        timeouts.push(t3);
      });
    });

    /* ============ LEAVE CMD ============ */
    el.addEventListener('mouseleave', () => {
      if (el.classList.contains("active-page")) return;

      const spans = el.querySelectorAll("span");
      timeouts.forEach(t => clearTimeout(t));
      timeouts = [];

      const last = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (last - i) * 30;

        const t1 = setTimeout(() => {
          span.style.color = "#000000";
          span.style.backgroundColor = "white";
        }, delay);
        timeouts.push(t1);

        const t2 = setTimeout(() => {
          span.style.color = "#808080";
          span.style.backgroundColor = "transparent";
        }, delay + 20);
        timeouts.push(t2);
      });
    });

    /* ============ CLICK (sans animation sur le cliqué) ============ */
    el.addEventListener('click', async e => {
      e.preventDefault();

      /* 🚫 si on clique sur le menu déjà actif → rien */
      if (el.classList.contains("active-page")) return;

      const linkUrl = el.getAttribute('href');
      const oldActive = document.querySelector(".active-page");

      // Animation leave sur l'ancien actif
      if (oldActive && oldActive !== el) {
        animateOldActiveLeave(oldActive);
      }

      if (oldActive) oldActive.classList.remove("active-page");

      // === NOUVEAU : appeler toutes les fonctions leaveEffect ===
      await leaveAllEffects(); // <-- ici, ajouter tes leaveEffect

      // Cooldown avant redirection
      setTimeout(() => {
        if (linkUrl === "#home") window.location.href = "index.html";
        if (linkUrl === "#about") window.location.href = "Profile.html";
        if (linkUrl === "#track") window.location.href = "Achievements.html";
      }, 300);
    });
  });

  /* ============================================================
     FONCTION : Leave CMD de l'ancien menu actif
     ============================================================ */
  function animateOldActiveLeave(link) {
    const spans = link.querySelectorAll("span");
    const last = spans.length - 1;

    spans.forEach((span, i) => {
      const delay = (last - i) * 30;

      setTimeout(() => {
        span.style.backgroundColor = "white";
        span.style.color = "#000000";
      }, delay);

      setTimeout(() => {
        span.style.backgroundColor = "transparent";
        span.style.color = "#808080";
      }, delay + 20);
    });
  }

  /* ============================
     MENU ACTIF (animation CMD)
     ============================ */
  function activateMenu(href) {
    const link = document.querySelector(`.nav[href="${href}"]`);
    if (!link) return;

    link.classList.add("active-page");

    const spans = link.querySelectorAll("span");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.backgroundColor = "white";
        span.style.color = "#000000";
      }, i * 35);

      setTimeout(() => {
        span.style.backgroundColor = "transparent";
        span.style.color = "#ffffff";
      }, i * 35 + 20);
    });
  }

  const page = window.location.pathname;

  if (page.includes("index.html")) activateMenu("#home");
  if (page.includes("Profile.html")) activateMenu("#about");
  if (page.includes("Achievements.html")) activateMenu("#track");
}

/* =========================
   Animate old active link for wheel scroll
   ========================= */
function animateOldActiveLeaveWheel() {
  const oldActive = document.querySelector(".active-page");
  if (!oldActive) return;

  const spans = oldActive.querySelectorAll("span");
  const last = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (last - i) * 30;

    setTimeout(() => {
      span.style.backgroundColor = "white";
      span.style.color = "#000000";
    }, delay);

    setTimeout(() => {
      span.style.backgroundColor = "transparent";
      span.style.color = "#808080";
    }, delay + 20);
  });

  // Retirer la classe active après l'animation
  setTimeout(() => {
    oldActive.classList.remove("active-page");
  }, (last + 1) * 30 + 20);
}



window.addEventListener("DOMContentLoaded", () => {

  let scrollCooldown = false;
  let startY = 0; // position initiale du doigt sur mobile

  async function handleScrollUp() {
    if (scrollCooldown) return;
    scrollCooldown = true;

    // Lancer toutes les animations de leave
    await leaveAllEffects();

    // Redirection vers la page précédente
    window.location.href = "Profile.html";
  }

  // === Desktop : molette ===
  window.addEventListener('wheel', async (e) => {
    if (scrollCooldown) return;

    // Ignore scroll si on est dans un input ou textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    // Scroll vers le haut uniquement
    if (e.deltaY < 0) {
      handleScrollUp();
    }
  });

  // === Mobile : swipe ===
  window.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener('touchend', e => {
    if (scrollCooldown) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    // Swipe vers le bas (doigt glissé vers le bas) = scroll vers le haut
    if (diff < -50) { // seuil de 50px
      handleScrollUp();
    }
    // swipe vers le haut (doigt glissé vers le haut) = scroll vers le bas → ignoré
  });

});




/* ============================================================
   PROMISE POUR LES ANIMATIONS DE DISPARITION
   ============================================================ */

function leaveAllEffects() {
  return new Promise(resolve => {
    // Ici tu peux appeler toutes tes fonctions leaveEffect :
    hideAllBlokCMD(); // vitesse par défaut = 25
    leavePhotoPosters();
    leaveTitle();
    animateOldActiveLeaveWheel();
    leaveEffectYear();

    // délai = durée totale estimée des animations
    setTimeout(resolve, 1000);
  });
}

window.addEventListener("DOMContentLoaded", enhanceNavLinks);










const yearElement = document.querySelector('.year');
const yearWords = ["2026", "2024", "2024", "2024", "2023", "2022"];
let yearIndex = 0;

// Délais pour l'animation CMD des lettres (apparition, passage, disparition)
const yearDelays = {
  appearDelay: 200,  // temps entre chaque lettre lors de l'apparition
  passedDelay: 200,  // temps avant de passer la couleur finale
  leaveDelay: 200     // temps entre les lettres lors de la disparition
};

// --- Fonction pour passer à l'année suivante dans la boucle ---

function nextYear(index) {
  if (!yearElement) return;

  const oldSpans = Array.from(yearElement.querySelectorAll("span"));

  // --- 1. Animation de disparition avec curseur correct ---
  if (oldSpans.length) {
    const lastIndex = oldSpans.length - 1;

    oldSpans.forEach((span, i) => {
      const delay = (lastIndex - i) * yearDelays.leaveDelay;

      const t1 = setTimeout(() => {
        // reset curseurs
        oldSpans.forEach(s => {
          s.style.borderRight = '2px solid transparent';
          s.style.borderLeft = '2px solid transparent';
        });

        // curseur placé JUSTE APRÈS la lettre qui va disparaître
        span.style.borderRight = '2px solid white';

        span.style.color = '#ffffff';
        span.style.backgroundColor = 'transparent';
      }, delay);

      const t2 = setTimeout(() => {
        span.style.opacity = '0';

        // une fois la lettre supprimée, on enlève son curseur
        span.style.borderRight = '2px solid transparent';
      }, delay + yearDelays.leaveDelay * 0.8);

      if (!yearElement.timeouts) yearElement.timeouts = [];
      yearElement.timeouts.push(t1, t2);
    });
  }


  // --- 2. Attendre la fin de la disparition avant de recréer ---
  const waitTime = oldSpans.length * yearDelays.leaveDelay + 50;

  setTimeout(() => {

    // === TON CODE ORIGINAL ICI, INCHANGÉ ===

    if (yearElement.timeouts) {
      yearElement.timeouts.forEach(t => {
        if (t.interval) clearInterval(t);
        else clearTimeout(t);
      });
    }
    yearElement.timeouts = [];

    const word = yearWords[index];
    yearElement.innerHTML = '';

    for (const ch of word) {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.color = 'transparent';
      span.style.borderRight = '2px solid transparent';
      yearElement.appendChild(span);
    }

    const spans = Array.from(yearElement.querySelectorAll('span'));
    yearElement.isAppeared = true;

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        spans.forEach(s => s.style.borderRight = '2px solid transparent');
        span.style.color = '#000000';
        if (i === 0) span.style.borderLeft = '2px solid white';
        else spans[i - 1].style.borderRight = '2px solid white';
      }, i * yearDelays.appearDelay);
      yearElement.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#ffffff';
        if (i > 0) spans[i - 1].style.borderRight = '2px solid transparent';
        if (i === 0) span.style.borderLeft = '2px solid transparent';
      }, i * yearDelays.appearDelay + yearDelays.passedDelay);
      yearElement.timeouts.push(t2);
    });

    const tBlinkStart = setTimeout(() => {
      let blinkVisible = true;
      if (spans.length) {
        spans.forEach(s => s.style.borderRight = '2px solid transparent');
        const last = spans[spans.length - 1];
        last.style.borderRight = '2px solid white';

        const blinkInterval = setInterval(() => {
          last.style.borderRight = blinkVisible ? '2px solid transparent' : '2px solid white';
          blinkVisible = !blinkVisible;
        }, 500);

        yearElement.timeouts.push({ interval: blinkInterval });
      }
    }, spans.length * yearDelays.appearDelay + yearDelays.passedDelay);
    yearElement.timeouts.push(tBlinkStart);


  }, waitTime);
}


function leaveEffectYear(speed = 15) {
  return new Promise(resolve => {
    const el = document.querySelector('.year');
    if (!el || !el.isAppeared) return resolve();

    if (el.timeouts) el.timeouts.forEach(t => clearTimeout(t));
    el.timeouts = [];

    const spans = Array.from(el.querySelectorAll('span'));
    const lastIndex = spans.length - 1;

    spans.forEach(span => {
      span.style.color = 'white';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    });

    spans.forEach((span, i) => {
      const delay = (lastIndex - i) * speed;

      const t1 = setTimeout(() => {
        spans.forEach(s => {
          s.style.backgroundColor = 'none';
          s.style.borderBottomColor = 'transparent';
        });

        span.style.color = 'transparent';
        span.style.borderBottom = '20px solid white';
      }, delay);

      el.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.backgroundColor = '#000000ff';
        span.style.border = 'none';

        if (i === lastIndex) {
          el.isAppeared = false;
          resolve();
        }
      }, delay + speed);

      el.timeouts.push(t2);
    });
  });
}












const descriptions = [
  document.querySelector('.description1'),
  document.querySelector('.description2'),
  document.querySelector('.description3'),
  document.querySelector('.description4'),
  document.querySelector('.description5'),
  document.querySelector('.description6')
];

const blokys = document.querySelectorAll('.conteneur .bloky');


/* transforme un blok en spans si nécessaire */
function prepareCMDEffect(blok) {
  if (!blok.querySelector('span')) {
    const text = blok.textContent;
    blok.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      // style de base (on laisse la transition CSS gérer l'apparition)
      span.style.color = 'transparent';
      span.style.backgroundColor = 'transparent';
      span.style.opacity = '0';
      blok.appendChild(span);
    });
  }
}

/* showBlokCMD : apparition lettre par lettre (barre CMD -> couleur finale)
   conserve ton nom de fonction */
function showBlokCMD(blok, speed = 30, finalColor = '#808080', activeColor = '#808080') {
  prepareCMDEffect(blok);
  const spans = Array.from(blok.querySelectorAll('span'));

  spans.forEach(span => {
    span.style.transition = '';
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.opacity = '0';
  });

  spans.forEach((span, i) => {
    // 1) barre CMD : texte sombre sur fond actif
    setTimeout(() => {
      span.style.color = '#808080';
      span.style.backgroundColor = activeColor; // couleur spécifique titre actif
      span.style.opacity = '1';
    }, i * speed);

    // 2) couleur finale : texte gris, fond transparent
    setTimeout(() => {
      span.style.color = finalColor;
      span.style.backgroundColor = 'transparent';
      span.style.opacity = '1';
    }, i * speed + Math.max(Math.floor(speed * 0.8), 20));
  });

  blok.isAppeared = true;
}

function removeActiveColor(blok, speed = 20, activeColor = '#ff0000ff') {
  if (!blok.querySelector('span')) return;
  const spans = Array.from(blok.querySelectorAll('span'));
  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * speed;
    setTimeout(() => {
      // animation CMD inverse pour “effacer” la couleur active
      span.style.color = '#ff0000ff';
      span.style.backgroundColor = activeColor;
      span.style.opacity = '1';
    }, delay);

    setTimeout(() => {
      span.style.opacity = '1';
      span.style.color = '#808080';
      span.style.backgroundColor = 'transparent';
    }, delay + Math.max(Math.floor(speed * 0.6), 15));
  });

  blok.isAppeared = false; // le titre n’est plus actif
}


// Faire apparaître tous les blocs en même temps
function showAllBlokCMD(speed = 25) {
  blokys.forEach(blok => showBlokCMD(blok, speed));
}



/* hideActiveDescriptionCMD : annule toutes les animations et fait disparaître la description actuelle en inversé */
function hideActiveDescriptionCMD(speed = 5) {
  return new Promise(resolve => { // on retourne une promesse pour attendre la fin
    const activeDesc = descriptions.find(d => d.classList.contains('visible'));
    if (!activeDesc) return resolve(); // rien à faire

    // annuler toutes les animations en cours
    descriptionTimers.forEach(t => clearTimeout(t));
    descriptionTimers = [];

    const spans = Array.from(activeDesc.querySelectorAll('span'));

    // --- Calcul des lignes comme dans montrerDescription ---
    const lignes = [];
    let currentTop = null;
    let currentLine = [];

    spans.forEach(span => {
      const top = span.getBoundingClientRect().top;
      if (currentTop === null) currentTop = top;

      if (Math.abs(top - currentTop) < 1) {
        currentLine.push(span);
      } else {
        lignes.push(currentLine);
        currentLine = [span];
        currentTop = top;
      }
    });
    if (currentLine.length) lignes.push(currentLine);

    // --- Disparition ligne par ligne en parallèle, lettres inversées ---
    lignes.forEach(ligne => {
      const lastIndex = ligne.length - 1;
      ligne.forEach((span, i) => {
        const delay = (lastIndex - i) * speed; // inverse l’ordre des lettres
        const t1 = setTimeout(() => {
          span.style.color = '#000000';
          span.style.backgroundColor = '#ffffff';
          span.style.opacity = '1';
        }, delay);
        const t2 = setTimeout(() => {
          span.style.opacity = '0';
          span.style.color = 'transparent';
          span.style.backgroundColor = 'transparent';
        }, delay + Math.max(Math.floor(speed * 0.6), 15));
        descriptionTimers.push(t1, t2);
      });
    });

    // --- cacher la description après disparition ---
    const maxLength = Math.max(...lignes.map(l => l.length));
    const totalDelay = maxLength * speed + 30;
    const t3 = setTimeout(() => {
      activeDesc.classList.remove('visible');
      activeDesc.classList.add('hidden');
      activeDesc.style.top = `${100 + offsetY}px`;
      resolve(); // on indique que c'est terminé
    }, totalDelay);

    descriptionTimers.push(t3);
  });
}

/* hideAllBlokCMD : disparition inverse (de la fin vers le début), attend d'abord hideActiveDescriptionCMD */
/* hideAllBlokCMD : disparition inverse CMD pour tous les blocs, background exact selon actif ou non */
async function hideAllBlokCMD(speed = 10) {
  if (!blokys || blokys.length === 0) return;

  // 1) d'abord faire disparaître la description active
  await hideActiveDescriptionCMD();

  // 2) Annulation de toute descente et remontée instantanée
  blokys.forEach(b => {
    b.style.transition = "transform 0.15s ease-out";
    b.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    // 3) Appliquer l’effet CMD inverse
    blokys.forEach(blok => {
      const spans = blok.querySelectorAll('span');
      if (!spans || spans.length === 0) return;

      const lastIndex = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (lastIndex - i) * speed;

        // Déterminer le background selon la couleur actuelle du span
        const currentColor = window.getComputedStyle(span).color;
        let bgColor = '#808080'; // gris par défaut

        // Si la couleur est rouge (titre actif) → background rouge
        if (currentColor === 'rgb(255, 0, 0)') {
          bgColor = 'rgb(255, 0, 0)';
        }

        setTimeout(() => {
          // Phase “barre CMD” inversée : texte sur fond correspondant
          span.style.color = currentColor;   // conserve la couleur actuelle du texte
          span.style.backgroundColor = bgColor;
          span.style.opacity = '1';
        }, delay);

        setTimeout(() => {
          // Phase disparition finale
          span.style.opacity = '0';
          span.style.color = 'transparent';
          span.style.backgroundColor = 'transparent';
        }, delay + Math.max(Math.floor(speed * 0.6), 15));
      });

      // Reset pour le prochain run
      blok.isAppeared = false;
    });
  }, 180);
}


// === Remet tout à zéro avec attente ===
function phaseRepos(delay = 1000) {
  return new Promise(resolve => {
    blokys.forEach(b => {
      b.style.transform = 'translateY(0px)';
      b.style.marginBottom = '5px';
    });

    descriptions.forEach(d => {
      if (d) {
        d.style.position = 'absolute';
        d.style.top = '100%';
        d.style.left = '0px';
      }
    });

    // Attente avant de continuer
    setTimeout(resolve, delay);
  });
}

let offsetY = 0; // position verticale cumulée des descriptions

// tableau global pour stocker les timers de descriptions
let descriptionTimers = [];

// --- montrerDescription corrigé pour stocker les timers et gérer offsetY ---

function montrerDescription(index, pause = 15000, waitBeforeAppear = 500) { // 👈 pause avant apparition
  const desc = descriptions[index];
  if (!desc) return Promise.resolve();

  // Découper en spans si nécessaire
  if (!desc.querySelector('span')) {
    const text = desc.textContent;
    desc.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.opacity = '0';
      desc.appendChild(span);
    });
  }

  const spans = [...desc.querySelectorAll('span')];
  const blok = blokys[index];
  const rect = blok.getBoundingClientRect();
  const spacing = 10;

  desc.style.position = 'absolute';
  desc.style.left = `${rect.left}px`;
  desc.style.top = `${rect.bottom + spacing}px`;
  desc.style.width = "65%";

  desc.classList.add('visible');
  desc.classList.remove('hidden');

  // Active la descente dépendante
  suivreDescenteTitres(index, spacing);

  // --- Découpage des spans par lignes ---
  const lignes = [];
  let currentTop = null;
  let currentLine = [];

  spans.forEach(span => {
    const top = span.getBoundingClientRect().top;
    if (currentTop === null) currentTop = top;

    if (Math.abs(top - currentTop) < 1) {
      currentLine.push(span);
    } else {
      lignes.push(currentLine);
      currentLine = [span];
      currentTop = top;
    }
  });
  if (currentLine.length) lignes.push(currentLine);

  // --- Animation CMD avec délai entre les lignes ---
  return new Promise(resolve => {
    const lineDelay = 100;
    const charDelay = 15;

    lignes.forEach((ligne, lineIndex) => {
      ligne.forEach((span, charIndex) => {
        
        const appearDelay = waitBeforeAppear + lineIndex * lineDelay + charIndex * charDelay;

        // 1) Phase apparition
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.color = '#000';
          span.style.backgroundColor = '#ffffff'; // style pendant apparition
        }, appearDelay);

        // 2) Phase après apparition
        setTimeout(() => {
          span.style.color = '#fff';
          span.style.backgroundColor = 'transparent'; // style une fois apparu
        }, appearDelay + 10);

      });
    });

    // temps total d'apparition + pause
    const totalTime =
      waitBeforeAppear + // 👈 prend en compte le délai avant apparition
      lignes.length * lineDelay +
      Math.max(...lignes.map(l => l.length)) * charDelay +
      300;

    setTimeout(resolve, totalTime + pause);
  });
}


// Disparition description CMD inverse (ligne par ligne)
function cacherDescription(index, speed = 20) {
  const desc = descriptions[index];
  if (!desc) return Promise.resolve();

  const spans = Array.from(desc.querySelectorAll('span'));

  return new Promise(resolve => {
    // --- calcul des lignes ---
    const lignes = [];
    let currentTop = null;
    let currentLine = [];

    spans.forEach(span => {
      const top = span.getBoundingClientRect().top;
      if (currentTop === null) currentTop = top;

      if (Math.abs(top - currentTop) < 1) {
        currentLine.push(span);
      } else {
        lignes.push(currentLine);
        currentLine = [span];
        currentTop = top;
      }
    });
    if (currentLine.length) lignes.push(currentLine);

    // --- disparition CMD sur toutes les lignes en parallèle ---
    const totalTimers = [];

    lignes.forEach(ligne => {
      const lastIndex = ligne.length - 1;
      ligne.forEach((span, i) => {
        const delay = (lastIndex - i) * speed;

        const t1 = setTimeout(() => {
          span.style.color = 'black';
          span.style.backgroundColor = 'white';
        }, delay);

        const t2 = setTimeout(() => {
          span.style.opacity = '0';
          span.style.color = 'transparent';
          span.style.backgroundColor = 'transparent';
        }, delay + Math.max(Math.floor(speed * 0.6), 15));

        totalTimers.push(t1, t2);
      });
    });

    // --- résolution après le dernier span ---
    const maxDelay = lignes.reduce((max, ligne) => Math.max(max, ligne.length * speed), 0) + 30;
    setTimeout(() => {
      desc.classList.remove('visible');
      desc.classList.add('hidden');
      resolve();
    }, maxDelay);
  });
}


function suivreDescenteTitres(activeIndex, spacing = 10) {
  const desc = descriptions[activeIndex];
  const titres = Array.from(blokys).slice(activeIndex + 1);

  if (!desc || titres.length === 0) return;

  const step = 9;      // pixels par saut
  const interval = 90; // ms entre chaque saut

  // Stocke la position actuelle de chaque titre
  const positions = titres.map(b => parseInt(b.style.transform.replace('translateY(', '')) || 0);

  const timer = setInterval(() => {
    const descRect = desc.getBoundingClientRect();

    let anyMoved = false;

    titres.forEach((b, i) => {
      const blokRect = b.getBoundingClientRect();

      // hauteur cumulée des titres précédents
      let offset = 0;
      for (let j = 0; j < i; j++) {
        const prevRect = titres[j].getBoundingClientRect();
        offset += prevRect.height + 4; // 4px = espace entre titres
      }

      const targetTop = descRect.bottom + spacing + offset;
      const needed = targetTop - blokRect.top;

      if (needed > 0) {
        anyMoved = true;
        positions[i] += Math.min(step, needed);
        b.style.transform = `translateY(${positions[i]}px)`;
      }
    });


    if (!anyMoved) clearInterval(timer); // stop quand tous sont arrivés
  }, interval);
}

// === Remontée ===
function remonterTitres(activeIndex) {
  return new Promise(resolve => {
    const step = 17;       // nombre de pixels par “saccade” vers le haut
    const delay = 150;     // temps entre chaque saccade en ms


    const titres = Array.from(blokys).slice(activeIndex + 1);
    let completed = 0;

    titres.forEach(b => {
      let pos = parseInt(b.style.transform.replace('translateY(', '')) || 0;

      const timer = setInterval(() => {
        pos -= step;
        if (pos <= 0) {
          pos = 0;
          clearInterval(timer);
          completed++;
          if (completed === titres.length) resolve();
        }
        b.style.transform = `translateY(${pos}px)`;
      }, delay);
    });

    if (titres.length === 0) resolve();
  });
}


function descendreTitres(activeIndex) {
  return new Promise(resolve => {
    const step = 25;       
    const delay = 400;     
    let completed = 0;

    const titres = Array.from(blokys).slice(activeIndex + 1);

    titres.forEach((b, idx) => {
      let pos = 0;

      // Calcul dynamique : vérifier si la description précédente existe
      const desc = descriptions[activeIndex];
      let offset = 90; // valeur par défaut
      if (desc && desc.classList.contains('visible')) {
        const descRect = desc.getBoundingClientRect();
        const blokRect = b.getBoundingClientRect();
        offset = (descRect.bottom - blokRect.top) + 8; // 8px margin
      }

      const timer = setInterval(() => {
        pos += step;
        if (pos >= offset) {
          pos = offset;
          clearInterval(timer);
          completed++;
          if (completed === titres.length) resolve();
        }
        b.style.transform = `translateY(${pos}px)`;
      }, delay);
    });

    if (titres.length === 0) resolve();
  });
}


// === Fonction qui lie Titre ↔ Description avec phases de repos ===
async function lierTitreEtDescription(i, token) {
  const blok = blokys[i];
  const spans = Array.from(blok.querySelectorAll("span"));
  const speed = 30;

  nextYear(i);

  // 🛑 STOP si annulé
  if (token !== animationToken) return;

  await phaseRepos();

  if (token !== animationToken) return;

  spans.forEach(span => {
    span.style.transition = '';
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.opacity = '1';
  });

  spans.forEach((span, index) => {

    setTimeout(() => {
      if (token !== animationToken) return;
      span.style.color = '#ff0000ff';
      span.style.backgroundColor = '#ff0000ff';
      span.style.opacity = '1';
    }, index * speed);

    setTimeout(() => {
      if (token !== animationToken) return;
      span.style.color = '#ff0000ff';
      span.style.backgroundColor = 'transparent';
    }, index * speed + Math.max(Math.floor(speed * 0.8), 20));
  });

  const totalCMD = spans.length * speed + 80;

  await new Promise(resolve => setTimeout(resolve, totalCMD));

  if (token !== animationToken) return;

  await montrerDescription(i);

  if (token !== animationToken) return;

  await cacherDescription(i);

  if (token !== animationToken) return;

  // 🔥 LA PARTIE QUI POSAIT PROBLÈME
  removeActiveColor(blok, 20, "#ff0000ff");

  if (token !== animationToken) return;

  await remonterTitres(i);
}

function getActiveIndex() {
  return descriptions.findIndex(d => d.classList.contains('visible'));
}




// === Animation principale en boucle ===
let boucleCase3 = true;  // mettre à false pour arrêter la boucle

let currentIndex = 0;
let isManuallyTriggered = false;


let animationToken = 0;


async function startAnimationSequence() {
  const myToken = ++animationToken; // 👈 nouveau cycle

  while (boucleCase3 && myToken === animationToken) {

    for (let i = currentIndex; i < blokys.length; i++) {

      if (!boucleCase3 || myToken !== animationToken) return;

      currentIndex = i;
      await lierTitreEtDescription(i, myToken);

      // 🔴 check après chaque étape importante
      if (myToken !== animationToken) return;
    }

    currentIndex = 0;

    await new Promise(resolve => setTimeout(resolve, 3000));

    if (myToken !== animationToken) return;
  }
}


blokys.forEach((blok, i) => {
  blok.style.cursor = "pointer";

  blok.addEventListener("click", async () => {

    const activeIndex = getActiveIndex();

    // ✅ 1. IGNORER complètement si déjà actif
    if (i === activeIndex) return;

    // 🔥 2. kill instant tous les cycles
    boucleCase3 = false;
    animationToken++;

    // 3. disparition description active
    await hideActiveDescriptionCMD();

    // 4. reset couleur ancien actif
    if (activeIndex !== -1) {
      removeActiveColor(blokys[activeIndex], 20, "#ff0000ff");
    }

    // 5. remontée
    if (activeIndex !== -1) {
      await remonterTitres(activeIndex);
    }

    // 6. nouveau point de départ
    currentIndex = i;

    // 7. relancer proprement
    boucleCase3 = true;
    startAnimationSequence();
  });
});

// === Anti-blink sur titres ===
blokys.forEach(blok => {
  // sur le blok principal
  blok.addEventListener('mouseenter', hideCursor);
  blok.addEventListener('mouseleave', delayedShowCursor);

  // sur tous les spans enfants pour être sûr que le hover fonctionne
  blok.querySelectorAll('span').forEach(span => {
    span.addEventListener('mouseenter', hideCursor);
    span.addEventListener('mouseleave', delayedShowCursor);
  });
});


// === Effets Hover / Leave sur titres (.bloky)
blokys.forEach((blok, index) => {

  // --- hover (mouseenter) ---
  blok.addEventListener('mouseenter', () => {

    // ❌ IGNORER si CE titre est actif (description visible)
    if (descriptions[index]?.classList.contains('visible')) return;

    prepareCMDEffect(blok);
    const spans = Array.from(blok.querySelectorAll('span'));
    let timeouts = [];

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#ff0000ff';
        span.style.backgroundColor = '#ff0000ff';
        span.style.opacity = '1';
      }, i * 15);

      const t2 = setTimeout(() => {
        span.style.color = '#000000';
        span.style.backgroundColor = '#ff0000ff';
      }, i * 15 + 10);

      const t3 = setTimeout(() => {
        span.style.color = '#000000';
      }, i * 15 + 20);

      timeouts.push(t1, t2, t3);
    });

    blok.hoverTimeouts = timeouts;
  });

  // --- leave (mouseleave) ---
  blok.addEventListener('mouseleave', () => {

    // ❌ IGNORER si CE titre est actif
    if (descriptions[index]?.classList.contains('visible')) return;

    const spans = Array.from(blok.querySelectorAll('span'));

    if (blok.hoverTimeouts) {
      blok.hoverTimeouts.forEach(t => clearTimeout(t));
      blok.hoverTimeouts = [];
    }

    const last = spans.length - 1;

    spans.forEach((span, i) => {
      const delay = (last - i) * 15;

      setTimeout(() => {
        span.style.color = '#ff0000ff';
        span.style.backgroundColor = '#ff0000ff';
      }, delay);

      setTimeout(() => {
        span.style.color = '#808080';
        span.style.backgroundColor = 'transparent';
      }, delay + 10);
    });
  });

});



function appearPhotoPosters() {
  const links = document.querySelectorAll('.cmd-link p');

  links.forEach(link => {

    // Reset anciens timeouts
    if (link.timeouts) link.timeouts.forEach(t => clearTimeout(t));
    link.timeouts = [];

    // Transformer texte en spans si pas déjà fait
    if (!link.querySelector('span')) {
      const text = link.textContent;
      link.textContent = '';
      for (const ch of text) {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.display = 'inline-block';
        link.appendChild(span);
      }
    }

    const spans = [...link.querySelectorAll('span')];

    const letterDelay = 60;
    const passedDelay = 80;

    link.isAppeared = true;

    // Apparition lettre par lettre
    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#000';
        span.style.background = 'white';
      }, i * letterDelay);

      const t2 = setTimeout(() => {
        span.style.color = '#fff';
        span.style.background = 'transparent';
      }, i * letterDelay + passedDelay);

      link.timeouts.push(t1, t2);
    });


    // --- Hover effect CMD propre ---
    let hoverTimeouts = [];

    link.addEventListener('mouseenter', () => {
      hoverTimeouts.forEach(t => clearTimeout(t));
      hoverTimeouts = [];

      spans.forEach((span, i) => {
        const t1 = setTimeout(() => {
          span.style.color = "#ffffff";
          span.style.backgroundColor = "#e10000";
        }, i * 30);

        const t2 = setTimeout(() => {
          span.style.color = "#ffffff";
          span.style.backgroundColor = "#e10000";
        }, i * 30 + 40);

        hoverTimeouts.push(t1, t2);
      });
    });

    link.addEventListener('mouseleave', () => {
      hoverTimeouts.forEach(t => clearTimeout(t));
      hoverTimeouts = [];

      const last = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (last - i) * 30;

        const t1 = setTimeout(() => {
          span.style.color = "#ffffff";
          span.style.backgroundColor = "#e10000";
        }, delay);

        const t2 = setTimeout(() => {
          span.style.color = "#ffffff";
          span.style.backgroundColor = "transparent";
        }, delay + 30);

        hoverTimeouts.push(t1, t2);
      });
    });




  });

  // Lancer le flip aléatoire
  setTimeout(startRandomFlip, 1500);
}

function startRandomFlip() {
  const links = document.querySelectorAll('.cmd-link p');
  if (!links.length) return;

  const randomLink = links[Math.floor(Math.random() * links.length)];
  let spans = [...randomLink.querySelectorAll('span')];

  // Filtrer les lettres "o" et "_"
  spans = spans.filter(span => span.textContent !== 'o' && span.textContent !== '_');
  if (!spans.length) return;

  const letter = spans[Math.floor(Math.random() * spans.length)];

  letter.style.transition = 'transform 80ms linear';
  letter.style.transform = 'scaleX(-1)';

  setTimeout(() => {
    letter.style.transform = 'scaleX(1)';
  }, 600);

  setTimeout(startRandomFlip, 3000);
}

function leavePhotoPosters() {
  const links = document.querySelectorAll('.cmd-link p');

  links.forEach(link => {
    if (!link.isAppeared) return;

    if (link.timeouts) link.timeouts.forEach(t => clearTimeout(t));
    link.timeouts = [];

    const spans = [...link.querySelectorAll('span')];
    const last = spans.length - 1;

    spans.forEach((span, i) => {
      const delay = (last - i) * 30;

      const t1 = setTimeout(() => {
        span.style.background = 'white';
        span.style.color = '#000';
      }, delay);

      const t2 = setTimeout(() => {
        span.style.background = 'transparent';
        span.style.color = 'transparent';
      }, delay + 30);

      link.timeouts.push(t1, t2);
    });

    link.isAppeared = false;
  });
}

document.addEventListener('DOMContentLoaded', appearPhotoPosters);










// === APPARITION (Title) ===
function appearTitle() {
  const container = document.querySelector('.title');
  if (!container) return;

  container.timeouts = [];
  const paragraphs = container.querySelectorAll('p');

  let maxDelay = 0;

  paragraphs.forEach(p => {
    // Transforme chaque lettre en span si ce n’est pas déjà fait
    if (!p.querySelector('span')) {
      const text = p.textContent;
      p.textContent = '';
      text.split('').forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
        p.appendChild(span);
      });
    }

    const spans = Array.from(p.querySelectorAll('span'));

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#ffffff';
        span.style.backgroundColor = '#ffffff';
      }, i * 20);
      container.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#ffffff';
        span.style.backgroundColor = '#000000ff';
      }, i * 20 + 10);
      container.timeouts.push(t2);

      if (i * 20 + 10 > maxDelay) maxDelay = i * 20 + 10;
    });
  });

  container.isAppeared = true;
}

// === DISPARITION (Title) ===
function leaveTitle() {
  const container = document.querySelector('.title');
  if (!container || !container.isAppeared) return;

  const paragraphs = container.querySelectorAll('p');

  paragraphs.forEach(p => {
    const spans = Array.from(p.querySelectorAll('span'));

    spans.forEach((span, i) => {
      const delay = (spans.length - 1 - i) * 20;
      setTimeout(() => {
        span.style.color = '#ffffff';
        span.style.backgroundColor = '#ffffff';
      }, delay);

      setTimeout(() => {
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
      }, delay + 20);
    });
  });

  container.isAppeared = false;
}








showAllBlokCMD();
startAnimationSequence();
appearLinks();
appearPhotoPosters();
appearTitle();


