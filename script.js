// DOM elements
const triggers = document.querySelectorAll(".trigger");
const strips = document.querySelectorAll(".control-strip");
const sounds = document.querySelectorAll("audio");
const gainKnobs = document.querySelectorAll(".vol");
const panKnobs = document.querySelectorAll(".pan");
const rateKnobs = document.querySelectorAll(".tune");

// helper functions
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

// state vars
let mouseDown = false;
let currentSoundID = null;
let currentKnobID = null;
let currentKnobType = null;
let mousePositionY = 0;
let currentRotation = 0;
let knobMax = 128;
let gainMax = 2;
let panMax = 1;

const knobStates = ["230deg", "290deg", "360deg", "70deg", "125deg"];
const gainStates = [0.0, 0.25, 0.5, 0.75, 1.0];

// set up the audio streams/pans/gains/rates
const audioContext = new AudioContext();
audioContext.resume();

const bd = audioContext.createMediaElementSource(sounds[0]);
const sd = audioContext.createMediaElementSource(sounds[1]);
const lt = audioContext.createMediaElementSource(sounds[2]);
const mt = audioContext.createMediaElementSource(sounds[3]);
const ht = audioContext.createMediaElementSource(sounds[4]);
const rs = audioContext.createMediaElementSource(sounds[5]);
const cp = audioContext.createMediaElementSource(sounds[6]);
const cb = audioContext.createMediaElementSource(sounds[7]);
const cy = audioContext.createMediaElementSource(sounds[8]);
const oh = audioContext.createMediaElementSource(sounds[9]);
const ch = audioContext.createMediaElementSource(sounds[10]);

const bdGain = audioContext.createGain();
const sdGain = audioContext.createGain();
const ltGain = audioContext.createGain();
const mtGain = audioContext.createGain();
const htGain = audioContext.createGain();
const rsGain = audioContext.createGain();
const cpGain = audioContext.createGain();
const cbGain = audioContext.createGain();
const cyGain = audioContext.createGain();
const ohGain = audioContext.createGain();
const chGain = audioContext.createGain();

const bdPanner = audioContext.createStereoPanner();
const sdPanner = audioContext.createStereoPanner();
const ltPanner = audioContext.createStereoPanner();
const mtPanner = audioContext.createStereoPanner();
const htPanner = audioContext.createStereoPanner();
const rsPanner = audioContext.createStereoPanner();
const cpPanner = audioContext.createStereoPanner();
const cbPanner = audioContext.createStereoPanner();
const cyPanner = audioContext.createStereoPanner();
const ohPanner = audioContext.createStereoPanner();
const chPanner = audioContext.createStereoPanner();

bd.connect(bdGain).connect(bdPanner).connect(audioContext.destination);
sd.connect(sdGain).connect(sdPanner).connect(audioContext.destination);
lt.connect(ltGain).connect(ltPanner).connect(audioContext.destination);
mt.connect(mtGain).connect(mtPanner).connect(audioContext.destination);
ht.connect(htGain).connect(htPanner).connect(audioContext.destination);
rs.connect(rsGain).connect(rsPanner).connect(audioContext.destination);
cp.connect(cpGain).connect(cpPanner).connect(audioContext.destination);
cb.connect(cbGain).connect(cbPanner).connect(audioContext.destination);
cy.connect(cyGain).connect(cyPanner).connect(audioContext.destination);
oh.connect(ohGain).connect(ohPanner).connect(audioContext.destination);
ch.connect(chGain).connect(chPanner).connect(audioContext.destination);

// functions
function getPanner(s) {
  switch (s) {
    case "bd":
      return bdPanner;
      break;
    case "sd":
      return sdPanner;
      break;
    case "lt":
      return ltPanner;
      break;
    case "mt":
      return mtPanner;
      break;
    case "ht":
      return htPanner;
      break;
    case "rs":
      return rsPanner;
      break;
    case "cp":
      return cpPanner;
      break;
    case "cb":
      return cbPanner;
      break;
    case "cy":
      return cyPanner;
      break;
    case "oh":
      return ohPanner;
      break;
    case "ch":
      return chPanner;
      break;
    default:
      return null;
  }
}

function getGain(s) {
  switch (s) {
    case "bd":
      return bdGain;
      break;
    case "sd":
      return sdGain;
      break;
    case "lt":
      return ltGain;
      break;
    case "mt":
      return mtGain;
      break;
    case "ht":
      return htGain;
      break;
    case "rs":
      return rsGain;
      break;
    case "cp":
      return cpGain;
      break;
    case "cb":
      return cbGain;
      break;
    case "cy":
      return cyGain;
      break;
    case "oh":
      return ohGain;
      break;
    case "ch":
      return chGain;
      break;
    default:
      return null;
  }
}

function knobTurn(e) {
  currentSoundID = this.parentElement.parentElement.id;
  currentKnobType = this.id;
  currentKnobID = this;

  mousePositionY = e.clientY;
  mouseDown = true;
  currentRotation = parseInt(window.getComputedStyle(currentKnobID).rotate);
}

function rotationChange(e) {
  if (mouseDown) {
    // rotate the knob
    newRotation = clamp(
      -(e.clientY - mousePositionY) * 2.5 + currentRotation,
      -knobMax,
      knobMax
    );

    currentKnobID.style.rotate = `${newRotation}deg`;

    valueChange();
  }
}

function valueChange() {
  let currentNode;

  if (currentKnobType === "gain") {
    currentNode = getGain(currentSoundID);
    let param = scale(newRotation, -knobMax, knobMax, 0, gainMax);
    currentNode.gain.value = param;
  } else if (currentKnobType === "pan") {
    currentNode = getPanner(currentSoundID);
    let param = scale(newRotation, -knobMax, knobMax, -panMax, panMax);
    currentNode.pan.value = param;
  } else if (currentKnobID === "rate") {
    console.log("rate... TODO");
  }
}

// preload all the sounds
sounds.forEach((sound) => {
  sound.preload = true;
  sound.volume = gainStates[2];
});

// set up triggers to play sounds
triggers.forEach((trigger) => {
  trigger.addEventListener("mousedown", () => {
    const soundID = trigger.id;
    const audio = document.querySelector("." + soundID);

    if (audio.currentTime !== 0) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio.play();
  });
});

strips.forEach((strip) => {
  const knobs = strip.querySelectorAll(".knob");

  knobs.forEach((knob) => {
    knob.addEventListener("mousedown", knobTurn);
    knob.addEventListener("dblclick", () => {
      currentKnobID.style.rotate = `${0}deg`;
      newRotation = parseInt(currentKnobID.style.rotate);
      valueChange();
    });
  });
});

window.addEventListener("mousemove", rotationChange);

// check for mouse up event
window.addEventListener("mouseup", () => {
  mouseDown = false;
});
