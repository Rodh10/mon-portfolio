const textarea = document.querySelector('#message');
const maxLength = 1500; // même valeur que ton maxlength

textarea.addEventListener('keydown', (e) => {
    // Si la longueur du texte est >= maxLength et que ce n'est pas une touche "effacer"
    if (textarea.value.length >= maxLength &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault(); // bloque la saisie
    }
});




/* ===========================
   FORM ANIMATIONS (PLACEHOLDERS ONLY)
   =========================== */

function initFormAnimations() {
    const elements = [
        { el: document.querySelector('#email'), text: 'your_adress' },
        { el: document.querySelector('#objet'), text: 'subject' },
        { el: document.querySelector('#message'), text: 'message' }
    ];

    elements.forEach((item, index) => {
        if (!item.el) return;

        // Container visuel
        const wrapper = document.createElement('div');
        wrapper.classList.add('animated-text');
        wrapper.style.position = 'absolute';
        wrapper.style.pointerEvents = 'none';

        // Positionnement par-dessus input/textarea
        const parent = item.el.parentElement;
        parent.style.position = 'relative';
        parent.appendChild(wrapper);

        // Création spans lettres
        item.text.split('').forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.opacity = '0';
            span.style.color = '#808080';
            wrapper.appendChild(span);
        });

        wrapper.spans = wrapper.querySelectorAll('span');
        wrapper.isVisible = false;
        item.wrapper = wrapper;

        // Apparition différée
        setTimeout(() => appear(wrapper), 200 + index * 150);

        // --- NOUVEAU : faire disparaître le placeholder au focus ---
        item.el.addEventListener('focus', () => {
            disappear(wrapper);
        });

        // Optionnel : réapparition si champ vide au blur
        item.el.addEventListener('blur', () => {
            if (!item.el.value) {
                appear(wrapper);
            }
        });
    });
}


function appear(wrapper) {
    if (wrapper.isVisible) return;
    wrapper.isVisible = true;

    wrapper.spans.forEach((span, i) => {
        const delay = i * 40;

        // t1 → couleur texte noire, background blanc
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.color = 'black';
            span.style.backgroundColor = '#808080';
        }, delay);

        // t2 → couleur texte blanche, background transparent
        setTimeout(() => {
            span.style.color = '#808080';
            span.style.backgroundColor = 'transparent';
        }, delay + 50); // 50ms après t1
    });
}


function disappear(wrapper) {
    if (!wrapper.isVisible) return;
    wrapper.isVisible = false;

    const last = wrapper.spans.length - 1;

    wrapper.spans.forEach((span, i) => {
        const delay = (last - i) * 40;
        setTimeout(() => {
            span.style.opacity = '0';
        }, delay);
    });
}

function leaveFormAnimations() {
    document.querySelectorAll('.animated-text').forEach(wrapper => {
        disappear(wrapper);
    });
}

initFormAnimations();







let leaveEffectTimersQuit = [];

function initQuitAnimations() {
  const el = document.querySelector('#quit');
  if (!el) return;

  const text = el.textContent.trim();
  el.textContent = '';

  // Création des spans
  text.split('').forEach((letter) => {
    const span = document.createElement('span');
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.style.opacity = '0';
    el.appendChild(span);
  });

  el.isAppeared = true;
  const spans = el.querySelectorAll('span');

  // --- Apparition initiale ---
  setTimeout(() => {
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.color = '#000000';
        if (i < 2) {
          span.style.backgroundColor = '#ff0000';
        } else {
          span.style.backgroundColor = '#ffffff';
        }
        span.style.opacity = '1';
      }, i * 100);
    });
  }, 2000);

  // --- Hover effect ---
  let timeouts = [];

  el.addEventListener('mouseenter', () => {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [];
    spans.forEach((span, i) => {
      const t = setTimeout(() => {
        span.style.color = '#000';
        span.style.backgroundColor = '#ff0000';
      }, i * 30);
      timeouts.push(t);
    });
  });

  el.addEventListener('mouseleave', () => {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [];
    const total = spans.length;
    spans.forEach((span, i) => {
      const t = setTimeout(() => {
        span.style.color = '#000';
        span.style.backgroundColor = i < 2 ? '#ff0000' : '#ffffff';
      }, (total - 1 - i) * 30);
      timeouts.push(t);
    });
  });

  // --- Click ---
  el.addEventListener('click', () => {
      leaveEffectQuit();
      leaveFormAnimations();
      collapseBorderField('#email');
      collapseBorderField('#objet');
      collapseBorderField('#message');

      const sendButton = document.querySelector('#send');
      if (sendButton && sendButton.isAppeared) {
          leaveEffectSend();
      }

      // LeaveEffect des textes des champs
      leaveEffectFields();

      // 🔹 Redirection après que toutes les animations soient terminées
      // On estime le délai max des leaveEffects
      const leaveEffectDelays = [];

      // leaveEffectQuit
      if (typeof leaveEffectQuit === 'function') leaveEffectDelays.push(500); // approximatif
      // leaveFormAnimations
      if (typeof leaveFormAnimations === 'function') leaveEffectDelays.push(500); // approximatif
      // collapseBorderField
      leaveEffectDelays.push(600); // pour les 3 champs
      // leaveEffectSend
      if (sendButton && sendButton.isAppeared) leaveEffectDelays.push(500);
      // leaveEffectFields
      leaveEffectDelays.push(500);

      const totalDelay = Math.max(...leaveEffectDelays);

      setTimeout(() => {
          window.location.href = 'index.html';
      }, totalDelay);
  });

}


