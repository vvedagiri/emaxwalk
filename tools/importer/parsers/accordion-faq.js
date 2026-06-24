/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/
 * Container block (Accordion). 2 columns, each row = one FAQ item.
 *   cell 1: summary (question) — field: summary
 *   cell 2: text (answer richtext) — field: text
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> with a <summary> (question) and .faq-answer (answer).
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, details.faq-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary .faq-question span, summary span, .faq-question, summary');
    const answer = item.querySelector('.faq-answer');

    // Cell 1: question. Field: summary.
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.append(summary ? summary.textContent.trim() : '');

    // Cell 2: answer. Field: text.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (answer) {
      Array.from(answer.childNodes).forEach((node) => textCell.appendChild(node));
    }

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
