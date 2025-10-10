# 🚀 GitHub Actions দিয়ে Automatic APK Build

## ✅ Setup সম্পন্ন!

আপনার প্রজেক্টে **GitHub Actions workflow** যোগ করা হয়েছে যা automatically APK তৈরি করবে!

---

## 📋 কিভাবে ব্যবহার করবেন:

### **পদক্ষেপ ১: GitHub এ Push করুন**

```bash
# Git initialize করুন (যদি না করা থাকে)
git init
git add .
git commit -m "Add Capacitor Android project"

# GitHub repository তে push করুন
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### **পদক্ষেপ ২: APK Build Automatically হবে!**

- GitHub এ push করার সাথে সাথে build শুরু হবে
- 5-10 মিনিট পর APK তৈরি হবে
- GitHub Actions page এ যান: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

### **পদক্ষেপ ৩: APK Download করুন**

1. GitHub repository এ যান
2. **Actions** tab ক্লিক করুন
3. সবশেষ workflow run click করুন
4. **Artifacts** section এ `islamic-companion-apk` ডাউনলোড করুন
5. ✅ APK পেয়ে যাবেন!

---

## 🔧 Manual Build Trigger

আপনি manually ও build trigger করতে পারবেন:

1. GitHub repository → **Actions** tab
2. **Build Android APK** workflow select করুন
3. **Run workflow** ক্লিক করুন
4. APK তৈরি হবে!

---

## 📱 APK Details

**তৈরি হবে:**
- File: `app-debug.apk`
- Backend URL: `https://islamicguide-qqaq.onrender.com` ✅
- Package: `com.islamiccompanion.app`
- Ready to install!

---

## ⚙️ Alternative: অন্যান্য Cloud Build Services

যদি GitHub Actions না চান, এগুলো ব্যবহার করতে পারেন:

### 1. **Codemagic** (Free tier available)
- Website: https://codemagic.io/
- Capacitor support করে
- APK & AAB build করে
- 500 build minutes/month free

### 2. **Bitrise** (Free tier available)
- Website: https://www.bitrise.io/
- Mobile CI/CD platform
- Capacitor projects support করে

### 3. **AppCenter** (Microsoft)
- Website: https://appcenter.ms/
- Free build service
- Capacitor compatible

---

## 🎯 Next Steps:

1. ✅ এই project GitHub এ push করুন
2. ✅ GitHub Actions automatically APK build করবে
3. ✅ Actions tab থেকে APK download করুন
4. ✅ Android phone এ install করুন!

**Backend URL সঠিক আছে:** https://islamicguide-qqaq.onrender.com ✅

---

## 💡 Pro Tip:

Release APK build করতে চাইলে workflow file এ এই লাইন পরিবর্তন করুন:

```yaml
./gradlew assembleDebug
↓ পরিবর্তন করে
./gradlew assembleRelease
```

**Happy Building!** 🎉
