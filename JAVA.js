

const mpanoratra = document.querySelector(".pablo");
const logoWrapper = document.querySelector(".logo");
const tongasoa = document.querySelector(".welcome");
const lien = document.querySelector("monlien");
const propos = document.querySelector(".slide1");
const iconWrapper = document.getElementById("icon");
const cv = document.querySelector("#resume a");
const returnHome = document.getElementById("return-home");
const navbrand = document.querySelectorAll('.design');
const talenta = document.querySelector(".block");
const titreo = document.querySelector(".title");
const period = document.querySelector(".conteneur");

const designLinks = document.querySelectorAll('.design');
const views = document.querySelectorAll('#blok3 .view');

const ensemble = document.querySelectorAll(".ensemble");


let currentIndex = 0; // index par défaut




let idleTimeout;
let blinkInterval;
let isBlinking = false;



window.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';

  // Arrêter le clignotement si on bouge la souris
  if (isBlinking) {
    clearInterval(blinkInterval);
    cursor.style.opacity = '1'; // visible quand on bouge
    isBlinking = false;
  }

  // Réinitialiser le timer de repos
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    startBlinking();
  }, 1000); // 1 seconde sans mouvement avant clignotement
});

function startBlinking() {
  if (isBlinking) return;
  isBlinking = true;

  blinkInterval = setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
  }, 500); // clignote toutes les 500 ms
}







// Exemple minimal de simulateCmdEffect
function simulateCmdEffect(link) {
  if (!link) return;
  if (!link.timeouts) link.timeouts = [];
  else {
    link.timeouts.forEach(t => clearTimeout(t));
    link.timeouts.length = 0;
  }
  const spans = link.querySelectorAll('span');
  spans.forEach(span => {
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
  });
  spans.forEach((span, i) => {
    const timeout1 = setTimeout(() => {
      span.style.color = 'black';
      span.style.backgroundColor = 'white';
      span.style.border = 'none';
    }, i * 30);
    link.timeouts.push(timeout1);

    const timeout2 = setTimeout(() => {
      span.style.color = '#ffffffff';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    }, i * 30 + 10);
    link.timeouts.push(timeout2);
  });
}


// leaveEffect : toujours faire l’animation, sans condition .active
function leaveEffect1(link, timeouts) {
  if (!link) return;
  const spans = link.querySelectorAll('span');

  timeouts.forEach(t => clearTimeout(t));
  timeouts.length = 0;

  // Mets tout le texte en blanc dès le début
  spans.forEach(span => {
    span.style.color = 'white';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
  });

  const lastIndex = spans.length - 1;
  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;

    const timeout1 = setTimeout(() => {
      span.style.color = 'black';
      span.style.backgroundColor = 'white';
      span.style.border = 'none';
    }, delay);
    timeouts.push(timeout1);

    const timeout2 = setTimeout(() => {
      span.style.color = '#808080';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    }, delay + 20);
    timeouts.push(timeout2);
  });
}

 




const nav = document.querySelector('.navigation');
const resume = document.getElementById('resume');
const socialLinks = document.querySelectorAll('#icon .icon-link');
const diteBonjour = document.getElementById('ditebonjour'); // bouton Say Hi






function startRabbitTyping(callback) {
  const el = document.querySelector('.rabbit');
  if (!el) {
    if (callback) callback();
    return;
  }

  const p = el.querySelector('p');
  if (!p) {
    if (callback) callback();
    return;
  }

  const text = p.textContent;
  p.textContent = '';

  const spans = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch;
    span.style.opacity = '0';
    span.style.color = '#00b406ff';
    span.style.fontFamily = 'monospace';
    p.appendChild(span);
    spans.push(span);
  }

  let index = 0;

  function typeNext() {
    if (index >= spans.length) {
      if (callback) callback();
      return;
    }

    const span = spans[index];
    span.style.opacity = '1';
    span.style.backgroundColor = 'transparent';

    // petite animation visuelle
    setTimeout(() => {
      span.style.backgroundColor = 'transparent';
    }, 30);

    index++;

    // frappe rapide normale
    let delay = 20 + Math.random() * 50; // 20~70ms

    // grande pause aléatoire partout
    if (Math.random() < 0.2) { // 20% des lettres
      const pauseTime = 400 + Math.random() * 500; // 500ms à 1500ms
      delay += pauseTime;

      // signal visuel de pause : underline
      span.style.textDecoration = 'underline';
      setTimeout(() => {
        span.style.textDecoration = 'none';
      }, pauseTime);
    }

    setTimeout(typeNext, delay);
  }

  typeNext();
}




