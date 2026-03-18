import { useState, useEffect, useCallback } from "react";
import getClubMeetings from "../api/get-club-meetings";

export default function useClubMeetings(clubId, token = null) {
  const [clubMeetings, setClubMeetings] = useState([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);
  const [meetingsError, setMeetingsError] = useState("");

  const refetchClubMeetings = useCallback(async () => {
    if (!clubId) return;

    setIsLoadingMeetings(true);
    setMeetingsError("");

    try {
      const meetings = await getClubMeetings(clubId, token);
      setClubMeetings(Array.isArray(meetings) ? meetings : []);
    } catch (error) {
      setMeetingsError(error.message || "Could not load club meetings.");
      setClubMeetings([]);
    } finally {
      setIsLoadingMeetings(false);
    }
  }, [clubId, token]);

  useEffect(() => {
    refetchClubMeetings();
  }, [refetchClubMeetings]);

  return {
    clubMeetings,
    isLoadingMeetings,
    meetingsError,
    refetchClubMeetings,
  };
}
