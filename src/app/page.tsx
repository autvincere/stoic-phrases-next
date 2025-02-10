import Card from "../app/components/card/Card";

const HomePage = async () => {
  let phrase = null;
  const apiUrl = process.env.API_URL || "http://localhost:3000";

  try {
    const data = await fetch(`${apiUrl}/api/phrases`, { cache: "no-store" });

    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }

    phrase = await data.json();
  } catch (error) {
    console.log("Error obteniendo la frase:", error);
  }

  return (
    <main>
      <Card phrase={phrase || { phrase: "Frase de prueba", author: "Desconocido", image_url: "" }} />
    </main>
  );
};

export default HomePage;
