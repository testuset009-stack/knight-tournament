// express server for knight tournament
// we run tv board and host on port 3000
import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import {
SECRET_TITLES,
MASTER_KNIGHTS
} from './titles.js';
import {
PRIZE_NAMES,
getStatusStr,
getHorseName,
getShieldName,
getWeaponName,
getStageName,
localizeKnight,
localizeTableName,
localizeCombatTexts,
localizeAllState
} from './server_i18n.js';

var __filename =
fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

var app = express();
var PORT = process.env.PORT || 3000;

// parse incoming json payloads
// we use express built in parser
app.use(express.json());

// redirect host.html for androidtvhost2
// opens mobile host controller panel
app.get('/host.html', function (req, res) {
res.redirect('/host/');
});

// serve static files from public folder
// we expose tv and host web apps
app.use(
express.static(
path.join(__dirname, 'public')
)
);

// find writable folder on web or android apk
// falls back to android files dir when needed
function getWritableDir() {
var localDir = path.join(__dirname, 'data');
try {
if (!fs.existsSync(localDir)) {
fs.mkdirSync(localDir, {
recursive: true
});
}
fs.accessSync(localDir, fs.constants.W_OK);
return localDir;
} catch (e) {
var apkDir = path.join(
os.tmpdir(),
'..',
'files',
'kt-data'
);
try {
fs.mkdirSync(apkDir, {
recursive: true
});
fs.accessSync(apkDir, fs.constants.W_OK);
return apkDir;
} catch (e2) {
var tmpDir = path.join(
os.tmpdir(),
'kt-data'
);
try {
fs.mkdirSync(tmpDir, {
recursive: true
});
} catch (e3) {}
return tmpDir;
}
}
}

var DATA_DIR = getWritableDir();
var ROSTER_FILE =
path.join(DATA_DIR, 'pub_roster.json');
var STATE_FILE =
path.join(DATA_DIR, 'state.json');

// 10 horse coats with 260 stat sum
// each coat has its own joust trait
var HORSES = [
{
id: 0,
name: 'Вороной',
speed: 90,
stamina: 94,
balance: 76,
trait: 'relentless'
},
{
id: 1,
name: 'Белоснежный',
speed: 76,
stamina: 84,
balance: 100,
trait: 'steadfast'
},
{
id: 2,
name: 'Гнедой',
speed: 87,
stamina: 87,
balance: 86,
trait: 'harmony'
},
{
id: 3,
name: 'Медно-рыжий',
speed: 102,
stamina: 74,
balance: 84,
trait: 'burst'
},
{
id: 4,
name: 'Серый в яблоках',
speed: 82,
stamina: 92,
balance: 86,
trait: 'second_wind'
},
{
id: 5,
name: 'Буланый',
speed: 84,
stamina: 84,
balance: 92,
trait: 'headwind'
},
{
id: 6,
name: 'Чубарый',
speed: 96,
stamina: 82,
balance: 82,
trait: 'windrunner'
},
{
id: 7,
name: 'Караковый',
speed: 74,
stamina: 102,
balance: 84,
trait: 'ironlung'
},
{
id: 8,
name: 'Пегий',
speed: 92,
stamina: 76,
balance: 92,
trait: 'agile'
},
{
id: 9,
name: 'Голубая чалая',
speed: 80,
stamina: 82,
balance: 98,
trait: 'brace'
}
];

// 12 shield shapes and heraldic blazons
// some resist lances some suit melee
var SHIELDS = [
{
id: 0,
name: 'Каплевидный (Крест)',
joustDef: 92,
meleeDef: 82,
durability: 88
},
{
id: 1,
name: 'Треугольный (Шеврон)',
joustDef: 86,
meleeDef: 86,
durability: 85
},
{
id: 2,
name: 'Круглый (Умбон)',
joustDef: 76,
meleeDef: 92,
durability: 76
},
{
id: 3,
name: 'Башенный (Столбы)',
joustDef: 96,
meleeDef: 76,
durability: 96
},
{
id: 4,
name: 'Ромбовидный (Ромб)',
joustDef: 84,
meleeDef: 88,
durability: 82
},
{
id: 5,
name: 'Турнирный тарч (Выемка)',
joustDef: 94,
meleeDef: 80,
durability: 90
},
{
id: 6,
name: 'Полукруглый (Косой крест)',
joustDef: 87,
meleeDef: 87,
durability: 86
},
{
id: 7,
name: 'Крылатый (Пояс)',
joustDef: 89,
meleeDef: 85,
durability: 87
},
{
id: 8,
name: 'Каплевидный (Зубцы)',
joustDef: 93,
meleeDef: 81,
durability: 91
},
{
id: 9,
name: 'Овальный (Три кольца)',
joustDef: 81,
meleeDef: 91,
durability: 83
},
{
id: 10,
name: 'Стрельчатый (Звезда)',
joustDef: 88,
meleeDef: 86,
durability: 86
},
{
id: 11,
name: 'Шестигранный (Шахматы)',
joustDef: 91,
meleeDef: 84,
durability: 89
}
];

// 12 one-handed melee weapons for shield
// crush breaks shields speed hits fast
var WEAPONS = [
{
id: 0,
name: 'Рыцарский меч',
power: 88,
speed: 88,
crush: 80
},
{
id: 1,
name: 'Боевой топор',
power: 92,
speed: 80,
crush: 95
},
{
id: 2,
name: 'Моргенштерн',
power: 90,
speed: 81,
crush: 92
},
{
id: 3,
name: 'Кованая булава',
power: 89,
speed: 84,
crush: 91
},
{
id: 4,
name: 'Вороний клевец',
power: 91,
speed: 83,
crush: 94
},
{
id: 5,
name: 'Тяжёлый палаш',
power: 87,
speed: 89,
crush: 82
},
{
id: 6,
name: 'Кистень на цепи',
power: 94,
speed: 75,
crush: 92
},
{
id: 7,
name: 'Боевой молот',
power: 95,
speed: 77,
crush: 96
},
{
id: 8,
name: 'Шестопёр',
power: 88,
speed: 85,
crush: 90
},
{
id: 9,
name: 'Кривая сабля',
power: 86,
speed: 92,
crush: 78
},
{
id: 10,
name: 'Колющий кончар',
power: 85,
speed: 94,
crush: 76
},
{
id: 11,
name: 'Широкий фальшион',
power: 93,
speed: 82,
crush: 88
}
];

// pseudo random helper from numeric seed
// we get deterministic pub variations
function seededHash(seed, salt) {
var x =
Math.sin(seed * 997 + salt * 131) * 10000;
return x - Math.floor(x);
}

// pick 24 distinct knights from 216 pool
// different pubs get different knights
function selectPubTemplates(seed) {
var picked = [];
var usedFirst = {};
var usedTitles = {};
var usedNouns = {};
var usedAdjs = {};

for (var c = 0; c < 6; c++) {
// pick 4 distinct helmets for color c
var helms = [0, 1, 2, 3, 4, 5];
for (var k = 0; k < 4; k++) {
var hPos = Math.floor(
seededHash(seed, c * 41 + k * 13 + 7) *
helms.length
);
var h = helms[hPos];
helms.splice(hPos, 1);

var baseS = Math.floor(
seededHash(seed, c * 59 + h * 19 + k * 5) * 6
);
var chosen = null;

for (var step = 0; step < 6; step++) {
var s = (baseS + step) % 6;
var cand =
MASTER_KNIGHTS[c * 36 + h * 6 + s];
if (
!usedFirst[cand.first] &&
!usedTitles[cand.secretTitle] &&
!usedNouns[cand.noun] &&
!usedAdjs[cand.adj]
) {
chosen = cand;
break;
}
}
if (!chosen) {
chosen =
MASTER_KNIGHTS[c * 36 + h * 6 + baseS];
}

usedFirst[chosen.first] = true;
usedTitles[chosen.secretTitle] = true;
usedNouns[chosen.noun] = true;
usedAdjs[chosen.adj] = true;
picked.push(chosen);
}
}
return picked;
}

// build initial 24 knight pub roster
// starts with zero wins tables and prizes
function createPubData(
pubName,
customSeed,
lang
) {
var l = lang || 'en';
var parsedSeed = parseInt(customSeed, 10);
var seed =
parsedSeed && parsedSeed > 0
? parsedSeed
: Math.floor(100 + Math.random() * 899);
var templates = selectPubTemplates(seed);
var roster = [];

for (
var i = 0;
i < templates.length;
i++
) {
var tpl = templates[i];
var hBias =
Math.floor(
seededHash(seed, i * 7 + 1) * 24
) - 10;
var mBias =
Math.floor(
seededHash(seed, i * 11 + 2) * 24
) - 10;
var gBias =
Math.floor(
seededHash(seed, i * 17 + 3) * 24
) - 10;

var favWeapon =
Math.floor(
seededHash(seed, i * 23 + 5) * 12
) % 12;
var favHorse =
Math.floor(
seededHash(seed, i * 31 + 9) * 10
) % 10;
var shIdx = tpl.shieldIdx % SHIELDS.length;

var kObj = {
id: 'K' + (i + 1),
poolIndex: tpl.poolIndex,
name: tpl.name,
secretTitle: tpl.secretTitle,
colorIdx: tpl.colorIdx,
helmIdx: tpl.helmIdx,
shieldIdx: shIdx,
shieldName: getShieldName(shIdx, l),
favWeaponIdx: favWeapon,
favHorseIdx: favHorse,
joustSkill: 78 + hBias,
meleeSkill: 78 + mBias,
gritSkill: 78 + gBias,
isRare: i >= 18,
wins: 0,
losses: 0,
titles: 0,
vsWins: {}
};
localizeKnight(kObj, l);
roster.push(kObj);
}

var pId =
'pub_' +
Date.now() +
'_' +
Math.floor(Math.random() * 999);
var cleanName = String(
pubName || 'Pub #' + seed
).trim();

return {
id: pId,
name: cleanName,
economyVersion: 3,
lang: l,
pubSeed: seed,
gameMode: 'PUB',
allowLiveBets: true,
tvMuted: false,
pinEnabled: false,
pinCode: '',
paradeBonusType: 'PERCENT_20',
paradeGiftText: '',
tournamentNumber: 0,
lastChampionId: null,
lastFinalistId: null,
roster: roster,
tables: [],
orderGrid: [],
prizes: [],
activeTournament: null
};
}

