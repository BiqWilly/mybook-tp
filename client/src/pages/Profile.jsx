import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

export default function Profile() {
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [reservations, setReservations] = useState([]); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      // Initialize likes from stored user info
      if (storedUser.likedBooks) setLikedIds(storedUser.likedBooks);
      fetchProfileData(storedUser._id);
    }
  }, [navigate]);

  const fetchProfileData = async (userId) => {
    try {
      // 1. Fetch Books
      const bookRes = await fetch(`${API_URL}/api/books`);
      const bookData = await bookRes.json();
      setAllBooks(bookData);

      // 2. Fetch Reservations
      const resRes = await fetch(`${API_URL}/api/reservations`); 
      const resData = await resRes.json();
      setReservations(resData.filter(r => r.user_id === userId && r.status === "queued"));

      // 3. Fetch Fresh User Data (to sync likedIds with DB)
      const userRes = await fetch(`${API_URL}/api/auth/user/${userId}`);
      const userData = await userRes.json();
      setLikedIds(userData.likedBooks || []);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
  };

  // Logic from your code: Map books with liked status
  const books = useMemo(() => {
    return allBooks.map((b) => ({
      ...b,
      liked: likedIds.includes(b._id),
    }));
  }, [allBooks, likedIds]);

  // Logic from your code: Match reserved book details
  const queuedBooks = useMemo(() => {
    return reservations.map(res => {
        const bookDetails = allBooks.find(b => b._id === res.book_id);
        const isLiked = likedIds.includes(res.book_id);
        return { ...bookDetails, liked: isLiked, queue_position: res.queue_position, reservationId: res._id };
    }).filter(b => b._id);
  }, [reservations, allBooks, likedIds]);

  // Logic from your code: Filter liked books
  const likedBooks = books.filter((b) => b.liked);

  // Updated toggleLike to sync with Backend
  const toggleLike = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, bookId }),
      });
      const updatedLikes = await response.json();
      if (response.ok) {
        setLikedIds(updatedLikes);
        const newUserInfo = { ...user, likedBooks: updatedLikes };
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      }
    } catch (err) {
      console.error("Like Toggle Error:", err);
    }
  };

  const leaveQueue = async (reservationId) => {
    try {
      const res = await fetch(`${API_URL}/api/reservations/cancel/${reservationId}`, {
        method: "PUT"
      });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r._id !== reservationId));
        alert("Left queue successfully!");
      }
    } catch (err) {
      console.error("Leave Queue Error:", err);
    }
  };

  const BookRow = ({ title, list, isQueue }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <span className={`w-2 h-8 rounded-full ${isQueue ? 'bg-amber-400' : 'bg-red-600'}`}></span>
        {title}
      </h2>
      {list.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
            <p className="text-gray-400 italic font-medium">No activity found in this section.</p>
        </div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-6 pt-2 px-2 -mx-2 scrollbar-hide">
          {list.map((book) => (
            <div key={book._id || book.reservationId} className="flex flex-col items-center min-w-250px">
              <BookCard
                book={book}
                liked={book.liked}
                onToggleLike={() => toggleLike(book._id)}
                hideQueueAction={isQueue}
              />
              {isQueue && (
                <div className="mt-4 w-full px-2">
                  <div className="bg-amber-50 text-amber-700 text-xs font-black uppercase text-center py-2 rounded-xl mb-2 border border-amber-100 tracking-tighter">
                    Queue Position: #{book.queue_position}
                  </div>
                  <button
                    onClick={() => leaveQueue(book.reservationId)}
                    className="w-full py-2.5 bg-white text-gray-500 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-xs font-bold"
                  >
                    Leave Queue
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="px-10 py-16 bg-red-600 flex justify-between items-center text-white rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">My Library Card</h1>
          <p className="text-red-100 text-lg font-medium">
            {user?.name} <span className="mx-2 opacity-40">|</span> {user?.email}
          </p>
        </div>
        <Link to="/" className="relative z-10 bg-white text-red-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95">
          BACK TO HOME
        </Link>
      </div>

      {/* Rows Section */}
      <div className="p-10 max-w-7xl mx-auto mt-6">
        <BookRow title="Active Waiting Lists" list={queuedBooks} isQueue />
        
        <div className="my-16 flex items-center gap-4">
            <div className="h-px bg-gray-100 grow"></div>
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-px bg-gray-100 grow"></div>
        </div>

        <BookRow title="Personal Wishlist" list={likedBooks} />
      </div>
    </div>
  );
}