"use client";
import { useState } from "react";

import styles from "./Card.module.css";

const FALLBACK_IMAGE = "/bkg_fallback.jpg";


interface IPhrase {
  phrase: string;
  author: string;
  image_url?: string;
}

const Card = ({ phrase = null }) => {
  const [phrases, setPhrases] = useState<IPhrase | null>(phrase);
  const [loading, setLoading] = useState(false);

    const formatPhrase = (phrase?: string) => {
      if (!phrase) return <h2 className={styles.phrase__segment}>Frase no disponible</h2>;
    
      const segments = phrase.split(/(?<=[.?])/g).filter(Boolean);
    
      return segments.map((segment, index) => (
        <h2 key={index} className={styles.phrase__segment}>
          {segment.trim()}
        </h2>
      ));
    };
    
  
 console.log('process: ', process.env.NEXT_PUBLIC_API_URL + '/api/phrases')

  const fetchNewPhrase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/phrases`);
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      console.error("Error fetching new phrase:", error);
    } finally {
      setLoading(false);
    }
  };

const imageUrl = phrases?.image_url || FALLBACK_IMAGE;

  return (
    <div
      className={styles.card__container}
      style={{ backgroundImage: `radial-gradient(circle, #0000 0%, #2b2b2bcc 80%), url(${imageUrl})` }}
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
