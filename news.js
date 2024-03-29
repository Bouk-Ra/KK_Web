
(() => {


    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
    
        element.addEventListener("mousedown", function(event) {
            // Check if the clicked element is not a link
            if (!event.target.closest('a')) {
                event.preventDefault();
                isDragging = true;
                offsetX = event.clientX - element.getBoundingClientRect().left;
                offsetY = event.clientY - element.getBoundingClientRect().top;
            }
        });
    
        document.addEventListener("mouseup", function() {
            isDragging = false;
        });
    
        document.addEventListener("mousemove", function(event) {
            if (isDragging) {
                let mouseX = event.clientX;
                let mouseY = event.clientY;
    
                element.style.left = (mouseX - offsetX) / window.innerWidth * 100 + "vw";
                element.style.top = (mouseY - offsetY) / window.innerHeight * 100 + "vh";
            }
        });
    }
    
    let draggableElements = document.querySelectorAll(".news-box");
    
    draggableElements.forEach(function(element) {
        makeDraggable(element);
    });
    
    
    
    function closeBox(event) {
        const newsSection = document.querySelector('.newsSection');
        const currentBox = findClosestParent(event.target, 'news-box');
    
        if (!currentBox) {
            console.error('Could not find the parent news-box element.');
            return;
        }

        currentBox.style.visibility = "hidden";
        currentBox.style.animation = "";
        currentBox.style.pointerEvents = "none";
        newsSection.style.backgroundImage = 'none';
        isDragging = false;

        draggableElements.forEach(element => {
            element.style.opacity = "1";
            element.style.filter = "blur(0px)";
        })

        setTimeout(() => {
            currentBox.style.pointerEvents = "auto";
            currentBox.style.left = Math.random() * 70 + "vw"; // Adjust the range as needed
            currentBox.style.top = Math.random() * 80 + "vh"; // Adjust the range as needed
            currentBox.style.visibility = "visible";
            currentBox.style.animation = "flicker .5s forwards";
            currentBox.addEventListener('animationend', onAnimationEnd);
        }, 1000);

        setTimeout(() => {
            currentBox.style.animation = "cloud 2s infinite";
        }, 1500);

        function onAnimationEnd() {
            currentBox.style.animation = ""; // 애니메이션 속성 삭제
            currentBox.removeEventListener('animationend', onAnimationEnd); // 이벤트 핸들러 제거
        }
    }

    function findClosestParent(element, className) {
        while (element && !element.classList.contains(className)) {
            element = element.parentNode;
        }
        return element;
    }

    window.closeBox = closeBox;
})();


