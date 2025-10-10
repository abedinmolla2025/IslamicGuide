# 📱 APK হোস্টিং এবং ডিস্ট্রিবিউশন গাইড
# APK Hosting and Distribution Guide

এই গাইড আপনাকে দেখাবে কিভাবে আপনার Islamic Companion APK ফাইল হোস্ট করে users দের কাছে পৌঁছে দিতে পারবেন।

## 🎯 পদ্ধতি ১: GitHub Releases (সবচেয়ে জনপ্রিয়)

### ধাপ ১: APK তৈরি করুন
```bash
# Production build তৈরি করুন
./build-for-apk.sh

# PWABuilder দিয়ে APK generate করুন
# https://www.pwabuilder.com/
```

### ধাপ ২: GitHub Repository এ Release তৈরি করুন

1. আপনার GitHub repository তে যান
2. "Releases" → "Create a new release" ক্লিক করুন
3. Tag version দিন: `v1.0.0`
4. Release title: "Islamic Companion v1.0.0"
5. APK file upload করুন (drag & drop)
6. "Publish release" ক্লিক করুন

### ধাপ ৩: Download Link পান

Release তৈরি হওয়ার পর APK এর direct download link হবে:
```
https://github.com/YOUR_USERNAME/islamic-companion/releases/download/v1.0.0/islamic-companion.apk
```

### ধাপ ৪: Download Page আপডেট করুন

`client/src/pages/DownloadPage.tsx` ফাইলে এই link টি দিন:

```typescript
const APK_DOWNLOAD_URL = "https://github.com/YOUR_USERNAME/islamic-companion/releases/download/v1.0.0/islamic-companion.apk";
```

---

## 🎯 পদ্ধতি ২: Google Drive (সহজ)

### ধাপ ১: Google Drive এ Upload করুন
1. https://drive.google.com/ এ যান
2. APK file upload করুন
3. File এ right-click → "Get link" → "Anyone with the link" সিলেক্ট করুন
4. Link copy করুন

### ধাপ ২: Direct Download Link তৈরি করুন

Google Drive link এর format:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Direct download link:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

`FILE_ID` হল আপনার copied link থেকে `d/` এর পরের অংশ।

---

## 🎯 পদ্ধতি ৩: Replit Storage (দ্রুততম)

### ধাপ ১: APK কে Public Folder এ রাখুন
```bash
# public folder তৈরি করুন
mkdir -p dist/public/downloads

# APK file সেখানে copy করুন
cp islamic-companion.apk dist/public/downloads/
```

### ধাপ ২: Direct Link ব্যবহার করুন
আপনার Replit domain ব্যবহার করে:
```
https://YOUR_REPL_NAME.YOUR_USERNAME.repl.co/downloads/islamic-companion.apk
```

---

## 🎯 পদ্ধতি ৪: Firebase Hosting (প্রফেশনাল)

### ধাপ ১: Firebase Setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### ধাপ ২: APK Upload করুন
```bash
# downloads folder তৈরি করুন
mkdir -p public/downloads
cp islamic-companion.apk public/downloads/

# Deploy করুন
firebase deploy --only hosting
```

### ধাপ ৩: Download Link
```
https://YOUR_PROJECT.web.app/downloads/islamic-companion.apk
```

---

## 🎯 পদ্ধতি ৫: Custom Backend API (Advanced)

### ধাপ ১: Backend Route তৈরি করুন

`server/routes.ts` এ এই route যোগ করুন:

```typescript
import express from 'express';
import path from 'path';

app.get('/api/download-apk', (req, res) => {
  const filePath = path.join(__dirname, '../apk/islamic-companion.apk');
  res.download(filePath, 'islamic-companion.apk', (err) => {
    if (err) {
      res.status(500).send('APK download failed');
    }
  });
});
```

### ধাপ ২: Frontend থেকে Download করুন

```typescript
const handleDownload = () => {
  window.location.href = '/api/download-apk';
};
```

---

## 📊 Recommended Solution Summary

| পদ্ধতি | সুবিধা | অসুবিধা | Best For |
|------|--------|---------|----------|
| **GitHub Releases** | ✅ Free, Popular, Version control | ❌ GitHub account দরকার | Most users |
| **Google Drive** | ✅ Very easy, Free | ❌ Link expire হতে পারে | Quick testing |
| **Replit Storage** | ✅ Fastest, Same domain | ❌ Limited storage | Small files |
| **Firebase** | ✅ Professional, CDN | ❌ Setup time | Production apps |
| **Custom API** | ✅ Full control | ❌ Complex setup | Enterprise |

---

## 🚀 Quick Start (Recommended)

আমি সবচেয়ে সহজ পদ্ধতি recommend করছি **GitHub Releases**:

1. APK তৈরি করুন PWABuilder দিয়ে
2. GitHub এ একটি Release তৈরি করুন
3. APK upload করুন
4. Download link copy করুন
5. `DownloadPage.tsx` এ paste করুন
6. Done! ✅

---

## 🔐 Security Best Practices

1. **APK Signing**: APK sign করুন trusted keystore দিয়ে
2. **HTTPS Only**: শুধু HTTPS links ব্যবহার করুন
3. **Version Control**: প্রতিটি release এ version number দিন
4. **Checksum**: MD5/SHA256 checksum provide করুন users দের জন্য

---

## 📝 Next Steps

1. ✅ APK তৈরি করুন (PWABuilder/Capacitor)
2. ✅ উপরের যেকোনো পদ্ধতিতে APK হোস্ট করুন
3. ✅ `DownloadPage.tsx` এ download link আপডেট করুন
4. ✅ Test করে দেখুন download কাজ করছে কিনা
5. ✅ Users দের share করুন!

আরো সাহায্যের জন্য `BUILD_APK_GUIDE.md` দেখুন।
