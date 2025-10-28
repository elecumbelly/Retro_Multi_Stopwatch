# Retro Multi-Stopwatch

A retro-inspired dashboard featuring eight independent stopwatches, complete with neon digital styling and a built-in snapshot tool. The app runs entirely in the browser—no build step, no dependencies—making it perfect for quick timing sessions, demonstrations, or nostalgia-fueled productivity.

## Highlights

- **Eight timers, zero interference:** each stopwatch tracks time independently with dedicated Start, Stop, and Reset controls.
- **Editable labels:** rename every stopwatch on the fly to keep tasks, teams, or experiments organized.
- **Retro LED aesthetic:** Orbitron typography, green neon glow, and tactile button states evoke a late-70s readout.
- **One-click snapshots:** capture the entire dashboard as a PNG and save it wherever you like.
- **Lightweight by design:** plain HTML, CSS, and vanilla JavaScript—just open `index.html` in any modern browser.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/elecumbelly/Retro_Multi_Stopwatch.git
   cd Retro_Multi_Stopwatch
   ```
2. Launch `index.html` in your favorite browser:
   - Double-click the file from Finder/Explorer, **or**
   - Serve the folder locally (optional) via `python3 -m http.server 8000` and visit `http://localhost:8000/index.html`.

That’s it—the dashboard is live.

## Using the Dash

- **Start / Stop / Reset:** buttons operate per stopwatch; they don’t affect the others.
- **Edit names:** click the header text, type a new label (max 24 characters), and press Enter or click outside the field to lock it in.
- **Take a snapshot:** hit “Capture Snapshot” to render the entire dashboard and download a PNG. If your browser supports the File System Access API you’ll be prompted for a save location; otherwise the image drops into your default downloads folder.

> Tip: If you want the download to always skip the prompt, allow automatic downloads for the page in your browser’s site settings.

## Project Structure

```
Retro_Multi_Stopwatch/
├── index.html   # Layout and stopwatch markup
├── styles.css   # Retro aesthetic and responsive layout
└── script.js    # Stopwatch logic, name editing, snapshot capture
```

## Development Notes

- Timing updates run on `requestAnimationFrame` for smooth, battery-friendly rendering.
- Fonts load from Google Fonts; the snapshot workflow waits for them so captured images match the on-screen design.
- Snapshots rely on [`html2canvas`](https://github.com/niklasvh/html2canvas) pulled from jsDelivr. If you need offline support, download the script and update the `<script>` tag to point to your local copy.

## Ideas for Next Iterations

- Add lap recording per stopwatch.
- Persist names and elapsed times in `localStorage`.
- Offer export/import of stopwatch states.
- Bundle as a desktop PWA for quick-launch timing sessions.

## License

This project is released under the [MIT License](LICENSE) — use it, remix it, and share it freely.
