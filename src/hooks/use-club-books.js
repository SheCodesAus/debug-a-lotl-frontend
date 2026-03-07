import { useState, useEffect, useCallback } from "react";
import getClubBooks from "../api/get-club-books";

export default function useClubBooks(clubId){
    const [clubBooks, setClubBooks] = useState([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [booksError, setBooksError] = useState("");

//reusable fetch function for this hook.
//we wrap it in useCallback so react keeps a stable function reference unless clubId changes (helps avoid unnecessary effect re-runs)
    const refetchClubBooks = useCallback(async () => {
//avoids calling API before clubID is available 
        if (!clubId) return;

    setIsLoadingBooks(true);
    setBooksError("");

    try {
      const books = await getClubBooks(clubId);
      setClubBooks(books);
    } catch (error) {
      setBooksError(error.message || "Could not load club books.");
    } finally {
      setIsLoadingBooks(false);
    }
  }, [clubId]);

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