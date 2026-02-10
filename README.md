# ObsiBook
![image](preview.webp)

افزونه ObsiBook یک اکستنشن گوگل کروم است که اطلاعات مربوط به کتاب را از سایت‌های مشخص استخراج کرده و در قالب یک فایل مارکدان ارائه می‌دهد. اطلاعاتی مثل: عنوان کتاب، نام نویسنده، تعداد صفحات و تصویر کتاب.

این افزونه در اصل برای [نرم‌افزار obsidian](https://obsidian.md) طراحی شده و مستقیما فایل خروجی را در این نرم‌افزار ذخیره می‌کند. البته با تغییر حالت save mode در تنظیمات افزونه میتوانید فایل مارکدان را به تنهایی دانلود کنید.

  
این افزونه در حال حاضر از سایت های زیر پشتیبانی می‌کند:
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2fwww.goodreads.com%2f" width="18px" height="18px" align="center"> [گودریدز](https://www.goodreads.com/)
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2ftaaghche.com%2f" width="18px" height="18px" align="center"> [طاقچه](https://taaghche.com/)
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2ffidibo.com%2f" width="18px" height="18px" align="center"> [فیدیبو](https://fidibo.com/)
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2fwww.ketabrah.ir%2f" width="18px" height="18px" align="center"> [کتابراه](https://www.ketabrah.ir/)
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2fbehkhaan.ir%2f" width="18px" height="18px" align="center"> [بهخوان](https://behkhaan.ir/)
- <img src="https://www.google.com/s2/favicons?sz=64&amp;domain=https%3a%2f%2fwww.digikala.com%2f" width="18px" height="18px" align="center"> [دیجی کالا](https://www.digikala.com/)

<br/>

## وضعیت
برای سهولت بیشتر من پلاگین [Book Clipper](https://github.com/fardm/obsidian-book-clipper) را بر اساس همین عملکرد توسعه دادم. به جای اکستنشن میتوانید از این پلاگین استفاده کنید.

قبلا هم یک [اسکریپت](https://github.com/fardm/ObsiBook/tree/script) از همین اکستنشن آماده کرده بودم که نیاز به مرورگر ندارد و مسقیما در خود نرم افزار ابسیدین اجرا می شود. 
با این وجود توصیه من استفاده از همان پلاگین است. 

<br/>

## راهنمای استفاده


### گام اول: دانلود و فعال سازی

- برای دانلود از بخش code روی Download ZIP کلیک کنید.
- فایل ZIP را از حالت فشرده خارج کنید.
- در گوگل کروم از بخش تنظیمات Manage Extensions را باز کنید.
- حالت Developer mode را فعال کنید.
- روی Load unpacked کلیک کنید.
- فولدر افزونه را سلکت کنید.
- حالا افزونه فعال شده و میتوانید از آن استفاده کنید.

### گام دوم: تنظیمات افزونه
![image](options.webp)
قبل از استفاده از افزونه لازم است تنظیمات زیر را انجام دهید:
- روی آیکون افزونه راست کلیک کرده و Options را انتخاب کنید.
- ابتدا حالت ذخیره سازی را انتخاب کنید. حالت «Save in Obsidain» مستقیما فایل را در نرم افزار ابسیدین ذخیره میکند. حالت «Download Markdown File» فقط فایل مارکدان را دانلود می کند.
- در فیلد Vault Name نام والت خود را وارد کنید.
- در فیلد File Path مسیر فایل جدید را مشخص کنید. اگر خالی باشد به صورت پیشفرض در همان صفحه اصلی والت ساخته می‌شود.
- در فیلد File Name می توانید نام فایل را مشخص کنید. برای اینکار میتوانید از پارامترهای متغیر مثل عنوان کتاب یا نام نویسنده استفاده کنید. (در بخش Parameters Guideراهنمای کامل پاراپترها قابل مشاهده است)
- در فیلد Content می‌توانید محتوای فایل را مشخص کنید. مواردی که بین سه خط تیره(---) هستند به عنوان properties شناخته می شوند.
- در نهایت روی Save کلیک کنید تا تنظیمات ذخیره شود. 
- در صورت نیاز با کلیک روی Restore Defaults هم میتوانید تنظیمات پیش‌فرض را فراخوانی کنید.

### گام سوم: راه اندازی
یک صفحه کتاب را از سایت های بالا انتخاب کنید.

<p>روی آیکون افزونه (<img src="icon.png" alt="icon" style="width: 25px;" align="center">) کلیک کنید تا فایل نهایی را دریافت کنید</p>

<br/>