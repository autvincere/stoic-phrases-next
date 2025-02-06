"use client";
import { useState } from "react";

import styles from "./Card.module.css";

interface IPhrase {
  phrase: string;
  author: string;
  image_url: string;
}

const Card = ({ phrase = null }) => {
  const [phrases, setPhrases] = useState<IPhrase | null>(phrase);
  const [loading, setLoading] = useState(false);

  const formatPhrase = (phrase: string) => {
    // Dividir la frase en segmentos por '.' o '?'
    const segments = phrase.split(/(?<=[.?])/g).filter(Boolean);

    return segments.map((segment, index) => (
      <h2 key={index} className={styles.phrase__segment}>
        {segment.trim()}
      </h2>
    ));
  };

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
    <div
      className={styles.card__container}
      style={{ backgroundImage: `radial-gradient(circle, #0000 0%, #2b2b2bcc 80%), url(${phrases?.image_url})` }}
    >
      {phrases !== null ? (
        <>
          <div className={styles.phrase}>{formatPhrase(phrases.phrase)}</div>
          <p className={styles.phrase__author}>{phrases.author}</p>
        </>
      ) : (
        ""
      )}
      {loading ? "Cargando..." : ""}
      <button
        onClick={fetchNewPhrase}
        type="submit"
        className={styles.phrase__next_button}
      >
        Otra frase
      </button>
    </div>
  );
};
export default Card;
