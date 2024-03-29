

// Set --vh CSS variable
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

    // window.addEventListener("wheel", function(event) {
    //     if (window.innerWidth > 767 && event.deltaY > 0) {
    //         // 마우스 휠을 아래로 스크롤할 때
    //         htmlElement.style.scrollSnapType = "y mandatory";
    //     } else if (window.innerWidth > 767 && event.deltaY < 0 && window.scrollY <= 0) {
    //         // 마우스 휠을 위로 스크롤할 때
    //         htmlElement.style.scrollSnapType = "none";
    //     }
    // });

    window.addEventListener("scroll", function(event) {
        if (this.window.scrollY >= this.window.innerHeight*2) {
            htmlElement.style.scrollSnapType = "none";
        } else {
            htmlElement.style.scrollSnapType = "y mandatory";
        }
    }) 

})();


// Handle sticky effect for navigation bar
(() => {
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

    const logoTriggerContainer = document.querySelector(".logo-hover-zone__container");
    const logoTrigger = document.querySelectorAll(".logo-hover-zone");

    const navBarMobile = document.querySelector('.nav-bar__container--mb');

    ctx.canvas.ownerDocument.defaultView.willReadFrequently = true;
    for (let i = 0; i <= 80; i++) {
        // imageUrls.push(`https://files.cargocollective.com/c1706458/KK_morph_${String(i).padStart(5, '0')}.png`);
        imageUrls.push(`https://files.cargocollective.com/c1706458/KK_morph_${String(i).padStart(5, '0')}-min-min.webp`);
        // https://files.cargocollective.com/c1706458/KK_morph_00078-min-min.webp
    }

    let currentFrame = 0;
    let isPlaying = false;

    const firstImage = new Image();
    // firstImage.src = `https://files.cargocollective.com/c1706458/KK_morph_${String(0).padStart(5, '0')}.png`;
    firstImage.src = `https://files.cargocollective.com/c1706458/KK_morph_${String(0).padStart(5, '0')}-min-min.webp`;
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
    // const loadImage = () => {
    //     const img = new Image();
    //     img.src = imageUrls[currentFrame];

    //     img.onload = () => {
    //         canvas.width = videoWidth;
    //         canvas.height = videoHeight;
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
    //     };
    // };


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

    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      }

      if (!isTouchDevice()) {
        window.addEventListener('resize', () => {
            const headerLogoHeight = headerLogo.getBoundingClientRect().height;
            const headerLogoStyle = getComputedStyle(headerLogo);
            const headerLogoMarginBottom = parseInt(headerLogoStyle.getPropertyValue("margin-bottom"), 10);
            navBarMobile.style.top = headerLogoHeight + headerLogoMarginBottom + "px";
        });
    }
      

    document.addEventListener("DOMContentLoaded", () => {
    
        window.addEventListener('beforeunload', function() {
            sessionStorage.setItem('scrollLoadPosition', window.scrollY);
        });

        (async () => {
            await centerImageVertically();
            const scrollLoadPosition = sessionStorage.getItem('scrollLoadPosition') || 0;
            window.onbeforeunload = function() {
                sessionStorage.setItem('scrollLoadPosition', window.scrollY);
            };
            const hasVisited = sessionStorage.getItem('hasVisited');
            async function preloadAndHide(loadingPageFunction) {
                headerLogo.style.opacity = "1";
                
                await preloadImages();
                headerLogo.style.transition = "opacity 1.2s ease, transform 1.2s 0.6s ease";
                const elapsedTime = new Date().getTime() - startTime;
                const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
        
                setTimeout(() => {
                    loadingPageFunction();
                    setTimeout(() => {
                        canvas.style.imageRendering = "pixelated";
                        canvas.style.imageRendering = "auto";
                    }, 100);
                }, remainingTime);
            }
        
            if (!hasVisited && parseInt(scrollLoadPosition) < window.innerHeight*0.1) {
                await preloadAndHide(hideLoadingPageOne);
                sessionStorage.setItem('hasVisited', 'true');
            } else if (hasVisited || parseInt(scrollLoadPosition) !== 0){
                minimumLoadingTime = 0;
                headerLogo.style.transition = "none";
                canvas.style.animation = "none";
                headerLogo.style.transform = "translateY(0)";
                headerLogo.style.zIndex = "9998";
                canvas.style.transition = "none";
                canvas.style.transform = "scale(1.008)";
        
                await preloadAndHide(hideLoadingPageTwo);
            }
        })();
        

    });

    function hideLoadingPageOne() {
        var loadingPage = document.getElementById('kaamkaaj-loading').parentNode;

        loadingPage.style.animation = "slideUpAndFadeOut 1s 1s ease-in-out";
        canvas.style.animation = "none"
        headerLogo.style.transform = "translateY(0)";
        canvas.style.transform = "scale(1.008)"
        loadingPage.addEventListener("animationend", function () {
            loadingPage.style.display = "none";
            document.body.style.overflow = "auto";
            logoTriggerContainer.style.pointerEvents = "auto";
        });
    }

    function hideLoadingPageTwo() {
        var loadingPage = document.getElementById('kaamkaaj-loading').parentNode;
        loadingPage.style.animation = "slideUpAndFadeOut 0.5s ease-in-out";
        loadingPage.addEventListener("animationend", function () {
            loadingPage.style.display = "none";
            document.body.style.overflow = "auto";
            logoTriggerContainer.style.pointerEvents = "auto";
        });
        
    } 
    function centerImageVertically() {
        const screenHeight = window.innerHeight;
        const imageHeight = headerLogo.getBoundingClientRect().height;
        const logoYOffset = Math.max(0, (screenHeight - imageHeight) / 2.1);
    
        headerLogo.style.transform = `translateY(${logoYOffset}px)`;
        // headerLogo.style.transition = "opacity 1.2s ease";
    };

})();




