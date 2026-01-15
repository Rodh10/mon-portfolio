const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

let idleTimeout;
let blinkInterval;
let isBlinking = false;

const textFields = [
  document.querySelector('#message'),
  document.querySelector('#objet')
];

// On ajoute les boutons à surveiller
const buttons = [
  document.querySelector('#quit'),
  document.querySelector('#send')
];

let fieldFocused = null;           // champ actuellement focus
let mouseOverFocusedField = false; // souris sur champ focus ou bouton
let lastMouseX = 0;
let lastMouseY = 0;

function isMouseOverElement(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const x = lastMouseX;
  const y = lastMouseY;
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

window.addEventListener('mousemove', e => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';

  // Arrêt ou reprise du blink selon focus + hover
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    if (!fieldFocused || !mouseOverFocusedField) startBlinking();
  }, 1000);
});

function hideCursor() {
  cursor.style.opacity = '0';
  cursor.style.display = 'none';
  clearInterval(blinkInterval);
  isBlinking = false;
}

function showCursor() {
  cursor.style.display = 'block';
  cursor.style.opacity = '1';
}

function startBlinking() {
  if (isBlinking || fieldFocused) return;
  isBlinking = true;
  blinkInterval = setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
  }, 500);
}

// Fonction commune pour gérer focus/hover
function setupHoverDisappearance(el) {
  if (!el) return;

  // Focus (uniquement pour inputs/textarea)
  el.addEventListener && el.addEventListener('focus', () => {
    fieldFocused = el;
    if (isMouseOverElement(el)) {
      mouseOverFocusedField = true;
      hideCursor();
    }
  });

  el.addEventListener && el.addEventListener('blur', () => {
    if (fieldFocused === el) fieldFocused = null;
    mouseOverFocusedField = false;
    showCursor();
  });

  // Survol souris (pour inputs, textarea, boutons)
  el.addEventListener('mouseenter', () => {
    if (fieldFocused === el || buttons.includes(el)) {
      mouseOverFocusedField = true;
      hideCursor();
    }
  });

  el.addEventListener('mouseleave', () => {
    if (fieldFocused === el || buttons.includes(el)) {
      mouseOverFocusedField = false;
      showCursor();
    }
  });
}

// Appliquer sur tous les champs
textFields.forEach(f => setupHoverDisappearance(f));
buttons.forEach(b => setupHoverDisappearance(b));








const leaveEffectTimersFakePlaceholder = new WeakMap();

function toggleFakePlaceholder(selector, show = true, delayStart = 0) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (!el) { resolve(); return; }

    // Annule timers précédents
    const oldTimers = leaveEffectTimersFakePlaceholder.get(el);
    if (oldTimers) {
      oldTimers.forEach(t => clearTimeout(t));
      leaveEffectTimersFakePlaceholder.delete(el);
    }

    if (!el.querySelector('span')) {
      const text = el.textContent;
      el.textContent = '';
      for (const ch of text) {
        const span = document.createElement('span');
        span.textContent = ch;
        el.appendChild(span);
      }
    }

    const spans = el.querySelectorAll('span');

    if (show && !el.isAppeared) {
      el.timeouts = el.timeouts || [];
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
        }, delayStart + i * 20);
        el.timeouts.push(t1);

        const t2 = setTimeout(() => {
          span.style.color = '#808080';
          span.style.backgroundColor = 'transparent';
          // À la fin de la dernière animation on résout la promesse
          if(i === spans.length -1) resolve();
        }, delayStart + i * 20 + 10);
        el.timeouts.push(t2);
      });

      el.isAppeared = true;

    } else if (!show && el.isAppeared) {
      const timers = [];
      spans.forEach(span => {
        // Préparer chaque span pour animation inverse
        span.style.color = '#808080';
        span.style.backgroundColor = 'transparent';
        span.style.border = 'none';
        span.style.opacity = '1';
      });

      const lastIndex = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (lastIndex - i) * 10;

        // Animation inverse : rétrécir / disparaître progressivement
        const t1 = setTimeout(() => {
          span.style.color = 'transparent';         // disparition couleur
          span.style.backgroundColor = 'transparent';
          span.style.border = 'none';
          span.style.opacity = '0';                // disparaît
        }, delay);
        timers.push(t1);

        const t2 = setTimeout(() => {
          // Nettoyage final à la fin de l'animation
          if(i === lastIndex) resolve(); 
        }, delay + 20);
        timers.push(t2);
      });

      leaveEffectTimersFakePlaceholder.set(el, timers);
      el.isAppeared = false;
    }
  });
}

