// Este archivo tiene errores de lint intencionales
const test = function () {
  var x = 10;
  if (x == 10) {
    console.log('Hello world');
  }

  const unused = 'This variable is unused';
};