// Toggle Switch (GRID <-> LIST)
(() => {

              
    function toggleSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
    
        if (targetSection && !targetSection.classList.contains('toggleActive')) {
            // 다른 활성화된 섹션들 비활성화
            const allSections = document.querySelectorAll('.section.toggleActive');
            allSections.forEach((section) => section.classList.remove('toggleActive'));
    
            // 클릭된 버튼에 해당하는 섹션 활성화
            targetSection.classList.add('toggleActive');
            updateButtonStyle(sectionId);
            navBarBgSwitch();
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 50);
        }
    }
    
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        section.scrollIntoView({ behavior: 'smooth' });

    }
    
    function updateButtonStyle(sectionId) {
        // 모든 버튼 비활성화
        const allButtons = document.querySelectorAll('.projects-toggle__btn');
        allButtons.forEach((button) => {
            button.classList.remove('toggleActive__btn');
        });
    
        // 클릭된 버튼 활성화
        const activeButton = document.getElementById(sectionId + '__btn');
        if (activeButton) {
            activeButton.classList.add('toggleActive__btn');
        }
    }

    function navBarBgSwitch() {
        const navBarBg = document.querySelector('.nav-bar__bg');

        if(navBarBg) {
            if(navBarBg.style.display === "block") {
                navBarBg.style.display = "none";
            } else {
                navBarBg.style.display = "none";
            }
        }
    }

    window.toggleSection = toggleSection;
    window.scrollToSection = scrollToSection;
})();


// // Carousel(BEFORE Desktop)
(() => {
    const carousels = document.querySelectorAll('.main-project__x4--item .carousel');

    window.addEventListener('resize', carouselResizer);
    document.addEventListener('DOMContentLoaded', carouselResizer);
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

    function carouselResizer() {
        carousels.forEach(carousel => {
            carousel.style.height = carousel.clientWidth + "px";
            carousel.style.objectFit = "cover";
        });
    }

    window.carouselSlide = carouselSlide;
})();








(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const observeElement1 = document.getElementById('section1');
        const observeElement2 = document.getElementById('section2');

        let mainProjects = document.querySelector('.main-projects');

        if (!mainProjects) {
            return;
        }

        const resizeObserver1 = new ResizeObserver(() => {
            if (window.getComputedStyle(observeElement1).display === 'block') {
                updateMainProjectsHeight(observeElement1.clientHeight);
            } 
        });

        const resizeObserver2 = new ResizeObserver(() => {
            if (window.getComputedStyle(observeElement2).display === 'block') {
                updateMainProjectsHeight(observeElement2.clientHeight);
            }
        });

        resizeObserver1.observe(observeElement1);
        resizeObserver2.observe(observeElement2);

        function updateMainProjectsHeight(sectionHeight) {
            if (mainProjects.clientHeight !== sectionHeight) {
                mainProjects.style.height = sectionHeight + 'px';
            }
        }

    });
})();


