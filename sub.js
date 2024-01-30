

// Set --vh CSS variable

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.cursor = "auto";
    });
})();

(() => {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVH);
    setVH();
})();


// Prevent overscroll on top for Chrome
(() => {
    htmlElement = document.querySelector('html');

    window.addEventListener("resize", () => {
        if(window.innerWidth <= 767 ) {
            htmlElement.style.scrollSnapType = "none";
        } else {
            htmlElement.style.scrollSnapType = "y mandatory";
        }
    })

    window.addEventListener("wheel", function(event) {
        if (window.innerWidth > 767 && event.deltaY > 0) {
            // 마우스 휠을 아래로 스크롤할 때
            htmlElement.style.scrollSnapType = "y mandatory";
        } else if (window.innerWidth > 767 && event.deltaY < 0 && window.scrollY <= 0) {
            // 마우스 휠을 위로 스크롤할 때
            htmlElement.style.scrollSnapType = "none";
        }
    });

})();


(() => {

    // Loading page setup with minimum loading time
    const loadingPage = document.getElementById('kaamkaaj-loading').parentNode;
    loadingPage.id = 'loading-page';

    let minimumLoadingTime = 3000;
    const startTime = new Date().getTime();

    const headerLogo = document.querySelector('.header-logo');
    const canvas = document.querySelector(".logo");
    const ctx = canvas.getContext("2d");
    const videoWidth = 3000;
    const videoHeight = 308;
    const imageUrls = [];

    const navBarMobile = document.querySelector('.nav-bar__container--mb');

    for (let i = 0; i <= 80; i++) {
        // imageUrls.push(`https://files.cargocollective.com/c1706458/KK_morph_${String(i).padStart(5, '0')}.png`);
        imageUrls.push(`https://files.cargocollective.com/c1706458/KK_morph_${String(i).padStart(5, '0')}-min.png`);
    }

    let currentFrame = 0;
    let isPlaying = false;

    const firstImage = new Image();
    // firstImage.src = `https://files.cargocollective.com/c1706458/KK_morph_${String(0).padStart(5, '0')}.png`;
    firstImage.src = `https://files.cargocollective.com/c1706458/KK_morph_${String(0).padStart(5, '0')}-min.png`;
    firstImage.onload = () => {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(firstImage, 0, 0, videoWidth, videoHeight);
    };

    const preloadImages = () => {
        return Promise.all(imageUrls.slice(1).map((url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
            });
        }));
    };
    // loadImage();
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


    let preScrollTop = 0;

    window.addEventListener('scroll',() => {
        
        let nextScrollTop = window.scrollY;
        
        if (window.innerWidth < 768) {
            if(preScrollTop < nextScrollTop && window.scrollY >= window.innerHeight*0.1 && !isPlaying) {
                isPlaying = true;
                startPlayback(true, () => {
                    isPlaying = false;
                    logoUp();
                });
            }
            else if (preScrollTop > nextScrollTop && !isPlaying){ 
                if (window.scrollY < window.innerHeight*0.4) {
                    logoDown();
                    navBarMobileHandler()
                    isPlaying = true;
                    startPlayback(false, () => {
                        isPlaying = false;
                    });
                }
            }
        }

        if (window.innerWidth >= 768 || window.scrollY === 0) {
            headerLogo.style.transform = "translateY(0%)";
        }
        preScrollTop = nextScrollTop;
    });

    navBarMobileHandler()
    function navBarMobileHandler() {
        const headerLogoHeight = headerLogo.getBoundingClientRect().height;
        const headerLogoStyle = getComputedStyle(headerLogo);
        const headerLogoMarginBottom = parseInt(headerLogoStyle.getPropertyValue("margin-bottom"), 10);
        const navBarMobileHeight = navBarMobile.getBoundingClientRect().height;
        const welcomeTextMarginTop = headerLogoHeight + navBarMobileHeight + "px";

        navBarMobile.style.top = headerLogoHeight + headerLogoMarginBottom + "px";
        document.documentElement.style.setProperty('--welcome-text-margin-top', welcomeTextMarginTop);
    }
    window.addEventListener('resize', navBarMobileHandler);


    const otherPageRender = document.querySelector('.renderSection_other');
    window.addEventListener('resize', renderSectionOtherHandler);

    function renderSectionOtherHandler() {
        if(window.innerWidth > 767) {
            otherPageRender.style.top = 0 + "px";
        } else {
            if(window.scrollY < window.innerHeight*0.4) {
                otherPageRender.style.top = headerLogo.clientHeight + "px";
            }
        }
    } 


    function logoUp() {
        headerLogo.style.transition = ".4s ease-in-out";
        navBarMobile.style.transition = ".4s ease-in-out";
        navBarMobile.style.top = 0 + "px";
        headerLogo.style.transform = "translateY(-120%)";
        otherPageRender.style.top = 0 + "px";
    }

    function logoDown() {
        headerLogo.style.transition = ".4s ease-in-out";
        navBarMobile.style.transition = ".4s ease-in-out";
        headerLogo.style.transform = "translateY(0%)";
        otherPageRender.style.top = headerLogo.clientHeight + 5 + "px";
    }

    document.addEventListener("DOMContentLoaded", async () => {
    
        async function preloadAndHide(loadingPageFunction) {
            
            await preloadImages();
            const elapsedTime = new Date().getTime() - startTime;
            const remainingTime = Math.max(0, elapsedTime);

            headerLogo.style.opacity = "1";
            headerLogo.style.transition = "opacity 1.2s ease, transform 1.2s 0.6s ease";
            headerLogo.style.transition = "none";
            headerLogo.style.transform = "translateY(0)";
            headerLogo.style.zIndex = "9998";
            canvas.style.animation = "none";
            canvas.style.transition = "none";
            canvas.style.transform = "scale(1.008)";
            if (window.innerWidth > 767) {
                otherPageRender.style.top = headerLogo.clientHeight + "px";
            } else {
                otherPageRender.style.top = headerLogo.clientHeight + 5 + "px";
            }
    
            setTimeout(() => {
                loadingPageFunction();
                setTimeout(() => {
                    canvas.style.imageRendering = "pixelated";
                    canvas.style.imageRendering = "auto";
                }, 100);
            }, remainingTime);
        }

        await preloadAndHide(hideLoadingPageOther);
    });

    function hideLoadingPageOther() {
        var loadingPage = document.getElementById('kaamkaaj-loading').parentNode;
        loadingPage.style.animation = "slideUpAndFadeOut 0.5s ease-in-out";
        loadingPage.addEventListener("animationend", function () {
            loadingPage.style.display = "none";
            document.body.style.overflow = "auto";
        });
    } 
})();

