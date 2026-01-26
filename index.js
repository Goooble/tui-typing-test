require("dotenv").config();
console.clear();
process.title = "Typing Test";

//state
const cols = process.stdout.columns;
const rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 0 };
const user = "";

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();

//key press
rstream.on("data", (chunk) => {
  const key = handleInput(chunk);
  console.log(chunk);
  //   render();
});

render();

function render() {
  console.clear();
  console.log(process.title);
  console.log("Sample text:");
  console.log(
    "I think that by the time I turn sixty, I will probably be surrounded by children and grandchildren. I have visions of sitting out on a large verandah overlooking the immense garden. The garden would be a riot of colors, most of the plants having been planted by me.",
  );
}

function handleInput(chunk) {
  let char = 2000; //for other characters that use ESC
  if (chunk.length == 1) {
    char = chunk[0];
  }
  if ((char >= 97 && char <= 122) || (char >= 65 && char <= 90)) {
    // type(char);
  } else if (char == 0x7f) {
    // backspace();
    // console.log("bac");
  } else if (char == 0x1b) {
    // do something
  }
}
