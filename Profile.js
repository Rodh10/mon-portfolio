


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

if (particleContainer) {


    /* =====================================================
       SCENE
       ===================================================== */

    const scene =
        new THREE.Scene();


    /* =====================================================
       CAMERA
       ===================================================== */

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


    /* =====================================================
       RENDERER
       ===================================================== */

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


    /* =====================================================
       IMAGE
       ===================================================== */

    const image =
        new Image();


    image.src =
        "portrait.jpg";


    image.onload = () => {


        /* =================================================
           PARTICULES
           ================================================= */

        const particles = [];


        const columns = 300;

        const rows = 130;


        /* =================================================
           CANVAS INVISIBLE
           ================================================= */

        const canvas =
            document.createElement("canvas");


        const ctx =
            canvas.getContext("2d");


        canvas.width =
            columns;


        canvas.height =
            rows;


        /* =================================================
           REDIMENSIONNER L'IMAGE
           ================================================= */

        const imageRatio =
            image.width /
            image.height;

        let imageWidth =
            rows *
            imageRatio;


        /* =================================================
          RECADRAGE MOBILE
          ================================================= */

        if (window.innerWidth <= 600) {

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


            ctx.drawImage(

                image,

                0,
                sourceY,
                image.width,
                sourceHeight,

                0,
                0,
                imageWidth,
                rows * 0.2

            );

        } else {

            ctx.drawImage(

                image,

                0,
                0,

                imageWidth,
                rows

            );

        }


        /* =================================================
           LIRE LES PIXELS
           ================================================= */

        const imageData =
            ctx.getImageData(

                0,
                0,

                columns,
                rows

            );


        /* =================================================
           CRÉER LES POINTS
           ================================================= */

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


                /* =========================================
                   LUMINOSITÉ
                   ========================================= */

                const brightness =
                    (
                        red +
                        green +
                        blue
                    ) / 3;


                /* =========================================
                   TRANSPARENCE
                   ========================================= */

                if (
                    alpha > 20
                ) {


                    /*
                       Les pixels sombres
                       deviennent moins présents.
                    */

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
                            (columns - 1)
                        ) * 2 - 1.24;


                    const py =
                        (
                            y /
                            (rows - 1)
                        ) * 2 - 0.88;


                    particles.push(

                        px * scale,

                        -py * scale,

                        0

                    );

                }

            }

        }


        /* =================================================
           NOMBRE DE PARTICULES
           ================================================= */

        const particleCount =
            particles.length / 3;


        /* =================================================
           ORDRE GAUCHE → DROITE
           ================================================= */

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


        /* =================================================
           TRIER
           ================================================= */

        order.sort(

            (a, b) => {

                return (
                    priorities[a] -
                    priorities[b]
                );

            }

        );


        /* =================================================
           NOUVEL ORDRE
           ================================================= */

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


        /* =================================================
           GEOMETRY
           ================================================= */

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

        /* =================================================
           CURSEUR
           ================================================= */

        const mouse =
            new THREE.Vector2(
                -10,
                -10
            );


        window.addEventListener(

            "mousemove",

            (event) => {

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

        );


        /* =================================================
           MATERIAL
           ================================================= */

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


        /* =================================================
           POINT CLOUD
           ================================================= */

        const points =
            new THREE.Points(

                geometry,

                material

            );


        scene.add(points);

        /* =================================================
          ANIMATION
          ================================================= */

        let visibleParticles = 0;

        let isLeaving = false;


        const revealSpeed =
            70;


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


        function leaveParticlePortrait() {

            return new Promise(resolve => {

                isLeaving = true;


                function disappear() {

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

                        resolve();

                        return;

                    }


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

        }

        window.leaveParticlePortrait =
            leaveParticlePortrait;


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

    window.addEventListener(

        "resize",

        () => {


            const width =
                particleContainer.clientWidth;


            const height =
                particleContainer.clientHeight;


            renderer.setSize(

                width,
                height

            );

        }

    );

}






































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

if (nav) {
  nav.addEventListener('mouseenter', hideCursor);
  nav.addEventListener('mouseleave', delayedShowCursor);
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
        "et d’une réflexion personnelle sur",
        "la société et les identités.",

        "",
        "",

        "Bénéficiaire du Programme SESAME,",
        "j’ai pu poursuivre mes études grâce",
        "à cette bourse. SESAME a renforcé",
        "ma vision du monde et mon engagement",
        "pour l’environnement, les droits humains",
        "et les minorités.",
        "Ces valeurs guident aujourd’hui",
        "mon parcours de jeune créateur.",

        "",
        "",

        "Après avoir grandi à Farafangana,",
        "j’étudie l’informatique,",
        "notamment le développement logiciel.",
        "Je développe une approche",
        "technique et créative,",
        "entre design et numérique.",
        "Autodidacte, je m’intéresse",
        "à l’image et la typographie."
    ];



    const focusLines = [
        "Je me concentre principalement sur",
        "la conception de maquettes, le UI/UX design",
        "et la création d'interfaces intuitives,",
        "pensées pour offrir une expérience",
        "interactive, fluide et cohérente.",

        "",
        "",

        "Je développe le front-end d'applications",
        "et de sites web, en transformant",
        "les maquettes et concepts visuels",
        "en interfaces fonctionnelles, interactives",
        "et adaptées aux différents besoins du projet.",

        "",
        "",
        
        "Je personnalise également chaque site",
        "selon sa charte graphique, en y intégrant",
        "des éléments graphiques ultra-personnalisés.",
        "Mon approche englobe le brand design,",
        "le graphic design et l'illustration,",
        "afin de créer des univers visuels",
        "uniques et cohérents."
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
    const seeMore = document.querySelector('.see-more');

    if (!perso || !focus || !titleMoi || !titleExpertise || !seeMore) return;

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

    function animateArrow(reverse = false) {

        return new Promise(resolve => {

            const steps = 5;
            const delay = 50;
            const trailLength = 4;

            let currentStep = 0;

            seeMore.style.opacity = '1';

            /* ==========================
              STRUCTURE
              ========================== */

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

                trail.textContent = '';
                head.textContent = '>';

                seeMore.appendChild(trail);
                seeMore.appendChild(head);

            }


            /* ==========================
              PHASE 1
              LA FLÈCHE AVANCE
              ========================== */

            function moveArrow() {

                currentStep++;

                if (currentStep <= steps) {

                    const length =
                        currentStep * trailLength;

                    trail.textContent =
                        '_'.repeat(length);

                    setTimeout(
                        moveArrow,
                        delay
                    );

                } else {

                    /*
                    * La tête est maintenant
                    * arrivée à sa position finale.
                    *
                    * On attend un tout petit peu
                    * avant de commencer la deuxième phase.
                    */

                    setTimeout(
                        lockHead,
                        5
                    );

                }

            }


            /* ==========================
              VERROUILLAGE DE LA TÊTE
              ========================== */

            function lockHead() {

                /*
                * On récupère la position actuelle
                * de la tête.
                */

                const headRect =
                    head.getBoundingClientRect();

                const parentRect =
                    seeMore.getBoundingClientRect();

                const finalLeft =
                    headRect.left - parentRect.left;


                /*
                * On fixe la tête EXACTEMENT
                * là où elle vient d'arriver.
                */

                head.style.position =
                    'absolute';

                head.style.left =
                    `${finalLeft}px`;

                head.style.top = '0';


                /*
                * Le trait reste libre.
                */

                if (!reverse) {

                    trail.style.position =
                        'absolute';

                    trail.style.left =
                        '0';

                } else {

                    trail.style.position =
                        'absolute';

                    trail.style.left =
                        `${headRect.width}px`;

                }


                removeTrail();

            }


            /* ==========================
              PHASE 2
              LES TIRETS SE RACCOURCISSENT
              ========================== */

            function removeTrail() {

                let remaining =
                    steps * trailLength;

                function removeNext() {

                    if (remaining > 0) {

                        remaining--;

                        trail.textContent =
                            '_'.repeat(remaining);

                        /*
                        * Le trait se raccourcit depuis la gauche.
                        * On déplace donc son point de départ
                        * vers la droite.
                        */

                        if (!reverse) {

                            const removed =
                                (steps * trailLength) - remaining;

                            trail.style.left =
                                `${removed}ch`;

                        }

                        setTimeout(
                            removeNext,
                            5
                        );

                    } else {

                        /*
                        * Les tirets ont rejoint la tête.
                        */

                        head.style.opacity = '0';

                        setTimeout(() => {

                            seeMore.style.opacity =
                                '0';

                            resolve();

                        }, 100);

                    }

                }

                removeNext();

            }

            moveArrow();

        });

    }


    /* ==========================
      POSITION DE LA FLÈCHE
      SOUS LE 3e PARAGRAPHE
      ========================== */

    function positionReverseArrow() {

        const thirdParagraph =
            persoParagraphs[2];

        const lastLine =
            thirdParagraph?.[
                thirdParagraph.length - 1
            ];

        if (!lastLine) return;

        /*
        * On remet temporairement la flèche
        * dans sa position normale pour pouvoir
        * mesurer correctement sa taille.
        */

        seeMore.style.transform = 'none';

        /*
        * On attend que le navigateur ait terminé
        * le rendu des paragraphes.
        */

        requestAnimationFrame(() => {

            const paragraphRect =
                lastLine.getBoundingClientRect();

            const arrowRect =
                seeMore.getBoundingClientRect();

            const gap = 20;

            const targetTop =
                paragraphRect.bottom + gap;

            const targetLeft =
                paragraphRect.right - arrowRect.width;

            const offsetX =
                targetLeft - arrowRect.left;

            const offsetY =
                targetTop - arrowRect.top;

            seeMore.style.transform =
                `translate(${offsetX}px, ${offsetY}px)`;

            seeMore.style.opacity = '1';

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


    seeMore.addEventListener('click', async () => {

        if (animationRunning) return;

        animationRunning = true;

        if (!isExpanded) {

            // Flèche vers la droite
            await animateArrow(false);

            // Même séquence que le clic sur "Moi"
            await hideParagraphs(
                focusParagraphs
            );

            await moveExpertise();

            await showParagraphs(
                persoParagraphs.slice(1)
            );

            isExpanded = true;

            /* ==========================
              NOUVELLE FLÈCHE
              ========================== */

            seeMore.textContent = '<__';

            positionReverseArrow();

        } else {

            // Flèche vers la gauche
            await animateArrow(true);

            await hideParagraphs(
                persoParagraphs.slice(1)
            );

            await resetExpertise();

            await showParagraphs(
                focusParagraphs
            );

            isExpanded = false;

            // Flèche initiale
            seeMore.textContent = '__>';
            seeMore.style.opacity = '1';

            positionInitialArrow();

        }

        animationRunning = false;

    });


    /* ==========================
       CLIC SUR "MOI"
       ========================== */

    titleMoi.addEventListener('click', async () => {

        if (animationRunning) return;

        animationRunning = true;


        if (!isExpanded) {

            /*
             * 1. Faire disparaître
             *    les paragraphes 2 et 3
             *    de l'expertise
             */

            await hideParagraphs(
                focusParagraphs
            );


            /*
             * 2. Faire descendre
             *    "Mon expertise"
             *    + le premier paragraphe
             */

            await moveExpertise();


            /*
             * 3. Faire apparaître
             *    les paragraphes 2 et 3
             *    de "Moi"
             */

            await showParagraphs(
                persoParagraphs.slice(1)
            );

            isExpanded = true;


            // Nouvelle flèche inversée
            seeMore.textContent = '<__';
            seeMore.style.opacity = '1';

        } else {

            /*
             * 1. Faire disparaître
             *    les paragraphes 2 et 3
             *    de "Moi"
             */

            await hideParagraphs(
                persoParagraphs.slice(1)
            );


            /*
             * 2. Remonter l'expertise
             */

            await resetExpertise();


            /*
             * 3. Faire réapparaître
             *    les paragraphes 2 et 3
             *    de l'expertise
             */

            await showParagraphs(
                focusParagraphs
            );

           

            isExpanded = false;


            // Nouvelle flèche initiale
            seeMore.textContent = '__>';
            seeMore.style.opacity = '1';

        }


        animationRunning = false;

    });
    

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
    leaveProfileTitleFirstTwo();
    leaveProfileTitleLastTwo();
    leaveEffectTitled();
    animateOldActiveLeaveWheel();

    if (window.leaveParticlePortrait) {
        await window.leaveParticlePortrait();
    }

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
            span.textContent = ch;
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







insertProfileText();
appearProfileTitleFirstTwo();
appearProfileTitleLastTwo();
appearTitled();
appearPara();
initMobileParagraphs();
appearLinks();