var STORE_FILE = path.join(
DATA_DIR,
'pubs_store.json'
);
var storeVersion = 1;

// remove legacy test files on first run
// keeps production storage clean
function cleanLegacyTestFiles() {
try {
if (fs.existsSync(ROSTER_FILE)) {
fs.unlinkSync(ROSTER_FILE);
}
if (fs.existsSync(STATE_FILE)) {
fs.unlinkSync(STATE_FILE);
}
} catch (e) {}
}

cleanLegacyTestFiles();

// load multi-pub registry from disk
// starts with empty pubs array on fresh boot
function loadPubStore() {
try {
if (fs.existsSync(STORE_FILE)) {
var raw =
fs.readFileSync(STORE_FILE, 'utf8');
var parsed = JSON.parse(raw);
if (
parsed &&
parsed.schemaVersion === 3 &&
Array.isArray(parsed.pubs)
) {
parsed.lang = parsed.lang || 'en';
return parsed;
}
}
} catch (e) {
console.log('read store err:', e);
}
var emptyStore = {
schemaVersion: 3,
lang: 'en',
activePubId: null,
pubs: []
};
savePubStore(emptyStore);
return emptyStore;
}

// write multi-pub store to disk atomically
// writes tmp file then renames on disk
function savePubStore(stObj) {
try {
if (!fs.existsSync(DATA_DIR)) {
fs.mkdirSync(DATA_DIR, {
recursive: true
});
}
var target = stObj || pubStore;
if (!target) return;
target.savedAt = Date.now();
var tmpFile = STORE_FILE + '.tmp';
fs.writeFileSync(
tmpFile,
JSON.stringify(target)
);
fs.renameSync(tmpFile, STORE_FILE);
} catch (e) {
console.log('save store err:', e);
}
}

// save current pub data into multi-pub store
// persists roster tables prizes and settings
function savePubData(data) {
if (!pubStore) return;
savePubStore(pubStore);
}

// save active tournament into current pub
// allows instant resume after crash or switch
function saveGameState(st) {
if (!pubStore) return;
if (pubData && st && !st.noPubSelected) {
delete st.storeBackup;
st.stateSchema = 3;
st.savedAt = Date.now();
pubData.activeTournament = st;
}
savePubStore(pubStore);
}

var pubStore = loadPubStore();
var pubData = null;

// find pub record by id in store
// returns null when pub id does not exist
function findPubById(pubId) {
if (!pubId || !pubStore || !pubStore.pubs) {
return null;
}
for (
var i = 0;
i < pubStore.pubs.length;
i++
) {
if (pubStore.pubs[i].id === pubId) {
return pubStore.pubs[i];
}
}
return null;
}

// select 8 fighters from 24 pub roster
// champion and finalist stay to defend
function pickEightKnights() {
var l = pubData.lang || 'en';
var chosen = [];
var usedIds = {};

// keep defending champion and finalist
var champId = pubData.lastChampionId;
var finId = pubData.lastFinalistId;
for (
var i = 0;
i < pubData.roster.length;
i++
) {
var rk = pubData.roster[i];
if (rk.id === champId || rk.id === finId) {
chosen.push(
JSON.parse(JSON.stringify(rk))
);
usedIds[rk.id] = true;
}
}

// fill remaining slots with weighted pool
while (chosen.length < 8) {
var idx = Math.floor(
Math.random() * pubData.roster.length
);
var cand = pubData.roster[idx];
if (usedIds[cand.id]) continue;
if (cand.isRare && Math.random() < 0.55) {
continue;
}
chosen.push(
JSON.parse(JSON.stringify(cand))
);
usedIds[cand.id] = true;
}

// sort by wins so veterans draft first
var draftOrder = chosen.slice().sort(
function (a, b) {
if (b.wins !== a.wins) {
return b.wins - a.wins;
}
return Math.random() - 0.5;
}
);

var availWeapons = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
];
var availHorses = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
];

for (var d = 0; d < draftOrder.length; d++) {
var fighter = draftOrder[d];

// 40 percent favorite weapon if on rack
var wPick = -1;
var favPos = availWeapons.indexOf(
fighter.favWeaponIdx
);
if (favPos !== -1 && Math.random() < 0.4) {
wPick = fighter.favWeaponIdx;
availWeapons.splice(favPos, 1);
} else {
var rPos = Math.floor(
Math.random() * availWeapons.length
);
wPick = availWeapons[rPos];
availWeapons.splice(rPos, 1);
}

fighter.weaponIdx = wPick;
fighter.weaponName = getWeaponName(wPick, l);
fighter.hasFavWeapon =
wPick === fighter.favWeaponIdx;

// pick horse with 3x weight for favorite
// gives 3/12 on first pick if horse free
var totalHWeight = 0;
for (
var h = 0;
h < availHorses.length;
h++
) {
var isFavH =
availHorses[h] === fighter.favHorseIdx;
totalHWeight += isFavH ? 3 : 1;
}
var hRoll = Math.random() * totalHWeight;
var hPos = 0;
for (
var h2 = 0;
h2 < availHorses.length;
h2++
) {
var wH =
availHorses[h2] === fighter.favHorseIdx
? 3
: 1;
hRoll -= wH;
if (hRoll <= 0) {
hPos = h2;
break;
}
}
var hPick = availHorses[hPos];
availHorses.splice(hPos, 1);

fighter.horseIdx = hPick;
fighter.horseName = getHorseName(hPick, l);
fighter.hasFavHorse =
hPick === fighter.favHorseIdx;
fighter.shieldDamage = 0;
fighter.isTired = false;
fighter.stamina = 100;
localizeKnight(fighter, l);
}

return chosen;
}

// evaluate hidden combat rating for knight
// we combine knight horse shield weapon
function calcPowerScore(k, mode) {
if (!k) return 100;
var horse = HORSES[k.horseIdx] || HORSES[0];
var shield =
SHIELDS[k.shieldIdx] || SHIELDS[0];
var wep =
WEAPONS[k.weaponIdx] || WEAPONS[0];
var favHorse =
k.hasFavHorse ||
k.horseIdx === k.favHorseIdx;

var score =
k.wins * 4.5 -
k.losses * 2.0 +
k.titles * 7;

if (mode === 'MELEE') {
score +=
k.meleeSkill * 0.65 +
k.gritSkill * 0.45 +
wep.power * 0.45 +
wep.speed * 0.35 +
shield.meleeDef * 0.35;
if (k.hasFavWeapon) score += 14;
} else {
score +=
k.joustSkill * 0.6 +
horse.speed * 0.42 +
horse.stamina * 0.38 +
horse.balance * 0.4 +
shield.joustDef * 0.4 +
k.meleeSkill * 0.25;
if (k.hasFavWeapon) score += 6;
if (favHorse) score += 9;
if (horse.trait === 'harmony') {
score += k.joustSkill * 0.025;
}
}

// apply live shield damage and fatigue
// brace horse softens cracked shield loss
var dmgMult =
mode !== 'MELEE' &&
horse.trait === 'brace'
? 9
: 14;
if (k.shieldDamage === 1) {
score -= dmgMult;
}
if (k.shieldDamage >= 2) {
score -= dmgMult * 2.2;
}
if (k.isTired) score -= 18;

return Math.max(30, score);
}

// compute win probability for k1 vs k2
// combines live combat score and bet pool
function getMatchWinProb(
k1,
k2,
matchIdx,
state
) {
if (!k1 || !k2) return 0.5;
var curIdx = state.currentMatchIndex;
var isLive = matchIdx === curIdx;
var mode =
isLive &&
state.combat &&
state.combat.mode === 'MELEE'
? 'MELEE'
: 'JOUST';

var s1 = calcPowerScore(k1, mode);
var s2 = calcPowerScore(k2, mode);
var wBase1 = Math.pow(s1, 2.2);
var wBase2 = Math.pow(s2, 2.2);
var p1 = wBase1 / (wBase1 + wBase2);

var bet1 = 0;
var bet2 = 0;
var bets = state.activeBets || [];
var outWeight = matchIdx === 6 ? 1.0 : 0.35;

for (var b = 0; b < bets.length; b++) {
var bet = bets[b];
if (bet.betType === 'MATCH' && isLive) {
if (bet.knightId === k1.id) {
bet1 += bet.amount;
} else if (bet.knightId === k2.id) {
bet2 += bet.amount;
}
} else if (bet.betType === 'OUTRIGHT') {
if (bet.knightId === k1.id) {
bet1 += bet.amount * outWeight;
} else if (bet.knightId === k2.id) {
bet2 += bet.amount * outWeight;
}
}
}

var liq = 25;
var w1 = liq * p1 + bet1;
var w2 = liq * (1 - p1) + bet2;
p1 = w1 / (w1 + w2);
return Math.max(0.15, Math.min(0.85, p1));
}

