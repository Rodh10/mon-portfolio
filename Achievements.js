



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

if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
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

// === DISPARITION DES PARTICULES ===
const particleLeavePromise =
  window.innerWidth <= 600 && window.leaveMobilePage
    ? window.leaveMobilePage()
    : window.innerWidth > 600 && window.leaveDesktopPage
      ? window.leaveDesktopPage()
      : Promise.resolve();

// === AUTRES ANIMATIONS DE DISPARITION ===
await Promise.all([
  particleLeavePromise,
  leaveAllEffects()
]);

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
        span.style.backgroundColor = "#FF0000";
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

    /* ==========================
       POSITION INITIALE DU DOIGT
    ========================== */

    let startY = 0;


    /* ==========================
       RETOUR VERS PROFILE.HTML
    ========================== */

    async function handleScrollUp() {

        if (scrollCooldown) return;

        scrollCooldown = true;


        /* ==========================
           DISPARITION MOBILE
        ========================== */

        const mobileLeavePromise =
            window.innerWidth <= 600 && window.leaveMobilePage
                ? window.leaveMobilePage()
                : Promise.resolve();


        /* ==========================
           DISPARITION DESKTOP
        ========================== */

        const desktopLeavePromise =
            window.innerWidth > 600 && window.leaveDesktopPage
                ? window.leaveDesktopPage()
                : Promise.resolve();


        /* ==========================
           AUTRES EFFETS
        ========================== */

        await leaveAllEffects();


        /* ==========================
           ATTENDRE LES ANIMATIONS
        ========================== */

        await Promise.all([
            mobileLeavePromise,
            desktopLeavePromise
        ]);


        /* ==========================
           CHANGER DE PAGE
        ========================== */

        window.location.href = "Profile.html";
    }


    /* ==========================
       SCROLL SOURIS
    ========================== */

    window.addEventListener("wheel", async (e) => {

        if (scrollCooldown) return;


        /* ==========================
           MOBILE
           Le wheel est ignoré
        ========================== */

        if (window.innerWidth <= 600) {
            return;
        }


        /* ==========================
           IGNORER INPUT / TEXTAREA
        ========================== */

        const activeEl = document.activeElement;

        if (
            activeEl &&
            (
                activeEl.tagName === "INPUT" ||
                activeEl.tagName === "TEXTAREA"
            )
        ) {
            return;
        }


        /* ==========================
           SCROLL VERS LE BAS
           → CHANGER DE GRILLE
        ========================== */

        if (e.deltaY > 0) {

            if (
                currentDesktopSection === 1 &&
                !desktopSectionTransitioning
            ) {
                changeDesktopSection();
            }

            return;
        }


        /* ==========================
           SCROLL VERS LE HAUT
           → CHANGER DE FENÊTRE
        ========================== */

        if (e.deltaY < 0) {

            handleScrollUp();

        }

    });


    /* ==========================
       MOBILE : SWIPE
    ========================== */

    window.addEventListener("touchstart", (e) => {

        if (scrollCooldown) return;

        startY = e.touches[0].clientY;

    });


    window.addEventListener("touchend", (e) => {

        if (scrollCooldown) return;


        const endY = e.changedTouches[0].clientY;

        const diff = startY - endY;


        /* ==========================
           SWIPE VERS LE BAS
           doigt vers le bas
           → retour vers Profile
        ========================== */

        if (diff < -50) {

            handleScrollUp();

        }


        /*
           Swipe vers le haut :
           → scroll vers le bas
           → volontairement ignoré
        */

    });

});
























/* ============================================================
   PROMISE POUR LES ANIMATIONS DE DISPARITION
   ============================================================ */

function leaveAllEffects() {
  return new Promise(resolve => {

    animateOldActiveLeaveWheel();

    // délai = durée totale estimée des animations
    setTimeout(resolve, 1000);
  });
}

window.addEventListener("DOMContentLoaded", enhanceNavLinks);











































import * as THREE from 'three';


const dashboard =
    document.querySelector('.dashboard');

const imageContainer =
    document.querySelector('.dashboard-images');

const sourceImages =
    Array.from(
        imageContainer.querySelectorAll('img')
    );

const IMAGES_PER_SECTION = 6;

let sections = [];
let boxes = [];

let loadedBoxes = 0;
let currentDesktopSection = 1;
let desktopSectionTransitioning = false;




