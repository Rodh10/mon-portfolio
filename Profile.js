
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

/* ============================================================
   PROMISE POUR LES ANIMATIONS DE DISPARITION
   ============================================================ */
function leaveAllEffects() {
  return new Promise(resolve => {
    leaveEffectPara();
    leaveProfileTitleFirstTwo();
    leaveProfileTitleLastTwo();
    leaveEffectTitled();
    animateOldActiveLeaveWheel();
    setTimeout(resolve, 1000); // délai = durée totale de toutes les animations
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

    // Lancer toutes les animations de leave
    await leaveAllEffects();

    // Redirection selon la direction du scroll
    if (e.deltaY > 0) {
      window.location.href = "Achievements.html"; // scroll vers le bas
    } else {
      window.location.href = "index.html"; // scroll vers le haut
    }
  });

});





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

// === APPARITION (other + passion) ===
function appearProfileTitleFirstTwo() {
  const container = document.querySelector('.profiletitle');
  if (!container) return;

  container.timeouts = [];
  const paragraphs = prepareParagraphs(container, '.other p, .passion p');

  let maxDelay = 0;

  paragraphs.forEach(p => {
    const spans = Array.from(p.querySelectorAll('span > span'));

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#535353';
      }, i * 20);
      container.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#000000ff';
      }, i * 20 + 10);
      container.timeouts.push(t2);

      if (i * 20 + 10 > maxDelay) maxDelay = i * 20 + 10;
    });
  });

  container.isAppearedFirstTwo = true;
}

// === DISPARITION (other + passion) ===
function leaveProfileTitleFirstTwo() {
  const container = document.querySelector('.profiletitle');
  if (!container || !container.isAppearedFirstTwo) return;

  const paragraphs = container.querySelectorAll('.other p, .passion p');

  paragraphs.forEach(p => {
    const spans = Array.from(p.querySelectorAll('span > span'));

    spans.forEach((span, i) => {
      const delay = (spans.length - 1 - i) * 20;
      setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#535353';
      }, delay);
      setTimeout(() => {
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
      }, delay + 20);
    });
  });

  container.isAppearedFirstTwo = false;
}

// === APPARITION (craft + skills5) ===
function appearProfileTitleLastTwo() {
  const container = document.querySelector('.profiletitle');
  if (!container) return;

  container.timeouts = [];
  const paragraphs = prepareParagraphs(container, '.craft p, .skills5 p');

  let maxDelay = 0;

  paragraphs.forEach(p => {
    const spans = Array.from(p.querySelectorAll('span > span'));

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#535353';
      }, i * 20);
      container.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#000000ff';
      }, i * 20 + 10);
      container.timeouts.push(t2);

      if (i * 20 + 10 > maxDelay) maxDelay = i * 20 + 10;
    });
  });

  container.isAppearedLastTwo = true;
}

// === DISPARITION (craft + skills5) ===
function leaveProfileTitleLastTwo() {
  const container = document.querySelector('.profiletitle');
  if (!container || !container.isAppearedLastTwo) return;

  const paragraphs = container.querySelectorAll('.craft p, .skills5 p');

  paragraphs.forEach(p => {
    const spans = Array.from(p.querySelectorAll('span > span'));

    spans.forEach((span, i) => {
      const delay = (spans.length - 1 - i) * 20;
      setTimeout(() => {
        span.style.color = '#535353';
        span.style.backgroundColor = '#535353';
      }, delay);
      setTimeout(() => {
        span.style.color = 'transparent';
        span.style.backgroundColor = 'transparent';
      }, delay + 20);
    });
  });

  container.isAppearedLastTwo = false;
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
    // Séparer le contenu par <br> pour créer une ligne par span-container
    if (!p.querySelector('span')) {
      const lines = p.innerHTML.split('<br>');
      p.textContent = '';
      lines.forEach(lineText => {
        const lineContainer = document.createElement('span');
        lineContainer.style.display = 'block';
        lineText.split('').forEach(ch => {
          const span = document.createElement('span');
          span.textContent = ch;
          span.style.color = 'transparent';
          span.style.backgroundColor = 'transparent';
          span.style.display = 'inline-block';
          lineContainer.appendChild(span);
        });
        p.appendChild(lineContainer);
      });
    }

    // Animation : toutes les lignes en même temps, de gauche à droite
    const lineContainers = Array.from(p.children);
    lineContainers.forEach(line => {
      const spans = Array.from(line.children);
      spans.forEach(span => span.style.color = 'transparent');

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
  if (!container || !container.isAppeared) return;

  const paragraphs = container.querySelectorAll('p');

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
      // Disparition de droite à gauche (effet cmd)
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
      });
    });
  });

  container.isAppeared = false;
}







// ===================== //
//   ANIMATION - TITLED  //
// ===================== //




function appearTitled() {
  const container = document.querySelector('.titled');
  if (!container) return;

  container.timeouts = [];

  // Découpage en span si pas déjà fait
  if (!container.querySelector('span')) {
    const paragraphs = container.querySelectorAll('p');
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

  const paragraphs = container.querySelectorAll('p');

  paragraphs.forEach(p => {
    const spans = p.querySelectorAll('span');
    spans.forEach(s => {
      s.style.color = 'transparent';
      s.style.backgroundColor = 'transparent';
      s.style.border = 'none';
      s.style.opacity = '1';
    });

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => {
        span.style.color = '#ffffff';         // blanc pur
        span.style.backgroundColor = '#ffffff';
        span.style.border = 'none';
      }, i * 30); // un peu plus lent pour les titres
      container.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#ffffffff';         
        span.style.backgroundColor = '#000000ff';
        span.style.border = 'none';
      }, i * 30 + 15);
      container.timeouts.push(t2);
    });
  });

  container.isAppeared = true;
}

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








appearTitled();
appearProfileTitleFirstTwo();
appearProfileTitleLastTwo();
appearPara();
appearLinks();