// compute +20% parade bonus odd with 0.1 step
// guarantees at least +0.2 above base odd
function calcParadeBonusOdd(baseOdd) {
var b = parseFloat(baseOdd) || 1.9;
var boosted =
Math.round(b * 1.2 * 10) / 10;
return Math.max(b + 0.2, boosted).toFixed(1);
}

// compute integer cap payout for winning bet
// rounds up so 1 cap always yields +1 profit
function calcBetPayout(amount, odds) {
var raw = amount * odds;
var ceiled = Math.ceil(raw - 0.0001);
return Math.max(amount + 1, ceiled);
}

// compute match and outright bookmaker odds
// uses exact bracket tree with 0.1 odd step
function updateAllOdds(state) {
if (!state || !state.matches) return;
var vig = 1.04;

for (var i = 0; i < state.matches.length; i++) {
var m = state.matches[i];
if (!m.k1 || !m.k2) continue;

var p1 = getMatchWinProb(
m.k1,
m.k2,
i,
state
);
var p2 = 1 - p1;

m.odds1 = Math.max(
1.2,
Math.min(6.5, 1 / (p1 * vig))
).toFixed(1);
m.odds2 = Math.max(
1.2,
Math.min(6.5, 1 / (p2 * vig))
).toFixed(1);
}

// build semi-finalists from quarterfinals
function getQuarterSurvivors(qIdx) {
var mq = state.matches[qIdx];
if (!mq || !mq.k1 || !mq.k2) return [];
if (mq.status === 'DONE') {
var wk =
mq.winnerId === mq.k1.id ? mq.k1 : mq.k2;
return [{ k: wk, p: 1.0 }];
}
var pq1 = getMatchWinProb(
mq.k1,
mq.k2,
qIdx,
state
);
return [
{ k: mq.k1, p: pq1 },
{ k: mq.k2, p: 1 - pq1 }
];
}

// build finalists from one bracket half
function getHalfFinalists(sfIdx, qA, qB) {
var msf = state.matches[sfIdx];
if (msf && msf.status === 'DONE') {
var wsf =
msf.winnerId === msf.k1.id
? msf.k1
: msf.k2;
return [{ k: wsf, p: 1.0 }];
}
var listA =
msf && msf.k1
? [{ k: msf.k1, p: 1.0 }]
: getQuarterSurvivors(qA);
var listB =
msf && msf.k2
? [{ k: msf.k2, p: 1.0 }]
: getQuarterSurvivors(qB);

var out = [];
for (var a = 0; a < listA.length; a++) {
var ca = listA[a];
var sumA = 0;
for (var b = 0; b < listB.length; b++) {
var cb = listB[b];
sumA +=
cb.p *
getMatchWinProb(
ca.k,
cb.k,
sfIdx,
state
);
}
out.push({ k: ca.k, p: ca.p * sumA });
}
for (var b2 = 0; b2 < listB.length; b2++) {
var cb2 = listB[b2];
var sumB = 0;
for (var a2 = 0; a2 < listA.length; a2++) {
var ca2 = listA[a2];
var pA2 = getMatchWinProb(
ca2.k,
cb2.k,
sfIdx,
state
);
sumB += ca2.p * (1 - pA2);
}
out.push({ k: cb2.k, p: cb2.p * sumB });
}
return out;
}

var mFinal = state.matches[6];
var westFinalists =
mFinal && mFinal.k1
? [{ k: mFinal.k1, p: 1.0 }]
: getHalfFinalists(4, 0, 1);
var eastFinalists =
mFinal && mFinal.k2
? [{ k: mFinal.k2, p: 1.0 }]
: getHalfFinalists(5, 2, 3);

var champProb = {};
for (
var w = 0;
w < westFinalists.length;
w++
) {
var cw = westFinalists[w];
var winSumW = 0;
for (
var e = 0;
e < eastFinalists.length;
e++
) {
var ce = eastFinalists[e];
winSumW +=
ce.p *
getMatchWinProb(cw.k, ce.k, 6, state);
}
champProb[cw.k.id] = cw.p * winSumW;
}

for (
var e2 = 0;
e2 < eastFinalists.length;
e2++
) {
var ce2 = eastFinalists[e2];
var winSumE = 0;
for (
var w2 = 0;
w2 < westFinalists.length;
w2++
) {
var cw2 = westFinalists[w2];
var pW2 = getMatchWinProb(
cw2.k,
ce2.k,
6,
state
);
winSumE += cw2.p * (1 - pW2);
}
champProb[ce2.k.id] = ce2.p * winSumE;
}

var alive = state.aliveKnights || [];
for (var u = 0; u < alive.length; u++) {
var uk = alive[u];
var prob = champProb[uk.id] || 0.125;
var rawOdd = 1 / (prob * vig);
uk.outrightOdds = Math.max(
1.2,
Math.min(18.0, rawOdd)
).toFixed(1);
}

// sync outright odds into all match slots
for (var x = 0; x < state.matches.length; x++) {
var mx = state.matches[x];
for (var y = 0; y < alive.length; y++) {
if (mx.k1 && mx.k1.id === alive[y].id) {
mx.k1.outrightOdds = alive[y].outrightOdds;
}
if (mx.k2 && mx.k2.id === alive[y].id) {
mx.k2.outrightOdds = alive[y].outrightOdds;
}
}
}
}

// create new 8 knight tournament state
// sets up quarterfinals semis and final
function buildNewTournament(existingMode) {
if (!pubData) return buildWaitingState();
var l =
pubData.lang || pubStore.lang || 'en';
pubData.tournamentNumber += 1;
savePubData(pubData);

var eight = pickEightKnights();
var matches = [
{
id: 0,
stageName: getStageName(0, l),
k1: eight[0],
k2: eight[1],
odds1: 1.9,
odds2: 1.9,
status: 'PENDING',
winnerId: null
},
{
id: 1,
stageName: getStageName(1, l),
k1: eight[2],
k2: eight[3],
odds1: 1.9,
odds2: 1.9,
status: 'PENDING',
winnerId: null
},
{
id: 2,
stageName: getStageName(2, l),
k1: eight[4],
k2: eight[5],
odds1: 1.9,
odds2: 1.9,
status: 'PENDING',
winnerId: null
},
{
id: 3,
stageName: getStageName(3, l),
k1: eight[6],
k2: eight[7],
odds1: 1.9,
odds2: 1.9,
status: 'PENDING',
winnerId: null
},
{
id: 4,
stageName: getStageName(4, l),
k1: null,
k2: null,
odds1: null,
odds2: null,
status: 'PENDING',
winnerId: null
},
{
id: 5,
stageName: getStageName(5, l),
k1: null,
k2: null,
odds1: null,
odds2: null,
status: 'PENDING',
winnerId: null
},
{
id: 6,
stageName: getStageName(6, l),
k1: null,
k2: null,
odds1: null,
odds2: null,
status: 'PENDING',
winnerId: null
}
];

var st = {
version: storeVersion++,
noPubSelected: false,
pubId: pubData.id,
pubName: pubData.name,
lang: l,
pubSeed: pubData.pubSeed,
tournamentNumber: pubData.tournamentNumber,
gameMode:
existingMode || pubData.gameMode || 'PUB',
allowLiveBets:
pubData.allowLiveBets !== false,
tvMuted: Boolean(pubData.tvMuted),
paradeBonusType:
pubData.paradeBonusType || 'PERCENT_20',
paradeGiftText:
pubData.paradeGiftText || '',
tvScreen: 'WAITING',
tournamentStatus: 'ACTIVE',
statusKey: 'WAITING_PUB',
statusText: getStatusStr('WAITING_PUB', l),
currentMatchIndex: 0,
matches: matches,
aliveKnights: eight,
activeBets: [],
tables: pubData.tables || [],
orderGrid: pubData.orderGrid || [],
prizes: pubData.prizes || [],
recentPayouts: [],
prizeBannerText: null,
champion: null,
lastChampionId:
pubData.lastChampionId || null,
soundToPlay: null,
lastParadeAt: Date.now(),
parade: {
active: false,
currentIndex: 0,
subStep: 'RIDE_TO_RACK',
finished: false,
bonusActive: true
},
combat: {
active: false,
mode: 'JOUST',
pass: 0,
meleeRound: 0,
windDir: 0,
stepElapsedMs: 0,
pausedForBets: false,
finished: false,
winnerSide: null,
unseated1: false,
unseated2: false,
shatterSide: 0,
stepId: 1,
outcomeKey: 'PREP',
phaseTitle: '',
note: '',
bannerTitle: '',
bannerSub: ''
}
};

localizeCombatTexts(st);
updateAllOdds(st);
saveGameState(st);
return st;
}