function createDashboardSections() {

    const totalSections =
        Math.ceil(
            sourceImages.length /
            IMAGES_PER_SECTION
        );


    for (
        let sectionIndex = 0;
        sectionIndex < totalSections;
        sectionIndex++
    ) {

        const section =
            document.createElement('div');


        section.className =
            `dashboard-section section-${String(sectionIndex + 1).padStart(2, '0')}`;


        if (sectionIndex === 0) {

            section.classList.add(
                'active-section'
            );

        }


        const start =
            sectionIndex *
            IMAGES_PER_SECTION;


        const end =
            Math.min(
                start + IMAGES_PER_SECTION,
                sourceImages.length
            );


        for (
            let imageIndex = start;
            imageIndex < end;
            imageIndex++
        ) {

            const sourceImage =
                sourceImages[imageIndex];


            const sourceLink = sourceImage.closest('a[href]');

            const box = document.createElement(sourceLink ? 'a' : 'div');

            if (sourceLink) {
                box.setAttribute('href', sourceLink.getAttribute('href'));

                if (sourceLink.hasAttribute('target')) {
                    box.setAttribute('target', sourceLink.getAttribute('target'));
                }

                if (sourceLink.hasAttribute('rel')) {
                    box.setAttribute('rel', sourceLink.getAttribute('rel'));
                }
            }

            box.className =
                `box box-${String(imageIndex + 1).padStart(2, '0')}`;


            if (sourceLink) {
                box.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const href = box.getAttribute('href')?.trim();
                    if (!href || dashboard.dataset.leaving === 'true') return;

                    dashboard.dataset.leaving = 'true';

                    try {
                        // Même sortie des particules que par défilement.
                        const mobileLeavePromise =
                            window.innerWidth <= 600 && window.leaveMobilePage
                                ? window.leaveMobilePage()
                                : Promise.resolve();

                        const desktopLeavePromise =
                            window.innerWidth > 600 && window.leaveDesktopPage
                                ? window.leaveDesktopPage()
                                : Promise.resolve();

                        // Titres, ancien menu actif et année.
                        await leaveAllEffects();

                        // Attendre aussi la disparition des particules.
                        await Promise.all([
                            mobileLeavePromise,
                            desktopLeavePromise
                        ]);

                        window.location.assign(href);
                    } catch (error) {
                        delete dashboard.dataset.leaving;
                        console.error('Erreur pendant la sortie :', error);
                    }
                });
            }




            const image =
                sourceImage.cloneNode(true);


            image.style.opacity = '0';
            image.style.visibility = 'hidden';


            const canvas =
                document.createElement('canvas');

            canvas.className =
                'particle-canvas';


            const title = document.createElement('div');

            title.className = 'box-title';
            title.textContent =
                sourceImage.dataset.title || sourceImage.alt || '';

            box.appendChild(image);
            box.appendChild(canvas);
            box.appendChild(title);

            section.appendChild(box);

            boxes.push(box);

        }


        dashboard.appendChild(section);

        sections.push(section);

    }


    imageContainer.remove();
}

createDashboardSections();


// === Anti-blink sur les images particules ===
boxes.forEach(box => {
    box.addEventListener('mouseenter', hideCursor);
    box.addEventListener('mouseleave', delayedShowCursor);
});


// === Rafraîchir le site au retour (bouton précédent / redirection) ===
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // La page a été restaurée depuis le cache : on la recharge
        // pour relancer toutes les animations à l'état initial.
        window.location.reload();
    }
});



/* =========================
   ANIMATION DES TITRES
   PILOTÉE PAR THREE.JS
   ========================= */

function animateTitles(deltaTime) {

    boxes.forEach(box => {

        const title = box.querySelector('.box-title');

        if (!title) return;

        // État initial de chaque titre
        if (!title.userData) {
            title.userData = {
                opacity: 0,
                translateY: 20
            };
        }

        const state = title.userData;

        // Cible selon le survol
        const isHovered = box.matches(':hover');
        
        const canvas = box.querySelector('.particle-canvas');

        if (canvas) {
            canvas.style.position = canvas.style.position || 'absolute';
            canvas.style.zIndex = isHovered ? '3' : '1';
        }

        title.style.zIndex = isHovered ? '1' : '3';




        const targetOpacity = isHovered ? 1 : 0;
        const targetY = isHovered ? 0 : 20;

        // Progression indépendante du nombre d'images par seconde
        const progress = 1 - Math.exp(-deltaTime / 100);

        state.opacity +=
            (targetOpacity - state.opacity) * progress;

        state.translateY +=
            (targetY - state.translateY) * progress;

        // Application des valeurs animées
        title.style.opacity = state.opacity;

        title.style.transform =
            `translateY(${state.translateY}%)`;

    });
}










/* ==========================
    CONFIGURATION
========================== */

const columns = 7;
const rows = 7;

const gap = 0;

function resize(box, renderer) {

    const canvas =
        box.querySelector('.particle-canvas');

    if (!canvas) return;

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    if (!width || !height) return;

    renderer.setSize(
        width,
        height,
        false
    );

}

/* ==========================
    APPARITION
========================== */

function startAppearance(squares) {

    squares.forEach((square) => {

        square.userData.appearOpacity = 0;

        square.material.opacity = 0;

        square.userData.appearDelay =
            1000 + Math.random() * 1000;

        square.userData.appearing = true;

        square.userData.disappearing = false;

    });

}


/* ==========================
    DISPARITION
========================== */

function startDisappearance(squares) {

    squares.forEach((square) => {

        square.userData.disappearOpacity = 1;

        square.material.opacity = 1;

        square.userData.disappearDelay =
            Math.random() * 500;

        square.userData.disappearing = true;

        square.userData.appearing = false;

    });

}


function leaveDesktopPage() {

    if (window.innerWidth <= 600) {
        return Promise.resolve();
    }

    boxes.forEach((box) => {

        const canvas =
            box.querySelector('.particle-canvas');

        if (!canvas || !canvas.userData?.squares) {
            return;
        }

        const squares =
            canvas.userData.squares;

        squares.forEach((square) => {

            square.userData.autoBorder = false;
            square.userData.autoWhite = false;

        });

        startDisappearance(squares);

    });

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve();
        }, 1500);

    });

}

window.leaveDesktopPage = leaveDesktopPage;

