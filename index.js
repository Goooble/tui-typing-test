require("dotenv").config();
console.clear();
process.title = "Typing Test";

//state
const cols = process.stdout.columns;
const rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };
let user = "";
let userDisplay = [];
let index = 0;
let sample =
  "I think that by the time I turn sixty, I will probably be surrounded by children and grandchildren. I have visions of sitting out on a large verandah overlooking the immense garden. The garden would be a riot of colors, most of the plants having been planted by me.".toLowerCase();

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();

//key press
rstream.on("data", (chunk) => {
  const key = handleInput(chunk);
  render();
});

render();
wstream.cursorTo(cursor.x, cursor.y);

function render() {
  console.clear();
  console.log(process.title);
  console.log("Sample text:");
  console.log(sample);
  //   console.log(userDisplay);
  cursor.x = 0;
  cursor.y = 2;
  for (let i = 0; i < userDisplay.length; i++) {
    wstream.cursorTo(cursor.x, cursor.y);
    wstream.write(userDisplay[i]);
    cursor.x++;
    if (cursor.x == cols) {
      cursor.x = 0;
      cursor.y++;
    }
  }
}

function handleInput(chunk) {
  let char = 2000; //for other characters that use ESC
  if (chunk.length == 1) {
    char = chunk[0];
  }
  if (char >= 32 && char <= 126) {
    // console.log(char);
    type(char);
  } else if (char == 0x7f) {
    // backspace();
    // console.log("bac");
  } else if (char == 0x1b) {
    // do something
  }
}

function type(char) {
  //   console.log(char);
  char = String.fromCharCode(char);
  user += char;
  if (sample[index] == char) {
    userDisplay.push("\x1b[32m" + char + "\x1b[0m");
    // console.log(userDisplay);
  } else {
    userDisplay.push("\x1b[31m" + char + "\x1b[0m");
    // process.abort();
  }
  index++;
}
