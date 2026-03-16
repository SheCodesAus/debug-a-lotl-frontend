import { useState, useEffect, useCallback } from "react";
import getClubBooks from "../api/get-club-books";

export default function useClubBooks(clubId, token = null) {
  const [clubBooks, setClubBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState("");

  const refetchClubBooks = useCallback(async () => {
    if (!clubId) return;

    setIsLoadingBooks(true);
    setBooksError("");

    try {
      const books = await getClubBooks(clubId, token);
      setClubBooks(books);
    } catch (error) {
      setBooksError(error.message || "Could not load club books.");
    } finally {
      setIsLoadingBooks(false);
    }
  }, [clubId, token]);

  //reload latest book list, to get the most updated data
  useEffect(() => {
    refetchClubBooks();
  }, [refetchClubBooks]);

  return {
    clubBooks,
    isLoadingBooks,
    booksError,
    refetchClubBooks,
  };
}
