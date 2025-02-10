import Card from "../app/components/card/Card";

const HomePage = async () => {
  let phrase;
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/phrases`);

    if (!data.ok) {
      console.log(" error data: ", data);
      throw new Error(`HTTP error! status: ${data.status}`);
    }

    phrase = await data.json();
    console.log("phrase: ", phrase);
  } catch (error) {
    console.log(error instanceof Error ? error.message : "An error occurred");
  }

  //  console.log('phrase: ', phrase );

  return (
    <main className="">
      <Card phrase={phrase} />
    </main>
  );
};

export default HomePage;
