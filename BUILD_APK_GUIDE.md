# 📱 Android APK তৈরির সম্পূর্ণ গাইড
# How to Build Android APK from Islamic Companion Web App

এই গাইড অনুসরণ করে আপনি Islamic Companion web app থেকে Android APK তৈরি করতে পারবেন।

## 🎯 পদ্ধতি ১: PWABuilder দিয়ে APK তৈরি (সবচেয়ে সহজ)

### ধাপ ১: Production Build তৈরি করুন

```bash
# .env ফাইল আপডেট করুন
echo "VITE_API_URL=https://islamicguide-qqag.onrender.com" > client/.env

# Production build তৈরি করুন
npm run build
```

### ধাপ ২: PWABuilder ব্যবহার করুন

1. **PWABuilder ওয়েবসাইটে যান:**
   - https://www.pwabuilder.com/

2. **আপনার Web App URL দিন:**
   - যদি Replit এ deploy করেন: আপনার Replit URL দিন
   - অথবা Render/Vercel/Netlify তে deploy করুন এবং সেই URL দিন

3. **"Start" বাটনে ক্লিক করুন**

4. **Package for Android নির্বাচন করুন:**
   - "Android" platform সিলেক্ট করুন
   - TWA (Trusted Web Activity) অপশন বেছে নিন
   - Package name দিন: `com.islamiccompanion.app`

5. **APK Download করুন:**
   - Generate করলে একটি `.apk` file পাবেন
   - এটি Android phone এ install করতে পারবেন

---

## 🎯 পদ্ধতি ২: Capacitor দিয়ে Native App তৈরি

### ধাপ ১: Capacitor Setup

```bash
# Capacitor install করুন
npm install @capacitor/core @capacitor/cli @capacitor/android

# Capacitor initialize করুন
npx cap init "Islamic Companion" "com.islamiccompanion.app" --web-dir=dist/public

# Android platform যোগ করুন
npx cap add android
```

### ধাপ ২: Configuration

`capacitor.config.ts` ফাইল তৈরি করুন:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.islamiccompanion.app',
  appName: 'Islamic Companion',
  webDir: 'dist/public',
  server: {
    url: 'https://islamicguide-qqag.onrender.com',
    cleartext: true
  },
  android: {
    backgroundColor: '#0f3730'
  }
};

export default config;
```

### ধাপ ৩: Build এবং Run

```bash
# Web app build করুন
npm run build

# Capacitor sync করুন
npx cap sync android

# Android Studio তে খুলুন
npx cap open android

# Android Studio থেকে APK build করুন:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## 🎯 পদ্ধতি ৩: APK Generator Tools ব্যবহার

### বিকল্প A: AppsGeyser
1. https://appsgeyser.com/ এ যান
2. "Website to App" option বেছে নিন
3. আপনার web app URL দিন
4. Icon এবং app details কাস্টমাইজ করুন
5. APK download করুন

### বিকল্প B: WebIntoApp
1. https://webintoapp.com/ এ যান
2. আপনার website URL দিন
3. App settings configure করুন
4. APK generate এবং download করুন

---

## 📋 APK তৈরির আগে চেকলিস্ট

✅ **Backend API যাচাই করুন:**
- [ ] Render backend চালু আছে কিনা check করুন
- [ ] CORS properly configured আছে কিনা
- [ ] সব API endpoints কাজ করছে কিনা

✅ **PWA Configuration:**
- [x] `manifest.json` ঠিক আছে
- [x] Service Worker registered আছে
- [x] Icons (192x192 এবং 512x512) আছে
- [x] Theme color set করা আছে

✅ **Environment Variables:**
- [ ] `VITE_API_URL` production URL এ set করুন
- [ ] অন্য সব secrets properly configured আছে

---

## 🚀 Quick Start Commands

```bash
# ১. Backend URL set করুন
echo "VITE_API_URL=https://islamicguide-qqag.onrender.com" > client/.env

# ২. Production build তৈরি করুন
npm run build

# ৩. Build verify করুন
ls -la dist/public

# ৪. (Optional) Local এ test করুন
npx serve dist/public
```

---

## 🔧 Troubleshooting

### সমস্যা: APK install হচ্ছে না
**সমাধান:** 
- Android Settings > Security > Unknown Sources enable করুন
- অথবা "Install Unknown Apps" permission দিন

### সমস্যা: API calls কাজ করছে না
**সমাধান:**
- CORS headers চেক করুন Render backend এ
- Network inspector দিয়ে API responses দেখুন
- `VITE_API_URL` সঠিক আছে কিনা verify করুন

### সমস্যা: Blank screen দেখাচ্ছে
**সমাধান:**
- Service Worker cache clear করুন
- Hard refresh করুন (Ctrl+Shift+R)
- Browser console এ errors চেক করুন

---

## 📱 APK Distribution

APK তৈরির পর:

1. **Direct Installation:**
   - `.apk` file শেয়ার করুন
   - Users নিজেদের phone এ install করবে

2. **Google Play Store:**
   - Google Play Console account দরকার
   - App bundle (`.aab`) তৈরি করতে হবে
   - Review process এর জন্য অপেক্ষা করতে হবে

3. **Alternative App Stores:**
   - Amazon Appstore
   - Samsung Galaxy Store
   - APKPure, F-Droid ইত্যাদি

---

## 💡 টিপস এবং সুপারিশ

1. **PWA First:** প্রথমে PWA সম্পূর্ণভাবে কাজ করছে কিনা নিশ্চিত করুন
2. **Test Thoroughly:** বিভিন্ন Android devices এ test করুন
3. **Update Strategy:** নতুন version এর জন্য planning করুন
4. **Analytics:** Firebase Analytics যোগ করুন user behavior track করার জন্য
5. **Push Notifications:** OneSignal বা Firebase Cloud Messaging integrate করুন

---

## 🔗 সহায়ক লিংক

- PWABuilder: https://www.pwabuilder.com/
- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Web App Manifest: https://web.dev/add-manifest/

---

**মনে রাখবেন:** APK তৈরির সবচেয়ে সহজ উপায় হল PWABuilder ব্যবহার করা। আপনার web app already PWA হিসেবে configured আছে, তাই এটি সবচেয়ে কার্যকর হবে।
