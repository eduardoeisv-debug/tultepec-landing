import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { fetchLikeStatus, likePage, unlikePage, isSupabaseConfigured } from "../../lib/likesClient.js";
import useVisitorId from "../../hooks/useVisitorId.js";
import "./LikeButton.css";

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
      <span className="like-button__icon">
        <Heart size={19} strokeWidth={1.8} fill={liked ? "currentColor" : "none"} />
      </span>
      <span>{liked ? "Te gusta" : "Me gusta"}</span>
      {count !== null && <span className="like-button__count">{count}</span>}
    </button>
  );
}