// --- Leave effect pour Quit ---
function leaveEffectQuit() {
  const el = document.querySelector('#quit');
  if (!el || !el.isAppeared) return;

  leaveEffectTimersQuit.forEach((t) => clearTimeout(t));
  leaveEffectTimersQuit = [];

  const spans = el.querySelectorAll('span');
  const lastIndex = spans.length - 1;

  spans.forEach((span, i) => {
    const delay = (lastIndex - i) * 30;
    const t1 = setTimeout(() => {
      span.style.color = 'transparent';
      span.style.visibility = 'hidden';
    }, delay);
    leaveEffectTimersQuit.push(t1);
  });

  el.isAppeared = false;
}

// --- Initialisation ---
initQuitAnimations();












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












const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

let showCursorTimeout;

// Fonction pour cacher le curseur
function hideCursor() {
  clearTimeout(showCursorTimeout);
  cursor.style.display = 'none';
}

// Fonction pour montrer le curseur après un délai
function delayedShowCursor() {
  showCursorTimeout = setTimeout(() => {
    cursor.style.display = 'block';
  }, 500); // délai avant affichage
}

// Sélecteur de tous les champs de formulaire
const champs = document.querySelectorAll('.input-field input, .input-field textarea');

// Effet blink pour les champs
champs.forEach(champ => {
  champ.addEventListener('mouseenter', () => {
    hideCursor();
  });

  champ.addEventListener('mouseleave', () => {
    delayedShowCursor();
  });
});

// Sélecteur de tous les boutons
const boutons = document.querySelectorAll('#quit, #send');

boutons.forEach(bouton => {
  bouton.addEventListener('mouseenter', () => {
    // Pour le bouton Submit, vérifier s'il est activé/apparu
    if (bouton.id === 'send' && (!bouton.isAppeared)) return;
    hideCursor();
  });

  bouton.addEventListener('mouseleave', () => {
    if (bouton.id === 'send' && (!bouton.isAppeared)) return;
    delayedShowCursor();
  });
});

// Navigation générale du curseur sur la page
document.body.addEventListener('mousemove', (e) => {
  cursor.style.left = e.pageX + 'px';
  cursor.style.top = e.pageY + 'px';
});










const leaveEffectTimersFields = [];

function leaveEffectFields() {
  const fields = document.querySelectorAll('#email, #objet, #message');

  fields.forEach(field => {
    if (!field.value.trim()) return;

    const rect = field.getBoundingClientRect();
    const style = window.getComputedStyle(field);

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = rect.left + 'px';
    overlay.style.top = rect.top + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    overlay.style.font = style.font;
    overlay.style.lineHeight = style.lineHeight;
    overlay.style.padding = style.padding;
    overlay.style.color = '#000';
    overlay.style.whiteSpace = 'pre-wrap';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // Découpe par lignes
    const lines = field.value.split('\n');
    const lineSpans = [];

    lines.forEach((line, lineIndex) => {
      const lineDiv = document.createElement('div');
      overlay.appendChild(lineDiv);

      const spans = [];

      [...line].forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.color = '#808080';
        span.style.backgroundColor = 'transparent';
        span.style.opacity = '1';
        lineDiv.appendChild(span);
        spans.push(span);
      });

      lineSpans.push(spans);
    });

    field.style.opacity = '0';

    // Animation par ligne (toutes démarrent ensemble)
    lineSpans.forEach(spans => {
      const last = spans.length - 1;

      spans.forEach((span, i) => {
        const delay = (last - i) * 30;

        const t1 = setTimeout(() => {
          span.style.color = '#000';
          span.style.backgroundColor = '#ffffff';
        }, delay);
        leaveEffectTimersFields.push(t1);

        const t2 = setTimeout(() => {
          span.style.opacity = '0';
          span.style.backgroundColor = 'transparent';
        }, delay + 20);
        leaveEffectTimersFields.push(t2);
      });
    });

    // Cleanup
    const maxLineLength = Math.max(...lineSpans.map(l => l.length));
    const totalTime = maxLineLength * 30 + 100;

    setTimeout(() => {
      overlay.remove();
    }, totalTime);
  });
}




