import { useState, useMemo, useEffect } from "react";
import API_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

export default function Profile() {
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [borrowedRecords, setBorrowedRecords] = useState([]);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
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

      // 3. Fetch Borrowed Records
      const borrowRes = await fetch(`${API_URL}/api/books/borrowings/all`);
      const borrowData = await borrowRes.json();
      setBorrowedRecords(borrowData.filter(b => b.user_id?._id === userId && b.status === "borrowed"));

      // 4. Fetch Fresh User Data
      const userRes = await fetch(`${API_URL}/api/auth/user/${userId}`);
      const userData = await userRes.json();
      setLikedIds(userData.likedBooks || []);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
  };

  const handleReturn = async (borrowId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to return "${bookTitle}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/books/return/${borrowId}`, { method: "PUT" });
      if (res.ok) {
        alert("Book returned successfully!");
        fetchProfileData(user._id);
      }
    } catch (err) {
      alert("Error returning book");
    }
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  // Map books with liked status
  const books = useMemo(() => {
    return allBooks.map((b) => ({
      ...b,
      liked: likedIds.includes(b._id),
    }));
  }, [allBooks, likedIds]);

  // Match reserved book details
  const queuedBooks = useMemo(() => {
    return reservations.map(res => {
      const bookDetails = allBooks.find(b => b._id === res.book_id);
      const isLiked = likedIds.includes(res.book_id);
      return { ...bookDetails, liked: isLiked, queue_position: res.queue_position, reservationId: res._id };
    }).filter(b => b._id);
  }, [reservations, allBooks, likedIds]);

  // Match borrowed book details
  const currentlyReading = useMemo(() => {
    return borrowedRecords.map(rec => {
      const book = allBooks.find(b => b._id === rec.book_id?._id);
      return { ...book, borrowId: rec._id, due_date: rec.due_date };
    }).filter(b => b._id);
  }, [borrowedRecords, allBooks]);

  const likedBooks = books.filter((b) => b.liked);

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
        localStorage.setItem("userInfo", JSON.stringify({ ...user, likedBooks: updatedLikes }));
      }
    } catch (err) { console.error(err); }
  };

  const leaveQueue = async (reservationId) => {
    try {
      const res = await fetch(`${API_URL}/api/reservations/cancel/${reservationId}`, { method: "PUT" });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r._id !== reservationId));
        alert("Left queue successfully!");
      }
    } catch (err) { console.error(err); }
  };

  const BookRow = ({ title, list, type }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <span className={`w-2 h-8 rounded-full ${type === 'queue' ? 'bg-amber-400' : type === 'reading' ? 'bg-green-500' : 'bg-red-600'}`}></span>
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
                liked={likedIds.includes(book._id)}
                onToggleLike={() => toggleLike(book._id)}
                hideQueueAction={type !== 'normal'}
              />

              {type === 'queue' && (
                <div className="mt-4 w-full px-2">
                  <div className="bg-amber-50 text-amber-700 text-xs font-black uppercase text-center py-2 rounded-xl mb-2 border border-amber-100 tracking-tighter">
                    Queue Position: #{book.queue_position}
                  </div>
                  {/* SHOW BORROW BUTTON ONLY IF #1 AND COPIES > 0 */}
                  {book.queue_position === 1 && book.availableCopies > 0 ? (
                    <button
                      onClick={() => handleBorrowFromQueue(book._id, book.reservationId)}
                      className="w-full py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-green-600 transition"
                    >Borrow Now
                    </button>
                  ) : (
                    <div className="text-[10px] text-gray-400 text-center italic py-1">
                      Waiting for stock...
                    </div>
                  )}

                  <button onClick={() => leaveQueue(book.reservationId)} className="w-full py-2 bg-white text-gray-400 border border-gray-200 rounded-xl text-xs font-bold"
                    >Leave Queue
                    </button>
                </div>
              )}

              {type === 'reading' && (
                <div className="mt-4 w-full px-2">
                  <div className={`text-[10px] font-black uppercase text-center py-2 rounded-xl mb-2 border ${isOverdue(book.due_date) ? "bg-red-50 text-red-700 border-red-100 animate-pulse" : "bg-green-50 text-green-700 border-green-100"
                    }`}>
                    {isOverdue(book.due_date) ? "STATUS: OVERDUE" : `Due: ${new Date(book.due_date).toLocaleDateString()}`}
                  </div>
                  {isOverdue(book.due_date) ? (
                    <button
                      onClick={() => alert("This book is overdue. Please proceed to the library counter and seek a librarian's assistance for return and penalty clearance.")}
                      className="w-full py-2.5 bg-black text-white rounded-xl font-bold text-xs uppercase shadow-lg"
                    >
                      Overdue (Help)
                    </button>
                  ) : (
                    <button onClick={() => handleReturn(book.borrowId, book.title)} className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg">Return Book</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleBorrowFromQueue = async (bookId, reservationId) => {
    try {
      const res = await fetch(`${API_URL}/api/books/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          user_id: user._id,
          days: 7 // Default borrow period
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Once borrowed, remove them from the queue automatically
        await fetch(`${API_URL}/api/reservations/cancel/${reservationId}`, {
          method: "PUT"
        });

        alert("Success! You have borrowed the book from the waiting list.");
        fetchProfileData(user._id); // Refresh everything
      } else {
        alert(data.message || "Failed to borrow");
      }
    } catch (err) {
      console.error("Borrow from queue error:", err);
      alert("System error while processing borrow request.");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="px-10 py-16 bg-red-600 flex justify-between items-center text-white rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">My Library Card</h1>
          <p className="text-red-100 text-lg font-medium">{user?.name} | {user?.email}</p>
        </div>
        <Link to="/" className="relative z-10 bg-white text-red-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95">BACK TO HOME</Link>
      </div>

      <div className="p-10 max-w-7xl mx-auto mt-6">
        <BookRow title="Currently Reading" list={currentlyReading} type="reading" />
        <BookRow title="Active Waiting Lists" list={queuedBooks} type="queue" />

        <div className="my-16 flex items-center gap-4">
          <div className="h-px bg-gray-100 grow"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="h-px bg-gray-100 grow"></div>
        </div>

        <BookRow title="Personal Wishlist" list={likedBooks} type="normal" />
      </div>
    </div>
  );
}