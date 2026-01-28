maintain a virtual cursor, dont trust terminal cursor - changes based on the terminal and stuff

- watch out for resize

hide the cursor while rendering

- setIntervals to simulate frames

Only render on events, and what changes

## flickering

dont clear, overwrite
buffering
differential redraw

- partial
  - line based
  - grid based
- you can have a string with cursor stream frame but you cant diff that
- you anyway need this diff rendering so you can write at once
- you will have recreate the the frame object itself, if theres a resize of the screen

### ansi cursor

- row major (x,y are flipped)
- 1 - indexed

## Scrolling

TUI's usually disable internal scrolling and implement it themseves

- All content view
- viewport content
- buffer - gets displayed

## todos:

- screen flickering
- reset shortcut
- redo text
- esc to menu
- esc again to exit
- find more text
