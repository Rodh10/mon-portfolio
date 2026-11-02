
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

  // Empêche le clignotement pendant le hover
  if (isBlinking) {
    clearInterval(blinkInterval);
    isBlinking = false;
    cursor.style.opacity = '1';
  }
}

function delayedShowCursor() {
  clearTimeout(showCursorTimeout);

  showCursorTimeout = setTimeout(() => {
    cursor.style.display = 'block';
  }, 500);
}

// --------- ÉLÉMENTS QUI DÉSACTIVENT LE CURSEUR ---------
const nav = document.querySelector('.navigation');
const resume = document.getElementById('resume');

if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
}

if (resume) {
  resume.addEventListener('mouseenter', hideCursor);
  resume.addEventListener('mouseleave', delayedShowCursor);
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
          span.style.backgroundColor = "#FF0000";
        }, i * 30);
        timeouts.push(t1);

        const t2 = setTimeout(() => {
          span.style.color = "#808080";
          span.style.backgroundColor = "#FF0000";
        }, i * 30 + 20);
        timeouts.push(t2);

        const t3 = setTimeout(() => {
          span.style.color = "#000000";
          span.style.backgroundColor = "#FF0000";
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
          span.style.backgroundColor = "#FF0000";
        }, delay);
        timeouts.push(t1);

        const t2 = setTimeout(() => {
          span.style.color = "#808080";
          span.style.backgroundColor = "transparent";
        }, delay + 20);
        timeouts.push(t2);
      });
    });

    /* ============ CLICK (avec leaveEffect) ============ */
    el.addEventListener('click', async e => {
      e.preventDefault();
      if (el.classList.contains("active-page")) return;

      const linkUrl = el.getAttribute('href');
      const oldActive = document.querySelector(".active-page");

      // Animation leave sur l'ancien menu actif
      if (oldActive && oldActive !== el) animateOldActiveLeave(oldActive);
      if (oldActive) oldActive.classList.remove("active-page");

      // Toutes les animations de disparition
      await leaveAllEffects();

      // Redirection après animations
      if (linkUrl === "#home") window.location.href = "index.html";
      if (linkUrl === "#about") window.location.href = "Profile.html";
      if (linkUrl === "#track") window.location.href = "Achievements.html";
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

  /* ============================================================
     ACTIVER LE MENU ACTIF (page courante)
     ============================================================ */
  function activateMenu(href) {
    const link = document.querySelector(`.nav[href="${href}"]`);
    if (!link) return;

    link.classList.add("active-page");

    const spans = link.querySelectorAll("span");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.backgroundColor = "#FF0000";
        span.style.color = "#000000";
      }, i * 35);

      setTimeout(() => {
        span.style.backgroundColor = "transparent";
        span.style.color = "#FF0000";
      }, i * 35 + 20);
    });
  }

  const page = window.location.pathname;
  if (page.includes("index.html")) activateMenu("#home");
  if (page.includes("Profile.html")) activateMenu("#about");
  if (page.includes("Achievements.html")) activateMenu("#track");
}

/* ============================================================
   PROMISE POUR LES ANIMATIONS DE DISPARITION
   ============================================================ */


async function leaveAllEffects() {

    leaveEffectPara();
    hideAllBlokCMD(); // vitesse par défaut = 25
    leaveEffectTitled();
    animateOldActiveLeaveWheel();
    leaveEffectYear();


    if (window.leaveParticlePortrait) {
        await window.leaveParticlePortrait();
    }

    disappearCMDArrow(
        document.querySelector('.see-more')
    );

    // Attendre que les autres animations de sortie terminent
    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });



}



window.addEventListener("DOMContentLoaded", enhanceNavLinks);





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
      span.style.backgroundColor = "#FF0000";
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

  async function handleScroll(direction) {
    if (scrollCooldown) return;
    scrollCooldown = true;

    // Lancer toutes les animations de leave
    await leaveAllEffects();

    // Redirection selon la direction
    if (direction === "down") {
      window.location.href = "Achievements.html"; // scroll vers le bas
    } else if (direction === "up") {
      window.location.href = "index.html"; // scroll vers le haut
    }
  }

  // === Desktop : molette ===
  window.addEventListener('wheel', e => {
    const direction = e.deltaY > 0 ? "down" : "up";
    handleScroll(direction);
  });

  // === Mobile : swipe ===
  window.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener('touchend', e => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (Math.abs(diff) > 50) { // seuil pour éviter les petits gestes accidentels
      const direction = diff > 0 ? "down" : "up"; // swipe vers le haut = down, vers le bas = up
      handleScroll(direction);
    }
  });

});











const yearElement = document.querySelector('.year');
const yearWords = ["2026", "2026", "2024", "2024", "2024", "2023", "2022"];
let yearIndex = 0;

// Délais pour l'animation CMD des lettres (apparition, passage, disparition)
const yearDelays = {
  appearDelay: 200,  // temps entre chaque lettre lors de l'apparition
  passedDelay: 200,  // temps avant de passer la couleur finale
  leaveDelay: 200     // temps entre les lettres lors de la disparition
};

// --- Fonction pour passer à l'année suivante dans la boucle ---

