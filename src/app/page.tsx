import Card from "../app/components/card/Card";

const HomePage = async () => {
  let phrase
try {
  const data = await fetch("http://localhost:3000/api/phrases");
  
  if (!data.ok) {
    throw new Error(`HTTP error! status: ${data.status}`);
  }
  
  phrase = await data.json();
  console.log('phrase: ', phrase );
} catch (error) {
  console.log(error instanceof Error ? error.message : 'An error occurred');
}

  //  console.log('phrase: ', phrase );

  return (
    <main className="">
      <Card phrase={phrase} />
    </main>
  );
};

export default HomePage;
