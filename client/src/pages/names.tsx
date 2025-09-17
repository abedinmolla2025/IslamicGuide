import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL =
  import.meta.env.VITE_API_URL || "https://islamicguide-qqag.onrender.com";

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
  const {
    data: allNames,
    isLoading,
    error,
  } = useQuery<IslamicName[]>({
    queryKey: ["allNames", selectedGender, selectedCategory],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/islamic-names?gender=${selectedGender}&category=${encodeURIComponent(
          selectedCategory
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch names");
      return res.json();
    },
  });

  // 🔹 Search names
  const {
    data: searchResults,
    refetch: searchNames,
    isFetching: isSearching,
  } = useQuery<IslamicName[]>({
    queryKey: ["searchNames", searchQuery, selectedGender],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/islamic-names/search?q=${encodeURIComponent(
          searchQuery
        )}&gender=${selectedGender}`
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: false, // search বাটন চাপলে চালু হবে
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchNames();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Islamic Names</h1>

      {/* 🔹 Gender select */}
      <div className="my-2 space-x-2">
        <button
          onClick={() => setSelectedGender("boys")}
          className={`px-3 py-1 rounded ${
            selectedGender === "boys" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Boys
        </button>
        <button
          onClick={() => setSelectedGender("girls")}
          className={`px-3 py-1 rounded ${
            selectedGender === "girls"
              ? "bg-pink-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Girls
        </button>
      </div>

      {/* 🔹 Category input */}
      <div className="my-2">
        <input
          type="text"
          placeholder="Enter category (e.g. Islamic, Modern)"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* 🔹 Search input */}
      <div className="my-2 flex space-x-2">
        <input
          type="text"
          placeholder="Search names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* 🔹 Results */}
      {isLoading ? (
        <p>Loading names...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load names</p>
      ) : (
        <div>
          {(searchQuery ? searchResults : allNames)?.map((item) => (
            <div key={item.id} className="border p-2 my-2 rounded bg-white">
              <p className="font-bold text-lg">{item.name}</p>
              <p>{item.meaning}</p>
              <p className="text-sm text-gray-500">
                {item.gender} - {item.category}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Searching status */}
      {isSearching && <p>Searching...</p>}
    </div>
  );
}

export default NamesPage;