// Appelle toggleFakePlaceholder et ensuite démarre caret après délai garanti
function setupFakePlaceholderInteraction(inputSelector, placeholderSelector, caretDiv) {
  const input = document.querySelector(inputSelector);
  const placeholder = document.querySelector(placeholderSelector);
  // Rendre le placeholder cliquable
  placeholder.style.cursor = 'text';
  placeholder.addEventListener('click', () => {
      input.focus();
  });
  const sendButton = document.querySelector('#send');
  if (!input || !placeholder || !caretDiv || !sendButton) return;

  caretDiv.style.visibility = 'hidden';
  let caretBlinkTimeout;

  // Fonction pour lancer le caret après délai
  function delayedCaretStart(delay = 300) {
    clearTimeout(caretBlinkTimeout);
    caretBlinkTimeout = setTimeout(() => {
      caretDiv.style.visibility = 'visible';
      initCaretBlink(caretDiv);
    }, delay);
  }

  input.addEventListener('focus', () => {
    // Faire disparaître placeholder puis lancer caret avec délai
    leaveFakePlaceholder(placeholderSelector);
    delayedCaretStart(350);

    if (!sendButton.isAppeared) {
      initSendAnimations();
    }
  });

  input.addEventListener('input', () => {
    if (input.value.length === 0) {
      // NE PAS ré-afficher placeholder si focus (garder caret)
      if (!input.matches(':focus')) {
        appearFakePlaceholder(placeholderSelector);
        caretDiv.style.visibility = 'hidden';
      } else {
        // Champ vide mais focus => placeholder invisible, caret visible
        caretDiv.style.visibility = 'visible';
        initCaretBlink(caretDiv);
      }

      // Vérifier les deux champs pour bouton envoyer
      const otherInputSelector = inputSelector === '#objet' ? '#message' : '#objet';
      const otherInput = document.querySelector(otherInputSelector);
      if (otherInput && otherInput.value.length === 0 && sendButton.isAppeared) {
        leaveEffectSend();
      }
    } else {
      // Texte présent : placeholder invisible, caret visible
      placeholder.isAppeared = false;
      const spans = placeholder.querySelectorAll('span');
      spans.forEach(s => s.style.opacity = '0');

      caretDiv.style.visibility = 'visible';
      initCaretBlink(caretDiv);

      if (!sendButton.isAppeared) {
        initSendAnimations();
      }
    }
  });

  input.addEventListener('blur', () => {
    if (input.value.length === 0) {
      appearFakePlaceholder(placeholderSelector);
      caretDiv.style.visibility = 'hidden';

      const otherInputSelector = inputSelector === '#objet' ? '#message' : '#objet';
      const otherInput = document.querySelector(otherInputSelector);
      if (otherInput && otherInput.value.length === 0 && sendButton.isAppeared) {
        leaveEffectSend();
      }
    } else {
      // Champ non vide au blur, cacher caret
      caretDiv.style.visibility = 'hidden';
    }
    clearTimeout(caretBlinkTimeout);
  });
}

// Fonctions simplifiées pour appeler toggleFakePlaceholder avec promesse
function appearFakePlaceholder(selector){
  return toggleFakePlaceholder(selector, true);
}
function leaveFakePlaceholder(selector){
  return toggleFakePlaceholder(selector, false);
}

// Appels corrigés selon ton HTML
setupFakePlaceholderInteraction('#objet', '#placeholder-objet');
setupFakePlaceholderInteraction('#message', '#placeholder-message');


// Animation caret blink CSS déjà en place : ici tu peux réinitialiser l'animation au besoin
function initCaretBlink(caretDiv){
  caretDiv.style.animation = 'none'; // reset animation
  // relancer l’animation en forçant reflow
  void caretDiv.offsetWidth;
  caretDiv.style.animation = 'blink 1s step-start infinite';
}

// --- Appliquer sur tes deux champs et leurs caret ---
setupFakePlaceholderInteraction('#objet', '#placeholder-objet', document.querySelector('.custom-caret-objet'));
setupFakePlaceholderInteraction('#message', '#placeholder-message', document.querySelector('.custom-caret-message'));

