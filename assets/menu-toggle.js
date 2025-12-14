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
  });
});
