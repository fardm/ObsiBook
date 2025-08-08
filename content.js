(() => {
  // Supported sites whitelist
  const supportedSites = [
    "taaghche.com",
    "digikala.com",
    "goodreads.com", 
    "fidibo.com",
    "behkhaan.ir",
    "ketabrah.ir"
  ];

  const isSiteSupported = () => {
    const currentHostname = window.location.hostname;
    return supportedSites.some(site => currentHostname.includes(site));
  };

  if (!isSiteSupported()) {
    console.warn("This website is not supported by the extension.");
    return;
  }

  const getBookInfo = () => {
    try {
      const url = window.location.hostname;

      let title = "Unknown Title";
      let author = "Unknown Author";
      let cover = "No Cover Image";
      let pages = "Unknown Pages";

      if (url.includes("taaghche.com")) {
        // taaghche
        title = document.querySelector("h1")?.textContent.trim().replace(/\s+/g, " ") || "Unknown Title";
        const authorElement = document.querySelector("a[href*='/author/']");
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";
        const coverElement = document.querySelector("#book-image");
        cover = coverElement ? coverElement.getAttribute("src").replace(/\?w=\d+/, "") : "No Cover Image";
        const pagesElement = Array.from(document.querySelectorAll("div.moreInfo_info__BE9J3"))
          .find(el => el.querySelector("p.moreInfo_key__WX6Qk")?.textContent.includes("تعداد صفحه‌ها"))
          ?.querySelector("p.moreInfo_value__ctk9e");
        pages = pagesElement ? pagesElement.textContent.trim().replace(/\s?صفحه$/, "").trim() : "Unknown Pages";
      } else if (url.includes("digikala.com")) {
        // digikala
        const titleElement = document.querySelector("h1.text-h4.text-neutral-900.mb-2.pointer-events-none");
        title = titleElement ? titleElement.textContent.trim() : "Unknown Title";
        const coverElement = document.querySelector("img.w-full.rounded-large.overflow-hidden.inline-block");
        cover = coverElement ? coverElement.getAttribute("src").split('?')[0] : "No Cover Image";
        const authorLabel = Array.from(
          document.querySelectorAll(
            "p.ml-4.text-body-1.text-neutral-500.py-2.lg\\:py-3.lg\\:p-2.shrink-0"
          )
        );
        const authorElement = authorLabel.find(el => el.textContent.includes("نویسنده"))?.nextElementSibling?.querySelector("p");
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";
        const pagesLabel = Array.from(
          document.querySelectorAll(
            "p.ml-4.text-body-1.text-neutral-500.py-2.lg\\:py-3.lg\\:p-2.shrink-0"
          )
        );
        const pagesElement = pagesLabel.find(el => el.textContent.includes("تعداد صفحه"))?.nextElementSibling?.querySelector("p");
        pages = pagesElement ? pagesElement.textContent.trim() : "Unknown Pages";
      } else if (url.includes("goodreads.com")) {
        // goodreads
        const titleElement = document.querySelector('h1[data-testid="bookTitle"]');
        title = titleElement ? titleElement.textContent.trim() : "Unknown Title";

        const authorElement = document.querySelector('span[data-testid="name"]');
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";

        const pagesElement = document.querySelector('p[data-testid="pagesFormat"]');
        if (pagesElement) {
            const pagesText = pagesElement.textContent.trim();
            const pagesMatch = pagesText.match(/\d+/);
            pages = pagesMatch ? pagesMatch[0] : "Unknown Pages";
        } else {
            pages = "Unknown Pages";
        }

        const coverElement = document.querySelector('img.ResponsiveImage');
        cover = coverElement ? coverElement.getAttribute("src") : "No Cover Image";
      } else if (url.includes("fidibo.com")) {
        // fidibo
        const titleElement = document.querySelector('h1.book-main-box-detail-title');
        title = titleElement ? titleElement.textContent.trim() : "Unknown Title";

        const authorRow = Array.from(document.querySelectorAll('tr.book-vl-rows-item'))
            .find(row => {
                const titleCell = row.querySelector('td.book-vl-rows-item-title');
                return titleCell && titleCell.textContent.includes("نویسنده");
            });
        const authorElement = authorRow?.querySelector('a.book-vl-rows-item-subtitle, div.book-vl-rows-item-subtitle');
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";

        const pagesRow = Array.from(document.querySelectorAll('tr.book-vl-rows-item'))
            .find(row => {
                const titleCell = row.querySelector('td.book-vl-rows-item-title');
                return titleCell && titleCell.textContent.includes("تعداد صفحات");
            });
        const pagesElement = pagesRow?.querySelector('div.book-vl-rows-item-subtitle');
        if (pagesElement) {
            const pagesText = pagesElement.textContent.trim();
            const pagesMatch = pagesText.match(/\d+/);
            pages = pagesMatch ? pagesMatch[0] : "Unknown Pages";
        } else {
            pages = "Unknown Pages";
        }

        const coverElement = document.querySelector('img.book-main-box-img');
        if (coverElement) {
            const coverSrc = coverElement.getAttribute("src");
            cover = coverSrc ? coverSrc.split('?')[0] : "No Cover Image"; // حذف بخش ?width=192
        } else {
            cover = "No Cover Image";
        }
      } else if (url.includes("behkhaan.ir")) {
        // behkhaan
        const titleElement = document.querySelector('h1#title');
        title = titleElement ? titleElement.textContent.trim() : "Unknown Title";

        const authorElement = document.querySelector('div.w-full.my-2 span.text-sm.md\\:text-base.text-gray-500');
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";

        const pagesLabel = Array.from(document.querySelectorAll('span.text-xs.md\\:text-sm.text-gray-500'))
            .find(el => el.textContent.includes("تعداد صفحات"));
        const pagesElement = pagesLabel?.parentElement?.nextElementSibling;
        pages = pagesElement ? pagesElement.textContent.trim() : "Unknown Pages";

        const coverElement = document.querySelector('img.w-full.h-full.object-cover.rounded-lg.cursor-pointer');
        cover = coverElement ? coverElement.getAttribute("src") : "No Cover Image";
      } else if (url.includes("ketabrah.ir")) {
        // ketabrah
        const rows = Array.from(document.querySelectorAll('tr'));

        const titleRow = rows.find(row => row.querySelector('td')?.textContent.trim() === "نام کتاب");
        if (titleRow) {
          const titleElement = titleRow.querySelector('td[itemprop="name"]');
          title = titleElement ? titleElement.textContent.trim() : "Unknown Title";
        }

        const authorRow = rows.find(row => row.querySelector('td')?.textContent.trim() === "نویسنده");
        if (authorRow) {
          const authorElement = authorRow.querySelector('span[itemprop="author"]');
          author = authorElement ? authorElement.textContent.trim() : "Unknown Author";
        }

        const pagesRow = rows.find(row => row.querySelector('td')?.textContent.trim() === "تعداد صفحات");
        if (pagesRow) {
          const pagesElement = pagesRow.querySelector('td:nth-child(2)');
          pages = pagesElement ? pagesElement.textContent.trim() : "Unknown Pages";
        }

        const coverElement = document.querySelector('a.book-cover');
        cover = coverElement ? coverElement.getAttribute("href") : "No Cover Image";
      } else {
        console.warn("Unsupported website.");
      }

      return { title, author, cover, pages };
    } catch (error) {
      console.error("Error extracting book info:", error);
      return {
        title: "Error extracting title",
        author: "Error extracting author",
        cover: "Error extracting cover",
        pages: "Error extracting pages",
      };
    }
  };

  // Function to create and open Obsidian link
  const createObsidianLink = (bookInfo) => {
    const sanitizeTitle = (title) => {
      return title.replace(/[\\/:*?"<>|]/g, '_'); // Replace invalid characters
    };

    // Custom settings
    chrome.storage.sync.get(['vaultName', 'filePath', 'fileNameTemplate', 'template'], function(data) {
      const vaultName = data.vaultName || '';
      const filePath = data.filePath || '';
      const fileNameTemplate = data.fileNameTemplate || '{{title}}';
      const template = data.template || `---
title: {{title}}
author: {{author}}
pages: {{pages}}
cover: {{cover}}
tags:
  - Book
---`;

      // Generate file name based on the template
      const fileName = fileNameTemplate
        .replace(/{{title}}/g, sanitizeTitle(bookInfo.title))
        .replace(/{{author}}/g, sanitizeTitle(bookInfo.author))
        .replace(/{{pages}}/g, bookInfo.pages)
        .replace(/{{cover}}/g, bookInfo.cover);

      // Generate markdown content with sanitized title
      const markdownContent = template
        .replace(/{{title}}/g, sanitizeTitle(bookInfo.title))
        .replace(/{{author}}/g, bookInfo.author)
        .replace(/{{pages}}/g, bookInfo.pages)
        .replace(/{{cover}}/g, bookInfo.cover);

      // Encode content for URL use
      const encodedContent = encodeURIComponent(markdownContent);
      const encodedFilePath = encodeURIComponent(filePath ? `${filePath}/${fileName}` : fileName);
      const obsidianUrl = `obsidian://new?vault=${vaultName}&file=${encodedFilePath}&content=${encodedContent}`;
      const a = document.createElement("a");
      a.href = obsidianUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Function to download Markdown file
  const downloadMarkdownFile = (bookInfo) => {
    const sanitizeTitle = (title) => {
      return title.replace(/[\\/:*?"<>|]/g, '_');
    };


    chrome.storage.sync.get(['fileNameTemplate', 'template'], function(data) {
      const fileNameTemplate = data.fileNameTemplate || '{{title}}';
      const template = data.template || `---
title: {{title}}
author: {{author}}
pages: {{pages}}
cover: {{cover}}
tags:
  - Book
---`;

      let fileName = fileNameTemplate
        .replace(/{{title}}/g, sanitizeTitle(bookInfo.title))
        .replace(/{{author}}/g, sanitizeTitle(bookInfo.author))
        .replace(/{{pages}}/g, bookInfo.pages)
        .replace(/{{cover}}/g, bookInfo.cover);

      if (!fileName.endsWith('.md')) {
        fileName += '.md';
      }

      const markdownContent = template
        .replace(/{{title}}/g, sanitizeTitle(bookInfo.title))
        .replace(/{{author}}/g, bookInfo.author)
        .replace(/{{pages}}/g, bookInfo.pages)
        .replace(/{{cover}}/g, bookInfo.cover);

      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  chrome.storage.sync.get(['saveMode'], function(data) {
    const saveMode = data.saveMode || 'obsidian';
    const bookInfo = getBookInfo();

    if (saveMode === 'download') {
      downloadMarkdownFile(bookInfo);
    } else {
      createObsidianLink(bookInfo);
    }
  });
})();