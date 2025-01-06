const dropdownElement = document.querySelectorAll('.custom-dropdown__link');
const dropdownMainButton = document.querySelector('.custom-dropdown__button');
const selectElements = document.querySelector('.custom-dropdown__content');

dropdownElement.forEach(elementSelect => {
    elementSelect.addEventListener('click', () => {
        let tempText =  dropdownMainButton.textContent;
        dropdownMainButton.textContent = elementSelect.textContent;
        elementSelect.textContent = tempText;
        selectElements.classList.toggle('displayNone')
    })
})

dropdownMainButton.addEventListener('click', () => {
    selectElements.classList.toggle('displayNone')
})