function nextYear(index) {
  if (!yearElement || cycleArrete) return;

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

    if (cycleArrete) return;

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
  document.querySelector('.description6'),
  document.querySelector('.description7')
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
  desc.style.width = "40%";

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
async function lierTitreEtDescription(i, token, skipAppearance = false) {

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

  if (!skipAppearance) {
    await montrerDescription(i);

    if (token !== animationToken) return;

    await cacherDescription(i);
  } else {
    // Garder la description sans rejouer son apparition
    await cacherDescription(i);
  }

  if (token !== animationToken) return;

  // 🔥 LA PARTIE QUI POSAIT PROBLÈME
  removeActiveColor(blok, 20, "#ff0000ff");

  if (token !== animationToken) return;

  await remonterTitres(i);
}

function getActiveIndex() {
  return descriptions.findIndex(d => d.classList.contains('visible'));
}



// === Arrêt définitif du cycle titres / descriptions ===
let cycleArrete = false;

async function arreterCycleTitres() {
  if (cycleArrete) return;
  cycleArrete = true;

  // titre actif : celui dont la description est visible, sinon celui en cours
  let activeIndex = getActiveIndex();
  if (activeIndex === -1) activeIndex = currentIndex;

  // 1) couper la boucle et toutes les étapes en attente
  boucleCase3 = false;
  animationToken++;


  // Arrêter les animations et le clignotement de l'année
  if (yearElement?.timeouts) {

    yearElement.timeouts.forEach(t => {

        if (t.interval) clearInterval(t.interval);
        else clearTimeout(t);

    });

    yearElement.timeouts = [];

  }



  // 2) animation de retour du paragraphe actif
  await hideActiveDescriptionCMD();

  // 3) le titre actif repasse en gris
  if (blokys[activeIndex]) {
    removeActiveColor(blokys[activeIndex], 20, "#ff0000ff");
  }

  // 4) remontée des titres, puis tout reste en place
  await remonterTitres(activeIndex);
}





// === Animation principale en boucle ===
let boucleCase3 = true;  // mettre à false pour arrêter la boucle

let currentIndex = 0;
let isManuallyTriggered = false;


let animationToken = 0;


async function startAnimationSequence(skipFirstAppearance = false) {

  const myToken = ++animationToken;
  let skipNext = skipFirstAppearance;

  while (boucleCase3 && myToken === animationToken) {

    for (let i = currentIndex; i < blokys.length; i++) {

      if (!boucleCase3 || myToken !== animationToken) return;

      currentIndex = i;

      await lierTitreEtDescription(i, myToken, skipNext);

      skipNext = false;

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
    if (cycleArrete) return;
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








/* ==========================
   APPARITION CMD — __>
   ========================== */

function appearCMDArrow(element) {

    if (!element) return;

    const text = '__>';

    element.innerHTML = '';
    element.style.opacity = '1';

    const spans = [];

    /* ==========================
       CRÉATION DES LETTRES
       ========================== */

    text.split('').forEach(char => {

        const span =
            document.createElement('span');

        span.textContent =
            char;

        span.style.color =
            'transparent';

        span.style.backgroundColor =
            'transparent';

        element.appendChild(span);

        spans.push(span);

    });


    /* ==========================
       APPARITION CMD
       ========================== */

    spans.forEach((span, i) => {

        const delay =
            i * 30;


        /* Passage blanc */

        setTimeout(() => {

            span.style.color =
                '#050505';

            span.style.backgroundColor =
                '#666666';

        }, delay);


        /* État final */

        setTimeout(() => {

            span.style.color =
                '#666666';

            span.style.backgroundColor =
                'transparent';

        }, delay + 10);

    });

}


/* ==========================
   DISPARITION CMD — __>
   ========================== */

function disappearCMDArrow(element) {

    if (!element) return;

    const spans =
        element.querySelectorAll('span');


    /* ==========================
       DISPARITION CMD
       ========================== */

    [...spans].reverse().forEach((span, i) => {

        const delay =
            i * 30;


        /* Passage gris */

        setTimeout(() => {

            span.style.color =
                '#050505';

            span.style.backgroundColor =
                '#666666';

        }, delay);


        /* État final */

        setTimeout(() => {

            span.style.color =
                'transparent';

            span.style.backgroundColor =
                'transparent';

        }, delay + 10);

    });

}





function insertProfileText() {

    const perso = document.querySelector('.perso');
    const focus = document.querySelector('.focus');
    const titleMoi = document.querySelector('.i');
    const titleExpertise = document.querySelector('.do');



    if (!perso || !focus || !titleMoi || !titleExpertise) return;
    titleMoi.textContent = 'Moi';
    titleExpertise.textContent = 'Mon expertise';

    const persoLines = [
        "Développeur,designer et photographe malgache,",
        "originaire du sud-est de Madagascar.",
        "Mon parcours se construit à la croisée",
        "de la création visuelle, du numérique",
        "et de l'art",
        
    ];



    const focusLines = [


        "J'exploite au maximum toute ma créativité",
        "en créant des interfaces web très modernes,",
        "en touchant à peu près tout ce qui concerne",
        "la conception visuelle, de la typographie",
        "au motion design et au web design,",
        "en offrant un service ultra-personnalisé",
        "et moderne.",

        "",
        "",

        "Aussi multidisciplinaire qu'un patient",
        "atteint du syndrome de Vinci.",

        "",
        "",

        "Pendant mon temps libre, je photographie",
        "mon environnement et mon entourage.",

        "",
        "",

        "En rassemblant l'ensemble de mes compétences,",
        "j'ai pour ferme objectif de mener une équipe",
        "créative qui pourrait mettre en œuvre",
        "mes idées créatives et assez folles."
    ];



    perso.innerHTML =
        persoLines.join("<br>");


    focus.innerHTML =
        focusLines.join("<br>");
}

/* ==========================
   DESCENTE / REMONTÉE SACCADÉE
   TITRES + YEAR
   ========================== */

let positionTitres = 0;

function deplacerTousLesTitres(position = 130) {

    return new Promise(resolve => {

        const step = 9;
        const delay = 90;

        const timer = setInterval(() => {

            positionTitres += step;

            if (positionTitres >= position) {
                positionTitres = position;
                clearInterval(timer);
                resolve();
            }

            // Déplacer tous les titres
            blokys.forEach(blok => {
                blok.style.transition = 'none';
                blok.style.transform = `translateY(${positionTitres}px)`;
            });

            // Déplacer également l'année
            if (yearElement) {
                yearElement.style.transition = 'none';
                yearElement.style.transform = `translateY(${positionTitres}px)`;
            }

        }, delay);

    });
}


function restaurerTousLesTitres() {

    return new Promise(resolve => {

        const step = 17;
        const delay = 150;

        const timer = setInterval(() => {

            positionTitres -= step;

            if (positionTitres <= 0) {
                positionTitres = 0;
                clearInterval(timer);
                resolve();
            }

            // Remonter tous les titres
            blokys.forEach(blok => {
                blok.style.transition = 'none';
                blok.style.transform = `translateY(${positionTitres}px)`;
            });

            // Remonter également l'année
            if (yearElement) {
                yearElement.style.transition = 'none';
                yearElement.style.transform = `translateY(${positionTitres}px)`;
            }

        }, delay);

    });
}





function initMobileParagraphs() {

    if (window.innerWidth > 600) return;

    const focus = document.querySelector('.focus');
    const titleExpertise = document.querySelector('.do');

    if (!focus || !titleExpertise) return;
    if (focus.querySelector('.see-more')) return;

    /* ==========================
       RÉCUPÉRATION DES PARAGRAPHES
       ========================== */

    const focusLines = Array.from(
        focus.querySelectorAll(':scope > .line-container')
    );

    function splitParagraphs(lines) {
        const paragraphs = [];
        let current = [];

        lines.forEach(line => {
            if (line.textContent.trim() === '') {
                if (current.length) {
                    paragraphs.push(current);
                    current = [];
                }
            } else {
                current.push(line);
            }
        });

        if (current.length) paragraphs.push(current);

        return paragraphs;
    }

    const focusParagraphs = splitParagraphs(focusLines);

    if (focusParagraphs.length < 2) return;

    const firstParagraph = focusParagraphs[0];
    const additionalParagraphs = focusParagraphs.slice(1);

    const lastFirstLine = firstParagraph[firstParagraph.length - 1];

    const lastLine = additionalParagraphs[
        additionalParagraphs.length - 1
    ][additionalParagraphs[additionalParagraphs.length - 1].length - 1];

    const lastIndex = focusLines.indexOf(lastFirstLine);
    const hiddenLines = focusLines.slice(lastIndex + 1);

    /* ==========================
       CRÉATION DES FLÈCHES
       ========================== */

    function createArrow(className) {

        const arrow = document.createElement('span');

        arrow.className = className;
        arrow.style.display = 'block';
        arrow.style.width = 'max-content';
        arrow.style.cursor = 'pointer';
        arrow.style.fontSize = '1rem';

        appearCMDArrow(arrow);

        return arrow;
    }

    const seeMore = createArrow('see-more');
    const seeLess = createArrow('see-less');

    // Première flèche sous le premier paragraphe
    lastFirstLine.after(seeMore);

    // Deuxième flèche sous les paragraphes supplémentaires
    lastLine.after(seeLess);

    seeLess.style.display = 'none';

    /* ==========================
       ÉTAT INITIAL
       ========================== */

    let isExpanded = false;
    let animationRunning = false;

    hiddenLines.forEach(line => {
        line.style.display = 'none';
    });

    seeLess.style.display = 'none';

    /* ==========================
       APPARITION DES PARAGRAPHES
       ========================== */

    function showExpertiseParagraphs() {

        return new Promise(resolve => {

            const lines = additionalParagraphs.flat();

            let totalDuration = 0;

            hiddenLines.forEach(line => {
                line.style.display = 'block';
            });

            lines.forEach((line, lineIndex) => {

                const spans = Array.from(
                    line.querySelectorAll(':scope > span')
                );

                spans.forEach((span, charIndex) => {

                    const delay =
                        lineIndex * 100 +
                        charIndex * 15;

                    span.style.opacity = '0';
                    span.style.color = 'transparent';
                    span.style.backgroundColor = 'transparent';

                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.color = '#000000';
                        span.style.backgroundColor = '#ffffff';
                    }, delay);

                    setTimeout(() => {
                        span.style.color = '#ffffff';
                        span.style.backgroundColor = 'transparent';
                    }, delay + 15);

                    totalDuration = Math.max(
                        totalDuration,
                        delay + 15
                    );

                });
            });

            setTimeout(resolve, totalDuration + 150);

        });
    }

    /* ==========================
       DISPARITION DES PARAGRAPHES
       ========================== */

    function hideExpertiseParagraphs() {

        return new Promise(resolve => {

            const lines = additionalParagraphs.flat();

            let totalDuration = 0;

            lines.forEach((line, lineIndex) => {

                const spans = Array.from(
                    line.querySelectorAll(':scope > span')
                );

                const last = spans.length - 1;

                spans.forEach((span, charIndex) => {

                    const delay =
                        lineIndex * 100 +
                        (last - charIndex) * 15;

                    setTimeout(() => {
                        span.style.color = '#000000';
                        span.style.backgroundColor = '#ffffff';
                        span.style.opacity = '1';
                    }, delay);

                    setTimeout(() => {
                        span.style.opacity = '0';
                        span.style.color = 'transparent';
                        span.style.backgroundColor = 'transparent';
                    }, delay + 15);

                    totalDuration = Math.max(
                        totalDuration,
                        delay + 15
                    );

                });
            });

            setTimeout(() => {

                hiddenLines.forEach(line => {
                    line.style.display = 'none';
                });

                resolve();

            }, totalDuration + 150);

        });
    }

    /* ==========================
       PREMIÈRE FLÈCHE : DÉVELOPPER
       ========================== */

    seeMore.addEventListener('click', async () => {

        if (animationRunning || isExpanded) return;

        animationRunning = true;

        // Faire disparaître la première flèche
        disappearCMDArrow(seeMore);
        // Arrêter le cycle des titres
        await arreterCycleTitres();
        await deplacerTousLesTitres(130);
        // Afficher les paragraphes supplémentaires
        await showExpertiseParagraphs();



        seeMore.style.display = 'none';

        // Afficher la deuxième flèche
        seeLess.style.display = 'block';
        appearCMDArrow(seeLess);

        isExpanded = true;
        animationRunning = false;

    });

    /* ==========================
       DEUXIÈME FLÈCHE : RÉDUIRE
       ========================== */

    seeLess.addEventListener('click', async () => {

        if (animationRunning || !isExpanded) return;

        animationRunning = true;

        // Faire disparaître la deuxième flèche
        disappearCMDArrow(seeLess);
        // Faire disparaître les paragraphes supplémentaires
        await hideExpertiseParagraphs();



        seeLess.style.display = 'none';

        // Réafficher la première flèche
        seeMore.style.display = 'block';
        appearCMDArrow(seeMore);

        isExpanded = false;
        await restaurerTousLesTitres();
        // Réinitialiser les titres et descriptions
        currentIndex = 0;
        cycleArrete = false;
        boucleCase3 = true;

        // Relancer le cycle sans rejouer la première apparition
        startAnimationSequence(true);

        animationRunning = false;

    });

}






// === Fonction utilitaire pour transformer chaque <p> en spans ===
function prepareParagraphs(container, selectors) {
  const paragraphs = container.querySelectorAll(selectors);

  paragraphs.forEach(p => {
    if (!p.querySelector('span')) {
      const text = p.textContent;
      p.textContent = ''; // vider
      const lineContainer = document.createElement('span');
      lineContainer.style.display = 'block';

      text.split('').forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
        span.style.display = 'inline-block';
        lineContainer.appendChild(span);
      });

      p.appendChild(lineContainer);
    }
  });

  return paragraphs;
}







