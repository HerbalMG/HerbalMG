import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getBooks, createBook, deleteBook } from '../lib/bookApi';

const RefrenceBook = () => {
  const [bookName, setBookName] = useState("");
  const [bookList, setBookList] = useState([]);
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    getBooks().then(setBookList).catch(() => setBookList([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        // Update book in backend
        const res = await fetch(`http://localhost:3001/api/book/${editBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: bookName }),
        });
        const updated = await res.json();
        setBookList(bookList.map(b => b.id === editBook.id ? updated : b));
        setEditBook(null);
        toast.success("Book updated successfully!");
      } else {
        const created = await createBook({ name: bookName });
        setBookList([created, ...bookList]);
        toast.success("Book added successfully!");
      }
      setBookName("");
    } catch {
      toast.error("Failed to save book.");
    }
  };

  const handleRemoveBook = async (id) => {
    try {
      await deleteBook(id);
      setBookList(bookList.filter((book) => book.id !== id));
      toast.success("Book removed.");
    } catch {
      toast.error("Failed to remove book.");
    }
  };

  const handleEditBook = (book) => {
    setEditBook(book);
    setBookName(book.name);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">
            Refrence Book Name
          </label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter book name"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editBook ? 'Update Book' : 'Submit'}
          </button>
        </form>

        {/* Right: Book List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">All Books</h2>
          {bookList.length === 0 ? (
            <p className="text-gray-500">No books added yet.</p>
          ) : (
            <div className="max-h-[240px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {bookList.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center gap-4 bg-white p-3 rounded shadow"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{book.name}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveBook(book.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEditBook(book)}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefrenceBook;