// Gestion des événements pour déclencher leaveEffectQuit

// Durées à ajuster selon ton timing dans leaveEffectFakePlaceholder
const DUREE_PAR_PLACEHOLDER = 500; // approximatif (temps total animation par placeholder)
const DELAI_ENTRE_PLACEHOLDERS = 300;

function leavePlaceholdersWithDelay(callbackAfter) {
  toggleFakePlaceholder('#objet');

  setTimeout(() => {
    toggleFakePlaceholder('#message');
  }, DELAI_ENTRE_PLACEHOLDERS);

  // Appeler le callback après la durée totale
  const totalDuration = DUREE_PAR_PLACEHOLDER + DELAI_ENTRE_PLACEHOLDERS;
  if (typeof callbackAfter === 'function') {
    setTimeout(callbackAfter, totalDuration);
  }
}












// Liste des timers pour Quit
let leaveEffectTimersQuit = [];

// Fonction de disparition du texte Quit

function initQuitAnimations() {
  const el = document.querySelector('#quit');
  if (!el) return;

  const text = el.textContent;
  el.textContent = '';

  const letters = text.split('');
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.style.opacity = '0'; // commence invisible
    el.appendChild(span);
  });

  const spans = el.querySelectorAll('span');
  el.isAppeared = true; // ✅ Indispensable pour que leave fonctionne

  // --- Apparition initiale ---
  setTimeout(() => {
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.color = '#000000';
        span.style.backgroundColor = i < 2 ? '#ff0000' : '#ffffff';
        span.style.opacity = '1';
      }, i * 100);
    });
  }, 600);

  // --- Hover effect ---
  let timeouts = [];

  el.addEventListener('mouseenter', () => {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];

    spans.forEach((span, i) => {
      const t = setTimeout(() => {
        span.style.color = '#000000';
        span.style.backgroundColor = '#ff0000';
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
        span.style.color = '#000000';
        span.style.backgroundColor = i < 2 ? '#ff0000' : '#ffffff';
      }, (total - 1 - i) * 30);
      timeouts.push(t);
    });
  });

  // --- Click effect et redirection ---
  el.addEventListener('click', () => {
    timeouts.forEach(t => clearTimeout(t)); // stop hover effects
    leaveEffectQuit();
    runSequentialLeaveEffects();

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  });
  
}

// Fonction de disparition du texte Quit
function leaveEffectQuit() {
  const el = document.querySelector('#quit');
  if (!el || !el.isAppeared) return;

  leaveEffectTimersQuit.forEach(t => clearTimeout(t));
  leaveEffectTimersQuit = [];

  const spans = el.querySelectorAll('span');
  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;

    const t1 = setTimeout(() => {
      span.style.opacity = '0';
      span.style.visibility = 'hidden';
      span.style.color = 'transparent';
      span.style.backgroundColor = 'transparent';
    }, delay);

    leaveEffectTimersQuit.push(t1);

    const t2 = setTimeout(() => {
      if (i === lastIndex) el.isAppeared = false;
    }, delay + 20);

    leaveEffectTimersQuit.push(t2);
  });
}















