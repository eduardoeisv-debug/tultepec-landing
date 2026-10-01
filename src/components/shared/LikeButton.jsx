import { useEffect, useState } from "react";
import { fetchLikeStatus, likePage, unlikePage, isSupabaseConfigured } from "../../lib/likesClient.js";
import useVisitorId from "../../hooks/useVisitorId.js";
import "./LikeButton.css";

const HeartIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.6 4c2-.3 3.9.6 5 2.2C11.7 4.6 13.6 3.7 15.6 4c3.3.5 5.1 3.8 3.6 7.2-2.5 4.7-10 9.3-10 9.3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LikeButton() {
  const visitorId = useVisitorId();
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchLikeStatus(visitorId).then(({ count: c, liked: l, error }) => {
      if (!error) {
        setCount(c);
        setLiked(l);
      }
    });
  }, [visitorId]);

  if (!isSupabaseConfigured) return null;

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => (c === null ? c : c + (nextLiked ? 1 : -1)));

    const { error } = nextLiked ? await likePage(visitorId) : await unlikePage(visitorId);

    if (error) {
      // Revertimos si falló.
      setLiked(!nextLiked);
      setCount((c) => (c === null ? c : c + (nextLiked ? -1 : 1)));
    }

    setBusy(false);
  };

  return (
    <button
      type="button"
      className={`like-button ${liked ? "like-button--active" : ""}`}
      onClick={handleClick}
      aria-pressed={liked}
    >
      <span className="like-button__icon">{HeartIcon}</span>
      <span>{liked ? "Te gusta" : "Me gusta"}</span>
      {count !== null && <span className="like-button__count">{count}</span>}
    </button>
  );
}