// build waiting screen state when no pub active
// shown on tv before presenter selects pub
function buildWaitingState() {
var l = (pubStore && pubStore.lang) || 'en';
return {
version: storeVersion++,
noPubSelected: true,
tvScreen: 'WAITING',
lang: l,
statusKey: 'WAITING_PUB',
statusText: getStatusStr('WAITING_PUB', l),
tables: [],
orderGrid: [],
prizes: [],
matches: []
};
}

// load ongoing tournament for selected pub
// returns waiting state if no pub is active
function loadOrBuildGameState() {
if (!pubStore || !pubStore.activePubId) {
pubData = null;
return buildWaitingState();
}
var found = findPubById(
pubStore.activePubId
);
if (!found) {
pubStore.activePubId = null;
pubData = null;
savePubStore(pubStore);
return buildWaitingState();
}
pubData = found;
var saved = pubData.activeTournament;
if (
saved &&
saved.matches &&
saved.matches.length === 7
) {
saved.noPubSelected = false;
saved.pubId = pubData.id;
saved.pubName = pubData.name;
saved.lang =
pubData.lang ||
pubStore.lang ||
saved.lang ||
'en';
saved.tables = pubData.tables || [];
saved.orderGrid = pubData.orderGrid || [];
saved.prizes = pubData.prizes || [];
saved.paradeBonusType =
pubData.paradeBonusType || 'PERCENT_20';
saved.paradeGiftText =
pubData.paradeGiftText || '';
saved.tvMuted = Boolean(pubData.tvMuted);
saved.soundToPlay = null;
saved.prizeBannerText = null;
saved.lastParadeAt = Date.now();
saved.lastStepAt = Date.now();
localizeAllState(
saved,
pubData,
savePubData
);
updateAllOdds(saved);
saveGameState(saved);
return saved;
}
return buildNewTournament(
pubData.gameMode || 'PUB'
);
}

var gameState = loadOrBuildGameState();

// settle bets and advance winner in bracket
// pays caps and awards parade gift on win
function finishCurrentMatch(winnerSide) {
if (!pubData || !gameState.matches) return;
var m =
gameState.matches[
gameState.currentMatchIndex
];
if (!m || m.status === 'DONE') return;

var winK = winnerSide === 1 ? m.k1 : m.k2;
var loseK = winnerSide === 1 ? m.k2 : m.k1;
m.status = 'DONE';
m.winnerId = winK.id;

// update eternal pub roster win records
// also tracks head-to-head score vs opponent
for (
var r = 0;
r < pubData.roster.length;
r++
) {
var rk = pubData.roster[r];
if (!rk.vsWins) rk.vsWins = {};
if (rk.id === winK.id) {
rk.wins += 1;
rk.vsWins[loseK.id] =
(rk.vsWins[loseK.id] || 0) + 1;
winK.wins = rk.wins;
winK.vsWins = rk.vsWins;
} else if (rk.id === loseK.id) {
rk.losses += 1;
loseK.losses = rk.losses;
loseK.vsWins = rk.vsWins;
}
}

var l = gameState.lang || 'en';
var giftVerb =
l === 'uk'
? ' ОТРИМУЄ ПОДАРУНОК ПАРАДУ: '
: l === 'ru'
? ' ПОЛУЧАЕТ ПОДАРОК ПАРАДА: '
: ' WINS PARADE GIFT: ';
var giftTagWord =
l === 'uk'
? ' + ПОДАРУНОК: '
: l === 'ru'
? ' + ПОДАРОК: '
: ' + GIFT: ';
var wonGifts = [];

// pay winning match bets to tables
var remainingBets = [];
var payLogs = [];
for (
var b = 0;
b < gameState.activeBets.length;
b++
) {
var bet = gameState.activeBets[b];
if (bet.betType === 'MATCH') {
if (bet.knightId === winK.id) {
var winAmt = calcBetPayout(
bet.amount,
bet.odds
);
creditTableById(bet.tableId, winAmt);
var giftExtra = bet.paradeGift
? giftTagWord + bet.paradeGift
: '';
payLogs.push(
bet.tableName +
': +' +
winAmt +
giftExtra
);
if (bet.paradeGift) {
wonGifts.push(
bet.tableName.toUpperCase() +
giftVerb +
bet.paradeGift.toUpperCase() +
'!'
);
}
}
} else {
remainingBets.push(bet);
}
}
gameState.activeBets = remainingBets;

// advance winner into next bracket slot
var idx = gameState.currentMatchIndex;
var promoted = JSON.parse(
JSON.stringify(winK)
);
promoted.isTired = false;
promoted.stamina = 100;

// remove loser and sync promoted reference
var nextAlive = [];
for (
var a = 0;
a < gameState.aliveKnights.length;
a++
) {
var ak = gameState.aliveKnights[a];
if (ak.id === winK.id) {
nextAlive.push(promoted);
} else if (ak.id !== loseK.id) {
nextAlive.push(ak);
}
}
gameState.aliveKnights = nextAlive;

if (idx === 0) {
gameState.matches[4].k1 = promoted;
} else if (idx === 1) {
gameState.matches[4].k2 = promoted;
} else if (idx === 2) {
gameState.matches[5].k1 = promoted;
} else if (idx === 3) {
gameState.matches[5].k2 = promoted;
} else if (idx === 4) {
gameState.matches[6].k1 = promoted;
} else if (idx === 5) {
gameState.matches[6].k2 = promoted;
} else if (idx === 6) {
// grand final completed reveal secret title
gameState.tournamentStatus = 'FINISHED';
gameState.champion = winK;
gameState.lastChampionId = winK.id;
pubData.lastChampionId = winK.id;
pubData.lastFinalistId = loseK.id;

for (
var t = 0;
t < pubData.roster.length;
t++
) {
if (pubData.roster[t].id === winK.id) {
pubData.roster[t].titles += 1;
winK.titles = pubData.roster[t].titles;
}
}

var tTag =
l === 'uk'
? ' [ТУРНІР]: +'
: l === 'ru'
? ' [ТУРНИР]: +'
: ' [TOURNEY]: +';
// settle outright tournament champion bets
for (
var o = 0;
o < gameState.activeBets.length;
o++
) {
var ob = gameState.activeBets[o];
if (
ob.betType === 'OUTRIGHT' &&
ob.knightId === winK.id
) {
var outWin = calcBetPayout(
ob.amount,
ob.odds
);
creditTableById(ob.tableId, outWin);
var outGiftExtra = ob.paradeGift
? giftTagWord + ob.paradeGift
: '';
payLogs.push(
ob.tableName +
tTag +
outWin +
outGiftExtra
);
if (ob.paradeGift) {
wonGifts.push(
ob.tableName.toUpperCase() +
giftVerb +
ob.paradeGift.toUpperCase() +
'!'
);
}
}
}
gameState.activeBets = [];
}

if (wonGifts.length > 0) {
gameState.prizeBannerText =
wonGifts.join(' · ');
gameState.soundToPlay = 'prize';
}
if (payLogs.length > 0) {
gameState.recentPayouts = payLogs.slice(0, 4);
}
savePubData(pubData);
updateAllOdds(gameState);
saveGameState(gameState);
}

// add balance to a table by id
// updates both gameState and pubData
function creditTableById(tableId, delta) {
if (!pubData || !pubData.tables) return;
for (
var i = 0;
i < pubData.tables.length;
i++
) {
if (pubData.tables[i].id === tableId) {
pubData.tables[i].balance = Math.max(
0,
pubData.tables[i].balance + delta
);
}
}
gameState.tables = pubData.tables;
}

// damage shield by at most +1 per match
// new shield cannot be lost in one bout
function tryDamageShield(knight, chance) {
if (!knight) return false;
var cur = knight.shieldDamage || 0;
var start =
knight.matchStartShield !== undefined
? knight.matchStartShield
: cur;
if (cur >= 2) return false;
if (cur - start >= 1) return false;
if (Math.random() >= chance) return false;
knight.shieldDamage = cur + 1;
return true;
}

