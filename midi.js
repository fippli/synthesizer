const findPitch = (key, i = 0) => {
  console.log(key, i);
  if (key < 12) {
    return i;
  }

  return findPitch(key - 12, i + 1);
};

if (navigator.requestMIDIAccess) {
  console.log("This browser supports WebMIDI!");
  const onMIDISuccess = (midiAccess) => {
    for (var input of midiAccess.inputs.values())
      input.onmidimessage = getMIDIMessage;
  };

  const onMIDIFailure = () => {
    console.log("Could not access your MIDI devices.");
  };

  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  const getMIDIMessage = (message) => {
    const [command, key] = message.data;
    const velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    const tone = [keys[key % keys.length], findPitch(key)];
    console.log(tone, key);

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          playTone(tone);
        } else {
          stopTone(tone);
        }
        break;
      case 128: // noteOff
        stopTone(tone);
        break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  };
} else {
  console.log("WebMIDI is not supported in this browser.");
  /**
   * Use the computer keyboard
   */
}
