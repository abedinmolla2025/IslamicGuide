import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "https://islamicguide-qqag.onrender.com";

interface IslamicName {
  id: number;
  name: string;
  meaning: string;
  gender: string;
  category: string;
}

function NamesPage() {
  const [selectedGender, setSelectedGender] = useState("boys");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch all names
  const { data: allNames, isLoading } = useQuery<IslamicName[]>({
    queryKey: ["allNames", selectedGender, selectedCategory],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/islamic-names?gender=${selectedGender}&category=${encodeURIComponent(selectedCategory)}`
      );
      return res.json();
    },
  });

  // 🔹 Search names
  const { data: searchResults, refetch: searchNames } = useQuery<IslamicName[]>({
    queryKey: ["searchNames", searchQuery, selectedGender],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/islamic-names/search?q=${encodeURIComponent(searchQuery)}&gender=${selectedGender}`
      );
      return res.json();
    },
    enabled: false, // শুধুমাত্র যখন search হবে তখন চালু হবে
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchNames();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Islamic Names</h1>

      {/* 🔹 Gender select */}
      <div className="my-2">
        <button onClick={() => setSelectedGender("boys")}>Boys</button>
        <button onClick={() => setSelectedGender("girls")}>Girls</button>
      </div>

      {/* 🔹 Category input */}
      <div className="my-2">
        <input
          type="text"
          placeholder="Enter category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
      </div>

      {/* 🔹 Search input */}
      <div className="my-2">
        <input
          type="text"
          placeholder="Search names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 🔹 Results */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {(searchQuery ? searchResults : allNames)?.map((item) => (
            <div key={item.id} className="border p-2 my-2 rounded">
              <p className="font-bold">{item.name}</p>
              <p>{item.meaning}</p>
              <p className="text-sm text-gray-500">{item.gender} - {item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NamesPage;
