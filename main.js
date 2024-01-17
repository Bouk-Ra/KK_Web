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
        var loadingPage = document.querySelector(".kaamkaaj-script__loading");

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
          const scrollPosition = renderSectionElement.offsetTop + renderSectionElement.clientHeight;
      
          // Scroll to the calculated position
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      });
      
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


// Add BG color to nav-bar when Tag Sticky
(() => {
    function navBarModifier() {
        const tagGallery = document.querySelector('.gallery');
        const tagGalleryRect = tagGallery.getBoundingClientRect();

        const navBarBg = document.querySelector('.nav-bar__bg');

        if (tagGalleryRect.top < 100) {
            navBarBg.style.display = 'block';
        } else {
            navBarBg.style.display = 'none';
        }
    }

    window.addEventListener('scroll', navBarModifier);
    window.navBarModifier = navBarModifier;
    navBarModifier();
})();

    // function tagItemsHandler() {
    //     const tagItems = document.querySelector('.main-project__tag--items');
    //     const rect = tagItems.getBoundingClientRect();

    //     console.log("Top:", rect.top);
    //     console.log("Window Height:", window.innerHeight);

    //     if (rect.top < window.innerHeight * 0.8) {
    //         tagItems.style.opacity = '0';
    //         tagItems.classList.add('sticky_elem'); // 클래스 추가
    //         console.log("Tag Items:", tagItems);
    //         console.log("Window Height:", window.innerHeight);
    //     }
    // }

    // window.addEventListener('scroll', tagItemsHandler);

    // // 초기에도 한 번 호출
    // tagItemsHandler();

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


// (() => {
//     function updateOpacity() {
//         const welcomeText = document.querySelector('.welcome-text__container');
//         const welcomePage = document.querySelector('.welcome-page');
//         const beforeRenderSection = document.querySelector('.renderSection');
//         const welcomePageHeight = welcomePage.clientHeight;
//         const beforeRenderSectionHeight = beforeRenderSection.clientHeight;
        
//         const primarySectionHeight = welcomePageHeight + beforeRenderSectionHeight;

//         const scrollPosition = window.scrollY;


//         const opacityValue = Math.max(0, 0.4 - (scrollPosition - welcomePageHeight) / welcomePageHeight);
//         welcomeText.style.opacity = opacityValue;

//     }
//     // 스크롤 이벤트에 대한 리스너 등록
//     window.addEventListener('scroll', updateOpacity);

//     // 화면 리사이즈 이벤트에 대한 리스너 등록
//     window.addEventListener('resize', updateOpacity);

//     // 초기 로딩 시 한 번 호출하여 초기 상태 업데이트
//     updateOpacity();
// })();

(() => {
    function updateOpacity() {
        const welcomeTextContainer = document.querySelector('.welcome-text__container');
        const welcomeTextPara = document.querySelector('.welcome-text__container p')
        const welcomePage = document.querySelector('.welcome-page');
        const beforeRenderSection = document.querySelector('.renderSection');
        const welcomePageHeight = welcomePage.clientHeight * 0.8;
        const beforeRenderSectionHeight = beforeRenderSection.clientHeight * 0.9;
        
        const primarySectionHeight = welcomePageHeight + beforeRenderSectionHeight;

        const scrollPosition = window.scrollY;
        
        if (scrollPosition > welcomePageHeight) {
            const opacityValue = Math.max(0, (primarySectionHeight - scrollPosition) / beforeRenderSectionHeight);
            welcomeTextContainer.style.opacity = opacityValue;
            const blurValue = Math.min(20, (scrollPosition - welcomePageHeight) / beforeRenderSectionHeight * 20);
            welcomeTextPara.style.filter = `blur(${blurValue}px)`;
        } else {
            welcomeTextContainer.style.opacity = '1';
            welcomeTextPara.style.filter = 'blur(0px)';
        }
    }

    window.addEventListener('scroll', updateOpacity);
    window.addEventListener('resize', updateOpacity);
    updateOpacity();
})();

(() => {
    function updateOpacity() {
        const toggleButtons = document.querySelector('.projects-toggle__btns');
        const welcomePage = document.querySelector('.welcome-page');
        const beforeRenderSection = document.querySelector('.renderSection');
        const welcomePageHeight = welcomePage.clientHeight;
        const beforeRenderSectionHeight = beforeRenderSection.clientHeight;

        const primarySectionHeight = welcomePageHeight + beforeRenderSectionHeight*0.2;

        const scrollPosition = window.scrollY;

        if(scrollPosition > primarySectionHeight) {
            toggleButtons.style.opacity = 1;
            toggleButtons.style.visibility = 'visible';
            toggleButtons.style.transform = 'translateX(0)';

        } else {
            toggleButtons.style.opacity = 0;
            toggleButtons.style.visibility = 'hidden';
            toggleButtons.style.transform = 'translateX(-100px)';

        }
    }
    // 스크롤 이벤트에 대한 리스너 등록
    window.addEventListener('scroll', updateOpacity);

    // 화면 리사이즈 이벤트에 대한 리스너 등록
    window.addEventListener('resize', updateOpacity);

    // 초기 로딩 시 한 번 호출하여 초기 상태 업데이트
    updateOpacity();
})();