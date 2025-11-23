// SEO helper functions for dynamic page titles and meta descriptions

export function updatePageTitle(title: string, description?: string) {
  // Update page title
  document.title = title;
  
  // Update meta description if provided
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update OG meta tags for social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    // Update Twitter meta tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
  }
}

// Page-specific SEO data
export const PAGE_SEO = {
  home: {
    title: "Islamic Companion - কুরআন, নামাজ, হাদিস ও ইসলামিক ক্যালেন্ডার",
    description: "সম্পূর্ণ ইসলামিক অ্যাপ যেখানে রয়েছে কুরআন তিলাওয়াত, নামাজের সময়, কিবলা দিক, হাদিস, দোয়া, ইসলামিক ক্যালেন্ডার, যিকির কাউন্টার এবং আরও অনেক কিছু।"
  },
  quran: {
    title: "কুরআন শরীফ - Quran Bangla | বাংলা অনুবাদ সহ কুরআন তিলাওয়াত",
    description: "সম্পূর্ণ কুরআন শরীফ বাংলা অনুবাদ ও অডিও তিলাওয়াত সহ। পড়ুন এবং শুনুন পবিত্র কুরআন বাংলায়। Quran with Bengali translation and audio recitation."
  },
  hadith: {
    title: "হাদিস শরীফ - Hadith Bangla | সহীহ বুখারী ও মুসলিম শরীফ",
    description: "সহীহ হাদিস সংগ্রহ বাংলা অনুবাদ সহ। বুখারী শরীফ, মুসলিম শরীফ এবং অন্যান্য হাদিস গ্রন্থ থেকে নির্বাচিত হাদিস। Authentic Hadith in Bengali."
  },
  bukhari: {
    title: "সহীহ বুখারী শরীফ - Sahih Bukhari Bangla | বাংলা অনুবাদ",
    description: "সম্পূর্ণ সহীহ বুখারী শরীফ বাংলা অনুবাদ সহ। ৭,০০০+ হাদিস পড়ুন বাংলায়। Sahih Bukhari collection in Bengali translation."
  },
  dua: {
    title: "দোয়া সংগ্রহ - Islamic Dua Bangla | প্রয়োজনীয় দোয়া ও যিকির",
    description: "দৈনন্দিন প্রয়োজনীয় দোয়া, কুরআন ও হাদিস থেকে দোয়া সংগ্রহ বাংলা উচ্চারণ ও অর্থ সহ। Daily Islamic duas in Bengali with pronunciation and meaning."
  },
  surah: {
    title: "কুরআনের সূরা তালিকা - Surah List Bangla | ১১৪টি সূরা",
    description: "কুরআন শরীফের সকল সূরার তালিকা বাংলা নাম ও অর্থ সহ। ১১৪টি সূরা সম্পর্কে বিস্তারিত তথ্য। Complete list of all 114 Surahs with Bengali names."
  },
  mosque: {
    title: "নামাজের সময়সূচী ও নিকটস্থ মসজিদ - Prayer Times Bangla",
    description: "আপনার এলাকার নামাজের সময়সূচী এবং নিকটস্থ মসজিদের তালিকা। ফজর, যোহর, আসর, মাগরিব, এশার সময় জানুন। Prayer times and nearby mosques."
  },
  qibla: {
    title: "কিবলা দিক নির্ণয় - Qibla Direction Finder | কিবলা কম্পাস",
    description: "আপনার অবস্থান থেকে সঠিক কিবলা দিক নির্ণয় করুন। নামাজের জন্য কাবা শরীফের দিক খুঁজুন। Find accurate Qibla direction for prayer."
  },
  calendar: {
    title: "ইসলামিক ক্যালেন্ডার - Islamic Calendar Bangla | হিজরি তারিখ",
    description: "ইসলামিক ক্যালেন্ডার ও হিজরি তারিখ দেখুন। আজকের ইসলামিক মাস ও তারিখ জানুন। Islamic Hijri calendar with Bengali dates."
  },
  names: {
    title: "ইসলামিক নাম - Islamic Names Bangla | মুসলিম শিশুর সুন্দর নাম",
    description: "১০০০+ সুন্দর ইসলামিক নাম অর্থ সহ। ছেলে ও মেয়ে শিশুর জন্য কুরআনিক ও আরবি নাম। Beautiful Islamic baby names with Bengali meanings."
  },
  settings: {
    title: "সেটিংস - Settings | Islamic Companion App",
    description: "অ্যাপের সেটিংস পরিবর্তন করুন। থিম, ভাষা এবং অন্যান্য পছন্দ সেট করুন। App settings and preferences."
  },
  download: {
    title: "অ্যাপ ডাউনলোড - Download Islamic Companion APK",
    description: "Islamic Companion Android অ্যাপ ডাউনলোড করুন। সম্পূর্ণ ইসলামিক অ্যাপ আপনার মোবাইলে ব্যবহার করুন। Download APK for Android."
  }
};
