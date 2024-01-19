
// Set --vh CSS variable
(() => {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', setVH);
    setVH();
})();



// Animation setup for paths in the main group
(() => {
    const setupMainPathsAnimation = () => {
        const kkScriptMainPaths = document.querySelectorAll('.kaamkaaj-script-path');

        kkScriptMainPaths.forEach((path, index) => {
            const length = path.getTotalLength();
            path.style.setProperty('--length', length);
            path.style.setProperty('--delay', `${index * 100}ms`);
            path.style.setProperty('--duration', `${length * 2}ms`);
        });
    };

    document.addEventListener('DOMContentLoaded', setupMainPathsAnimation);
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
    const loadingPage = document.getElementById('kaamkaaj-script').parentNode;
    loadingPage.id = 'loading-page';

    const minimumLoadingTime = 100;
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
        var loadingPage = document.getElementById('kaamkaaj-script').parentNode;

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






// Toggle Switch (GRID <-> LIST)
(() => {
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
              
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
        }
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


// Carousel
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
                console.log('MainProjects Height has changed:', sectionHeight);
                mainProjects.style.height = sectionHeight + 'px';
                console.log(mainProjects.clientHeight);
            }
        }

    });
})();


// Additional Toggle Buttons Handler
(() => {
    function toggleButtonsHandler() {
        const vh = window.innerHeight * 0.01;
        const welcomePageHeight = document.querySelector('.welcome-page').clientHeight;
        const renderSectionHeight = document.querySelector('.renderSection').clientHeight;
        const sectionPrimary = document.getElementById('section1');


        const scrollPosition = window.scrollY;
        const screenHeight = window.innerHeight;
        const toggleHideOffset = welcomePageHeight + renderSectionHeight*0.95;

        const toggleButtons = document.querySelector('.projects-toggle__btns');
        
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

        if(scrollPosition > vh * 120 && scrollPosition < toggleHideOffset) {
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

        const filterHideOffset = toggleHideOffset + 50;

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
        const images = document.querySelectorAll('.main-project__x3--item');
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
    document.addEventListener('DOMContentLoaded', function () {
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
    });

})();


// Welcome Text Eraser
(() => {

    function textEraser() {
        const vh = window.innerHeight * 0.01;
        const welcomePage = document.querySelector('.welcome-page');
        const welcomeTextContainer = document.querySelector('.welcome-text__container');
        const welcomeTextPara = document.querySelector('.welcome-text__container p')
        
        const textHiddenPosition = vh*50;
        let scrollPosition = window.scrollY;
        const effectScope = Math.min(1, Math.max(0, (welcomePage.clientHeight + textHiddenPosition - scrollPosition) / (welcomePage.clientHeight*0.8 + textHiddenPosition)));

        const opacityValue = effectScope;
        const blurValue = (1 - effectScope)*5;

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