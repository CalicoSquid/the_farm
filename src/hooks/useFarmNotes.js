import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import db from "../../firebase.config";

const legacySources = [
  { collectionName: "Land", category: "Progress", place: "The farm" },
  { collectionName: "Nature", category: "Nature", place: "The land" },
  { collectionName: "Area", category: "Around here", place: "Rijeka Crnojevića" },
];

const toDate = (value) => {
  if (!value) return new Date(0);
  if (typeof value?.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

const normalizeNote = (docSnap, source = {}) => {
  const data = docSnap.data();
  const imageUrl = data.imageUrl || data.url || "";
  const text = data.text || data.note || data.description || "";

  return {
    id: `${source.collectionName || "FarmNotes"}-${docSnap.id}`,
    sourceId: docSnap.id,
    sourceCollection: source.collectionName || "FarmNotes",
    imageUrl,
    text,
    title: data.title || "",
    category: data.category || source.category || "Farm note",
    place: data.place || source.place || "",
    createdAt: toDate(data.createdAt || data.date),
    featured: Boolean(data.featured),
  };
};

const fetchNotesFromCollection = async (collectionName, limitCount, source = {}) => {
  try {
    const ref = collection(db, collectionName);
    const q = query(ref, orderBy("createdAt", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) =>
      normalizeNote(docSnap, { ...source, collectionName })
    );
  } catch (error) {
    // A new FarmNotes collection may not exist yet, or older gallery collections
    // may be restricted by rules. One unavailable source should never blank the feed.
    console.warn(`Unable to load ${collectionName}:`, error);
    return [];
  }
};

const dedupeNotes = (notes) => {
  const seen = new Set();

  return notes.filter((note) => {
    const key = note.imageUrl || `${note.sourceCollection}:${note.sourceId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const formatFarmNoteDate = (date, options = {}) => {
  if (!date || Number.isNaN(date.getTime()) || date.getTime() === 0) return "Undated";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    ...(options.includeYear ? { year: "numeric" } : {}),
  });
};

export default function useFarmNotes({ limitCount = 36 } = {}) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;

    const fetchFarmNotes = async () => {
      setLoading(true);
      setError(false);

      try {
        const legacyLimit = Math.min(
          limitCount,
          Math.max(3, Math.ceil(limitCount / 4))
        );

        const [newNotes, ...legacyNotes] = await Promise.all([
          fetchNotesFromCollection("FarmNotes", limitCount),
          ...legacySources.map((source) =>
            fetchNotesFromCollection(source.collectionName, legacyLimit, source)
          ),
        ]);

        const merged = dedupeNotes([newNotes, ...legacyNotes].flat())
          .filter((note) => note.imageUrl || note.text)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, limitCount);

        if (alive) setNotes(merged);
      } catch (fetchError) {
        console.error("Unable to load farm notes:", fetchError);
        if (alive) setError(true);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchFarmNotes();

    return () => {
      alive = false;
    };
  }, [limitCount]);

  return { notes, loading, error };
}
