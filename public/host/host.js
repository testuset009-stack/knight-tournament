// mobile presenter host controller
// syncs multi-pub state and settings
(function () {
'use strict';

var betMode = 'MATCH';
var selectedKnightId = '';
var lastState = null;
var lastLangSeen = '';
var lastPubIdSeen = '';
var draftParadeMode = 'PERCENT_20';
var isCreatingPub = false;
var isSettingsOpen = false;
var lastPubsSig = '';
var lastOrderSig = '';
var lastPrizeSig = '';
var lastBetsSig = '';
var lastTablesSig = '';
var lastKnightGridSig = '';
var betMsgTimer = null;
var tableCustomInputs = {};

var tvNetBarUrl =
document.getElementById('tvNetBarUrl');
var pubSelectView =
document.getElementById('pubSelectView');
var pinLockView =
document.getElementById('pinLockView');
var pubWorkView =
document.getElementById('pubWorkView');
var pubSettingsView =
document.getElementById(
'pubSettingsView'
);
var savedPubsList =
document.getElementById('savedPubsList');
var addPubBtnWrap =
document.getElementById('addPubBtnWrap');
var createPubFormCard =
document.getElementById(
'createPubFormCard'
);
var exportSelectWrap =
document.getElementById(
'exportSelectWrap'
);

var newPubNameInput =
document.getElementById(
'newPubNameInput'
);
var newPubSeedInput =
document.getElementById(
'newPubSeedInput'
);
var renamePubInput =
document.getElementById(
'renamePubInput'
);

var tourBadge =
document.getElementById('hostTourBadge');
var screenText =
document.getElementById('hostScreenText');
var modeText =
document.getElementById('hostModeText');
var boutTitle =
document.getElementById('hostBoutTitle');
var boutSub =
document.getElementById('hostBoutSub');

var btnStartStep =
document.getElementById('btnStartStep');
var btnLiveToggle =
document.getElementById('btnLiveToggle');
var liveSwitchTxt =
document.getElementById('liveSwitchTxt');
var tabModePub =
document.getElementById('tabModePub');
var tabModeCash =
document.getElementById('tabModeCash');
var btnHostLang =
document.getElementById('btnHostLang');
var btnTvMute =
document.getElementById('btnTvMute');
var btnSwitchScreen =
document.getElementById(
'btnSwitchScreen'
);
var btnNewTourLive =
document.getElementById(
'btnNewTourLive'
);
var tabBetMatch =
document.getElementById('tabBetMatch');
var tabBetOutright =
document.getElementById('tabBetOutright');

var selectTable =
document.getElementById('selectTable');
var stickyTableSlot =
document.getElementById(
'stickyTableSlot'
);
var stickyTableBar =
document.getElementById(
'stickyTableBar'
);
var selectPrize =
document.getElementById('selectPrize');
var knightVisualGrid =
document.getElementById(
'knightVisualGrid'
);
var betAmountInput =
document.getElementById('betAmountInput');
var betStatusMsg =
document.getElementById('betStatusMsg');
var newTableName =
document.getElementById('newTableName');

var hostActiveBetsList =
document.getElementById(
'hostActiveBetsList'
);
var hostTablesList =
document.getElementById(
'hostTablesList'
);
var settingsTablesList =
document.getElementById(
'settingsTablesList'
);
var setNewTableName =
document.getElementById(
'setNewTableName'
);

var pubOrderQuickBtns =
document.getElementById(
'pubOrderQuickBtns'
);
var customCapsLbl =
document.getElementById('customCapsLbl');
var cashDepositRow =
document.getElementById('cashDepositRow');
var cashDepositInput =
document.getElementById(
'cashDepositInput'
);
var orderGridList =
document.getElementById('orderGridList');
var orderItemInput =
document.getElementById('orderItemInput');
var orderCapsInput =
document.getElementById('orderCapsInput');

var prizeGridList =
document.getElementById('prizeGridList');
var prizeCostInput =
document.getElementById('prizeCostInput');
var prizeTitleInput =
document.getElementById(
'prizeTitleInput'
);

var tabParade20 =
document.getElementById('tabParade20');
var tabParadeGift =
document.getElementById('tabParadeGift');
var paradeModeHintText =
document.getElementById(
'paradeModeHintText'
);
var paradeGiftInputWrap =
document.getElementById(
'paradeGiftInputWrap'
);
var paradeGiftInput =
document.getElementById(
'paradeGiftInput'
);
var paradeBonusMsg =
document.getElementById('paradeBonusMsg');

var btnPinToggle =
document.getElementById('btnPinToggle');
var pinSwitchTxt =
document.getElementById('pinSwitchTxt');
var pinCodeInput =
document.getElementById('pinCodeInput');
var pinConfigMsg =
document.getElementById('pinConfigMsg');
var pinUnlockInput =
document.getElementById('pinUnlockInput');
var pinUnlockMsg =
document.getElementById('pinUnlockMsg');

// check if current browser unlocked pub pin
// stores unlock flag in session storage
function isPubPinUnlocked(pubId) {
if (!pubId) return true;
try {
return (
window.sessionStorage.getItem(
'kt_pin_ok_' + pubId
) === '1'
);
} catch (e) {
return false;
}
}

// mark pub pin as unlocked on this device
// avoids re-asking pin during active evening
function markPubPinUnlocked(pubId) {
if (!pubId) return;
try {
window.sessionStorage.setItem(
'kt_pin_ok_' + pubId,
'1'
);
} catch (e) {}
}

// get dictionary for active state language
// defaults to english when lang is unset
function getDict() {
var lang =
(lastState && lastState.lang) || 'en';
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

// get armor color word by color index
// helps host when guest names a color
function getArmorColorWord(colorIdx) {
var d = getDict();
var idx = Math.abs(colorIdx || 0) % 6;
var keys = [
'colorRed',
'colorBlue',
'colorGreen',
'colorPurple',
'colorSteel',
'colorCopper'
];
return d[keys[idx]] || '';
}

// show error or ok banner under bet button
// hides automatically after a few seconds
function showBetFeedback(text, isError) {
if (!betStatusMsg) return;
if (betMsgTimer) {
clearTimeout(betMsgTimer);
betMsgTimer = null;
}
if (!text) {
betStatusMsg.className = 'cfgMsg hidden';
betStatusMsg.textContent = '';
return;
}
betStatusMsg.className = isError
? 'cfgMsg errMsg'
: 'cfgMsg okMsg';
betStatusMsg.textContent = text;
betMsgTimer = setTimeout(
function () {
betStatusMsg.className =
'cfgMsg hidden';
},
isError ? 5000 : 3000
);
}

// build readable message for bet error code
// explains why bet is impossible right now
function getBetErrorText(
errCode,
s,
tableObj,
amt
) {
var d = getDict();
if (errCode === 'NO_TABLES') {
return d.errNoTables;
}
if (errCode === 'NO_TABLE_SELECTED') {
return d.errNoTableSel;
}
if (errCode === 'WAITING_SCREEN') {
return d.errWaitingScreen;
}
if (errCode === 'TOUR_FINISHED') {
return d.errTourFinished;
}
if (errCode === 'BOUT_DONE') {
return d.errBoutDone;
}
if (errCode === 'LIVE_BETS_OFF') {
return d.errLiveBetsOff;
}
if (errCode === 'PASS_IN_PROGRESS') {
return d.errPassRunning;
}
if (errCode === 'NO_KNIGHT_SELECTED') {
return d.errNoKnightSel;
}
if (errCode === 'KNIGHT_ELIMINATED') {
return d.errKnightElim;
}
if (errCode === 'BAD_AMOUNT') {
return d.errBadAmount;
}
if (errCode === 'LOW_BALANCE') {
var haveStr = fmtMoney(
tableObj ? tableObj.balance : 0,
s ? s.gameMode : 'PUB'
);
var needStr = fmtMoney(
amt || 0,
s ? s.gameMode : 'PUB'
);
return (
d.errLowBalance +
haveStr +
d.errNeedAmt +
needStr
);
}
return d.errNoKnightSel;
}

// check if button waits for second tap
// prevents poll from overwriting prompt
function isConfirmWaiting(el) {
return (
el &&
el._confirmUntil &&
el._confirmUntil > Date.now()
);
}

// reset button from two-tap warning state
// restores normal label and class name
function clearTwoTapState(el) {
if (!el) return;
if (el._confirmTimer) {
clearTimeout(el._confirmTimer);
el._confirmTimer = null;
}
el._confirmUntil = 0;
if (el._origClass) {
el.className = el._origClass;
}
if (el._origHtml !== undefined) {
el.innerHTML = el._origHtml;
}
}

// require two taps within 3.5s on danger
// stops accidental resets during game
function bindTwoTap(
btnEl,
onConfirm,
useShortText
) {
if (!btnEl) return;
btnEl.onclick = function (ev) {
if (ev) ev.stopPropagation();
var now = Date.now();
if (
btnEl._confirmUntil &&
btnEl._confirmUntil > now
) {
clearTwoTapState(btnEl);
onConfirm();
return;
}
var d = getDict();
btnEl._origClass = btnEl.className;
btnEl._origHtml = btnEl.innerHTML;
btnEl._confirmUntil = now + 3500;
btnEl.className =
btnEl._origClass + ' confirmPending';
btnEl.innerHTML = useShortText
? d.tapConfirmShort || 'CONFIRM?'
: d.tapConfirmShort || 'CONFIRM?';
if (btnEl._confirmTimer) {
clearTimeout(btnEl._confirmTimer);
}
btnEl._confirmTimer = setTimeout(
function () {
clearTwoTapState(btnEl);
if (lastState) renderHost(lastState);
},
3500
);
};
}

// apply static host labels when lang changes
// updates section headers and buttons
function applyHostTranslations(lang) {
var d = getDict();
document.documentElement.lang = lang;
document.title = d.hostTitle || '';

var setTxt = function (id, val) {
var el = document.getElementById(id);
if (!el || !val) return;
if (isConfirmWaiting(el)) {
el._origHtml = val;
return;
}
el.innerHTML = val;
};

setTxt('tvNetBarLbl', d.tvNetBarLbl);
setTxt('selectPubTitle', d.selectPubTitle);
setTxt('btnShowAddPub', d.btnAddPubInit);
setTxt(
'btnConfirmCreatePub',
d.btnCreatePub
);
setTxt(
'btnCancelCreatePub',
d.btnCancelPub
);
setTxt('btnExportSelect', d.btnExportData);
setTxt(
'btnOpenSettings',
d.btnOpenSettings
);
setTxt('btnBackToGame', d.btnBackToGame);

setTxt('hostTvScreenLbl', d.tvScreenLbl);
setTxt('hostModeLbl', d.modeLbl);
setTxt('secCtrlTitle', d.ctrlSection);
setTxt(
'btnSwitchScreen',
d.btnSwitchScreen
);
setTxt('btnNewTourLive', d.btnNewTour);
setTxt('secBetTitle', d.betSection);
setTxt('tabBetMatch', d.tabMatch);
setTxt('tabBetOutright', d.tabOutright);
setTxt('lblWhoBets', d.stickyTableLbl);
setTxt(
'lblWhichKnight',
d.whichKnightGridLbl
);
setTxt('lblBetAmt', d.betAmtLbl);
setTxt('btnPlaceBet', d.btnPlaceBet);
setTxt('lblActiveBets', d.activeBetsLbl);
setTxt('lblRedeemPrize', d.redeemLbl);
setTxt('btnClaimPrize', d.btnClaimPrize);
setTxt('lblAddTable', d.addTableLbl);
setTxt('btnAddTable', d.btnAddTable);
setTxt(
'lblTablesManage',
d.tablesManageLbl
);

setTxt(
'secModeLiveTitle',
d.setEconCardTitle
);
setTxt(
'setGameModeTitle',
d.setGameModeTitle
);
setTxt(
'setGameModeDesc',
d.setGameModeDesc
);
setTxt('tabModePub', d.tabModePub);
setTxt('tabModeCash', d.tabModeCash);
setTxt(
'setLiveBetsTitle',
d.setLiveBetsTitle
);
setTxt(
'setLiveBetsDesc',
d.setLiveBetsDesc
);

setTxt(
'secParadeBonusTitle',
d.paradeBonusSec
);
setTxt(
'setParadeBonusTitle',
d.setParadeBonusTitle
);
setTxt(
'setParadeBonusDesc',
d.setParadeBonusDesc
);
setTxt('tabParade20', d.tabBonus20);
setTxt('tabParadeGift', d.tabBonusGift);
setTxt(
'btnSaveParadeBonus',
d.btnSaveParadeBonus
);

setTxt(
'secOrderGridTitle',
d.setOrderCardTitle
);
setTxt(
'setOrderCardDesc',
d.setOrderCardDesc
);
setTxt(
'btnAddOrderItem',
d.btnAddOrderItem
);
setTxt(
'btnAddCashDeposit',
d.btnAddCapsCustom
);
setTxt(
'btnSubCashDeposit',
d.btnSubCapsCustom
);
setTxt(
'secPrizeGridTitle',
d.setPrizeCardTitle
);
setTxt(
'setPrizeCardDesc',
d.setPrizeCardDesc
);
setTxt(
'btnAddPrizeItem',
d.btnAddPrizeItem
);
setTxt(
'secSetTablesTitle',
d.secSetTablesTitle
);
setTxt(
'setTablesCardDesc',
d.setTablesCardDesc
);
setTxt('btnSetAddTable', d.btnAddTable);

setTxt(
'secTourCtrlTitle',
d.setTourCardTitle
);
setTxt(
'actRestartParadeTitle',
d.actRestartParadeTitle
);
setTxt(
'actRestartParadeDesc',
d.actRestartParadeDesc
);
setTxt(
'btnReplayParade',
d.btnActRestartParade
);
setTxt(
'actNewTourTitle',
d.actNewTourTitle
);
setTxt('actNewTourDesc', d.actNewTourDesc);
setTxt('btnNewTour', d.btnActNewTour);
setTxt(
'actClearTablesTitle',
d.actClearTablesTitle
);
setTxt(
'actClearTablesDesc',
d.actClearTablesDesc
);
setTxt(
'btnClearTables',
d.btnActClearTables
);
setTxt(
'actNewSeedTitle',
d.actNewSeedTitle
);
setTxt('actNewSeedDesc', d.actNewSeedDesc);
setTxt('btnNewSeed', d.btnActNewSeed);

setTxt(
'secPubManageTitle',
d.setPubCardTitle
);
setTxt('setPinTitle', d.setPinTitle);
setTxt('setPinDesc', d.setPinDesc);
setTxt('btnSavePin', d.btnSavePin);
setTxt('pinLockTitle', d.pinLockTitle);
setTxt('pinLockSub', d.pinLockSub);
setTxt('btnUnlockPin', d.btnUnlockPin);
setTxt(
'btnPinSwitchPub',
'← ' + (d.btnActSwitchPub || 'Switch Pub')
);
setTxt(
'setRenamePubTitle',
d.setRenamePubTitle
);
setTxt(
'setRenamePubDesc',
d.setRenamePubDesc
);
setTxt('btnSavePubName', d.btnSavePubName);
setTxt(
'actSwitchPubTitle',
d.actSwitchPubTitle
);
setTxt(
'actSwitchPubDesc',
d.actSwitchPubDesc
);
setTxt('btnSwitchPub', d.btnActSwitchPub);
setTxt(
'actBackupTvTitle',
d.actBackupTvTitle
);
setTxt(
'actBackupTvDesc',
d.actBackupTvDesc
);
setTxt('btnExportWork', d.btnActExport);
setTxt('btnOpenTv', d.btnActOpenTv);
setTxt(
'actDeletePubTitle',
d.actDeletePubTitle
);
setTxt(
'actDeletePubDesc',
d.actDeletePubDesc
);
setTxt('btnDeletePub', d.btnActDeletePub);

if (newPubNameInput) {
newPubNameInput.placeholder =
d.newPubNamePlaceholder || '';
}
if (renamePubInput) {
renamePubInput.placeholder =
d.newPubNamePlaceholder || '';
}
if (newPubSeedInput) {
newPubSeedInput.placeholder =
d.newPubSeedPlaceholder || '';
}
if (betAmountInput && d.betAmtPlaceholder) {
betAmountInput.placeholder =
d.betAmtPlaceholder;
}
if (newTableName && d.newTablePlaceholder) {
newTableName.placeholder =
d.newTablePlaceholder;
}
if (
setNewTableName &&
d.newTablePlaceholder
) {
setNewTableName.placeholder =
d.newTablePlaceholder;
}
if (orderItemInput) {
orderItemInput.placeholder =
d.orderItemPlaceholder || '';
}
if (orderCapsInput) {
orderCapsInput.placeholder =
d.orderCapsPlaceholder || '';
}
if (cashDepositInput) {
cashDepositInput.placeholder =
d.capsInputPlaceholder || '';
}
if (prizeCostInput) {
prizeCostInput.placeholder =
d.prizeCostPlaceholder || '';
}
if (prizeTitleInput) {
prizeTitleInput.placeholder =
d.prizeTitlePlaceholder || '';
}
if (paradeGiftInput) {
paradeGiftInput.placeholder =
d.giftNamePlaceholder || '';
}
if (pinCodeInput) {
pinCodeInput.placeholder =
d.pinInputPlaceholder || '';
}
if (pinUnlockInput) {
pinUnlockInput.placeholder =
d.pinInputPlaceholder || '';
}
if (btnHostLang) {
btnHostLang.innerHTML =
getLangBtnLabel(lang);
}
syncParadeModeUi();
lastPubsSig = '';
lastOrderSig = '';
lastPrizeSig = '';
lastBetsSig = '';
lastTablesSig = '';
lastKnightGridSig = '';
}

// build custom touch selector around select
// avoids native mobile picker blinking
function initCustomSelect(selectEl) {
if (!selectEl || selectEl._custom) return;
selectEl.style.display = 'none';

var wrap = document.createElement('div');
wrap.className = 'customSelectWrap';

var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'customSelectBtn';

var labelSpan =
document.createElement('span');
labelSpan.textContent = 'Select...';
var arrowSpan =
document.createElement('span');
arrowSpan.className = 'customSelectArrow';
arrowSpan.textContent = '▾';

btn.appendChild(labelSpan);
btn.appendChild(arrowSpan);

var menu = document.createElement('div');
menu.className = 'customSelectMenu';

wrap.appendChild(btn);
wrap.appendChild(menu);
selectEl.parentNode.insertBefore(
wrap,
selectEl.nextSibling
);

selectEl._custom = {
wrap: wrap,
btn: btn,
label: labelSpan,
arrow: arrowSpan,
menu: menu,
isOpen: false,
rows: []
};

btn.onclick = function (ev) {
ev.stopPropagation();
var c = selectEl._custom;
var nextOpen = !c.isOpen;
closeAllCustomSelects();
c.isOpen = nextOpen;
c.btn.className = nextOpen
? 'customSelectBtn open'
: 'customSelectBtn';
c.menu.className = nextOpen
? 'customSelectMenu open'
: 'customSelectMenu';
c.arrow.textContent = nextOpen ? '▴' : '▾';
};
}

// close any open custom dropdown menus
// called on outside tap or option pick
function closeAllCustomSelects() {
var list = [selectTable, selectPrize];
for (var i = 0; i < list.length; i++) {
var el = list[i];
if (el && el._custom && el._custom.isOpen) {
el._custom.isOpen = false;
el._custom.btn.className =
'customSelectBtn';
el._custom.menu.className =
'customSelectMenu';
el._custom.arrow.textContent = '▾';
}
}
}

document.addEventListener(
'click',
function () {
closeAllCustomSelects();
}
);

initCustomSelect(selectTable);
initCustomSelect(selectPrize);

// update select options without dom rebuild
// keeps custom mobile menu stable during poll
function syncSelect(selectEl, items) {
if (!selectEl) return;
initCustomSelect(selectEl);

var d = getDict();
var curVal = selectEl.value;
var opts = selectEl.options;
var sameValues =
opts.length === items.length;

if (sameValues) {
for (var k = 0; k < items.length; k++) {
if (
String(opts[k].value) !==
String(items[k].value)
) {
sameValues = false;
break;
}
}
}

if (!sameValues) {
while (selectEl.options.length > 0) {
selectEl.remove(0);
}
for (var n = 0; n < items.length; n++) {
var opt = document.createElement('option');
opt.value = String(items[n].value);
opt.text = items[n].text;
selectEl.add(opt);
}
if (curVal) {
for (var q = 0; q < items.length; q++) {
if (
String(items[q].value) === String(curVal)
) {
selectEl.value = String(curVal);
break;
}
}
}
} else {
for (var m = 0; m < items.length; m++) {
if (opts[m].text !== items[m].text) {
opts[m].text = items[m].text;
}
}
}

var c = selectEl._custom;
var activeVal = String(selectEl.value || '');
var activeText = '';

if (c.rows.length !== items.length) {
c.menu.innerHTML = '';
c.rows = [];
for (var r = 0; r < items.length; r++) {
(function () {
var row = document.createElement('div');
row.className = 'customSelectOpt';
row.onclick = function (ev) {
ev.stopPropagation();
var chosen =
String(row.getAttribute('data-val'));
selectEl.value = chosen;
for (
var u = 0;
u < c.rows.length;
u++
) {
var uVal =
c.rows[u].getAttribute('data-val');
c.rows[u].className =
uVal === chosen
? 'customSelectOpt activeOpt'
: 'customSelectOpt';
}
c.label.textContent = row.textContent;
closeAllCustomSelects();
};
c.menu.appendChild(row);
c.rows.push(row);
})();
}
}

for (var x = 0; x < items.length; x++) {
var it = items[x];
var vStr = String(it.value);
var rowEl = c.rows[x];
if (rowEl.getAttribute('data-val') !== vStr) {
rowEl.setAttribute('data-val', vStr);
}
if (rowEl.textContent !== it.text) {
rowEl.textContent = it.text;
}
var isSel = vStr === activeVal;
var wantCls = isSel
? 'customSelectOpt activeOpt'
: 'customSelectOpt';
if (rowEl.className !== wantCls) {
rowEl.className = wantCls;
}
if (isSel) {
activeText = it.text;
}
}

if (!activeText) {
activeText =
items.length > 0
? items[0].text
: d.chooseOpt || '—';
}
if (c.label.textContent !== activeText) {
c.label.textContent = activeText;
}
}

// send action payload to server api
// posts json and refreshes ui from reply
function sendAction(payload, cb) {
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
var resp =
JSON.parse(xhr.responseText);
if (resp.state) {
saveHostBackup(resp.state);
renderHost(resp.state);
}
if (cb) cb(resp);
} catch (e) {
// skip json error
// next poll will sync
}
}
};
xhr.send(JSON.stringify(payload));
}

