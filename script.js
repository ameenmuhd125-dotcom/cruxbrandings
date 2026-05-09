document.addEventListener("DOMContentLoaded", () => {
    const floatElements = document.querySelectorAll(".float-element");

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX - windowHalfX);
        mouseY = (e.clientY - windowHalfY);
    });

    // Render loop for smooth parallax physics
    function render() {
        // Interpolate for smooth trailing effect
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        floatElements.forEach(el => {
            // Speed controls the depth / weight of the element in zero-G
            const speed = parseFloat(el.getAttribute("data-speed")) || 1;
            
            // Calculate translation limits
            const x = (targetX * speed * 0.04);
            const y = (targetY * speed * 0.04);
            
            // Apply to CSS variables so it composites nicely with CSS @keyframes animations
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
            
            // Add slight 3D rotation for cards to enhance depth
            if(el.classList.contains('glass-card')) {
                const rotateX = (targetY * speed * -0.01);
                const rotateY = (targetX * speed * 0.01);
                
                el.style.setProperty('--mouse-rot-x', `${rotateX}deg`);
                el.style.setProperty('--mouse-rot-y', `${rotateY}deg`);
            }
        });

        requestAnimationFrame(render);
    }

    // Start render loop
    render();

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Lower inc to slow and smooth the animation
                    const inc = target / speed;

                    if (count < target) {
                        // Add inc to count and output in counter
                        counter.innerText = Math.ceil(count + inc);
                        // Call function every ms
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