function startLoaderWithRabbit(callback) {

  // ⏱️ loader en parallèle
  startLoadingAnimation(() => {
    if (callback) callback();
  });
}



window.addEventListener("DOMContentLoaded", () => {

  const loaderPlayed = sessionStorage.getItem('loaderPlayed');

  if (!loaderPlayed) {

    startLoaderWithRabbit(() => {

      enhanceNavLinks();
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

    });

    sessionStorage.setItem('loaderPlayed', 'true');

  } else {

    enhanceNavLinks();
    appearClockWithRandom();
    appearLinks(); 
    initResumeAnimations();
    cycleHiWords();
    appearWelcome();
    appearMonLien();
    initSayHiAnimations();
    iconWrapper.classList.remove("hidden");
    iconWrapper.classList.add("visible");
    mpanoratra.classList.remove("miakatra");
    titreo.classList.remove("mipoitra");
    talenta.classList.remove("mandeha");
  }
});





const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

let showCursorTimeout;

function hideCursor() {
  clearTimeout(showCursorTimeout);
  cursor.style.display = 'none';
}

function delayedShowCursor() {
  showCursorTimeout = setTimeout(() => {
    cursor.style.display = 'block';
  }, 500); // délai avant affichage du curseur
}

// Navigation
if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
}

// Resume
if (resume) {
  resume.addEventListener('mouseenter', hideCursor);
  resume.addEventListener('mouseleave', delayedShowCursor);
}

// Liens réseaux sociaux
if (socialLinks.length) {
  socialLinks.forEach(soc => {
    soc.addEventListener('mouseenter', hideCursor);
    soc.addEventListener('mouseleave', delayedShowCursor);
  });
}

// Bouton "Dite Bonjour"
if (diteBonjour) {
  diteBonjour.addEventListener('mouseenter', hideCursor);
  diteBonjour.addEventListener('mouseleave', delayedShowCursor);
}







function startLoadingAnimation(callback) {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.style.position = 'fixed';
  loader.style.bottom = '2rem';
  loader.style.left = '2rem';
  loader.style.fontSize = '10rem';
  loader.style.fontFamily = 'monospace';
  loader.style.color = 'white';
  loader.style.zIndex = '9999';
  document.body.appendChild(loader);

  // Prépare les 3 spans pour les centaines, dizaines, unités
  loader.innerHTML = '';
  const spans = [];
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    span.textContent = '0';
    loader.appendChild(span);
    spans.push(span);
  }

  // Effet cmd pour le premier chiffre "001"
  appearSpanCmd(spans, '001');

  // Petit délai avant de commencer l'animation de compte
  setTimeout(() => {
    // Génère la séquence inversée 001 → 000
    const sequence = [];
    for (let num = 1; num <= 100; num++) {
      const reversed = (100 - num).toString().padStart(3, '0').split('').reverse().join('');
      sequence.push(reversed);
    }
    sequence.push('000');

    let index = 0;
    const interval = setInterval(() => {
      if (index >= sequence.length) {
        clearInterval(interval);
        // Effet cmd à la disparition
        leaveSpanCmd(spans, () => {
          loader.remove();
          if (callback) callback();
        });
        return;
      }

      const value = sequence[index];
      spans.forEach((span, i) => {
        span.textContent = value[i];
      });
      index++;
    }, 40); // vitesse de l'animation
  }, 500); // délai avant de lancer le compte
}

// Apparition effet cmd depuis la gauche
function appearSpanCmd(spans, value) {
  spans.forEach((span, i) => {
    span.textContent = value[i];
    span.style.transform = 'translateX(-100%)';
    span.style.opacity = '0';
    setTimeout(() => {
      span.style.transition = 'all 0.3s ease';
      span.style.transform = 'translateX(0)';
      span.style.opacity = '1';
    }, i * 100);
  });
}

// Disparition effet cmd vers la droite
function leaveSpanCmd(spans, callback) {
  spans.forEach((span, i) => {
    setTimeout(() => {
      span.style.transform = 'translateX(100%)';
      span.style.opacity = '0';
    }, i * 50);
  });
  setTimeout(callback, spans.length * 50 + 300);
}











