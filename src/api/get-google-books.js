// Search books from Google Books API using a title/author query.
async function getGoogleBooks(query) {
  // Clean user input and returns [] if user typed nothing
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  // encodeURIComponent prevents errors with spaces/special characters, so URL is valid
  //google url calls volume endpoint with q (search query), results are limit to 20, and printype limit to books only.
  const encodedQuery = encodeURIComponent(trimmedQuery);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=20&printType=books`;

  // Sending request to Google Books API.
  const response = await fetch(url, { method: "GET" });

  // Handle failed request with a clear error message.
  if (!response.ok) {
    const fallbackError = "Error searching Google Books";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.error?.message ?? fallbackError;
    throw new Error(errorMessage);
  }

  //parses API response body, items handles no results safely by using empty arrays
  const data = await response.json();
  const items = data?.items ?? [];

  // Converts raw google structure in an app-friendly shape.
  return items.map((item) => {
    const volumeInfo = item?.volumeInfo ?? {};
    const imageLinks = volumeInfo?.imageLinks ?? {};

    return {
      google_books_id: item?.id ?? null,
      title: volumeInfo?.title ?? "Untitled",
      author: volumeInfo?.authors?.join(", ") ?? "Unknown author",
      description: volumeInfo?.description ?? "",
      cover_image: imageLinks?.thumbnail ?? imageLinks?.smallThumbnail ?? "",
      published_date: volumeInfo?.publishedDate ?? null,
    };
  });
}

export default getGoogleBooks;