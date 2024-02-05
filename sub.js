

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

    ctx.canvas.ownerDocument.defaultView.willReadFrequently = true;
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

    const imageCache = {}; // 이미지 캐시 객체 추가

    const loadImage = () => {
        if (imageCache[currentFrame]) {
            // 이미지가 이미 캐시에 있는 경우
            const cachedImage = imageCache[currentFrame];
            displayImage(cachedImage);
        } else {
            // 이미지를 로딩하고 캐시에 추가
            const img = new Image();
            img.src = imageUrls[currentFrame];

            img.onload = () => {
                imageCache[currentFrame] = img; // 이미지를 캐시에 추가
                displayImage(img);
            };
        }
    };

    const displayImage = (image) => {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, videoWidth, videoHeight);
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
            if(preScrollTop < nextScrollTop && window.scrollY && window.scrollY >= 100 && !isPlaying) {
                isPlaying = true;
                startPlayback(true, () => {
                    isPlaying = false;
                    logoUp();
                });
            }
            else if (preScrollTop > nextScrollTop && !isPlaying){ 
                if (window.scrollY < 100) {
                    logoDown();
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
        headerLogo.style.transition = ".3s ease-in-out";
        navBarMobile.style.transition = ".3s ease-in-out";
        navBarMobile.style.top = 0 + "px";
        headerLogo.style.transform = "translateY(-120%)";
    }

    function logoDown() {
        const headerLogoHeight = headerLogo.getBoundingClientRect().height;
        const headerLogoStyle = getComputedStyle(headerLogo);
        const headerLogoMarginBottom = parseInt(headerLogoStyle.getPropertyValue("margin-bottom"), 10);

        navBarMobile.style.top = headerLogoHeight + headerLogoMarginBottom + "px";
        headerLogo.style.transition = ".3s ease-in-out";
        navBarMobile.style.transition = ".3s ease-in-out";
        headerLogo.style.transform = "translateY(0%)";

        otherPageRender.style.top = headerLogo.clientHeight + 5 + "px"; //???????????????????????????????????????????????????
    }

    window.addEventListener('DOMContentLoaded', () => {
        const headerLogoHeight = headerLogo.getBoundingClientRect().height;
        const headerLogoStyle = getComputedStyle(headerLogo);
        const headerLogoMarginBottom = parseInt(headerLogoStyle.getPropertyValue("margin-bottom"), 10);
        const navBarMobileHeight = navBarMobile.getBoundingClientRect().height;
        const welcomeTextMarginTop = headerLogoHeight + navBarMobileHeight + "px";
        navBarMobile.style.top = headerLogoHeight + headerLogoMarginBottom + "px";
        document.documentElement.style.setProperty('--welcome-text-margin-top', welcomeTextMarginTop);
    })

    window.addEventListener('resize', () => {
        const headerLogoHeight = headerLogo.getBoundingClientRect().height;
        const headerLogoStyle = getComputedStyle(headerLogo);
        const headerLogoMarginBottom = parseInt(headerLogoStyle.getPropertyValue("margin-bottom"), 10);

        if(window.innerWidth < 768) {
            navBarMobile.style.top = headerLogoHeight + headerLogoMarginBottom + "px";
            otherPageRender.style.top = headerLogo.clientHeight + 5 + "px";
        }

    })

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


