import { Link } from "react-router-dom";

const renderTextWithLinksAndParagraphs = (text) => {
  return text.split("/p/").map((paragraph, i) => {
    const parts = paragraph.split(/(Rijeka Crnojevića)/g); // Keep matched link text as separate parts

    const processedParts = parts.map((part, index) => {
      if (part === "Rijeka Crnojevića") {
        return (
          <Link key={`link-${index}`} to="/map" className="map-link">
            Rijeka Crnojevića
          </Link>
        );
      }

      // Process /b/ markers for bold text
      const boldSplit = part.split(/\/b\//g);

      if (boldSplit.length === 1) {
        return part; // no bold markers
      }

      // If there are bold markers, alternate between plain and bold text
      return boldSplit.map((segment, segIndex) =>
        segIndex % 2 === 1 ? (
          <strong key={`bold-${index}-${segIndex}`}>{segment}</strong>
        ) : (
          segment
        )
      );
    });

    return (
      <p key={i} className="blog-paragraph">
        {processedParts.flat()}
      </p>
    );
  });
};

export default renderTextWithLinksAndParagraphs;
