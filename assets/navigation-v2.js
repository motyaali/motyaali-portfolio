(() => {
  const navigation = document.getElementById('site-nav');
  if (!navigation) return;

  const desiredOrder = ['Work', 'Résumé', 'About', 'Services', 'Contact'];
  const linksByLabel = new Map();

  navigation.querySelectorAll('a').forEach((link) => {
    const label = link.textContent.trim().replace('Resume', 'Résumé');
    if (label !== 'Home') linksByLabel.set(label, link);
  });

  const brand = document.querySelector('.brand[href$="index.html"]');
  const brandHref = brand?.getAttribute('href') || 'index.html';
  const rootPrefix = brandHref.endsWith('index.html') ? brandHref.slice(0, -'index.html'.length) : '';

  const defaults = {
    Work: 'work.html',
    'Résumé': 'resume.html',
    About: 'about.html',
    Services: 'services.html',
    Contact: 'contact.html'
  };

  desiredOrder.forEach((label) => {
    if (!linksByLabel.has(label)) {
      const link = document.createElement('a');
      link.href = `${rootPrefix}${defaults[label]}`;
      link.textContent = label;
      linksByLabel.set(label, link);
    }
  });

  navigation.replaceChildren(...desiredOrder.map((label) => linksByLabel.get(label)));
})();