// -----------------------------
// BORDERS RECTANGLES GENERIQUES
// -----------------------------
const borders = {}; // stocke border, target et resizeObserver pour chaque champ

function animateBorderRectangleField(fieldSelector) {
    const target = document.querySelector(fieldSelector);
    if (!target) return;

    // Si déjà animé pour ce champ, ne rien faire
    if (borders[fieldSelector]?.border) return;

    target.style.pointerEvents = 'none';
    target.style.caretColor = 'white';

    const border = document.createElement('div');
    Object.assign(border.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '1px',
        height: '1px',
        border: '1px solid #808080',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        background: 'transparent',
        transition: 'border-color 0.2s ease',
        zIndex: '10',
    });

    const parent = target.parentElement;
    parent.style.position = 'relative';
    parent.style.overflow = 'visible';
    parent.appendChild(border);

    border.isAnimated = false;

    const updateBorderSize = () => {
        const rect = target.getBoundingClientRect();
        const fullWidth = rect.width;
        const fullHeight = rect.height;

        if (!border.isAnimated) {
            border.style.transition = 'height 300ms linear, border-color 0.2s ease';
            border.style.height = fullHeight + 'px';
            setTimeout(() => {
                border.style.transition = 'width 300ms linear, border-color 0.2s ease';
                border.style.width = fullWidth + 'px';
                setTimeout(() => {
                    border.isAnimated = true;
                    target.style.pointerEvents = 'auto';
                }, 300);
            }, 300);
        } else {
            border.style.width = fullWidth + 'px';
            border.style.height = fullHeight + 'px';
        }
    };

    updateBorderSize();

    // ResizeObserver
    if (borders[fieldSelector]?.resizeObserver) {
        borders[fieldSelector].resizeObserver.disconnect();
    }
    const resizeObserver = new ResizeObserver(updateBorderSize);
    resizeObserver.observe(target);

    // Focus / Blur
    target.addEventListener('focus', () => border.style.borderColor = '#ffffff');
    target.addEventListener('blur', () => border.style.borderColor = '#808080');

    // Stockage dans l'objet global
    borders[fieldSelector] = { border, target, resizeObserver };
    return border;
}

function collapseBorderField(fieldSelector) {
    const data = borders[fieldSelector];
    if (!data || !data.border || !data.border.isAnimated) return;

    const { border, target, resizeObserver } = data;
    const duration = 300;

    target.style.pointerEvents = 'none';

    border.style.transition = `width ${duration}ms linear, border-color 0.2s ease`;
    border.style.width = '1px';
    setTimeout(() => {
        border.style.transition = `height ${duration}ms linear, border-color 0.2s ease`;
        border.style.height = '1px';
        setTimeout(() => {
            if (border.parentElement) border.parentElement.removeChild(border);
            delete borders[fieldSelector];
            if (resizeObserver) resizeObserver.disconnect();
        }, duration);
    }, duration);

    border.isAnimated = false;
}



animateBorderRectangleField('#email');
animateBorderRectangleField('#objet');
animateBorderRectangleField('#message');






















/* ===========================
   BOUTON SEND ANIMATIONS + FORMSPREE
   =========================== */

