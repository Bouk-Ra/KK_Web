// Body Overflow Auto
(() => {
    window.addEventListener('DOMContentLoaded', bodyHandler);

    function bodyHandler() {
        document.body.style.overflow = "auto";
    }
})(); 


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