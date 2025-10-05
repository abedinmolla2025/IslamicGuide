export interface QuizQuestion {
  question: string;
  questionBengali: string;
  options: string[];
  optionsBengali: string[];
  correctAnswer: number;
  explanation: string;
  explanationBengali: string;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "How many pillars of Islam are there?",
    questionBengali: "ইসলামের কয়টি স্তম্ভ আছে?",
    options: ["Three", "Four", "Five", "Six"],
    optionsBengali: ["তিনটি", "চারটি", "পাঁচটি", "ছয়টি"],
    correctAnswer: 2,
    explanation: "The Five Pillars of Islam are: Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).",
    explanationBengali: "ইসলামের পাঁচটি স্তম্ভ হলো: শাহাদাহ (বিশ্বাস), সালাহ (নামাজ), যাকাত (দান), সাওম (রোজা), এবং হজ্জ (তীর্থযাত্রা)।",
    category: "Pillars of Islam"
  },
  {
    question: "In which city was Prophet Muhammad (PBUH) born?",
    questionBengali: "নবী মুহাম্মদ (সা.) কোন শহরে জন্মগ্রহণ করেছিলেন?",
    options: ["Medina", "Makkah", "Jerusalem", "Damascus"],
    optionsBengali: ["মদিনা", "মক্কা", "জেরুজালেম", "দামেস্ক"],
    correctAnswer: 1,
    explanation: "Prophet Muhammad (PBUH) was born in Makkah (Mecca) in the year 570 CE.",
    explanationBengali: "নবী মুহাম্মদ (সা.) ৫৭০ খ্রিস্টাব্দে মক্কায় জন্মগ্রহণ করেছিলেন।",
    category: "Seerah"
  },
  {
    question: "How many Surahs are in the Quran?",
    questionBengali: "কুরআনে কতটি সূরা আছে?",
    options: ["104", "110", "114", "120"],
    optionsBengali: ["১০৪টি", "১১০টি", "১১৪টি", "১২০টি"],
    correctAnswer: 2,
    explanation: "The Quran contains 114 Surahs (chapters), starting with Al-Fatihah and ending with An-Nas.",
    explanationBengali: "কুরআনে ১১৪টি সূরা (অধ্যায়) আছে, যা আল-ফাতিহা দিয়ে শুরু এবং আন-নাস দিয়ে শেষ হয়।",
    category: "Quran"
  },
  {
    question: "What is the first month of the Islamic calendar?",
    questionBengali: "ইসলামিক ক্যালেন্ডারের প্রথম মাস কোনটি?",
    options: ["Ramadan", "Muharram", "Rajab", "Shawwal"],
    optionsBengali: ["রমজান", "মুহাররম", "রজব", "শাওয়াল"],
    correctAnswer: 1,
    explanation: "Muharram is the first month of the Islamic (Hijri) calendar and is one of the four sacred months.",
    explanationBengali: "মুহাররম ইসলামিক (হিজরি) ক্যালেন্ডারের প্রথম মাস এবং চারটি পবিত্র মাসের একটি।",
    category: "Islamic History"
  },
  {
    question: "How many times do Muslims pray in a day?",
    questionBengali: "মুসলমানরা দিনে কতবার নামাজ পড়ে?",
    options: ["Three", "Four", "Five", "Six"],
    optionsBengali: ["তিনবার", "চারবার", "পাঁচবার", "ছয়বার"],
    correctAnswer: 2,
    explanation: "Muslims pray five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
    explanationBengali: "মুসলমানরা দিনে পাঁচবার নামাজ পড়ে: ফজর, জোহর, আসর, মাগরিব এবং এশা।",
    category: "Pillars of Islam"
  },
  {
    question: "What does 'Zakat' mean?",
    questionBengali: "'যাকাত' এর অর্থ কী?",
    options: ["Prayer", "Fasting", "Charity/Almsgiving", "Pilgrimage"],
    optionsBengali: ["নামাজ", "রোজা", "দান/ভিক্ষা", "তীর্থযাত্রা"],
    correctAnswer: 2,
    explanation: "Zakat means purification and growth. It is the obligatory charity given to the poor and needy, calculated as 2.5% of one's wealth.",
    explanationBengali: "যাকাত মানে পবিত্রতা এবং বৃদ্ধি। এটি দরিদ্র এবং অভাবগ্রস্তদের দেওয়া বাধ্যতামূলক দান, যা সম্পদের ২.৫% হিসাবে গণনা করা হয়।",
    category: "Pillars of Islam"
  },
  {
    question: "Which angel is responsible for delivering messages from Allah to the Prophets?",
    questionBengali: "কোন ফেরেশতা আল্লাহর বার্তা নবীদের কাছে পৌঁছে দেওয়ার দায়িত্বপ্রাপ্ত?",
    options: ["Mikail", "Israfil", "Jibreel (Gabriel)", "Azrael"],
    optionsBengali: ["মিকাঈল", "ইসরাফিল", "জিবরীল (জিব্রাঈল)", "আজরাঈল"],
    correctAnswer: 2,
    explanation: "Angel Jibreel (Gabriel) is responsible for delivering Allah's revelations to the Prophets.",
    explanationBengali: "ফেরেশতা জিবরীল (জিব্রাঈল) আল্লাহর ওহী নবীদের কাছে পৌঁছে দেওয়ার দায়িত্বপ্রাপ্ত।",
    category: "Islamic Beliefs"
  }
];