// Map pour stocker les timeouts par élément
const leaveEffectTimers = new WeakMap();

/**
 * Applique l'effet "fond blanc qui recule" sur un paragraphe ou titre
 * @param {HTMLElement|string} target - Élément DOM ou sélecteur CSS (id/classe)
 */
function leaveEffectText(target) {
  const el = (typeof target === 'string') ? document.querySelector(target) : target;
  if (!el) return;

  // Si le texte n'a pas encore de spans, on les crée
  if (!el.querySelector('span')) {
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      el.appendChild(span);
    });
  }

  const spans = el.querySelectorAll('span');

  // Nettoie les timeouts en cours pour cet élément
  cancelLeaveEffect(el);

  // Mets tout le texte en blanc dès le début
  spans.forEach(span => {
    span.style.color = 'white';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
  });

  const lastIndex = spans.length - 1;
  const timers = [];

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;

    const t1 = setTimeout(() => {
      span.style.color = 'black';
      span.style.backgroundColor = 'white';
      span.style.border = 'none';
    }, delay);
    timers.push(t1);

    const t2 = setTimeout(() => {
      span.style.color = '#000000ff';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    }, delay + 20);
    timers.push(t2);
  });

  // Stocke les timers pour pouvoir les annuler plus tard
  leaveEffectTimers.set(el, timers);
}

/**
 * Annule toute animation leaveEffectText en cours sur l'élément
 * @param {HTMLElement|string} target - Élément DOM ou sélecteur CSS
 */
function cancelLeaveEffect(target) {
  const el = (typeof target === 'string') ? document.querySelector(target) : target;
  if (!el) return;

  const timers = leaveEffectTimers.get(el);
  if (timers) {
    timers.forEach(t => clearTimeout(t));
    leaveEffectTimers.delete(el);
  }
}








const hiElement = document.querySelector('.hi');
const words = ["Hello ", "Salutations ", "Salama ", "Hola ", "Hallo "];
let wordIndex = 0;

function cycleHiWords() {
  if (!hiElement) return;

  // Annule les anciens timeouts s'il y en a
  if (hiElement.timeouts) {
    hiElement.timeouts.forEach(t => clearTimeout(t));
  }
  hiElement.timeouts = [];
    

  // Prépare texte : vide et span chaque lettre
  const word = words[wordIndex];
  hiElement.innerHTML = '';
  for (const ch of word) {
    const span = document.createElement('span');
    span.textContent = ch;
    hiElement.appendChild(span);
  }

  const spans = Array.from(hiElement.querySelectorAll('span'));
  const letterDelayAppear = 200;
  const passedDelayAppear = 200;
  const letterDelayLeave = 100;
  const resetDelayLeave = 100;
  const displayTime = 5000;

  // === Apparition ===
  hiElement.isAppeared = true;
  spans.forEach(s => {
    s.style.color = '#000000';
    s.style.lineHeight = '0.9';
    s.style.backgroundColor = 'transparent';
    s.style.borderBottomColor = 'transparent';
  });
  spans.forEach((span, i) => {
    const t1 = setTimeout(() => {
      spans.forEach(s => {
        s.style.backgroundColor = 'transparent';
        s.style.borderBottomColor = 'transparent';
      });
      span.style.color = '#000000';
      span.style.borderBottom = '20px solid white';
    }, i * letterDelayAppear);
    hiElement.timeouts.push(t1);

    const t2 = setTimeout(() => {
      span.style.color = '#ffffffff';
      span.style.backgroundColor = 'transparent';
      span.style.borderBottomColor = '20px solid white';
    }, i * letterDelayAppear + passedDelayAppear);
    hiElement.timeouts.push(t2);
  });

  // HoverEffect (optionnel)
  if (typeof hoverEffect === 'function') {
    const tHover = setTimeout(() => {
      try { hoverEffect(hiElement); } catch {}
    }, spans.length * letterDelayAppear + passedDelayAppear + 50);
    hiElement.timeouts.push(tHover);
  }

  // === Clignotement de la barre sous la dernière lettre pendant displayTime ===
  let blinkVisible = true;
  let blinkInterval;
  const lastIndex = spans.length - 1;

  const tBlinkStart = setTimeout(() => {
    // Assure que la barre est bien visible sous la dernière lettre au départ du clignotement
    spans.forEach(s => {
      s.style.borderBottomColor = 'transparent';
    });
    spans[lastIndex].style.borderBottom = '20px solid white';

    blinkInterval = setInterval(() => {
      if (blinkVisible) {
        spans[lastIndex].style.borderBottomColor = 'transparent';
      } else {
        spans[lastIndex].style.borderBottomColor = 'white';
      }
      blinkVisible = !blinkVisible;
    }, 500);
  }, spans.length * letterDelayAppear + passedDelayAppear);
  hiElement.timeouts.push(tBlinkStart);

  // === Disparition (leave) après displayTime + apparition ===
  const tLeave = setTimeout(() => {
    if (!hiElement.isAppeared) return;

    // Stoppe le clignotement
    clearInterval(blinkInterval);

    spans.forEach(s => {
      s.style.color = '#ffffffff';
      s.style.backgroundColor = 'transparent';
      s.style.borderBottomColor = 'transparent';
    });

    spans.forEach((span, i) => {
      const delay = (lastIndex - i) * letterDelayLeave;

      const t1 = setTimeout(() => {
        spans.forEach(s => {
          s.style.backgroundColor = 'none';
          s.style.borderBottomColor = 'transparent';
        });

        span.style.color = 'transparent';
        span.style.borderBottom = '20px solid white';
      }, delay);
      hiElement.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.backgroundColor = '#000000ff';
        span.style.border = 'none';
        if (i === lastIndex) hiElement.isAppeared = false;
      }, delay + resetDelayLeave);
      hiElement.timeouts.push(t2);
    });

    // Relance la boucle après la disparition complète
    const tNext = setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      cycleHiWords();
    }, spans.length * letterDelayLeave + resetDelayLeave + 50);
    hiElement.timeouts.push(tNext);
  }, spans.length * letterDelayAppear + passedDelayAppear + displayTime);

  hiElement.timeouts.push(tLeave);
}

