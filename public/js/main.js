// main tv client controller and animator
// we poll state and draw parade or bout
(function () {
'use strict';

var lastVersion = 0;
var isPolling = false;
var currentState = null;
var lastLangApplied = '';

// animation clocks for parade and combat
// we drive smooth 60fps canvas motion
var animClock = 0;
var animStepId = 0;
var stepStartTime = 0;
var impactDone1 = false;
var impactDone2 = false;
var paradeIndexSeen = -1;
var paradeSubSeen = '';
var paradeAnimStart = Date.now();
var particles = [];

var FLOWER_COLORS = [
'#F43F5E',
'#38BDF8',
'#34D399',
'#A855F7',
'#FB923C'
];

// dom references for screens and banners
// we cache nodes once at startup
var prizeToast =
document.getElementById('prizeToast');
var prizeToastText =
document.getElementById('prizeToastText');
var tvBottomBar =
document.getElementById('tvBottomBar');

var screenWaiting =
document.getElementById('screenWaiting');
var waitingCanvas =
document.getElementById('waitingCanvas');
var screenParade =
document.getElementById('screenParade');
var screenBracket =
document.getElementById('screenBracket');
var screenCombat =
document.getElementById('screenCombat');

var paradeStepBadge =
document.getElementById('paradeStepBadge');
var paradeHeroName =
document.getElementById('paradeHeroName');
var paradeHeroDetails =
document.getElementById('paradeHeroDetails');
var paradeLineupRow =
document.getElementById('paradeLineupRow');
var paradeCanvas =
document.getElementById('paradeCanvas');

var nextBoutPanel =
document.getElementById('nextBoutPanel');
var champRevealCard =
document.getElementById('championRevealCard');
var champSecretTitle =
document.getElementById('champSecretTitle');
var champNameText =
document.getElementById('champNameText');

var pCanvasLeft =
document.getElementById('previewCanvasLeft');
var pCanvasRight =
document.getElementById('previewCanvasRight');
var arenaCanvas =
document.getElementById('arenaCanvas');
var btnTvFullscreen =
document.getElementById('btnTvFullscreen');
var btnTvSound =
document.getElementById('btnTvSound');
var tvSoundActivated = false;

// check if browser is in fullscreen mode
// covers standard and vendor prefixes
function isTvFullscreen() {
return Boolean(
document.fullscreenElement ||
document.webkitFullscreenElement ||
document.mozFullScreenElement ||
document.msFullscreenElement ||
document.webkitCurrentFullScreenElement
);
}

// request fullscreen on document or body
// falls back across smart tv engines
function enterTvFullscreen() {
var el = document.documentElement;
var b = document.body;
try {
if (el.requestFullscreen) {
var p = el.requestFullscreen({
navigationUI: 'hide'
});
if (p && p.catch) {
p.catch(function () {
try {
el.requestFullscreen();
} catch (e) {}
});
}
return;
}
if (el.webkitRequestFullscreen) {
el.webkitRequestFullscreen();
return;
}
if (el.webkitRequestFullScreen) {
el.webkitRequestFullScreen();
return;
}
if (el.mozRequestFullScreen) {
el.mozRequestFullScreen();
return;
}
if (el.msRequestFullscreen) {
el.msRequestFullscreen();
return;
}
if (b && b.webkitRequestFullscreen) {
b.webkitRequestFullscreen();
}
} catch (e) {
// skip fullscreen error
}
}

// exit fullscreen across vendor prefixes
// restores windowed browser mode
function exitTvFullscreen() {
try {
if (document.exitFullscreen) {
document.exitFullscreen();
return;
}
if (document.webkitExitFullscreen) {
document.webkitExitFullscreen();
return;
}
if (document.webkitCancelFullScreen) {
document.webkitCancelFullScreen();
return;
}
if (document.mozCancelFullScreen) {
document.mozCancelFullScreen();
return;
}
if (document.msExitFullscreen) {
document.msExitFullscreen();
}
} catch (e) {
// skip exit error
}
}

// update fullscreen and sound button labels
// reflects active fullscreen and mute state
function syncWaitingStartBtns() {
var d = getDict();
if (btnTvFullscreen) {
var fsOn = isTvFullscreen();
btnTvFullscreen.innerHTML = fsOn
? d.tvBtnFullscreenOn ||
'⛶ FULLSCREEN: ON'
: d.tvBtnFullscreen || '⛶ FULLSCREEN';
btnTvFullscreen.className = fsOn
? 'waitingBigBtn activeTvBtn'
: 'waitingBigBtn';
}
if (btnTvSound) {
var srvMuted = Boolean(
currentState && currentState.tvMuted
);
var locMuted = Boolean(
window.GameSound &&
window.GameSound.isMuted()
);
var isMuted = srvMuted || locMuted;
if (isMuted) {
btnTvSound.innerHTML =
d.tvBtnSoundOff || '🔇 SOUND: OFF';
btnTvSound.className =
'waitingBigBtn mutedTvBtn';
} else if (tvSoundActivated) {
btnTvSound.innerHTML =
d.tvBtnSoundOn || '🔊 SOUND: ON';
btnTvSound.className =
'waitingBigBtn activeTvBtn';
} else {
btnTvSound.innerHTML =
d.tvBtnSound || '🔊 SOUND';
btnTvSound.className = 'waitingBigBtn';
}
}
}

// get dictionary for active state language
// defaults to english when lang is unset
function getDict() {
var lang =
(currentState && currentState.lang) ||
'en';
if (window.GameI18n) {
return window.GameI18n.getDict(lang);
}
return {};
}

// format language button label by code
// shows active code in upper case
function getLangBtnLabel(lang) {
if (lang === 'uk') return 'МОВА: УКР';
if (lang === 'ru') return 'ЯЗЫК: РУС';
return 'LANG: EN';
}

// update static dom labels when lang changes
// syncs headers buttons and bracket titles
function applyStaticTranslations(lang) {
var d = getDict();
window.currentLang = lang;
document.documentElement.lang = lang;
document.title = d.tvTitle || '';

var setTxt = function (id, val) {
var el = document.getElementById(id);
if (el && val) el.innerHTML = val;
};

setTxt('waitingBrandText', d.brandTitle);
setTxt('colHeadQfWest', d.qfWest);
setTxt('colHeadQfEast', d.qfEast);
setTxt('colHeadSfLeft', d.sfHeader);
setTxt('colHeadSfRight', d.sfHeader);
setTxt('colHeadFinal', d.grandFinalHeader);
setTxt('champKickerText', d.champKicker);
setTxt('champNoticeText', d.champLore);
syncWaitingStartBtns();
}

// spawn wood or steel debris particles
// we burst splinters when shield cracks
function spawnDebris(x, y, colorHex, count) {
for (var i = 0; i < count; i++) {
var ang = Math.random() * Math.PI * 2;
var spd = 2 + Math.random() * 8;
particles.push({
kind: 'DEBRIS',
x: x,
y: y,
vx: Math.cos(ang) * spd,
vy: Math.sin(ang) * spd - 3,
rot: 0,
vrot: 0,
size: 4 + Math.random() * 7,
color: colorHex || '#CBD5E1',
life: 40,
maxLife: 40
});
}
}

// throw flower from crowd over castle wall
// adapted from circus-tiger-runner renderer
function spawnCrowdFlower(w) {
var fx = w * (0.16 + Math.random() * 0.68);
var fy = 95 + Math.random() * 55;
var cIdx = Math.floor(
Math.random() * FLOWER_COLORS.length
);
particles.push({
kind: 'FLOWER',
x: fx,
y: fy,
vx: (Math.random() - 0.5) * 4.5,
vy: 1.2 + Math.random() * 3.2,
rot: Math.random() * 6.28,
vrot: (Math.random() - 0.5) * 0.16,
size: 7.5 + Math.random() * 4.5,
color: FLOWER_COLORS[cIdx],
life: 85,
maxLife: 85
});
}

// play sound effect triggered by server
// skips audio when tv mute is active
function triggerSound(snd) {
if (!window.GameSound || !snd) return;
if (currentState && currentState.tvMuted) {
return;
}
if (snd === 'horn') {
window.GameSound.playHorn();
} else if (snd === 'hoof') {
window.GameSound.playHoof();
} else if (snd === 'clash') {
window.GameSound.playClash();
} else if (snd === 'shatter') {
window.GameSound.playShatter();
} else if (snd === 'sword') {
window.GameSound.playSword();
} else if (snd === 'bet') {
window.GameSound.playBet();
} else if (snd === 'fanfare') {
window.GameSound.playFanfare();
} else if (snd === 'prize') {
window.GameSound.playPrize();
}
}

// format currency value by active mode
// we show caps in pub mode or cash symbol
function fmtVal(amount, mode) {
var d = getDict();
var n = Math.round(amount || 0);
if (mode === 'CASH') {
return n + (d.curCash || ' $');
}
return n + (d.curCaps || ' CAPS');
}

// update knight parade presentation text
// we show banner and 8 lineup cards below
function renderParadeView(s) {
var d = getDict();
var p = s.parade || {};
var list = s.aliveKnights || [];
var idx = p.currentIndex || 0;

if (
idx !== paradeIndexSeen ||
p.subStep !== paradeSubSeen
) {
paradeIndexSeen = idx;
paradeSubSeen = p.subStep;
paradeAnimStart = Date.now();
}

var isGiftMode =
s.paradeBonusType === 'GIFT' &&
Boolean(s.paradeGiftText);

if (p.finished) {
if (isGiftMode) {
paradeStepBadge.innerHTML =
d.paradeDoneKickerGift +
s.paradeGiftText.toUpperCase() +
'!';
paradeHeroName.innerHTML =
d.paradeDoneTitle;
paradeHeroDetails.innerHTML =
d.paradeDoneSubGift +
s.paradeGiftText;
} else {
paradeStepBadge.innerHTML =
d.paradeDoneKicker;
paradeHeroName.innerHTML =
d.paradeDoneTitle;
paradeHeroDetails.innerHTML =
d.paradeDoneSub;
}
} else {
var curK = list[idx];
paradeStepBadge.innerHTML =
d.paradeStepKicker +
(idx + 1) +
d.of8;
if (curK) {
paradeHeroName.innerHTML =
curK.name +
' (' +
d.winsLbl +
(curK.wins || 0) +
' · ' +
d.lossesLbl +
(curK.losses || 0) +
')';
if (p.subStep === 'RIDE_TO_RACK') {
paradeHeroDetails.innerHTML =
d.ridesHorse +
curK.horseName +
' · ' +
d.ShieldLbl +
curK.shieldName +
d.gallopsToRack;
} else {
paradeHeroDetails.innerHTML =
d.picksFromRack +
curK.weaponName +
d.andJoinsLine;
}
}
}

// build 8 lineup cards with bonus odds
// shows +20% odd or parade gift on win
var html = '';
for (var i = 0; i < 8; i++) {
var k = list[i];
if (!k) continue;
var revealed =
p.finished ||
i < idx ||
(i === idx && p.subStep === 'PICKED');
var isCur = !p.finished && i === idx;
var cls = 'paradeCard';
if (isCur) cls += ' activeParadeCard';
else if (revealed) cls += ' revealedCard';

var col =
window.KnightArt.getArmor(k.colorIdx).main;
var wText = revealed
? k.weaponName
: d.pickingWeapon;

var baseOdd = parseFloat(
k.outrightOdds || 5.0
);
var boosted =
Math.round(baseOdd * 1.2 * 10) / 10;
var bonusOdd = isGiftMode
? baseOdd.toFixed(1)
: Math.max(baseOdd + 0.2, boosted).toFixed(1);
var bonusLbl = isGiftMode
? d.bonusGiftCard + s.paradeGiftText
: d.bonusBet20;

html +=
'<div class="' +
cls +
'">' +
'<div>' +
'<div class="pCardNum">' +
d.contenderNo +
(i + 1) +
'</div>' +
'<div class="pCardColorBar" style="background:' +
col +
'"></div>' +
'<div class="pCardName">' +
k.name +
'</div>' +
'<div class="pCardGear">' +
k.horseName +
'<br>' +
wText +
'</div>' +
'<div class="pCardRec">W: ' +
(k.wins || 0) +
' / L: ' +
(k.losses || 0) +
'</div>' +
'</div>' +
'<div class="pCardOddsBox">' +
'<span class="pCardOddsLabel">' +
bonusLbl +
'</span>' +
'<span class="pCardOddsVal">x' +
bonusOdd +
'</span>' +
'</div></div>';
}
paradeLineupRow.innerHTML = html;
}

// draw parade canvas animation every frame
// shows pub logo banners and flower rain
function drawParadeFrame() {
if (
!currentState ||
currentState.tvScreen !== 'PARADE' ||
!paradeCanvas
) {
return;
}

var ctx = paradeCanvas.getContext('2d');
var w = paradeCanvas.width;
var h = paradeCanvas.height;
ctx.clearRect(0, 0, w, h);

var p = currentState.parade || {};
var list = currentState.aliveKnights || [];
var curIdx = p.currentIndex || 0;
var champId = currentState.lastChampionId;
var curK = !p.finished ? list[curIdx] : null;
var isChampRiding = Boolean(
curK && champId && curK.id === champId
);

// draw castle wall with pub logo on banners
// crowd cheers when defending champion rides
window.KnightArt.drawCastleScene(
ctx,
w,
h,
192,
false,
animClock,
p.finished || isChampRiding
? 'CHEER'
: 'IDLE',
null,
null,
champId,
0
);

// light rain of flowers when champion rides
// spawns petals from upper spectator stands
if (isChampRiding && Math.random() < 0.16) {
spawnCrowdFlower(w);
}

var takenMap = {};
for (var t = 0; t < list.length; t++) {
var tk = list[t];
if (
p.finished ||
t < curIdx ||
(t === curIdx && p.subStep === 'PICKED')
) {
takenMap[tk.weaponIdx] = true;
}
}

// draw weapon rack on left side of field
// hides weapons already taken by knights
var rackX = 195;
var rackY = 265;
window.KnightArt.drawWeaponRack(
ctx,
rackX,
rackY,
takenMap
);

// collect riders to draw in y-depth order
// lower row shifted down and left for space
var drawQueue = [];
for (var i = 0; i < list.length; i++) {
var lk = list[i];
var colIdx = Math.floor(i / 2);
var isLow = i % 2 === 1;
var slotX =
(isLow ? 635 : 500) + colIdx * 340;
var slotY = isLow ? 426 : 292;

if (p.finished || i < curIdx) {
drawQueue.push({
x: slotX,
y: slotY,
sc: 0.94,
k: lk,
ph: animClock + i,
pose: 'parade_no_lance',
showWep: false
});
} else if (i === curIdx && !p.finished) {
var dt =
(Date.now() - paradeAnimStart) / 1000;
var tProg = Math.min(1, dt / 1.6);

if (p.subStep === 'RIDE_TO_RACK') {
var rx = -60 + tProg * (rackX + 60);
var tempK = {
colorIdx: lk.colorIdx,
helmIdx: lk.helmIdx,
shieldIdx: lk.shieldIdx,
horseIdx: lk.horseIdx,
weaponIdx: -1
};
drawQueue.push({
x: rx,
y: 320,
sc: 1.08,
k: tempK,
ph: animClock,
pose:
tProg < 1 ? 'run' : 'parade_no_lance',
showWep: false
});
} else {
var lx =
rackX + tProg * (slotX - rackX);
var ly =
320 + tProg * (slotY - 320);
var sc = 1.08 - tProg * 0.14;
drawQueue.push({
x: lx,
y: ly,
sc: sc,
k: lk,
ph: animClock,
pose:
tProg < 1 ? 'run' : 'parade_no_lance',
showWep: tProg < 0.75
});
}
}
}

// sort riders from back to front by y
// prevents back row overlapping front row
drawQueue.sort(function (a, b) {
return a.y - b.y;
});

for (var dIdx = 0; dIdx < drawQueue.length; dIdx++) {
var item = drawQueue[dIdx];
window.KnightArt.drawMountedKnight(
ctx,
item.x,
item.y,
item.sc,
item.k,
item.ph,
item.pose
);
if (item.showWep) {
window.KnightArt.drawWeapon(
ctx,
item.x,
item.y - 122,
0.98,
item.k.weaponIdx,
0.25
);
}
}

// draw falling crowd flowers on parade
// updates particle positions on canvas
updateAndDrawParticles(ctx);
}

// get head-to-head wins between two knights
// returns [w1, w2] from vsWins dictionaries
function getHeadToHead(k1, k2) {
if (!k1 || !k2) return [0, 0];
var w1 =
(k1.vsWins && k1.vsWins[k2.id]) || 0;
var w2 =
(k2.vsWins && k2.vsWins[k1.id]) || 0;
return [w1, w2];
}

// build single bracket match box html
// shows fighter slots and head-to-head score
function renderMatchBox(m, idx, curIdx) {
var d = getDict();
var el =
document.getElementById('matchBox' + idx);
if (!el || !m) return;

var cls = 'matchBox';
if (idx === 4 || idx === 5) {
cls += ' sfBox';
} else if (idx === 6) {
cls += ' finalBox';
}
if (idx === curIdx && m.status !== 'DONE') {
cls += ' activeMatch';
} else if (m.status === 'DONE') {
cls += ' doneMatch';
}
el.className = cls;

var h2h = getHeadToHead(m.k1, m.k2);
var h2hHtml = '';
if (h2h[0] + h2h[1] > 0) {
h2hHtml =
'<div class="mH2hBar">' +
d.h2hLbl +
'<b>' +
h2h[0] +
' : ' +
h2h[1] +
'</b></div>';
}

var html = buildFighterSlot(
m.k1,
m.odds1,
m.winnerId
);
html += h2hHtml;
html += buildFighterSlot(
m.k2,
m.odds2,
m.winnerId
);
el.innerHTML = html;
}

// build one knight row inside match box
// shows armor bar name record and two badges
function buildFighterSlot(k, odds, winId) {
var d = getDict();
if (!k) {
return (
'<div class="mSlot emptySlot">' +
'<div class="mSlotLeft">' +
'<div class="colorDot" ' +
'style="background:#334155"></div>' +
'<div class="mNameWrap">' +
'<div class="mSirName mutedName">' +
d.waitPair +
'</div></div></div></div>'
);
}

var col =
window.KnightArt.getArmor(k.colorIdx).main;
var slotCls = 'mSlot';
if (winId) {
if (winId === k.id) {
slotCls += ' winnerSlot';
} else {
slotCls += ' loserSlot';
}
}

var recStr =
'W: ' +
(k.wins || 0) +
' / L: ' +
(k.losses || 0);

var boutBadge = odds
? '<span class="mBadgeBout">' +
d.badgeBout +
Number(odds).toFixed(1) +
'</span>'
: '';
var tourBadge =
'<span class="mBadgeTour">' +
d.badgeTour +
Number(k.outrightOdds || 5).toFixed(1) +
'</span>';

return (
'<div class="' +
slotCls +
'">' +
'<div class="mSlotLeft">' +
'<div class="colorDot" style="background:' +
col +
'"></div>' +
'<div class="mNameWrap">' +
'<div class="mSirName">' +
k.name +
'</div>' +
'<div class="mSubStat">' +
recStr +
'</div>' +
'</div></div>' +
'<div class="mBadgesCol">' +
boutBadge +
tourBadge +
'</div></div>'
);
}

// update center preview card for next bout
// draws large 310x240 mounted knights
function renderPreviewCard(s) {
var d = getDict();
var m =
s.matches &&
s.matches[s.currentMatchIndex];

if (
s.tournamentStatus === 'FINISHED' &&
s.champion
) {
nextBoutPanel.className =
'nextBoutCard hidden';
champRevealCard.className = 'champCard';
champSecretTitle.innerHTML =
s.champion.secretTitle;
champNameText.innerHTML =
s.champion.name;
return;
}

nextBoutPanel.className = 'nextBoutCard';
champRevealCard.className =
'champCard hidden';
if (!m || !m.k1 || !m.k2) return;

document.getElementById(
'nextBoutTitle'
).innerHTML =
d.matchNo +
(s.currentMatchIndex + 1) +
' — ' +
m.stageName;

document.getElementById(
'liveBetIndicator'
).innerHTML = s.allowLiveBets
? d.liveBetsOn
: d.preBetsOnly;

fillPreviewSide('Left', m.k1, m.odds1);
fillPreviewSide('Right', m.k2, m.odds2);

// draw large mounted knights on meadow
// scaled to 1.06 inside wide 360x240 box
if (pCanvasLeft && window.KnightArt) {
var ctxL = pCanvasLeft.getContext('2d');
ctxL.clearRect(0, 0, 360, 240);
window.KnightArt.drawCastleScene(
ctxL,
360,
240,
88,
false
);
window.KnightArt.drawMountedKnight(
ctxL,
164,
178,
1.06,
m.k1,
animClock,
'idle'
);
}
if (pCanvasRight && window.KnightArt) {
var ctxR = pCanvasRight.getContext('2d');
ctxR.clearRect(0, 0, 360, 240);
window.KnightArt.drawCastleScene(
ctxR,
360,
240,
88,
false
);
window.KnightArt.drawMountedKnight(
ctxR,
196,
178,
-1.06,
m.k2,
animClock + 1.2,
'idle'
);
}

var vsCol =
document.getElementById('vsCenterCol');
var h2hEl =
document.getElementById('h2hScoreBox');
var poolEl =
document.getElementById('matchPoolText');
var listEl =
document.getElementById('activeBetsList');

var h2h = getHeadToHead(m.k1, m.k2);
var hasH2h = h2h[0] + h2h[1] > 0;
if (h2hEl) {
if (hasH2h) {
h2hEl.className = 'h2hBadge';
h2hEl.innerHTML =
'<span class="h2hTitle">' +
d.h2hLbl +
'</span><span class="h2hScore">' +
h2h[0] +
' : ' +
h2h[1] +
'</span>';
} else {
h2hEl.className = 'h2hBadge hidden';
}
}

var bets = s.activeBets || [];
var totalPool = 0;
var rowsHtml = '';

for (var i = 0; i < bets.length; i++) {
var b = bets[i];
totalPool += b.amount;
var tag =
b.betType === 'OUTRIGHT'
? d.tagTour
: d.tagBout;
var gNote = b.paradeGift
? ' + ' + b.paradeGift
: '';
rowsHtml +=
'<div class="betItemRow"><b>' +
b.tableName +
'</b>: ' +
fmtVal(b.amount, s.gameMode) +
' → ' +
b.knightName +
' (x' +
Number(b.odds).toFixed(1) +
') ' +
tag +
gNote +
'</div>';
}

if (bets.length > 0) {
if (vsCol) {
vsCol.className = 'vsCenterCol hasBets';
}
poolEl.className = 'poolInfo';
listEl.className = 'betsList';
poolEl.innerHTML =
d.totalBets +
fmtVal(totalPool, s.gameMode);
listEl.innerHTML = rowsHtml;
} else {
if (vsCol) {
vsCol.className = hasH2h
? 'vsCenterCol hasH2h'
: 'vsCenterCol';
}
poolEl.className = 'poolInfo hidden';
listEl.className = 'betsList hidden';
}
}

// fill fighter name W/L record and badges
// keeps W/L in english across all languages
function fillPreviewSide(side, k, odds) {
var d = getDict();
document.getElementById(
'p' + side + 'Name'
).innerHTML = k.name;
document.getElementById(
'p' + side + 'Rec'
).innerHTML =
'W: ' +
(k.wins || 0) +
' / L: ' +
(k.losses || 0);
document.getElementById(
'p' + side + 'Odds'
).innerHTML =
d.badgeBout +
Number(odds || 1.9).toFixed(1);
document.getElementById(
'p' + side + 'Outright'
).innerHTML =
d.badgeTour +
Number(k.outrightOdds || 5).toFixed(1);
}

// describe visual shield and fatigue state
// hides fresh crack until strike lands
function describeVisualCondition(k, hideHit) {
var d = getDict();
if (!k) return '';
var dmg =
(k.shieldDamage || 0) - (hideHit ? 1 : 0);
if (dmg < 0) dmg = 0;
var sh = d.shIntact;
if (dmg === 1) {
sh = d.shCracked;
} else if (dmg >= 2) {
sh = d.shShattered;
}
var fat = k.isTired
? d.fatTired
: d.fatFresh;
return sh + ' · ' + fat;
}

// clone knight with pre-impact shield state
// keeps shield whole before lance clash
function getVisualKnight(k, hideShieldHit) {
if (!k || !hideShieldHit) return k;
return {
id: k.id,
name: k.name,
colorIdx: k.colorIdx,
helmIdx: k.helmIdx,
shieldIdx: k.shieldIdx,
horseIdx: k.horseIdx,
weaponIdx: k.weaponIdx,
isTired: k.isTired,
shieldDamage: Math.max(
0,
(k.shieldDamage || 0) - 1
)
};
}

// update top hud on combat arena screen
// hides result text until blow/fall lands
function renderCombatHud(s) {
var d = getDict();
var m =
s.matches &&
s.matches[s.currentMatchIndex];
if (!m || !m.k1 || !m.k2) return;

var c = s.combat || {};
var elapsed =
(Date.now() - stepStartTime) / 1000;
var k1WinsMelee =
c.mode === 'MELEE' &&
c.winnerSide === 1;
var hitT1 = k1WinsMelee ? 2.9 : 4.25;
var hitT2 = k1WinsMelee ? 4.25 : 2.9;
var hide1 =
c.shieldHit1 &&
(c.mode === 'JOUST'
? elapsed < 2.9
: elapsed < hitT1);
var hide2 =
c.shieldHit2 &&
(c.mode === 'JOUST'
? elapsed < 2.9
: elapsed < hitT2);

document.getElementById(
'cLeftName'
).innerHTML = m.k1.name;
document.getElementById(
'cLeftSub'
).innerHTML =
m.k1.horseName + ' · ' + m.k1.weaponName;
document.getElementById(
'cLeftStatus'
).innerHTML = describeVisualCondition(
m.k1,
hide1
);

document.getElementById(
'cRightName'
).innerHTML = m.k2.name;
document.getElementById(
'cRightSub'
).innerHTML =
m.k2.horseName + ' · ' + m.k2.weaponName;
document.getElementById(
'cRightStatus'
).innerHTML = describeVisualCondition(
m.k2,
hide2
);

// reveal outcome text only after visual hit
// joust reveals at 3.25s melee at 4.75s
var revealTime =
c.mode === 'JOUST' ? 3.25 : 4.75;
var showOutcome = elapsed >= revealTime;

var badgeText =
c.phaseTitle || d.boutTitle;
if (c.mode === 'JOUST' && !showOutcome) {
badgeText =
d.joustPassOf3 +
(c.pass || 1) +
(s.lang === 'uk'
? ' ІЗ 3'
: s.lang === 'ru'
? ' ИЗ 3'
: ' OF 3');
}
document.getElementById(
'combatPassBadge'
).innerHTML = badgeText;

var subNote = d.boutInProgress;
if (showOutcome) {
subNote = c.note || '';
} else if (c.mode === 'JOUST') {
var wHint =
c.windDir === 1
? d.windRight
: c.windDir === -1
? d.windLeft
: d.windCalm;
subNote =
(elapsed < 1.15
? d.joustReady
: elapsed < 2.9
? d.joustCharge
: d.joustClash) + wHint;
} else {
subNote = d.meleeClash;
}
document.getElementById(
'combatSubNote'
).innerHTML = subNote;

document.getElementById(
'cLeftLiveOdds'
).innerHTML =
d.k1Short + Number(m.odds1 || 1.9).toFixed(1);
document.getElementById(
'cRightLiveOdds'
).innerHTML =
d.k2Short + Number(m.odds2 || 1.9).toFixed(1);

var banner =
document.getElementById(
'combatOverlayBanner'
);
if (
(c.pausedForBets || c.finished) &&
showOutcome
) {
banner.className = 'arenaBanner';
document.getElementById(
'arenaBannerMain'
).innerHTML = c.bannerTitle || '';
document.getElementById(
'arenaBannerDetail'
).innerHTML = c.bannerSub || '';
} else {
banner.className = 'arenaBanner hidden';
}
}

var soundDoneClash = false;
var soundDoneResult = false;
var lastScreenSeen = '';

// apply received server state to dom
// we switch between parade bracket combat
function applyState(s) {
if (!s) return;
currentState = s;

var lang = s.lang || 'en';
if (lang !== lastLangApplied) {
lastLangApplied = lang;
applyStaticTranslations(lang);
}

var d = getDict();

if (s.tvScreen !== lastScreenSeen) {
lastScreenSeen = s.tvScreen;
particles = [];
}

if (
s.combat &&
s.combat.stepId !== animStepId
) {
animStepId = s.combat.stepId;
stepStartTime = Date.now();
impactDone1 = false;
impactDone2 = false;
soundDoneClash = false;
soundDoneResult = false;
if (s.tvScreen === 'COMBAT') {
triggerSound(
s.combat.mode === 'JOUST'
? 'hoof'
: 'sword'
);
}
}

if (s.noPubSelected || s.tvScreen === 'WAITING') {
if (screenWaiting) {
screenWaiting.className =
'tvScreen waitingFullScreen';
}
screenParade.className = 'tvScreen hidden';
screenBracket.className = 'tvScreen hidden';
screenCombat.className = 'tvScreen hidden';
if (tvBottomBar) {
tvBottomBar.className = 'bottomBar hidden';
}
prizeToast.className = 'prizeBanner hidden';
syncWaitingStartBtns();
drawWaitingFrame();
return;
}

if (screenWaiting) {
screenWaiting.className = 'tvScreen hidden';
}
if (tvBottomBar) {
tvBottomBar.className = 'bottomBar';
}

if (s.prizeBannerText) {
prizeToast.className = 'prizeBanner';
prizeToastText.innerHTML =
s.prizeBannerText;
} else {
prizeToast.className =
'prizeBanner hidden';
}

if (s.tvScreen === 'PARADE') {
screenParade.className = 'tvScreen';
screenBracket.className =
'tvScreen hidden';
screenCombat.className =
'tvScreen hidden';
renderParadeView(s);
} else if (s.tvScreen === 'COMBAT') {
screenParade.className =
'tvScreen hidden';
screenBracket.className =
'tvScreen hidden';
screenCombat.className = 'tvScreen';
renderCombatHud(s);
} else {
screenParade.className =
'tvScreen hidden';
screenBracket.className = 'tvScreen';
screenCombat.className =
'tvScreen hidden';
}

if (s.matches) {
for (var i = 0; i < 7; i++) {
renderMatchBox(
s.matches[i],
i,
s.currentMatchIndex
);
}
}
renderPreviewCard(s);

var c = s.combat || {};
var elapsed =
(Date.now() - stepStartTime) / 1000;
var revT =
c.mode === 'JOUST' ? 3.25 : 4.75;
if (
s.tvScreen !== 'COMBAT' ||
!c.finished ||
elapsed >= revT
) {
renderBottomBar(s);
}

if (s.version > lastVersion) {
if (
s.soundToPlay &&
s.tvScreen !== 'COMBAT'
) {
triggerSound(s.soundToPlay);
}
lastVersion = s.version;
}
}

// render bottom tables and prize showcase
// updates balances and configured prizes
function renderBottomBar(s) {
var d = getDict();
var tTitle =
document.getElementById('tablesTitle');
var pTitle =
document.getElementById('prizesTitle');
var tRow =
document.getElementById('tablesRow');
var pRow =
document.getElementById('prizesRow');

tTitle.innerHTML =
s.gameMode === 'CASH'
? d.tablesCashTitle
: d.tablesPubTitle;

var tHtml = '';
var tables = s.tables || [];
for (var i = 0; i < tables.length; i++) {
var tb = tables[i];
tHtml +=
'<div class="tableChip">' +
tb.name +
'<span>' +
fmtVal(tb.balance, s.gameMode) +
'</span></div>';
}
tRow.innerHTML =
tHtml ||
'<div class="prizeChip">' +
(d.noTablesTv || '') +
'</div>';

if (s.gameMode === 'CASH') {
pTitle.innerHTML = d.payoutsTitle;
var logs = s.recentPayouts || [];
var lHtml = '';
for (var j = 0; j < logs.length; j++) {
lHtml +=
'<div class="prizeChip">' +
logs[j] +
'</div>';
}
pRow.innerHTML =
lHtml ||
'<div class="prizeChip">' +
d.waitPayouts +
'</div>';
} else {
pTitle.innerHTML = d.prizesTitle;
var prizes = s.prizes || [];
var pHtml = '';
for (var k = 0; k < prizes.length; k++) {
var pr = prizes[k];
pHtml +=
'<div class="prizeChip">' +
pr.title +
'<b>' +
pr.cost +
d.curCaps +
'</b></div>';
}
pRow.innerHTML =
pHtml ||
'<div class="prizeChip">' +
(d.noPrizesTv || '') +
'</div>';
}
}

// update and draw active debris and flowers
// shared by both parade and combat canvases
function updateAndDrawParticles(ctx) {
for (
var pIdx = particles.length - 1;
pIdx >= 0;
pIdx--
) {
var pt = particles[pIdx];
pt.x += pt.vx;
pt.y += pt.vy;
pt.rot = (pt.rot || 0) + (pt.vrot || 0);
if (pt.kind === 'FLOWER') {
pt.vy += 0.08;
} else {
pt.vy += 0.35;
}
pt.life -= 1;

ctx.save();
ctx.translate(pt.x, pt.y);
ctx.rotate(pt.rot || 0);

if (pt.kind === 'FLOWER') {
// 5-petal flower from circus-tiger-runner
// drawn with white center disk
ctx.fillStyle = pt.color;
for (var fl = 0; fl < 5; fl++) {
var fa = (fl * Math.PI * 2) / 5;
ctx.beginPath();
ctx.arc(
Math.cos(fa) * pt.size * 0.6,
Math.sin(fa) * pt.size * 0.6,
pt.size * 0.5,
0,
Math.PI * 2
);
ctx.fill();
}
ctx.fillStyle = '#F8FAFC';
ctx.beginPath();
ctx.arc(0, 0, pt.size * 0.38, 0, Math.PI * 2);
ctx.fill();
} else {
ctx.fillStyle = pt.color;
ctx.fillRect(
-pt.size * 0.5,
-pt.size * 0.5,
pt.size,
pt.size
);
}
ctx.restore();

if (pt.life <= 0) {
particles.splice(pIdx, 1);
}
}
}

// draw castle wall and green field on waiting
// top wall has no spectators or side banners
function drawWaitingFrame() {
if (!waitingCanvas || !window.KnightArt) {
return;
}
var wCtx = waitingCanvas.getContext('2d');
var ww = waitingCanvas.width;
var wh = waitingCanvas.height;
wCtx.clearRect(0, 0, ww, wh);
window.KnightArt.drawCastleScene(
wCtx,
ww,
wh,
215,
false,
0,
'NONE',
null,
null,
null,
0
);
}

// draw parade or combat canvas every frame
// drives 60fps animation on tv stage
function drawArenaFrame() {
animClock += 0.035;
if (
!currentState ||
currentState.noPubSelected ||
currentState.tvScreen === 'WAITING'
) {
drawWaitingFrame();
requestNextFrame();
return;
}

if (currentState.tvScreen === 'PARADE') {
drawParadeFrame();
requestNextFrame();
return;
}

if (currentState.tvScreen === 'BRACKET') {
renderPreviewCard(currentState);
requestNextFrame();
return;
}

if (!arenaCanvas) {
requestNextFrame();
return;
}

var ctx = arenaCanvas.getContext('2d');
var w = arenaCanvas.width;
var h = arenaCanvas.height;
ctx.clearRect(0, 0, w, h);

var m =
currentState.matches &&
currentState.matches[
currentState.currentMatchIndex
];
var c = currentState.combat || {};
var elapsed =
(Date.now() - stepStartTime) / 1000;
var revealTime =
c.mode === 'JOUST' ? 3.25 : 4.75;

// refresh hud as impact/banner timers pass
// plays fanfare once when outcome reveals
renderCombatHud(currentState);
if (c.finished && elapsed >= revealTime) {
renderBottomBar(currentState);
if (!soundDoneResult) {
soundDoneResult = true;
triggerSound('fanfare');
}
}

// set spectator crowd mood by combat phase
// cheers during melee or joust collision
var crowdMood = 'IDLE';
if (c.finished && elapsed >= revealTime) {
crowdMood = 'VICTORY';
} else if (
c.mode === 'MELEE' ||
(c.mode === 'JOUST' && elapsed >= 2.9)
) {
crowdMood = 'CHEER';
}

// draw castle battlements spectators meadow
// includes heraldic banners and wind flags
window.KnightArt.drawCastleScene(
ctx,
w,
h,
240,
c.mode === 'JOUST',
animClock,
crowdMood,
m ? m.k1 : null,
m ? m.k2 : null,
currentState.lastChampionId,
c.windDir || 0
);

if (!m || !m.k1 || !m.k2) {
requestNextFrame();
return;
}

// toss flowers from spectators after win
// triggered on pass 3 or grand final win
if (
c.throwFlowers &&
elapsed >= revealTime &&
Math.random() < 0.42
) {
spawnCrowdFlower(w);
}

if (c.mode === 'JOUST') {
// 5.2s joust pass from current field ends
// riders keep ends without teleporting
var prog = Math.min(1, elapsed / 5.2);
var evenPass = (c.pass || 1) % 2 === 0;
var startX1 = evenPass ? 1620 : 180;
var endX1 = evenPass ? 180 : 1620;
var clashX1 = evenPass ? 940 : 860;
var dir1 = evenPass ? -1 : 1;

var startX2 = evenPass ? 180 : 1620;
var endX2 = evenPass ? 1620 : 180;
var clashX2 = evenPass ? 860 : 940;
var dir2 = evenPass ? 1 : -1;

var x1 = startX1;
var x2 = startX2;
var facing1 = dir1 * 1.45;
var facing2 = dir2 * 1.45;
var pose1 = 'ready';
var pose2 = 'ready';
var fallen1 = false;
var fallen2 = false;

var preImpact = prog < 0.55;
var visK1 = getVisualKnight(
m.k1,
c.shieldHit1 && preImpact
);
var visK2 = getVisualKnight(
m.k2,
c.shieldHit2 && preImpact
);

if (!preImpact) {
if (!soundDoneClash) {
soundDoneClash = true;
triggerSound(
c.shieldHit1 || c.shieldHit2
? 'shatter'
: 'clash'
);
}
if (c.shieldHit1 && !impactDone1) {
impactDone1 = true;
spawnDebris(
clashX1 + dir1 * 10,
320,
window.KnightArt.getArmor(m.k1.colorIdx)
.main,
22
);
}
if (c.shieldHit2 && !impactDone2) {
impactDone2 = true;
spawnDebris(
clashX2 + dir2 * 10,
320,
window.KnightArt.getArmor(m.k2.colorIdx)
.main,
22
);
}
}

if (prog < 0.22) {
// pause at current ends before charge
// riders lower lances at list ends
var readyWave = prog / 0.22;
var stepIn =
(c.pass || 1) === 1
? (1 - readyWave) * 30
: 0;
x1 = startX1 - dir1 * stepIn;
x2 = startX2 - dir2 * stepIn;
pose1 = 'ready';
pose2 = 'ready';
} else if (prog < 0.56) {
// accelerating gallop toward center clash
// quadratic ease-in builds lance speed
var tCharge = (prog - 0.22) / 0.34;
var easeIn = tCharge * tCharge;
x1 =
startX1 +
(clashX1 - startX1) * easeIn;
x2 =
startX2 +
(clashX2 - startX2) * easeIn;
pose1 = 'run';
pose2 = 'run';
} else {
// horses run to opposite ends turn and rear
// unseated rider falls at center meadow
var tAfter = (prog - 0.56) / 0.44;
var tRun = Math.min(1, tAfter / 0.72);
x1 =
clashX1 +
(endX1 - clashX1) * tRun;
x2 =
clashX2 +
(endX2 - clashX2) * tRun;

if (c.unseated1) {
pose1 =
tRun < 1
? 'horse_only_run'
: 'horse_only_idle';
fallen1 = true;
} else if (tRun < 1) {
pose1 = 'run';
} else {
facing1 = -dir1 * 1.45;
pose1 =
c.winnerSide === 1 ? 'victory' : 'rear';
}

if (c.unseated2) {
pose2 =
tRun < 1
? 'horse_only_run'
: 'horse_only_idle';
fallen2 = true;
} else if (tRun < 1) {
pose2 = 'run';
} else {
facing2 = -dir2 * 1.45;
pose2 =
c.winnerSide === 2 ? 'victory' : 'rear';
}
}

window.KnightArt.drawMountedKnight(
ctx,
x1,
370,
facing1,
visK1,
animClock,
pose1
);
window.KnightArt.drawMountedKnight(
ctx,
x2,
370,
facing2,
visK2,
animClock,
pose2
);

// draw unseated knight lying on meadow
// animates drop from saddle to turf
if (fallen1) {
var fallProgress1 = Math.min(
1,
(prog - 0.56) * 5
);
var dropY1 = 320 + fallProgress1 * 88;
window.KnightArt.drawFallenKnightOnGround(
ctx,
clashX1 - dir1 * (10 + fallProgress1 * 45),
dropY1,
dir1 * 1.35,
visK1
);
}
if (fallen2) {
var fallProgress2 = Math.min(
1,
(prog - 0.56) * 5
);
var dropY2 = 320 + fallProgress2 * 88;
window.KnightArt.drawFallenKnightOnGround(
ctx,
clashX2 - dir2 * (10 + fallProgress2 * 45),
dropY2,
dir2 * 1.35,
visK2
);
}

// draw star burst at center impact moment
// flashes blue-white when lances meet
if (prog > 0.52 && prog < 0.64) {
ctx.fillStyle = '#38BDF8';
ctx.beginPath();
for (var s = 0; s < 16; s++) {
var rad = (s * Math.PI) / 8;
var dist = s % 2 === 0 ? 68 : 26;
var sx = 900 + Math.cos(rad) * dist;
var sy = 315 + Math.sin(rad) * dist;
if (s === 0) ctx.moveTo(sx, sy);
else ctx.lineTo(sx, sy);
}
ctx.closePath();
ctx.fill();
}
} else {
// 3-strike melee: winner -> loser -> winner
// loser kneels strictly after winner's blow
var fx1 = 805;
var fx2 = 995;
var mState1 = 'guard';
var mState2 = 'guard';
var sparkX = 0;
var sparkY = 0;

var k1Wins = c.winnerSide === 1;
var hitTime1 = k1Wins ? 2.9 : 4.25;
var hitTime2 = k1Wins ? 4.25 : 2.9;

// delay shield crack until weapon strike lands
// keeps defender shield intact before blow
var visM1 = getVisualKnight(
m.k1,
c.shieldHit1 && elapsed < hitTime1
);
var visM2 = getVisualKnight(
m.k2,
c.shieldHit2 && elapsed < hitTime2
);

if (
c.shieldHit2 &&
elapsed >= hitTime2 &&
!impactDone2
) {
impactDone2 = true;
triggerSound('shatter');
spawnDebris(
940,
345,
window.KnightArt.getArmor(m.k2.colorIdx)
.main,
20
);
}
if (
c.shieldHit1 &&
elapsed >= hitTime1 &&
!impactDone1
) {
impactDone1 = true;
triggerSound('shatter');
spawnDebris(
860,
345,
window.KnightArt.getArmor(m.k1.colorIdx)
.main,
20
);
}

if (elapsed < 0.85) {
var p0 = elapsed / 0.85;
fx1 = 755 + p0 * 50;
fx2 = 1045 - p0 * 50;
mState1 = 'guard';
mState2 = 'guard';
} else if (elapsed < 1.4) {
if (k1Wins) {
fx1 = 815;
fx2 = 995;
mState1 = 'windup';
mState2 = 'block';
} else {
fx1 = 805;
fx2 = 985;
mState1 = 'block';
mState2 = 'windup';
}
} else if (elapsed < 2.05) {
if (k1Wins) {
fx1 = 850;
fx2 = 985;
mState1 = 'strike';
mState2 = 'block';
sparkX = 940;
sparkY = 345;
} else {
fx1 = 815;
fx2 = 950;
mState1 = 'block';
mState2 = 'strike';
sparkX = 860;
sparkY = 345;
}
} else if (elapsed < 2.35) {
fx1 = 805;
fx2 = 995;
mState1 = 'guard';
mState2 = 'guard';
} else if (elapsed < 2.85) {
if (k1Wins) {
fx1 = 805;
fx2 = 985;
mState1 = 'block';
mState2 = 'windup';
} else {
fx1 = 815;
fx2 = 995;
mState1 = 'windup';
mState2 = 'block';
}
} else if (elapsed < 3.45) {
if (k1Wins) {
fx1 = 815;
fx2 = 950;
mState1 = 'block';
mState2 = 'strike';
sparkX = 860;
sparkY = 345;
} else {
fx1 = 850;
fx2 = 985;
mState1 = 'strike';
mState2 = 'block';
sparkX = 940;
sparkY = 345;
}
} else if (elapsed < 3.75) {
fx1 = 805;
fx2 = 995;
mState1 = 'guard';
mState2 = 'guard';
} else if (elapsed < 4.2) {
if (k1Wins) {
fx1 = 820;
fx2 = 990;
mState1 = 'windup';
mState2 = 'block';
} else {
fx1 = 810;
fx2 = 980;
mState1 = 'block';
mState2 = 'windup';
}
} else if (elapsed < 4.75) {
if (!soundDoneClash) {
soundDoneClash = true;
triggerSound('clash');
}
if (k1Wins) {
fx1 = 856;
fx2 = 984;
mState1 = 'strike';
mState2 = 'block';
sparkX = 942;
sparkY = 345;
} else {
fx1 = 816;
fx2 = 944;
mState1 = 'block';
mState2 = 'strike';
sparkX = 858;
sparkY = 345;
}
} else {
if (k1Wins) {
fx1 = 835;
fx2 = 990;
mState1 = 'guard';
mState2 = 'kneel';
} else {
fx1 = 810;
fx2 = 965;
mState1 = 'kneel';
mState2 = 'guard';
}
}

// draw defender first so attacker weapon is on top
// keeps striking blade above defender shield
var k1Attacking =
mState1 === 'strike' ||
mState1 === 'windup';
if (k1Attacking) {
window.KnightArt.drawFootKnight(
ctx,
fx2,
385,
-1.65,
visM2,
animClock + 1.5,
mState2
);
window.KnightArt.drawFootKnight(
ctx,
fx1,
385,
1.65,
visM1,
animClock,
mState1
);
} else {
window.KnightArt.drawFootKnight(
ctx,
fx1,
385,
1.65,
visM1,
animClock,
mState1
);
window.KnightArt.drawFootKnight(
ctx,
fx2,
385,
-1.65,
visM2,
animClock + 1.5,
mState2
);
}

// draw silver shield block impact flash
// shows star spark where blade hits shield
if (sparkX > 0) {
ctx.fillStyle = '#F8FAFC';
ctx.strokeStyle = '#090D16';
ctx.lineWidth = 2;
ctx.beginPath();
for (var sp = 0; sp < 10; sp++) {
var sa = (sp * Math.PI) / 5;
var sr = sp % 2 === 0 ? 28 : 11;
var px = sparkX + Math.cos(sa) * sr;
var py = sparkY + Math.sin(sa) * sr;
if (sp === 0) ctx.moveTo(px, py);
else ctx.lineTo(px, py);
}
ctx.closePath();
ctx.fill();
ctx.stroke();
}
}

// render splinters and crowd flowers
// draws active particles over arena
updateAndDrawParticles(ctx);

requestNextFrame();
}

// schedule next animation frame safely
// falls back to 30fps timer if needed
function requestNextFrame() {
var raf =
window.requestAnimationFrame ||
function (cb) {
return setTimeout(cb, 33);
};
raf(drawArenaFrame);
}

var BACKUP_KEY = 'kt_active_backup_v5';
try {
window.localStorage.removeItem(
'kt_active_backup_v2'
);
window.localStorage.removeItem(
'kt_active_backup_v3'
);
window.localStorage.removeItem(
'kt_active_backup_v4'
);
} catch (e) {}

// save latest state snapshot to localStorage
// keeps mid-game backup on web and android
function saveLocalBackup(s) {
if (!s) return;
try {
window.localStorage.setItem(
BACKUP_KEY,
JSON.stringify(s)
);
} catch (e) {}
}

// read saved state snapshot from localStorage
// used on boot before first server poll
function loadLocalBackup() {
try {
var raw =
window.localStorage.getItem(BACKUP_KEY);
if (!raw) return null;
return JSON.parse(raw);
} catch (e) {
return null;
}
}

// passive tv view never overwrites server
// only host controller restores snapshots
function checkServerRecovery() {
return false;
}

// poll server state periodically via xhr
// updates tv screen and local backup
function pollState() {
if (isPolling) return;
isPolling = true;
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/state', true);
xhr.timeout = 2500;
xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
isPolling = false;
if (xhr.status === 200) {
try {
var data =
JSON.parse(xhr.responseText);
if (!checkServerRecovery(data)) {
saveLocalBackup(data);
applyState(data);
}
} catch (e) {
// skip json parse error
// next poll will retry
}
}
}
};
xhr.ontimeout = function () {
isPolling = false;
};
xhr.onerror = function () {
isPolling = false;
};
xhr.send();
}

