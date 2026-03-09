import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

import BookSearchSection from "../components/4.clubs/BookSearchSection";
import getClub from "../api/get-club";
import postClubBook from "../api/post-club-book";
import patchClubBookStatus from "../api/patch-club-book-status";
import useClubBooks from "../hooks/use-club-books";

function ClubPage() {
  // Read club id from URL: /clubs/:clubId
  const { clubId } = useParams();

  // Logged-in user info (from AuthProvider)
  const { auth } = useAuth();

  // Club details state
  const [club, setClub] = useState(null);
  const [isLoadingClub, setIsLoadingClub] = useState(true);
  const [clubError, setClubError] = useState("");

  // Books state comes from the custom hook
  const {
    clubBooks,
    isLoadingBooks,
    booksError,
    refetchClubBooks,
  } = useClubBooks(clubId);

  // Load club info when page opens or club id changes
  useEffect(() => {
    async function loadClub() {
      try {
        setIsLoadingClub(true);
        setClubError("");

        const clubData = await getClub(clubId);
        setClub(clubData);
      } catch (error) {
        setClubError(error.message || "Could not load this club.");
      } finally {
        setIsLoadingClub(false);
      }
    }

    loadClub();
  }, [clubId]);

  // Owner check: only owner can search/add/change status
  const isOwner = auth?.user_id === club?.owner;

  // Runs when owner clicks "Add to Club" in BookSearchSection
  async function handleAddBook(selectedBook) {
    await postClubBook({
      club_id: Number(clubId),
      google_books_id: selectedBook.google_books_id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description,
      cover_image: selectedBook.cover_image,
    });

    // Reload books so new one appears on screen
    await refetchClubBooks();
  }

  // Runs when owner clicks status buttons (To Read / Reading / Read)
  async function handleChangeStatus(clubBookId, newStatus) {
    await patchClubBookStatus(clubBookId, { status: newStatus });

    // Reload books so moved book appears in correct section
    await refetchClubBooks();
  }

  // Split one big books list into 3 small lists for the UI
  const toReadBooks = clubBooks.filter((book) => book.status === "TO_READ");
  const readingBooks = clubBooks.filter((book) => book.status === "READING");
  const readBooks = clubBooks.filter((book) => book.status === "READ");

  if (isLoadingClub || isLoadingBooks) return <p>Loading...</p>;
  if (clubError) return <p>{clubError}</p>;
  if (booksError) return <p>{booksError}</p>;
  if (!club) return <p>Club not found.</p>;

  return (
    <main>
      {/* Club header */}
      <header>
        <h1>{club.name}</h1>
        <p>{club.description}</p>
        {club.banner_image && <img src={club.banner_image} alt={club.name} />}
      </header>

      {/* Owner-only search/add area */}
      <BookSearchSection
        isOwner={isOwner}
        clubBooks={clubBooks}
        onAddBook={handleAddBook}
      />

      {/* Everyone can see current club books */}
      <section>
        <h2>Current Club Books</h2>

        <h3>To Read</h3>
        {toReadBooks.length === 0 && <p>No books in To Read yet.</p>}
        {toReadBooks.map((book) => (
          <article key={book.id}>
            <p>{book.title}</p>
            <p>{book.author}</p>

            {/* Only owner sees move buttons */}
            {isOwner && (
              <>
                <button onClick={() => handleChangeStatus(book.id, "READING")}>
                  Move to Reading
                </button>
                <button onClick={() => handleChangeStatus(book.id, "READ")}>
                  Move to Read
                </button>
              </>
            )}
          </article>
        ))}

        <h3>Reading</h3>
        {readingBooks.length === 0 && <p>No books in Reading yet.</p>}
        {readingBooks.map((book) => (
          <article key={book.id}>
            <p>{book.title}</p>
            <p>{book.author}</p>

            {isOwner && (
              <>
                <button onClick={() => handleChangeStatus(book.id, "TO_READ")}>
                  Move to To Read
                </button>
                <button onClick={() => handleChangeStatus(book.id, "READ")}>
                  Move to Read
                </button>
              </>
            )}
          </article>
        ))}

        <h3>Read</h3>
        {readBooks.length === 0 && <p>No books in Read yet.</p>}
        {readBooks.map((book) => (
          <article key={book.id}>
            <p>{book.title}</p>
            <p>{book.author}</p>

            {isOwner && (
              <button onClick={() => handleChangeStatus(book.id, "READING")}>
                Move to Reading
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default ClubPage;
