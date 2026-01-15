



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
const resume = document.getElementById('resume');
const socialLinks = document.querySelectorAll('#icon .icon-link');
const diteBonjour = document.getElementById('ditebonjour');

if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
}













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

  if (page.includes("HTML.html")) activateMenu("#home");
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

  window.addEventListener('wheel', async (e) => {
    if (scrollCooldown) return;
    scrollCooldown = true;

    // Ignore scroll si on est dans un input ou textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      scrollCooldown = false;
      return;
    }

    // Scroll vers le haut uniquement
    if (e.deltaY < 0) {
      // Lancer toutes les animations de leave
      await leaveAllEffects();

      // Redirection vers la page précédente
      window.location.href = "Profile.html";
    }

    // Cooldown pour éviter que le scroll rapide déclenche plusieurs fois
    setTimeout(() => { scrollCooldown = false; }, 500);
  });

});





/* ============================================================
   PROMISE POUR LES ANIMATIONS DE DISPARITION
   ============================================================ */
function leaveAllEffects() {
  return new Promise(resolve => {
    // Ici tu peux appeler toutes tes fonctions leaveEffect :
    hideAllBlokCMD(); // vitesse par défaut = 25
    leaveEffectYear();
    leavePhotoPosters();
    leaveTitle();
    animateOldActiveLeaveWheel();

    // délai = durée totale estimée des animations
    setTimeout(resolve, 1000);
  });
}

window.addEventListener("DOMContentLoaded", enhanceNavLinks);