function leaveEffectHi() {
  const el = document.querySelector('.hi');
  if (!el) return;

  if (!el.isAppeared) return; // Ne fait rien si pas apparu

  if (!el.timeouts) el.timeouts = [];
  else {
    el.timeouts.forEach(t => clearTimeout(t));
    el.timeouts.length = 0;
  }

  const spans = Array.from(el.querySelectorAll('span'));
  const lastIndex = spans.length - 1;

  // Texte tout blanc au départ
  spans.forEach(span => {
    span.style.color = 'white';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
  });

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;

    const t1 = setTimeout(() => {
      // Reset styles sur toutes les lettres avant d'activer celle-ci
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

      // Si dernière lettre, on met à jour l'état d'apparition
      if (i === lastIndex) el.isAppeared = false;
    }, delay + 20);
    el.timeouts.push(t2);
  });
}







/* ===========================
   INIT RESUME ANIMATIONS
   =========================== */
function initResumeAnimations() {
    const animatedTexts = document.querySelectorAll('#resume button');

    animatedTexts.forEach((el, index) => {
        const text = el.textContent;
        el.textContent = '';

        // Création des spans pour chaque lettre
        const letters = text.split('');
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            el.appendChild(span);
        });

        let timeouts = [];

        // Marque que l'apparition est active
        el.isAppeared = true;

        // Animation type "cmd" (utilisable pour entrée et hover)
        function playCmdEffect(delayStart = 0, colorNormal = '#000000', colorAfter = '#808080') {
            timeouts.forEach(t => clearTimeout(t));
            timeouts = [];

            const spans = el.querySelectorAll('span');
            spans.forEach((span, i) => {
                const timeout1 = setTimeout(() => {
                    span.style.color = colorNormal;
                    span.style.backgroundColor = '#808080';
                    span.style.border = 'none';
                }, delayStart + i * 30);
                timeouts.push(timeout1);

                const timeout2 = setTimeout(() => {
                    span.style.color = colorAfter;
                    span.style.backgroundColor = '#000000ff';
                    span.style.border = 'none';
                }, delayStart + i * 30 + 10);
                timeouts.push(timeout2);
            });
        }

        // Apparition initiale uniquement sur le premier élément
        if (index === 0) {
            playCmdEffect(300);
            el.style.pointerEvents = 'auto';
        }

        // --- Hover (rejoue l'effet) ---
        el.addEventListener('mouseenter', () => {
            playCmdEffect(0, '#000000', '#b8b8b8ff');
        });

        // --- Leave ---
        el.addEventListener('mouseleave', () => {
            timeouts.forEach(t => clearTimeout(t));
            timeouts = [];

            const spans = el.querySelectorAll('span');
            const lastIndex = spans.length - 1;

            spans.forEach((span, i) => {
                const delay = (lastIndex - i) * 30;

                const timeout1 = setTimeout(() => {
                    span.style.color = 'black';
                    span.style.backgroundColor = 'white';
                    span.style.border = 'none';
                }, delay);
                timeouts.push(timeout1);

                const timeout2 = setTimeout(() => {
                    span.style.color = '#808080';
                    span.style.backgroundColor = 'transparent';
                    span.style.border = 'none';
                }, delay + 20);
                timeouts.push(timeout2);
            });
        });

        // --- CLICK → téléchargement ---
        el.addEventListener('click', () => {
            const filePath = 'PORT FOLIO/CV.pdf'; // chemin vers ton CV dans le projet
            const fileName = 'CV.pdf';

            const link = document.createElement('a');
            link.href = filePath;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
}

// Map pour stocker les timeouts par élément
const leaveEffectTimersResume = [];

/**
 * Applique l'effet "fond blanc qui recule" sur #resume,
 * sans recréer les spans, juste avec styles et timers propres.
 */
function leaveEffectResume() {
    const el = document.querySelector('#resume button');
    if (!el) return;
    if (!el.isAppeared) return;

    leaveEffectTimersResume.forEach(t => clearTimeout(t));
    leaveEffectTimersResume.length = 0;

    const spans = el.querySelectorAll('span');
    if (!spans.length) return;

    spans.forEach(span => {
        span.style.color = '#808080';
        span.style.backgroundColor = 'transparent';
        span.style.border = 'none';
        span.style.opacity = '1';
    });

    const lastIndex = spans.length - 1;

    spans.forEach((span, i) => {
        const delay = (lastIndex - i) * 30;

        const t1 = setTimeout(() => {
            span.style.color = 'black';
            span.style.backgroundColor = 'white';
            span.style.border = 'none';
            span.style.opacity = '1';
        }, delay);
        leaveEffectTimersResume.push(t1);

        const t2 = setTimeout(() => {
            span.style.opacity = '0';
            span.style.color = '#000000';
            span.style.backgroundColor = 'transparent';
            span.style.border = 'none';
        }, delay + 20);
        leaveEffectTimersResume.push(t2);
    });

    // Une fois l’animation finie, on empêche toute interaction
    const totalTime = (lastIndex + 1) * 30 + 20;
    setTimeout(() => {
        el.style.pointerEvents = 'none';
    }, totalTime);

    el.isAppeared = false;
}






function appearWelcome() {
  const welcome = document.querySelector('.welcome');
  if (!welcome) return;

  welcome.timeouts = [];

  // Si les <span> n'existent pas encore, on les crée
  if (!welcome.querySelector('span')) {
    const paragraphs = welcome.querySelectorAll('p');
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

  const paragraphs = welcome.querySelectorAll('p');

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
        span.style.color = '#ffffffff';          // texte noir
        span.style.backgroundColor = '#ffffff'; // fond blanc
        span.style.border = 'none';
      }, i * 30);
      welcome.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#ffffffff';          // gris clair après
        span.style.backgroundColor = '#000000ff'; // fond blanc toujours
        span.style.border = 'none';
      }, i * 30 + 10);
      welcome.timeouts.push(t2);
    });
  });

  welcome.isAppeared = true;
}