// format balance label for host selects
// shows caps or cash currency
function fmtMoney(val, mode) {
var d = getDict();
var v = Math.round(val || 0);
return mode === 'CASH'
? v + (d.curCash || ' $')
: v + (d.curCaps || ' CAPS');
}

// update parade bonus mode tab buttons
// toggles gift text input and hint box
function syncParadeModeUi() {
var d = getDict();
if (draftParadeMode === 'GIFT') {
tabParade20.className =
'btn btnSmallTab';
tabParadeGift.className =
'btn btnSmallTab activeTab';
paradeGiftInputWrap.className =
'inputRow wrapInputRow';
if (paradeModeHintText) {
paradeModeHintText.textContent =
d.setParadeGiftHint || '';
}
} else {
tabParade20.className =
'btn btnSmallTab activeTab';
tabParadeGift.className =
'btn btnSmallTab';
paradeGiftInputWrap.className =
'inputRow wrapInputRow hidden';
if (paradeModeHintText) {
paradeModeHintText.textContent =
d.setParade20Hint || '';
}
}
}

// collect all 8 tournament knights in order
// marks eliminated ones and syncs live odds
function getEightTournamentKnights(s) {
var aliveMap = {};
var aliveList = s.aliveKnights || [];
for (var a = 0; a < aliveList.length; a++) {
aliveMap[aliveList[a].id] = aliveList[a];
}
var result = [];
var seen = {};
var matches = s.matches || [];
for (var m = 0; m < 4; m++) {
var qm = matches[m];
if (!qm) continue;
var pair = [qm.k1, qm.k2];
for (var p = 0; p < 2; p++) {
var kn = pair[p];
if (kn && !seen[kn.id]) {
seen[kn.id] = true;
var liveK = aliveMap[kn.id];
var copy = Object.assign({}, kn);
if (liveK) {
copy.outrightOdds = liveK.outrightOdds;
copy.eliminated = false;
} else {
copy.eliminated = true;
}
result.push(copy);
}
}
}
if (result.length === 0) {
for (var b = 0; b < aliveList.length; b++) {
var ak = Object.assign({}, aliveList[b]);
ak.eliminated = false;
result.push(ak);
}
}
return result;
}