// send post action from tv client
// saves updated state to local backup
function postTvAction(payload) {
var xhr = new XMLHttpRequest();
xhr.open('POST', '/api/action', true);
xhr.setRequestHeader(
'Content-Type',
'application/json;charset=UTF-8'
);
xhr.onreadystatechange = function () {
if (
xhr.readyState === 4 &&
xhr.status === 200
) {
try {
var r = JSON.parse(xhr.responseText);
if (r.state) {
saveLocalBackup(r.state);
applyState(r.state);
}
} catch (e) {}
}
};
xhr.send(JSON.stringify(payload));
}

// bind top-right invisible triple-tap button
// opens host panel after 3 quick taps
var secretBtn =
document.getElementById('secretHostTap');
var tapTimes = [];
if (secretBtn) {
secretBtn.onclick = function () {
if (window.GameSound) {
window.GameSound.init();
}
var now = Date.now();
var recent = [];
for (var i = 0; i < tapTimes.length; i++) {
if (now - tapTimes[i] < 900) {
recent.push(tapTimes[i]);
}
}
recent.push(now);
tapTimes = recent;
if (tapTimes.length >= 3) {
tapTimes = [];
window.location.href = '/host';
}
};
}

// bind waiting screen fullscreen and sound
// unlocks audio and enters tv fullscreen
if (btnTvFullscreen) {
btnTvFullscreen.onclick = function () {
if (window.GameSound) {
window.GameSound.unlock();
}
if (isTvFullscreen()) {
exitTvFullscreen();
} else {
enterTvFullscreen();
}
setTimeout(syncWaitingStartBtns, 120);
};
}

