const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

function closeNavigation() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeNavigation();
      menuButton.focus();
    }
  });
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = !(filter === 'all' || card.dataset.category.includes(filter));
    });
  });
});

const queryParameters = new URLSearchParams(window.location.search);
const requestedSubject = queryParameters.get('subject')?.trim();

if (requestedSubject) {
  const safeSubject = requestedSubject.slice(0, 120);
  document.querySelectorAll('.subject-link').forEach((link) => {
    link.href = `mailto:motyaali@pm.me?subject=${encodeURIComponent(safeSubject)}`;
  });

  const heading = document.getElementById('contact-heading');
  const intro = document.getElementById('contact-intro');
  const context = document.getElementById('contact-context');
  if (heading) heading.textContent = safeSubject;
  if (intro) intro.textContent = 'Your inquiry topic has been added to the email subject line. Please include the organization, process, role, or evidence item you would like to discuss.';
  if (context) context.textContent = `Email topic: ${safeSubject}`;
}

document.getElementById('year')?.append(String(new Date().getFullYear()));