function changeDesktopSection() {

    if (window.innerWidth <= 600) {
        return;
    }

    if (desktopSectionTransitioning) {
        return;
    }

    /* ==========================
        VÉRIFIER S'IL EXISTE
        UNE SECTION SUIVANTE
    ========================== */

    if (
        currentDesktopSection >=
        sections.length
    ) {
        return;
    }


    desktopSectionTransitioning = true;


    /* ==========================
        SECTION ACTUELLE
    ========================== */

    const currentSection =
        sections[
            currentDesktopSection - 1
        ];


    const currentBoxes =
        Array.from(
            currentSection.querySelectorAll('.box')
        );


    /* ==========================
        DISPARITION
    ========================== */

    currentBoxes.forEach((box) => {

        const canvas =
            box.querySelector(
                '.particle-canvas'
            );


        if (
            !canvas ||
            !canvas.userData?.squares
        ) {
            return;
        }


        const squares =
            canvas.userData.squares;


        squares.forEach((square) => {

            square.userData.autoBorder = false;
            square.userData.autoWhite = false;

        });


        startDisappearance(
            squares
        );

    });


    /* ==========================
        ATTENDRE 1.5 SEC
    ========================== */

    setTimeout(() => {


        /* ==========================
            CACHER SECTION ACTUELLE
        ========================== */

        currentSection.style.visibility =
            'hidden';


        currentSection.style.pointerEvents =
            'none';


        /* ==========================
            SECTION SUIVANTE
        ========================== */

        const nextSection =
            sections[
                currentDesktopSection
            ];


        nextSection.style.visibility =
            'visible';


        nextSection.style.pointerEvents =
            'none';


        /* ==========================
            BOXES SECTION SUIVANTE
        ========================== */

        const nextBoxes =
            Array.from(
                nextSection.querySelectorAll('.box')
            );


        /* ==========================
            APPARITION
        ========================== */

        nextBoxes.forEach((box) => {

            box.style.pointerEvents = 'auto';


            const canvas =
                box.querySelector(
                    '.particle-canvas'
                );


            if (
                !canvas ||
                !canvas.userData?.squares
            ) {
                return;
            }


            if (
                canvas.userData.renderer
            ) {

                resize(
                    box,
                    canvas.userData.renderer
                );

            }


            startAppearance(
                canvas.userData.squares
            );

        });


        /* ==========================
            PASSER À LA SECTION SUIVANTE
        ========================== */

        currentDesktopSection++;


        desktopSectionTransitioning =
            false;


    }, 500);

}


/* ==========================
    BOUCLE MOBILE + SWIPE
========================== */