// === Fonction principale qui met à jour l'affichage
function updateDisplayByStep() {
  switch (currentStep) {
    case 0:

      leaveEffectYear();
      hideAllBlokCMD(); // vitesse par défaut = 25
      leaveEffectTitled(); 
      leaveEffectPara();
      leaveProfileTitleFirstTwo();
      leaveProfileTitleLastTwo();
      titreo.classList.add("milefa");
      talenta.classList.add("miverina");

      appearClockWithRandom();
      appearLinks(); 
      initResumeAnimations();
      cycleHiWords();
      appearWelcome();
      appearMonLien();
      initSayHiAnimations();
      iconWrapper.classList.remove("hidden");
      iconWrapper.classList.add("visible");
      mpanoratra.classList.remove("midina");
      mpanoratra.classList.add("miakatra");
      titreo.classList.remove("mipoitra");
      talenta.classList.remove("mandeha");





      break;

    case 1:


      leaveEffectYear();
      leaveClock();
      leaveEffectResume();
      leaveEffectHi();
      leaveEffectWelcome();
      leaveEffectMonLien();
      leaveEffectSayHi();
      hideAllBlokCMD(); // vitesse par défaut = 25
      iconWrapper.classList.add("hidden");
      iconWrapper.classList.remove("visible");
      talenta.classList.add("miverina");
      talenta.classList.remove("mandeha");
      titreo.classList.remove("mipoitra");
      titreo.classList.add("milefa");



      appearTitled();
      appearProfileTitleFirstTwo();
      appearProfileTitleLastTwo();
      appearPara();
      mpanoratra.classList.add("midina");
      mpanoratra.classList.remove("miakatra");


    





      break;

    case 2:


      leaveClock();
      leaveEffectLinks();
      leaveEffectResume();
      leaveEffectHi();
      leaveEffectWelcome();
      leaveEffectMonLien();
      leaveEffectSayHi();
      leaveProfileTitleFirstTwo(); // pour lancer la disparition
      leaveProfileTitleLastTwo(); // pour lancer la disparition
      leaveEffectTitled(); 
      leaveEffectPara();
      titreo.classList.remove("mipoitra");
      titreo.classList.add("milefa");
      talenta.classList.add("miverina");
      talenta.classList.remove("mandeha");
      tongasoa.classList.add("very");
      tongasoa.classList.remove("hita");



      cycleYearWords();
      showAllBlokCMD();
      startAnimationSequence();




      break;


  }

  updateActiveNav(currentStep);

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

// === Descente des titres ===
function descendreTitres(activeIndex) {
  return new Promise(resolve => {
    const step = 25;       // nombre de pixels par “saccade”
    const delay = 400;      // temps entre chaque saccade en ms
    const offset = 90;    // distance totale à parcourir

    const titres = Array.from(blokys).slice(activeIndex + 1);
    let completed = 0;

    titres.forEach(b => {
      let pos = 0;
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

let offsetY = 0; // position verticale cumulée des descriptions

// tableau global pour stocker les timers de descriptions
let descriptionTimers = [];

// --- montrerDescription corrigé pour stocker les timers et gérer offsetY ---
function montrerDescription(index) {
  const desc = descriptions[index];
  if (!desc) return Promise.resolve();

  // Découpage en span si nécessaire
  if (!desc.querySelector('span')) {
    const text = desc.textContent;
    desc.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.textContent = ch;
      desc.appendChild(span);
    });
  }

  const spans = Array.from(desc.querySelectorAll('span'));

  // Style initial invisible CMD
  spans.forEach(span => {
    span.style.color = 'transparent';
    span.style.backgroundColor = 'transparent';
    span.style.opacity = '1';
  });

  desc.classList.remove('hidden');
  desc.classList.add('visible');

  // --- Ajustement vertical avec accumulation ---
  if (index === 0) {
    offsetY = 0;
  } else {
    offsetY += 20;
  }
  desc.style.top = `${102 + offsetY}px`;

  // --- Détection des lignes ---
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

  // --- Animation CMD par ligne (en parallèle) ---
  return new Promise(resolve => {
    lignes.forEach(ligne => {
      ligne.forEach((span, i) => {
        const t1 = setTimeout(() => {
          span.style.color = '#ffffff';
          span.style.backgroundColor = '#ffffff';
        }, i * 25);
        const t2 = setTimeout(() => {
          span.style.color = '#ffffffff';
          span.style.backgroundColor = 'transparent';
        }, i * 25 + 15);

        descriptionTimers.push(t1, t2);
      });
    });

    // --- Pause avant disparition ---
    const totalDelay = lignes.reduce((max, ligne) => Math.max(max, ligne.length * 25), 0) + 7000;
    const tFinal = setTimeout(resolve, totalDelay);
    descriptionTimers.push(tFinal);
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




// === Fonction qui lie Titre ↔ Description avec phases de repos ===
// === Fonction qui lie Titre ↔ Description avec phases de repos ===
async function lierTitreEtDescription(i) {
  const blok = blokys[i];
  const spans = Array.from(blok.querySelectorAll("span"));
  const speed = 30;

  await phaseRepos();
  await descendreTitres(i);

  // === PHASE 1 : État initial exact comme showBlokCMD ===
  spans.forEach(span => {
    span.style.transition = '';
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.opacity = '1';  // EXACT comme showBlokCMD
  });

  // === PHASE 2 : Effet CMD identique à showBlokCMD ===
  spans.forEach((span, index) => {

    // 1) barre CMD : fond actif + texte sombre
    setTimeout(() => {
      span.style.color = '#ff0000ff';          // comme showBlokCMD
      span.style.backgroundColor = '#ff0000ff'; // ACTIVE COLOR avant passage en rouge
      span.style.opacity = '1';
    }, index * speed);

    // 2) couleur finale (grise) comme showBlokCMD
    setTimeout(() => {
      span.style.color = '#ff0000ff';   // rouge
      span.style.backgroundColor = 'transparent';
      span.style.opacity = '1';
    }, index * speed + Math.max(Math.floor(speed * 0.8), 20));
  });

  // === PHASE 3 : Passage au ROUGE après la fin complète du CMD ===
  const totalCMD = spans.length * speed + 80;

  setTimeout(() => {
    spans.forEach(span => {
      span.style.color = '#ff0000ff';   // rouge
      span.style.backgroundColor = 'transparent';
    });
  }, totalCMD);

  // === Déroulé normal ===
  await montrerDescription(i);
  await cacherDescription(i);

  // disparition rouge façon CMD
  removeActiveColor(blok, 20, "#ff0000ff");

  await remonterTitres(i);
}


// === Animation principale en boucle ===
let boucleCase3 = true;  // mettre à false pour arrêter la boucle

async function startAnimationSequence() {
  while (boucleCase3) {
    for (let i = 0; i < blokys.length; i++) {
      if (!boucleCase3) break;  // permet d’interrompre la boucle
      await lierTitreEtDescription(i);
    }

    // attente 3 secondes avant de recommencer
    await new Promise(resolve => setTimeout(resolve, 3000));

  }
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











const yearElement = document.querySelector('.year');
const yearWords = ["2026", "2024", "2023", "2022"];
let yearIndex = 0;


// Configuration personnalisée pour chaque année
const yearDelays = {
  "2026": { appearDelay: 150, passedDelay: 200, leaveDelay: 80, displayTime: 12000 },
  "2024": { appearDelay: 200, passedDelay: 250, leaveDelay: 100, displayTime: 40000 },
  "2023": { appearDelay: 180, passedDelay: 220, leaveDelay: 90, displayTime: 13000 },
  "2022": { appearDelay: 220, passedDelay: 300, leaveDelay: 120, displayTime: 13000 }
};

function cycleYearWords() {
  if (!yearElement) return;

  // Clear previous timeouts
  if (yearElement.timeouts) {
    yearElement.timeouts.forEach(t => clearTimeout(t));
  }
  yearElement.timeouts = [];

  const word = yearWords[yearIndex] || '';
  const delays = yearDelays[word] || { appearDelay: 200, passedDelay: 200, leaveDelay: 100, displayTime: 5000 };

  yearElement.innerHTML = '';

  // Création des spans
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

  // === Apparition lettre par lettre avec curseur ===
  spans.forEach((span, i) => {
    const t1 = setTimeout(() => {
      spans.forEach(s => s.style.borderRight = '2px solid transparent');
      span.style.color = '#000000';
      if (i === 0) {
        span.style.borderLeft = '2px solid white';
      } else {
        spans[i - 1].style.borderRight = '2px solid white';
      }
    }, i * delays.appearDelay);
    yearElement.timeouts.push(t1);

    const t2 = setTimeout(() => {
      span.style.color = '#ffffff';
      if (i > 0) spans[i - 1].style.borderRight = '2px solid transparent';
      if (i === 0) span.style.borderLeft = '2px solid transparent';
    }, i * delays.appearDelay + delays.passedDelay);
    yearElement.timeouts.push(t2);
  });

  // === Curseur final clignotant ===
  const tBlinkStart = setTimeout(() => {
    let blinkVisible = true;
    let blinkInterval;
    if (spans.length) {
      spans.forEach(s => s.style.borderRight = '2px solid transparent');
      const last = spans[spans.length - 1];
      last.style.borderRight = '2px solid white';

      blinkInterval = setInterval(() => {
        last.style.borderRight = blinkVisible ? '2px solid transparent' : '2px solid white';
        blinkVisible = !blinkVisible;
      }, 500);

      yearElement.timeouts.push({ interval: blinkInterval });
    }
  }, spans.length * delays.appearDelay + delays.passedDelay);
  yearElement.timeouts.push(tBlinkStart);

  // === Disparition lettre par lettre avec curseur ===
  const tLeave = setTimeout(() => {
    // stop blink
    yearElement.timeouts.forEach(t => {
      if (t.interval) clearInterval(t.interval);
    });

    const lastIndex = spans.length - 1;

    spans.forEach((span, i) => {
      const delay = (lastIndex - i) * delays.leaveDelay;

      const t1 = setTimeout(() => {
        spans.forEach(s => {
          s.style.borderRight = '2px solid transparent';
          s.style.borderLeft = '2px solid transparent';
        });
        span.style.color = 'transparent';
        if (i === 0) {
          span.style.borderLeft = '2px solid white';
        } else {
          spans[i - 1].style.borderRight = '2px solid white';
        }
      }, delay);
      yearElement.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.backgroundColor = '#000000ff';
        span.style.border = 'none';
        if (i === lastIndex) yearElement.isAppeared = false;
      }, delay + delays.leaveDelay);
      yearElement.timeouts.push(t2);
    });

    const tNext = setTimeout(() => {
      yearIndex = (yearIndex + 1) % yearWords.length;
      cycleYearWords();
    }, spans.length * delays.leaveDelay + delays.leaveDelay + 50);
    yearElement.timeouts.push(tNext);

  }, spans.length * delays.appearDelay + delays.passedDelay + delays.displayTime);
  yearElement.timeouts.push(tLeave);
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
cycleYearWords();
appearLinks();
appearPhotoPosters();
appearTitle();


