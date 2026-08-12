(() => {
  'use strict';

  const groups = document.querySelectorAll('[data-interactive-service-group]');
  if (!groups.length) return;

  const mobileQuery = window.matchMedia('(max-width: 720px)');
  let escapeCloser = null;

  groups.forEach((group) => {
    const grid = group.querySelector('[data-service-tile-grid]');
    const panel = group.querySelector('[data-service-detail-panel]');
    const panelBody = panel?.querySelector('[data-service-detail-body]');
    const closeButton = panel?.querySelector('[data-service-detail-close]');
    const templates = new Map(
      [...group.querySelectorAll('template[data-service-detail]')].map((template) => [
        template.dataset.serviceDetail,
        template
      ])
    );
    const tiles = [...group.querySelectorAll('[data-service-tile]')];

    if (!grid || !panel || !panelBody || !tiles.length) return;

    const originalPanelParent = panel.parentElement;
    const originalPanelNextSibling = panel.nextSibling;
    let selectedTile = null;
    let closeForEscape = null;

    function restorePanelDesktopPosition() {
      if (panel.parentElement === originalPanelParent && panel.nextSibling === originalPanelNextSibling) return;
      if (originalPanelNextSibling && originalPanelNextSibling.parentElement === originalPanelParent) {
        originalPanelParent.insertBefore(panel, originalPanelNextSibling);
      } else {
        originalPanelParent.appendChild(panel);
      }
    }

    function gridItemForTile(tile) {
      if (!tile) return null;
      if (tile.parentElement === grid) return tile;
      const directGridChild = tile.parentElement;
      return directGridChild?.parentElement === grid ? directGridChild : null;
    }

    function placePanelForViewport(tile) {
      const gridItem = gridItemForTile(tile);
      if (mobileQuery.matches && gridItem) {
        gridItem.after(panel);
      } else {
        restorePanelDesktopPosition();
      }
    }

    function setExpandedState(activeTile) {
      tiles.forEach((tile) => {
        tile.setAttribute('aria-expanded', tile === activeTile ? 'true' : 'false');
      });
    }

    function closePanel({ returnFocus = false } = {}) {
      const priorTile = selectedTile;
      selectedTile = null;
      panel.hidden = true;
      panelBody.replaceChildren();
      setExpandedState(null);
      restorePanelDesktopPosition();
      if (escapeCloser === closeForEscape) escapeCloser = null;
      if (returnFocus && priorTile) priorTile.focus();
    }

    closeForEscape = () => closePanel({ returnFocus: true });

    function openPanel(tile) {
      const detailKey = tile.dataset.serviceTile;
      const template = templates.get(detailKey);
      if (!template) return;

      selectedTile = tile;
      panelBody.replaceChildren(template.content.cloneNode(true));
      panel.hidden = false;
      setExpandedState(tile);
      placePanelForViewport(tile);
      escapeCloser = closeForEscape;

      const heading = panelBody.querySelector('h3');
      if (heading) {
        heading.id = `${group.id || 'service-group'}-${detailKey}-detail-heading`;
        panel.setAttribute('aria-labelledby', heading.id);
      }

      if (mobileQuery.matches) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const isOpen = selectedTile === tile && !panel.hidden;
        if (isOpen) {
          closePanel({ returnFocus: true });
        } else {
          openPanel(tile);
        }
      });
    });

    closeButton?.addEventListener('click', () => closePanel({ returnFocus: true }));

    function handleViewportChange() {
      if (!selectedTile || panel.hidden) {
        restorePanelDesktopPosition();
        return;
      }
      placePanelForViewport(selectedTile);
    }

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleViewportChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleViewportChange);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && escapeCloser) {
      escapeCloser();
    }
  });
})();
