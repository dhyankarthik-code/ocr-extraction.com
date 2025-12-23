# 404 Error Fix Guide - OCR Extraction

## ✅ What We've Done

### 1. **Dynamic Sitemap** (COMPLETED)
- Updated `app/sitemap.ts` to automatically fetch all blog posts from WordPress
- Now includes all blog URLs dynamically so Google knows they exist
- Sitemap will auto-update when you publish new blog posts

### 2. **301 Redirects Setup** (READY TO USE)
- Added `redirects()` function in `next.config.mjs`
- Ready for you to add old URLs once you find them in Search Console

---

## 📍 How to Find 404 URLs in Google Search Console

### Step-by-Step:

1. **Go to Google Search Console** (you're already there!)
   - URL: https://search.google.com/search-console

2. **Navigate to Pages Report:**
   - In the **left sidebar**, click **"Indexing"** → **"Pages"**
   
3. **Find 404 Errors:**
   - Scroll down to **"Why pages aren't indexed"**
   - Look for the row that says **"Not found (404)"**
   - Click on it to see the full list of URLs

4. **Export the List:**
   - Click the **export icon** (top right) to download as CSV
   - This will give you all the 404 URLs

---

## 🔧 How to Add 301 Redirects

Once you have the list of 404 URLs from Search Console:

### Example Scenario:
Let's say Search Console shows these 404 URLs:
- `/old-blog-post`
- `/2024/12/15/sample-post`
- `/blog/outdated-article`

### Steps:

1. **Open** `next.config.mjs`

2. **Find the `redirects()` section** (around line 61)

3. **Add your redirects** like this:

```javascript
async redirects() {
  return [
    {
      source: '/old-blog-post',
      destination: '/blog/new-blog-post',
      permanent: true, // 301 redirect
    },
    {
      source: '/2024/12/15/sample-post',
      destination: '/blog/sample-post',
      permanent: true,
    },
    {
      source: '/blog/outdated-article',
      destination: '/blog/updated-article',
      permanent: true,
    },
  ]
},
```

4. **Save the file**

5. **Deploy to Vercel** (push to GitHub or use `vercel --prod`)

---

## 🚀 Next Steps

### Immediate Actions:

1. **Check Search Console for 404s:**
   - Go to: Indexing → Pages → "Not found (404)"
   - Export the list

2. **Verify Sitemap:**
   - Visit: https://www.ocr-extraction.com/sitemap.xml
   - Confirm all blog posts are listed

3. **Submit Updated Sitemap to Google:**
   - In Search Console, go to **Indexing → Sitemaps**
   - Enter: `sitemap.xml`
   - Click **Submit**

4. **Add Redirects:**
   - For each 404 URL, add a redirect in `next.config.mjs`
   - Deploy the changes

---

## 📊 Monitoring

After implementing:

- **Wait 2-3 days** for Google to re-crawl
- **Check Search Console** weekly for new 404s
- **Monitor Google Analytics** to see if "404 - Page Not Found" views decrease

---

## 🔍 Common 404 Patterns to Watch For

### Blog-Related:
- Old WordPress date-based URLs: `/2024/12/15/post-name`
- Category URLs: `/category/tech/post-name`
- Tag URLs: `/tag/ocr/post-name`

### Site-Wide:
- Typos: `/contatc` instead of `/contact`
- Old pages: `/services`, `/pricing` (if you had these before)
- Bot scans: `/wp-admin`, `/login`, `/admin` (ignore these)

---

## ⚠️ Important Notes

- **Don't redirect bot scans** (like `/wp-admin`) - these are normal and harmless
- **Only redirect URLs that real users are hitting** (check Analytics)
- **Use 301 (permanent)** for SEO value transfer
- **Test redirects locally** before deploying

---

## 🆘 Need Help?

If you find a 404 URL and don't know where to redirect it:
1. Check if the content exists on your new site
2. If yes, redirect to the new URL
3. If no, redirect to a relevant category or homepage
4. If it's spam/bot traffic, ignore it

---

**Last Updated:** 2025-12-23