(() => {
    const newsSection = document.querySelector('.newsSection');
    const imageGroups = [
        ['https://files.cargocollective.com/c1706458/kk_news_rukh_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_rukh_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_rukh_3.jpg'],
        ['https://files.cargocollective.com/c1706458/kk_news_lcc_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_lcc_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_lcc_3.jpg'],
        ['https://files.cargocollective.com/c1706458/kk_news_splice_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_splice_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_splice_3.jpg'],
        // Add more image groups as needed
    ];
    const currentIndex = [0, 0, 0];
    const isPlaying = [false, false, false];
    const animationInterval = 1000;

    function updateBackgroundImage(boxIndex, imageIndex) {
        newsSection.style.backgroundImage = `url(${imageGroups[boxIndex][imageIndex]})`;
    }

    function playSlideshow(boxIndex) {
        isPlaying[boxIndex] = true;
        updateBackgroundImage(boxIndex, 0);

        function animate(timestamp) {
        if (!lastTimestamp || timestamp - lastTimestamp >= animationInterval) {
            currentIndex[boxIndex] = (currentIndex[boxIndex] + 1) % imageGroups[boxIndex].length;
            updateBackgroundImage(boxIndex, currentIndex[boxIndex]);
            lastTimestamp = timestamp;
        }

        if (isPlaying[boxIndex]) {
            requestAnimationFrame(animate);
        }
        }

        let lastTimestamp;
        animate();
    }

    function stopSlideshow(boxIndex) {
        isPlaying[boxIndex] = false;
    }

    function handleMouseEnter(boxIndex) {
        updateBackgroundImage(boxIndex, 0);
        stopSlideshow(boxIndex);
        activeBox(event);
    }

    function handleMouseLeave(boxIndex) {
        if (!isPlaying[boxIndex]) {
        updateBackgroundImage(boxIndex, currentIndex[boxIndex]);
        newsSection.style.backgroundImage = 'none';
        }
        nonActiveBox(event);
    } 

    function activeBox(event) {
        const newsState = document.querySelector('.news-state');
        newsState.style.opacity = "0";
        newsState.style.animation = "none";
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child.classList.contains('news-box') && child !== currentBox);
        currentBox.style.filter = "invert(1)";
        currentBox.style.opacity = "0.8";
        currentBox.style.zIndex = "";
        

        siblingBoxes.forEach(sibling => {
            sibling.style.zIndex = "";
            sibling.style.opacity = "0.3";
            sibling.style.filter = "blur(3px)";
            // sibling의 자식들에게 filter를 적용
        });

        // UPCOMING 강조
        if(currentBox.classList.contains('news-soon')) {
            const newsCategory = currentBox.querySelector('.news-category');
            newsCategory.style.animation = "flicker .5s infinite";
        }

        increaseZIndex(event);
        function increaseZIndex(event) {
            const currentBox = event.target;
            const currentZIndex = parseInt(currentBox.style.zIndex) || 0;
            currentBox.style.zIndex = currentZIndex + 997; 
        }
        
    }

    function nonActiveBox(event) {
        const newsState = document.querySelector('.news-state');
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child !== currentBox);
        currentBox.style.filter = "invert(0)";
        currentBox.style.opacity = "1";
        newsState.style.opacity = "1";
        
        siblingBoxes.forEach(sibling => {
            sibling.style.opacity = "1";
            sibling.style.filter = "blur(0px)";
            // sibling의 자식들에게 filter를 적용
        });

        // UPCOMING 강조
        if(currentBox.classList.contains('news-soon')) {
            const newsCategory = currentBox.querySelector('.news-category');
            newsCategory.style.animation = "";
        }
    }



    function handleMouseEnterExcp(event) {
        activeBoxExcp(event);
    }

    function handleMouseLeaveExcp(event) {
        nonActiveBoxExcp(event);
    }


    function activeBoxExcp(event) {
        const newsState = document.querySelector('.news-state');
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child !== currentBox);
        currentBox.style.filter = "invert(1)";
        currentBox.style.opacity = "0.8";
        currentBox.style.zIndex = "";

        siblingBoxes.forEach(sibling => {
            sibling.style.zIndex = "";
            sibling.style.opacity = "0.3";
            sibling.style.filter = "blur(3px)";
            // sibling의 자식들에게 filter를 적용
        });
        increaseZIndex(event);
        function increaseZIndex(event) {
            const currentBox = event.target;
            const currentZIndex = parseInt(currentBox.style.zIndex) || 0; // 현재 zIndex 값을 가져옴
            currentBox.style.zIndex = currentZIndex + 997; // 1을 뺀 값을 다시 설정
        }
    }

    function nonActiveBoxExcp(event) {
        const newsState = document.querySelector('.news-state');
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child !== currentBox);
        currentBox.style.filter = "invert(0)";
        currentBox.style.opacity = "1";
        newsState.style.opacity = "1";
        
        siblingBoxes.forEach(sibling => {
            sibling.style.opacity = "1";
            sibling.style.filter = "blur(0px)";
            // sibling의 자식들에게 filter를 적용
        });
    }


    window.handleMouseEnter = handleMouseEnter;
    window.handleMouseLeave = handleMouseLeave;
    window.handleMouseEnterExcp = handleMouseEnterExcp;
    window.handleMouseLeaveExcp = handleMouseLeaveExcp;
    window.playSlideshow = playSlideshow;
    window.stopSlideshow = stopSlideshow;
})();


