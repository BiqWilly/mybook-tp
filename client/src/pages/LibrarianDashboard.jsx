import { useState, useEffect } from "react";
import API_URL from "../api";

export default function LibrarianDashboard() {
  const [borrowings, setBorrowings] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [stats, setStats] = useState({ activeLoans: 0, totalBooks: 0 });
  const [selectedBook, setSelectedBook] = useState(null); // For Edit Modal
  const [newBook, setNewBook] = useState({
    title: "", author: "", genre: "", publicationYear: 2026,
    description: "", totalCopies: 1, availableCopies: 1, location: "", image: ""
  });

  const genres = ["Fiction", "Science", "History", "Productivity", "Business", "Self-Improvement", "Technology"];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // 1. Fetch all borrowings
      const res = await fetch(`${API_URL}/api/books`);
      const data = await res.json();
      const activeData = Array.isArray(data) ? data.filter(b => b.status === 'active') : [];
      setBorrowings(activeData);
      
      // 2. Fetch all books
      const bookRes = await fetch(`${API_URL}/api/books`);
      const bookData = await bookRes.json();
      const safeBookData = Array.isArray(bookData) ? bookData : [];
      setAllBooks(safeBookData);
      
      setStats({
        activeLoans: activeData.length,
        totalBooks: safeBookData.length
      });
    } catch (err) { 
      console.error("Admin Fetch Error:", err); 
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newBook, 
          status: "Available" 
        })
      });
      if (res.ok) {
        alert("Success: Book added to Library Catalog!");
        setNewBook({ title: "", author: "", genre: "", publicationYear: 2026, description: "", totalCopies: 1, availableCopies: 1, location: "", image: "" });
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateBook = async (e) => {
    if (e) e.preventDefault(); // CRITICAL: Prevents page reload
    try {
      const res = await fetch(`${API_URL}/api/books/${selectedBook._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBook)
      });
      if (res.ok) {
        alert("Success: Book details updated!");
        setSelectedBook(null);
        fetchAdminData();
      } else {
        alert("Update failed. Please check the console.");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("WARNING: Are you sure you want to delete this book? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Success: Book removed from catalog.");
        setSelectedBook(null);
        fetchAdminData();
      } else {
        alert("Delete failed.");
      }
    } catch (err) { console.error(err); }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const res = await fetch(`${API_URL}/api/books/return/${borrowId}`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Book marked as returned!");
        fetchAdminData();
      }
    } catch (err) { console.error("Return error:", err); }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Librarian Control Panel</h1>
        <button onClick={() => window.location.href = "/"} className="bg-slate-800 px-6 py-2 rounded-xl text-slate-400 hover:text-white transition border border-slate-700 font-bold">
          Exit to Library
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <p className="text-slate-400 text-sm font-bold uppercase">Active Loans</p>
          <p className="text-4xl font-black text-green-400">{stats.activeLoans}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <p className="text-slate-400 text-sm font-bold uppercase">Total Titles</p>
          <p className="text-4xl font-black text-blue-400">{stats.totalBooks}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">System Status</p>
          <p className="text-xl font-black text-emerald-400 flex items-center gap-2 italic animate-pulse">
            Operational
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* ADD BOOK FORM */}
        <div className="lg:col-span-1 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6">Add New Acquisition</h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <input type="text" placeholder="Book Title" className="w-full bg-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
               <input type="text" placeholder="Author" className="bg-slate-700 p-3 rounded-xl outline-none" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} required />
               <select className="bg-slate-700 p-3 rounded-xl outline-none text-slate-400 font-bold" value={newBook.genre} onChange={(e) => setNewBook({...newBook, genre: e.target.value})} required>
                  <option value="">Select Genre</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
               </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input type="number" placeholder="Total Copies" className="bg-slate-700 p-3 rounded-xl outline-none" value={newBook.totalCopies} onChange={(e) => setNewBook({...newBook, totalCopies: Number(e.target.value)})} required />
               <input type="number" placeholder="Available" className="bg-slate-700 p-3 rounded-xl outline-none" value={newBook.availableCopies} onChange={(e) => setNewBook({...newBook, availableCopies: Number(e.target.value)})} required />
            </div>
            <input type="text" placeholder="Location" className="w-full bg-slate-700 p-3 rounded-xl outline-none" value={newBook.location} onChange={(e) => setNewBook({...newBook, location: e.target.value})} required />
            <textarea placeholder="Description" className="w-full bg-slate-700 p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-red-500" value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} />
            <input type="text" placeholder="Image URL" className="w-full bg-slate-700 p-3 rounded-xl outline-none" value={newBook.image} onChange={(e) => setNewBook({...newBook, image: e.target.value})} />
            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-black transition shadow-lg shadow-red-900/20 uppercase tracking-tighter">Update Library Catalog</button>
          </form>
        </div>

        {/* LIVE CIRCULATION TABLE */}
        <div className="lg:col-span-2 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 italic tracking-tighter uppercase">Live Circulation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-700">
                <tr>
                  <th className="pb-4">Book Title</th>
                  <th className="pb-4">Borrowed By</th>
                  <th className="pb-4">Due Date</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {borrowings.length === 0 ? (
                    <tr><td colSpan="4" className="py-10 text-center text-slate-500 font-bold italic">No active loans found.</td></tr>
                ) : (
                    borrowings.map(loan => (
                        <tr key={loan._id} className="hover:bg-slate-700/30 transition">
                          <td className="py-4 font-bold text-sm uppercase">{loan.book_id?.title || "Unknown Book"}</td>
                          <td className="py-4 text-slate-300 font-bold text-xs">{loan.user_id?.name || "Unknown User"}</td>
                          <td className="py-4">
                            <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-[10px] font-black border border-red-900/50 uppercase">
                                {new Date(loan.due_date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button onClick={() => handleReturnBook(loan._id)} className="bg-green-600 hover:bg-green-700 text-white text-[10px] uppercase px-4 py-2 rounded-lg font-black transition shadow-lg shadow-green-900/20">Mark Returned</button>
                          </td>
                        </tr>
                      ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MANAGE INVENTORY GRID */}
      <div className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 shadow-2xl">
        <h2 className="text-2xl font-black mb-10 italic uppercase tracking-tighter text-slate-400">Manage Catalog Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {allBooks.map(book => (
            <div 
              key={book._id} 
              onClick={() => setSelectedBook(book)}
              className="bg-slate-900 p-5 rounded-[2.5rem] border border-slate-800 cursor-pointer hover:border-red-600 transition-all group relative overflow-hidden"
            >
              <img src={book.image} className="w-full h-44 object-cover rounded-3xl mb-4 group-hover:scale-105 transition-transform" />
              <p className="font-black text-xs truncate uppercase tracking-tighter">{book.title}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{book.author}</p>
              <div className="absolute top-4 right-4 bg-red-600 text-[10px] font-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">EDIT</div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 p-12 rounded-[4rem] w-full max-w-2xl border border-slate-800 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedBook(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white text-3xl transition-colors">✕</button>
            <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tighter">Modify Book Details</h2>
            
            <form onSubmit={handleUpdateBook} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Total Stock</label>
                    <input type="number" className="w-full bg-slate-800 p-4 rounded-2xl outline-none font-black text-red-500 border border-slate-700 focus:ring-2 focus:ring-red-500" value={selectedBook.totalCopies} onChange={(e) => setSelectedBook({...selectedBook, totalCopies: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Available</label>
                    <input type="number" className="w-full bg-slate-800 p-4 rounded-2xl outline-none font-black text-blue-500 border border-slate-700 focus:ring-2 focus:ring-blue-500" value={selectedBook.availableCopies} onChange={(e) => setSelectedBook({...selectedBook, availableCopies: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Status Flag</label>
                    <select className="w-full bg-slate-800 p-4 rounded-2xl outline-none font-black uppercase text-xs border border-slate-700" value={selectedBook.status} onChange={(e) => setSelectedBook({...selectedBook, status: e.target.value})}>
                        <option value="Available">Available</option>
                        <option value="Require Queue">Require Queue</option>
                        <option value="Reserved">Reserved</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Shelf Location</label>
                    <input type="text" className="w-full bg-slate-800 p-4 rounded-2xl outline-none font-bold border border-slate-700" value={selectedBook.location} onChange={(e) => setSelectedBook({...selectedBook, location: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Genre Category</label>
                <select className="w-full bg-slate-800 p-4 rounded-2xl outline-none font-black uppercase text-xs border border-slate-700" value={selectedBook.genre} onChange={(e) => setSelectedBook({...selectedBook, genre: e.target.value})}>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">Synopsis</label>
                <textarea className="w-full bg-slate-800 p-4 rounded-2xl h-32 outline-none font-medium text-slate-300 border border-slate-700" value={selectedBook.description} onChange={(e) => setSelectedBook({...selectedBook, description: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-6">
                {/* Submit button calls handleUpdateBook via the form onSubmit */}
                <button type="submit" className="flex-1 py-5 bg-emerald-600 rounded-2rem font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 transition-all active:scale-95">Save Changes</button>
                
                {/* Type "button" prevents the Delete button from submitting the form */}
                <button type="button" onClick={() => handleDeleteBook(selectedBook._id)} className="flex-1 py-5 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2rem font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">Delete Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}