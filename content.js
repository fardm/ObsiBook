(() => {
  const getBookInfo = () => {
    try {
      const url = window.location.hostname;

      let title = "Unknown Title";
      let author = "Unknown Author";
      let cover = "No Cover Image";
      let pages = "Unknown Pages";

      if (url.includes("taaghche.com")) {
        // سلکتورهای سایت طاقچه
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
        // سلکتورهای سایت دیجی‌کالا
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

  const bookInfo = getBookInfo();

  // حذف کاراکترهای غیرمجاز از عنوان
  const sanitizeTitle = (title) => {
    return title.replace(/[\\/:*?"<>|]/g, '_'); // جایگزینی کاراکترهای نامعتبر با _
  };

  // Get custom settings from storage
  chrome.storage.sync.get(['vaultName', 'filePath', 'fileNameTemplate', 'template'], function(data) {
    const vaultName = data.vaultName || 'my vault'; // Default value
    const filePath = data.filePath || ''; // Default value (empty)
    const fileNameTemplate = data.fileNameTemplate || '{{title}}'; // Default value
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

    const markdownContent = template
      .replace(/{{title}}/g, bookInfo.title)
      .replace(/{{author}}/g, bookInfo.author)
      .replace(/{{pages}}/g, bookInfo.pages)
      .replace(/{{cover}}/g, bookInfo.cover);

    // کدگذاری محتوا برای استفاده در URL
    const encodedContent = encodeURIComponent(markdownContent);
    const encodedFilePath = encodeURIComponent(filePath ? `${filePath}/${fileName}` : fileName);

    // ساخت URL پروتکل Obsidian
    const obsidianUrl = `obsidian://new?vault=${vaultName}&file=${encodedFilePath}&content=${encodedContent}`;

    // ایجاد لینک و کلیک خودکار برای باز کردن Obsidian
    const a = document.createElement("a");
    a.href = obsidianUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();