// ===================== //
//   ANIMATION - PARA    //
// ===================== //

function appearPara() {
  const container = document.querySelector('.para');
  if (!container) return;

  container.timeouts = [];
  const paragraphs = container.querySelectorAll('p');

  paragraphs.forEach(p => {

    // Préparation du texte une seule fois
    if (!p.querySelector('.line-container')) {

      const nodes = Array.from(p.childNodes);
      p.textContent = '';

      let lineContainer = document.createElement('span');
      lineContainer.className = 'line-container';
      lineContainer.style.display = 'block';
      lineContainer.style.minHeight = '1em';

      nodes.forEach(node => {

        // Texte
        if (node.nodeType === Node.TEXT_NODE) {

            if (node.textContent.trim() === '') {
                return;
            }

            node.textContent.split('').forEach(ch => {

                const span = document.createElement('span');

                span.textContent =
                    ch === ' ' ? '\u00A0' : ch;

                span.style.color = 'transparent';
                span.style.backgroundColor = 'transparent';
                span.style.display = 'inline-block';

                lineContainer.appendChild(span);
            });

        }

        // <br>
        else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === 'BR'
        ) {

          // On termine la ligne actuelle
          p.appendChild(lineContainer);

          // Nouvelle ligne
          lineContainer = document.createElement('span');
          lineContainer.className = 'line-container';
          lineContainer.style.display = 'block';
          lineContainer.style.minHeight = '1em';
        }
      });

      // Ajouter la dernière ligne
      p.appendChild(lineContainer);
    }


    // =========================
    // ANIMATION
    // =========================

    const lineContainers = Array.from(
      p.querySelectorAll('.line-container')
    );

    lineContainers.forEach(line => {

      const spans = Array.from(line.querySelectorAll(':scope > span'));

      spans.forEach(span => {
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
      });

      // Chaque ligne commence son animation indépendamment
      spans.forEach((span, i) => {

        const t1 = setTimeout(() => {
          span.style.color = '#ffffff';
          span.style.backgroundColor = '#ffffff';
        }, i * 20);

        container.timeouts.push(t1);


        const t2 = setTimeout(() => {
          span.style.color = '#ffffffff';
          span.style.backgroundColor = '#000000ff';
        }, i * 20 + 10);

        container.timeouts.push(t2);
      });
    });
  });

  container.isAppeared = true;
}