// Additional Toggle Buttons Handler
(() => {
    function toggleButtonsHandler() {
        const vh = window.innerHeight * 0.01;
        const welcomePageHeight = document.querySelector('.welcome-page').clientHeight;
        const newsSectionHeight = document.querySelector('.newsSection').clientHeight;
        const mainProjects = document.querySelector('.main-projects');
        const mainProjectsHeight = mainProjects.clientHeight;
        const sectionPrimary = document.getElementById('section1');
        const scrollPosition = window.scrollY;
        const screenHeight = window.innerHeight;

        const toggleButtons = document.querySelector('.projects-toggle__btns');
        
        let toggleStartOffset;
        let toggleHideOffset;

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        if (isTouchDevice) {
            toggleStartOffset = welcomePageHeight*0.9;
            toggleHideOffset = welcomePageHeight + mainProjectsHeight-100;
        } else {
            toggleStartOffset = welcomePageHeight + newsSectionHeight*0.9;
            toggleHideOffset = welcomePageHeight + newsSectionHeight + mainProjectsHeight-150;
        }

        function showToggleButtons() {
            toggleButtons.style.opacity = '1';
            toggleButtons.style.visibility = 'visible';
            toggleButtons.style.transform = 'translateX(0)';
        }
    
        function hideToggleButtons() {
            toggleButtons.style.opacity = '0';
            toggleButtons.style.visibility = 'hidden';
            toggleButtons.style.transform = 'translateX(-50px)';
        }
        
        if(scrollPosition > toggleStartOffset && scrollPosition < toggleHideOffset) {
            showToggleButtons();
        } else {
            hideToggleButtons();
        };

        const tagGallery = document.querySelector('.gallery');
        const tagGalleryRect = tagGallery.getBoundingClientRect();
        const navBarBg = document.querySelector('.nav-bar__bg');
        const wingingItContainer = document.querySelector('.winging-it-script__container');
        const wingingItContainerRect = wingingItContainer.getBoundingClientRect();
        const filterButtons = document.querySelector('.gallery-btns__container');

        const filterHideOffset = toggleHideOffset + 20;

        function showFilterButtons() {
            filterButtons.style.opacity = '1';
            filterButtons.style.visibility = 'visible';
            filterButtons.style.transform = 'translateX(0)';
        }
    
        function hideFilterButtons() {
            filterButtons.style.opacity = '0';
            filterButtons.style.visibility = 'hidden';
            filterButtons.style.transform = 'translateX(-50px)';
        }

        if(sectionPrimary.classList.contains('toggleActive')) {
            if(tagGalleryRect.top < 120 && scrollPosition < filterHideOffset) {
                showFilterButtons();
            } else {
                hideFilterButtons();
            }
            if(wingingItContainerRect.top < screenHeight*0.15 || tagGalleryRect.top > 120) {
                navBarBg.style.display = 'none';
            } else if(tagGalleryRect.top < 120) {
                navBarBg.style.display = 'block';
            } 
        } else {
            hideFilterButtons();
        }

    };
    window.addEventListener('scroll', toggleButtonsHandler);
    window.addEventListener('resize', toggleButtonsHandler);
    window.toggleButtonsHandler = toggleButtonsHandler;
})();



// Filter : GRID
(() => {

    function toggleActive(button) {
        // 모든 버튼에서 'active' 클래스 제거
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach((btn) => {
            btn.classList.remove('btn--active');
        });
    
        // 클릭된 버튼에 'active' 클래스 추가
        button.classList.add('btn--active');
        
        // 이후에 원하는 작업 수행
        // 예: 이미지 필터링 또는 다른 동작 수행
    }
    window.toggleActive = toggleActive;
    
    // 페이지 로드 시 모든 이미지 보여주기
    window.onload = initializeImages;

    // 각 이미지 초기 상태 설정
    function initializeImages() {
        const images = document.querySelectorAll('.main-project__x4--item');
        images.forEach((img) => (img.style.opacity = '1'));
    }

    // 이미지 필터링 함수
    function filterImages(category) {
        const images = document.querySelectorAll('.tag-img');
        const gallery = document.getElementById('project-gallery');

        gallery.style.opacity = '0';

        images.forEach((image) => {
            const img = image.querySelector('div');
            if (category === 'all' || image.classList.contains(category)) {
                setTimeout(() => {
                    image.style.display = 'grid';
                }, 300);
            } else {
                setTimeout(() => {
                    image.style.display = 'none';
                }, 400);
            }
        });

        setTimeout(() => {
            gallery.style.opacity = '1';
        }, 500);
    }

    window.filterImages = filterImages;
})();


