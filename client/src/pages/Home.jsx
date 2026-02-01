import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import API_URL from "../api";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ year: "", genres: [] });
  const [likedIds, setLikedIds] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Borrowing Logic States
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowDays, setBorrowDays] = useState(7);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    // Load initial likes from the logged-in user's data
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user && user.likedBooks) {
      setLikedIds(user.likedBooks);
    }

    fetchBooks();
  }, []);

  const handleBorrowConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return alert("Please login to borrow!");

    try {
      const response = await fetch(`${API_URL}/api/books/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: selectedBook._id,
          user_id: user._id,
          days: borrowDays,
        }),
      });

      if (response.ok) {
        alert(`Success! Please return the book in ${borrowDays} days.`);
        setBorrowModalOpen(false);
        setSelectedBook(null);
        window.location.reload();
      } else {
        const errData = await response.json();
        alert(errData.message || "Borrowing failed");
      }
    } catch (error) {
      console.error("Borrowing error:", error);
    }
  };

  const handleQueueUp = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return alert("Please login to join the queue!");

    try {
      const response = await fetch(`${API_URL}/api/reservations/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId, user_id: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Success! You are at position ${data.queue_position} in the queue.`);
        setSelectedBook(null);
      } else {
        alert(data.message || "Failed to join queue");
      }
    } catch (error) {
      console.error("Queue Error:", error);
    }
  };

  const toggleLike = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return alert("Please login to like books!");

    try {
      const response = await fetch(`${API_URL}/api/users/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, bookId: bookId }),
      });

      // READ THE JSON ONLY ONCE
      const updatedLikedBooks = await response.json();

      if (response.ok) {
        // 1. Update React State
        setLikedIds(updatedLikedBooks);

        // 2. Update LocalStorage so the session stays synced
        const newUserInfo = { ...user, likedBooks: updatedLikedBooks };
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      } else {
        console.error("Server error during toggle-like:", updatedLikedBooks.message);
      }
    } catch (error) {
      console.error("Like Error:", error);
    }
  };


  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchQuery.trim() !== "") {
        const keywords = searchQuery.toLowerCase().split(" ").filter(Boolean);
        const searchableText = `${book.title} ${book.author} ${book.description || ""} ${book.genre || ""}`.toLowerCase();
        if (!keywords.some((word) => searchableText.includes(word))) return false;
      }
      if (filters.year && String(book.publicationYear) !== String(filters.year)) return false;
      if (filters.genres.length > 0 && !filters.genres.includes(book.genre)) return false;
      return true;
    });
  }, [searchQuery, filters, books]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SearchBar onSearchChange={setSearchQuery} onFilterChange={setFilters} />

      {filteredBooks.length === 0 ? (
        <div className="flex justify-center items-center mt-24 text-gray-400 text-lg">
          No Results Found
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 justify-items-center">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              liked={likedIds.includes(book._id)}
              onToggleLike={() => toggleLike(book._id)}
              onOpenModal={setSelectedBook}
              onQueueUp={handleQueueUp}
            />
          ))}
        </div>
      )}

      {/* --- BOOK DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedBook && !borrowModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl z-10 relative"
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center z-20 transition"
              >✕</button>

              <div className="relative h-64">
                <img
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=No+Cover+Found" }}
                />
                <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold uppercase shadow-lg ${selectedBook.status === "Available" ? "bg-green-500" :
                  selectedBook.status === "Require Queue" ? "bg-amber-400" : "bg-red-600"
                  }`}>
                  {selectedBook.status}
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{selectedBook.title}</h2>
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-bold border border-red-100">
                    {selectedBook.availableCopies} Copies Left
                  </span>
                </div>

                <p className="text-red-600 font-semibold text-lg mb-4">{selectedBook.author}</p>

                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {selectedBook.description || "Detailed synopsis currently being updated by the library staff."}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Location</span>
                    <span className="text-gray-900 font-bold">{selectedBook.location || "Main Shelf"}</span>
                  </div>

                  {selectedBook.status === "Available" ? (
                    <button
                      onClick={() => setBorrowModalOpen(true)}
                      className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition shadow-lg"
                    >
                      Borrow Book
                    </button>
                  ) : selectedBook.status === "Require Queue" ? (
                    <button
                      onClick={() => handleQueueUp(selectedBook._id)}
                      className="w-full py-4 bg-amber-400 text-white rounded-2xl font-bold text-lg hover:bg-amber-500 transition shadow-lg"
                    >
                      Join the Queue
                    </button>
                  ) : (
                    <button disabled className="w-full py-4 bg-gray-200 text-gray-400 rounded-2xl font-bold text-lg cursor-not-allowed">
                      Reference Only / Unavailable
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {borrowModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full z-20 shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Borrow Duration</h3>
              <p className="text-gray-500 mb-6 text-sm">How many days would you like to keep this book?</p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button onClick={() => setBorrowDays(Math.max(2, borrowDays - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-xl hover:bg-gray-50 transition">-</button>
                <span className="text-4xl font-black text-red-600">{borrowDays} <span className="text-lg font-normal text-gray-400">days</span></span>
                <button onClick={() => setBorrowDays(Math.min(14, borrowDays + 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-xl hover:bg-gray-50 transition">+</button>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleBorrowConfirm} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition">Confirm Borrowing</button>
                <button onClick={() => setBorrowModalOpen(false)} className="w-full py-4 text-gray-500 font-semibold hover:text-gray-800 transition">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}