function initSendAnimations() {
  const animatedTexts = document.querySelectorAll('#send');

  animatedTexts.forEach((el, index) => {
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

    // Marque que l'apparition est active
    el.isAppeared = true;

    // Animation type "cmd" (utilisable pour entrée et hover)
    function playCmdEffect(delayStart = 0, colorNormal = '#000000', colorAfter = '#808080') {
      timeouts.forEach(t => clearTimeout(t));
      timeouts = [];

      const spans = el.querySelectorAll('span');
      spans.forEach((span, i) => {
        const timeout1 = setTimeout(() => {
          span.style.color = colorNormal; // couleur normale
          span.style.backgroundColor = 'white';
          span.style.border = 'none';
        }, delayStart + i * 30);
        timeouts.push(timeout1);

        const timeout2 = setTimeout(() => {
          span.style.color = colorAfter;
          span.style.backgroundColor = 'transparent';
          span.style.border = 'none';
        }, delayStart + i * 30 + 10);
        timeouts.push(timeout2);
      });
    }

    // Apparition initiale uniquement sur le premier élément
    if (index === 0) {
      playCmdEffect(300);
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
  });
}

// Map pour stocker les timeouts par élément
const leaveEffectTimersSend = [];

/**
 * Applique l'effet "fond blanc qui recule" sur #send,
 * sans recréer les spans, juste avec styles et timers propres.
 */
function leaveEffectSend() {
  const el = document.querySelector('#send');
  if (!el) return;

  // Ne fait rien si l'apparition n'est pas active
  if (!el.isAppeared) return;

  // Annule timers précédents
  leaveEffectTimersSend.forEach(t => clearTimeout(t));
  leaveEffectTimersSend.length = 0;

  const spans = el.querySelectorAll('span');
  if (!spans.length) return; // si pas de spans, rien à faire

  // Mets tout en gris clair transparent au départ
  spans.forEach(span => {
    span.style.color = '#808080';
    span.style.backgroundColor = 'transparent';
    span.style.border = 'none';
    span.style.opacity = '1';
  });

  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;

    // Passage au noir sur fond blanc
    const t1 = setTimeout(() => {
      span.style.color = 'black';
      span.style.backgroundColor = 'white';
      span.style.border = 'none';
      span.style.opacity = '1';
    }, delay);
    leaveEffectTimersSend.push(t1);

    // Puis disparition (opacity 0) + fond transparent
    const t2 = setTimeout(() => {
      span.style.opacity = '0';
      span.style.color = '#000000';
      span.style.backgroundColor = 'transparent';
      span.style.border = 'none';
    }, delay + 20);
    leaveEffectTimersSend.push(t2);
  });

  // Reset le flag apparition, puisque l'élément disparaît
  el.isAppeared = false;
}






function clearInputAnimated(id) {
    const input = document.getElementById(id);
    if (!input) return;

    if (input.value.length === 0) return; // ne rien faire si vide

    let text = input.value;
    let index = text.length;

    function deleteChar() {
        if (index <= 0) {
            input.value = ''; // fin
            return;
        }

        index--;
        input.value = text.slice(0, index);

        setTimeout(deleteChar, 20); // vitesse de disparition
    }

    deleteChar();
}

function clearTextareaAnimated(id) {
    const textarea = document.getElementById(id);
    if (!textarea) return;

    if (textarea.value.length === 0) return;

    let lines = textarea.value.split("\n");

    // On calcule le nombre maximum de caractères parmi toutes les lignes
    let maxLength = Math.max(...lines.map(line => line.length));

    let step = 0;

    function deleteStep() {
        if (step >= maxLength) {
            textarea.value = ''; // fin
            return;
        }

        // Supprime le dernier caractère de chaque ligne si possible
        lines = lines.map(line => line.length > 0 ? line.slice(0, -1) : line);

        textarea.value = lines.join("\n");

        step++;
        setTimeout(deleteStep, 20); // vitesse
    }

    deleteStep();
}







function updateCustomCaretPosition(input, caretDiv) {
  const text = input.value;
  const caretPos = input.selectionStart;
  const style = window.getComputedStyle(input);

  const div = document.createElement('div');
  ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'white-space',
   'padding', 'border', 'box-sizing', 'line-height',
   'word-wrap', 'overflow-wrap'].forEach(prop => {
    div.style[prop] = style[prop];
  });

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.width = style.width;
  div.style.height = style.height;
  div.style.overflow = 'auto';

  div.textContent = text.substring(0, caretPos);

  const span = document.createElement('span');
  span.textContent = '|';
  div.appendChild(span);

  document.body.appendChild(div);

  // 🔥 LA LIGNE CRUCIALE
  div.scrollTop = input.scrollTop;
  div.scrollLeft = input.scrollLeft;

  const spanRect = span.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();

  const left = spanRect.left - divRect.left;
  const top = spanRect.top - divRect.top;

  caretDiv.style.left = left + 'px';
  caretDiv.style.top = top + 'px';



  document.body.removeChild(div);


  // 👉 Si le champ n'est pas focus → on ne montre jamais le caret
  if (document.activeElement !== input) {
    caretDiv.style.visibility = 'hidden';
    return;
  }

  // 👉 Si du texte est sélectionné → pas de caret
  if (input.selectionStart !== input.selectionEnd) {
    caretDiv.style.visibility = 'hidden';
    return;
  }

  // Sinon : caret normal
  caretDiv.style.visibility = 'visible';




}




