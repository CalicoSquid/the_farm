import { Link } from "react-router-dom";

const renderTextWithLinksAndParagraphs = (text) => {
  return text.split("/p/").map((paragraph, i) => {
    const parts = paragraph.split(/(Rijeka Crnojevića)/g);

    const processedParts = parts.map((part, index) => {
      if (part === "Rijeka Crnojevića") {
        return (
          <Link key={`link-${index}`} to="/map" className="map-link">
            Rijeka Crnojevića
          </Link>
        );
      }

      // Handle [text]{url} links
      const linkRegex = /\[([^\]]+)\]\{([^}]+)\}/g;
      let lastIndex = 0;
      const linkElements = [];
      let match;

      while ((match = linkRegex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          linkElements.push(part.slice(lastIndex, match.index));
        }

        const label = match[1];
        const url = match[2];
        const isExternal = /^https?:\/\//i.test(url);

        if (isExternal) {
          linkElements.push(
            <a
              key={`ext-link-${index}-${match.index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="custom-link"
            >
              {label}
            </a>
          );
        } else {
          linkElements.push(
            <Link
              key={`int-link-${index}-${match.index}`}
              to={url.startsWith("/") ? url : `/${url}`}
              className="custom-link"
            >
              {label}
            </Link>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < part.length) {
        linkElements.push(part.slice(lastIndex));
      }

      const withLinks = linkElements.length > 0 ? linkElements : [part];

      // Handle bold and /br/ line breaks with empty line
      return withLinks.flatMap((fragment, fragIndex) => {
        if (typeof fragment !== "string") return fragment;

        const boldSplit = fragment.split(/\/b\//g);

        return boldSplit.flatMap((segment, segIndex) => {
          if (segIndex % 2 === 1) {
            return <strong key={`bold-${index}-${fragIndex}-${segIndex}`}>{segment}</strong>;
          }

          // Split on /br/ for line breaks + empty line
          return segment.split("/br/").flatMap((line, lineIndex) => {
            if (lineIndex === 0) return line;

            return [
              <br key={`br-${index}-${fragIndex}-${segIndex}-${lineIndex}`} />,
              <br key={`empty-${index}-${fragIndex}-${segIndex}-${lineIndex}`} />,
              line,
            ];
          });
        });
      });
    });

    return (
      <p key={i} className="blog-paragraph">
        {processedParts.flat()}
      </p>
    );
  });
};

export default renderTextWithLinksAndParagraphs;
