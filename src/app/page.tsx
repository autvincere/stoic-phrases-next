import Card from "../app/components/card/Card";

const HomePage = async () => {
  let phrase = null;

  const apiUrl = process.env.API_URL;

  try {
    const data = await fetch(`${apiUrl}/api/phrases`, { cache: "no-store" });

    if (!data.ok) {
      console.log("Error data: ", data);
      throw new Error(`HTTP error! status: ${data.status}`);
    }

    phrase = await data.json();
    console.log("phrase: ", phrase);
  } catch (error) {
    console.log(error instanceof Error ? error.message : "An error occurred");
  }

  return (
    <main>
      <Card phrase={phrase} />
    </main>
  );
};

export default HomePage;