const leaveEffectTimersWelcome = new WeakMap();

function leaveEffectWelcome() {
  const el = document.querySelector('.welcome');
  if (!el || !el.isAppeared) return; // <-- ne s'active que si apparu

  // Annule les timers en cours s'il y en a
  const oldTimers = leaveEffectTimersWelcome.get(el);
  if (oldTimers) {
    oldTimers.forEach(t => clearTimeout(t));
    leaveEffectTimersWelcome.delete(el);
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
      const delay = (lastIndex - i) * 10;

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
      }, delay + 20);
      timers.push(t2);
    });
  });

  leaveEffectTimersWelcome.set(el, timers);

  el.isAppeared = false; // <-- on note que le texte n’est plus visible après disparition
}







function appearMonLien() {
  const el = document.querySelector('.monlien');
  if (!el) return;

  el.timeouts = [];

  // Crée les spans si pas encore fait
  if (!el.querySelector('span')) {
    const p = el.querySelector('p');
    if (!p) return;

    const text = p.textContent;
    p.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch;
      p.appendChild(span);
    }
  }

  const spans = el.querySelectorAll('span');

  spans.forEach(s => {
    s.style.color = 'transparent';
    s.style.backgroundColor = 'transparent';
    s.style.border = 'none';
    s.style.opacity = '1';
  });

  spans.forEach((span, i) => {
    const t1 = setTimeout(() => {
      span.style.color = '#808080';
      span.style.backgroundColor = '#808080';
    }, i * 20);
    el.timeouts.push(t1);

    const t2 = setTimeout(() => {
      span.style.color = '#808080';
      span.style.backgroundColor = 'transparent';
    }, i * 20 + 10);
    el.timeouts.push(t2);
  });

  el.isAppeared = true;
}