// Show image on hover : LIST
(() => {
    const titles = document.querySelectorAll('.main-projects-list__item:first-child span');
    const images = document.querySelectorAll('.main-projects-list__img');
  
    titles.forEach((title, index) => {
        title.addEventListener('mouseover', () => {
            showImage(index);
        });
    });
  
    // 마우스가 타이틀을 벗어날 때 모든 이미지 숨김
    document.querySelector('.main-projects-list__item:first-child').addEventListener('mouseout', () => {
        hideImages();
    });
  
    function showImage(index) {
        images.forEach((img, i) => {
            if (i === index) {
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            } else {
                img.style.visibility = 'hidden';
                img.style.opacity = '0';
            }
        });
    }
  
    function hideImages() {
        images.forEach((img) => {
            img.style.visibility = 'hidden';
            img.style.opacity = '0';
        });
    }

})();


// Welcome Text Eraser
(() => {

    function textEraser() {
        const vh = window.innerHeight * 0.01;
        const screenHeight = window.innerHeight;
        const welcomePage = document.querySelector('.welcome-page');
        const welcomeTextContainer = document.querySelector('.welcome-text__container');
        const welcomeTextPara = document.querySelector('.welcome-text__container p');
    
        let eraserStartPoint, eraserEndPointOffset, eraserEndPoint, eraserRange;
    
        if (window.innerWidth > 767) {
            eraserStartPoint = screenHeight * 0.2;
            eraserEndPointOffset = screenHeight * 0.7;
            eraserEndPoint = screenHeight - eraserEndPointOffset;
            eraserRange = screenHeight - eraserEndPoint;
        } else {
            eraserStartPoint = screenHeight * 0.05;
            eraserEndPointOffset = screenHeight * 0.3;
            eraserEndPoint = screenHeight - eraserEndPointOffset;
            eraserRange = screenHeight - eraserEndPoint;
        }
    
        const scrollPosition = window.scrollY;
    
        const effectZone = Math.min(1, Math.max(0, (eraserRange - scrollPosition) / (eraserRange - eraserStartPoint)));
    
        const opacityValue = effectZone;
        const blurValue = (1 - effectZone) * 5;
    
        welcomeTextContainer.style.opacity = opacityValue;
        welcomeTextPara.style.filter = `blur(${blurValue}px)`;
    }
    
    window.addEventListener('scroll', textEraser);
    window.addEventListener('resize', textEraser);
    // textEraser();
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




(() => {
    const listSideImage = document.querySelector('.main-projects-list__side');
    const listSideImageRect = listSideImage.getBoundingClientRect();
    const navBar = document.querySelector('.nav-bar');

    window.addEventListener('scroll', sideImageHandler);

    function sideImageHandler() {
        if(listSideImageRect.top <= navBar.clientHeight) {
            listSideImage.style.position = "fixed";
            listSideImage.style.top = navBar.clientHeight + "px";
            listSideImage.style.right = 10 + "px";
        } else {
            listSideImage.style.position = "relative";
            listSideImage.style.top = "";
            listSideImage.style.right = 10 + "px";
        }
    }

} )();

(() => {
    const arrowCursor = document.querySelector('.custom-cursor');
    const navButtons = document.querySelectorAll('.nav-bar-btn');

    if(window.scrollY >= 0 && window.scrollY < window.innerHeight*2) {
        document.addEventListener('mousemove', (e) => {
            arrowCursor.style.left = e.clientX + 'px';
            arrowCursor.style.top = e.clientY + 'px';
        });
        navButtons.forEach(button => {
            button.addEventListener('mouseover', () => {
                arrowCursor.style.opacity = "0";
            })
            button.addEventListener('mouseleave', () => {
                arrowCursor.style.opacity = "1";
            })
        })
    }


    document.addEventListener('scroll', cursorHandler);

    function cursorHandler() {
        if (window.scrollY > window.innerHeight*0.6) {
            arrowCursor.style.display = "none"
            // document.body.style.cursor = "auto";
        } else {
            arrowCursor.style.display = "block"
            // document.body.style.cursor = "none";
        }
    } 

})();


