import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getReferenceBooks,
  createReferenceBook,
  deleteReferenceBook,
  updateReferenceBook,
} from "../lib/referenceBookApi";

const ReferenceBook = () => {
  const [bookName, setBookName] = useState("");
  const [bookList, setBookList] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getReferenceBooks()
      .then(setBookList)
      .catch(() => {
        toast.error("Failed to fetch books.");
        setBookList([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = bookName.trim();
    if (!trimmedName) return;

    const isDuplicate = bookList.some(
      (book) =>
        book.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!editBook || book.id !== editBook.id)
    );

    if (isDuplicate) {
      toast.error("This book is already present. Duplicate not allowed.");
      return;
    }

    try {
      if (editBook) {
        const updated = await updateReferenceBook(editBook.id, {
          name: trimmedName,
        });
        setBookList(
          bookList.map((b) => (b.id === editBook.id ? updated : b))
        );
        toast.success("Book updated successfully!");
        setEditBook(null);
      } else {
        const created = await createReferenceBook({ name: trimmedName });
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
      await deleteReferenceBook(id);
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

  const handleCancelEdit = () => {
    setEditBook(null);
    setBookName("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">
            Reference Book Name
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
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {editBook ? "Update Book" : "Add Book"}
          </button>

          {editBook && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full mt-2 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Right: Book List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">All Books</h2>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
            className="w-full p-2 mb-4 border rounded"
          />

          <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {bookList
              .filter((book) =>
                book.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((book) => (
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
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferenceBook;