// (() => {
//     document.addEventListener("DOMContentLoaded", otherPageHandler);
    
//     function otherPageHandler() {
//         const headerLogo = document.querySelector('.header-logo');
//         const navBarMoible = document.querySelector('.nav-bar--mb');
//         const otherPageRender = document.querySelector('.renderSection_other');
    
//         const otherPageRenderTop = headerLogo.clientHeight + navBarMoible.clientHeight + 5;
        
//         if (window.innerWidth > 767) {
//             otherPageRender.style.top = 0 + "px";
//         } else {
//             otherPageRender.style.top = otherPageRenderTop + "px";
//         }
//     }
// })(); 
    
//     document.addEventListener("DOMContentLoaded", async () => {
//         window.addEventListener('beforeunload', function() {
//             sessionStorage.setItem('scrollLoadPosition', window.scrollY);
//         });
    
//         async function preloadAndHide(loadingPageFunction) {
//             headerLogo.style.opacity = "1";
            
//             await preloadImages();
//             headerLogo.style.transition = "opacity 1.2s ease, transform 1.2s 0.6s ease";
//             const elapsedTime = new Date().getTime() - startTime;
//             const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
    
//             setTimeout(() => {
//                 loadingPageFunction();
//                 setTimeout(() => {
//                     canvas.style.imageRendering = "pixelated";
//                     canvas.style.imageRendering = "auto";
//                 }, 100);
//             }, remainingTime);
//         }
    
//         await centerImageVertically();
//         const scrollLoadPosition = sessionStorage.getItem('scrollLoadPosition') || 0;
//         window.onbeforeunload = function() {
//             sessionStorage.setItem('scrollLoadPosition', window.scrollY);
//         };
//         const hasVisited = sessionStorage.getItem('hasVisited');
    