// draw mini mounted knight on card canvas
// shows horse coat shield helm and armor
function drawMiniKnightCardCanvas(
canvasEl,
knight
) {
if (!canvasEl || !window.KnightArt) return;
var ctx = canvasEl.getContext('2d');
var w = canvasEl.width;
var h = canvasEl.height;
ctx.clearRect(0, 0, w, h);
if (!knight) return;
window.KnightArt.drawMountedKnight(
ctx,
54,
67,
0.42,
knight,
0,
'idle'
);
}

// render 2 bout knights or 8 tourney knights
// parade bonus applies only to outright
function renderKnightVisualGrid(
s,
m,
isGiftParade
) {
if (!knightVisualGrid) return;
var d = getDict();
var isParadeBonus =
s.tvScreen === 'PARADE' &&
betMode === 'OUTRIGHT';

function fmtCardOdd(rawOdd) {
var b = parseFloat(rawOdd) || 1.9;
if (!isParadeBonus || isGiftParade) {
return b.toFixed(1);
}
var boosted =
Math.round(b * 1.2 * 10) / 10;
return Math.max(b + 0.2, boosted).toFixed(1);
}

var cardsData = [];
if (betMode === 'MATCH') {
if (m && m.k1 && m.k2) {
cardsData.push({
slotLbl: '#1',
knight: m.k1,
oddsText:
'x' + fmtCardOdd(m.odds1),
eliminated: false
});
cardsData.push({
slotLbl: '#2',
knight: m.k2,
oddsText:
'x' + fmtCardOdd(m.odds2),
eliminated: false
});
}
} else {
var eight = getEightTournamentKnights(s);
for (var i = 0; i < eight.length; i++) {
var tk = eight[i];
cardsData.push({
slotLbl: '#' + (i + 1),
knight: tk,
oddsText: tk.eliminated
? d.knightOutBadge || 'OUT'
: 'x' + fmtCardOdd(tk.outrightOdds),
eliminated: Boolean(tk.eliminated)
});
}
}

// pick default valid knight when switching
var validSel = false;
for (var v = 0; v < cardsData.length; v++) {
if (
cardsData[v].knight.id ===
selectedKnightId &&
!cardsData[v].eliminated
) {
validSel = true;
break;
}
}
if (!validSel) {
selectedKnightId = '';
for (var f = 0; f < cardsData.length; f++) {
if (!cardsData[f].eliminated) {
selectedKnightId =
cardsData[f].knight.id;
break;
}
}
}

var sigParts = [
betMode,
selectedKnightId,
isParadeBonus ? 'P' : 'N',
isGiftParade ? 'G' : '20',
s.lang || 'en'
];
for (var sIdx = 0; sIdx < cardsData.length; sIdx++) {
var cd = cardsData[sIdx];
sigParts.push(
cd.knight.id +
':' +
cd.knight.name +
':' +
cd.oddsText +
':' +
(cd.eliminated ? '0' : '1')
);
}
var sig = sigParts.join('|');
if (sig === lastKnightGridSig) return;
lastKnightGridSig = sig;

knightVisualGrid.innerHTML = '';
for (var c = 0; c < cardsData.length; c++) {
(function (item) {
var k = item.knight;
var isSel =
k.id === selectedKnightId &&
!item.eliminated;
var card = document.createElement('div');
var cls = 'knightCardBtn';
if (isSel) cls += ' selectedKnight';
if (item.eliminated) {
cls += ' eliminatedKnight';
}
card.className = cls;

var armorHex = window.KnightArt
? window.KnightArt.getArmor(k.colorIdx)
.main
: '#1D4ED8';
var strip = document.createElement('div');
strip.className = 'knightColorStrip';
strip.style.background = armorHex;

var numSpan =
document.createElement('span');
numSpan.textContent = item.slotLbl;
var colSpan =
document.createElement('span');
colSpan.textContent = getArmorColorWord(
k.colorIdx
);
strip.appendChild(numSpan);
strip.appendChild(colSpan);

var cvs =
document.createElement('canvas');
cvs.width = 124;
cvs.height = 82;
cvs.className = 'knightMiniCanvas';
drawMiniKnightCardCanvas(cvs, k);

var nameDiv =
document.createElement('div');
nameDiv.className = 'knightCardName';
nameDiv.textContent = k.name;

var oddsDiv =
document.createElement('div');
oddsDiv.className = 'knightCardOdds';
var bonusSuffix = '';
if (isParadeBonus && !item.eliminated) {
bonusSuffix = isGiftParade
? ' 🎁'
: ' (+20%)';
}
oddsDiv.textContent =
item.oddsText + bonusSuffix;

card.appendChild(strip);
card.appendChild(cvs);
card.appendChild(nameDiv);
card.appendChild(oddsDiv);

card.onclick = function () {
if (item.eliminated) {
showBetFeedback(
getBetErrorText(
'KNIGHT_ELIMINATED',
lastState
),
true
);
return;
}
selectedKnightId = k.id;
showBetFeedback('', false);
if (lastState) renderHost(lastState);
};

knightVisualGrid.appendChild(card);
})(cardsData[c]);
}
}

