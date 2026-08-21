import { createContext, useState, useEffect } from "react";

export const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
  const [unreadPosts, setUnreadPosts] = useState(
    localStorage.getItem("unreadPosts")
      ? JSON.parse(localStorage.getItem("unreadPosts"))
      : []
  );
  const [originalUnreadPosts, setOriginalUnreadPosts] = useState(
    JSON.parse(localStorage.getItem("unreadPosts")) || []
  );
  const [unreadCount, setUnreadCount] = useState(unreadPosts.length);

  // Update unreadCount when unreadPosts change
  useEffect(() => {
    setUnreadCount(unreadPosts.length);
  }, [unreadPosts]);

  // Restore unread posts from localStorage on mount
  useEffect(() => {
    const storedUnread = JSON.parse(localStorage.getItem("unreadPosts")) || [];
    setUnreadPosts(storedUnread);
    setOriginalUnreadPosts(storedUnread); // Keep a backup of original posts
  }, []);

  const markAsRead = (id) => {
    const updatedUnread = unreadPosts.filter((postId) => postId !== id);
    setUnreadPosts(updatedUnread);
    localStorage.setItem("unreadPosts", JSON.stringify(updatedUnread));
  };

  const resetUnread = () => {
    // Restore the unread posts to their original state
    setUnreadPosts(originalUnreadPosts);
    localStorage.setItem("unreadPosts", JSON.stringify(originalUnreadPosts));
    localStorage.clear();
  };

  return (
    <UnreadContext.Provider
      value={{ unreadPosts, unreadCount, setUnreadPosts, markAsRead, resetUnread }}
    >
      {children}
    </UnreadContext.Provider>
  );
};