function startMobileLoop() {

    if (window.innerWidth > 600) {
        return;
    }


    const mobileBoxes =
        Array.from(boxes);


    let currentIndex = 0;

    let isTransitioning = false;
    let isLeaving = false;

    /* ==========================
        TOUCH
    ========================== */

    let touchStartX = 0;
    let touchEndX = 0;

    const swipeThreshold = 50;


    /* ==========================
        TIMERS
    ========================== */

    let disappearanceTimeout = null;

    let autoChangeTimeout = null;

    let reactionTimer = null;

    let reactionMoveTimer = null;

    let autoReactionTimeout = null;


    /* ==========================
        NETTOYAGE DES TIMERS
    ========================== */

    function clearMobileTimers() {

        if (disappearanceTimeout !== null) {

            clearTimeout(
                disappearanceTimeout
            );

            disappearanceTimeout = null;

        }


        if (autoChangeTimeout !== null) {

            clearTimeout(
                autoChangeTimeout
            );

            autoChangeTimeout = null;

        }


        if (autoReactionTimeout !== null) {

            clearTimeout(
                autoReactionTimeout
            );

            autoReactionTimeout = null;

        }


        if (reactionTimer !== null) {

            clearInterval(
                reactionTimer
            );

            reactionTimer = null;

        }


        if (reactionMoveTimer !== null) {

            clearInterval(
                reactionMoveTimer
            );

            reactionMoveTimer = null;

        }

    }



    /* ==========================
        QUITTER LA PAGE
    ========================== */

    function leaveMobilePage() {

        if (isLeaving) {
            return Promise.resolve();
        }


        isLeaving = true;


        /* ==========================
            NETTOYER LES TIMERS
        ========================== */

        clearMobileTimers();


        /* ==========================
            IMAGE ACTUELLE
        ========================== */

        const currentBox =
            mobileBoxes[currentIndex];


        const currentCanvas =
            currentBox.querySelector(
                '.particle-canvas'
            );


        const currentSquares =
            currentCanvas.userData.squares;


        /* ==========================
            DÉSACTIVER LES EFFETS
        ========================== */

        currentSquares.forEach((square) => {

            square.userData.autoBorder = false;

            square.userData.autoWhite = false;

        });


        /* ==========================
            DISPARITION
        ========================== */

        startDisappearance(
            currentSquares
        );


        /* ==========================
            ATTENDRE LA FIN
        ========================== */

        return new Promise((resolve) => {

            setTimeout(() => {

                resolve();

            }, 1500);

        });

    }


    window.leaveMobilePage =
        leaveMobilePage;


    /* ==========================
        CHANGER D'IMAGE
    ========================== */

    function changeImage(direction) {

        if (isTransitioning) {
            return;
        }


        isTransitioning = true;


        /* ==========================
            NETTOYER ANCIENS TIMERS
        ========================== */

        clearMobileTimers();


        /* ==========================
            IMAGE ACTUELLE
        ========================== */

        const currentBox =
            mobileBoxes[currentIndex];


        const currentCanvas =
            currentBox.querySelector(
                '.particle-canvas'
            );


        const currentSquares =
            currentCanvas.userData.squares;


        /* ==========================
            DÉSACTIVER RÉACTION
        ========================== */

        currentSquares.forEach((square) => {

            square.userData.autoBorder = false;

            square.userData.autoWhite = false;

        });


        /* ==========================
            DISPARITION
        ========================== */

        startDisappearance(
            currentSquares
        );


        /* ==========================
            ATTENDRE LA DISPARITION
        ========================== */

        disappearanceTimeout =
            setTimeout(() => {

                disappearanceTimeout = null;


                /* ==========================
                    NOUVEL INDEX
                ========================== */

                currentIndex =
                    (
                        currentIndex +
                        direction +
                        mobileBoxes.length
                    ) %
                    mobileBoxes.length;


                /* ==========================
                    NOUVELLE IMAGE ACTIVE
                ========================== */

                showNextBox();


            }, 1500);

    }


    /* ==========================
        AFFICHER IMAGE ACTIVE
    ========================== */

    function showNextBox() {

        /* ==========================
            NETTOYER LES ANCIENS TIMERS
        ========================== */

        clearMobileTimers();


        /* ==========================
            CACHER TOUTES LES BOXES
        ========================== */

        mobileBoxes.forEach((box) => {

            box.style.display = 'none';

        });


        /* ==========================
            BOX ACTUELLE
        ========================== */

        const box =
            mobileBoxes[currentIndex];


        box.style.display = '';


        const canvas =
            box.querySelector(
                '.particle-canvas'
            );


        const squares =
            canvas.userData.squares;


        /* ==========================
            IMAGE MAINTENANT ACTIVE
        ========================== */

        isTransitioning = false;


        /* ==========================
            APPARITION
        ========================== */

        startAppearance(
            squares
        );


        /* ==========================
            RÉACTION AUTOMATIQUE
        ========================== */

        let autoReactionActive = false;

        let autoReactionX = 0;
        let autoReactionY = 0;


        /* ==========================
            DÉPLACEMENT AUTOMATIQUE
        ========================== */

        reactionTimer =
            setInterval(() => {

                if (!autoReactionActive) {
                    return;
                }


                updateAutoReaction(
                    squares,
                    2 / columns,
                    2 / rows,
                    autoReactionX,
                    autoReactionY
                );

            }, 16);


        /* ==========================
            ACTIVER LA RÉACTION
        ========================== */

        autoReactionTimeout =
            setTimeout(() => {

                autoReactionTimeout = null;


                if (isTransitioning) {
                    return;
                }


                autoReactionActive = true;


                /* ==========================
                    POSITION ALÉATOIRE
                ========================== */

                autoReactionX =
                    -0.8 +
                    Math.random() * 1.6;

                autoReactionY =
                    -0.8 +
                    Math.random() * 1.6;


            }, 3000);


        /* ==========================
            CHANGER DE POSITION
        ========================== */

        reactionMoveTimer =
            setInterval(() => {

                if (!autoReactionActive) {
                    return;
                }


                autoReactionX =
                    -0.8 +
                    Math.random() * 1.6;

                autoReactionY =
                    -0.8 +
                    Math.random() * 1.6;

            }, 2500);


        /* ==========================
            CHANGEMENT AUTOMATIQUE
            APRÈS 20 SEC
        ========================== */

        autoChangeTimeout =
            setTimeout(() => {

                autoChangeTimeout = null;


                if (isTransitioning) {
                    return;
                }


                isTransitioning = true;


                /* ==========================
                    ARRÊTER RÉACTION
                ========================== */

                clearInterval(
                    reactionTimer
                );

                reactionTimer = null;


                clearInterval(
                    reactionMoveTimer
                );

                reactionMoveTimer = null;


                if (autoReactionTimeout !== null) {

                    clearTimeout(
                        autoReactionTimeout
                    );

                    autoReactionTimeout = null;

                }


                autoReactionActive = false;


                /* ==========================
                    DÉSACTIVER EFFETS AUTO
                ========================== */

                squares.forEach((square) => {

                    square.userData.autoBorder = false;

                    square.userData.autoWhite = false;

                });


                /* ==========================
                    DISPARITION
                ========================== */

                startDisappearance(
                    squares
                );


                /* ==========================
                    ATTENDRE LA DISPARITION
                ========================== */

                disappearanceTimeout =
                    setTimeout(() => {

                        disappearanceTimeout = null;


                        /* ==========================
                            ORDRE NATUREL
                        ========================== */

                        currentIndex =
                            (
                                currentIndex + 1
                            ) %
                            mobileBoxes.length;


                        /* ==========================
                            NOUVELLE IMAGE ACTIVE
                        ========================== */

                        showNextBox();


                    }, 1500);


            }, 20000);

    }


    /* ==========================
        SWIPE START
    ========================== */

    function handleTouchStart(event) {

        if (isTransitioning) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

    }


    /* ==========================
        SWIPE END
    ========================== */

    function handleTouchEnd(event) {

        if (isTransitioning) {
            return;
        }


        touchEndX =
            event.changedTouches[0].clientX;


        const distance =
            touchEndX -
            touchStartX;


        /* ==========================
            PAS ASSEZ LONG
        ========================== */

        if (
            Math.abs(distance) <
            swipeThreshold
        ) {

            return;

        }


        /* ==========================
            GAUCHE → DROITE
            IMAGE PRÉCÉDENTE
        ========================== */

        if (distance > 0) {

            changeImage(-1);

        }


        /* ==========================
            DROITE → GAUCHE
            IMAGE SUIVANTE
        ========================== */

        else {

            changeImage(1);

        }

    }


    /* ==========================
        ÉCOUTE DU SWIPE
    ========================== */

    mobileBoxes.forEach((box) => {

        box.addEventListener(
            'touchstart',
            handleTouchStart,
            {
                passive: true
            }
        );


        box.addEventListener(
            'touchend',
            handleTouchEnd,
            {
                passive: true
            }
        );

    });


    /* ==========================
        PREMIÈRE IMAGE
    ========================== */

    showNextBox();

}