if (btnTvSound) {
btnTvSound.onclick = function () {
if (window.GameSound) {
window.GameSound.unlock();
}
var srvMuted = Boolean(
currentState && currentState.tvMuted
);
var locMuted = Boolean(
window.GameSound &&
window.GameSound.isMuted()
);
if (!tvSoundActivated || srvMuted || locMuted) {
tvSoundActivated = true;
if (window.GameSound) {
window.GameSound.setMuted(false);
}
if (
currentState &&
!currentState.noPubSelected &&
currentState.tvMuted
) {
postTvAction({ type: 'toggle_tv_mute' });
}
if (window.GameSound) {
window.GameSound.playHorn();
}
} else {
if (
currentState &&
!currentState.noPubSelected
) {
postTvAction({ type: 'toggle_tv_mute' });
} else if (window.GameSound) {
window.GameSound.toggleMute();
}
}
syncWaitingStartBtns();
};
}

var fsEvents = [
'fullscreenchange',
'webkitfullscreenchange',
'mozfullscreenchange',
'MSFullscreenChange'
];
for (var f = 0; f < fsEvents.length; f++) {
document.addEventListener(
fsEvents[f],
syncWaitingStartBtns
);
}

// hydrate immediately from local backup on boot
// avoids blank screen on android capacitor
applyStaticTranslations('en');
var bootCache = loadLocalBackup();
if (bootCache) {
applyState(bootCache);
}

// sync immediately when android app wakes up
// handles capacitor resume and tab visibility
document.addEventListener(
'visibilitychange',
function () {
if (!document.hidden) pollState();
}
);
document.addEventListener(
'resume',
function () {
pollState();
}
);

pollState();
setInterval(pollState, 500);
requestNextFrame();
})();