//         if (!window.innerWidth > 767) {
//             if (!hasVisited && parseInt(scrollLoadPosition) < window.innerHeight * 0.1) {
//                 await preloadAndHide(hideLoadingPageOne);
//                 sessionStorage.setItem('hasVisited', 'true');
//             } else {
//                 minimumLoadingTime = 0;
//                 headerLogo.style.transition = "none";
//                 canvas.style.animation = "none";
//                 headerLogo.style.transform = "translateY(0)";
//                 headerLogo.style.zIndex = "9998";
//                 canvas.style.transition = "none";
//                 canvas.style.transform = "scale(1.008)";
    
//                 await preloadAndHide(hideLoadingPageTwo);
//             }
//         } else {
//             minimumLoadingTime = 0;
//             headerLogo.style.transition = "none";
//             canvas.style.animation = "none";
//             headerLogo.style.transform = "translateY(0)";
//             headerLogo.style.zIndex = "9998";
//             canvas.style.transition = "none";
//             canvas.style.transform = "scale(1.008)";
    
//             await preloadAndHide(hideLoadingPageTwo);
    
//             if (!hasVisited && parseInt(scrollLoadPosition) < window.innerHeight * 0.1) {
//                 sessionStorage.setItem('hasVisited', 'true');
//             }
//         }
//     });
        
//     function hideLoadingPageOne() {
//         var loadingPage = document.getElementById('kaamkaaj-loading').parentNode;

//         loadingPage.style.animation = "slideUpAndFadeOut 1s 1s ease-in-out";
//         canvas.style.animation = "none"
//         headerLogo.style.transform = "translateY(0)";
//         canvas.style.transform = "scale(1.008)"
//         loadingPage.addEventListener("animationend", function () {
//             loadingPage.style.display = "none";
//             document.body.style.overflow = "auto";
//         });
//     }

//     function hideLoadingPageTwo() {
//         var loadingPage = document.getElementById('kaamkaaj-loading').parentNode;
//         loadingPage.style.animation = "slideUpAndFadeOut 0.5s ease-in-out";
//         loadingPage.addEventListener("animationend", function () {
//             loadingPage.style.display = "none";
//             document.body.style.overflow = "auto";
//         });
        
//     } 
//     function centerImageVertically() {
//         const screenHeight = window.innerHeight;
//         const imageHeight = headerLogo.getBoundingClientRect().height;
//         const logoYOffset = Math.max(0, (screenHeight - imageHeight) / 2.1);
    
//         headerLogo.style.transform = `translateY(${logoYOffset}px)`;
//         // headerLogo.style.transition = "opacity 1.2s ease";
//     };

// })();



// // Carousel(BEFORE Desktop)
(() => {
    document.addEventListener('DOMContentLoaded', function() {
        const buttonsContainers = document.querySelectorAll('.carousel-buttons');
    
        buttonsContainers.forEach((container) => {
            const firstButton = container.querySelector('.carousel-button');
            firstButton.classList.add('btn--active');
        });
    });
    
    function carouselSlide(event, index) {
        const carousel = event.currentTarget.parentElement.parentElement.previousElementSibling.children[0];
        const btns = event.currentTarget.parentElement.children;
        
        carousel.style.transform = `translateX(${-index * 100}%)`;
    
        const buttonsArray = Array.from(btns);
        buttonsArray.forEach(function(button, i) {
            if (i === index) {
                button.classList.add('btn--active');
            } else {
                button.classList.remove('btn--active');
            }
        });
    }

    window.carouselSlide = carouselSlide;
})();





// Winging It Trigger
(() => {
    const wingingItPaths = document.querySelectorAll('.winging-it--path');

    wingingItPaths.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.setProperty('--length', length);
    });

    function wingingItHandler() {
        const screenHeight = window.innerHeight;
        
        const wingingItSvg = document.querySelector('.winging-it--svg');
            const wingingItSvgRect = wingingItSvg.getBoundingClientRect();
            const wingingItSvgTop = wingingItSvgRect.top;
            if(wingingItSvgTop < screenHeight*0.8) {
                wingingItPaths.forEach((path) => {
                    path.style.animation = 'path 2000ms ease forwards';
                });
            } else if(wingingItSvgTop > screenHeight) {
                wingingItPaths.forEach((path) => {
                    path.style.animation = 'path-reward 2000ms forwards';
                });
            }
    }

    window.addEventListener('scroll', wingingItHandler);
})();