const leaveEffectTimersPara = new WeakMap();

function leaveEffectPara() {
  const container = document.querySelector('.para');
  if (!container || !container.isAppeared) return Promise.resolve();

  return new Promise(resolve => {

    const paragraphs = container.querySelectorAll('p');

    let totalDuration = 0;

    paragraphs.forEach(p => {

      const lineContainers = Array.from(p.children);

      lineContainers.forEach(line => {

        const spans = Array.from(line.children);

        // Mettre toutes les lettres visibles au départ
        spans.forEach(span => {
          span.style.color = '#ffffff';
          span.style.backgroundColor = 'transparent';
        });

        const lastIndex = spans.length - 1;

        // Disparition de droite à gauche
        spans.forEach((span, i) => {

          const delay = (lastIndex - i) * 20;

          const t1 = setTimeout(() => {
            span.style.color = '#ffffff';
            span.style.backgroundColor = '#ffffff';
          }, delay);

          const t2 = setTimeout(() => {
            span.style.color = 'transparent';
            span.style.backgroundColor = 'transparent';
          }, delay + 20);

          totalDuration = Math.max(
            totalDuration,
            delay + 20
          );

        });

      });

    });


  });
}






// ===================== //
//   ANIMATION - TITLED  //
// ===================== //




const leaveEffectTimersProfileTitled = new WeakMap();