/* ==========================
    CRÉATION DES CARRÉS
========================== */

function createSquares(
    scene,
    texture,
    cellWidth,
    cellHeight
) {

    const squares = [];


    for (let y = 0; y < rows; y++) {

        for (let x = 0; x < columns; x++) {


            /* ==========================
                GÉOMÉTRIE
            ========================== */

            const geometry =
                new THREE.PlaneGeometry(
                    cellWidth - gap,
                    cellHeight - gap
                );


            /* ==========================
                PORTION DE L'IMAGE
            ========================== */

            const u1 = x / columns;
            const u2 = (x + 1) / columns;

            const v1 = y / rows;
            const v2 = (y + 1) / rows;


            const uv =
                geometry.attributes.uv;

            uv.setXY(0, u1, v1);
            uv.setXY(1, u2, v1);
            uv.setXY(2, u1, v2);
            uv.setXY(3, u2, v2);

            uv.needsUpdate = true;


            /* ==========================
                MATÉRIAU
            ========================== */

            const material =
                new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0
                });


            /* ==========================
                CARRÉ
            ========================== */

            const square =
                new THREE.Mesh(
                    geometry,
                    material
                );


            /* ==========================
                POSITION INITIALE
            ========================== */

            square.position.x =
                -1 +
                cellWidth / 2 +
                x * cellWidth;

            square.position.y =
                1 -
                cellHeight / 2 -
                y * cellHeight;


            /* ==========================
                DONNÉES DU CARRÉ
            ========================== */

            square.userData.originalX =
                square.position.x;

            square.userData.originalY =
                square.position.y;

            square.userData.randomSize =
                0.7 + Math.random() * 0.6;


            square.userData.appearOpacity = 0;

            square.userData.appearTarget = 0;

            square.userData.appearDelay =
                1000 + Math.random() * 1000;

            square.userData.appearing = true;


            square.userData.disappearOpacity = 1;

            square.userData.disappearDelay = 0;

            square.userData.disappearing = false;


            /* ==========================
                OVERLAY BLANC
            ========================== */

            const overlayMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false
                });


            const overlay =
                new THREE.Mesh(
                    geometry.clone(),
                    overlayMaterial
                );


            overlay.position.copy(
                square.position
            );


            overlay.userData.targetOpacity = 0;

            overlay.userData.nextBlink =
                Math.random() * 500;

            overlay.userData.blinking = false;

            overlay.userData.blinkTimer = 0;


            scene.add(overlay);


            square.userData.overlay =
                overlay;


            /* ==========================
                BORDURE BLANCHE
            ========================== */

            const borderMaterial =
                new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 1
                });


            const borderGeometry =
                new THREE.EdgesGeometry(
                    geometry.clone()
                );


            const border =
                new THREE.LineSegments(
                    borderGeometry,
                    borderMaterial
                );


            border.position.copy(
                square.position
            );


            border.visible = false;


            scene.add(border);


            square.userData.border =
                border;

            square.userData.borderBlinking =
                false;

            square.userData.borderTimer =
                0;

            square.userData.borderNextBlink =
                Math.random() * 500;

            square.userData.autoBorder = false;
            square.userData.autoWhite = false;
            /* ==========================
                AJOUT DE LA SCÈNE
            ========================== */

            scene.add(square);

            squares.push(square);

        }

    }


    return squares;

}


/* ==========================
    RÉACTION HOVER
========================== */

function setupHoverReaction(
    box,
    squares,
    cellWidth,
    cellHeight
) {

    const mouse = {
        x: -10,
        y: -10
    };


    const radius = 2;
    const force = 0.30;
    const returnSpeed = 0.12;


    const blinkValues = [
        1,
        0.75,
        0.5,
        0.25,
        0
    ];


    const blinkChance = 0.007;
    const blinkDurationMin = 1000;
    const blinkDurationMax = 4000;


    /* ==========================
        CONFIGURATION BORDURE
    ========================== */

    const borderChance = 0.013;

    const borderDurationMin = 1000;
    const borderDurationMax = 4000;


    let hovering = false;


    /* ==========================
        SOURIS
    ========================== */

    box.addEventListener(
        'mousemove',
        (event) => {

            hovering = true;

            const rect =
                box.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width;

            const y =
                (event.clientY - rect.top) /
                rect.height;

            mouse.x =
                x * 2 - 1;

            mouse.y =
                -(y * 2 - 1);

        }
    );


    /* ==========================
        SORTIE
    ========================== */

    box.addEventListener(
        'mouseleave',
        () => {

            hovering = false;

            mouse.x = -10;
            mouse.y = -10;

        }
    );


    return {
        mouse,
        getHovering: () => hovering
    };

}


/* ==========================
    MISE À JOUR HOVER
========================== */

