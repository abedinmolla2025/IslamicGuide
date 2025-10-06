import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/bottom-navigation";
import TopBar from "@/components/top-bar";
import { Search, Heart, Share, Baby, Languages, Sparkles, Filter, TrendingUp } from "lucide-react";
import type { IslamicName } from "@shared/schema";


export default function NamesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<"all" | "boy" | "girl">("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "arabic" | "bengali">("bengali");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allNames, isLoading } = useQuery<IslamicName[]>({
    queryKey: ["allNames", selectedGender, selectedCategory],
    queryFn: async () => {
      const res = await fetch(
        `/api/islamic-names?gender=${selectedGender}&category=${encodeURIComponent(selectedCategory)}`
      );
      if (!res.ok) throw new Error("Failed to fetch names");
      return res.json();
    },
  });

  const { data: searchResults, refetch: searchNames } = useQuery<IslamicName[]>({
    queryKey: ["searchNames", searchQuery, selectedGender],
    queryFn: async () => {
      const res = await fetch(
        `/api/islamic-names/search?q=${encodeURIComponent(searchQuery)}&gender=${selectedGender}`
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchNames();
    }
  };

  const handleShare = (name: IslamicName) => {
    if (navigator.share) {
      navigator.share({
        title: `Islamic Name: ${name.name}`,
        text: `${name.name} (${name.gender})\nMeaning: ${name.meaning}\nOrigin: ${name.origin}\n\nFrom Islamic Names App`,
      });
    }
  };

  const categories = [
    "All", "Popular", "Prophetic", "Historical", "Virtue", "Divine",
    "Nature", "Beauty", "Spiritual", "Companion", "Leadership",
    "Knowledge", "Wisdom", "Joy", "Royal", "Precious"
  ];

  const displayNames = searchQuery.trim() && searchResults ? searchResults : allNames || [];
  const boyNames = displayNames.filter(name => name.gender === 'boy');
  const girlNames = displayNames.filter(name => name.gender === 'girl');

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950">
      <TopBar title="Islamic Baby Names" subtitle="Beautiful names with meanings" />

      <main className="flex-1 overflow-y-auto p-4 pb-20 space-y-6">
        {/* Premium Hero Section with Stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-amber-500/30 p-6 mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-amber-100">Discover Beautiful Names</h2>
            </div>
            <p className="text-sm text-emerald-100/80 mb-4">
              Explore thousands of meaningful Islamic names for your baby
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{allNames?.length || 0}</div>
                <div className="text-xs text-emerald-100/70">Total Names</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{boyNames.length}</div>
                <div className="text-xs text-emerald-100/70">Boys</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-400">{girlNames.length}</div>
                <div className="text-xs text-emerald-100/70">Girls</div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Search Bar */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-teal-500/20 rounded-xl blur-xl"></div>
            <div className="relative flex gap-2 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-300" />
                <Input
                  placeholder="Search names or meanings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-emerald-200/50 focus:bg-white/10"
                  data-testid="input-search-names"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                data-testid="button-search-names"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="space-y-3 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-emerald-200 mb-1.5 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger 
                      className="bg-white/5 border-white/10 text-white"
                      data-testid="select-category"
                    >
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-emerald-200 mb-1.5 block">Gender</label>
                  <Select value={selectedGender} onValueChange={(value: "all" | "boy" | "girl") => setSelectedGender(value)}>
                    <SelectTrigger 
                      className="bg-white/5 border-white/10 text-white"
                      data-testid="select-gender"
                    >
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Names</SelectItem>
                      <SelectItem value="boy">Boys Only</SelectItem>
                      <SelectItem value="girl">Girls Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs text-emerald-200 mb-1.5 block flex items-center gap-1">
                  <Languages className="h-3 w-3" />
                  Display Language
                </label>
                <Select value={selectedLanguage} onValueChange={(value: "english" | "arabic" | "bengali") => setSelectedLanguage(value)}>
                  <SelectTrigger 
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="select-language"
                  >
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="arabic">العربية (Arabic)</SelectItem>
                    <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-200/80 bg-white/5 rounded-lg py-2 px-4 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4" />
            <span>
              {displayNames.length} names found
              {selectedGender !== 'all' && ` • ${selectedGender}s`}
              {selectedCategory !== 'All' && ` • ${selectedCategory}`}
            </span>
          </div>
        )}

        {/* Names Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/5 rounded-xl backdrop-blur-sm"></div>
              </div>
            ))}
          </div>
        ) : selectedGender === 'all' ? (
          <Tabs defaultValue="boys" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md p-1 h-auto">
              <TabsTrigger 
                value="boys" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg py-3"
                data-testid="tab-boys"
              >
                <Baby className="h-4 w-4 mr-2" />
                Boys ({boyNames.length})
              </TabsTrigger>
              <TabsTrigger 
                value="girls" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg py-3"
                data-testid="tab-girls"
              >
                <Baby className="h-4 w-4 mr-2" />
                Girls ({girlNames.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="boys" className="mt-6">
              {boyNames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boyNames.map((name) => (
                    <NameCard key={name.id} name={name} selectedLanguage={selectedLanguage} onShare={handleShare} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm">
                  <Baby className="h-16 w-16 text-emerald-500/50 mx-auto mb-4" />
                  <p className="text-emerald-200/60">No boy names found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="girls" className="mt-6">
              {girlNames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {girlNames.map((name) => (
                    <NameCard key={name.id} name={name} selectedLanguage={selectedLanguage} onShare={handleShare} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm">
                  <Baby className="h-16 w-16 text-pink-500/50 mx-auto mb-4" />
                  <p className="text-emerald-200/60">No girl names found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayNames.length > 0 ? (
              displayNames.map((name) => (
                <NameCard key={name.id} name={name} selectedLanguage={selectedLanguage} onShare={handleShare} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm">
                <Baby className="h-16 w-16 text-emerald-500/50 mx-auto mb-4" />
                <p className="text-emerald-200/60">No names found</p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation currentPage="names" />
    </div>
  );
}

interface NameCardProps {
  name: IslamicName;
  selectedLanguage: "english" | "arabic" | "bengali";
  onShare: (name: IslamicName) => void;
}

function NameCard({ name, selectedLanguage, onShare }: NameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const getDisplayName = () => {
    switch (selectedLanguage) {
      case "arabic":
        return name.nameArabic;
      case "bengali":
        return name.nameBengali;
      default:
        return name.name;
    }
  };

  const getDisplayMeaning = () => {
    switch (selectedLanguage) {
      case "bengali":
        return name.meaningBengali || name.meaning;
      default:
        return name.meaning;
    }
  };

  const getNameClass = () => {
    if (selectedLanguage === "arabic") {
      return "text-2xl font-bold text-right";
    }
    return "text-2xl font-bold";
  };

  const genderColor = name.gender === 'boy' 
    ? 'from-blue-900/40 to-blue-800/40 border-blue-500/40' 
    : 'from-pink-900/40 to-pink-800/40 border-pink-500/40';

  const genderBadgeColor = name.gender === 'boy'
    ? 'bg-blue-500/30 text-blue-200 border-blue-400/50'
    : 'bg-pink-500/30 text-pink-200 border-pink-400/50';

  return (
    <Card 
      className={`group relative overflow-hidden bg-gradient-to-br ${genderColor} backdrop-blur-md border hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/30`}
      data-testid={`card-name-${name.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
      
      <CardContent className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center border border-amber-400/40 shadow-lg">
                <Baby className={`h-6 w-6 ${name.gender === 'boy' ? 'text-blue-300' : 'text-pink-300'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`${getNameClass()} text-white drop-shadow-lg`} data-testid={`text-name-${name.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {getDisplayName()}
                </h3>
                {selectedLanguage !== "english" && (
                  <p className="text-sm text-emerald-200/80 mt-1 font-medium">
                    {name.name}
                  </p>
                )}
              </div>
            </div>
            <Badge 
              className={`${genderBadgeColor} border font-semibold shadow-sm`}
              data-testid={`badge-gender-${name.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {name.gender === 'boy' ? '👦 Boy' : '👧 Girl'}
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="hover:bg-white/20 hover:scale-110 transition-all"
              data-testid={`button-favorite-${name.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-red-400 text-red-400 scale-110' : 'text-white/80'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(name)}
              className="hover:bg-white/20 hover:scale-110 transition-all"
              data-testid={`button-share-${name.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Share className="h-4 w-4 text-white/80" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Meaning</span>
              <p className="text-sm text-white/90 leading-relaxed mt-1">
                {getDisplayMeaning()}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Origin</span>
              <p className="text-sm text-white/90 leading-relaxed mt-1">
                {name.origin}
              </p>
            </div>
          </div>
          
          {name.category && (
            <div className="pt-2">
              <Badge className="bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-100 border-emerald-400/40 text-xs font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                {name.category}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