function leaveEffectTitled() {
  const el = document.querySelector('.titled');
  if (!el || !el.isAppeared) return;

  const oldTimers = leaveEffectTimersProfileTitled.get(el);
  if (oldTimers) {
    oldTimers.forEach(t => clearTimeout(t));
    leaveEffectTimersProfileTitled.delete(el);
  }

  if (!el.querySelector('span')) {
    const paragraphs = el.querySelectorAll('p');
    paragraphs.forEach(p => {
      const nodes = Array.from(p.childNodes);
      p.textContent = '';
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split('').forEach(ch => {
            const span = document.createElement('span');
            span.textContent = ch;
            p.appendChild(span);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          p.appendChild(document.createElement('br'));
        }
      });
    });
  }

  const paragraphs = el.querySelectorAll('p');
  const timers = [];

  paragraphs.forEach(p => {
    const spans = p.querySelectorAll('span');

    spans.forEach(span => {
      span.style.color = 'white';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
      span.style.opacity = '1';
    });

    const lastIndex = spans.length - 1;

    spans.forEach((span, i) => {
      const delay = (lastIndex - i) * 20; // sortie plus lente

      const t1 = setTimeout(() => {
        span.style.color = 'black';
        span.style.backgroundColor = 'white';
        span.style.border = 'none';
        span.style.opacity = '1';
      }, delay);
      timers.push(t1);

      const t2 = setTimeout(() => {
        span.style.opacity = '0';
        span.style.color = '#000000';
        span.style.backgroundColor = 'transparent';
        span.style.border = 'none';
      }, delay + 25);
      timers.push(t2);
    });
  });

  leaveEffectTimersProfileTitled.set(el, timers);

  el.isAppeared = false;
}









































/* =========================================================
   THREE.JS — PARTICLE PORTRAIT
   ========================================================= */

import * as THREE from
    'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';


/* =========================================================
   CONTENEUR
   ========================================================= */

const particleContainer =
    document.getElementById("particle-container");




/*
   Si le conteneur n'existe pas,
   on arrête Three.js.
*/


/* =========================================================
   CONFIGURATION
   ========================================================= */

const columns = 300;
const rows = 130;

const revealSpeed = 70;


/* =========================================================
   SCENE
   ========================================================= */

function createScene() {

    return new THREE.Scene();

}


/* =========================================================
   CAMERA
   ========================================================= */

function createCamera() {

    const camera =
        new THREE.OrthographicCamera(

            -1,
            1,
            1,
            -1,

            0.1,
            10

        );


    camera.position.z = 1;


    return camera;

}


/* =========================================================
   RENDERER
   ========================================================= */

function createRenderer(particleContainer) {

    const renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: true

        });


    renderer.setPixelRatio(

        Math.min(
            window.devicePixelRatio,
            2
        )

    );


    renderer.setSize(

        particleContainer.clientWidth,
        particleContainer.clientHeight

    );


    /*
       On donne une classe au canvas
       pour pouvoir le contrôler en CSS.
    */

    renderer.domElement.className =
        "particle-canvas";


    /*
       IMPORTANT :

       Le canvas est placé dans
       #particle-container
       et non dans le body.
    */

    particleContainer.appendChild(
        renderer.domElement
    );


    return renderer;

}