function updateReaction(
    squares,
    mouse,
    hovering,
    cellWidth,
    cellHeight
) {

    const radius = 2;
    const force = 0.30;
    const returnSpeed = 0.12;


    const borderChance = 0.013;
    const borderDurationMin = 1000;
    const borderDurationMax = 4000;

    const blinkValues = [
        1,
        0.75,
        0.5,
        0.25,
        0
    ];


    const blinkChance = 0.007;
    const blinkDurationMin = 1000;
    const blinkDurationMax = 4000;





    squares.forEach((square) => {


        const overlay =
            square.userData.overlay;

        const border =
            square.userData.border;


        const originalX =
            square.userData.originalX;

        const originalY =
            square.userData.originalY;


        const dx =
            square.position.x -
            mouse.x;

        const dy =
            square.position.y -
            mouse.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /* ==========================
            APPARITION
        ========================== */

        if (square.userData.appearing) {

            square.userData.appearDelay -= 16;


            if (
                square.userData.appearDelay <= 0
            ) {

                square.userData.appearTarget = 1;


                square.userData.appearOpacity +=
                    (
                        1 -
                        square.userData.appearOpacity
                    ) * 1;


                square.material.opacity =
                    square.userData.appearOpacity;


                if (
                    square.userData.appearOpacity > 0.99
                ) {

                    square.userData.appearOpacity = 1;

                    square.material.opacity = 1;

                    square.userData.appearing = false;

                }

            }

        }



        /* ==========================
            DISPARITION
        ========================== */

        if (square.userData.disappearing) {

            square.userData.disappearDelay -= 16;


            if (square.userData.disappearDelay <= 0) {

                square.userData.disappearOpacity +=
                    (
                        0 -
                        square.userData.disappearOpacity
                    ) * 1;


                square.material.opacity =
                    square.userData.disappearOpacity;


                if (
                    square.userData.disappearOpacity < 0.01
                ) {

                    square.userData.disappearOpacity = 0;

                    square.material.opacity = 0;

                    square.userData.disappearing = false;

                }

            }

        }


        

        /* ==========================
            RÉACTION
        ========================== */

        if (distance < radius) {

            const influence =
                1 -
                distance / radius;


            const angle =
                Math.atan2(
                    dy,
                    dx
                );


            const push =
                influence * force;


            const targetX =
                originalX +
                Math.cos(angle) * push;


            const targetY =
                originalY +
                Math.sin(angle) * push;


            square.position.x +=
                (
                    targetX -
                    square.position.x
                ) * 0.35;


            square.position.y +=
                (
                    targetY -
                    square.position.y
                ) * 0.35;


            /* ==========================
                TAILLE
            ========================== */

            const scale =
                1 +
                influence *
                square.userData.randomSize *
                0.35;


            square.scale.x +=
                (
                    scale -
                    square.scale.x
                ) * 0.3;


            square.scale.y +=
                (
                    scale -
                    square.scale.y
                ) * 0.3;


        } else {


            /* ==========================
                RETOUR
            ========================== */

            square.position.x +=
                (
                    originalX -
                    square.position.x
                ) * returnSpeed;


            square.position.y +=
                (
                    originalY -
                    square.position.y
                ) * returnSpeed;


            square.scale.x +=
                (
                    1 -
                    square.scale.x
                ) * returnSpeed;


            square.scale.y +=
                (
                    1 -
                    square.scale.y
                ) * returnSpeed;

        }


        /* ==========================
            LIMITES
        ========================== */

        const halfWidth =
            (cellWidth - gap) / 2;

        const halfHeight =
            (cellHeight - gap) / 2;


        square.position.x =
            Math.max(
                -1 + halfWidth,
                Math.min(
                    1 - halfWidth,
                    square.position.x
                )
            );


        square.position.y =
            Math.max(
                -1 + halfHeight,
                Math.min(
                    1 - halfHeight,
                    square.position.y
                )
            );


        /* ==========================
            BLINK BLANC
        ========================== */

        if (
            hovering ||
            square.userData.autoWhite
        ) {

            overlay.userData.nextBlink -= 16;


            if (
                overlay.userData.nextBlink <= 0 &&
                !overlay.userData.blinking
            ) {


                if (
                    Math.random() <
                    blinkChance
                ) {


                    const randomIndex =
                        Math.floor(
                            Math.random() *
                            blinkValues.length
                        );


                    overlay.userData.targetOpacity =
                        blinkValues[randomIndex];


                    overlay.userData.blinking =
                        true;


                    overlay.userData.blinkTimer =
                        blinkDurationMin +
                        Math.random() *
                        (
                            blinkDurationMax -
                            blinkDurationMin
                        );


                } else {


                    overlay.userData.nextBlink =
                        100 +
                        Math.random() * 300;

                }

            }


            /* ==========================
                FIN BLINK
            ========================== */

            if (
                overlay.userData.blinking
            ) {

                overlay.userData.blinkTimer -= 16;


                if (
                    overlay.userData.blinkTimer <= 0
                ) {

                    overlay.userData.blinking =
                        false;

                    overlay.userData.targetOpacity =
                        0;

                    overlay.userData.nextBlink =
                        100 +
                        Math.random() * 300;

                }

            }


        } else {


            overlay.userData.blinking =
                false;

            overlay.userData.targetOpacity =
                0;

            overlay.userData.nextBlink =
                100;

        }


        /* ==========================
            BLINK BORDURE
        ========================== */

        if (
            hovering ||
            square.userData.autoBorder
        ) {

            square.userData.borderNextBlink -= 16;


            if (
                square.userData.borderNextBlink <= 0 &&
                !square.userData.borderBlinking
            ) {


                if (
                    Math.random() <
                    borderChance
                ) {

                    square.userData.borderBlinking =
                        true;


                    square.userData.borderTimer =
                        borderDurationMin +
                        Math.random() *
                        (
                            borderDurationMax -
                            borderDurationMin
                        );


                    border.visible = true;


                } else {


                    square.userData.borderNextBlink =
                        100 +
                        Math.random() * 500;

                }

            }


            /* ==========================
                FIN BORDURE
            ========================== */

            if (
                square.userData.borderBlinking
            ) {

                square.userData.borderTimer -= 16;


                if (
                    square.userData.borderTimer <= 0
                ) {

                    square.userData.borderBlinking =
                        false;

                    border.visible = false;

                    square.userData.borderNextBlink =
                        100 +
                        Math.random() * 500;

                }

            }


        } else {


            square.userData.borderBlinking =
                false;

            border.visible = false;

            square.userData.borderNextBlink =
                100;

        }


        /* ==========================
            ANIMATION OPACITÉ
        ========================== */

        overlay.material.opacity +=
            (
                overlay.userData.targetOpacity -
                overlay.material.opacity
            ) * 0.25;


        /* ==========================
            POSITION + TAILLE OVERLAY
        ========================== */

        overlay.position.x =
            square.position.x;

        overlay.position.y =
            square.position.y;

        overlay.scale.x =
            square.scale.x;

        overlay.scale.y =
            square.scale.y;


        /* ==========================
            POSITION + TAILLE BORDURE
        ========================== */

        border.position.x =
            square.position.x;

        border.position.y =
            square.position.y;

        border.scale.x =
            square.scale.x;

        border.scale.y =
            square.scale.y;

    });

}



