import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import BookSearchSection from "../components/4.clubs/BookSearchSection";
import getClubBooks from "../api/get-club-books";
import postClubBook from "../api/post-club-book";
import patchClubBookStatus from "../api/patch-club-book-status";
import getClub from "../api/get-club";
import useClubBooks from "../hooks/use-club-books"

function ClubPage() {

const {clubBooks, isLoadingBooks, booksError, refetchClubBooks } = useClubBooks(clubId);


  return <div>Club page</div>;
}

export default ClubPage;
