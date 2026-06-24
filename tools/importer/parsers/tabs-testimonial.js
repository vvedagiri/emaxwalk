/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/
 * Container block (Tabs). 2 columns, each row = one tab.
 *   cell 1: tab label — field: title (Tab Name, plain text).
 *   cell 2: tab content — grouped content_* fields:
 *     content_heading (name), content_image (panel image), content_richtext (role + quote).
 *   content_headingType is collapsed (heading attribute) — no hint.
 */
export default function parse(element, { document }) {
  // Panels (content) live in .tabs-content; labels live in .tab-menu.
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link'));

  // Empty-block guard
  if (panes.length === 0 && menuLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const count = Math.max(panes.length, menuLinks.length);
  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const pane = panes[i];
    const menu = menuLinks[i];

    // --- Cell 1: tab label (field: title) ---
    // Use the tab label's name (first strong/bold text in the menu link).
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:title '));
    let labelText = '';
    if (menu) {
      const labelName = menu.querySelector('strong, .paragraph-sm strong, div div');
      labelText = (labelName ? labelName.textContent : menu.textContent).trim().split('\n')[0].trim();
    }
    labelCell.append(labelText || `Tab ${i + 1}`);

    // --- Cell 2: panel content (content_heading, content_image, content_richtext) ---
    const contentCell = document.createDocumentFragment();

    const image = pane ? pane.querySelector('img.cover-image, img') : null;
    // Name shown as heading inside panel.
    const nameEl = pane ? pane.querySelector('.paragraph-xl strong, strong') : null;
    // Role + quote make up the richtext.
    const roleEl = pane
      ? Array.from(pane.querySelectorAll('div > div')).find((d) => !d.querySelector('strong') && d.textContent.trim())
      : null;
    const quoteEl = pane ? pane.querySelector('p.paragraph-xl, p') : null;

    // content_heading (name) — field: content_heading
    if (nameEl) {
      const h = document.createElement('h3');
      h.textContent = nameEl.textContent.trim();
      contentCell.appendChild(document.createComment(' field:content_heading '));
      contentCell.appendChild(h);
    }

    // content_image — field: content_image
    if (image) {
      contentCell.appendChild(document.createComment(' field:content_image '));
      contentCell.appendChild(image);
    }

    // content_richtext — role + quote — field: content_richtext
    if (roleEl || quoteEl) {
      contentCell.appendChild(document.createComment(' field:content_richtext '));
      if (roleEl) {
        const roleP = document.createElement('p');
        roleP.textContent = roleEl.textContent.trim();
        contentCell.appendChild(roleP);
      }
      if (quoteEl) contentCell.appendChild(quoteEl);
    }

    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
