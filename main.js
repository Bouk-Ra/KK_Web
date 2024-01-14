(() => {
    // Set --vh CSS variable
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // Set animation properties for paths in the main group
    const kkScriptMainGroup = document.querySelector('.kaamkaaj-script__svg--main');
    const kkScriptMainPaths = document.querySelectorAll('.kaamkaaj-script-path');

    kkScriptMainPaths.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.setProperty('--length', length);
        path.style.setProperty('--delay', `${index * 100}ms`);
        path.style.setProperty('--duration', `${length * 2}ms`);
    });

    // Handle sticky effect for navigation bar
    function handerNavBar() {
        const welcomePage = document.querySelector('.welcome-page');
        const navBar = document.querySelector('.nav-bar__container');
        const navBarRect = navBar.getBoundingClientRect();
        const navBarTop = navBarRect.top;

        if (navBarTop <= 0) {
            welcomePage.classList.add('sticky-elem');
        } else {
            welcomePage.classList.remove('sticky-elem');
        }
    }

    window.addEventListener('scroll', handerNavBar);

    // Loading page setup with minimum loading time
    const loadingPage = document.querySelector('.kaamkaaj-script__loading');
    loadingPage.id = 'loading-page';
    document.body.appendChild(loadingPage);

    const minimumLoadingTime = 5000;
    const startTime = new Date().getTime();

    const canvas = document.querySelector(".logo");
    const ctx = canvas.getContext("2d");
    const videoWidth = 3000;
    const videoHeight = 308;
    const imageUrls = [];

    for (let i = 0; i <= 80; i++) {
        imageUrls.push(`https://files.cargocollective.com/c1706458/KK_morph_${String(i).padStart(5, '0')}.png`);
    }

    let currentFrame = 0;
    let isPlaying = false;

    const preloadImages = () => {
        return Promise.all(imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
            });
        }));
    };

    const loadImage = () => {
        const img = new Image();
        img.src = imageUrls[currentFrame];

        img.onload = () => {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
        };
    };

    const startPlayback = (forward, callback) => {
        const playDirection = forward ? 1 : -1;
        const endFrame = forward ? imageUrls.length - 1 : 0;

        const playFrame = () => {
            loadImage();

            if (currentFrame !== endFrame) {
                currentFrame += playDirection;
                setTimeout(() => {
                    requestAnimationFrame(playFrame);
                }, 12); // 60fps
            } else {
                if (callback) {
                    callback();
                }
            }
        };

        playFrame();
    };

    const logoTrigger = document.querySelectorAll(".logo-hover-zone");

    logoTrigger.forEach((logoTrigger) => {
        logoTrigger.addEventListener("mouseenter", () => {
            if (!isPlaying) {
                isPlaying = true;
                startPlayback(currentFrame === 0, () => {
                    isPlaying = false;
                });
            }
        });
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        loadImage();
    });

    canvas.width = window.innerWidth;
    loadImage();

    document.addEventListener("DOMContentLoaded", () => {
        preloadImages().then(() => {
            const elapsedTime = new Date().getTime() - startTime;
            const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

            setTimeout(() => {
                hideLoadingPage();
                setTimeout(() => {
                    canvas.style.imageRendering = "auto";
                }, 100);
            }, remainingTime);
        });
    });

    function hideLoadingPage() {
        var loadingPage = document.getElementById("loading-page");
        var content = document.getElementById("welcome-page__container");

        loadingPage.style.animation = "slideUpAndFadeOut 1s ease-in-out";
        loadingPage.addEventListener("animationend", function () {
            loadingPage.style.display = "none";
            document.body.style.overflow = "visible";
        });
    }

    // Check for touch devices and handle accordingly
    const checkTouchDevice = () => {
        const isTouchDevice = window.matchMedia("(hover: none)").matches;
        canvas.style.display = isTouchDevice ? "none" : "block";
    };

    checkTouchDevice();
})();



//Button Click to move

(() => {
    document.querySelector('.nav-bar-btn:first-child').addEventListener('click', function() {
        // Find the element with the class 'renderSection'
        const renderSectionElement = document.querySelector('.renderSection');
      
        // Check if the element exists
        if (renderSectionElement) {
          // Calculate the scroll position, considering the offset (100 pixels from the top)
          const scrollPosition = renderSectionElement.offsetTop - 100;
      
          // Scroll to the calculated position
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      });
      
})();