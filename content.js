(() => {
  // لیست سفید سایت‌های پشتیبانی شده
  const supportedSites = [
    "taaghche.com",
    "digikala.com",
    "goodreads.com", 
    "fidibo.com"
  ];

  // بررسی اینکه سایت فعلی در لیست سفید است یا نه
  const isSiteSupported = () => {
    const currentHostname = window.location.hostname;
    return supportedSites.some(site => currentHostname.includes(site));
  };

  // اگر سایت پشتیبانی نشده باشد، افزونه هیچ کاری انجام نمی‌دهد
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
      } else if (url.includes("goodreads.com")) {
        // سلکتورهای سایت Goodreads
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
        // سلکتورهای سایت فیدیبو
        const titleElement = document.querySelector('h1.book-main-box-detail-title');
        title = titleElement ? titleElement.textContent.trim() : "Unknown Title";

        // استخراج نویسنده
        const authorRow = Array.from(document.querySelectorAll('tr.book-vl-rows-item'))
            .find(row => {
                const titleCell = row.querySelector('td.book-vl-rows-item-title');
                return titleCell && titleCell.textContent.includes("نویسنده");
            });
        const authorElement = authorRow?.querySelector('a.book-vl-rows-item-subtitle, div.book-vl-rows-item-subtitle');
        author = authorElement ? authorElement.textContent.trim() : "Unknown Author";

        // استخراج تعداد صفحات
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

        // استخراج تصویر کتاب
        const coverElement = document.querySelector('img.book-main-box-img');
        if (coverElement) {
            const coverSrc = coverElement.getAttribute("src");
            cover = coverSrc ? coverSrc.split('?')[0] : "No Cover Image"; // حذف بخش ?width=192
        } else {
            cover = "No Cover Image";
        }
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

  // تابع برای ایجاد و باز کردن لینک Obsidian
  const createObsidianLink = () => {
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
  };

  // اگر سایت فیدیبو بود، یکبار صفحه را رفرش کنید و سپس افزونه را اجرا کنید
  if (window.location.hostname.includes("fidibo.com")) {
    if (!sessionStorage.getItem("pageRefreshed")) {
      sessionStorage.setItem("pageRefreshed", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("pageRefreshed");
      createObsidianLink();
    }
  } else {
    // برای سایت‌های دیگر، مستقیماً لینک Obsidian را ایجاد کنید
    createObsidianLink();
  }
})();