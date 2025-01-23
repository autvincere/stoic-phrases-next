"use client";
import { useState } from "react";
interface IPhrase {
  phrase: string;
  author: string;
}

const Card = ({ phrase = null }) => {
  const [phrases, setPhrases] = useState<IPhrase | null>(phrase);
  const [loading, setLoading] = useState(false);

  const fetchNewPhrase = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/phrases");
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      console.error("Error fetching new phrase:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("phrases", phrases?.text)
  return (
    <div className="bkg card__container">
      {phrases !== null ? (
        <>
          <h2 className="phrase">{phrases.phrase}</h2>
          <p>{phrases.author}</p>
        </>
      ) : (
        ""
      )}
      {loading ? "Cargando..." : ""}
      <button
        onClick={fetchNewPhrase}
        type="submit"
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Otra frase
      </button>
    </div>
  );
};
export default Card;