// render saved pubs list on selector view
// shows only add pub button when empty
function renderPubSelector(s) {
var d = getDict();
var pubs = s.pubsSummary || [];
var sig =
JSON.stringify(pubs) +
'_' +
(s.lang || 'en');

if (pubs.length === 0) {
savedPubsList.innerHTML = '';
exportSelectWrap.className = 'hidden';
lastPubsSig = sig;
return;
}

exportSelectWrap.className = '';
if (sig === lastPubsSig) return;
lastPubsSig = sig;

savedPubsList.innerHTML = '';
for (var i = 0; i < pubs.length; i++) {
(function (pub) {
var row = document.createElement('div');
row.className = 'pubItemRow';

var info = document.createElement('div');
var title = document.createElement('div');
title.className = 'pubItemTitle';
title.textContent = pub.name;

var sub = document.createElement('div');
sub.className = 'pubItemSub';
sub.textContent =
d.pubBadge +
pub.pubSeed +
' · ' +
d.tourNo +
(pub.tournamentNumber || 1);

info.appendChild(title);
info.appendChild(sub);

var openBtn =
document.createElement('button');
openBtn.type = 'button';
openBtn.className = 'btn btnBlue';
openBtn.textContent =
d.btnSelectPub || 'OPEN';
openBtn.onclick = function () {
isSettingsOpen = false;
sendAction({
type: 'select_pub',
pubId: pub.id
});
};

row.appendChild(info);
row.appendChild(openBtn);
savedPubsList.appendChild(row);
})(pubs[i]);
}
}

// render active bets list with refund button
// lets host cancel mistaken bet immediately
function renderActiveBetsSection(s) {
if (!hostActiveBetsList) return;
var d = getDict();
var bets = s.activeBets || [];
var sig =
JSON.stringify(bets) +
'_' +
s.gameMode +
'_' +
(s.lang || 'en');
if (sig === lastBetsSig) return;
lastBetsSig = sig;

hostActiveBetsList.innerHTML = '';
if (bets.length === 0) {
var empty = document.createElement('div');
empty.className = 'emptyHintBox';
empty.textContent = d.noActiveBets || '';
hostActiveBetsList.appendChild(empty);
return;
}

for (var i = 0; i < bets.length; i++) {
(function (b, idx) {
var row = document.createElement('div');
row.className = 'cfgRow';
var tag =
b.betType === 'OUTRIGHT'
? d.tagTour
: d.tagBout;
var gExtra = b.paradeGift
? ' + ' + b.paradeGift
: '';
var txt = document.createElement('span');
txt.innerHTML =
'<b>' +
b.tableName +
'</b>: ' +
fmtMoney(b.amount, s.gameMode) +
' → ' +
b.knightName +
' (x' +
Number(b.odds).toFixed(1) +
') ' +
tag +
gExtra;

var cancelBtn =
document.createElement('button');
cancelBtn.type = 'button';
cancelBtn.className = 'cfgRefundBtn';
cancelBtn.textContent =
d.btnCancelBet || '✕ REFUND';
cancelBtn.onclick = function () {
sendAction({
type: 'cancel_bet',
betId: b.id || 0,
betIndex: idx
});
};

row.appendChild(txt);
row.appendChild(cancelBtn);
hostActiveBetsList.appendChild(row);
})(bets[i], i);
}
}

// build single table row with custom input
// lets host add or deduct any caps amount
function buildTableControlRow(
tb,
s,
keyPrefix
) {
var row = document.createElement('div');
row.className = 'cfgRow cfgRowWrap';

var txt = document.createElement('span');
txt.innerHTML =
tb.name +
' — <b>' +
fmtMoney(tb.balance, s.gameMode) +
'</b>';

var actWrap =
document.createElement('div');
actWrap.className = 'rowActions';

var inputKey = keyPrefix + '_' + tb.id;
var amtInput =
document.createElement('input');
amtInput.type = 'number';
amtInput.min = '1';
amtInput.className = 'cfgCustomAmtInput';
amtInput.value =
tableCustomInputs[inputKey] || '1';
amtInput.oninput = function () {
tableCustomInputs[inputKey] =
amtInput.value;
};

var minusBtn =
document.createElement('button');
minusBtn.type = 'button';
minusBtn.className = 'cfgStepBtn';
minusBtn.textContent = '−';
minusBtn.onclick = function () {
var n =
parseInt(amtInput.value, 10) || 1;
if (n <= 0) n = 1;
sendAction({
type: 'adjust_table',
tableId: tb.id,
delta: -n
});
};

var plusBtn =
document.createElement('button');
plusBtn.type = 'button';
plusBtn.className =
'cfgStepBtn stepAddBtn';
plusBtn.textContent = '+';
plusBtn.onclick = function () {
var n =
parseInt(amtInput.value, 10) || 1;
if (n <= 0) n = 1;
sendAction({
type: 'adjust_table',
tableId: tb.id,
delta: n
});
};

var delBtn =
document.createElement('button');
delBtn.type = 'button';
delBtn.className = 'cfgDelBtn';
delBtn.textContent = '✕';
bindTwoTap(
delBtn,
function () {
sendAction({
type: 'delete_table',
tableId: tb.id
});
},
true
);

actWrap.appendChild(amtInput);
actWrap.appendChild(minusBtn);
actWrap.appendChild(plusBtn);
actWrap.appendChild(delBtn);

row.appendChild(txt);
row.appendChild(actWrap);
return row;
}

