/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHeaderParser from './parsers/hero-header.js';
import heroCtaParser from './parsers/hero-cta.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-header': heroHeaderParser,
  'hero-cta': heroCtaParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'cards-articles': cardsArticlesParser,
  'tabs-testimonial': tabsTestimonialParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home-page',
  description: 'WKND Trendsetters home page with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA section.',
  urls: [
    'https://wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'hero-header',
      instances: ['#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'columns-article',
      instances: ['#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'],
    },
    {
      name: 'cards-articles',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) .faq-list'],
    },
    {
      name: 'hero-cta',
      instances: ['#main-content > section.section.inverse-section .grid-layout.desktop-1-column'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'hero-header',
      selector: '#main-content > header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-header'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'featured-article',
      selector: '#main-content > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'image-gallery-grid',
      selector: '#main-content > section.section.secondary-section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem'],
    },
    {
      id: 'rc5',
      name: 'testimonials-tabs',
      selector: '#main-content > section.section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: [],
    },
    {
      id: 'rc6',
      name: 'latest-articles-cards',
      selector: '#main-content > section.section.secondary-section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['cards-articles'],
      defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center'],
    },
    {
      id: 'rc7',
      name: 'faq-accordion',
      selector: '#main-content > section.section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['#main-content > section.section:nth-of-type(5) .grid-layout.tablet-1-column.grid-gap-xxl > div:first-child'],
    },
    {
      id: 'rc8',
      name: 'cta-inverse-section',
      selector: '#main-content > section.section.inverse-section',
      style: 'inverse',
      blocks: ['hero-cta'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
