import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../../firebase.config";

const SDK_TIMEOUT_MS = 3500;
const REST_TIMEOUT_MS = 6000;
const IS_DEV = import.meta.env.DEV;

const withTimeout = (promise, ms, label) =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );

    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });

const decodeFirestoreValue = (value = {}) => {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("referenceValue" in value) return value.referenceValue;
  if ("bytesValue" in value) return value.bytesValue;
  if ("geoPointValue" in value) return value.geoPointValue;

  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue);
  }

  if ("mapValue" in value) {
    return decodeFirestoreFields(value.mapValue.fields || {});
  }

  return undefined;
};

const decodeFirestoreFields = (fields = {}) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)])
  );

const decodeRestDocument = (document) => ({
  ...decodeFirestoreFields(document.fields || {}),
  id: document.name.split("/").pop(),
  local: false,
});

const restBaseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`Firestore REST ${response.status}: ${message}`);
    }

    return payload;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Firestore REST request timed out after ${REST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
};

// Blogs are already publicly readable by the existing website. Firestore's REST
// API therefore does not need a Firebase API key for these reads; authorization
// continues to be governed by the project's Firestore Security Rules.
const fetchBlogArchiveViaRest = async () => {
  const blogs = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (pageToken) params.set("pageToken", pageToken);

    const payload = await fetchJson(`${restBaseUrl}/Blogs?${params.toString()}`);
    blogs.push(...(payload.documents || []).map(decodeRestDocument));
    pageToken = payload.nextPageToken || "";
  } while (pageToken);

  return blogs;
};

const fetchBlogViaRest = async (id) => {
  try {
    const payload = await fetchJson(`${restBaseUrl}/Blogs/${encodeURIComponent(id)}`);
    return decodeRestDocument(payload);
  } catch (error) {
    if (error.message.includes("Firestore REST 404")) return null;
    throw error;
  }
};

const loadArchiveViaSdk = async (db) => {
  const snapshot = await withTimeout(
    getDocs(collection(db, "Blogs")),
    SDK_TIMEOUT_MS,
    "Firestore SDK blog archive request"
  );

  return snapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    id: docSnap.id,
    local: false,
  }));
};

export const loadBlogArchive = async (db) => {
  // The deployed site already proves the SDK path works on the production
  // origin. In Vite dev, go straight to the public REST read so localhost does
  // not get stuck waiting on the SDK transport.
  if (IS_DEV) {
    try {
      const blogs = await fetchBlogArchiveViaRest();
      console.info(`Loaded ${blogs.length} archived farm stories through Firestore REST (dev).`);
      return { source: "rest-dev", blogs };
    } catch (restError) {
      console.warn("Firestore REST dev read failed; trying SDK once:", restError);

      try {
        const blogs = await loadArchiveViaSdk(db);
        return { source: "sdk-dev-fallback", blogs };
      } catch (sdkError) {
        const combinedError = new Error(
          `Unable to load blog archive in development. REST: ${restError.message}. SDK: ${sdkError.message}`
        );
        combinedError.restError = restError;
        combinedError.sdkError = sdkError;
        throw combinedError;
      }
    }
  }

  let sdkError;

  try {
    const blogs = await loadArchiveViaSdk(db);
    return { source: "sdk", blogs };
  } catch (error) {
    sdkError = error;
    console.warn("Firestore SDK archive read failed; trying public REST fallback:", error);
  }

  try {
    const blogs = await fetchBlogArchiveViaRest();
    console.info(`Loaded ${blogs.length} archived farm stories through Firestore REST.`);
    return { source: "rest", blogs };
  } catch (restError) {
    const combinedError = new Error(
      `Unable to load blog archive. SDK: ${sdkError?.message || "unknown error"}. REST: ${restError.message}`
    );
    combinedError.sdkError = sdkError;
    combinedError.restError = restError;
    throw combinedError;
  }
};

export const loadBlogById = async (db, id) => {
  if (IS_DEV) {
    try {
      return await fetchBlogViaRest(id);
    } catch (restError) {
      console.warn(`Firestore REST dev read for blog ${id} failed; trying SDK:`, restError);
    }
  }

  try {
    const snapshot = await withTimeout(
      getDoc(doc(db, "Blogs", id)),
      SDK_TIMEOUT_MS,
      "Firestore SDK blog post request"
    );

    if (!snapshot.exists()) return null;
    return { ...snapshot.data(), id: snapshot.id, local: false };
  } catch (error) {
    console.warn(`Firestore SDK read for blog ${id} failed; trying public REST fallback:`, error);
    return fetchBlogViaRest(id);
  }
};
