/**
 * Adds a book to a club. Owner only. Book is created with status "reading" so it appears in Currently Reading.
 * Uses backend endpoint POST /clubs/{id}/books/
 * @param {string} token - Auth token (required).
 * @param {Object} payload - Must include club_id, google_books_id, title; optional author, description, cover_image, isbn, genre.
 * @returns {Promise<Object>} Created club book object.
 */
async function postClubBook(token, payload) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "";
  const clubId = payload.club_id;
  const url = `${baseUrl}/clubs/${clubId}/books/`;

  const body = {
    google_books_id: payload.google_books_id ?? "",
    title: payload.title ?? "",
    author: payload.author ?? "",
    description: payload.description ?? "",
    cover_image: payload.cover_image ?? "",
    isbn: payload.isbn ?? "",
    genre: payload.genre ?? "",
    status: "reading",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const fallbackError = "Could not add this book.";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    throw new Error(data?.detail ?? fallbackError);
  }

  return await response.json();
}

export default postClubBook;
