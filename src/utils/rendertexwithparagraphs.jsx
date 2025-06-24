import { Link } from "react-router-dom";


const renderTextWithLinksAndParagraphs = (text) => {
    return text.split("/p/").map((paragraph, i) => {
      const parts = paragraph.split(/(Rijeka Crnojevića)/g); // Keep the matched text as a separate element

      return (
        <p key={i} className="blog-paragraph">
          {parts.map((part, index) =>
            part === "Rijeka Crnojevića" ? (
              <Link key={index} to="/map" className="map-link">
                Rijeka Crnojevića
              </Link>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  export default renderTextWithLinksAndParagraphs   