// render tables list in game and settings
// lets host enter any caps amount per table
function renderTablesManageSection(s) {
var d = getDict();
var tables = s.tables || [];
var sig =
JSON.stringify(tables) +
'_' +
s.gameMode +
'_' +
(s.lang || 'en');
if (sig === lastTablesSig) return;
lastTablesSig = sig;

var targets = [
{ el: hostTablesList, pfx: 'live' },
{ el: settingsTablesList, pfx: 'set' }
];
for (var t = 0; t < targets.length; t++) {
var box = targets[t].el;
var pfx = targets[t].pfx;
if (!box) continue;
box.innerHTML = '';
if (tables.length === 0) {
var empty =
document.createElement('div');
empty.className = 'emptyHintBox';
empty.textContent =
d.noTablesHost || '';
box.appendChild(empty);
continue;
}
for (var i = 0; i < tables.length; i++) {
box.appendChild(
buildTableControlRow(
tables[i],
s,
pfx
)
);
}
}
}

// render purchase bonus grid and quick buttons
// lets host credit caps or delete items
function renderOrderGridSection(s) {
var d = getDict();
var items = s.orderGrid || [];
var sig =
JSON.stringify(items) +
'_' +
s.gameMode +
'_' +
(s.lang || 'en');
if (sig === lastOrderSig) return;
lastOrderSig = sig;

pubOrderQuickBtns.innerHTML = '';
orderGridList.innerHTML = '';

if (items.length === 0) {
var hint = document.createElement('div');
hint.className = 'emptyHintBox';
hint.textContent =
d.noOrderItemsHint || '';
pubOrderQuickBtns.appendChild(hint);
return;
}

for (var i = 0; i < items.length; i++) {
(function (item) {
var qBtn =
document.createElement('button');
qBtn.type = 'button';
qBtn.className = 'quickOrderBtn';
qBtn.textContent =
'+' +
item.title +
' (+' +
item.caps +
(d.curCaps || ' CAPS') +
')';
qBtn.onclick = function () {
var tId = parseInt(selectTable.value, 10);
if (!tId) return;
sendAction({
type: 'add_credit',
tableId: tId,
delta: item.caps
});
};
pubOrderQuickBtns.appendChild(qBtn);

var row = document.createElement('div');
row.className = 'cfgRow';
var txt = document.createElement('span');
txt.innerHTML =
item.title +
' → <b>+' +
item.caps +
(d.curCaps || ' CAPS') +
'</b>';

var del = document.createElement('button');
del.type = 'button';
del.className = 'cfgDelBtn';
del.textContent = '✕';
del.onclick = function () {
sendAction({
type: 'delete_order_item',
itemId: item.id
});
};

row.appendChild(txt);
row.appendChild(del);
orderGridList.appendChild(row);
})(items[i]);
}
}

// render prize showcase grid in host panel
// lets host add or remove pub prizes
function renderPrizeGridSection(s) {
var d = getDict();
var prizes = s.prizes || [];
var sig =
JSON.stringify(prizes) +
'_' +
(s.lang || 'en');
if (sig === lastPrizeSig) return;
lastPrizeSig = sig;

prizeGridList.innerHTML = '';
for (var i = 0; i < prizes.length; i++) {
(function (pr) {
var row = document.createElement('div');
row.className = 'cfgRow';
var txt = document.createElement('span');
txt.innerHTML =
'<b>' +
pr.cost +
(d.curCaps || ' CAPS') +
'</b> → ' +
pr.title;

var del = document.createElement('button');
del.type = 'button';
del.className = 'cfgDelBtn';
del.textContent = '✕';
del.onclick = function () {
sendAction({
type: 'delete_prize_item',
prizeId: pr.id
});
};

row.appendChild(txt);
row.appendChild(del);
prizeGridList.appendChild(row);
})(prizes[i]);
}
}

// switch between lock game and settings
// gates host panel when pub pin is enabled
function syncActivePubSubView() {
if (!lastState || lastState.noPubSelected) {
if (pinLockView) {
pinLockView.className = 'hidden';
}
pubWorkView.className = 'hidden';
pubSettingsView.className = 'hidden';
updateStickyTablePin();
return;
}
if (
lastState.pinEnabled &&
!isPubPinUnlocked(lastState.pubId)
) {
if (pinLockView) {
pinLockView.className = '';
}
pubWorkView.className = 'hidden';
pubSettingsView.className = 'hidden';
updateStickyTablePin();
return;
}
if (pinLockView) {
pinLockView.className = 'hidden';
}
if (isSettingsOpen) {
pubWorkView.className = 'hidden';
pubSettingsView.className = '';
} else {
pubWorkView.className = '';
pubSettingsView.className = 'hidden';
}
updateStickyTablePin();
}

// pin active table bar to top on scroll
// reserves slot height so layout stays steady
function updateStickyTablePin() {
if (!stickyTableSlot || !stickyTableBar) {
return;
}
if (
!lastState ||
lastState.noPubSelected ||
isSettingsOpen ||
(lastState.pinEnabled &&
!isPubPinUnlocked(lastState.pubId))
) {
stickyTableBar.className =
'stickyTableBar';
stickyTableSlot.style.height = 'auto';
return;
}
var rect =
stickyTableSlot.getBoundingClientRect();
if (rect.top <= 6) {
var h = stickyTableBar.offsetHeight;
if (h > 0) {
stickyTableSlot.style.height = h + 'px';
}
if (
stickyTableBar.className.indexOf(
'fixedTopBar'
) === -1
) {
stickyTableBar.className =
'stickyTableBar fixedTopBar';
}
} else {
stickyTableBar.className =
'stickyTableBar';
stickyTableSlot.style.height = 'auto';
}
}

window.addEventListener(
'scroll',
updateStickyTablePin,
{ passive: true }
);
window.addEventListener(
'resize',
updateStickyTablePin
);

