import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetching all books and finding one is okay for small projects, 
        // but eventually, you can create a GET /api/books/:id route.
        const response = await fetch(`${API_URL}/api/books`);
        const data = await response.json();
        const foundBook = data.find((b) => b._id === id);
        setBook(foundBook);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading book details...</div>;

  if (!book) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
        <img
          src={book.image || "/assets/placeholder.jpg"}
          alt={book.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-gray-700 mt-1"><b>Author:</b> {book.author}</p>
        <p className="text-gray-700 mt-1"><b>Genre:</b> {book.genre}</p>
        <p className="text-gray-700 mt-1"><b>Published:</b> {book.publicationYear}</p>
        <p className="text-gray-700 mt-2">{book.description}</p>
        <p className="text-gray-700 mt-2"><b>Available Copies:</b> {book.availableCopies}</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}