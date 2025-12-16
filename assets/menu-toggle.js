document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.menu-toggle');
  buttons.forEach(btn => {
    const header = btn.closest('header');
    if (!header) return;
    const nav = header.querySelector('nav');
    if (!nav) return;
    
    // Toggle function
    const toggle = () => {
      const hidden = nav.classList.toggle('hidden');
      document.body.classList.toggle('menu-hidden', hidden);
      btn.setAttribute('aria-expanded', (!hidden).toString());
    };
    btn.addEventListener('click', toggle);
    
    // Auto-hide menu on scroll down
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // If scrolling down and menu is visible, hide it
      if (currentScroll > lastScrollTop && !nav.classList.contains('hidden')) {
        nav.classList.add('hidden');
        document.body.classList.add('menu-hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
  });
});
