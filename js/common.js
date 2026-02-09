// Появление элементов
// if (window.matchMedia("(max-width: 1200.9px) and (max-height: 1000.9px), (max-height: 600.9px)").matches) {
//     var options = {threshold: 0.1};
// }
// else {
//     options = {threshold: 0.2};
// }
// var callback = function(entries) {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('_transform');
//         }
//     });
//     if (document.querySelector('.home-section1 .container').classList.contains('_transform')) {
//         observer.unobserve(document.querySelector('.home-section1 .container'));
//     }
// };
// var observer = new IntersectionObserver(callback, options);
// var animItems = document.querySelectorAll('.anim-item');
// animItems.forEach(animItem => {
//     observer.observe(animItem);
// });

// Бургер-меню
// const burgerIcon = document.querySelector('.header__burger-icon');
// const burgerContent = document.querySelector('.header__burger-content');
// const wrapper = document.querySelector('.wrapper');
// const header = document.querySelector('header');
// const consultationBtn = document.querySelector('.consultation-btn');
// burgerIcon.addEventListener('click', function() {
//     document.body.classList.toggle('_lock');
//     burgerIcon.classList.toggle('_active');
// 	burgerContent.classList.toggle('_active');
//     if (this.classList.contains('_active')) {
//         wrapper.style.cssText = `padding-right: ${scrollbarWidth}px;`;
//         header.style.cssText = `padding-right: ${scrollbarWidth}px;`;
//         consultationBtn.style.cssText = `margin-right: ${scrollbarWidth}px;`;
//     }
//     else {
//         wrapper.style.cssText = '';
//         header.style.cssText = '';
//         consultationBtn.style.cssText = '';
//     }
// });

