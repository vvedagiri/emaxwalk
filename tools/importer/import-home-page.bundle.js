/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home-page.js
  var import_home_page_exports = {};
  __export(import_home_page_exports, {
    default: () => import_home_page_default
  });

  // tools/importer/parsers/hero-header.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const image = element.querySelector("img.cover-image, img");
    if (!heading && !subheading && ctaLinks.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctaLinks.forEach((a) => textCell.appendChild(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-header", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse2(element, { document }) {
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector('.card-body h1, .card-body h2, h1, h2, [class*="heading"]');
    const subheading = element.querySelector(".card-body p.subheading, .card-body p, p.subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!image && !heading && !subheading && ctaLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctaLinks.forEach((a) => textCell.appendChild(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse3(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const image = element.querySelector("img.cover-image, img");
    let textColumn = columns.find((col) => !col.querySelector("img"));
    if (!textColumn && columns.length > 1) {
      textColumn = image && image.closest(":scope > div") === columns[0] ? columns[1] : columns[1];
    }
    if (!image && !textColumn) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = image || "";
    const textCell = textColumn ? Array.from(textColumn.childNodes) : "";
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse4(element, { document }) {
    const cardDivs = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cardDivs.forEach((cardDiv) => {
      const image = cardDiv.querySelector("img.cover-image, img");
      if (!image) return;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
      cells.push([imageCell, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse5(element, { document }) {
    const cardLinks = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cardLinks.forEach((card) => {
      const image = card.querySelector("img.cover-image, img");
      const tag = card.querySelector(".tag");
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      const heading = card.querySelector('h3, h2, h4, [class*="heading"]');
      const href = card.getAttribute("href");
      let imageCell = "";
      if (image) {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:image "));
        frag.appendChild(image);
        imageCell = frag;
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (tag) {
        const tagP = document.createElement("p");
        tagP.append(tag.textContent.trim());
        textCell.appendChild(tagP);
      }
      if (date) {
        const dateP = document.createElement("p");
        dateP.append(date.textContent.trim());
        textCell.appendChild(dateP);
      }
      if (heading) {
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          const h = document.createElement(heading.tagName.toLowerCase());
          h.appendChild(link);
          textCell.appendChild(h);
        } else {
          textCell.appendChild(heading);
        }
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse6(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane"));
    const menuLinks = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link"));
    if (panes.length === 0 && menuLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const count = Math.max(panes.length, menuLinks.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const pane = panes[i];
      const menu = menuLinks[i];
      const labelCell = document.createDocumentFragment();
      labelCell.appendChild(document.createComment(" field:title "));
      let labelText = "";
      if (menu) {
        const labelName = menu.querySelector("strong, .paragraph-sm strong, div div");
        labelText = (labelName ? labelName.textContent : menu.textContent).trim().split("\n")[0].trim();
      }
      labelCell.append(labelText || `Tab ${i + 1}`);
      const contentCell = document.createDocumentFragment();
      const image = pane ? pane.querySelector("img.cover-image, img") : null;
      const nameEl = pane ? pane.querySelector(".paragraph-xl strong, strong") : null;
      const roleEl = pane ? Array.from(pane.querySelectorAll("div > div")).find((d) => !d.querySelector("strong") && d.textContent.trim()) : null;
      const quoteEl = pane ? pane.querySelector("p.paragraph-xl, p") : null;
      if (nameEl) {
        const h = document.createElement("h3");
        h.textContent = nameEl.textContent.trim();
        contentCell.appendChild(document.createComment(" field:content_heading "));
        contentCell.appendChild(h);
      }
      if (image) {
        contentCell.appendChild(document.createComment(" field:content_image "));
        contentCell.appendChild(image);
      }
      if (roleEl || quoteEl) {
        contentCell.appendChild(document.createComment(" field:content_richtext "));
        if (roleEl) {
          const roleP = document.createElement("p");
          roleP.textContent = roleEl.textContent.trim();
          contentCell.appendChild(roleP);
        }
        if (quoteEl) contentCell.appendChild(quoteEl);
      }
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse7(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, details.faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary .faq-question span, summary span, .faq-question, summary");
      const answer = item.querySelector(".faq-answer");
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.append(summary ? summary.textContent.trim() : "");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (answer) {
        Array.from(answer.childNodes).forEach((node) => textCell.appendChild(node));
      }
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer.footer",
        ".breadcrumbs"
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
        img.remove();
      });
      element.querySelectorAll("*").forEach((el) => {
        el.getAttributeNames().filter((name) => name.startsWith("data-astro-cid")).forEach((name) => el.removeAttribute(name));
        el.removeAttribute("style");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument;
    const resolved = sections.map((section) => ({
      section,
      el: document.querySelector(section.selector)
    }));
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (el.nextSibling) {
          el.parentNode.insertBefore(metadataBlock, el.nextSibling);
        } else {
          el.parentNode.appendChild(metadataBlock);
        }
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/import-home-page.js
  var parsers = {
    "hero-header": parse,
    "hero-cta": parse2,
    "columns-article": parse3,
    "cards-gallery": parse4,
    "cards-articles": parse5,
    "tabs-testimonial": parse6,
    "accordion-faq": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home-page",
    description: "WKND Trendsetters home page with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA section.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-header",
        instances: ["#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-articles",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-cta",
        instances: ["#main-content > section.section.inverse-section .grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "hero-header",
        selector: "#main-content > header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-header"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "featured-article",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "image-gallery-grid",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "rc5",
        name: "testimonials-tabs",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "latest-articles-cards",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-articles"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"]
      },
      {
        id: "rc7",
        name: "faq-accordion",
        selector: "#main-content > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#main-content > section.section:nth-of-type(5) .grid-layout.tablet-1-column.grid-gap-xxl > div:first-child"]
      },
      {
        id: "rc8",
        name: "cta-inverse-section",
        selector: "#main-content > section.section.inverse-section",
        style: "inverse",
        blocks: ["hero-cta"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_page_exports);
})();
