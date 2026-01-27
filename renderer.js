import game from "./game.js";

//stream handling
const wstream = process.stdout;
const rstream = process.stdin;
rstream.setRawMode(true);
rstream.resume();

//state
const cols = process.stdout.columns;
const rows = process.stdout.rows; //wonder what happens when rows exceed the screen
const cursor = { x: 0, y: 2 };

function render() {
  wstream.write("\x1b[?25l");
  console.clear();
  console.log(process.title);
  console.log(
    "time: " +
      game.getTime().curTime +
      "  speed: " +
      game.getStats().wpm +
      "wpm   accuracy: " +
      game.getStats().accuracy +
      "%    errors: " +
      game.getStats().errors,
  );
  console.log("Sample text:");
  console.log(game.getTextState().testText);
  //   console.log(userDisplay);
  cursor.x = 0;
  cursor.y = 3;
  for (let i = 0; i < game.getTextState().userDisplayText.length; i++) {
    wstream.cursorTo(cursor.x, cursor.y);
    wstream.write(game.getTextState().userDisplayText[i]);
    cursor.x++;
    if (cursor.x == cols) {
      cursor.x = 0;
      cursor.y++;
    }
  }
  //   wstream.cursorTo(0, 9);
  //   console.log(user);
  wstream.cursorTo(cursor.x, cursor.y);
  wstream.write("\x1b[?25h");
}

export { rstream, wstream, render };