function initSendAnimations() {
    const el = document.querySelector('#send');
    if (!el) return;

    const text = el.textContent.trim();
    el.textContent = '';

    // Crée les spans pour chaque lettre
    text.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        el.appendChild(span);
    });

    const spans = el.querySelectorAll('span');
    el.isActive = false; // état visible du bouton

    function appearSend() {
        if (el.isActive) return;
        el.isActive = true;
        el.style.pointerEvents = 'auto';

        spans.forEach((span, i) => {
            const delay = i * 30;
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.color = 'black';
                span.style.backgroundColor = '#808080';
            }, delay);
            setTimeout(() => {
                span.style.color = '#808080';
                span.style.backgroundColor = 'transparent';
            }, delay + 50);
        });
    }

    function disappearSend() {
        if (!el.isActive) return;
        el.isActive = false;

        const last = spans.length - 1;
        spans.forEach((span, i) => {
            const delay = (last - i) * 30;
            setTimeout(() => {
                span.style.opacity = '0';
            }, delay);
        });

        setTimeout(() => {
            el.style.pointerEvents = 'none';
        }, (last + 1) * 30 + 50);
    }

    // Hover effects
    el.addEventListener('mouseenter', () => {
        if (!el.isActive) return;
        spans.forEach((span, i) => {
            setTimeout(() => {
                span.style.color = 'black';
                span.style.backgroundColor = '#e0e0e0';
            }, i * 30);
        });
    });

    el.addEventListener('mouseleave', () => {
        if (!el.isActive) return;
        const last = spans.length - 1;
        spans.forEach((span, i) => {
            const delay = (last - i) * 30;
            setTimeout(() => {
                span.style.color = '#808080';
                span.style.backgroundColor = 'transparent';
            }, delay);
        });
    });

    // Récupération des champs
    const emailInput = document.querySelector('#email');
    const objetInput = document.querySelector('#objet');
    const messageInput = document.querySelector('#message');
    const inputs = [emailInput, objetInput, messageInput];

    // Surveille les champs pour afficher/disparaitre le bouton
    inputs.forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            if (inputs.some(i => i.value.trim() !== '')) {
                appearSend();
            } else {
                disappearSend();
            }
        });
    });

    // ========== FORMSPREE SEND ==========
    el.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const objet = objetInput.value.trim();
        const message = messageInput.value.trim();

        if (!email || !objet || !message) {
            alert("Merci de remplir tous les champs !");
            return;
        }

        el.style.pointerEvents = 'none';

        try {
            const response = await fetch("https://formspree.io/f/xqeeeava", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    subject: objet,
                    message: message
                })
            });

            if (response.ok) {
                showCustomAlert("Message envoyé !");
                emailInput.value = "";
                objetInput.value = "";
                messageInput.value = "";
                disappearSend();
            } else {
                showCustomAlert("Erreur lors de l'envoi.");
            }
            
        } catch (err) {
            console.error(err);
            alert("Erreur réseau.");
        } finally {
            if (inputs.some(i => i.value.trim() !== '')) {
                el.style.pointerEvents = 'auto';
            }
        }
    });
}

// Gestion de l’effet "leave" du bouton
let leaveEffectSendTimers = [];

function leaveEffectSend() {
    const el = document.querySelector('#send');
    if (!el || !el.isActive) return;

    leaveEffectSendTimers.forEach(t => clearTimeout(t));
    leaveEffectSendTimers = [];

    const spans = el.querySelectorAll('span');
    if (!spans.length) return;

    const lastIndex = spans.length - 1;

    spans.forEach((span, i) => {
        const delay = (lastIndex - i) * 30;

        const t1 = setTimeout(() => {
            span.style.color = 'black';
            span.style.backgroundColor = 'white';
        }, delay);

        const t2 = setTimeout(() => {
            span.style.opacity = '0';
        }, delay + 20);

        leaveEffectSendTimers.push(t1, t2);
    });

    setTimeout(() => {
        el.style.pointerEvents = 'none';
    }, (lastIndex + 1) * 30 + 20);

    el.isActive = false;
}

// Initialisation
initSendAnimations();




function showCustomAlert(message) {
    // Crée le conteneur si pas déjà présent
    let alertBox = document.getElementById('custom-alert');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'custom-alert';
        alertBox.classList.add('custom-alert'); // <-- classe CSS à personnaliser
        document.body.appendChild(alertBox);
    }

    // Vide le contenu existant
    alertBox.innerHTML = '';

    // Texte
    const alertText = document.createElement('div');
    alertText.classList.add('custom-alert-text'); // span letters styling
    alertBox.appendChild(alertText);

    message.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.classList.add('custom-alert-letter'); // <-- animation cmd
        alertText.appendChild(span);
    });

    // Bouton OK
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('custom-alert-ok'); // <-- style bouton via CSS
    alertBox.appendChild(okButton);

    const spans = alertText.querySelectorAll('span');
    alertBox.style.display = 'block';
    alertBox.style.pointerEvents = 'none';

    // Animation type "cmd" (apparition)
    spans.forEach((span, i) => {
        setTimeout(() => {
            span.classList.add('appear'); // <-- gère apparition via CSS
        }, i * 30);
        setTimeout(() => {
            span.classList.add('after'); // <-- gère couleur après apparition
        }, i * 30 + 50);
    });

    setTimeout(() => {
        alertBox.style.pointerEvents = 'auto';
    }, spans.length * 30 + 50);

    // Clique sur OK → disparition
    okButton.onclick = () => {
        const lastIndex = spans.length - 1;
        spans.forEach((span, i) => {
            const delay = (lastIndex - i) * 30;
            setTimeout(() => {
                span.classList.remove('appear', 'after');
                span.classList.add('disappear'); // <-- disparition via CSS
            }, delay);
        });

        setTimeout(() => {
            alertBox.style.display = 'none';
            spans.forEach(s => s.classList.remove('disappear'));
        }, lastIndex * 30 + 50);
    };
}

