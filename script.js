const DEFAULT_NAME_PREFIX = "Stopwatch";

class Stopwatch {
  constructor(root) {
    this.root = root;
    this.display = root.querySelector(".display");
    this.startBtn = root.querySelector(".start");
    this.stopBtn = root.querySelector(".stop");
    this.resetBtn = root.querySelector(".reset");

    this.elapsed = 0;
    this.running = false;
    this.startTime = 0;
    this.rafId = null;

    this._tick = this._tick.bind(this);

    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.resetBtn.addEventListener("click", () => this.reset());

    this.display.classList.remove("running");
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;

    this.render(0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now() - this.elapsed;
    this.display.classList.add("running");
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.rafId = requestAnimationFrame(this._tick);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    this.elapsed = performance.now() - this.startTime;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.display.classList.remove("running");
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.render(this.elapsed);
  }

  reset() {
    this.elapsed = 0;
    if (this.running) {
      this.startTime = performance.now();
    }
    this.render(this.elapsed);
  }

  _tick(now) {
    if (!this.running) return;
    this.elapsed = now - this.startTime;
    this.render(this.elapsed);
    this.rafId = requestAnimationFrame(this._tick);
  }

  render(elapsed) {
    const totalMs = Math.floor(elapsed);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const tenths = Math.floor((totalMs % 1000) / 100);
    this.display.textContent = `${pad2(minutes)}:${pad2(seconds)}.${tenths}`;
  }
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

document
  .querySelectorAll(".stopwatch")
  .forEach((stopwatchNode, index) => {
    new Stopwatch(stopwatchNode);
    setupNameEditor(stopwatchNode, index + 1);
  });

const captureBtn = document.getElementById("capture-btn");
if (captureBtn) {
  captureBtn.addEventListener("click", handleCaptureClick);
}

function setupNameEditor(root, index) {
  const input = root.querySelector(".name-input");
  if (!input) return;
  const defaultName = `${DEFAULT_NAME_PREFIX} ${index}`;
  input.value = sanitizeName(input.value) || defaultName;

  input.addEventListener("focus", () => {
    input.select();
  });

  input.addEventListener("blur", () => {
    input.value = sanitizeName(input.value) || defaultName;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    }
  });
}

function sanitizeName(rawValue) {
  return rawValue
    .replace(/[^0-9a-zA-Z\s\-_'&]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function handleCaptureClick() {
  if (typeof html2canvas !== "function") {
    window.alert("Snapshot helper failed to load. Check your internet connection and try again.");
    return;
  }

  const target = document.querySelector(".dashboard");
  if (!target) {
    window.alert("Nothing to capture yet.");
    return;
  }

  const originalLabel = captureBtn.textContent;
  captureBtn.disabled = true;
  captureBtn.textContent = "Capturing...";

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(target, {
      backgroundColor: "#040806",
      scale: window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2) : 1,
      useCORS: true,
    });

    const blob = await canvasToBlob(canvas);
    const suggestedName = `retro-stopwatch-${timestampString()}.png`;

    if (typeof window.showSaveFilePicker === "function") {
      await saveWithPicker(blob, suggestedName);
    } else {
      triggerDownload(blob, suggestedName);
    }

    captureBtn.textContent = "Captured!";
    setTimeout(() => {
      captureBtn.textContent = originalLabel;
    }, 1600);
  } catch (error) {
    console.error("Failed to capture snapshot", error);
    window.alert("Unable to capture a snapshot right now. Please try again.");
    captureBtn.textContent = originalLabel;
  } finally {
    captureBtn.disabled = false;
  }
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas could not be converted to a blob."));
        }
      },
      "image/png",
      0.92
    );
  });
}

async function saveWithPicker(blob, suggestedName) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: "PNG Image",
          accept: { "image/png": [".png"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    if (error.name === "AbortError") {
      // User canceled the picker; silently ignore.
      return;
    }
    throw error;
  }
}

function triggerDownload(blob, suggestedName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

function timestampString() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    pad2(now.getMonth() + 1),
    pad2(now.getDate()),
    "-",
    pad2(now.getHours()),
    pad2(now.getMinutes()),
    pad2(now.getSeconds()),
  ];
  return parts.join("");
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(() => {
        console.log('Service worker registered');
      })
      .catch((error) => {
        console.error('Service worker registration failed', error);
      });
  });
}
