let accumulatedEntropy = 0;
const entropyThreshold = 50000;
const progressBar = document.getElementById("progress-bar");
const entropyValueElement = document.getElementById("entropy-value");
const digestElement = document.getElementById("digest");
let previousHash = '';
let lastEventTime = null;

function updateProgressBar() {
  const progress = Math.min((accumulatedEntropy / entropyThreshold) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

function updateEntropyDisplay() {
  const progressPercentage = Math.min(((accumulatedEntropy / entropyThreshold) * 100).toFixed(2), 100);
  entropyValueElement.textContent = `Entropy Percentage: ${progressPercentage}%`;
}

function updateDigest() {
  const combinedValue = previousHash + accumulatedEntropy.toString();
  const hash = CryptoJS.SHA256(combinedValue);
  const hashInHex = hash.toString(CryptoJS.enc.Hex);
  digestElement.textContent = `SHA256: ${hashInHex}`;
  previousHash = hash;
}

function entropyPercentageReached() {
  const currentPercentage = (accumulatedEntropy / entropyThreshold) * 100;
  return Math.floor(currentPercentage * 10) > Math.floor((accumulatedEntropy - 1) / entropyThreshold * 1000);
}

function accumulateEntropy(value) {
  if (accumulatedEntropy >= entropyThreshold) {
    return;
  }

  accumulatedEntropy += value;
  updateEntropyDisplay();

  if (entropyPercentageReached()) {
    updateDigest();
  }

  updateProgressBar();
}

// Existing entropy accumulation events
document.addEventListener("mousedown", (event) => {
  accumulateEntropy(event.clientX + event.clientY);
});

document.addEventListener("keydown", (event) => {
  accumulateEntropy(event.keyCode);
});

window.addEventListener("resize", () => {
  accumulateEntropy(window.innerWidth + window.innerHeight);
});

window.addEventListener("scroll", () => {
  accumulateEntropy(window.scrollX + window.scrollY);
});

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (event) => {
    accumulateEntropy(Math.abs(event.alpha) + Math.abs(event.beta) + Math.abs(event.gamma));
  });
}

if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", (event) => {
    accumulateEntropy(Math.abs(event.acceleration.x) + Math.abs(event.acceleration.y) + Math.abs(event.acceleration.z));
  });
}

// Touch events for mobile
function handleTouchEvent(event) {
  event.preventDefault();

  const currentTime = performance.now();
  if (lastEventTime !== null) {
    const timeElapsed = currentTime - lastEventTime;
    accumulateEntropy(timeElapsed);
  }
  lastEventTime = currentTime;

  if (event.touches.length > 0) {
    const touch = event.touches[0];
    accumulateEntropy(touch.clientX + touch.clientY);
  }
}

if ("ontouchstart" in window) {
  document.addEventListener("touchstart", handleTouchEvent);
  document.addEventListener("touchmove", handleTouchEvent);
  document.addEventListener("touchend", handleTouchEvent);
} else {
  document.addEventListener("mousemove", (event) => {
    const currentTime = performance.now();
    if (lastEventTime !== null) {
      const timeElapsed = currentTime - lastEventTime;
      accumulateEntropy(timeElapsed);
    }
    lastEventTime = currentTime;

    accumulateEntropy(Math.abs(event.movementX) + Math.abs(event.movementY));
  });
}

// Colored dot on click
function addClickDot(event) {
  if (accumulatedEntropy >= entropyThreshold) {
    return;
  }

  // const dot = document.createElement("div");
  // dot.className = "dot";
  // dot.style.top = `${event.clientY - 5}px`;
  // dot.style.left = `${event.clientX - 5}px`;

  // document.body.appendChild(dot);
}

document.addEventListener("click", addClickDot);
