const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const form = document.querySelector('#appointment-form');
const status = document.querySelector('#form-status');
// Demo only: submissions are not sent anywhere until a real form endpoint is configured.
if (form && status) form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = 'This demo form is not connected yet. Connect a form endpoint before publishing.';
});