// compute rider hit and seat defense in pass
// applies horse trait wind and pass fatigue
function calcJoustRiderStats(
k,
oppK,
pass,
dir,
windDir
) {
var h = HORSES[k.horseIdx] || HORSES[0];
var oppH =
HORSES[oppK.horseIdx] || HORSES[0];
var s = SHIELDS[k.shieldIdx] || SHIELDS[0];
var tr = h.trait || '';
var favSyn =
k.hasFavHorse ||
k.horseIdx === k.favHorseIdx;

// check wind speed bonus for horse coat
// windrunner doubles tailwind headwind fights
var windSpd = 0;
if (windDir === dir) {
windSpd = tr === 'windrunner' ? 10 : 5;
} else if (
windDir === -dir &&
tr === 'headwind'
) {
windSpd = 5;
} else if (
windDir === 0 &&
tr === 'windrunner'
) {
windSpd = 3;
}

// compute pass fatigue from horse stamina
// sprinters tire fast stayers stay fresh
var fat =
(pass - 1) *
Math.max(0, 96 - h.stamina) *
0.45;
if (tr === 'burst' && pass >= 2) {
fat *= 1.15;
}
if (tr === 'agile' && pass === 3) {
fat += 4;
}
if (tr === 'ironlung') {
fat = 0;
}
if (favSyn) {
fat *= 0.75;
}
if (
pass >= 2 &&
h.stamina < 83 &&
tr !== 'ironlung'
) {
k.isTired = true;
}

var effSpd = h.speed + windSpd;
var effBal = h.balance;
var effJoust = k.joustSkill;

if (tr === 'second_wind') {
effSpd += (pass - 1) * 3;
effBal += (pass - 1) * 3;
}
if (tr === 'harmony') {
effJoust *= 1.05;
}
if (
tr === 'headwind' &&
windDir === -dir
) {
effBal += 5;
}

// pass 1 gives extra impulse to sprinters
// traits add pass specific hit and defense
var sprintImp =
pass === 1
? Math.max(0, effSpd - 85) * 0.35
: 0;
var trHit = 0;
if (tr === 'burst' && pass === 1) {
trHit += 6;
}
if (tr === 'relentless' && pass >= 2) {
trHit += 4;
}
if (tr === 'ironlung' && pass === 3) {
trHit += 6;
}

var trDef = 0;
if (
tr === 'steadfast' &&
oppH.speed >= 90
) {
trDef += 6;
}
if (tr === 'ironlung' && pass === 3) {
trDef += 6;
}
if (tr === 'agile' && pass === 1) {
trDef += 4;
}

var synBonus = favSyn ? 4 : 0;
var shPen = tr === 'brace' ? 9 : 14;

var hit =
effJoust * 0.5 +
effSpd * 0.5 +
sprintImp +
trHit +
synBonus -
fat +
Math.random() * 28;
var def =
s.joustDef * 0.5 +
effBal * 0.5 +
trDef +
synBonus -
fat * 0.35 -
k.shieldDamage * shPen;

return { hit: hit, def: def };
}

// run one joust pass or foot melee phase
// we compute shield shatter and unseating
function runNextCombatPhase() {
var m =
gameState.matches[
gameState.currentMatchIndex
];
if (!m || !m.k1 || !m.k2) return;
var c = gameState.combat;

if (c.pendingMelee) {
c.pendingMelee = false;
c.mode = 'MELEE';
c.unseated1 = false;
c.unseated2 = false;
}

c.stepId += 1;
c.shatterSide = 0;
c.shieldHit1 = false;
c.shieldHit2 = false;
c.throwFlowers = false;
c.pausedForBets = false;
c.bannerTitle = '';
c.bannerSub = '';

if (c.mode === 'JOUST') {
c.pass += 1;
c.windDir =
[-1, 0, 1][Math.floor(Math.random() * 3)];

var s1 = SHIELDS[m.k1.shieldIdx];
var s2 = SHIELDS[m.k2.shieldIdx];

// compute lance impact with horse traits
// rider with wind in back gets speed boost
var evenP = c.pass % 2 === 0;
var dir1 = evenP ? -1 : 1;
var dir2 = evenP ? 1 : -1;

var st1 = calcJoustRiderStats(
m.k1,
m.k2,
c.pass,
dir1,
c.windDir
);
var st2 = calcJoustRiderStats(
m.k2,
m.k1,
c.pass,
dir2,
c.windDir
);

var hit1 = st1.hit;
var hit2 = st2.hit;
var def1 = st1.def;
var def2 = st2.def;

var fall1 = hit2 - def1 > 16;
var fall2 = hit1 - def2 > 16;

// single rider unseated: no shield break
if (fall1 && !fall2) {
c.unseated1 = true;
c.finished = true;
c.winnerSide = 2;
c.throwFlowers =
c.pass === 3 ||
gameState.currentMatchIndex === 6;
c.outcomeKey = 'JOUST_WIN_2';
localizeCombatTexts(gameState);
gameState.soundToPlay = 'fanfare';
finishCurrentMatch(2);
return;
}

if (fall2 && !fall1) {
c.unseated2 = true;
c.finished = true;
c.winnerSide = 1;
c.throwFlowers =
c.pass === 3 ||
gameState.currentMatchIndex === 6;
c.outcomeKey = 'JOUST_WIN_1';
localizeCombatTexts(gameState);
gameState.soundToPlay = 'fanfare';
finishCurrentMatch(1);
return;
}

// mutual fall: keep mode JOUST to animate
if (fall1 && fall2) {
c.unseated1 = true;
c.unseated2 = true;
c.pendingMelee = true;
m.k1.isTired = true;
m.k2.isTired = true;

if (tryDamageShield(m.k1, 0.38)) {
c.shieldHit1 = true;
}
if (tryDamageShield(m.k2, 0.38)) {
c.shieldHit2 = true;
}

gameState.soundToPlay = 'shatter';
updateAllOdds(gameState);

if (gameState.allowLiveBets) {
c.pausedForBets = true;
}
c.outcomeKey = 'MUTUAL_FALL';
localizeCombatTexts(gameState);
saveGameState(gameState);
return;
}

// neither fell: shield may crack (max +1)
if (
hit2 > s1.durability * 0.88 &&
tryDamageShield(m.k1, 0.34)
) {
c.shieldHit1 = true;
}
if (
hit1 > s2.durability * 0.88 &&
tryDamageShield(m.k2, 0.34)
) {
c.shieldHit2 = true;
}

gameState.soundToPlay =
c.shieldHit1 || c.shieldHit2
? 'shatter'
: 'clash';

if (c.pass >= 3) {
// keep JOUST so 3rd pass animates fully
c.pendingMelee = true;
updateAllOdds(gameState);
if (gameState.allowLiveBets) {
c.pausedForBets = true;
}
c.outcomeKey = 'PASS_3_MELEE';
localizeCombatTexts(gameState);
saveGameState(gameState);
return;
}

updateAllOdds(gameState);
if (gameState.allowLiveBets) {
c.pausedForBets = true;
}
c.outcomeKey = 'PASS_HOLD';
localizeCombatTexts(gameState);
saveGameState(gameState);
return;
}

// foot melee combat resolution
// single continuous 3-strike sword duel
c.meleeRound += 1;

var w1 = WEAPONS[m.k1.weaponIdx];
var w2 = WEAPONS[m.k2.weaponIdx];

if (
w2.crush >= 80 &&
tryDamageShield(m.k1, 0.36)
) {
c.shieldHit1 = true;
}
if (
w1.crush >= 80 &&
tryDamageShield(m.k2, 0.36)
) {
c.shieldHit2 = true;
}

var score1 =
calcPowerScore(m.k1, 'MELEE') +
Math.random() * 32;
var score2 =
calcPowerScore(m.k2, 'MELEE') +
Math.random() * 32;

var winSide = score1 >= score2 ? 1 : 2;
var loseK = winSide === 1 ? m.k2 : m.k1;
loseK.isTired = true;

c.finished = true;
c.winnerSide = winSide;
c.throwFlowers =
gameState.currentMatchIndex === 6;
c.outcomeKey = 'MELEE_WIN';
localizeCombatTexts(gameState);
gameState.soundToPlay = 'fanfare';
finishCurrentMatch(winSide);
}

// step parade and combat timers on server
// saves state on every step for crash recovery
setInterval(function () {
if (!pubData || gameState.noPubSelected) {
return;
}
if (
gameState.tvScreen === 'PARADE' &&
gameState.parade &&
gameState.parade.active &&
!gameState.parade.finished
) {
var pWait =
Date.now() -
(gameState.lastParadeAt || 0);
if (pWait >= 2400) {
gameState.lastParadeAt = Date.now();
gameState.version = storeVersion++;
var pr = gameState.parade;
if (pr.subStep === 'RIDE_TO_RACK') {
pr.subStep = 'PICKED';
gameState.soundToPlay = 'sword';
} else {
if (pr.currentIndex < 7) {
pr.currentIndex += 1;
pr.subStep = 'RIDE_TO_RACK';
gameState.soundToPlay = 'hoof';
} else {
pr.finished = true;
var bKey =
gameState.paradeBonusType === 'GIFT'
? 'BONUS_BETS_GIFT'
: 'BONUS_BETS';
gameState.statusKey = bKey;
gameState.statusText = getStatusStr(
bKey,
gameState.lang
);
gameState.soundToPlay = 'horn';
}
}
saveGameState(gameState);
}
} else if (
gameState.tvScreen === 'COMBAT' &&
gameState.combat &&
gameState.combat.active &&
!gameState.combat.finished &&
!gameState.combat.pausedForBets
) {
var elapsed =
Date.now() - (gameState.lastStepAt || 0);
var stepDur =
gameState.combat.mode === 'MELEE'
? 6800
: 6600;
if (elapsed >= stepDur) {
gameState.lastStepAt = Date.now();
gameState.version = storeVersion++;
runNextCombatPhase();
saveGameState(gameState);
}
}
}, 450);

// get local network ip for phone host
// scans non-internal ipv4 interfaces
function getLocalIp() {
var nets = os.networkInterfaces();
for (var name in nets) {
var list = nets[name] || [];
for (var i = 0; i < list.length; i++) {
var net = list[i];
if (
net.family === 'IPv4' &&
!net.internal
) {
return net.address;
}
}
}
return '127.0.0.1';
}

