import React from "react";
import { useState } from "react";

const blogPosts = [
  {
    title: "Website Launch",
    date: "March 14, 2025",
    summary:
      "We're excited to announce the launch of our new website! Stay tuned for more updates as we continue to build and improve.",
    link: "#",
    span: { row: 2, column: 2 },
  },
  {
    title: "New Features Coming Soon",
    date: "March 20, 2025",
    summary:
      "We've been working hard on adding new features to enhance your experience. Stay updated for what's coming next.",
    link: "#",
    span: { row: 1, column: 1 },
  },
  {
    title: "Performance Improvements",
    date: "March 25, 2025",
    summary:
      "Our team has made several performance improvements to ensure a smoother experience across all devices.",
    link: "#",
    span: { row: 1, column: 1 },
  },
  {
    title: "Update on Progress",
    date: "April 2, 2025",
    summary:
      "We’ve made great progress and are adding more functionalities. Here's a sneak peek of what’s coming next.",
    link: "#",
    span: { row: 1, column: 2 },
  },
  {
    title: "Bug Fixes and Optimizations",
    date: "April 10, 2025",
    summary:
      "We’ve fixed several bugs and optimized the website’s performance. Read on to see the changes.",
    link: "#",
    span: { row: 1, column: 1 },
  },
  {
    title: "Upcoming Events and Milestones",
    date: "April 15, 2025",
    summary:
      "We have some exciting events and milestones lined up. Stay tuned for more details!",
    link: "#",
    span: { row: 1, column: 1 },
  },
];

export default function Blog() {
  const [showPage, setShowPage] = useState(false);

  if (!showPage)
    return (
      <div className="flex w-full justify-center items-center">
        <p className="h2-text">Coming Soon...</p>
      </div>
    );
  return (
    <div className="blog-container mx-auto w-full max-w-6xl px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Updates</h2>
      <div className="grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="blog-post"
            style={{
              gridRow: `span ${post.span.row}`,
              gridColumn: `span ${post.span.column}`,
            }}
          >
            <h3>{post.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{post.date}</p>
            <p className="text-base text-gray-700 mb-4">{post.summary}</p>
            <a href={post.link} className="text-blue-600 hover:underline">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