// update host controller dom from state
// switches between pub selector and work view
function renderHost(s) {
if (!s) return;
lastState = s;

var lang = s.lang || 'en';
if (lang !== lastLangSeen) {
lastLangSeen = lang;
applyHostTranslations(lang);
}

var d = getDict();

if (tvNetBarUrl) {
var netUrl =
s.lanUrl &&
s.lanUrl.indexOf('127.0.0.1') === -1
? s.lanUrl
: window.location.origin;
tvNetBarUrl.textContent = netUrl;
}

if (s.noPubSelected || !s.pubId) {
isSettingsOpen = false;
pubSelectView.className = '';
if (pinLockView) {
pinLockView.className = 'hidden';
}
pubWorkView.className = 'hidden';
pubSettingsView.className = 'hidden';
lastPubIdSeen = '';
renderPubSelector(s);
return;
}

pubSelectView.className = 'hidden';
syncActivePubSubView();

if (s.pubId !== lastPubIdSeen) {
lastPubIdSeen = s.pubId;
draftParadeMode =
s.paradeBonusType || 'PERCENT_20';
paradeGiftInput.value =
s.paradeGiftText || '';
if (renamePubInput) {
renamePubInput.value = s.pubName || '';
}
if (pinCodeInput) {
pinCodeInput.value = '';
}
if (pinConfigMsg) {
pinConfigMsg.className = 'cfgMsg hidden';
}
if (pinUnlockMsg) {
pinUnlockMsg.className = 'cfgMsg hidden';
}
paradeBonusMsg.className =
'cfgMsg hidden';
syncParadeModeUi();
}

var hdrEl =
document.getElementById('hostHeaderTitle');
if (hdrEl) {
hdrEl.textContent =
s.pubName || d.hostHeader;
}
var lockHdrEl = document.getElementById(
'pinLockPubTitle'
);
if (lockHdrEl) {
lockHdrEl.textContent =
(s.pubName || d.hostHeader) +
' · PIN';
}
var setHdrEl = document.getElementById(
'settingsHeaderTitle'
);
if (setHdrEl) {
setHdrEl.textContent =
(d.settingsScreenTitle || 'SETTINGS') +
': ' +
(s.pubName || '');
}

tourBadge.innerHTML =
d.tourNo +
s.tournamentNumber +
' (' +
d.pubBadge +
s.pubSeed +
')';
screenText.innerHTML =
s.tvScreen === 'WAITING'
? d.scrWaiting
: s.tvScreen === 'PARADE'
? d.scrParade
: s.tvScreen === 'COMBAT'
? d.scrCombat
: d.scrBracket;
modeText.innerHTML =
s.gameMode === 'CASH'
? d.modeCashShort
: d.modePubShort;

if (btnTvMute) {
btnTvMute.innerHTML = s.tvMuted
? d.tvSoundOff
: d.tvSoundOn;
btnTvMute.className = s.tvMuted
? 'btn btnRed btnSoundSmall'
: 'btn btnDark btnSoundSmall';
}

// sync economy segmented switch in settings
var isCash = s.gameMode === 'CASH';
if (tabModePub && tabModeCash) {
tabModePub.className = isCash
? 'btn btnSmallTab'
: 'btn btnSmallTab activeTab';
tabModeCash.className = isCash
? 'btn btnSmallTab activeTab'
: 'btn btnSmallTab';
}

// sync live bets switch pill in settings
if (btnLiveToggle) {
btnLiveToggle.className = s.allowLiveBets
? 'switchPill switchOn'
: 'switchPill';
}
if (liveSwitchTxt) {
liveSwitchTxt.textContent = s.allowLiveBets
? d.switchOn || 'ON'
: d.switchOff || 'OFF';
}

// show grey bracket button only for live bets
// toggles between bracket and active arena
if (btnSwitchScreen) {
if (s.allowLiveBets) {
btnSwitchScreen.className =
'btn btnDark btnFull';
var canReturnArena =
s.tvScreen === 'BRACKET' &&
s.combat &&
s.combat.active &&
!s.combat.finished;
btnSwitchScreen.innerHTML = canReturnArena
? d.btnBackToArena ||
d.btnSwitchScreen
: d.btnSwitchScreen;
} else {
btnSwitchScreen.className =
'btn btnDark btnFull hidden';
}
}

// show new tourney on game view only at end
// always accessible inside settings screen
if (btnNewTourLive) {
var isTourDone =
s.tournamentStatus === 'FINISHED';
if (isTourDone) {
if (!isConfirmWaiting(btnNewTourLive)) {
btnNewTourLive.className =
'btn btnPurple btnFull';
btnNewTourLive.innerHTML = d.btnNewTour;
}
} else {
clearTwoTapState(btnNewTourLive);
btnNewTourLive.className =
'btn btnPurple btnFull hidden';
}
}

var isGiftParade =
s.paradeBonusType === 'GIFT' &&
Boolean(s.paradeGiftText);

var m =
s.matches &&
s.matches[s.currentMatchIndex];
if (s.tvScreen === 'WAITING') {
boutTitle.innerHTML = d.waitingHostTitle;
boutSub.innerHTML = d.waitingHostSub;
} else if (
s.tvScreen === 'PARADE' &&
s.parade
) {
if (s.parade.finished) {
boutTitle.innerHTML = isGiftParade
? d.paradeDoneHostTitleGift +
s.paradeGiftText.toUpperCase() +
')'
: d.paradeDoneHostTitle;
boutSub.innerHTML = d.paradeDoneHostSub;
} else {
var pk =
s.aliveKnights &&
s.aliveKnights[s.parade.currentIndex];
boutTitle.innerHTML =
d.paradeHostTitle +
(s.parade.currentIndex + 1) +
'/8): ' +
(pk ? pk.name : '');
boutSub.innerHTML = d.paradeHostSub;
}
} else if (m && m.k1 && m.k2) {
boutTitle.innerHTML =
m.stageName +
': ' +
m.k1.name +
' vs ' +
m.k2.name;
var cWait0 =
s.combat &&
s.combat.stepElapsedMs !== undefined
? s.combat.stepElapsedMs / 1000
: 99;
var cRev0 =
s.combat && s.combat.mode === 'JOUST'
? 3.25
: 4.75;
if (
s.tvScreen === 'COMBAT' &&
s.combat &&
s.combat.finished &&
cWait0 >= cRev0
) {
var winK =
s.combat.winnerSide === 1
? m.k1
: m.k2;
boutSub.innerHTML =
d.winnerHost +
winK.name +
d.finishToBracket;
} else {
boutSub.innerHTML =
(s.statusText || '') +
' · ' +
d.k1Short +
Number(m.odds1).toFixed(1) +
' | ' +
d.k2Short +
Number(m.odds2).toFixed(1);
}
} else if (s.champion) {
boutTitle.innerHTML =
d.champHost +
s.champion.secretTitle +
' (' +
s.champion.name +
')';
boutSub.innerHTML = d.tourDoneHost;
}

// update primary start or step button text
// uses server stepElapsedMs so tab wake works
var cWait =
s.combat &&
s.combat.stepElapsedMs !== undefined
? s.combat.stepElapsedMs / 1000
: 99;
var cReveal =
s.combat && s.combat.mode === 'JOUST'
? 3.25
: 4.75;

if (s.tvScreen === 'WAITING') {
btnStartStep.innerHTML =
'🎺 ' + d.btnStartParadeCmd;
} else if (s.tvScreen === 'PARADE') {
if (s.parade && s.parade.finished) {
btnStartStep.innerHTML = d.btnCloseBonus;
} else {
btnStartStep.innerHTML = d.btnSkipParade;
}
} else if (
s.tvScreen === 'COMBAT' &&
s.combat
) {
if (cWait < cReveal) {
btnStartStep.innerHTML =
d.btnPhaseRunning;
} else if (s.combat.finished) {
btnStartStep.innerHTML = d.btnToBracket;
} else if (s.combat.pausedForBets) {
btnStartStep.innerHTML = d.btnNextPhase;
} else {
btnStartStep.innerHTML =
d.btnPhaseRunning;
}
} else if (
s.combat &&
s.combat.active &&
!s.combat.finished
) {
btnStartStep.innerHTML = d.btnNextPhase;
} else {
btnStartStep.innerHTML = d.btnStartBout;
}

// sync pin lock switch pill in settings
if (btnPinToggle) {
btnPinToggle.className = s.pinEnabled
? 'switchPill switchOn'
: 'switchPill';
}
if (pinSwitchTxt) {
pinSwitchTxt.textContent = s.pinEnabled
? d.switchOn || 'ON'
: d.switchOff || 'OFF';
}

// update economy labels by mode
// keeps custom caps row visible in both modes
document.getElementById(
'economySectionTitle'
).innerHTML = isCash
? d.econCashTitle
: d.econPubTitle;
var credLblEl =
document.getElementById('creditLabel');
if (credLblEl) {
credLblEl.innerHTML = d.creditPubLbl;
credLblEl.style.display = isCash
? 'none'
: 'block';
}
if (customCapsLbl) {
customCapsLbl.innerHTML = isCash
? d.creditCashLbl
: d.customCapsPubLbl;
}

pubOrderQuickBtns.className = isCash
? 'quickOrderWrap hidden'
: 'quickOrderWrap';
cashDepositRow.className =
'inputRow wrapInputRow';
document.getElementById(
'prizeRedeemBlock'
).style.display = isCash
? 'none'
: 'block';

renderActiveBetsSection(s);
renderTablesManageSection(s);
renderOrderGridSection(s);
renderPrizeGridSection(s);

// populate tables dropdown preserving value
// formats each table with current balance
var tItems = [];
var tables = s.tables || [];
for (var i = 0; i < tables.length; i++) {
var tb = tables[i];
tItems.push({
value: tb.id,
text:
tb.name +
' (' +
fmtMoney(tb.balance, s.gameMode) +
')'
});
}
syncSelect(selectTable, tItems);

// render visual knight cards with portraits
renderKnightVisualGrid(s, m, isGiftParade);

// populate pub prizes dropdown
// lists configured prizes and caps cost
var pItems = [];
var prizes = s.prizes || [];
for (var p = 0; p < prizes.length; p++) {
var pr = prizes[p];
pItems.push({
value: pr.id,
text:
pr.title +
' (' +
pr.cost +
d.curCaps +
')'
});
}
syncSelect(selectPrize, pItems);
}

// download complete multi-pub json backup
// protects pub history across reinstalls
function exportAllDataJson() {
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/export', true);
xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
var jsonStr = '';
if (xhr.status === 200 && xhr.responseText) {
jsonStr = xhr.responseText;
} else if (
lastState &&
lastState.storeBackup
) {
jsonStr = JSON.stringify(
lastState.storeBackup,
null,
2
);
}
if (!jsonStr) return;
var blob = new Blob([jsonStr], {
type: 'application/json;charset=utf-8'
});
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
var dt = new Date()
.toISOString()
.slice(0, 10);
a.href = url;
a.download =
'knight_tournament_backup_' +
dt +
'.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () {
URL.revokeObjectURL(url);
}, 1500);
}
};
xhr.send();
}

