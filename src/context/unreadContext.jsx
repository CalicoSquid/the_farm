import { createContext, useMemo, useState } from "react";

export const UnreadContext = createContext();

export function UnreadProvider({ children }) {
  const [unreadPosts, setUnreadPosts] = useState([]);

  const value = useMemo(
    () => ({
      unreadPosts,
      unreadCount: unreadPosts.length,
      setUnreadPosts,
      markAsRead: (id) => {
        setUnreadPosts((current) => current.filter((postId) => postId !== id));
      },
    }),
    [unreadPosts]
  );

  return <UnreadContext.Provider value={value}>{children}</UnreadContext.Provider>;
}
