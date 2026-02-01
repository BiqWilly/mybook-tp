import AvailabilityBadge from "./AvailabilityBadge";

export default function BookCard({
    book,
    liked = false,
    onToggleLike,
    onOpenModal,
    onQueueUp, // New Prop
    hideQueueAction = false,
}) {
    return (
        <div
            onClick={() => onOpenModal?.(book)}
            className="bg-white rounded-xl shadow-lg overflow-hidden w-64 flex flex-col cursor-pointer relative hover:shadow-2xl transition"
        >
            <div className="h-80 relative">
                <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike?.(book._id);
                    }}
                    className="absolute top-2 right-2 z-10"
                >
                    {liked ? (
                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24" stroke="black" strokeWidth={1}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 text-white" fill="white" viewBox="0 0 24 24" stroke="black" strokeWidth={1}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="p-4 flex flex-col grow">
                <h3 className="font-bold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-600"><b>Author:</b> {book.author}</p>
                <p className="text-sm text-gray-600"><b>Genre:</b> {book.genre}</p>
                <p className="text-sm text-gray-600"><b>Year:</b> {book.publicationYear}</p>

                <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
                    <AvailabilityBadge status={book.status} size="large" />
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">
                        {book.status}
                    </span>
                </div>

                <div className="mt-auto pt-4">
                    {book.status === "Available" && !hideQueueAction && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Stop card click
                                onOpenModal?.(book); // Open the detail modal to show "Borrow" options
                            }}
                            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Borrow Book
                        </button>
                    )}
                    {book.status === "Require Queue" && !hideQueueAction && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onQueueUp?.(book._id);
                            }}
                            className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        >
                            Queue Up
                        </button>
                    )}
                    {book.status === "Unavailable" && (
                        <button disabled onClick={(e) => e.stopPropagation()} className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}