const leaveEffectTimersMonLien = new WeakMap();

function leaveEffectMonLien() {
  const el = document.querySelector('.monlien');
  if (!el || !el.isAppeared) return;

  // Annule timers en cours
  const oldTimers = leaveEffectTimersMonLien.get(el);
  if (oldTimers) {
    oldTimers.forEach(t => clearTimeout(t));
    leaveEffectTimersMonLien.delete(el);
  }

  // Crée les spans si pas encore fait (sécurité)
  if (!el.querySelector('span')) {
    const p = el.querySelector('p');
    if (!p) return;

    const text = p.textContent;
    p.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch;
      p.appendChild(span);
    }
  }

  const spans = el.querySelectorAll('span');
  const timers = [];

  spans.forEach(span => {
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
    span.style.opacity = '1';
  });

  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 10;

    const t1 = setTimeout(() => {
      span.style.color = 'black';
      span.style.backgroundColor = '#808080';
      span.style.border = 'none';
      span.style.opacity = '1';
    }, delay);
    timers.push(t1);

    const t2 = setTimeout(() => {
      span.style.opacity = '0';
      span.style.color = '#000000';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    }, delay + 20);
    timers.push(t2);
  });

  leaveEffectTimersMonLien.set(el, timers);

  el.isAppeared = false;
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











let clockInterval;
const leaveEffectTimersClock = new WeakMap();

function appearClockWithRandom() {
  const el = document.getElementById('clock');
  if (!el) return;

  // Annule anciens timers
  if (el.timeouts) el.timeouts.forEach(t => clearTimeout(t));
  if (clockInterval) clearInterval(clockInterval);
  el.timeouts = [];
  el.isAppeared = true;

  // Heure actuelle
  const now = new Date();
  const trueChars = (String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0')).split('');
  const digitIndices = [0,1,3,4]; 

  // Crée les spans
  el.innerHTML = '';
  trueChars.forEach(ch => {
    const span = document.createElement('span');
    span.textContent = ch;
    span.style.color = 'transparent';
    el.appendChild(span);
  });

  const spans = el.querySelectorAll('span');
  const intervalDelay = 100;
  let completed = 0;

  spans.forEach((span, i) => {
    // fade-in
    setTimeout(() => {
      span.style.transition = 'color 0.2s';
      span.style.color = '#ffffff';
    }, i*400);

    if (digitIndices.includes(i)) {
      let elapsed = 0;
      const duration = 1500 + Math.random()*1500;
      const interval = setInterval(() => {
        span.textContent = Math.floor(Math.random()*10);
        elapsed += intervalDelay;
        if (elapsed >= duration) {
          span.textContent = trueChars[i];
          span.style.color = '#ffffff';
          clearInterval(interval);
          completed++;
          if (completed === digitIndices.length) startClock();
        }
      }, intervalDelay);
      el.timeouts.push(interval);
    } else {
      // ":"
      setTimeout(() => {
        span.textContent = trueChars[i];
        span.style.color = '#ffffff';
        completed++;
        if (completed === digitIndices.length) startClock();
      }, 1000);
    }
  });
}

function startClock() {
  const el = document.getElementById('clock');
  clockInterval = setInterval(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const spans = el.querySelectorAll('span');

    (h+':'+m).split('').forEach((ch,i) => {
      if (spans[i].textContent !== ch && i !== 2) { // ignore ":"
        const intervalDelay = 50;
        let elapsed = 0;
        const duration = 600; // durée du brouillage rapide
        const interval = setInterval(() => {
          spans[i].textContent = Math.floor(Math.random()*10); // random rapide
          elapsed += intervalDelay;
          if (elapsed >= duration) {
            clearInterval(interval);
            spans[i].textContent = ch; // chiffre final
          }
        }, intervalDelay);
      }
    });
  }, 1000);
}

