<%*
// ================= تنظیمات اصلی =================
const userInputUrl = await tp.system.prompt("لینک کتاب را وارد کنید");
if (!userInputUrl) {
    tR += "❌ لینک وارد نشد";
    return;
}

// ================= تشخیص سایت =================
function detectSource(url) {
    const patterns = {
        goodreads: /goodreads\.com\/book\/show\//i,
        taaghche: /taaghche\.com\/book\//i,
        fidibo: /fidibo\.com\/(books|book)\//i,
        amazon: /amazon\.com\/([a-zA-Z0-9-]+)\/dp\//i,
        behkhaan: /behkhaan\.ir\/books\//i
    };
    return Object.entries(patterns).find(([_, pattern]) => pattern.test(url))?.[0] || null;
}

// ================= توابع استخراج =================
async function fetchBookData(url, source) {
    try {
        const html = await tp.obsidian.request({
            url,
            method: "GET",
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const doc = new DOMParser().parseFromString(html, "text/html");
        
		// goodreads
        if (source === "goodreads") {
            return {
                title: doc.querySelector('h1[data-testid="bookTitle"]')?.textContent?.trim() || "Unknown",
                author: doc.querySelector('span[data-testid="name"]')?.textContent?.trim() || "Unknown",
                pages: doc.querySelector('p[data-testid="pagesFormat"]')?.textContent?.match(/\d+/)?.[0] || "Unknown",
                cover: doc.querySelector('img.ResponsiveImage')?.getAttribute("src") || ""
            };
        }
        
		// taaghche
		else if (source === "taaghche") {
		    let pages = "Unknown";
		    const infoElements = doc.querySelectorAll('div.moreInfo_info__BE9J3');
		    
		    for (const el of infoElements) {
		        const keyElement = el.querySelector('p.moreInfo_key__WX6Qk');
		        if (keyElement) {
		            const keyText = keyElement.textContent.trim();
		            
		            if (/تعداد\s*صفحه/i.test(keyText)) {
		                const valueElement = el.querySelector('p.moreInfo_value__ctk9e');
		                if (valueElement) {
		                    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
		                    const valueText = valueElement.textContent.trim();
		                    
		                    let convertedText = valueText;
		                    persianNumbers.forEach((num, index) => {
		                        convertedText = convertedText.replace(new RegExp(num, 'g'), index.toString());
		                    });
		                    
		                    const pageMatch = convertedText.match(/\d+/);
		                    if (pageMatch) {
		                        pages = pageMatch[0];
		                    }
		                }
		                break;
		            }
		        }
		    }
		    return {
		        title: doc.querySelector("h1")?.textContent?.trim() || "Unknown",
		        author: doc.querySelector("a[href*='/author/']")?.textContent?.trim() || "Unknown",
		        pages: pages,
		        cover: doc.querySelector("#book-image")?.getAttribute("src")?.replace(/\?.*$/, "") || ""
		    };
		}
		
		// fidibo
        else if (source === "fidibo") {
            const titleElement = doc.querySelector('h1.book-main-box-detail-title');
            const authorRow = Array.from(doc.querySelectorAll('tr.book-vl-rows-item'))
                .find(row => row.querySelector('td.book-vl-rows-item-title')?.textContent.includes("نویسنده"));
            const pagesRow = Array.from(doc.querySelectorAll('tr.book-vl-rows-item'))
                .find(row => row.querySelector('td.book-vl-rows-item-title')?.textContent.includes("تعداد صفحات"));
            
            return {
                title: titleElement?.textContent?.trim() || "Unknown",
                author: authorRow?.querySelector('a.book-vl-rows-item-subtitle, div.book-vl-rows-item-subtitle')?.textContent?.trim() || "Unknown",
                pages: pagesRow?.querySelector('div.book-vl-rows-item-subtitle')?.textContent?.match(/\d+/)?.[0] || "Unknown",
                cover: doc.querySelector('img.book-main-box-img')?.getAttribute("src")?.split('?')[0] || ""
            };
        }
        
		// amazon
		else if (source === "amazon") {
		    const title = doc.querySelector('span#productTitle')?.textContent.trim() || "Unknown";
		    
		    const authorElement = doc.querySelector('span.author a.a-link-normal');
		    const author = authorElement?.textContent.trim() || "Unknown";
		    
		    const pagesElement = doc.querySelector('div.rpi-attribute-value span');
		    let pages = "Unknown";
		    if (pagesElement) {
		        const pagesText = pagesElement.textContent.trim();
		        const pageMatch = pagesText.match(/\d+/);
		        pages = pageMatch ? pageMatch[0] : "Unknown";
		    }
		    
		    const coverElement = doc.querySelector('img#landingImage');
		    let cover = coverElement?.getAttribute('src') || "";
		    if (cover) {
		        const highResImage = coverElement.getAttribute('data-old-hires');
		        cover = highResImage || cover;
		    }
		    
		    return {
		        title: title,
		        author: author,
		        pages: pages,
		        cover: cover
		    };
		}
		
		//behkhaan
		else if (source === "behkhaan") {
		    const title = doc.querySelector('h1#title')?.textContent.trim() || "Unknown";
		
		    const authorElement = doc.querySelector('div.w-full.my-2 span.text-sm.md\\:text-base.text-gray-500');
		    const author = authorElement?.textContent.trim() || "Unknown";
		    
		    const pagesLabel = Array.from(doc.querySelectorAll('span.text-xs.md\\:text-sm.text-gray-500'))
		        .find(el => el.textContent.includes("تعداد صفحات"));
		    let pages = "Unknown";
		    if (pagesLabel) {
		        const pagesElement = pagesLabel.parentElement.nextElementSibling;
		        if (pagesElement) {
		            const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
		            let pagesText = pagesElement.textContent.trim();
		            persianNumbers.forEach((num, index) => {
		                pagesText = pagesText.replace(new RegExp(num, 'g'), index.toString());
		            });
		            const pageMatch = pagesText.match(/\d+/);
		            pages = pageMatch ? pageMatch[0] : "Unknown";
		        }
		    }
		    
		    let cover = doc.querySelector('img.w-full.h-full.object-cover.rounded-lg.cursor-pointer')?.getAttribute("src") || "";
		    if (cover && !cover.startsWith("http")) {
		        cover = `https://behkhaan.ir${cover}`;
		    }
		
		    return {
		        title: title,
		        author: author,
		        pages: pages,
		        cover: cover
		    };
		}
		
    } catch (error) {
        console.error(`Error fetching ${source}:`, error);
        return null;
    }
}

// ================= تابع ایجاد نام منحصر به فرد =================
async function getUniqueFilename(baseName) {
    let counter = 1;
    let newName = baseName;
    const files = app.vault.getFiles();
    
    while (files.some(file => file.name === newName + ".md")) {
        newName = `${baseName} ${counter}`;
        counter++;
    }
    
    return newName;
}

// ================= اجرای اصلی =================
const source = detectSource(userInputUrl);
if (!source) {
    tR += `⚠️ سایت پشتیبانی نمی‌شود. لینک باید از یکی از موارد زیر باشد:\n` +
          `- گودریدز (goodreads.com/book/show)\n` +
          `- طاقچه (taaghche.com/book)\n` +
          `- فیدیبو (fidibo.com/books)`;
    return;
}

const bookData = await fetchBookData(userInputUrl, source);
if (!bookData) {
    tR += "❌ خطا در دریافت داده. لطفاً:\n" +
          "1. اتصال اینترنت را بررسی کنید\n" +
          "2. VPN را روشن کنید (برای سایت‌های ایرانی)\n" +
          "3. لینک را دوباره چک کنید";
    return;
}

// ================= تغییر نام فایل =================
const cleanTitle = bookData.title.replace(/[\\/:*?"<>|]/g, "");
const uniqueFilename = await getUniqueFilename(cleanTitle);
await tp.file.rename(uniqueFilename);

// ================= خروجی نهایی =================
tR += `---
title: "${bookData.title}"
author: "${bookData.author}"
pages: ${bookData.pages}
cover: "${bookData.cover}"
tags:
  - Book
---

# خلاصه

`;
%>