// build compact list of saved pubs
// sent to host selector screen
function getPubsSummary() {
var list = [];
var pubs =
(pubStore && pubStore.pubs) || [];
for (var i = 0; i < pubs.length; i++) {
var p = pubs[i];
list.push({
id: p.id,
name: p.name,
pubSeed: p.pubSeed,
tournamentNumber:
p.tournamentNumber || 0,
gameMode: p.gameMode || 'PUB',
pinEnabled: Boolean(p.pinEnabled),
tablesCount: (p.tables || []).length,
prizesCount: (p.prizes || []).length,
ordersCount: (p.orderGrid || []).length
});
}
return list;
}

// attach network address and store metadata
// returns complete state for tv and host
function buildClientResponse() {
var ip = getLocalIp();
var lanUrl = 'http://' + ip + ':' + PORT;
if (!pubData || gameState.noPubSelected) {
var w = buildWaitingState();
w.lanIp = ip;
w.lanUrl = lanUrl;
w.pubsSummary = getPubsSummary();
w.storeBackup = pubStore;
return w;
}
if (gameState.combat) {
gameState.combat.stepElapsedMs =
Date.now() - (gameState.lastStepAt || 0);
}
delete gameState.storeBackup;
gameState.noPubSelected = false;
gameState.pubId = pubData.id;
gameState.pubName = pubData.name;
gameState.lanIp = ip;
gameState.lanUrl = lanUrl;
gameState.tables = pubData.tables || [];
gameState.orderGrid =
pubData.orderGrid || [];
gameState.prizes = pubData.prizes || [];
gameState.paradeBonusType =
pubData.paradeBonusType || 'PERCENT_20';
gameState.paradeGiftText =
pubData.paradeGiftText || '';
gameState.tvMuted =
Boolean(pubData.tvMuted);
gameState.pinEnabled =
Boolean(pubData.pinEnabled);
gameState.hasPinCode =
Boolean(pubData.pinCode);
gameState.pubsSummary = getPubsSummary();
gameState.rosterBackup = pubData.roster;
var out = Object.assign({}, gameState);
out.storeBackup = pubStore;
return out;
}

// return current state to tv and host
// includes multi-pub backup for client
app.get('/api/state', function (req, res) {
res.set('Cache-Control', 'no-store');
res.json(buildClientResponse());
});

// export all multi-pub data as json file
// protects pub history across reinstalls
app.get('/api/export', function (req, res) {
res.set('Cache-Control', 'no-store');
res.set(
'Content-Type',
'application/json;charset=UTF-8'
);
res.set(
'Content-Disposition',
'attachment; filename="knight_tournament_backup.json"'
);
var payload = {
schemaVersion: 3,
exportedAt: new Date().toISOString(),
lang: pubStore.lang || 'en',
activePubId: pubStore.activePubId,
pubs: pubStore.pubs || []
};
res.send(
JSON.stringify(payload, null, 2)
);
});

// return local ip and port info
// used by tv and host network bar
app.get('/api/ip', function (req, res) {
var ip = getLocalIp();
res.json({
ip: ip,
port: PORT,
lanUrl: 'http://' + ip + ':' + PORT
});
});

