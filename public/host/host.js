// mobile presenter host controller
// syncs multi-pub state and settings
(function () {
'use strict';

var betMode = 'MATCH';
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

var tvNetBarUrl =
document.getElementById('tvNetBarUrl');
var pubSelectView =
document.getElementById('pubSelectView');
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
var btnHostLang =
document.getElementById('btnHostLang');
var btnTvMute =
document.getElementById('btnTvMute');
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
var selectKnight =
document.getElementById('selectKnight');
var selectPrize =
document.getElementById('selectPrize');
var betAmountInput =
document.getElementById('betAmountInput');
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

var pubOrderQuickBtns =
document.getElementById(
'pubOrderQuickBtns'
);
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
: d.tapAgainConfirm ||
'TAP AGAIN TO CONFIRM!';
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
setTxt('btnExportWork', d.btnExportData);
setTxt('btnSwitchPub', d.btnSwitchPub);
setTxt(
'btnOpenSettings',
d.btnOpenSettings
);
setTxt('btnBackToGame', d.btnBackToGame);

setTxt('hostTvScreenLbl', d.tvScreenLbl);
setTxt('hostModeLbl', d.modeLbl);
setTxt('secCtrlTitle', d.ctrlSection);
setTxt('btnNextMatch', d.btnNextMatch);
setTxt(
'btnReplayParade',
d.btnReplayParade
);
setTxt(
'btnSwitchScreen',
d.btnSwitchScreen
);
setTxt('btnNewTourLive', d.btnNewTour);
setTxt('secBetTitle', d.betSection);
setTxt('tabBetMatch', d.tabMatch);
setTxt('tabBetOutright', d.tabOutright);
setTxt('lblWhoBets', d.whoBetsLbl);
setTxt('lblWhichKnight', d.whichKnightLbl);
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
d.secModeLiveTitle
);
setTxt(
'secOrderGridTitle',
d.orderGridTitle
);
setTxt(
'btnAddOrderItem',
d.btnAddOrderItem
);
setTxt(
'btnAddCashDeposit',
d.btnAddCash
);
setTxt(
'secPrizeGridTitle',
d.prizeGridTitle
);
setTxt(
'btnAddPrizeItem',
d.btnAddPrizeItem
);
setTxt(
'secParadeBonusTitle',
d.paradeBonusSec
);
setTxt('tabParade20', d.tabBonus20);
setTxt('tabParadeGift', d.tabBonusGift);
setTxt(
'btnSaveParadeBonus',
d.btnSaveParadeBonus
);

setTxt(
'secTourCtrlTitle',
d.secTourCtrlTitle
);
setTxt(
'secPubManageTitle',
d.secPubManageTitle
);
setTxt('lblRenamePub', d.renamePubLbl);
setTxt('btnSavePubName', d.btnSavePubName);
setTxt('btnDeletePub', d.btnDeletePub);
setTxt('btnClearTables', d.btnClearTables);
setTxt('btnToggleMode', d.btnToggleMode);
setTxt('btnNewTour', d.btnNewTour);
setTxt('btnNewSeed', d.btnNewSeed);
setTxt('btnOpenTv', d.btnOpenTv);

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
d.cashTopupPlaceholder || '';
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
if (btnHostLang) {
btnHostLang.innerHTML =
getLangBtnLabel(lang);
}
lastPubsSig = '';
lastOrderSig = '';
lastPrizeSig = '';
lastBetsSig = '';
lastTablesSig = '';
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
var list = [
selectTable,
selectKnight,
selectPrize
];
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
initCustomSelect(selectKnight);
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
// toggles gift text input visibility
function syncParadeModeUi() {
if (draftParadeMode === 'GIFT') {
tabParade20.className =
'btn btnSmallTab';
tabParadeGift.className =
'btn btnSmallTab activeTab';
paradeGiftInputWrap.className =
'inputRow';
} else {
tabParade20.className =
'btn btnSmallTab activeTab';
tabParadeGift.className =
'btn btnSmallTab';
paradeGiftInputWrap.className =
'inputRow hidden';
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

// render tables list with -1 +1 and delete
// lets host fix balances or remove table
function renderTablesManageSection(s) {
if (!hostTablesList) return;
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

hostTablesList.innerHTML = '';
if (tables.length === 0) {
var empty = document.createElement('div');
empty.className = 'emptyHintBox';
empty.textContent = d.noTablesHost || '';
hostTablesList.appendChild(empty);
return;
}

for (var i = 0; i < tables.length; i++) {
(function (tb) {
var row = document.createElement('div');
row.className = 'cfgRow';

var txt = document.createElement('span');
txt.innerHTML =
tb.name +
' — <b>' +
fmtMoney(tb.balance, s.gameMode) +
'</b>';

var actWrap =
document.createElement('div');
actWrap.className = 'rowActions';

var minusBtn =
document.createElement('button');
minusBtn.type = 'button';
minusBtn.className = 'cfgStepBtn';
minusBtn.textContent = '-1';
minusBtn.onclick = function () {
sendAction({
type: 'adjust_table',
tableId: tb.id,
delta: -1
});
};

var plusBtn =
document.createElement('button');
plusBtn.type = 'button';
plusBtn.className = 'cfgStepBtn';
plusBtn.textContent = '+1';
plusBtn.onclick = function () {
sendAction({
type: 'adjust_table',
tableId: tb.id,
delta: 1
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

actWrap.appendChild(minusBtn);
actWrap.appendChild(plusBtn);
actWrap.appendChild(delBtn);

row.appendChild(txt);
row.appendChild(actWrap);
hostTablesList.appendChild(row);
})(tables[i]);
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

// switch between live game and pub settings
// hides settings controls during live play
function syncActivePubSubView() {
if (!lastState || lastState.noPubSelected) {
pubWorkView.className = 'hidden';
pubSettingsView.className = 'hidden';
return;
}
if (isSettingsOpen) {
pubWorkView.className = 'hidden';
pubSettingsView.className = '';
} else {
pubWorkView.className = '';
pubSettingsView.className = 'hidden';
}
}

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

btnLiveToggle.innerHTML = s.allowLiveBets
? d.liveBtnOn
: d.liveBtnOff;

// show new tourney on game view only at end
// always accessible inside settings screen
if (btnNewTourLive) {
var isTourDone =
s.tournamentStatus === 'FINISHED';
if (isTourDone) {
if (!isConfirmWaiting(btnNewTourLive)) {
btnNewTourLive.className =
'btn btnPurple';
btnNewTourLive.innerHTML = d.btnNewTour;
}
} else {
clearTwoTapState(btnNewTourLive);
btnNewTourLive.className =
'btn btnPurple hidden';
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
} else {
btnStartStep.innerHTML = d.btnStartBout;
}

// update economy labels by mode
// switches between pub caps and cash bank
var isCash = s.gameMode === 'CASH';
document.getElementById(
'economySectionTitle'
).innerHTML = isCash
? d.econCashTitle
: d.econPubTitle;
document.getElementById(
'creditLabel'
).innerHTML = isCash
? d.creditCashLbl
: d.creditPubLbl;

pubOrderQuickBtns.className = isCash
? 'quickOrderWrap hidden'
: 'quickOrderWrap';
cashDepositRow.className = isCash
? 'inputRow'
: 'inputRow hidden';
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

// format knight odd with optional +20% bonus
// keeps base odd when gift mode is active
function fmtHostOdd(rawOdd, isParade) {
var b = parseFloat(rawOdd) || 1.9;
if (!isParade || isGiftParade) {
return b.toFixed(1);
}
var boosted =
Math.round(b * 1.2 * 10) / 10;
return Math.max(b + 0.2, boosted).toFixed(1);
}

// populate knights dropdown by bet mode
// adds +20% or gift tag during parade
var kItems = [];
var isParade = s.tvScreen === 'PARADE';
var bonusLabel = '';
if (isParade) {
bonusLabel = isGiftParade
? d.bonusTagGift +
s.paradeGiftText +
']'
: d.bonusTag20;
}

if (betMode === 'MATCH' && m && m.k1 && m.k2) {
kItems.push({
value: m.k1.id,
text:
m.k1.name +
d.boutOpt +
fmtHostOdd(m.odds1, isParade) +
')' +
bonusLabel
});
kItems.push({
value: m.k2.id,
text:
m.k2.name +
d.boutOpt +
fmtHostOdd(m.odds2, isParade) +
')' +
bonusLabel
});
} else {
var alive = s.aliveKnights || [];
for (var j = 0; j < alive.length; j++) {
var ak = alive[j];
kItems.push({
value: ak.id,
text:
ak.name +
d.tourOpt +
fmtHostOdd(ak.outrightOdds, isParade) +
')' +
bonusLabel
});
}
}
syncSelect(selectKnight, kItems);

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

document.getElementById(
'btnNextMatch'
).onclick = function () {
sendAction({ type: 'next_match' });
};

document.getElementById(
'btnSwitchScreen'
).onclick = function () {
sendAction({ type: 'toggle_screen' });
};

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

btnLiveToggle.onclick = function () {
sendAction({ type: 'toggle_live_bets' });
};

tabBetMatch.onclick = function () {
betMode = 'MATCH';
tabBetMatch.className =
'btn btnSmallTab activeTab';
tabBetOutright.className =
'btn btnSmallTab';
renderHost(lastState);
};

tabBetOutright.onclick = function () {
betMode = 'OUTRIGHT';
tabBetOutright.className =
'btn btnSmallTab activeTab';
tabBetMatch.className = 'btn btnSmallTab';
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
};
}

document.getElementById(
'btnPlaceBet'
).onclick = function () {
var tId = parseInt(selectTable.value, 10);
var kId = selectKnight.value;
var amt = parseInt(
betAmountInput.value,
10
);
if (!tId || !kId || !amt || amt <= 0) {
return;
}
sendAction({
type: 'place_bet',
tableId: tId,
knightId: kId,
amount: amt,
betType: betMode
});
};

// bind cash deposit and grid item buttons
// adds items prizes and tables to pub
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

document.getElementById(
'btnToggleMode'
).onclick = function () {
sendAction({ type: 'toggle_mode' });
};

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