// Pour .object avec caret custom-caret-objet
const containerObjet = document.querySelector('.object');
if (containerObjet) {
  const input = containerObjet.querySelector('input');
  const caretDiv = containerObjet.querySelector('.custom-caret-objet');
  if (input && caretDiv) {
    ['input', 'click', 'keyup', 'keydown'].forEach(eventName => {
      input.addEventListener(eventName, () => {
        setTimeout(() => updateCustomCaretPosition(input, caretDiv), 0);
      });
    });
    updateCustomCaretPosition(input, caretDiv);
  }
}

// Pour .messagerie avec caret custom-caret-message
const containerMessage = document.querySelector('.messagerie');
if (containerMessage) {
  const textarea = containerMessage.querySelector('textarea');
  const caretDiv = containerMessage.querySelector('.custom-caret-message');
  if (textarea && caretDiv) {
    ['input', 'click', 'keyup', 'keydown'].forEach(eventName => {
      textarea.addEventListener(eventName, () => {
        setTimeout(() => updateCustomCaretPosition(textarea, caretDiv), 0);
      });
    });
    updateCustomCaretPosition(textarea, caretDiv);
  }
}





// -----------------------------
// Border rectangle pour .object (responsive)
// -----------------------------
let borderRectangle = null;
let targetRectangle = null; // stocker le champ .object
let resizeObserver = null;

function animateBorderRectangle() {
    const target = document.querySelector('.object');
    if (!target) return;

    targetRectangle = target; // stocker pour collapse
    const input = target.querySelector('input');
    input.style.pointerEvents = 'none';
    target.style.caretColor = 'transparent';

    // Création du border
    const border = document.createElement('div');
    Object.assign(border.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '1px',
        height: '1px',
        border: `1px solid #808080`,
        pointerEvents: 'none',
        boxSizing: 'border-box',
        background: 'transparent',
        transition: `border-color 0.2s ease`,
    });

    target.style.position = target.style.position || 'relative';
    target.appendChild(border);

    border.isAnimated = false;

    // Fonction pour mettre à jour la taille du border
    const updateBorderSize = () => {
        if (!border) return;
        const fullWidth = target.offsetWidth;
        const fullHeight = target.offsetHeight;

        // Animation progressive si ce n'est pas encore animée
        if (!border.isAnimated) {
            border.style.transition = `height 300ms linear, border-color 0.2s ease`;
            border.style.height = fullHeight + 'px';
            setTimeout(() => {
                border.style.transition = `width 300ms linear, border-color 0.2s ease`;
                border.style.width = fullWidth + 'px';
                setTimeout(() => {
                    border.isAnimated = true;
                    input.style.pointerEvents = 'auto';
                }, 300);
            }, 300);
        } else {
            // Mise à jour instantanée pour resize
            border.style.width = fullWidth + 'px';
            border.style.height = fullHeight + 'px';
        }
    };

    // Initialisation de la taille
    updateBorderSize();

    // Observateur pour détecter changement de taille responsive
    if (resizeObserver) resizeObserver.disconnect(); // Déconnecter l'ancien si existant
    resizeObserver = new ResizeObserver(updateBorderSize);
    resizeObserver.observe(target);

    // Focus styling
    target.addEventListener('focusin', () => border.style.borderColor = '#ffffff');
    target.addEventListener('focusout', () => border.style.borderColor = '#808080');

    borderRectangle = border;
    return border;
}

function collapseBorderRectangle() {
    if (!borderRectangle || !borderRectangle.isAnimated) return;

    const border = borderRectangle;
    const duration = 300;

    targetRectangle.querySelector('input').style.pointerEvents = 'none'; // désactiver clic dès le début

    border.style.transition = `width ${duration}ms linear, border-color 0.2s ease`;
    border.style.width = '1px';
    setTimeout(() => {
        border.style.transition = `height ${duration}ms linear, border-color 0.2s ease`;
        border.style.height = '1px';
        setTimeout(() => {
            if (border.parentElement) border.parentElement.removeChild(border);
            borderRectangle = null;
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }, duration);
    }, duration);

    border.isAnimated = false;
}






// -----------------------------
// Border rectangle pour textarea (responsive)
// -----------------------------
let borderTextarea = null;
let targetTextarea = null; // stocker le champ textarea
let resizeObserverTextarea = null;