/* ==========================
    RÉACTION AUTOMATIQUE
========================== */

function updateAutoReaction(
    squares,
    cellWidth,
    cellHeight,
    activeX,
    activeY
) {

    const radius = 2;
    const force = 0.30;
    const returnSpeed = 0.12;
    const borderChance = 0.013;
    const borderDurationMin = 1000;
    const borderDurationMax = 4000;

    squares.forEach((square) => {

        square.userData.autoBorder = true;
        square.userData.autoWhite = true;
        const originalX =
            square.userData.originalX;

        const originalY =
            square.userData.originalY;


        const dx =
            square.position.x -
            activeX;

        const dy =
            square.position.y -
            activeY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /* ==========================
            RÉACTION
        ========================== */

        if (distance < radius) {

            const influence =
                1 -
                distance / radius;


            const angle =
                Math.atan2(
                    dy,
                    dx
                );


            const push =
                influence * force;


            const targetX =
                originalX +
                Math.cos(angle) * push;


            const targetY =
                originalY +
                Math.sin(angle) * push;


            square.position.x +=
                (
                    targetX -
                    square.position.x
                ) * 0.35;


            square.position.y +=
                (
                    targetY -
                    square.position.y
                ) * 0.35;


            /* ==========================
                TAILLE
            ========================== */

            const scale =
                1 +
                influence *
                square.userData.randomSize *
                0.35;


            square.scale.x +=
                (
                    scale -
                    square.scale.x
                ) * 0.3;


            square.scale.y +=
                (
                    scale -
                    square.scale.y
                ) * 0.3;


        } else {


            /* ==========================
                RETOUR
            ========================== */

            square.position.x +=
                (
                    originalX -
                    square.position.x
                ) * returnSpeed;


            square.position.y +=
                (
                    originalY -
                    square.position.y
                ) * returnSpeed;


            square.scale.x +=
                (
                    1 -
                    square.scale.x
                ) * returnSpeed;


            square.scale.y +=
                (
                    1 -
                    square.scale.y
                ) * returnSpeed;

        }


        /* ==========================
            LIMITES
        ========================== */

        const halfWidth =
            (cellWidth - gap) / 2;

        const halfHeight =
            (cellHeight - gap) / 2;


        square.position.x =
            Math.max(
                -1 + halfWidth,
                Math.min(
                    1 - halfWidth,
                    square.position.x
                )
            );


        square.position.y =
            Math.max(
                -1 + halfHeight,
                Math.min(
                    1 - halfHeight,
                    square.position.y
                )
            );








        /* ==========================
            BLINK BLANC AUTOMATIQUE
        ========================== */

        const overlay =
            square.userData.overlay;

        const blinkValues = [
            1,
            0.75,
            0.5,
            0.25,
            0
        ];

        const blinkChance = 0.007;

        const blinkDurationMin = 1000;
        const blinkDurationMax = 4000;


        overlay.userData.nextBlink -= 16;


        if (
            overlay.userData.nextBlink <= 0 &&
            !overlay.userData.blinking
        ) {

            if (
                Math.random() <
                blinkChance
            ) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        blinkValues.length
                    );


                overlay.userData.targetOpacity =
                    blinkValues[randomIndex];


                overlay.userData.blinking =
                    true;


                overlay.userData.blinkTimer =
                    blinkDurationMin +
                    Math.random() *
                    (
                        blinkDurationMax -
                        blinkDurationMin
                    );


            } else {

                overlay.userData.nextBlink =
                    100 +
                    Math.random() * 300;

            }

        }


        /* ==========================
            FIN BLINK BLANC
        ========================== */

        if (
            overlay.userData.blinking
        ) {

            overlay.userData.blinkTimer -= 16;


            if (
                overlay.userData.blinkTimer <= 0
            ) {

                overlay.userData.blinking =
                    false;

                overlay.userData.targetOpacity =
                    0;

                overlay.userData.nextBlink =
                    100 +
                    Math.random() * 300;

            }

        }


        /* ==========================
            ANIMATION OPACITÉ
        ========================== */

        overlay.material.opacity +=
            (
                overlay.userData.targetOpacity -
                overlay.material.opacity
            ) * 0.25;


        /* ==========================
            POSITION + TAILLE OVERLAY
        ========================== */

        overlay.position.x =
            square.position.x;

        overlay.position.y =
            square.position.y;

        overlay.scale.x =
            square.scale.x;

        overlay.scale.y =
            square.scale.y;


        /* ==========================
            BLINK BORDURE AUTOMATIQUE
        ========================== */

        const border =
            square.userData.border;


        square.userData.borderNextBlink -= 16;


        if (
            square.userData.borderNextBlink <= 0 &&
            !square.userData.borderBlinking
        ) {


            if (
                Math.random() <
                borderChance
            ) {

                square.userData.borderBlinking =
                    true;


                square.userData.borderTimer =
                    borderDurationMin +
                    Math.random() *
                    (
                        borderDurationMax -
                        borderDurationMin
                    );


                border.visible = true;


            } else {


                square.userData.borderNextBlink =
                    100 +
                    Math.random() * 500;

            }

        }


        /* ==========================
            FIN BORDURE
        ========================== */

        if (
            square.userData.borderBlinking
        ) {

            square.userData.borderTimer -= 16;


            if (
                square.userData.borderTimer <= 0
            ) {

                square.userData.borderBlinking =
                    false;

                border.visible = false;

                square.userData.borderNextBlink =
                    100 +
                    Math.random() * 500;

            }

        }


        /* ==========================
            POSITION + TAILLE BORDURE
        ========================== */

        border.position.x =
            square.position.x;

        border.position.y =
            square.position.y;

        border.scale.x =
            square.scale.x;

        border.scale.y =
            square.scale.y;



    });

}




