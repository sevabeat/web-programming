(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const loadTime = (window.performance.now() / 1000).toFixed(2);
        document.getElementById('LoadTime').innerText = loadTime+' s';

        const navLinks = document.querySelectorAll('.header__nav-link');
        navLinks.forEach((navLink) => {
            console.log(navLink.getAttribute('href'));
            if(navLink.getAttribute('href') === window.location.pathname){
                navLink.classList.add('header__nav-link_selected');
            }
        });
    });
})();