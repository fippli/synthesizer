var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;
const oscillator = audioContext.createOscillator();

const waveTypes = Object.freeze({
  sine: "sine",
  square: "square",
  sawtooth: "sawtooth",
  triangle: "triangle",
});

const createTone = (waveType) => (frequency) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // value in hertz
  oscillator.connect(audioContext.destination);
  return oscillator;
};

const { sine, square, triangle, sawtooth } = waveTypes;

const createSquareTone = createTone(square);
const createSineTone = createTone(sine);
const createSawtoothTone = createTone(sawtooth);
const createTrinagleTone = createTone(triangle);
const createSelectedTone = createSineTone;

const activeKeys = {};

const tones = {};

const getNote = (note, pitch) => notes[note][pitch];

const playTone = ([note, pitch]) => {
  const { frequency } = getNote(note, pitch);

  const key = [note, pitch].join("");

  if (tones[key] === undefined) {
    tones[key] = createSelectedTone(frequency);
  }

  if (activeKeys[key] === undefined) {
    activeKeys[key] = false;
  }

  if (activeKeys[key] === false) {
    tones[key].start();
    activeKeys[key] = true;
  }
};

const stopTone = ([note, pitch]) => {
  const key = [note, pitch].join("");
  const { frequency } = getNote(note, pitch);

  if (activeKeys[key] === true) {
    tones[key].stop();
    activeKeys[key] = false;
    tones[key] = createSelectedTone(frequency);
  }
};

const handleKeyDown = ({ key }) => playTone(keyMap[key]);
const handleKeyUp = ({ key }) => stopTone(keyMap[key]);

document.addEventListener("keypress", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