/* ==========================
    ANIMATION
========================== */

function animate(
    scene,
    renderer,
    updateHover
) {

    requestAnimationFrame(() => {
        animate(
            scene,
            renderer,
            updateHover
        );
    });


    updateHover();


    renderer.render(
        scene,
        renderer.camera
    );

}


/* ==========================
    INITIALISATION D'UNE BOX
========================== */

function initializeBox(box) {


    const canvas =
        box.querySelector(
            '.particle-canvas'
        );


    const image =
        box.querySelector('img');


    if (!canvas || !image) {
        return;
    }


    /* ==========================
        THREE.JS
    ========================== */

    const scene =
        new THREE.Scene();


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


    const renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: false
        });


    renderer.setPixelRatio(1);


    /* ==========================
        TEXTURE
    ========================== */

    const textureLoader =
        new THREE.TextureLoader();


    textureLoader.load(
        image.src,
        (texture) => {


            texture.minFilter =
                THREE.LinearFilter;

            texture.magFilter =
                THREE.LinearFilter;

            texture.colorSpace =
                THREE.SRGBColorSpace;

            texture.flipY = false;

            texture.needsUpdate = true;


            /* ==========================
                DIMENSIONS
            ========================== */

            const cellWidth =
                2 / columns;

            const cellHeight =
                2 / rows;


            /* ==========================
                CARRÉS
            ========================== */

            const squares =
                createSquares(
                    scene,
                    texture,
                    cellWidth,
                    cellHeight
                );


            canvas.userData = {
                squares: squares,
                renderer: renderer
            };




            const boxSection =
                box.closest('.dashboard-section');

            const isFirstSection =
                boxSection === sections[0];


            /* ==========================
                SECTION 2 INACTIVE
            ========================== */

            if (
                !isFirstSection &&
                window.innerWidth > 600
            ) {

                squares.forEach((square) => {

                    square.userData.appearing = false;
                    square.userData.disappearing = false;

                    square.userData.appearOpacity = 0;
                    square.userData.appearTarget = 0;

                    square.material.opacity = 0;

                });

            }



            loadedBoxes++;

            if (
                window.innerWidth <= 600 &&
                loadedBoxes === boxes.length
            ) {
                startMobileLoop();
            }



            /* ==========================
                HOVER
            ========================== */

            const hover =
                setupHoverReaction(
                    box,
                    squares,
                    cellWidth,
                    cellHeight
                );


            /* ==========================
                ANIMATION
            ========================== */

            function update() {

                updateReaction(
                    squares,
                    hover.mouse,
                    hover.getHovering(),
                    cellWidth,
                    cellHeight
                );

            }


            /* ==========================
                DÉMARRAGE
            ========================== */

            resize(
                box,
                renderer
            );


            let previousTime = performance.now();

            function render() {

                requestAnimationFrame(render);

                const currentTime = performance.now();

                const deltaTime = currentTime - previousTime;

                previousTime = currentTime;

                // Réaction des particules
                update();

                // Animation des titres
                animateTitles(deltaTime);

                // Rendu Three.js
                renderer.render(scene, camera);

            }

            render();

        }
    );


    /* ==========================
        RESIZE
    ========================== */

    window.addEventListener(
        'resize',
        () => {

            resize(
                box,
                renderer
            );

        }
    );

}


/* ==========================
    INITIALISATION
========================== */

boxes.forEach((box) => {

    initializeBox(box);

});



