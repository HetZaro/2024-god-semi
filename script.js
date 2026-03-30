let currentSlide = 0;
let slideInterval;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }
        
        slides[currentSlide].classList.add('active');
        
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 4000); // Меняем каждые 4 секунды
    }
    
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startAutoSlide();
        });
    });
    
    showSlide(0);
    startAutoSlide();
}

document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
});

document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
        const modalId = el.dataset.close;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
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

window.addEventListener('scroll', () => {
    const toTopBtn = document.querySelector('.to-top');
    if (toTopBtn) {
        toTopBtn.classList.toggle('show', window.scrollY > 400);
    }
});

document.querySelector('.to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

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

document.querySelectorAll('.reset').forEach(btn => {
    btn.addEventListener('click', () => {
        const form = btn.closest('form');
        if (form) {
            form.reset();
        }
    });
});

function register(e, modalId) {
    e.preventDefault();
    
    const form = e.target;
    
    if (!form.checkValidity()) {
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
    
    let registrations = JSON.parse(localStorage.getItem('familyRegistrations') || '[]');
    registrations.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('familyRegistrations', JSON.stringify(registrations));
    
    alert(`Регистрация на "${data.event}" успешно отправлена! Спасибо!`);
    
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
    
    form.reset();
    
    form.querySelectorAll('input, select').forEach(input => {
        input.style.borderColor = '';
    });
    
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
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
