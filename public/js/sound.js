// sound synthesizer using web audio api
// we generate tones without external mp3s
(function (global) {
'use strict';

var ctx = null;
var muted = false;
var unlocked = false;

// make audio context safely
// we check webkit prefix on old webview
function getCtx() {
if (!ctx) {
var AudioClass =
window.AudioContext ||
window.webkitAudioContext;
if (AudioClass) {
try {
ctx = new AudioClass();
} catch (e) {
ctx = null;
}
}
}
if (ctx && ctx.state === 'suspended') {
try {
var p = ctx.resume();
if (p && p.then) {
p.then(function () {
unlocked = true;
}).catch(function () {});
}
} catch (e) {
// skip resume error
}
}
if (ctx && ctx.state === 'running') {
unlocked = true;
}
return ctx;
}

// unlock audio on smart tv and safari
// plays 1-frame silent buffer on tap
function unlock() {
var c = getCtx();
if (!c) return false;
try {
if (c.state === 'suspended') {
var pr = c.resume();
if (pr && pr.then) {
pr.then(function () {
unlocked = true;
}).catch(function () {});
}
}
var buf = c.createBuffer(1, 1, 22050);
var src = c.createBufferSource();
src.buffer = buf;
src.connect(c.destination);
if (src.start) {
src.start(0);
} else if (src.noteOn) {
src.noteOn(0);
}
unlocked = true;
} catch (e) {
// skip buffer error
}
return unlocked;
}

// unlock audio on first remote or touch
// covers pointer touch and tv d-pad keys
function bindAutoUnlock() {
var events = [
'pointerdown',
'touchstart',
'mousedown',
'keydown'
];
var handler = function () {
unlock();
};
for (var i = 0; i < events.length; i++) {
document.addEventListener(
events[i],
handler,
{ passive: true }
);
}
}

bindAutoUnlock();

// play single synthetic beep tone
// we use oscillator and gain envelope
function playTone(
freq,
type,
dur,
vol
) {
if (muted) return;
var c = getCtx();
if (!c) return;
try {
var osc = c.createOscillator();
var gain = c.createGain();
osc.type = type || 'sine';
osc.frequency.setValueAtTime(
freq,
c.currentTime
);
gain.gain.setValueAtTime(
vol || 0.25,
c.currentTime
);
gain.gain.exponentialRampToValueAtTime(
0.001,
c.currentTime + dur
);
osc.connect(gain);
gain.connect(c.destination);
osc.start();
osc.stop(c.currentTime + dur);
} catch (err) {
// skip audio failure
}
}

// play royal horn when bout starts
// we play brass fifth intervals
function playHorn() {
playTone(220, 'sawtooth', 0.25, 0.22);
setTimeout(function () {
playTone(330, 'sawtooth', 0.45, 0.28);
}, 220);
setTimeout(function () {
playTone(440, 'triangle', 0.55, 0.3);
}, 500);
}

// play horse gallop hoof beat
// we pulse two low triangle thuds
function playHoof() {
playTone(95, 'triangle', 0.06, 0.2);
setTimeout(function () {
playTone(75, 'triangle', 0.08, 0.22);
}, 70);
}

// play heavy lance clash on shield
// we combine low thud and high clang
function playClash() {
playTone(110, 'sawtooth', 0.22, 0.35);
playTone(580, 'square', 0.14, 0.25);
setTimeout(function () {
playTone(420, 'triangle', 0.18, 0.22);
}, 80);
}

// play shield shatter splinter sound
// we fire rapid descending crunch tones
function playShatter() {
playTone(620, 'sawtooth', 0.12, 0.35);
setTimeout(function () {
playTone(340, 'square', 0.15, 0.35);
}, 60);
setTimeout(function () {
playTone(180, 'sawtooth', 0.25, 0.38);
}, 130);
setTimeout(function () {
playTone(90, 'triangle', 0.3, 0.35);
}, 220);
}

// play melee weapon strike clang
// we ring metallic square wave
function playSword() {
playTone(740, 'triangle', 0.09, 0.25);
setTimeout(function () {
playTone(520, 'sawtooth', 0.12, 0.22);
}, 50);
}

// play coin or cap bet placed chime
// we play crisp rising two note bell
function playBet() {
playTone(587.33, 'sine', 0.1, 0.25);
setTimeout(function () {
playTone(880, 'triangle', 0.18, 0.28);
}, 90);
}

// play tournament champion fanfare
// we play heroic four note triad
function playFanfare() {
playTone(293.66, 'sawtooth', 0.16, 0.25);
setTimeout(function () {
playTone(369.99, 'sawtooth', 0.16, 0.25);
}, 150);
setTimeout(function () {
playTone(440, 'sawtooth', 0.18, 0.28);
}, 300);
setTimeout(function () {
playTone(587.33, 'triangle', 0.55, 0.35);
}, 470);
}

// play prize redeemed pub bell
// we ring three bright high chimes
function playPrize() {
playTone(659.25, 'triangle', 0.14, 0.3);
setTimeout(function () {
playTone(783.99, 'triangle', 0.14, 0.3);
}, 120);
setTimeout(function () {
playTone(1046.5, 'sine', 0.35, 0.35);
}, 240);
}

// toggle mute state on and off
// we flip flag and return current value
function toggleMute() {
muted = !muted;
return muted;
}

// set explicit mute boolean
// syncs local audio with server tvMuted
function setMuted(val) {
muted = Boolean(val);
return muted;
}

// attach sound player to window object
// we expose methods for main tv script
global.GameSound = {
init: getCtx,
unlock: unlock,
playTone: playTone,
playHorn: playHorn,
playHoof: playHoof,
playClash: playClash,
playShatter: playShatter,
playSword: playSword,
playBet: playBet,
playFanfare: playFanfare,
playPrize: playPrize,
toggleMute: toggleMute,
setMuted: setMuted,
isMuted: function () {
return muted;
},
isUnlocked: function () {
return Boolean(
unlocked ||
(ctx && ctx.state === 'running')
);
}
};
})(window);
