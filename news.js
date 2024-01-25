
(() => {
    const newsSection = document.querySelector('.newsSection');
    const imageGroups = [
        ['img/image1.webp', 'img/image2.jpg', 'img/image3.jpg'],
        ['img/image4.jpg', 'img/image5.jpg', 'img/image6.jpg'],
        ['img/image7.jpg', 'img/image8.jpg', 'img/image9.jpg'],
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
        const newsMessage = document.querySelector('.news-message');
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child !== currentBox);
        currentBox.style.filter = "invert(1)";
        currentBox.style.opacity = "0.8";
        currentBox.style.zIndex = "";
        newsMessage.style.opacity = "0.3";

        siblingBoxes.forEach(sibling => {
            sibling.style.zIndex = "";
            sibling.style.opacity = "0.8";
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

    function nonActiveBox(event) {
        const newsMessage = document.querySelector('.news-message');
        const currentBox = event.target;
        const siblingBoxes = Array.from(currentBox.parentNode.children).filter(child => child !== currentBox);
        currentBox.style.filter = "invert(0)";
        currentBox.style.opacity = "1";
        newsMessage.style.opacity = "1";
        
        siblingBoxes.forEach(sibling => {
            sibling.style.opacity = "1";
            sibling.style.filter = "blur(0px)";
            // sibling의 자식들에게 filter를 적용
        });
    }

    window.handleMouseEnter = handleMouseEnter;
    window.handleMouseLeave = handleMouseLeave;
    window.playSlideshow = playSlideshow;
    window.stopSlideshow = stopSlideshow;
})();


(() => {
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
    
        element.addEventListener("mousedown", function(event) {
            event.preventDefault();
            isDragging = true;
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;
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
        console.log(currentBox);
        currentBox.style.visibility = "hidden";
        currentBox.style.animation = "";
        newsSection.style.backgroundImage = 'none';
        isDragging = false;

        draggableElements.forEach(element => {
            element.style.opacity = "1";
            element.style.filter = "blur(0px)";
        })


    
        setTimeout(() => {
            currentBox.style.left = Math.random() * 80 + "vw"; // Adjust the range as needed
            currentBox.style.top = Math.random() * 80 + "vh"; // Adjust the range as needed
            currentBox.style.visibility = "visible";
            currentBox.style.animation = "flicker 1s forwards";
            currentBox.addEventListener('animationend', onAnimationEnd);
        }, 1000);
    
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

    const welcomeSection = document.querySelector('.welcome-page');
    const newsSection = document.querySelector('.newsSection');
    const renderSection = document.querySelector('.renderSection');
    const newsMessageContainer = document.querySelector('.news-message__container');
    const newsMessage = document.querySelector('.news-message');
    const screenHeight = window.innerHeight;

    
    const vh = window.innerHeight * 0.01;
    

    
    window.addEventListener('scroll', newsMessageHandler);
    window.addEventListener('resize', newsMessageHandler);

    function newsMessageHandler() {
        if (newsSection.getBoundingClientRect().top < (screenHeight * 0.1)) {
            newsMessageContainer.style.animation = "flicker 1s forwards";
            newsMessageContainer.style.opacity = "1";
            newsMessage.style.opacity = "1";
        } else {
            newsMessageContainer.style.animation = "";
            newsMessage.style.opacity = "0";
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