// Функция открытия модальных окон
const body = document.body;
const header = document.querySelector('header');
let currentOpenOverlay = null;
let isTransitioning = false;
function openOverlay(overlay, initialFocusElement) {
    if (isTransitioning) return;
    currentOpenOverlay = overlay;
    isTransitioning = true;
    var duration = 350;
    if (overlay.id === 'nav-menu') {
        duration = 850;
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = scrollbarWidth + 'px';
    if (header) header.style.paddingRight = scrollbarWidth + 'px';
    body.classList.add('_lock');
    overlay.classList.add('_is-open');
    overlay.setAttribute('aria-hidden', 'false');
    if (initialFocusElement) {
        setTimeout(function() {
            initialFocusElement.focus();
        }, 100);
    }
    setTimeout(function() {
        isTransitioning = false;
    }, duration);
}

// Функция закрытия модальных окон
let lastFocusedElement = null;
const openFeedbackBtn = document.getElementById('feedback-btn');
function closeOverlay(overlay) {
    if (isTransitioning) return;
    isTransitioning = true;
    var duration = 350;
    if (overlay.id === 'nav-menu') {
        duration = 850;
    }
    overlay.classList.remove('_is-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement) {
        if (getComputedStyle(lastFocusedElement).visibility !== 'hidden') lastFocusedElement.focus();
        else if (openFeedbackBtn) openFeedbackBtn.focus();
        lastFocusedElement = null;
    }
    setTimeout(function() {
        body.style.paddingRight = '';
        if (header) header.style.paddingRight = '';
        body.classList.remove('_lock');
        currentOpenOverlay = null;
        isTransitioning = false;
    }, duration);
}

// Функция вызывает функцию закрытия модального окна и очищает поля ввода формы
function finishModalProcess(overlayIsOpen) {
    const successBlock = overlayIsOpen.querySelector('.modal-content__success');
    const successBlockIsVisible = successBlock && successBlock.offsetHeight > 0;
    closeOverlay(overlayIsOpen);
    if (successBlockIsVisible) {
        const form = overlayIsOpen.querySelector('form');
        const title = overlayIsOpen.querySelector('.modal-content__title');
        setTimeout(() => {
            if (form) {
                form.reset();
                form.style.display = '';
            }
            if (title) title.style.display = '';
            successBlock.style.display = '';
        }, 300);
    }
}

// Открытие и закрытие меню
const openMenuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const menuOverlay = document.getElementById('nav-menu');
if (openMenuBtn && closeMenuBtn && menuOverlay) {
    openMenuBtn.addEventListener('click', () => {
        lastFocusedElement = openMenuBtn;
        openOverlay(menuOverlay, closeMenuBtn);
    });
    closeMenuBtn.addEventListener('click', () => closeOverlay(menuOverlay));
}

// Блок "Формы обратной связи"
const feedback = document.getElementById('feedback');
if (feedback && openFeedbackBtn) {
    // Открытие формы обратной связи
    const openFormBtns = document.querySelectorAll('[data-overlay]');
    openFormBtns.forEach((openFormBtn) => {
        openFormBtn.addEventListener('click', () => {
            const formOverlayId = openFormBtn.getAttribute('data-overlay');
            const formOverlay = document.getElementById(formOverlayId);
            const modalContent = formOverlay.querySelector('.modal-content');
            if (formOverlay && modalContent) {
                lastFocusedElement = openFormBtn;
                openOverlay(formOverlay, modalContent);
                feedback.classList.remove('_visible');
                openFeedbackBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
    document.addEventListener('click', (e) => {
        // Закрытие формы обратной связи: если сообщение "Успех" показано, то при закрытии модального окна происходит очистка полей ввода
        if (isTransitioning) return;
        if (currentOpenOverlay && currentOpenOverlay.classList.contains('form-overlay') && (!e.target.closest('.modal-content') && !e.target.closest('[data-overlay]') || e.target.closest('.modal-content__close-btn') || e.target.closest('.success__btn'))) {
            finishModalProcess(currentOpenOverlay);
            return;
        }
        // Появление и исчезновение элемента "feedback" на моб.устройствах
        if (e.target.closest('#feedback-btn')) {
            feedback.classList.toggle('_visible');
            if (feedback.classList.contains('_visible')) {
                openFeedbackBtn.setAttribute('aria-expanded', 'true');
            }
            else openFeedbackBtn.setAttribute('aria-expanded', 'false');
            return;
        }
        if (feedback.classList.contains('_visible') && !e.target.closest('#feedback')) {
            feedback.classList.remove('_visible');
            openFeedbackBtn.setAttribute('aria-expanded', 'false');
            openFeedbackBtn.focus();
        }
    });
    // Отправка формы обратной связи; в случае закрытия модального окна с помощью кнопки «Понятно» происходит очистка полей ввода
    const allForms = document.querySelectorAll('.modal-content form');
    allForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const modalContent = this.closest('.modal-content');
            const title = modalContent.querySelector('.modal-content__title');
            const successBlock = modalContent.querySelector('.modal-content__success');
            const successBtn = modalContent.querySelector('.success__btn');
            this.style.display = 'none';
            if (title) title.style.display = 'none';
            if (successBlock) successBlock.style.display = 'flex';
            if (successBtn) successBtn.focus();
        });
    });
}

// Клавиатура
document.addEventListener('keydown', function(e) {
    if (currentOpenOverlay) {
        if (e.key === 'Escape') {
            if (isTransitioning) return;
            if (currentOpenOverlay.id === 'nav-menu') closeOverlay(currentOpenOverlay);
            else finishModalProcess(currentOpenOverlay);
            return;
        }
        if (e.key === 'Tab') {
            let first, last;
            if (currentOpenOverlay.id === 'nav-menu') {
                first = currentOpenOverlay.querySelector('#close-menu-btn');
                const menuLinks = currentOpenOverlay.querySelectorAll('nav a');
                last = menuLinks[menuLinks.length - 1] || first;
            }
            else {
                first = currentOpenOverlay.querySelector('.modal-content__close-btn');
                last = currentOpenOverlay.querySelector('.group__btn');
                if (!last || last.offsetHeight === 0) {
                    last = currentOpenOverlay.querySelector('.success__btn');
                }
            }
            if (first && last) {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
                else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
        return; 
    }
    if (e.key === 'Escape' && feedback && openFeedbackBtn && feedback.classList.contains('_visible')) {
        feedback.classList.remove('_visible');
        openFeedbackBtn.setAttribute('aria-expanded', 'false');
        openFeedbackBtn.focus();
    }
});