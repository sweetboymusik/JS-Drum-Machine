// get elements from dom
const triggers = document.querySelectorAll(".trigger");
const strips = document.querySelectorAll(".control-strip");
const sounds = document.querySelectorAll("audio");
const gainKnobs = document.querySelectorAll(".vol");
const panKnobs = document.querySelectorAll(".pan");
const rateKnobs = document.querySelectorAll(".tune");

const knobStates = ["230deg", "290deg", "360deg", "70deg", "125deg"];
const gainStates = [0.0, 0.25, 0.5, 0.75, 1.0];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

gainKnobs.forEach((knob) => {
  knob.addEventListener("click", () => {
    const rotation = window.getComputedStyle(knob).rotate;
    const audio = document.querySelector(
      "." + knob.parentElement.parentElement.id
    );

    let idx = knobStates.indexOf(rotation);

    if (idx === knobStates.length - 1) {
      idx = -1;
    }

    knob.style.rotate = knobStates[idx + 1];
    audio.volume = gainStates[idx + 1];

    console.log(audio.volume);

    if (knob.style.rotate === "360deg") {
      knob.style.rotate === "0deg";
    }
  });
});

panKnobs.forEach((knob) => {
  knob.addEventListener("click", () => {
    const rotation = window.getComputedStyle(knob).rotate;
    const audio = document.querySelector(
      "." + knob.parentElement.parentElement.id
    );

    let idx = knobStates.indexOf(rotation);

    if (idx === knobStates.length - 1) {
      idx = -1;
    }

    knob.style.rotate = knobStates[idx + 1];
    audio.volume = gainStates[idx + 1];

    console.log(audio.volume);

    if (knob.style.rotate === "360deg") {
      knob.style.rotate === "0deg";
    }
  });
});
