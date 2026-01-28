# CLI Typing Test (Node.js TUI)

A fast, minimal **terminal-based typing test** built with Node.js that focuses on **raw stdin handling, terminal rendering, and performance metrics**—without relying on high-level TUI frameworks.

[Journal](journal.md)

[NotesTaken](notes.md)

## Features

- ⌨️ Real-time typing test in the terminal
- 📊 Accurate **WPM and accuracy** calculation
- 🎯 Character-level correctness tracking
- 🔙 Proper backspace handling (including error correction)
- 🖥️ Flicker-free screen updates using manual redraw control
- 🎨 Colored feedback using ANSI escape codes
- ⚡ Lightweight and dependency-minimal

---

## Why This Project Exists

Most CLI typing tests rely on libraries like `ink`, `blessed`, or full TUI frameworks that abstract away how terminals actually work.

This project intentionally avoids that.

- How `stdin` works in raw mode
- How keypress events are captured
- How cursors move
- How screens redraw
- How terminal flickering happens (and how to prevent it)
- How timing and metrics should be calculated correctly

---

## Installation

```bash
git clone https://github.com/your-username/cli-typing-test.git
cd cli-typing-test
npm install
node main.js
```
