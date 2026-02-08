// Слайдер
let currentSlide = 0;
let slideInterval;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Показываем текущий слайд
    function showSlide(n) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убираем активный класс у всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Корректируем индекс
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }
        
        // Показываем нужный слайд
        slides[currentSlide].classList.add('active');
        
        // Активируем соответствующую точку
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Автопрокрутка
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 4000); // Меняем каждые 4 секунды
    }
    
    // Останавливаем автопрокрутку при наведении
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startAutoSlide();
        });
    });
    
    // Начинаем автопрокрутку
    showSlide(0);
    startAutoSlide();
}

// Модальные окна (оставляем вашу логику, но добавляем небольшие улучшения)
document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        }
    });
});

document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
        const modalId = el.dataset.close;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Восстанавливаем скролл
        }
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Кнопка "Наверх"
window.addEventListener('scroll', () => {
    const toTopBtn = document.querySelector('.to-top');
    if (toTopBtn) {
        toTopBtn.classList.toggle('show', window.scrollY > 400);
    }
});

// Исправляем кнопку "Вверх" - убираем href и добавляем обработчик
document.querySelector('.to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Плавная прокрутка (ваш код, оставляем как есть)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Кнопки сброса формы (ваш код, оставляем как есть)
document.querySelectorAll('.reset').forEach(btn => {
    btn.addEventListener('click', () => {
        const form = btn.closest('form');
        if (form) {
            form.reset();
        }
    });
});

// Функция регистрации с улучшенной валидацией
function register(e, modalId) {
    e.preventDefault();
    
    const form = e.target;
    
    // Проверяем валидность
    if (!form.checkValidity()) {
        // Подсвечиваем невалидные поля
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.style.borderColor = '#ff4444';
                // Убираем подсветку при исправлении
                input.addEventListener('input', function() {
                    if (this.checkValidity()) {
                        this.style.borderColor = '';
                    }
                });
            }
        });
        
        form.reportValidity();
        return false;
    }
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = {
        fio: formData.get('fio'),
        type: formData.get('type'),
        date: formData.get('date'),
        event: modalId === 'reg1' ? 'Большие семейные выходные' :
               modalId === 'reg2' ? 'День семьи, любви и верности' :
               modalId === 'reg3' ? 'День России — Семейный праздник' :
               'Торжества в ЗАГС'
    };
    
    // Сохраняем в localStorage (имитация отправки)
    let registrations = JSON.parse(localStorage.getItem('familyRegistrations') || '[]');
    registrations.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('familyRegistrations', JSON.stringify(registrations));
    
    // Показываем сообщение
    alert(`Регистрация на "${data.event}" успешно отправлена! Спасибо!`);
    
    // Закрываем модальное окно
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Сбрасываем форму
    form.reset();
    
    // Убираем красные рамки
    form.querySelectorAll('input, select').forEach(input => {
        input.style.borderColor = '';
    });
    
    return false;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    
    // Добавляем валидацию в реальном времени
    document.querySelectorAll('form input, form select').forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.checkValidity()) {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});