/* =========================================================
   IMAGE
   ========================================================= */

function loadImage(src) {

    const image =
        new Image();


    image.src =
        src;


    return image;

}


/* =========================================================
   CANVAS INVISIBLE
   ========================================================= */

function createImageCanvas() {

    const canvas =
        document.createElement("canvas");


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        columns;


    canvas.height =
        rows;


    return {
        canvas,
        ctx
    };

}

/* =========================================================
   REDIMENSIONNER L'IMAGE
   ========================================================= */

function drawImageToCanvas(
    image,
    ctx
) {

    const imageRatio =
        image.width /
        image.height;


    let imageWidth =
        rows *
        imageRatio;


    /* =====================================================
       RECADRAGE
       ===================================================== */

    const sourceY =
        image.height / 3;


    const sourceHeight =
        image.height / 5;


    const croppedRatio =
        image.width /
        sourceHeight;


    imageWidth =
        rows *
        croppedRatio *
        0.2;


    let imageX = 0;
    let imageY = 95;


    /* =====================================================
       POSITION
       ===================================================== */

    if (window.innerWidth <= 600) {

        imageX = 15;
        imageY = 0;

    } else if (
        window.innerWidth >= 768 &&
        window.innerWidth <= 1200 &&
        window.innerHeight >= 1000
    ) {

        imageX = 20;
        imageY = 80;

    }


    ctx.drawImage(

        image,

        0,
        sourceY,
        image.width,
        sourceHeight,

        imageX,
        imageY,
        imageWidth,
        rows * 0.2

    );

}

/* =========================================================
   LIRE LES PIXELS
   ========================================================= */

function getImageData(ctx) {

    return ctx.getImageData(

        0,
        0,

        columns,
        rows

    );

}


/* =========================================================
   CRÉER LES PARTICULES
   ========================================================= */

function createParticles(imageData) {

    const particles = [];


    for (
        let y = 0;
        y < rows;
        y++
    ) {


        for (
            let x = 0;
            x < columns;
            x++
        ) {


            const index =
                (
                    y *
                    columns +
                    x
                ) * 4;


            const red =
                imageData.data[index];


            const green =
                imageData.data[index + 1];


            const blue =
                imageData.data[index + 2];


            const alpha =
                imageData.data[index + 3];


            const brightness =
                (
                    red +
                    green +
                    blue
                ) / 3;


            if (
                alpha > 20
            ) {


                if (
                    brightness < 80
                ) {

                    continue;

                }


                const scale =
                    0.78;


                const px =
                    (
                        x /
                        (columns)
                    ) * 2 - 1.3 ;


                const py =
                    (
                        y /
                        (rows - 1)
                    ) * 2 -
                    0.88;


                particles.push(

                    px * scale,

                    -py * scale,

                    0

                );

            }

        }

    }


    return particles;

}


/* =========================================================
   CRÉER L'ORDRE
   ========================================================= */

function createParticleOrder(particles) {

    const particleCount =
        particles.length / 3;


    const order =
        Array.from(

            {
                length:
                    particleCount
            },

            (_, i) => i

        );


    const priorities =
        new Array(
            particleCount
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {


        const x =
            particles[i * 3];


        const horizontal =
            (
                x + 1.3
            ) / 2.6;


        const base =
            horizontal * 100;


        const delay =
            Math.random() * 10;


        priorities[i] =
            base + delay;

    }


    return {
        order,
        priorities,
        particleCount
    };

}


/* =========================================================
   TRIER L'ORDRE
   ========================================================= */

function sortParticleOrder(
    order,
    priorities
) {

    order.sort(

        (a, b) => {

            return (
                priorities[a] -
                priorities[b]
            );

        }

    );


    return order;

}


/* =========================================================
   CRÉER LE NOUVEL ORDRE
   ========================================================= */

function createOrderedParticles(
    particles,
    order
) {

    const randomParticles = [];


    for (
        let i = 0;
        i < order.length;
        i++
    ) {


        const index =
            order[i] * 3;


        randomParticles.push(

            particles[index],

            particles[index + 1],

            particles[index + 2]

        );

    }


    return randomParticles;

}


/* =========================================================
   GEOMETRY
   ========================================================= */

function createGeometry(
    randomParticles
) {

    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(

            randomParticles,

            3

        )

    );


    /*
       On commence avec zéro particule.
    */

    geometry.setDrawRange(

        0,
        0

    );


    return geometry;

}


/* =========================================================
   CURSEUR
   ========================================================= */

function createMouse() {

    return new THREE.Vector2(
        -10,
        -10
    );

}


/* =========================================================
   MISE À JOUR DU CURSEUR
   ========================================================= */

function updateMouse(
    event,
    particleContainer,
    mouse
) {

    const rect =
        particleContainer.getBoundingClientRect();


    /*
       Vérifier si le curseur est
       réellement dans le portrait.
    */

    const inside =

        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;


    if (!inside) {

        mouse.set(
            -10,
            -10
        );

        return;

    }


    /*
       Position du curseur
       dans le conteneur.
    */

    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    /*
       Conversion en coordonnées
       Three.js.
    */

    mouse.x =
        (
            x /
            rect.width
        ) * 2 - 1;


    mouse.y =
        1 -
        (
            y /
            rect.height
        ) * 2;

}


