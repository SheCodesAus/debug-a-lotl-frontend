import getGoogleBooks from "../../api/get-google-books";
import { useState } from "react";

/* This BookSearch Section is for:
-Shows search UI for owner only
-Calls Google API Books
-Show results
-Let owners click "add to club"
*/

function BookSearchSection ({isOwner, clubBooks, onAddBook}){
//What user types in the search box
const [query, setQuery] = useState("");
//Results we receive from Google Books
cons [results, setResults] = useState([]);
//Loading state while waiting for API result
const [isLoading, setIsLoading] = useState(false);
//Error message if something fails
const [error, setError] = useState("");

//only owner can see
if (!isOwner) return null;

//Helper: checks if a searched book is already in this club
function isAlreadyAdded(googleBookId){
    return clubBooks.some((book) => book.google_books_id === googleBookId)
}

//runs when user submits search form
async function handleSearch(event){
    event.PreventDefault(); //stops full page reload
    setError("");

    const cleanQuery = query.trim();
    if (!cleanQuery){
        setError("Please type a book title or author.")
        return;
    }

    try {
        setisLoading(true);
        const books = await getGoogleBooks(cleanQuery);
        setResults(books);
    }catch (err) {
        setError(err.message || "Could not search books.");
    }finally {
        setIsLoading(false);
    }
}

// Runs when owner clicks Add button on one result
async function handleAddClick(book) {
    try {
      await onAddBook(book);
    } catch (err) {
      setError(err.message || "Could not add this book.");
    }  
}

return (
    <section>
        <h2>Search New Books</h2>

        <form onSubmit={handleSearch}>
            <input
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={(event) => setQuery(event.target.value)}/>
            <button type="submit" disabed={isLoading}>
                {isLoading ? "Searching..": "Search"}
            </button>
        </form>

        {error && <p>{error}</p>}

        <div>
            {results.map((book) => {
                const alreadyAdded = isAlreadyAdded(book.google_books_id);
                return(
                    <article key={book.google_books_id}>
                        <img src={book.cover_image} alt = {book.title} width="60"/>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>

                        <button 
                        type="button"
                        onClick={() => handleAddClick(book)}
                        disabled={alreadyAdded}>
                        </button>
                    </article>
                );
            })}
        </div>
    </section>
);
}

export default BookSearchSection;