function leaveClock() {
  const el = document.getElementById('clock');
  if (!el || !el.isAppeared) return;

  // Annule anciens timers
  const oldTimers = leaveEffectTimersClock.get(el);
  if (oldTimers) oldTimers.forEach(t => clearTimeout(t));
  leaveEffectTimersClock.set(el, []);

  const spans = el.querySelectorAll('span');
  const digitIndices = [0,1,3,4]; 
  const intervalDelay = 50;
  let completed = 0;

  spans.forEach((span,i) => {
    if (digitIndices.includes(i)) {
      let elapsed = 0;
      const duration = 500 + Math.random()*500;
      const interval = setInterval(() => {
        span.textContent = Math.floor(Math.random()*10);
        elapsed += intervalDelay;
        if (elapsed >= duration) {
          clearInterval(interval);
          span.style.transition = 'opacity 0.3s, color 0.3s';
          span.style.opacity = '0';
          span.style.color = 'transparent';
          completed++;
          if (completed === digitIndices.length) el.isAppeared = false;
        }
      }, intervalDelay);
      leaveEffectTimersClock.get(el).push(interval);
    } else {
      setTimeout(() => {
        span.style.transition = 'opacity 0.3s, color 0.3s';
        span.style.opacity = '0';
        span.style.color = 'transparent';
        completed++;
        if (completed === digitIndices.length) el.isAppeared = false;
      }, 100);
    }
  });
}




let leaveEffectTimersSayHi = [];

function initSayHiAnimations() {
  const el = document.querySelector('#ditebonjour');
  if (!el) return;

  const text = el.textContent.trim(); // enlève espaces début/fin
  el.textContent = '';

  // Création des spans
  text.split('').forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.style.opacity = '0';
    el.appendChild(span);
  });

  el.isAppeared = true;
  const spans = el.querySelectorAll('span');

  // Apparition initiale
  setTimeout(() => {
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.color = '#000000'; // texte noir pour tous
        if (i < 2) {
          // Les deux premières lettres
          span.style.backgroundColor = '#ff0000'; // rouge
        } else {
          span.style.backgroundColor = '#ffffff'; // blanc
        }
        span.style.opacity = '1';
      }, i * 100);
    });
  }, 2000);


  // --- Hover effect ---
  let timeouts = [];
  function playCmdEffect(delayStart = 0, colorNormal = '#000', colorAfter = '#000') {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];

    spans.forEach((span, i) => {
      const t1 = setTimeout(() => { span.style.color = colorNormal; }, delayStart + i * 30);
      const t2 = setTimeout(() => { span.style.color = '#fff'; }, delayStart + i * 30 + 50);
      const t3 = setTimeout(() => { span.style.color = colorAfter; }, delayStart + i * 30 + 100);
      timeouts.push(t1, t2, t3);
    });
  }



  el.addEventListener('mouseenter', () => {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];

    spans.forEach((span, i) => {
      const t = setTimeout(() => {
        span.style.color = '#000'; // texte noir
        if (i < 2) {
          span.style.backgroundColor = '#ff0000'; // rouge
        } else {
          span.style.backgroundColor = '#ff0000'; // blanc
        }
      }, i * 30);
      timeouts.push(t);
    });
  });

  el.addEventListener('mouseleave', () => {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];

    const total = spans.length;
    spans.forEach((span, i) => {
      const t = setTimeout(() => {
        span.style.color = '#000'; // texte noir
        if (i < 2) {
          span.style.backgroundColor = '#ff0000'; // rouge
        } else {
          span.style.backgroundColor = '#ffffff'; // blanc
        }
      }, (total - 1 - i) * 30); // inverse la direction
      timeouts.push(t);
    });
  });




  // --- Click ---
  el.addEventListener('click', () => {
    leaveEffectResume();
    leaveEffectHi();
    leaveEffectWelcome();
    leaveEffectMonLien();
    leaveEffectLinks();
    leaveEffectSayHi();
    leaveClock();
    leaveEffectLinks2();

    setTimeout(() => window.location.href = 'Contact me.html', 1500);
  });
}