function animateBorderRectangleTextarea() {
    const target = document.querySelector('.messagerie textarea');
    if (!target) return;

    targetTextarea = target;
    target.style.pointerEvents = 'none';
    target.style.caretColor = 'transparent';

    const border = document.createElement('div');
    Object.assign(border.style, {
        position: 'absolute',
        top: '0', // aligné en haut du parent
        left: '0',
        width: '1px',
        height: '1px',
        border: `1px solid #808080`,
        pointerEvents: 'none',
        boxSizing: 'border-box',
        background: 'transparent',
        transition: `border-color 0.2s ease`,
    });

    const parent = target.parentElement;
    parent.style.position = parent.style.position || 'relative';
    parent.appendChild(border);

    border.isAnimated = false;

    // Fonction pour mettre à jour la taille du border
    const updateBorderSize = () => {
        if (!border) return;

        // On prend la largeur et hauteur réelles du textarea
        const fullWidth = target.offsetWidth;
        const fullHeight = target.offsetHeight;

        if (!border.isAnimated) {
            border.style.transition = `height 300ms linear, border-color 0.2s ease`;
            border.style.height = fullHeight + 'px';
            setTimeout(() => {
                border.style.transition = `width 300ms linear, border-color 0.2s ease`;
                border.style.width = fullWidth + 'px';
                setTimeout(() => {
                    border.isAnimated = true;
                    target.style.pointerEvents = 'auto';
                }, 300);
            }, 300);
        } else {
            // Mise à jour instantanée pour responsive
            border.style.width = fullWidth + 'px';
            border.style.height = fullHeight + 'px';
        }
    };

    // Initialisation
    updateBorderSize();

    // Observer pour responsive
    if (resizeObserverTextarea) resizeObserverTextarea.disconnect();
    resizeObserverTextarea = new ResizeObserver(updateBorderSize);
    resizeObserverTextarea.observe(target);

    // Focus styling
    target.addEventListener('focus', () => border.style.borderColor = '#ffffff');
    target.addEventListener('blur', () => border.style.borderColor = '#808080');

    borderTextarea = border;
    return border;
}

function collapseBorderTextarea() {
    if (!borderTextarea || !borderTextarea.isAnimated) return;
    const border = borderTextarea;
    const duration = 300;

    targetTextarea.style.pointerEvents = 'none';

    border.style.transition = `width ${duration}ms linear, border-color 0.2s ease`;
    border.style.width = '1px';
    setTimeout(() => {
        border.style.transition = `height ${duration}ms linear, border-color 0.2s ease`;
        border.style.height = '1px';
        setTimeout(() => {
            if (border.parentElement) border.parentElement.removeChild(border);
            borderTextarea = null;
            if (resizeObserverTextarea) {
                resizeObserverTextarea.disconnect();
                resizeObserverTextarea = null;
            }
        }, duration);
    }, duration);

    border.isAnimated = false;
}






function runSequentialLeaveEffects() {
  const delayBetween = 200; // délai entre chaque fonction
  let totalDelay = 0;

  const leaveFunctions = [
    () => leaveEffectQuit(),
    () => leaveFakePlaceholder('#placeholder-message'),
    () => clearTextareaAnimated('message'), // ← ajout ici
    () => collapseBorderTextarea(),
    () => leaveFakePlaceholder('#placeholder-objet'),
    () => clearInputAnimated('objet'),        // input
    () => collapseBorderRectangle()
  ];

  leaveFunctions.forEach(fn => {
    setTimeout(() => {
      fn();
    }, totalDelay);

    // Ajuste le délai si besoin
    if (fn === leaveFakePlaceholder) {
      totalDelay += 200; 
    } else {
      totalDelay += delayBetween;
    }
  });
}




function runSequentialAnimations() {
  const delayBetween = 300; // délai entre chaque fonction en ms (ici 0.5 s)
  let totalDelay = 0;

  // Liste des fonctions à exécuter
  const functionsToRun = [
    () => animateBorderRectangle(),
    () => toggleFakePlaceholder('#placeholder-objet'),
    () => animateBorderRectangleTextarea(),
    () => toggleFakePlaceholder('#placeholder-message'),
    () => initQuitAnimations()
  ];

  functionsToRun.forEach(fn => {
    setTimeout(() => {
      fn();
    }, totalDelay);
    totalDelay += delayBetween;
  });
}



runSequentialAnimations();