/* =========================================================
   ÉCOUTER LA SOURIS
   ========================================================= */

function setupMouse(
    particleContainer,
    mouse
) {

    window.addEventListener(

        "mousemove",

        (event) => {

            updateMouse(
                event,
                particleContainer,
                mouse
            );

        }

    );

}


function setupMobileAutoHover(
    particleContainer,
    mouse
) {

    if (window.innerWidth > 600) {
        return;
    }


    let targetX = 0;
    let targetY = 0;


    function chooseTarget() {

        targetX =
            Math.random() * 1.6 -
            0.8;


        targetY =
            Math.random() * 1.4 -
            0.7;

    }


    chooseTarget();


    setInterval(() => {

        if (window.innerWidth <= 600) {

            chooseTarget();

        }

    }, 1800);


    function animateMobileHover() {

        if (window.innerWidth <= 600) {

            mouse.x +=
                (
                    targetX -
                    mouse.x
                ) * 0.04;


            mouse.y +=
                (
                    targetY -
                    mouse.y
                ) * 0.04;

        }


        requestAnimationFrame(
            animateMobileHover
        );

    }


    animateMobileHover();

}



/* =========================================================
   MATERIAL
   ========================================================= */

function createMaterial(mouse) {

    const material =
        new THREE.ShaderMaterial({

            transparent: true,

            depthWrite: false,

            uniforms: {

                uMouse: {
                    value: mouse
                },

                uRadiusX: {
                    value: 0.9
                },

                uRadiusY: {
                    value: 1.2
                }

            },

            vertexShader: `

                uniform vec2 uMouse;

                uniform float uRadiusX;
                uniform float uRadiusY;

                varying float vInfluence;


                void main() {

                    /*
                       Distance entre le point
                       et le curseur.
                    */

                    vec2 difference =
                        position.xy - uMouse;

                    difference.x /= uRadiusX;
                    difference.y /= uRadiusY;

                    float distanceToMouse =
                        length(difference);


                    /*
                       Influence du curseur.

                       Proche = 1
                       Loin = 0
                    */

                    vInfluence =
                        1.0 -
                        smoothstep(
                            0.0,
                            uRadiusX,
                            distanceToMouse
                        );


                    /*
                       Les points proches
                       deviennent légèrement plus gros.
                    */

                    gl_PointSize =
                        3.0 +
                        vInfluence * 4.0;


                    gl_Position =
                        projectionMatrix *
                        modelViewMatrix *
                        vec4(
                            position,
                            1.0
                        );

                }

            `,

            fragmentShader: `

                varying float vInfluence;


                void main() {

                    /*
                       Couleur normale :
                       blanc.

                       Couleur au survol :
                       rouge #BA3A23.
                    */

                    vec3 white =
                        vec3(
                            1.0,
                            1.0,
                            1.0
                        );


                    vec3 red =
                        vec3(
                            0.729,
                            0.227,
                            0.137
                        );


                    /*
                       Mélange progressif
                       blanc → rouge.
                    */

                    vec3 color =
                        mix(
                            white,
                            red,
                            vInfluence
                        );


                    /*
                       Les points éloignés
                       deviennent légèrement
                       moins visibles.
                    */

                    float opacity =
                        0.50 +
                        vInfluence * 0.80;


                    gl_FragColor =
                        vec4(
                            color,
                            opacity
                        );

                }

            `

        });


    return material;

}


/* =========================================================
   POINT CLOUD
   ========================================================= */

function createPoints(
    geometry,
    material
) {

    const points =
        new THREE.Points(

            geometry,

            material

        );


    return points;

}


/* =========================================================
   AJOUTER LE POINT CLOUD À LA SCÈNE
   ========================================================= */

function addPointsToScene(
    scene,
    points
) {

    scene.add(points);

}


/* =========================================================
   ANIMATION
   ========================================================= */

function createAnimation(
    geometry,
    material,
    mouse,
    renderer,
    scene,
    camera,
    particleCount
) {

    let visibleParticles = 0;

    let isLeaving = false;


    function animate() {

        requestAnimationFrame(
            animate
        );


        /*
          Apparition normale :
          0 → toutes les particules
        */

        if (
            !isLeaving &&
            visibleParticles <
            particleCount
        ) {

            visibleParticles +=
                revealSpeed;


            geometry.setDrawRange(

                0,

                Math.min(

                    Math.floor(
                        visibleParticles
                    ),

                    particleCount

                )

            );

        }


        material.uniforms.uMouse.value =
            mouse;


        renderer.render(

            scene,

            camera

        );

    }


    animate();


    return {

        getVisibleParticles: () => {
            return visibleParticles;
        },

        setLeaving: (value) => {
            isLeaving = value;
        },

        setVisibleParticles: (value) => {
            visibleParticles = value;
        }

    };

}


/* =========================================================
   DISPARITION DES PARTICULES
   ========================================================= */