// --- Leave effect SayHi ---
function leaveEffectSayHi() {
  const el = document.querySelector('#ditebonjour');
  if (!el || !el.isAppeared) return;

  leaveEffectTimersSayHi.forEach(t => clearTimeout(t));
  leaveEffectTimersSayHi = [];

  const spans = el.querySelectorAll('span');
  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;
    const t1 = setTimeout(() => {
      span.style.color = 'transparent';
      span.style.visibility = 'hidden';
    }, delay);
    leaveEffectTimersSayHi.push(t1);
  });

  el.isAppeared = false;
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

    /* ============ CLICK ============ */
    el.addEventListener('click', e => {
      e.preventDefault();

      // 🚫 Si on clique sur le menu déjà actif → rien
      if (el.classList.contains("active-page")) return;

      const linkUrl = el.getAttribute('href');
      const oldActive = document.querySelector(".active-page");

      // Animation leave sur l'ancien actif uniquement
      if (oldActive && oldActive !== el) {
        animateOldActiveLeave(oldActive);
        oldActive.classList.remove("active-page");
      }

      // Marque le lien cliqué comme actif
      el.classList.add("active-page");

      // Appel direct des leaveEffect
      leaveEffectResume();
      leaveEffectHi();
      leaveEffectWelcome();
      leaveEffectMonLien();
      leaveEffectSayHi();
      leaveClock();

      // Redirection après un petit délai pour que l'effet se voie
      setTimeout(() => {
        if (linkUrl === "#home") window.location.href = "index.html";
        else if (linkUrl === "#about") window.location.href = "Profile.html";
        else if (linkUrl === "#track") window.location.href = "Achievements.html";
        else window.location.href = linkUrl; // fallback
      }, 300);
    });
  });

  /* ============================================================
     Fonction : leave CMD pour l'ancien menu actif uniquement
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
     Activer le menu courant
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





function splitLinksText() {
  document.querySelectorAll('.nav').forEach(el => {
    if (el.dataset.splitted) return;

    const text = el.textContent;
    el.textContent = '';

    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.color = '#808080';
      span.style.backgroundColor = 'transparent';
      span.style.opacity = '0'; // <-- invisibles par défaut
      el.appendChild(span);
    });

    el.dataset.splitted = "true";
    el.isAppeared = true; // on considère le lien actif
  });
}

// Appeler une fois au démarrage
splitLinksText();


// --- Fonction de disparition letter-by-letter pour les liens ---
function leaveEffectLinks2() {
  const links = document.querySelectorAll('.nav');
  if (!links.length) return;

  links.forEach(el => {
    if (!el.isAppeared) return; // ne pas relancer si déjà disparu

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
      const delay = (lastIndex - i) * 40; // un peu plus lent

      // 1️⃣ Passage temporaire au blanc sur fond blanc
      const t1 = setTimeout(() => {
        span.style.color = '#000000';
        span.style.backgroundColor = 'white';
        span.style.opacity = '1';
      }, delay);
      leaveEffectTimersLinks.get(el).push(t1);

      // 2️⃣ Disparition finale : gris transparent
      const t2 = setTimeout(() => {
        span.style.opacity = '0';
        span.style.color = '#808080';
        span.style.backgroundColor = 'transparent';
      }, delay + 60); // 60ms après le t1 pour un effet visible
      leaveEffectTimersLinks.get(el).push(t2);
    });

    // Désactiver les interactions après la fin de l’animation
    const totalTime = (lastIndex + 1) * 40 + 60;
    setTimeout(() => {
      el.style.pointerEvents = 'none';
    }, totalTime);

    el.isAppeared = false;
  });
}



let scrollCooldown = false;

window.addEventListener('wheel', (e) => {
  // Ignorer tout scroll vers le haut
  if (e.deltaY <= 0) return;

  if (scrollCooldown) return;
  scrollCooldown = true;

  // Lancer toutes les leave effects
  leaveEffectResume();
  leaveEffectHi();
  leaveEffectWelcome();
  leaveEffectMonLien();
  leaveEffectLinks();
  leaveEffectSayHi();
  leaveClock();
  animateOldActiveLeaveWheel();

  // Redirection après 1,5 s pour laisser le temps aux animations
  setTimeout(() => {
    window.location.href = "Profile.html"; // page suivante
  }, 1500);
});




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