(() => {
    let draggableElements = document.querySelectorAll(".news-box");
    
    function boxAnimator() {
        draggableElements.forEach(element => {
            if(element.getBoundingClientRect().top < window.innerHeight * 0.9) {
                element.style.animation = "cloud 2s infinite";
            }
        });
    }
    window.addEventListener('scroll', boxAnimator);
})();

(() => {

    const welcomeSection = document.querySelector('.welcome-page');
    const newsSection = document.querySelector('.newsSection');
    const renderSection = document.querySelector('.renderSection');
    const newsState = document.querySelector('.news-state');
    const newsNews = document.querySelector('.news-state--news');
    const screenHeight = window.innerHeight;

    
    const vh = window.innerHeight * 0.01;
    

    
    window.addEventListener('scroll', newsMessageHandler);
    window.addEventListener('resize', newsMessageHandler);

    function newsMessageHandler() {
        if (newsSection.getBoundingClientRect().top < (screenHeight * 0.1)) {
            newsState.style.animation = "flicker 0.5s forwards";
            newsState.style.opacity = "1";
        } else {
            newsState.style.animation = "";
            // newsNews.style.opacity = "0";
        }
        const scrollPosition = window.scrollY;
        const newsCloseLine = welcomeSection.clientHeight + newsSection.clientHeight + vh * 120;
        if (scrollPosition > newsCloseLine) {
            newsSection.style.visibility = "hidden";
        } else {
            newsSection.style.visibility = "visible";
        }
        
    };
    
})();

(() => {
    const newsSection = document.querySelector('.newsSection');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const welcomeSection = document.querySelector('.welcome-page');
        const renderSection = document.querySelector('.renderSection');
        const sectionOne = document.getElementById('section1');
        const sectionTwo = document.getElementById('section2');
        const norme = Math.max(-40, (scrollPosition / welcomeSection.clientHeight) * -40);
        let red = 255 + norme;
        let green = 255 + norme;
        let blue = 255 + norme;
        document.body.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
        if (renderSection.getBoundingClientRect().top < 100) {
            document.body.style.backgroundColor = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
        } else {
            if(window.innerWidth < 768) {
                document.body.style.backgroundColor = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
            }
        }
    });
})();



(() => {
    const newsSection = document.querySelector('.newsSection');
    const bodyCopy = document.querySelector('.bodycopy');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const welcomeSection = document.querySelector('.welcome-page');
        const renderSection = document.querySelector('.renderSection');
        const sectionOne = document.getElementById('section1');
        const sectionTwo = document.getElementById('section2');
        const norme = Math.max(-40, (scrollPosition / welcomeSection.clientHeight) * -40);
        let red = 255 + norme;
        let green = 255 + norme;
        let blue = 255 + norme;
        bodyCopy.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
        if (renderSection.getBoundingClientRect().top < 100) {
            bodyCopy.style.backgroundColor = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
        } else {
            if(window.innerWidth < 768) {
                bodyCopy.style.backgroundColor = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
            }
        }
    });
})();



// 이미지 로딩을 위한 Promise를 반환하는 함수
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
    });
}

// 페이지 로드가 완료된 후 실행되는 함수
document.addEventListener("DOMContentLoaded", async () => {
    const imageGroups = [
        ['https://files.cargocollective.com/c1706458/kk_news_rukh_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_rukh_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_rukh_3.jpg'],
        ['https://files.cargocollective.com/c1706458/kk_news_lcc_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_lcc_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_lcc_3.jpg'],
        ['https://files.cargocollective.com/c1706458/kk_news_splice_1.jpg', 'https://files.cargocollective.com/c1706458/kk_news_splice_2.jpg', 'https://files.cargocollective.com/c1706458/kk_news_splice_3.jpg'],
        // Add more image groups as needed
    ];

    // 이미지 그룹을 순회하며 이미지를 로드
    for (const group of imageGroups) {
        for (const imageUrl of group) {
            await loadImage(imageUrl);
        }
    }

    // 이미지들이 로드된 후에 추가적인 작업 수행
    console.log('All images preloaded!');

    // ... 나머지 초기화 또는 로딩 프로세스 ...
});