function createLeaveParticlePortrait(
    geometry,
    animation
) {

    return function leaveParticlePortrait() {

        return new Promise(resolve => {

            animation.setLeaving(true);


            function disappear() {

                let visibleParticles =
                    animation.getVisibleParticles();


                visibleParticles -=
                    revealSpeed;


                if (
                    visibleParticles <= 0
                ) {

                    visibleParticles = 0;


                    geometry.setDrawRange(
                        0,
                        0
                    );


                    animation.setVisibleParticles(
                        visibleParticles
                    );


                    resolve();


                    return;

                }


                animation.setVisibleParticles(
                    visibleParticles
                );


                geometry.setDrawRange(

                    0,

                    Math.floor(
                        visibleParticles
                    )

                );


                requestAnimationFrame(
                    disappear
                );

            }


            disappear();

        });

    };

}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeRenderer(
    renderer,
    particleContainer
) {

    const width =
        particleContainer.clientWidth;


    const height =
        particleContainer.clientHeight;


    renderer.setSize(

        width,

        height

    );

}


/* =========================================================
   ÉCOUTER LE RESIZE
   ========================================================= */

function setupResize(
    renderer,
    particleContainer
) {

    window.addEventListener(

        "resize",

        () => {

            resizeRenderer(
                renderer,
                particleContainer
            );

        }

    );

}


/* =========================================================
   TRAITEMENT COMPLET DE L'IMAGE
   ========================================================= */

function setupParticlePortrait(
    image,
    scene,
    renderer,
    camera,
    particleContainer
) {

    const {
        ctx
    } =
        createImageCanvas();


    /* =====================================================
       REDIMENSIONNER L'IMAGE
       ===================================================== */

    drawImageToCanvas(
        image,
        ctx
    );


    /* =====================================================
       LIRE LES PIXELS
       ===================================================== */

    const imageData =
        getImageData(ctx);


    /* =====================================================
       CRÉER LES PARTICULES
       ===================================================== */

    const particles =
        createParticles(
            imageData
        );


    /* =====================================================
       NOMBRE DE PARTICULES
       ===================================================== */

    const {
        order,
        priorities,
        particleCount
    } =
        createParticleOrder(
            particles
        );


    /* =====================================================
       TRIER
       ===================================================== */

    sortParticleOrder(
        order,
        priorities
    );


    /* =====================================================
       NOUVEL ORDRE
       ===================================================== */

    const randomParticles =
        createOrderedParticles(
            particles,
            order
        );


    /* =====================================================
       GEOMETRY
       ===================================================== */

    const geometry =
        createGeometry(
            randomParticles
        );


    /* =====================================================
       CURSEUR
       ===================================================== */

    const mouse =
        createMouse();


    setupMouse(
        particleContainer,
        mouse
    );

    setupMobileAutoHover(
        particleContainer,
        mouse
    );




    /* =====================================================
       MATERIAL
       ===================================================== */

    const material =
        createMaterial(
            mouse
        );


    /* =====================================================
       POINT CLOUD
       ===================================================== */

    const points =
        createPoints(
            geometry,
            material
        );


    addPointsToScene(
        scene,
        points
    );


    /* =====================================================
       ANIMATION
       ===================================================== */

    const animation =
        createAnimation(

            geometry,

            material,

            mouse,

            renderer,

            scene,

            camera,

            particleCount

        );


    /* =====================================================
       DISPARITION
       ===================================================== */

    const leaveParticlePortrait =
        createLeaveParticlePortrait(

            geometry,

            animation

        );


    window.leaveParticlePortrait =
        leaveParticlePortrait;

}







/* =========================================================
   POSITION RÉELLE DU PORTRAIT
   ========================================================= */

function updateParticlePortraitPosition(
    particleContainer
) {

    const rect =
        particleContainer.getBoundingClientRect();


    /*
       MOBILE
    */


    /*
       DESKTOP

       Le portrait occupe
       normalement le conteneur.
    */

    window.particlePortraitPosition = {

        top:
            rect.top,

        bottom:
            rect.bottom,

        left:
            rect.left,

        right:
            rect.right,

        width:
            rect.width,

        height:
            rect.height

    };

}








/* =========================================================
   INITIALISATION PRINCIPALE
   ========================================================= */

function initializeParticlePortrait(
    particleContainer
) {

    /* =====================================================
       SCENE
       ===================================================== */

    const scene =
        createScene();


    /* =====================================================
       CAMERA
       ===================================================== */

    const camera =
        createCamera();


    /* =====================================================
       RENDERER
       ===================================================== */

    const renderer =
        createRenderer(
            particleContainer
        );


    /* =====================================================
       IMAGE
       ===================================================== */

    const image =
        loadImage(
            "portrait.jpg"
        );


    image.onload = () => {

        setupParticlePortrait(

            image,

            scene,

            renderer,

            camera,

            particleContainer

        );

    };


    /* =====================================================
       IMAGE ERROR
       ===================================================== */

    image.onerror = () => {

        console.error(

            "ERREUR : portrait.jpg introuvable"

        );

    };


    /* =====================================================
       RESIZE
       ===================================================== */

    setupResize(

        renderer,

        particleContainer

    );

}


/* =========================================================
   DÉMARRAGE
   ========================================================= */

if (particleContainer) {

    initializeParticlePortrait(
        particleContainer
    );

}



















































showAllBlokCMD();
startAnimationSequence();


insertProfileText();


appearPara();
initMobileParagraphs();
appearLinks();