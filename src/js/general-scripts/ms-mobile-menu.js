/*********************************/
/* Mobile menu burger            */
/*********************************/
const mobileMenuButton = document.querySelector('.mobile-burger');
const mobileMenuNavbar = document.querySelector('.header-menu');
const mobileSpanAnimation = () => {
    mobileMenuButton.children[0].classList.toggle('mobile-menu-span-first');
    mobileMenuButton.children[1].classList.toggle('mobile-menu-span-second');
    mobileMenuButton.children[2].classList.toggle('mobile-menu-span-third');
}

mobileMenuButton.addEventListener('click', ()=>{
    /*button animation*/
    mobileSpanAnimation();
    mobileMenuNavbar.classList.toggle('displayShow');
})
/**********************************/
/* Mobile menu burger Close Start */
/**********************************/


//Main function that disable burger menu
const mobileMenuCloseFunction = () => {
    if(
        mobileMenuButton.children[0].classList.contains('mobile-menu-span-first') &&
        mobileMenuNavbar.classList.contains('displayShow')
    ){
        mobileSpanAnimation();
        mobileMenuNavbar.classList.remove('displayShow');
    }
}
/*
* ESC button close mobile menu
* */
document.addEventListener('keydown', function(event){
    if(event.key === "Escape"){ mobileMenuCloseFunction(); }
})
/*
* Resize window if mobile menu was not closed on resize window
* */
const checkAndCloseMenu = () => { if(window.innerWidth > 920){ mobileMenuCloseFunction(); } }
window.onload = checkAndCloseMenu;
window.onresize = checkAndCloseMenu;
/*
* Close menu if someone press over menu
* */
document.addEventListener('click', function(event){
    if(!document.querySelector('.header-menu').contains(event.target) &&
        !document.querySelector('.mobile-burger').contains(event.target))
    { mobileMenuCloseFunction(); }
})