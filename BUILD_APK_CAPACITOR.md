# 📱 Islamic Companion - Capacitor APK Build Guide

## ✅ Setup Complete!

আপনার Islamic Companion অ্যাপ এখন **Capacitor দিয়ে সম্পূর্ণভাবে configured** এবং APK build করার জন্য ready!

### 🔧 Configuration Details:
- **App Name:** Islamic Companion
- **Package Name:** com.islamiccompanion.app
- **Backend URL:** https://islamicguide-qqaq.onrender.com ✅
- **Android Project:** `android/` folder এ তৈরি হয়েছে
- **Production Build:** সঠিক backend URL সহ sync করা হয়েছে

---

## 📋 APK Build করার ৩টি পদ্ধতি

### **পদ্ধতি ১: Replit থেকে সরাসরি Build (সবচেয়ে সহজ)**

Replit Shell থেকে এই command চালান:

```bash
cd android && ./gradlew assembleDebug
```

APK পাওয়া যাবে: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### **পদ্ধতি ২: নিজের Computer এ Build করুন**

#### প্রয়োজনীয় Software:
- Android Studio অথবা Android SDK
- JDK 11 বা তার উপরে

#### Steps:

1. **Android folder download করুন**
   - এই Replit থেকে `android/` folder টা download করুন
   - অথবা পুরো project ZIP করে download করুন

2. **Android Studio দিয়ে খুলুন**
   ```
   Android Studio → Open → android folder select করুন
   ```

3. **APK Build করুন**
   - Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - অথবা Terminal থেকে:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

4. **APK পাবেন:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### **পদ্ধতি ৩: Online Build Service (Android Studio ছাড়া)**

#### Option A: AppGyver / Budibase Build Service
1. এই Replit project GitHub এ push করুন
2. https://www.appgyver.com/ বা similar service ব্যবহার করুন
3. GitHub repo link দিয়ে build করুন

#### Option B: Expo EAS Build (যদি compatible হয়)
```bash
npx eas-cli build --platform android
```

---

## 🚀 Quick Build Command (Replit Shell)

Replit Shell থেকে এই command run করুন:

```bash
# Debug APK build করুন
cd android && ./gradlew assembleDebug

# অথবা Release APK (signed)
cd android && ./gradlew assembleRelease
```

**Output Location:**
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📦 APK Download করার পর

1. APK file টি আপনার Android phone এ transfer করুন
2. Settings → Security → Unknown Sources enable করুন
3. APK file install করুন
4. ✅ App খুলুন - এটা **https://islamicguide-qqaq.onrender.com** এ connect করবে!

---

## ⚠️ Important Notes:

### Gradle Build যদি fail করে:
```bash
# Android SDK path set করুন (local machine এ)
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# তারপর build করুন
cd android && ./gradlew assembleDebug
```

### Release APK Sign করতে:
1. Keystore তৈরি করুন:
```bash
keytool -genkey -v -keystore islamic-companion.keystore -alias islamic -keyalg RSA -keysize 2048 -validity 10000
```

2. `android/app/build.gradle` এ signing config যোগ করুন
3. `./gradlew assembleRelease` চালান

---

## 🎯 Summary

✅ **Capacitor Setup Complete**
✅ **Backend URL: https://islamicguide-qqaq.onrender.com**
✅ **Android Project Ready in `android/` folder**
✅ **Production Build Synced**

### Next Steps:
1. Replit Shell থেকে `cd android && ./gradlew assembleDebug` চালান
2. অথবা `android/` folder download করে local machine এ build করুন
3. APK install করুন এবং test করুন!

---

**Need Help?** 
- Capacitor Docs: https://capacitorjs.com/docs/android
- Gradle Build Docs: https://developer.android.com/studio/build/building-cmdline
