import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch books from Open Library
  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setBooks(data.docs.slice(0, 12)); // limit to 12 results
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>📚 Book Finder</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {loading && <p className="loading">Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-grid">
        {books.map((b) => {
          const coverUrl = b.cover_i
            ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
            : "https://via.placeholder.com/150x200?text=No+Cover";

          return (
            <div key={b.key} className="book-card">
              <img src={coverUrl} alt={b.title} />
              <h3>{b.title}</h3>
              <p>{b.author_name?.[0] || "Unknown Author"}</p>
              <p>📅 {b.first_publish_year || "N/A"}</p>
              <a
                href={`https://openlibrary.org${b.key}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Open Library
              </a>
            </div>
          );
        })}
      </div>

      {!loading && !error && books.length === 0 && query && (
        <p className="no-results">No results found for “{query}”.</p>
      )}

      <footer className="footer">
        <p>Data from Open Library API</p>
      </footer>
    </div>
  );
}