var HOST_BACKUP_KEY = 'kt_active_backup_v5';
var hostTriedRestore = false;
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

// save latest state snapshot on host device
// keeps multi-pub backup on phone storage
function saveHostBackup(s) {
if (!s) return;
try {
window.localStorage.setItem(
HOST_BACKUP_KEY,
JSON.stringify(s)
);
} catch (e) {}
}

// load saved state snapshot from phone storage
// hydrates host UI immediately on startup
function loadHostBackup() {
try {
var raw = window.localStorage.getItem(
HOST_BACKUP_KEY
);
if (!raw) return null;
return JSON.parse(raw);
} catch (e) {
return null;
}
}

// restore multi-pub backup if server reset
// syncs phone storage back to server state
function checkHostRecovery(srvState) {
if (hostTriedRestore || !srvState) {
return false;
}
var cached = loadHostBackup();
if (!cached) return false;

if (
srvState.noPubSelected &&
(srvState.pubsSummary || []).length === 0 &&
cached.storeBackup &&
Array.isArray(cached.storeBackup.pubs) &&
cached.storeBackup.pubs.length > 0
) {
hostTriedRestore = true;
sendAction({
type: 'restore_snapshot',
snapshot: cached
});
return true;
}
return false;
}

// poll server state periodically
// syncs presenter phone and local backup
function pollHost() {
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/state', true);
xhr.onreadystatechange = function () {
if (
xhr.readyState === 4 &&
xhr.status === 200
) {
try {
var s = JSON.parse(xhr.responseText);
if (!checkHostRecovery(s)) {
saveHostBackup(s);
renderHost(s);
}
} catch (e) {
// skip json error
// next poll will retry
}
}
};
xhr.send();
}

// bind navigation between game and settings
// keeps dangerous controls off live screen
var btnOpenSettings = document.getElementById(
'btnOpenSettings'
);
if (btnOpenSettings) {
btnOpenSettings.onclick = function () {
isSettingsOpen = true;
if (renamePubInput && lastState) {
renamePubInput.value =
lastState.pubName || '';
}
syncActivePubSubView();
window.scrollTo(0, 0);
};
}

var btnBackToGame = document.getElementById(
'btnBackToGame'
);
if (btnBackToGame) {
btnBackToGame.onclick = function () {
isSettingsOpen = false;
syncActivePubSubView();
window.scrollTo(0, 0);
};
}

// bind pub creation and selection controls
// opens form when add pub button tapped
document.getElementById(
'btnShowAddPub'
).onclick = function () {
isCreatingPub = true;
addPubBtnWrap.className =
'card formCard hidden';
createPubFormCard.className =
'card formCard';
newPubNameInput.focus();
};

document.getElementById(
'btnCancelCreatePub'
).onclick = function () {
isCreatingPub = false;
addPubBtnWrap.className = 'card formCard';
createPubFormCard.className =
'card formCard hidden';
};

document.getElementById(
'btnConfirmCreatePub'
).onclick = function () {
var pName = newPubNameInput.value.trim();
if (!pName) {
newPubNameInput.focus();
return;
}
var pSeed = newPubSeedInput.value.trim();
isCreatingPub = false;
isSettingsOpen = false;
addPubBtnWrap.className = 'card formCard';
createPubFormCard.className =
'card formCard hidden';
newPubNameInput.value = '';
newPubSeedInput.value = '';
sendAction({
type: 'create_pub',
name: pName,
seed: pSeed
});
};

document.getElementById(
'btnSwitchPub'
).onclick = function () {
isSettingsOpen = false;
sendAction({ type: 'unselect_pub' });
};

document.getElementById(
'btnSavePubName'
).onclick = function () {
if (!renamePubInput) return;
var nextName = renamePubInput.value.trim();
if (!nextName) return;
sendAction({
type: 'rename_pub',
name: nextName
});
};

document.getElementById(
'btnExportSelect'
).onclick = exportAllDataJson;
document.getElementById(
'btnExportWork'
).onclick = exportAllDataJson;

// bind button click listeners on phone
// sends presenter commands to server
btnStartStep.onclick = function () {
sendAction({ type: 'combat_step' });
};

if (btnHostLang) {
btnHostLang.onclick = function () {
sendAction({ type: 'cycle_lang' });
};
}

if (btnTvMute) {
btnTvMute.onclick = function () {
sendAction({ type: 'toggle_tv_mute' });
};
}

if (btnSwitchScreen) {
btnSwitchScreen.onclick = function () {
sendAction({ type: 'toggle_screen' });
};
}

// bind two-tap confirmation on reset buttons
// protects active pub tournament from mistap
bindTwoTap(
document.getElementById('btnReplayParade'),
function () {
isSettingsOpen = false;
sendAction({ type: 'restart_parade' });
},
false
);

bindTwoTap(
document.getElementById('btnNewTour'),
function () {
hostTriedRestore = true;
isSettingsOpen = false;
sendAction({ type: 'new_tournament' });
},
false
);

bindTwoTap(
btnNewTourLive,
function () {
hostTriedRestore = true;
sendAction({ type: 'new_tournament' });
},
false
);

bindTwoTap(
document.getElementById('btnClearTables'),
function () {
hostTriedRestore = true;
sendAction({ type: 'clear_tables' });
},
false
);

bindTwoTap(
document.getElementById('btnNewSeed'),
function () {
hostTriedRestore = true;
isSettingsOpen = false;
sendAction({ type: 'new_pub_seed' });
},
false
);

bindTwoTap(
document.getElementById('btnDeletePub'),
function () {
hostTriedRestore = true;
isSettingsOpen = false;
sendAction({ type: 'delete_pub' });
},
false
);

if (tabModePub) {
tabModePub.onclick = function () {
sendAction({
type: 'toggle_mode',
mode: 'PUB'
});
};
}
if (tabModeCash) {
tabModeCash.onclick = function () {
sendAction({
type: 'toggle_mode',
mode: 'CASH'
});
};
}

btnLiveToggle.onclick = function () {
sendAction({ type: 'toggle_live_bets' });
};

tabBetMatch.onclick = function () {
betMode = 'MATCH';
tabBetMatch.className =
'btn btnSmallTab activeTab';
tabBetOutright.className =
'btn btnSmallTab';
showBetFeedback('', false);
renderHost(lastState);
};

tabBetOutright.onclick = function () {
betMode = 'OUTRIGHT';
tabBetOutright.className =
'btn btnSmallTab activeTab';
tabBetMatch.className = 'btn btnSmallTab';
showBetFeedback('', false);
renderHost(lastState);
};

// bind quick bet amount buttons
// fills amount input with chip value
var chips =
document.querySelectorAll('.btnChip');
for (var c = 0; c < chips.length; c++) {
chips[c].onclick = function () {
betAmountInput.value =
this.getAttribute('data-amt');
showBetFeedback('', false);
};
}

// validate bet and show clear error or ok
// checks table balance phase and knight
document.getElementById(
'btnPlaceBet'
).onclick = function () {
if (!lastState) return;
var tables = lastState.tables || [];
if (tables.length === 0) {
showBetFeedback(
getBetErrorText('NO_TABLES', lastState),
true
);
return;
}
var tId = parseInt(selectTable.value, 10);
var tableObj = null;
for (var i = 0; i < tables.length; i++) {
if (tables[i].id === tId) {
tableObj = tables[i];
break;
}
}
if (!tableObj) {
showBetFeedback(
getBetErrorText(
'NO_TABLE_SELECTED',
lastState
),
true
);
return;
}
if (lastState.tvScreen === 'WAITING') {
showBetFeedback(
getBetErrorText(
'WAITING_SCREEN',
lastState
),
true
);
return;
}
if (
lastState.tournamentStatus === 'FINISHED'
) {
showBetFeedback(
getBetErrorText(
'TOUR_FINISHED',
lastState
),
true
);
return;
}
var curM =
lastState.matches &&
lastState.matches[
lastState.currentMatchIndex
];
var cSt = lastState.combat || {};
var waitSec =
cSt.stepElapsedMs !== undefined
? cSt.stepElapsedMs / 1000
: 99;
var revSec =
cSt.mode === 'JOUST' ? 3.25 : 4.75;

if (
betMode === 'MATCH' &&
(!curM ||
curM.status === 'DONE' ||
(lastState.tvScreen === 'COMBAT' &&
cSt.finished))
) {
showBetFeedback(
getBetErrorText('BOUT_DONE', lastState),
true
);
return;
}
if (
lastState.tvScreen === 'COMBAT' &&
!lastState.allowLiveBets
) {
showBetFeedback(
getBetErrorText(
'LIVE_BETS_OFF',
lastState
),
true
);
return;
}
if (
lastState.tvScreen === 'COMBAT' &&
(!cSt.pausedForBets || waitSec < revSec)
) {
showBetFeedback(
getBetErrorText(
'PASS_IN_PROGRESS',
lastState
),
true
);
return;
}
if (!selectedKnightId) {
showBetFeedback(
getBetErrorText(
'NO_KNIGHT_SELECTED',
lastState
),
true
);
return;
}
var amt = parseInt(
betAmountInput.value,
10
);
if (!amt || amt <= 0) {
showBetFeedback(
getBetErrorText('BAD_AMOUNT', lastState),
true
);
return;
}
if (tableObj.balance < amt) {
showBetFeedback(
getBetErrorText(
'LOW_BALANCE',
lastState,
tableObj,
amt
),
true
);
return;
}

sendAction(
{
type: 'place_bet',
tableId: tId,
knightId: selectedKnightId,
amount: amt,
betType: betMode
},
function (resp) {
if (resp && resp.ok === false) {
showBetFeedback(
getBetErrorText(
resp.errorCode,
lastState,
tableObj,
amt
),
true
);
} else {
var d = getDict();
showBetFeedback(
(d.betPlacedOk || '✓ ') +
tableObj.name +
' (' +
fmtMoney(amt, lastState.gameMode) +
')',
false
);
}
}
);
};

