const opacityMainAnimation = (opacityElement, opacityClass) => {
    [...opacityElement].forEach(opacityElementSingle => {
        opacityElementSingle.getBoundingClientRect().top < window.innerHeight - 150
            ? opacityElementSingle.classList.add(opacityClass) : null;
    })
};

const opacityAnimation = () => {
    const opacityElement = document.querySelectorAll(`.animationOpacityBlock`);
    opacityElement.length > 0 ? opacityMainAnimation(opacityElement, "animationOpacity") : null;
};

const leftAnimation = () => {
    const opacityElement = document.querySelectorAll(`.animationLeftBlock`);
    opacityElement.length > 0 ? opacityMainAnimation(opacityElement, "animationLeft") : null;
};

const rightAnimation = () => {
    const opacityElement = document.querySelectorAll(`.animationRightBlock`);
    opacityElement.length > 0 ? opacityMainAnimation(opacityElement, "animationRight") : null;
};

opacityAnimation();
leftAnimation();
rightAnimation();

window.addEventListener("scroll", opacityAnimation);
window.addEventListener("scroll", leftAnimation);
window.addEventListener("scroll", rightAnimation);
