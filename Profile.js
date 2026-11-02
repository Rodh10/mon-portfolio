
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
                    ) * 2 + 0.12 ;


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



function initMobileParagraphs() {

    if (window.innerWidth > 600) return;

    const perso = document.querySelector('.perso');
    const focus = document.querySelector('.focus');
    const titleMoi = document.querySelector('.i');
    const titleExpertise = document.querySelector('.do');
    if (!perso || !focus || !titleMoi || !titleExpertise) return;


    /* ==========================
       CRÉATION DE LA FLÈCHE
       ========================== */

    const seeMore =
        document.createElement('div');

    seeMore.className =
        'see-more';

    appearCMDArrow(seeMore);

    seeMore.style.fontSize =
        '1rem'; // ← change la taille ici


    /*
    * La flèche est créée directement
    * dans le même conteneur que l'ancienne.
    */

    titleMoi.parentNode.appendChild(
        seeMore
    );
    /* ==========================
       RÉCUPÉRATION DES LIGNES
       ========================== */

    const persoLines =
        Array.from(
            perso.querySelectorAll(':scope > .line-container')
        );

    const focusLines =
        Array.from(
            focus.querySelectorAll(':scope > .line-container')
        );


    /* ==========================
       DÉTECTION DES PARAGRAPHES
       ========================== */

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

        if (current.length) {
            paragraphs.push(current);
        }

        return paragraphs;
    }


    const persoParagraphs =
        splitParagraphs(persoLines);

    const focusParagraphs =
        splitParagraphs(focusLines);


    if (
        persoParagraphs.length < 3 ||
        focusParagraphs.length < 3
    ) return;




    /* ==========================
      ANIMATION DE LA FLÈCHE
      ========================== */

    /* ==========================
      ANIMATION DE LA FLÈCHE
      ========================== */

    function animateArrow(reverse = false) {

        return new Promise(resolve => {

            const steps = 6;
            const delay = 50;
            const trailLength = 4;

            let currentStep = 0;

            seeMore.style.opacity = '1';
            seeMore.style.color = '#666666';

            seeMore.innerHTML = '';

            const trail =
                document.createElement('span');

            const head =
                document.createElement('span');

            trail.className = 'arrow-trail';
            head.className = 'arrow-head';

            if (reverse) {

                head.textContent = '<';

                seeMore.appendChild(head);
                seeMore.appendChild(trail);

            } else {

                head.textContent = '>';

                seeMore.appendChild(trail);
                seeMore.appendChild(head);

            }


            /* ==========================
              PHASE 1
              CONSTRUCTION DE LA FLÈCHE
              ========================== */

            function moveArrow() {

                currentStep++;

                if (currentStep <= steps) {

                    const length =
                        currentStep * trailLength;

                    trail.innerHTML = '';

                    for (let i = 0; i < length; i++) {

                        const char =
                            document.createElement('span');

                        char.textContent = '_';
                        char.style.color = '#666666';

                        trail.appendChild(char);

                    }

                    setTimeout(
                        moveArrow,
                        delay
                    );

                } else {

                    setTimeout(
                        lockHead,
                        5
                    );

                }

            }


            /* ==========================
              VERROUILLAGE
              ========================== */

            function lockHead() {

                const headRect =
                    head.getBoundingClientRect();

                const parentRect =
                    seeMore.getBoundingClientRect();

                const finalLeft =
                    headRect.left - parentRect.left;


                head.style.position =
                    'absolute';

                head.style.left =
                    `${finalLeft}px`;

                head.style.top =
                    '0';


                trail.style.position =
                    'absolute';

                if (!reverse) {

                    trail.style.left =
                        '0';

                } else {

                    trail.style.left =
                        `${headRect.width}px`;

                }


                changeTrailColor();

            }


            /* ==========================
              PHASE 2
              LES TIRETS DEVIENNENT NOIRS
              ========================== */

            function changeTrailColor() {

                const chars =
                    Array.from(
                        trail.children
                    );

                let index = 0;

                function changeNext() {

                    if (index < chars.length) {

                        if (!reverse) {

                            /*
                            * Gauche → droite
                            */

                            chars[index].style.color =
                                '#000000';

                        } else {

                            /*
                            * Droite → gauche
                            */

                            chars[
                                chars.length - 1 - index
                            ].style.color =
                                '#000000';

                        }

                        index++;

                        setTimeout(
                            changeNext,
                            5
                        );

                    } else {

                        /*
                        * Tous les tirets sont noirs.
                        * La tête devient noire à son tour.
                        */

                        head.style.color =
                            '#000000';

                        setTimeout(() => {

                            resolve();

                        }, 100);

                    }

                }

                changeNext();

            }


            moveArrow();

        });

    }

    /* ==========================
      POSITION DE LA FLÈCHE
      SOUS LE 3e PARAGRAPHE
      ========================== */



    /* ==========================
       CRÉATION DE LA NOUVELLE FLÈCHE
       ========================== */

    function createReverseArrow() {

        const newArrow =
            seeMore.cloneNode(false);

        newArrow.className =
            'see-more reverse-arrow';

        newArrow.textContent =
            '<__';

        newArrow.style.color =
            '#000000';

        newArrow.style.opacity =
            '1';

        newArrow.style.transform =
            'none';

        seeMore.parentNode.appendChild(
            newArrow
        );

        newArrow.addEventListener(
            'click',
            toggleProfile
        );

        const thirdParagraph =
            persoParagraphs[2];

        const lastLine =
            thirdParagraph?.[
                thirdParagraph.length - 1
            ];

        if (!lastLine) return newArrow;

        requestAnimationFrame(() => {

            const paragraphRect =
                lastLine.getBoundingClientRect();

            const arrowRect =
                newArrow.getBoundingClientRect();

            const gap = 20;

            const targetTop =
                paragraphRect.bottom + gap;

            const targetLeft =
                paragraphRect.right - arrowRect.width + 180;

            const offsetX =
                targetLeft - arrowRect.left;

            const offsetY =
                targetTop - arrowRect.top;

            newArrow.style.transform =
                `translate(${offsetX}px, ${offsetY}px)`;

        });

        return newArrow;

    }




    function animateReverseArrow() {

        return new Promise(resolve => {

            if (!reverseArrow) {
                resolve();
                return;
            }

            const arrow =
                reverseArrow;


            /* ==========================
            CRÉATION DE LA FLÈCHE
            ========================== */

            arrow.innerHTML = '';

            arrow.style.color =
                '#BA3A23';


            const head =
                document.createElement('span');

            const trail =
                document.createElement('span');


            head.className =
                'arrow-head';

            trail.className =
                'arrow-trail';


            head.textContent =
                '<';


            /*
            * 2 traits au départ.
            */

            for (
                let i = 0;
                i < 2;
                i++
            ) {

                const char =
                    document.createElement('span');

                char.textContent =
                    '_';

                char.style.color =
                    '#BA3A23';

                trail.appendChild(
                    char
                );

            }


            arrow.appendChild(head);
            arrow.appendChild(trail);


            /* ==========================
            POSITION DE DÉPART
            ========================== */

            head.style.position =
                'absolute';

            trail.style.position =
                'absolute';

            head.style.top =
                '0';

            trail.style.top =
                '0';


            const arrowRect =
                arrow.getBoundingClientRect();

            const headRect =
                head.getBoundingClientRect();


            const startHeadLeft =
                headRect.left -
                arrowRect.left;


            const headWidth =
                headRect.width;


            /*
            * Position initiale.
            */

            head.style.left =
                `${startHeadLeft}px`;

            trail.style.left =
                `${startHeadLeft + headWidth}px`;


            /* ==========================
            PARAMÈTRES
            ========================== */

            const steps =
                5;

            const delay =
                40;

            const moveDistance =
                37;

            const trailLength =
                4;


            let currentStep =
                0;


            /* ==========================
            DÉPLACEMENT + ALLONGEMENT
            ========================== */

            function moveArrow() {

                currentStep++;


                if (
                    currentStep <=
                    steps
                ) {

                    /*
                    * La tête se déplace
                    * progressivement vers la gauche.
                    */

                    const newHeadLeft =
                        startHeadLeft -
                        currentStep *
                        moveDistance;


                    head.style.left =
                        `${newHeadLeft}px`;


                    /*
                    * Les traits s'allongent
                    * pendant exactement le même
                    * mouvement.
                    */

                    const length =
                        2 +
                        currentStep *
                        trailLength;


                    trail.innerHTML =
                        '';


                    for (
                        let i = 0;
                        i < length;
                        i++
                    ) {

                        const char =
                            document.createElement('span');

                        char.textContent =
                            '_';

                        char.style.color =
                            '#BA3A23';

                        trail.appendChild(
                            char
                        );

                    }


                    /*
                    * Les traits restent attachés
                    * à la tête.
                    */

                    trail.style.left =
                        `${newHeadLeft + headWidth}px`;


                    /*
                    * Prochaine étape.
                    */

                    setTimeout(
                        moveArrow,
                        delay
                    );


                } else {

                    /* ==========================
                    POSITION FINALE
                    ========================== */

                    const finalHeadLeft =
                        startHeadLeft -
                        steps *
                        moveDistance;


                    /*
                    * Tête définitivement fixée.
                    */

                    head.style.left =
                        `${finalHeadLeft}px`;


                    /*
                    * Les traits restent définitivement
                    * attachés à la tête.
                    */

                    trail.style.left =
                        `${finalHeadLeft + headWidth}px`;


                    /*
                    * IMPORTANT :
                    *
                    * On ne modifie plus ni la tête
                    * ni la position des traits.
                    *
                    * On passe uniquement à la couleur.
                    */

                    changeTrailColor();

                }

            }


            /* ==========================
            COLORATION
            DROITE → GAUCHE
            ========================== */

            function changeTrailColor() {

                const chars =
                    Array.from(
                        trail.children
                    );

                let index =
                    0;


                function changeNext() {

                    if (
                        index <
                        chars.length
                    ) {

                        /*
                        * Le dernier trait devient noir
                        * en premier.
                        *
                        * Puis l'avant-dernier,
                        * puis le précédent...
                        */

                        chars[
                            chars.length -
                            1 -
                            index
                        ].style.color =
                            '#000000';


                        index++;


                        setTimeout(
                            changeNext,
                            5
                        );


                    } else {

                        /*
                        * Tous les traits sont noirs.
                        *
                        * La tête devient noire
                        * à la fin.
                        */

                        head.style.color =
                            '#000000';


                        setTimeout(() => {

                            resolve();

                        }, 100);

                    }

                }


                changeNext();

            }


            /* ==========================
            DÉMARRAGE
            ========================== */

            moveArrow();

        });

    }





    /* ==========================
      POSITION DE LA FLÈCHE
      ÉTAT INITIAL
      ========================== */

    function positionInitialArrow() {

        const firstMoiParagraph =
            persoParagraphs[0];

        const firstMoiLastLine =
            firstMoiParagraph?.[
                firstMoiParagraph.length - 1
            ];

        if (!firstMoiLastLine) return;

        const moiRect =
            firstMoiLastLine.getBoundingClientRect();

        const arrowRect =
            seeMore.getBoundingClientRect();

        const arrowGapY = 2;

        const targetTop =
            moiRect.bottom + arrowGapY;

        const offsetY =
            targetTop - arrowRect.top;

        /*
        * Retour à la position horizontale initiale.
        */

        const offsetX = 0;

        seeMore.style.transform =
            `translate(${offsetX}px, ${offsetY}px)`;

    }



    /* ==========================
       ÉTAT INITIAL
       ========================== */

    // Les paragraphes 2 et 3 de "Moi"
    // sont invisibles dès le départ.

    persoParagraphs.slice(1).flat().forEach(line => {

        line.querySelectorAll(':scope > span').forEach(span => {

            span.style.opacity = '0';
            span.style.color = 'transparent';
            span.style.backgroundColor = 'transparent';

        });

    });

    /* ==========================
       ANIMATION DISPARITION
       ========================== */

    function hideParagraphs(paragraphs, speed = 25) {

        return new Promise(resolve => {

            const lines = paragraphs.flat();

            let totalDuration = 0;

            lines.forEach(line => {

                const spans =
                    Array.from(
                        line.querySelectorAll(':scope > span')
                    );

                const lastIndex = spans.length - 1;

                spans.forEach((span, i) => {

                    const delay =
                        (lastIndex - i) * speed;

                    setTimeout(() => {

                        span.style.opacity = '1';
                        span.style.color = '#000000';
                        span.style.backgroundColor = '#ffffff';

                    }, delay);

                    setTimeout(() => {

                        span.style.opacity = '0';
                        span.style.color = 'transparent';
                        span.style.backgroundColor = 'transparent';

                    }, delay + 10);

                    totalDuration =
                        Math.max(
                            totalDuration,
                            delay + 10
                        );

                });

            });

            setTimeout(() => {
                resolve();
            }, totalDuration + 50);

        });

    }


    /* ==========================
       ANIMATION APPARITION
       ========================== */

    function showParagraphs(paragraphs, speed = 25) {

        return new Promise(resolve => {

            const lines = paragraphs.flat();

            let totalDuration = 0;

            lines.forEach(line => {

                const spans =
                    Array.from(
                        line.querySelectorAll(':scope > span')
                    );

                spans.forEach((span, i) => {

                    const delay = i * speed;

                    setTimeout(() => {

                        span.style.opacity = '1';
                        span.style.color = '#ffffff';
                        span.style.backgroundColor = '#000000';

                    }, delay);

                    totalDuration =
                        Math.max(
                            totalDuration,
                            delay + 10
                        );

                });

            });

            setTimeout(() => {
                resolve();
            }, totalDuration + 50);

        });

    }


    /* ==========================
       DESCENTE
       ========================== */

    function moveExpertise(distance = 220, speed = 70) {

        return new Promise(resolve => {

            let position = initialOffset;

            const step = 20;

            const firstParagraph =
                focusParagraphs[0];

            const timer = setInterval(() => {

                position += step;

                if (position >= initialOffset + distance) {

                    position = initialOffset + distance;

                    clearInterval(timer);
                    resolve();

                }

                titleExpertise.style.transform =
                    `translateY(${position}px)`;

                firstParagraph.forEach(line => {

                    line.style.transform =
                        `translateY(${position}px)`;

                });

            }, speed);

        });

    }


    /* ==========================
       REMONTÉE
       ========================== */

    function resetExpertise(distance = 200, speed = 70) {

        return new Promise(resolve => {

            let position = initialOffset + distance;

            const step = 20;

            const firstParagraph =
                focusParagraphs[0];

            const timer = setInterval(() => {

                position -= step;

                if (position <= initialOffset) {

                    position = initialOffset;

                    clearInterval(timer);
                    resolve();

                }

                titleExpertise.style.transform =
                    `translateY(${position}px)`;

                firstParagraph.forEach(line => {

                    line.style.transform =
                        `translateY(${position}px)`;

                });

            }, speed);

        });

    }


    // Position initiale de "Mon expertise"
    // au niveau du 2e paragraphe de "Moi"
    /* ==========================
      POSITIONS INITIALES
      ========================== */

    let initialOffset = 0;

    const firstMoiLine =
        persoParagraphs[0]?.[
            persoParagraphs[0].length - 1
        ];

    if (firstMoiLine) {

        /* ==========================
          POSITION DE LA FLÈCHE
          ========================== */

        /* ==========================
          POSITION DE LA FLÈCHE
          ========================== */

        const firstMoiParagraph =
            persoParagraphs[0];

        const firstMoiLastLine =
            firstMoiParagraph?.[firstMoiParagraph.length - 1];

        if (firstMoiLastLine) {

            const moiBottom =
                firstMoiLastLine.getBoundingClientRect().bottom;

            const arrowTop =
                seeMore.getBoundingClientRect().top;

            const arrowGap = 2;

            const arrowOffset =
                moiBottom + arrowGap - arrowTop;

            seeMore.style.transform =
                `translateY(${arrowOffset}px)`;
        }


        /* ==========================
          POSITION DE MON EXPERTISE
          ========================== */

        const arrowBottom =
            seeMore.getBoundingClientRect().bottom;

        const expertiseTop =
            titleExpertise.getBoundingClientRect().top;

        const expertiseGap = 20;

        initialOffset =
            arrowBottom + expertiseGap - expertiseTop;

        titleExpertise.style.transform =
            `translateY(${initialOffset}px)`;

        focusParagraphs.flat().forEach(line => {
            line.style.transform =
                `translateY(${initialOffset}px)`;
        });

    }

    /* ==========================
       ÉTAT INITIAL
       ========================== */

    let isExpanded = false;
    let animationRunning = false;
    let reverseArrow = null;


    
    /* ==========================
    ANIMATION PRINCIPALE
    ========================== */

    async function toggleProfile() {

        if (animationRunning) return;

        animationRunning = true;



        if (!isExpanded) {

            /* ==========================
            1. L'ANCIENNE FLÈCHE DEVIENT NOIRE
            ========================== */

            await animateArrow(false);


            /* ==========================
            2. DISPARITION DE L'EXPERTISE
            ========================== */

            await hideParagraphs(
                focusParagraphs
            );


            /* ==========================
            3. NOUVELLE FLÈCHE NOIRE
               SOUS LE 3e PARAGRAPHE
            ========================== */

            reverseArrow =
                createReverseArrow();


            /* ==========================
            4. DESCENTE DE L'EXPERTISE
            ========================== */

            await moveExpertise();


            /* ==========================
            5. APPARITION DE "MOI"
            ========================== */

            await showParagraphs(
                persoParagraphs.slice(1)
            );


            /* ==========================
            6. L'ANCIENNE FLÈCHE DISPARAÎT
            ========================== */

            seeMore.style.opacity =
                '0';


            /* ==========================
            7. LA NOUVELLE FLÈCHE DEVIENT ROUGE
            ========================== */

            if (reverseArrow) {

                reverseArrow.style.color =
                    '#BA3A23';

            }

            isExpanded = true;

        } else {

            /* ==========================
            1. ANIMATION INVERSE
            ========================== */

            await animateReverseArrow();

            /* ==========================
            2. DISPARITION DE "MOI"
            ========================== */

            await hideParagraphs(
                persoParagraphs.slice(1)
            );


            /* ==========================
            3. SUPPRESSION DE LA
               NOUVELLE FLÈCHE
            ========================== */

            if (reverseArrow) {

                reverseArrow.remove();

                reverseArrow = null;

            }


            /* ==========================
            4. REMONTÉE DE L'EXPERTISE
            ========================== */

            await resetExpertise();


            /* ==========================
            5. RÉAPPARITION DE L'EXPERTISE
            ========================== */

            await showParagraphs(
                focusParagraphs
            );

            isExpanded = false;


            /* ==========================
            6. RETOUR À L'ÉTAT INITIAL
            ========================== */

            seeMore.innerHTML =
                '__>';

            seeMore.style.opacity =
                '1';

            seeMore.style.color =
                '#666666';

            seeMore.style.position =
                'relative';

            seeMore.style.transform =
                'none';

            positionInitialArrow();

        }

        animationRunning = false;
    }


    /* ==========================
    CLIC SUR "MOI"
    ========================== */

    titleMoi.addEventListener(
        'click',
        toggleProfile
    );


    /* ==========================
    CLIC SUR LA FLÈCHE
    ========================== */

    seeMore.addEventListener(
        'click',
        toggleProfile
    );


    
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
        span.style.backgroundColor = '#ff0000';
      }, i * 20);
      container.timeouts.push(t1);

      const t2 = setTimeout(() => {
        span.style.color = '#ff0000';
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
        span.style.backgroundColor = '#ff0000';
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














showAllBlokCMD();
startAnimationSequence();






















insertProfileText();


appearPara();
initMobileParagraphs();
appearLinks();