// process presenter actions from phone
// updates active pub and saves store
app.post('/api/action', function (req, res) {
var body = req.body || {};
var type = body.type;
storeVersion += 1;
if (gameState) {
gameState.version = storeVersion;
gameState.soundToPlay = null;
gameState.prizeBannerText = null;
}

if (
type === 'restore_snapshot' &&
body.snapshot
) {
var snap = body.snapshot;
if (
snap.storeBackup &&
Array.isArray(snap.storeBackup.pubs) &&
snap.storeBackup.pubs.length > 0 &&
pubStore.pubs.length === 0
) {
pubStore = snap.storeBackup;
savePubStore(pubStore);
gameState = loadOrBuildGameState();
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
if (pubData && snap.matches) {
if (
snap.rosterBackup &&
snap.rosterBackup.length ===
pubData.roster.length
) {
pubData.roster = snap.rosterBackup;
}
if (snap.tables) {
pubData.tables = snap.tables;
}
if (snap.orderGrid) {
pubData.orderGrid = snap.orderGrid;
}
if (snap.prizes) {
pubData.prizes = snap.prizes;
}
if (snap.tournamentNumber) {
pubData.tournamentNumber =
snap.tournamentNumber;
}
if (snap.lastChampionId) {
pubData.lastChampionId =
snap.lastChampionId;
}
if (snap.lang) {
pubData.lang = snap.lang;
pubStore.lang = snap.lang;
}
savePubData(pubData);
gameState = snap;
gameState.tables = pubData.tables;
gameState.orderGrid = pubData.orderGrid;
gameState.prizes = pubData.prizes;
gameState.lastParadeAt = Date.now();
gameState.lastStepAt = Date.now();
saveGameState(gameState);
}
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'create_pub') {
var pName = String(
body.name || ''
).trim();
if (!pName) {
res.json({
ok: false,
state: buildClientResponse()
});
return;
}
var newPub = createPubData(
pName,
body.seed,
pubStore.lang || 'en'
);
pubStore.pubs.push(newPub);
pubStore.activePubId = newPub.id;
pubData = newPub;
gameState = buildNewTournament('PUB');
savePubStore(pubStore);
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'select_pub') {
var targetPub = findPubById(body.pubId);
if (targetPub) {
pubStore.activePubId = targetPub.id;
pubData = targetPub;
gameState = loadOrBuildGameState();
savePubStore(pubStore);
}
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'unselect_pub') {
pubStore.activePubId = null;
pubData = null;
gameState = buildWaitingState();
savePubStore(pubStore);
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'reset_all') {
pubStore = {
schemaVersion: 3,
lang: (pubStore && pubStore.lang) || 'en',
activePubId: null,
pubs: []
};
pubData = null;
gameState = buildWaitingState();
savePubStore(pubStore);
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'cycle_lang') {
var curL =
(pubData && pubData.lang) ||
pubStore.lang ||
'en';
var nextL =
curL === 'en'
? 'uk'
: curL === 'uk'
? 'ru'
: 'en';
pubStore.lang = nextL;
if (pubData && !gameState.noPubSelected) {
gameState.lang = nextL;
localizeAllState(
gameState,
pubData,
savePubData
);
} else {
savePubStore(pubStore);
}
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'set_lang') {
var reqL = body.lang;
if (
reqL === 'en' ||
reqL === 'uk' ||
reqL === 'ru'
) {
pubStore.lang = reqL;
if (pubData && !gameState.noPubSelected) {
gameState.lang = reqL;
localizeAllState(
gameState,
pubData,
savePubData
);
} else {
savePubStore(pubStore);
}
}
res.json({
ok: true,
state: buildClientResponse()
});
return;
}

if (!pubData || gameState.noPubSelected) {
res.json({
ok: false,
state: buildClientResponse()
});
return;
}

if (type === 'toggle_mode') {
var reqMode = body.mode;
if (reqMode === 'PUB' || reqMode === 'CASH') {
gameState.gameMode = reqMode;
} else {
gameState.gameMode =
gameState.gameMode === 'PUB'
? 'CASH'
: 'PUB';
}
pubData.gameMode = gameState.gameMode;
savePubData(pubData);
} else if (type === 'toggle_live_bets') {
gameState.allowLiveBets =
!gameState.allowLiveBets;
pubData.allowLiveBets =
gameState.allowLiveBets;
savePubData(pubData);
} else if (type === 'add_order_item') {
var itemTitle = String(
body.title || ''
).trim();
var itemCaps =
parseInt(body.caps, 10) || 0;
if (itemTitle && itemCaps > 0) {
if (!pubData.orderGrid) {
pubData.orderGrid = [];
}
var nextOId = Date.now() +
Math.floor(Math.random() * 999);
pubData.orderGrid.push({
id: nextOId,
title: itemTitle,
caps: itemCaps
});
gameState.orderGrid = pubData.orderGrid;
savePubData(pubData);
}
} else if (type === 'delete_order_item') {
var delOId = parseInt(body.itemId, 10);
if (pubData.orderGrid) {
var keptOrders = [];
for (
var oi = 0;
oi < pubData.orderGrid.length;
oi++
) {
if (pubData.orderGrid[oi].id !== delOId) {
keptOrders.push(pubData.orderGrid[oi]);
}
}
pubData.orderGrid = keptOrders;
gameState.orderGrid = keptOrders;
savePubData(pubData);
}
} else if (type === 'add_prize_item') {
var prTitle = String(
body.title || ''
).trim();
var prCost =
parseInt(body.cost, 10) || 0;
if (prTitle && prCost > 0) {
if (!pubData.prizes) {
pubData.prizes = [];
}
var nextPId = Date.now() +
Math.floor(Math.random() * 999);
pubData.prizes.push({
id: nextPId,
cost: prCost,
title: prTitle
});
gameState.prizes = pubData.prizes;
savePubData(pubData);
}
} else if (type === 'delete_prize_item') {
var delPId = parseInt(body.prizeId, 10);
if (pubData.prizes) {
var keptPrizes = [];
for (
var pri = 0;
pri < pubData.prizes.length;
pri++
) {
if (pubData.prizes[pri].id !== delPId) {
keptPrizes.push(pubData.prizes[pri]);
}
}
pubData.prizes = keptPrizes;
gameState.prizes = keptPrizes;
savePubData(pubData);
}
} else if (type === 'save_parade_bonus') {
var bMode =
body.bonusType === 'GIFT'
? 'GIFT'
: 'PERCENT_20';
var gTxt = String(
body.giftText || ''
).trim();
// block saving gift mode if gift is empty
if (bMode === 'GIFT' && !gTxt) {
res.json({
ok: false,
error: 'GIFT_REQUIRED',
state: buildClientResponse()
});
return;
}
pubData.paradeBonusType = bMode;
pubData.paradeGiftText = gTxt;
gameState.paradeBonusType = bMode;
gameState.paradeGiftText = gTxt;
if (
gameState.statusKey === 'BONUS_BETS' ||
gameState.statusKey === 'BONUS_BETS_GIFT'
) {
var sKey =
bMode === 'GIFT'
? 'BONUS_BETS_GIFT'
: 'BONUS_BETS';
gameState.statusKey = sKey;
gameState.statusText = getStatusStr(
sKey,
gameState.lang
);
}
savePubData(pubData);
} else if (type === 'restart_parade') {
gameState.tvScreen = 'PARADE';
gameState.statusKey = 'PARADE_START';
gameState.statusText = getStatusStr(
'PARADE_START',
gameState.lang
);
gameState.lastParadeAt = Date.now();
gameState.parade = {
active: true,
currentIndex: 0,
subStep: 'RIDE_TO_RACK',
finished: false,
bonusActive: true
};
if (gameState.combat) {
gameState.combat.active = false;
gameState.combat.finished = false;
gameState.combat.pausedForBets = false;
}
gameState.soundToPlay = 'horn';
} else if (type === 'toggle_screen') {
if (gameState.tvScreen === 'COMBAT') {
gameState.tvScreen = 'BRACKET';
if (
gameState.combat &&
gameState.combat.finished
) {
gameState.combat.active = false;
gameState.combat.finished = false;
gameState.combat.pausedForBets = false;
gameState.statusKey =
gameState.tournamentStatus === 'FINISHED'
? 'CHAMP_DONE'
: 'NEXT_BETS';
gameState.statusText = getStatusStr(
gameState.statusKey,
gameState.lang
);
if (
gameState.tournamentStatus !==
'FINISHED' &&
gameState.currentMatchIndex < 6
) {
gameState.currentMatchIndex += 1;
}
updateAllOdds(gameState);
}
} else if (
gameState.tvScreen === 'BRACKET' &&
gameState.combat &&
gameState.combat.active &&
!gameState.combat.finished
) {
gameState.tvScreen = 'COMBAT';
} else if (gameState.tvScreen === 'PARADE') {
gameState.tvScreen = 'BRACKET';
gameState.statusKey = 'BETS_OPEN';
gameState.statusText = getStatusStr(
'BETS_OPEN',
gameState.lang
);
} else {
gameState.tvScreen = 'BRACKET';
}
} else if (type === 'place_bet') {
var tId = parseInt(body.tableId, 10);
var kId = body.knightId;
var amt = parseInt(body.amount, 10);
var bType = body.betType || 'MATCH';

// check all impossible bet states first
// returns specific errorCode to host ui
var errCode = '';
var tablesArr = pubData.tables || [];
var tableObj = null;
for (
var i = 0;
i < tablesArr.length;
i++
) {
if (tablesArr[i].id === tId) {
tableObj = tablesArr[i];
}
}

var curMatch =
gameState.matches &&
gameState.matches[
gameState.currentMatchIndex
];
var cState = gameState.combat || {};
var stepWaitSec =
cState.stepElapsedMs !== undefined
? cState.stepElapsedMs / 1000
: (Date.now() -
(gameState.lastStepAt || 0)) /
1000;
var minRevealSec =
cState.mode === 'JOUST' ? 3.25 : 4.75;

if (tablesArr.length === 0) {
errCode = 'NO_TABLES';
} else if (!tableObj) {
errCode = 'NO_TABLE_SELECTED';
} else if (gameState.tvScreen === 'WAITING') {
errCode = 'WAITING_SCREEN';
} else if (
gameState.tournamentStatus === 'FINISHED'
) {
errCode = 'TOUR_FINISHED';
} else if (
bType === 'MATCH' &&
(!curMatch ||
curMatch.status === 'DONE' ||
(gameState.tvScreen === 'COMBAT' &&
cState.finished))
) {
errCode = 'BOUT_DONE';
} else if (
gameState.tvScreen === 'COMBAT' &&
!gameState.allowLiveBets
) {
errCode = 'LIVE_BETS_OFF';
} else if (
gameState.tvScreen === 'COMBAT' &&
(!cState.pausedForBets ||
stepWaitSec < minRevealSec)
) {
errCode = 'PASS_IN_PROGRESS';
} else if (!kId) {
errCode = 'NO_KNIGHT_SELECTED';
} else if (!amt || amt <= 0) {
errCode = 'BAD_AMOUNT';
} else if (tableObj.balance < amt) {
errCode = 'LOW_BALANCE';
}

var kName = '';
var lockedOdds = 1.9;
var foundKnight = false;

if (!errCode) {
if (bType === 'MATCH' && curMatch) {
if (
curMatch.k1 &&
curMatch.k1.id === kId
) {
kName = curMatch.k1.name;
lockedOdds = parseFloat(curMatch.odds1);
foundKnight = true;
} else if (
curMatch.k2 &&
curMatch.k2.id === kId
) {
kName = curMatch.k2.name;
lockedOdds = parseFloat(curMatch.odds2);
foundKnight = true;
}
if (!foundKnight) {
errCode = 'NO_KNIGHT_SELECTED';
}
} else {
for (
var a = 0;
a < gameState.aliveKnights.length;
a++
) {
var ak = gameState.aliveKnights[a];
if (ak.id === kId) {
kName = ak.name;
lockedOdds = parseFloat(
ak.outrightOdds
);
foundKnight = true;
}
}
if (!foundKnight) {
errCode = 'KNIGHT_ELIMINATED';
}
}
}

if (errCode) {
res.json({
ok: false,
errorCode: errCode,
state: buildClientResponse()
});
return;
}

// apply parade bonus only to outright bet
// first bout bets keep standard match odds
var paradeGift = null;
if (
gameState.tvScreen === 'PARADE' &&
bType === 'OUTRIGHT'
) {
if (
pubData.paradeBonusType === 'GIFT' &&
pubData.paradeGiftText
) {
paradeGift = pubData.paradeGiftText;
} else {
lockedOdds = parseFloat(
calcParadeBonusOdd(lockedOdds)
);
}
}

tableObj.balance -= amt;
var newBetId =
Date.now() +
Math.floor(Math.random() * 999);
gameState.activeBets.unshift({
id: newBetId,
tableId: tableObj.id,
tableName: tableObj.name,
knightId: kId,
knightName: kName,
amount: amt,
odds: lockedOdds,
betType: bType,
paradeGift: paradeGift
});
gameState.soundToPlay = 'bet';
savePubData(pubData);
updateAllOdds(gameState);
} else if (type === 'cancel_bet') {
// remove mistaken bet and refund table
// recalculates live odds after removal
var cBetId = parseInt(body.betId, 10);
var cBetIdx = parseInt(body.betIndex, 10);
var curBets = gameState.activeBets || [];
var keptBets = [];
var refunded = false;
for (
var bi = 0;
bi < curBets.length;
bi++
) {
var bItem = curBets[bi];
var matchById =
cBetId && bItem.id === cBetId;
var matchByIdx =
!cBetId && bi === cBetIdx;
if (
!refunded &&
(matchById || matchByIdx)
) {
refunded = true;
creditTableById(
bItem.tableId,
bItem.amount
);
} else {
keptBets.push(bItem);
}
}
if (refunded) {
gameState.activeBets = keptBets;
savePubData(pubData);
updateAllOdds(gameState);
}
} else if (type === 'add_credit') {
var cTableId = parseInt(body.tableId, 10);
var delta = parseInt(body.delta, 10) || 1;
creditTableById(cTableId, delta);
gameState.soundToPlay = 'bet';
savePubData(pubData);
} else if (type === 'adjust_table') {
// adjust table balance up or down manually
// clamps balance at zero caps or cash
var adjId = parseInt(body.tableId, 10);
var adjDelta =
parseInt(body.delta, 10) || 0;
if (adjId && adjDelta !== 0) {
creditTableById(adjId, adjDelta);
savePubData(pubData);
}
} else if (type === 'delete_table') {
// remove one table and its active bets
// keeps table list clean on host panel
var delTId = parseInt(body.tableId, 10);
if (delTId && pubData.tables) {
var nextTables = [];
for (
var dti = 0;
dti < pubData.tables.length;
dti++
) {
if (pubData.tables[dti].id !== delTId) {
nextTables.push(pubData.tables[dti]);
}
}
pubData.tables = nextTables;
gameState.tables = nextTables;
var remTBets = [];
var oldTBets = gameState.activeBets || [];
for (
var rbi = 0;
rbi < oldTBets.length;
rbi++
) {
if (oldTBets[rbi].tableId !== delTId) {
remTBets.push(oldTBets[rbi]);
}
}
gameState.activeBets = remTBets;
savePubData(pubData);
updateAllOdds(gameState);
}
} else if (type === 'clear_tables') {
// clear all tables and bets for new night
// keeps pub roster and prize settings
pubData.tables = [];
gameState.tables = [];
gameState.activeBets = [];
savePubData(pubData);
updateAllOdds(gameState);
} else if (type === 'toggle_tv_mute') {
// mute or unmute tv sound from host phone
// persists mute flag inside active pub
pubData.tvMuted = !pubData.tvMuted;
gameState.tvMuted = pubData.tvMuted;
savePubData(pubData);
} else if (type === 'rename_pub') {
// update active pub name from settings
// syncs header title and pub store list
var nextName = String(
body.name || ''
).trim();
if (nextName) {
pubData.name = nextName;
gameState.pubName = nextName;
savePubData(pubData);
}
} else if (type === 'save_pin_settings') {
// save optional host pin lock settings
// requires pin code before turning on
var wantPinOn = Boolean(body.pinEnabled);
var rawPin = String(
body.pinCode || ''
).trim();
if (rawPin) {
pubData.pinCode = rawPin;
}
if (wantPinOn && !pubData.pinCode) {
res.json({
ok: false,
errorCode: 'PIN_REQUIRED',
state: buildClientResponse()
});
return;
}
pubData.pinEnabled = wantPinOn;
gameState.pinEnabled = wantPinOn;
gameState.hasPinCode =
Boolean(pubData.pinCode);
savePubData(pubData);
} else if (type === 'verify_pin') {
// check entered pin against pub pin code
// unlocks host phone when pin matches
var tryPin = String(body.pin || '').trim();
if (
!pubData.pinEnabled ||
pubData.pinCode === tryPin
) {
res.json({
ok: true,
state: buildClientResponse()
});
} else {
res.json({
ok: false,
errorCode: 'BAD_PIN',
state: buildClientResponse()
});
}
return;
} else if (type === 'delete_pub') {
// remove active pub from multi-pub store
// returns host and tv to waiting screen
var targetDelId =
body.pubId || pubData.id;
var remPubs = [];
for (
var dpi = 0;
dpi < pubStore.pubs.length;
dpi++
) {
if (pubStore.pubs[dpi].id !== targetDelId) {
remPubs.push(pubStore.pubs[dpi]);
}
}
pubStore.pubs = remPubs;
pubStore.activePubId = null;
pubData = null;
gameState = buildWaitingState();
savePubStore(pubStore);
res.json({
ok: true,
state: buildClientResponse()
});
return;
} else if (type === 'claim_prize') {
var pTableId = parseInt(body.tableId, 10);
var prizeId = parseInt(body.prizeId, 10);
var tTarget = null;
var pTarget = null;

for (
var ti = 0;
ti < pubData.tables.length;
ti++
) {
if (pubData.tables[ti].id === pTableId) {
tTarget = pubData.tables[ti];
}
}
for (
var pi = 0;
pi < pubData.prizes.length;
pi++
) {
if (pubData.prizes[pi].id === prizeId) {
pTarget = pubData.prizes[pi];
}
}

if (
tTarget &&
pTarget &&
tTarget.balance >= pTarget.cost
) {
tTarget.balance -= pTarget.cost;
var claimVerb =
gameState.lang === 'uk'
? ' ЗАБИРАЄ ПРИЗ: '
: gameState.lang === 'ru'
? ' ЗАБИРАЕТ ПРИЗ: '
: ' CLAIMS PRIZE: ';
gameState.prizeBannerText =
tTarget.name.toUpperCase() +
claimVerb +
pTarget.title.toUpperCase() +
'!';
gameState.soundToPlay = 'prize';
savePubData(pubData);
}
} else if (type === 'add_table') {
var newId = Date.now() +
Math.floor(Math.random() * 999);
var nextNum = pubData.tables.length + 1;
var defPref =
gameState.lang === 'uk'
? 'Стіл №'
: gameState.lang === 'ru'
? 'Стол №'
: 'Table #';
pubData.tables.push({
id: newId,
name: body.name || defPref + nextNum,
balance: 0
});
gameState.tables = pubData.tables;
savePubData(pubData);
} else if (type === 'combat_step') {
if (gameState.tvScreen === 'WAITING') {
// start knight parade on host command
gameState.tvScreen = 'PARADE';
gameState.statusKey = 'PARADE_START';
gameState.statusText = getStatusStr(
'PARADE_START',
gameState.lang
);
gameState.lastParadeAt = Date.now();
gameState.parade = {
active: true,
currentIndex: 0,
subStep: 'RIDE_TO_RACK',
finished: false,
bonusActive: true
};
gameState.soundToPlay = 'horn';
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
if (gameState.tvScreen === 'PARADE') {
if (
gameState.parade &&
!gameState.parade.finished
) {
// skip parade animation to lineup & bonus bets
gameState.parade.currentIndex = 7;
gameState.parade.subStep = 'PICKED';
gameState.parade.finished = true;
var bKey2 =
pubData.paradeBonusType === 'GIFT'
? 'BONUS_BETS_GIFT'
: 'BONUS_BETS';
gameState.statusKey = bKey2;
gameState.statusText = getStatusStr(
bKey2,
gameState.lang
);
gameState.soundToPlay = 'horn';
} else {
// finish bonus betting and show bracket
gameState.tvScreen = 'BRACKET';
gameState.statusKey = 'BETS_OPEN';
gameState.statusText = getStatusStr(
'BETS_OPEN',
gameState.lang
);
gameState.soundToPlay = 'horn';
}
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}

// allow returning to bracket after final bout
if (
gameState.tvScreen === 'COMBAT' &&
gameState.combat
) {
var cElapsedMs =
Date.now() - (gameState.lastStepAt || 0);
var minStepMs =
gameState.combat.mode === 'JOUST'
? 3250
: 4750;
if (cElapsedMs < minStepMs) {
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
if (gameState.combat.finished) {
gameState.tvScreen = 'BRACKET';
gameState.combat.active = false;
gameState.combat.finished = false;
gameState.combat.pausedForBets = false;
gameState.statusKey =
gameState.tournamentStatus === 'FINISHED'
? 'CHAMP_DONE'
: 'NEXT_BETS';
gameState.statusText = getStatusStr(
gameState.statusKey,
gameState.lang
);
if (
gameState.tournamentStatus !==
'FINISHED' &&
gameState.currentMatchIndex < 6
) {
gameState.currentMatchIndex += 1;
}
updateAllOdds(gameState);
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
if (gameState.combat.pausedForBets) {
gameState.lastStepAt = Date.now();
runNextCombatPhase();
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
}

var curM =
gameState.matches[
gameState.currentMatchIndex
];
if (
!curM ||
!curM.k1 ||
!curM.k2 ||
gameState.tournamentStatus === 'FINISHED'
) {
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}

if (gameState.tvScreen !== 'COMBAT') {
if (
gameState.combat &&
gameState.combat.active &&
!gameState.combat.finished
) {
gameState.tvScreen = 'COMBAT';
if (gameState.combat.pausedForBets) {
gameState.lastStepAt = Date.now();
runNextCombatPhase();
}
saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
return;
}
gameState.tvScreen = 'COMBAT';
gameState.statusKey = 'BOUT_ACTIVE';
gameState.statusText = getStatusStr(
'BOUT_ACTIVE',
gameState.lang
);
curM.k1.matchStartShield =
curM.k1.shieldDamage || 0;
curM.k2.matchStartShield =
curM.k2.shieldDamage || 0;
gameState.combat = {
active: true,
mode: 'JOUST',
pendingMelee: false,
pass: 0,
meleeRound: 0,
windDir: 0,
stepElapsedMs: 0,
pausedForBets: false,
finished: false,
winnerSide: null,
unseated1: false,
unseated2: false,
shieldHit1: false,
shieldHit2: false,
throwFlowers: false,
shatterSide: 0,
stepId: gameState.combat.stepId + 1,
outcomeKey: 'ENTER',
phaseTitle: '',
note: '',
bannerTitle: '',
bannerSub: ''
};
localizeCombatTexts(gameState);
gameState.lastStepAt = Date.now();
gameState.soundToPlay = 'horn';
runNextCombatPhase();
}
} else if (type === 'next_match') {
gameState.tvScreen = 'BRACKET';
if (gameState.combat) {
gameState.combat.active = false;
gameState.combat.finished = false;
gameState.combat.pausedForBets = false;
}
if (
gameState.currentMatchIndex < 6 &&
gameState.matches[
gameState.currentMatchIndex
].status === 'DONE'
) {
gameState.currentMatchIndex += 1;
gameState.statusKey = 'NEXT_BETS';
gameState.statusText = getStatusStr(
'NEXT_BETS',
gameState.lang
);
updateAllOdds(gameState);
}
} else if (type === 'new_tournament') {
gameState = buildNewTournament(
gameState.gameMode
);
} else if (type === 'new_pub_seed') {
var freshPub = createPubData(
pubData.name,
null,
gameState.lang || 'en'
);
pubData.pubSeed = freshPub.pubSeed;
pubData.roster = freshPub.roster;
pubData.tournamentNumber = 0;
pubData.lastChampionId = null;
pubData.lastFinalistId = null;
savePubData(pubData);
gameState = buildNewTournament(
gameState.gameMode
);
}

saveGameState(gameState);
res.json({
ok: true,
state: buildClientResponse()
});
});

// start express server on 0.0.0.0:3000
app.listen(PORT, '0.0.0.0', function () {
console.log(
'knight tournament server on ' + PORT
);
});
