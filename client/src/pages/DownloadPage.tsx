import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

export default function DownloadPage() {
  const APK_DOWNLOAD_URL = "https://cadd8b2b-df7b-4b57-8a16-ad4e8f72bb86-00-10f7rusvamvhx.worf.replit.dev";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Smartphone className="h-20 w-20 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Islamic Companion</h1>
          <p className="text-xl text-emerald-200">Android অ্যাপ ডাউনলোড করুন</p>
        </div>

        {/* Download Card */}
        <Card className="bg-emerald-800/50 border-emerald-700 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Download className="h-6 w-6 text-amber-400" />
              APK ডাউনলোড করুন
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Android ডিভাইসের জন্য Islamic Companion অ্যাপ ইনস্টল করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-4 rounded-md text-center transition-colors"
              data-testid="button-download-apk"
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                APK ডাউনলোড করুন
              </div>
            </a>
            <p className="text-sm text-emerald-300 mt-3 text-center">
              Version: 1.0.0 | Size: 1.2 MB
            </p>
          </CardContent>
        </Card>

        {/* Installation Steps */}
        <Card className="bg-emerald-800/50 border-emerald-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white">ইনস্টলেশন নির্দেশনা</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                  ১
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Unknown Sources Enable করুন</h3>
                <p className="text-emerald-200 text-sm">
                  Settings → Security → Unknown Sources এ গিয়ে enable করুন
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                  ২
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">APK ডাউনলোড করুন</h3>
                <p className="text-emerald-200 text-sm">
                  উপরের "APK ডাউনলোড করুন" বাটনে ক্লিক করুন
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                  ৩
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">ইনস্টল করুন</h3>
                <p className="text-emerald-200 text-sm">
                  ডাউনলোড হওয়ার পর ফাইলটি খুলুন এবং Install ক্লিক করুন
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                  ৪
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">অ্যাপ চালু করুন</h3>
                <p className="text-emerald-200 text-sm">
                  ইনস্টল হওয়ার পর Islamic Companion অ্যাপ ওপেন করুন
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-emerald-800/50 border-emerald-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white">অ্যাপের ফিচারসমূহ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">দৈনিক আয়াত এবং হাদিস</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">সহীহ বুখারী সম্পূর্ণ সংগ্রহ</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">ইসলামিক ক্যালেন্ডার</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">ডিজিটাল তসবিহ</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">দোয়া এবং জিকির সংগ্রহ</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <p className="text-emerald-200">বাংলা এবং ইংরেজি অনুবাদ</p>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="bg-amber-900/30 border-amber-700">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-200 mb-2">গুরুত্বপূর্ণ নোট:</h3>
                <p className="text-amber-100 text-sm">
                  এই অ্যাপটি Google Play Store এ নেই। শুধুমাত্র এই অফিশিয়াল লিঙ্ক থেকে ডাউনলোড করুন। 
                  অন্য কোনো উৎস থেকে ডাউনলোড করবেন না।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