// bind manual caps add and deduct buttons
// works in both pub mode and cash mode
document.getElementById(
'btnAddCashDeposit'
).onclick = function () {
var tId = parseInt(selectTable.value, 10);
var delta =
parseInt(cashDepositInput.value, 10) || 0;
if (!tId || delta <= 0) return;
sendAction({
type: 'add_credit',
tableId: tId,
delta: delta
});
};

var btnSubCashDeposit =
document.getElementById(
'btnSubCashDeposit'
);
if (btnSubCashDeposit) {
btnSubCashDeposit.onclick = function () {
var tId = parseInt(selectTable.value, 10);
var delta =
parseInt(cashDepositInput.value, 10) || 0;
if (!tId || delta <= 0) return;
sendAction({
type: 'adjust_table',
tableId: tId,
delta: -delta
});
};
}

document.getElementById(
'btnAddOrderItem'
).onclick = function () {
var title = orderItemInput.value.trim();
var caps =
parseInt(orderCapsInput.value, 10) || 0;
if (!title || caps <= 0) return;
sendAction({
type: 'add_order_item',
title: title,
caps: caps
});
orderItemInput.value = '';
orderCapsInput.value = '';
};

document.getElementById(
'btnAddPrizeItem'
).onclick = function () {
var cost =
parseInt(prizeCostInput.value, 10) || 0;
var title = prizeTitleInput.value.trim();
if (!title || cost <= 0) return;
sendAction({
type: 'add_prize_item',
cost: cost,
title: title
});
prizeCostInput.value = '';
prizeTitleInput.value = '';
};

tabParade20.onclick = function () {
draftParadeMode = 'PERCENT_20';
paradeBonusMsg.className = 'cfgMsg hidden';
syncParadeModeUi();
};

tabParadeGift.onclick = function () {
draftParadeMode = 'GIFT';
paradeBonusMsg.className = 'cfgMsg hidden';
syncParadeModeUi();
};

document.getElementById(
'btnSaveParadeBonus'
).onclick = function () {
var d = getDict();
var gTxt = paradeGiftInput.value.trim();
if (draftParadeMode === 'GIFT' && !gTxt) {
paradeBonusMsg.className = 'cfgMsg errMsg';
paradeBonusMsg.textContent =
d.giftRequiredErr || '';
paradeGiftInput.focus();
return;
}
sendAction(
{
type: 'save_parade_bonus',
bonusType: draftParadeMode,
giftText: gTxt
},
function (resp) {
if (resp && resp.ok) {
paradeBonusMsg.className =
'cfgMsg okMsg';
paradeBonusMsg.textContent =
d.paradeBonusSaved || '';
} else {
paradeBonusMsg.className =
'cfgMsg errMsg';
paradeBonusMsg.textContent =
d.giftRequiredErr || '';
}
}
);
};

// bind pin lock toggle and save in settings
// keeps pin off by default until host sets it
if (btnPinToggle) {
btnPinToggle.onclick = function () {
if (!lastState) return;
var d = getDict();
var wantOn = !lastState.pinEnabled;
var codeVal = pinCodeInput
? pinCodeInput.value.trim()
: '';
if (
wantOn &&
!codeVal &&
!lastState.hasPinCode
) {
if (pinConfigMsg) {
pinConfigMsg.className = 'cfgMsg errMsg';
pinConfigMsg.textContent =
d.pinRequiredErr || '';
}
if (pinCodeInput) pinCodeInput.focus();
return;
}
markPubPinUnlocked(lastState.pubId);
sendAction(
{
type: 'save_pin_settings',
pinEnabled: wantOn,
pinCode: codeVal
},
function (resp) {
if (!pinConfigMsg) return;
if (resp && resp.ok) {
pinConfigMsg.className = 'cfgMsg okMsg';
pinConfigMsg.textContent =
d.pinSavedMsg || '';
} else {
pinConfigMsg.className =
'cfgMsg errMsg';
pinConfigMsg.textContent =
d.pinRequiredErr || '';
}
}
);
};
}

var btnSavePin =
document.getElementById('btnSavePin');
if (btnSavePin) {
btnSavePin.onclick = function () {
if (!lastState) return;
var d = getDict();
var codeVal = pinCodeInput
? pinCodeInput.value.trim()
: '';
if (!codeVal) {
if (pinConfigMsg) {
pinConfigMsg.className = 'cfgMsg errMsg';
pinConfigMsg.textContent =
d.pinRequiredErr || '';
}
if (pinCodeInput) pinCodeInput.focus();
return;
}
markPubPinUnlocked(lastState.pubId);
sendAction(
{
type: 'save_pin_settings',
pinEnabled: true,
pinCode: codeVal
},
function (resp) {
if (pinCodeInput) {
pinCodeInput.value = '';
}
if (!pinConfigMsg) return;
if (resp && resp.ok) {
pinConfigMsg.className = 'cfgMsg okMsg';
pinConfigMsg.textContent =
d.pinSavedMsg || '';
} else {
pinConfigMsg.className =
'cfgMsg errMsg';
pinConfigMsg.textContent =
d.pinRequiredErr || '';
}
}
);
};
}

var btnUnlockPin =
document.getElementById('btnUnlockPin');
if (btnUnlockPin) {
btnUnlockPin.onclick = function () {
if (!lastState) return;
var d = getDict();
var tryCode = pinUnlockInput
? pinUnlockInput.value.trim()
: '';
sendAction(
{
type: 'verify_pin',
pin: tryCode
},
function (resp) {
if (resp && resp.ok) {
if (pinUnlockInput) {
pinUnlockInput.value = '';
}
if (pinUnlockMsg) {
pinUnlockMsg.className =
'cfgMsg hidden';
}
markPubPinUnlocked(lastState.pubId);
renderHost(lastState);
} else if (pinUnlockMsg) {
pinUnlockMsg.className = 'cfgMsg errMsg';
pinUnlockMsg.textContent =
d.pinWrongErr || 'Wrong PIN!';
}
}
);
};
}

var btnPinSwitchPub =
document.getElementById(
'btnPinSwitchPub'
);
if (btnPinSwitchPub) {
btnPinSwitchPub.onclick = function () {
isSettingsOpen = false;
sendAction({ type: 'unselect_pub' });
};
}

document.getElementById(
'btnClaimPrize'
).onclick = function () {
var tId = parseInt(selectTable.value, 10);
var pId = parseInt(selectPrize.value, 10);
if (!tId || !pId) return;
sendAction({
type: 'claim_prize',
tableId: tId,
prizeId: pId
});
};

document.getElementById(
'btnAddTable'
).onclick = function () {
var name = newTableName.value.trim();
if (!name) return;
sendAction({
type: 'add_table',
name: name
});
newTableName.value = '';
};

var btnSetAddTable =
document.getElementById(
'btnSetAddTable'
);
if (btnSetAddTable) {
btnSetAddTable.onclick = function () {
if (!setNewTableName) return;
var name = setNewTableName.value.trim();
if (!name) return;
sendAction({
type: 'add_table',
name: name
});
setNewTableName.value = '';
};
}

// hydrate host immediately from local backup
var initCache = loadHostBackup();
if (initCache) {
renderHost(initCache);
}

// poll immediately when android app resumes
document.addEventListener(
'visibilitychange',
function () {
if (!document.hidden) pollHost();
}
);
document.addEventListener(
'resume',
function () {
pollHost();
}
);

pollHost();
setInterval(pollHost, 700);
})();
