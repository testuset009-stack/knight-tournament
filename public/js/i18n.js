// shared en uk ru localization strings
// used by both tv screen and host phone
(function (global) {
'use strict';

var STRINGS = {
en: {
tvTitle: 'Knight Tournament — TV Screen',
hostTitle: 'Host Panel — Knight Tournament',
brandTitle: 'KNIGHT TOURNAMENT',
pubBadge: 'PUB #',
tourNo: 'TOURNAMENT #',
paradePhase: 'KNIGHT PARADE',
modePubFull:
'MODE: PUB (CAPS & PRIZES)',
modeCashFull:
'MODE: CASH (BETTING POOL)',
modePubShort: 'PUB (CAPS)',
modeCashShort: 'CASH',
restartParade: 'RESTART PARADE',
hostPanelBtn: 'HOST PANEL (/HOST)',
soundOn: 'SOUND: ON',
soundOff: 'SOUND: OFF',
curCaps: ' CAPS',
curCash: ' $',
paradeDoneKicker:
'PARADE FINISHED · FIRST BETTING ROUND WITH +20% ODDS BONUS!',
paradeDoneTitle:
'All 8 knights are in formation with their weapons!',
paradeDoneSub:
'Place your opening bets with the +20% bonus before moving to the Bracket!',
paradeStepKicker:
'PARADE OF CONTENDERS & WEAPON DRAFT (',
of8: ' OF 8)',
winsLbl: 'Wins: ',
lossesLbl: 'Losses: ',
cupsLbl: 'Cups: ',
tourOddsLbl: 'Tourney: x',
tourWinOddsLbl: 'Tourney Win: x',
ShieldLbl: 'Shield: ',
ridesHorse: 'Rides horse: ',
gallopsToRack:
' · Gallops to the weapon rack...',
favWepNote: ' (FAVORITE WEAPON! ★)',
randWepNote: ' (Random pick from rack)',
picksFromRack: 'Takes from rack: ',
andJoinsLine: ' and joins the line!',
pickingWeapon: 'Picking weapon...',
contenderNo: 'CONTENDER #',
bonusBet20: 'BONUS BET +20%',
qfWest: 'QUARTERFINALS (WEST)',
qfEast: 'QUARTERFINALS (EAST)',
sfHeader: 'SEMIFINALS',
grandFinalHeader:
'TOURNAMENT GRAND FINAL',
qfShort: 'QUARTERFINAL',
sfShort: 'SEMIFINAL',
finalShort: 'CUP FINAL',
stWait: 'WAITING',
stDone: 'FINISHED',
stLive: 'CURRENT BOUT',
waitPair: 'Waiting for pair...',
matchNo: 'MATCH #',
liveBetsOn: 'LIVE IN-BOUT BETS: ON',
preBetsOnly: 'PRE-BOUT BETS ONLY',
winInBout: 'BOUT VICTORY',
totalBets: 'Total bets: ',
waitHostBets:
'Host is taking table bets...',
tagTour: '[TOURNEY]',
tagBout: '[BOUT]',
badgeBout: 'BOUT x',
badgeTour: 'TOUR x',
h2hLbl: 'HEAD-TO-HEAD: ',
champKicker:
'THE CHAMPION REMOVES HIS HELM! TRUE TITLE REVEALED:',
champLore:
'In the next tournament he will ride out again as a simple Sir!',
shIntact: 'Shield intact',
shCracked: 'Shield cracked!',
shShattered: 'Shield shattered!',
fatTired: 'Breathing heavily',
fatFresh: 'Full of strength',
joustPassOf3: 'JOUST PASS ',
boutTitle: 'BOUT',
boutInProgress: 'Bout in progress...',
windRight: ' · Wind right →',
windLeft: ' · Wind left ←',
windCalm: ' · Calm wind',
joustReady: 'Riders take positions...',
joustCharge:
'Charging down the lists...',
joustClash: 'Clash of lances!',
meleeClash:
'Heavy exchange of blows and shields...',
k1Short: 'K1: x',
k2Short: 'K2: x',
tablesCashTitle:
'PLAYERS & TABLES (CASH BANK):',
tablesPubTitle:
'PUB TABLES (CAPS BALANCE FROM ORDERS):',
payoutsTitle:
'RECENT TOTALIZATOR PAYOUTS:',
waitPayouts: 'Waiting for bet settlement',
prizesTitle:
'PUB PRIZE SHOWCASE (REDEEM CAPS):',
pubBannerWord: 'PUB',

hostHeader: 'HOST PANEL',
tvScreenLbl: 'TV SCREEN: ',
modeLbl: 'MODE: ',
scrParade: 'KNIGHT PARADE',
scrCombat: 'COMBAT ARENA',
scrBracket: 'BRACKET',
ctrlSection:
'SCREEN & BOUT CONTROLS',
btnNextMatch: 'NEXT MATCH',
btnReplayParade: 'RESTART PARADE',
liveBtnOn: 'LIVE BETS: ON',
liveBtnOff: 'LIVE BETS: OFF',
btnSwitchScreen:
'SHOW TOURNAMENT BRACKET',
btnBackToArena:
'RETURN TO COMBAT ARENA',
betSection:
'PLACE BETS (BOUT OR TOURNAMENT)',
tabMatch: 'ON CURRENT BOUT',
tabOutright: 'ON TOURNEY CHAMPION',
whoBetsLbl: 'WHO BETS (TABLE / PLAYER):',
whichKnightLbl: 'BET ON WHICH KNIGHT:',
betAmtLbl: 'BET AMOUNT:',
betAmtPlaceholder: 'Bet amount',
btnPlaceBet: 'PLACE BET',
econCashTitle:
'TOTALIZATOR CASHIER: DEPOSITS',
econPubTitle:
'PUB CASHIER: ORDERS & PRIZES',
creditCashLbl:
'TOP UP PLAYER / TABLE BANK:',
creditPubLbl:
'AWARD CAPS FOR BAR ORDER:',
addDrinkPub: '+DRINK (+1)',
addFoodPub: '+FOOD (+3)',
addSetPub: '+SET (+5)',
redeemLbl:
'AWARD BAR PRIZE TO SELECTED TABLE:',
btnClaimPrize: 'AWARD PRIZE',
addTableLbl:
'ADD NEW TABLE OR PLAYER:',
newTablePlaceholder: 'Table or player name',
btnAddTable: '+ TABLE',
settingsSection:
'PUB & TOURNAMENT SETTINGS',
btnToggleMode: 'MODE: PUB / CASH',
btnNewTour: 'NEW TOURNEY (8 OF 24)',
btnNewSeed: 'CHANGE PUB SEED',
btnOpenTv: 'OPEN TV SCREEN',
chooseOpt: 'Select...',
paradeDoneHostTitle:
'PARADE DONE: BONUS BETTING ROUND (+20% ODDS!)',
paradeDoneHostSub:
'Take opening bets with bonus and open the Tournament Bracket',
paradeHostTitle: 'PARADE (',
paradeHostSub:
'Knights take turns picking weapons from the rack...',
winnerHost: 'WINNER: ',
finishToBracket:
' · Finish bout to return to bracket',
champHost: 'CHAMPION: ',
tourDoneHost:
'Tournament finished! Start a new one.',
btnCloseBonus:
'CLOSE BONUS BETS -> TO BRACKET',
btnSkipParade:
'SKIP PARADE -> BONUS BETS',
btnPhaseRunning:
'COMBAT PHASE IN PROGRESS...',
btnToBracket:
'TO BRACKET (FINISH BOUT)',
btnNextPhase:
'CONTINUE BOUT (NEXT PHASE)',
btnStartBout:
'CLOSE BETS & START BOUT',
bonusTag20: ' [BONUS +20%]',
bonusTagGift: ' [GIFT: ',
boutOpt: ' — Bout (x',
tourOpt: ' — Tourney (x',
waitingSub:
'Waiting for the host to select or create a pub on the controller...',
waitingNetLbl:
'CONNECT TV OR HOST AT ADDRESS:',
noTablesTv: 'No tables added yet',
noPrizesTv: 'No prizes configured yet',
paradeDoneKickerGift:
'PARADE FINISHED · FIRST BETTING ROUND WITH PARADE GIFT: ',
paradeDoneSubGift:
'Winning bets placed now also receive gift: ',
bonusGiftCard: 'WIN GIFT: ',
tvNetBarLbl: 'TV URL: ',
selectPubTitle: 'SELECT OR CREATE PUB',
btnAddPubInit: '+ ADD PUB',
newPubNamePlaceholder: 'Pub name',
newPubSeedPlaceholder: 'Seed (optional)',
btnCreatePub: 'CREATE PUB',
btnCancelPub: 'CANCEL',
btnSelectPub: 'OPEN',
btnSwitchPub: 'SWITCH PUB',
btnExportData: 'EXPORT ALL DATA (JSON)',
orderGridTitle:
'PURCHASE BONUS GRID (ITEM / CAPS)',
orderItemPlaceholder: 'Item name',
orderCapsPlaceholder: 'Caps',
btnAddOrderItem: '+ ITEM',
noOrderItemsHint:
'Configure purchase items below to award caps',
cashTopupPlaceholder: 'Cash amount',
btnAddCash: '+ DEPOSIT',
prizeGridTitle:
'PRIZE GRID (CAPS COST / PRIZE)',
prizeCostPlaceholder: 'Caps',
prizeTitlePlaceholder: 'Prize name',
btnAddPrizeItem: '+ PRIZE',
paradeBonusSec:
'PARADE BET BONUS MODE',
tabBonus20: '+20% CAPS ODDS',
tabBonusGift: 'GIFT ON WIN',
giftNamePlaceholder:
'Enter gift name (required for Gift mode)',
btnSaveParadeBonus: 'SAVE PARADE BONUS',
giftRequiredErr:
'Enter a gift name before saving Gift mode!',
paradeBonusSaved: 'Parade bonus saved!',
paradeDoneHostTitleGift:
'PARADE DONE: BONUS BETS (GIFT: ',
scrWaiting: 'WAITING SCREEN',
waitingReadySub:
' — Waiting for the host to start the Knights Parade...',
waitingHostTitle:
'TV IS ON WAITING SCREEN',
waitingHostSub:
'Configure tables, bonuses and prizes, then press Start Knights Parade',
btnStartParadeCmd:
'START KNIGHTS PARADE',
btnOpenSettings: '⚙ SETTINGS',
btnBackToGame: '← BACK TO GAME',
settingsScreenTitle: 'PUB SETTINGS',
tvSoundOn: '🔊 TV SOUND: ON',
tvSoundOff: '🔇 TV SOUND: OFF',
activeBetsLbl:
'ACTIVE BETS (✕ CANCEL & REFUND):',
noActiveBets:
'No active bets right now',
btnCancelBet: '✕ REFUND',
tablesManageLbl:
'TABLES & BALANCE (-1 / +1 / ✕):',
noTablesHost: 'No tables added yet',
btnClearTables:
'CLEAR ALL TABLES (NEW NIGHT)',
secModeLiveTitle:
'BETTING MODE & LIVE BETS',
secTourCtrlTitle:
'TOURNAMENT & EVENING RESET',
secPubManageTitle:
'PUB PROFILE & SYSTEM',
renamePubLbl: 'RENAME CURRENT PUB:',
btnSavePubName: 'SAVE NAME',
btnDeletePub: 'DELETE THIS PUB',
tapAgainConfirm:
'TAP AGAIN TO CONFIRM!',
tapConfirmShort: 'CONFIRM?',
stickyTableLbl:
'ACTIVE TABLE / PLAYER:',
whichKnightGridLbl:
'TAP KNIGHT TO BET ON:',
knightOutBadge: 'ELIMINATED',
colorRed: 'Red',
colorBlue: 'Blue',
colorGreen: 'Green',
colorPurple: 'Purple',
colorSteel: 'Steel',
colorCopper: 'Copper',
errNoTables:
'No tables yet! Add a table in the Pub Cashier below first.',
errNoTableSel:
'Select a table or player in the top bar first!',
errWaitingScreen:
'Betting is not open yet! Start the Knights Parade first.',
errTourFinished:
'Tournament is already finished! Start a new tournament.',
errBoutDone:
'This bout is already finished! Advance to the next match.',
errLiveBetsOff:
'Bout is underway and Live Bets are turned OFF in Pub Settings!',
errPassRunning:
'Wait for the current clash animation to pause before placing a live bet!',
errNoKnightSel:
'Tap a knight card above to select who to bet on!',
errKnightElim:
'This knight is already eliminated from the tournament!',
errBadAmount:
'Enter a bet amount of at least 1!',
errLowBalance:
'Not enough balance on this table! Have: ',
errNeedAmt: ', bet: ',
betPlacedOk: '✓ Bet accepted: ',
setEconCardTitle:
'ECONOMY & BETTING RULES',
setGameModeTitle: 'Venue Economy Mode',
setGameModeDesc:
'Choose how guests place bets. In PUB mode, guests earn bottle caps for bar orders and exchange won caps for bar prizes. In CASH mode, tables bet from a cash deposit bank.',
tabModePub: 'PUB (CAPS & PRIZES)',
tabModeCash: 'CASH (DEPOSIT BANK)',
setLiveBetsTitle:
'Live In-Bout Betting',
setLiveBetsDesc:
'When enabled, combat pauses after each lance pass so the host can accept extra live bets with updated odds (accounting for cracked shields and fatigue).',
switchOn: 'ON',
switchOff: 'OFF',
setParadeBonusTitle:
'Parade Early-Bet Bonus',
setParadeBonusDesc:
'Rewards guests who place Tournament Champion bets during the Knights Parade (does not apply to 1st bout bets).',
setParade20Hint:
'Tournament Champion bets placed during the Parade automatically receive +20% boosted payout odds.',
setParadeGiftHint:
'Winning Tournament Champion bets placed during the Parade receive this bar gift in addition to their cap payout:',
setOrderCardTitle:
'BAR ORDER BONUS GRID',
setOrderCardDesc:
'Add menu items and how many caps they grant. These appear as 1-tap buttons in the Pub Cashier on the game screen.',
setPrizeCardTitle:
'PUB PRIZE SHOWCASE',
setPrizeCardDesc:
'Add bar rewards and their cost in caps. Shown on the bottom of the TV screen and in the Pub Cashier.',
setTourCardTitle:
'TOURNAMENT & EVENING ACTIONS',
actRestartParadeTitle:
'Restart Knights Parade',
actRestartParadeDesc:
'Rewinds the TV screen back to the opening Knights Parade of the current tournament. Tables and bets are kept.',
btnActRestartParade: 'Restart Parade',
actNewTourTitle:
'New Tournament (8 of 24)',
actNewTourDesc:
'Draws 8 contenders from the pub’s 24-knight pool (champion & finalist stay to defend) and starts a new bracket. Table balances are kept.',
btnActNewTour: 'New Tourney',
actClearTablesTitle:
'Clear All Tables (New Night)',
actClearTablesDesc:
'Removes all tables and active bets to start a fresh evening. Knights’ win history and bar items stay intact.',
btnActClearTables: 'Clear Tables',
actNewSeedTitle:
'Generate New 24-Knight Pool (Seed)',
actNewSeedDesc:
'Replaces all 24 knights of this pub with a new random roster and resets all knight win/title records to zero.',
btnActNewSeed: 'New Seed',
setPubCardTitle:
'PUB PROFILE & SYSTEM',
setRenamePubTitle: 'Pub Display Name',
setRenamePubDesc:
'Shown in the TV header banner and at the top of the host controller.',
actSwitchPubTitle: 'Switch Active Pub',
actSwitchPubDesc:
'Return to the pub selection screen to open another venue or create a new pub.',
btnActSwitchPub: 'Switch Pub',
actBackupTvTitle:
'Backup Data & TV View',
actBackupTvDesc:
'Download a complete JSON backup of all pubs to your phone or open the TV screen in this browser.',
btnActExport: 'Export JSON',
btnActOpenTv: 'Open TV',
actDeletePubTitle: 'Delete This Pub',
actDeletePubDesc:
'Permanently deletes this pub, its 24 knights, and all its settings from the device.',
btnActDeletePub: 'Delete Pub',
tvBtnFullscreen: '⛶ FULLSCREEN',
tvBtnFullscreenOn: '⛶ FULLSCREEN: ON',
tvBtnSound: '🔊 SOUND',
tvBtnSoundOn: '🔊 SOUND: ON',
tvBtnSoundOff: '🔇 SOUND: OFF',
customCapsPubLbl:
'MANUAL CAPS FOR SELECTED TABLE:',
capsInputPlaceholder: 'Caps amount',
btnAddCapsCustom: '+ ADD',
btnSubCapsCustom: '- DEDUCT',
secSetTablesTitle:
'TABLES & CAPS BALANCE',
setTablesCardDesc:
'Enter any custom amount of caps (or cash) to add or deduct for any table, or add and remove tables.',
setPinTitle: 'Host Panel PIN Lock',
setPinDesc:
'Disabled by default. When enabled, opening the host panel on a new device requires entering your PIN code.',
pinInputPlaceholder:
'Enter PIN (e.g. 1234)',
btnSavePin: 'SAVE PIN',
pinSavedMsg: '✓ PIN settings saved!',
pinRequiredErr:
'Enter a PIN code before turning PIN lock ON!',
pinLockTitle: 'HOST PANEL LOCKED',
pinLockSub:
'Enter the PIN code for this pub to continue:',
btnUnlockPin: 'UNLOCK HOST PANEL',
pinWrongErr:
'Wrong PIN code! Try again.'
},

uk: {
tvTitle: 'Лицарський Турнір — Екран ТБ',
hostTitle:
'Пульт Ведучого — Лицарський Турнір',
brandTitle: 'ЛИЦАРСЬКИЙ ТУРНІР',
pubBadge: 'ПАБ #',
tourNo: 'ТУРНІР №',
paradePhase: 'ПАРАД ЛИЦАРІВ',
modePubFull:
'РЕЖИМ: ПАБ (КРИШКИ ТА ПРИЗИ)',
modeCashFull:
'РЕЖИМ: НА ГРОШІ (БАНК)',
modePubShort: 'ПАБ (КРИШКИ)',
modeCashShort: 'НА ГРОШІ',
restartParade: 'ПАРАД З ПОЧАТКУ',
hostPanelBtn: 'ПУЛЬТ ВЕДУЧОГО (/HOST)',
soundOn: 'ЗВУК: УВІМК',
soundOff: 'ЗВУК: ВИМК',
curCaps: ' КР',
curCash: ' ₴',
paradeDoneKicker:
'ПАРАД ЗАВЕРШЕНО · ПЕРШИЙ РАУНД СТАВОК З БОНУСОМ +20% ДО КОЕФІЦІЄНТІВ!',
paradeDoneTitle:
'Усі 8 лицарів у строю та обрали зброю!',
paradeDoneSub:
'Робіть перші ставки з підвищеним бонусом до переходу до Турнірної Сітки!',
paradeStepKicker:
'ПАРАД УЧАСНИКІВ ТА ВИБІР ЗБРОЇ (',
of8: ' ІЗ 8)',
winsLbl: 'Перемог: ',
lossesLbl: 'Поразок: ',
cupsLbl: 'Кубків: ',
tourOddsLbl: 'Турнір: x',
tourWinOddsLbl: 'Перемога в турнірі: x',
ShieldLbl: 'Щит: ',
ridesHorse: 'Виїжджає на коні: ',
gallopsToRack:
' · Скаче до збройової стійки...',
favWepNote: ' (ЙОГО УЛЮБЛЕНА ЗБРОЯ! ★)',
randWepNote:
' (Випадковий вибір зі стійки)',
picksFromRack: 'Бере зі стійки: ',
andJoinsLine: ' і стає в стрій!',
pickingWeapon: 'Обирає зброю...',
contenderNo: 'УЧАСНИК #',
bonusBet20: 'БОНУС СТАВКА +20%',
qfWest: '1/4 ФІНАЛУ (ЗАХІД)',
qfEast: '1/4 ФІНАЛУ (СХІД)',
sfHeader: '1/2 ФІНАЛУ',
grandFinalHeader:
'ГРАНД-ФІНАЛ ТУРНІРУ',
qfShort: '1/4 ФІНАЛУ',
sfShort: '1/2 ФІНАЛУ',
finalShort: 'ФІНАЛ КУБКА',
stWait: 'ОЧІКУВАННЯ',
stDone: 'ЗАВЕРШЕНО',
stLive: 'ПОТОЧНИЙ БІЙ',
waitPair: 'Очікування пари...',
matchNo: 'МАТЧ #',
liveBetsOn: 'LIVE-СТАВКИ В БОЮ: УВІМК',
preBetsOnly: 'СТАВКИ ДО ПОЧАТКУ БОЮ',
winInBout: 'ПЕРЕМОГА В БОЮ',
totalBets: 'Прийнято ставок: ',
waitHostBets:
'Ведучий приймає ставки столів...',
tagTour: '[ТУРНІР]',
tagBout: '[БІЙ]',
badgeBout: 'БІЙ x',
badgeTour: 'ТУР x',
h2hLbl: 'ОСОБИСТИЙ РАХУНОК: ',
champKicker:
'ЧЕМПІОН ЗНІМАЄ ШОЛОМ! СПРАВЖНІЙ ТИТУЛ РОЗКРИТО:',
champLore:
'У наступному турнірі він знову вийде як простий Сер!',
shIntact: 'Щит цілий',
shCracked: 'Щит тріснув!',
shShattered: 'Щит розбитий у друзки!',
fatTired: 'Важко дихає',
fatFresh: 'Сповнений сил',
joustPassOf3: 'КІННА ЗШИБКА ',
boutTitle: 'ПОЄДИНОК',
boutInProgress: 'Бій у розпалі...',
windRight: ' · Вітер вправо →',
windLeft: ' · Вітер вліво ←',
windCalm: ' · Штиль',
joustReady: 'Вершники напоготові...',
joustCharge:
'Розгін по ристалищу...',
joustClash: 'Зшибка списів!',
meleeClash:
'Важкий обмін ударами зі щитами...',
k1Short: 'К1: x',
k2Short: 'К2: x',
tablesCashTitle:
'ГРАВЦІ ТА СТОЛИ (БАНК У КАСІ):',
tablesPubTitle:
'СТОЛИ ПАБУ (БАЛАНС КРИШОК ЗА ЗАМОВЛЕННЯ):',
payoutsTitle:
'ОСТАННІ ВИПЛАТИ ТОТАЛІЗАТОРА:',
waitPayouts:
'Очікування розрахунку ставок',
prizesTitle:
'ВІТРИНА ПРИЗІВ ПАБУ (ОБМІН КРИШОК):',
pubBannerWord: 'ПАБ',

hostHeader: 'ПУЛЬТ ВЕДУЧОГО',
tvScreenLbl: 'ЕКРАН ТБ: ',
modeLbl: 'РЕЖИМ: ',
scrParade: 'ПАРАД ЛИЦАРІВ',
scrCombat: 'АРЕНА БОЮ',
scrBracket: 'СІТКА ТУРНІРУ',
ctrlSection:
'КЕРУВАННЯ ЕКРАНОМ ТА ПОЄДИНКОМ',
btnNextMatch: 'НАСТУПНИЙ МАТЧ',
btnReplayParade: 'ПАРАД З ПОЧАТКУ',
liveBtnOn: 'LIVE В БОЮ: УВІМК',
liveBtnOff: 'LIVE В БОЮ: ВИМК',
btnSwitchScreen:
'ПОКАЗАТИ ТУРНІРНУ СІТКУ',
btnBackToArena:
'ПОВЕРНУТИСЯ ДО АРЕНИ БОЮ',
betSection:
'ПРИЙОМ СТАВОК (НА БІЙ АБО ТУРНІР)',
tabMatch: 'НА ПОТОЧНИЙ БІЙ',
tabOutright: 'НА ЧЕМПІОНА ТУРНІРУ',
whoBetsLbl: 'ХТО СТАВИТЬ (СТІЛ / ГРАВЕЦЬ):',
whichKnightLbl:
'НА ЯКОГО ЛИЦАРЯ СТАВКА:',
betAmtLbl: 'СУМА СТАВКИ:',
betAmtPlaceholder: 'Сума ставки',
btnPlaceBet: 'ПРИЙНЯТИ СТАВКУ',
econCashTitle:
'КАСА ТОТАЛІЗАТОРА: ДЕПОЗИТИ',
econPubTitle:
'КАСА ПАБУ: ЗАМОВЛЕННЯ ТА ПРИЗИ',
creditCashLbl:
'ПОПОВНИТИ БАНК ГРАВЦЯ / СТОЛУ:',
creditPubLbl:
'НАРАХУВАТИ КРИШКИ ЗА ЗАМОВЛЕННЯ:',
addDrinkPub: '+КЕЛИХ (+1)',
addFoodPub: '+ЇЖА (+3)',
addSetPub: '+СЕТ (+5)',
redeemLbl:
'ВИДАТИ ПРИЗ БАРУ ОБРАНОМУ СТОЛУ:',
btnClaimPrize: 'ВИДАТИ ПРИЗ',
addTableLbl:
'ДОДАТИ НОВИЙ СТІЛ АБО ГРАВЦЯ:',
newTablePlaceholder: 'Назва столу або гравця',
btnAddTable: '+ СТІЛ',
settingsSection:
'НАЛАШТУВАННЯ ПАБУ ТА ТУРНІРУ',
btnToggleMode: 'РЕЖИМ: ПАБ / ГРОШІ',
btnNewTour: 'НОВИЙ ТУРНІР (8 ІЗ 24)',
btnNewSeed: 'ЗМІНИТИ СІД ПАБУ',
btnOpenTv: 'ВІДКРИТИ ЕКРАН ТБ',
chooseOpt: 'Вибір...',
paradeDoneHostTitle:
'ПАРАД ЗАВЕРШЕНО: РАУНД БОНУС-СТАВОК (+20% ДО КОЕФІВ!)',
paradeDoneHostSub:
'Прийміть перші ставки з бонусом і відкрийте Турнірну Сітку',
paradeHostTitle: 'ПАРАД (',
paradeHostSub:
'Лицарі по черзі обирають зброю зі стійки...',
winnerHost: 'ПЕРЕМОЖЕЦЬ: ',
finishToBracket:
' · Завершіть бій для повернення до сітки',
champHost: 'ЧЕМПІОН: ',
tourDoneHost:
'Турнір завершено! Почніть новий.',
btnCloseBonus:
'ЗАКРИТИ БОНУС-СТАВКИ -> ДО СІТКИ',
btnSkipParade:
'ПРИСКОРИТИ ПАРАД -> БОНУС-СТАВКИ',
btnPhaseRunning:
'ТРИВАЄ ФАЗА БОЮ...',
btnToBracket:
'ДО СІТКИ (ЗАВЕРШИТИ БІЙ)',
btnNextPhase:
'ПРОДОВЖИТИ БІЙ (НАСТ. ФАЗА)',
btnStartBout:
'ЗАКРИТИ СТАВКИ І ПОЧАТИ БІЙ',
bonusTag20: ' [БОНУС +20%]',
bonusTagGift: ' [ПОДАРУНОК: ',
boutOpt: ' — Бій (x',
tourOpt: ' — Турнір (x',
waitingSub:
'Очікування вибору або створення пабу на пульті ведучого...',
waitingNetLbl:
'АДРЕСА ДЛЯ ПІДКЛЮЧЕННЯ ТБ ТА ВЕДУЧОГО:',
noTablesTv: 'Столи ще не додані',
noPrizesTv: 'Призи ще не налаштовані',
paradeDoneKickerGift:
'ПАРАД ЗАВЕРШЕНО · ПЕРШИЙ РАУНД СТАВОК ІЗ ПОДАРУНКОМ: ',
paradeDoneSubGift:
'Переможні ставки на параді також отримують подарунок: ',
bonusGiftCard: 'ПОДАРУНОК: ',
tvNetBarLbl: 'ТБ АДРЕСА: ',
selectPubTitle: 'ОБЕРІТЬ АБО СТВОРІТЬ ПАБ',
btnAddPubInit: '+ ДОДАТИ ПАБ',
newPubNamePlaceholder: 'Назва пабу',
newPubSeedPlaceholder: 'Сід (необов’язково)',
btnCreatePub: 'СТВОРИТИ ПАБ',
btnCancelPub: 'СКАСУВАТИ',
btnSelectPub: 'ВІДКРИТИ',
btnSwitchPub: 'ЗМІНИТИ ПАБ',
btnExportData: 'ЕКСПОРТ УСІХ ДАНИХ (JSON)',
orderGridTitle:
'СІТКА БОНУСІВ ЗА ПОКУПКУ (ТОВАР / КРИШКИ)',
orderItemPlaceholder: 'Назва товару',
orderCapsPlaceholder: 'Кришок',
btnAddOrderItem: '+ ТОВАР',
noOrderItemsHint:
'Додайте товари в сітку нижче для нарахування кришок',
cashTopupPlaceholder: 'Сума поповнення',
btnAddCash: '+ ВНЕСТИ',
prizeGridTitle:
'СІТКА ПРИЗІВ (КІЛЬКІСТЬ КРИШОК / ПРИЗ)',
prizeCostPlaceholder: 'Кришок',
prizeTitlePlaceholder: 'Назва призу',
btnAddPrizeItem: '+ ПРИЗ',
paradeBonusSec:
'БОНУС ЗА СТАВКУ НА ПАРАДІ',
tabBonus20: '+20% КРИШОК',
tabBonusGift: 'ПОДАРУНОК',
giftNamePlaceholder:
'Вкажіть подарунок (обов’язково)',
btnSaveParadeBonus: 'ЗБЕРЕГТИ БОНУС ПАРАДУ',
giftRequiredErr:
'Вкажіть подарунок, інакше зберегти не можна!',
paradeBonusSaved: 'Бонус параду збережено!',
paradeDoneHostTitleGift:
'ПАРАД ЗАВЕРШЕНО: БОНУС-СТАВКИ (ПОДАРУНОК: ',
scrWaiting: 'ЕКРАН ОЧІКУВАННЯ',
waitingReadySub:
' — Очікування команди ведучого для початку параду...',
waitingHostTitle:
'ТБ НА ЕКРАНІ ОЧІКУВАННЯ',
waitingHostSub:
'Налаштуйте столи, бонуси та призи і натисніть Почати парад лицарів',
btnStartParadeCmd:
'ПОЧАТИ ПАРАД ЛИЦАРІВ',
btnOpenSettings: '⚙ НАЛАШТУВАННЯ',
btnBackToGame: '← ДО ГРИ',
settingsScreenTitle:
'НАЛАШТУВАННЯ ПАБУ',
tvSoundOn: '🔊 ЗВУК ТБ: УВІМК',
tvSoundOff: '🔇 ЗВУК ТБ: ВИМК',
activeBetsLbl:
'АКТИВНІ СТАВКИ (✕ ПОВЕРНУТИ):',
noActiveBets:
'Активних ставок поки немає',
btnCancelBet: '✕ ПОВЕРНУТИ',
tablesManageLbl:
'СТОЛИ ТА БАЛАНС (-1 / +1 / ✕):',
noTablesHost: 'Столи ще не додані',
btnClearTables:
'ОЧИСТИТИ ВСІ СТОЛИ (НОВИЙ ВЕЧІР)',
secModeLiveTitle:
'РЕЖИМ СТАВОК ТА LIVE-СТАВКИ',
secTourCtrlTitle:
'КЕРУВАННЯ ТУРНІРОМ ТА ВЕЧОРОМ',
secPubManageTitle:
'ПРОФІЛЬ ПАБУ ТА СИСТЕМА',
renamePubLbl:
'ПЕРЕЙМЕНУВАТИ ПОТОЧНИЙ ПАБ:',
btnSavePubName: 'ЗБЕРЕГТИ',
btnDeletePub: 'ВИДАЛИТИ ЦЕЙ ПАБ',
tapAgainConfirm:
'НАТИСНІТЬ ЩЕ РАЗ!',
tapConfirmShort: 'ТОЧНО?',
stickyTableLbl:
'АКТИВНИЙ СТІЛ / ГРАВЕЦЬ:',
whichKnightGridLbl:
'НАТИСНІТЬ НА КАРТКУ ЛИЦАРЯ:',
knightOutBadge: 'ВИБУВ',
colorRed: 'Червоний',
colorBlue: 'Синій',
colorGreen: 'Зелений',
colorPurple: 'Фіолетовий',
colorSteel: 'Сталевий',
colorCopper: 'Мідний',
errNoTables:
'Столи ще не додані! Спочатку додайте стіл у Касі пабу нижче.',
errNoTableSel:
'Спочатку оберіть стіл або гравця у верхній панелі!',
errWaitingScreen:
'Прийом ставок ще не відкрито! Спочатку запустіть Парад лицарів.',
errTourFinished:
'Турнір вже завершено! Запустіть новий турнір.',
errBoutDone:
'Цей поєдинок вже завершено! Перейдіть до наступного бою.',
errLiveBetsOff:
'Бій вже триває, а Live-ставки в бою вимкнені в налаштуваннях пабу!',
errPassRunning:
'Дочекайтеся паузи після кінної зшибки для прийому Live-ставки!',
errNoKnightSel:
'Натисніть на картку лицаря вище, щоб обрати на кого ставите!',
errKnightElim:
'Цей лицар вже вибув із поточного турніру!',
errBadAmount:
'Введіть суму ставки не менше 1!',
errLowBalance:
'Недостатньо коштів на рахунку столу! Є: ',
errNeedAmt: ', ставка: ',
betPlacedOk: '✓ Ставку прийнято: ',
setEconCardTitle:
'ЕКОНОМІКА ТА ПРАВИЛА СТАВОК',
setGameModeTitle:
'Режим економіки закладу',
setGameModeDesc:
'Визначає валюту гри. У режимі «ПАБ» гості отримують кришки за замовлення на барі та обмінюють виграні кришки на призи. У режимі «НА ГРОШІ» ставки йдуть із грошового банку столу.',
tabModePub: 'ПАБ (КРИШКИ ТА ПРИЗИ)',
tabModeCash: 'НА ГРОШІ (БАНК СТОЛУ)',
setLiveBetsTitle:
'Живі ставки між зшибками (Live)',
setLiveBetsDesc:
'Коли увімкнено, після кожної кінної зшибки бій стає на паузу, щоб ведучий міг прийняти додаткові ставки з оновленими коефіцієнтами.',
switchOn: 'УВІМК',
switchOff: 'ВИМК',
setParadeBonusTitle:
'Бонус за ставку під час параду',
setParadeBonusDesc:
'Заохочує гостей робити ставки на Чемпіона Турніру під час параду лицарів (не діє на ставки на 1-й бій).',
setParade20Hint:
'Ставки на Чемпіона Турніру, прийняті під час параду, автоматично отримують +20% до коефіцієнта виплати.',
setParadeGiftHint:
'Переможні ставки на Чемпіона Турніру, зроблені на параді, приносять столу цей подарунок від бару разом із виплатою:',
setOrderCardTitle:
'НАРАХУВАННЯ КРИШОК ЗА ЗАМОВЛЕННЯ',
setOrderCardDesc:
'Додайте позиції меню бару та скільки кришок дається за покупку. Вони з’являться як швидкі кнопки в Касі на екрані гри.',
setPrizeCardTitle:
'ВІТРИНА ПРИЗІВ ПАБУ',
setPrizeCardDesc:
'Вкажіть призи від закладу та їхню вартість у кришках. Вітрина відображається внизу екрана ТБ та у Касі ведучого.',
setTourCardTitle:
'КЕРУВАННЯ ТУРНІРОМ ТА ВЕЧОРОМ',
actRestartParadeTitle:
'Перезапустити парад лицарів',
actRestartParadeDesc:
'Повертає поточний турнір на початок параду на екрані ТБ. Баланси столів та прийняті ставки зберігаються.',
btnActRestartParade: 'На парад',
actNewTourTitle:
'Новий турнір (8 із 24)',
actNewTourDesc:
'Відбирає нову вісімку бійців із 24 лицарів пабу (чемпіон та фіналіст залишаються захищати титул) і запускає нову сітку.',
btnActNewTour: 'Новий турнір',
actClearTablesTitle:
'Очистити столи для нового вечора',
actClearTablesDesc:
'Видаляє всі столи та активні ставки перед початком нового вечора. Історія перемог лицарів і меню бару зберігаються.',
btnActClearTables: 'Очистити столи',
actNewSeedTitle:
'Змінити пул із 24 лицарів (Сід)',
actNewSeedDesc:
'Генерує повністю новий склад із 24 лицарів для цього пабу та обнуляє їхню статистику перемог і титулів.',
btnActNewSeed: 'Новий сід',
setPubCardTitle:
'ПРОФІЛЬ ПАБУ ТА СИСТЕМА',
setRenamePubTitle: 'Назва пабу',
setRenamePubDesc:
'Відображається у верхній шапці на екрані ТБ та на пульті ведучого.',
actSwitchPubTitle:
'Змінити активний паб',
actSwitchPubDesc:
'Повернутися до списку закладів, щоб обрати інший паб або створити новий.',
btnActSwitchPub: 'До списку пабів',
actBackupTvTitle:
'Резервна копія та екран ТБ',
actBackupTvDesc:
'Завантажити повний JSON-архів усіх пабів на телефон або відкрити екран ТБ у браузері.',
btnActExport: 'Експорт JSON',
btnActOpenTv: 'Екран ТБ',
actDeletePubTitle: 'Видалити цей паб',
actDeletePubDesc:
'Безповоротно видаляє цей паб, його 24 лицарів та всі налаштування з пам’яті пристрою.',
btnActDeletePub: 'Видалити паб',
tvBtnFullscreen: '⛶ ПОВНИЙ ЕКРАН',
tvBtnFullscreenOn:
'⛶ ПОВНИЙ ЕКРАН: УВІМК',
tvBtnSound: '🔊 ЗВУК',
tvBtnSoundOn: '🔊 ЗВУК: УВІМК',
tvBtnSoundOff: '🔇 ЗВУК: ВИМК',
customCapsPubLbl:
'БУДЬ-ЯКА СУМА КРИШОК ОБРАНОМУ СТОЛУ:',
capsInputPlaceholder: 'Кількість кришок',
btnAddCapsCustom: '+ ДОДАТИ',
btnSubCapsCustom: '- СПИСАТИ',
secSetTablesTitle:
'СТОЛИ ТА БАЛАНС КРИШОК',
setTablesCardDesc:
'Введіть будь-яку кількість кришок (або грошей) для нарахування чи списання з будь-якого столу, або додайте новий стіл.',
setPinTitle:
'Захист пульта PIN-кодом',
setPinDesc:
'За замовчуванням вимкнено. Коли увімкнено, вхід у пульт ведучого з нового пристрою вимагає введення PIN-коду.',
pinInputPlaceholder:
'Введіть PIN (напр. 1234)',
btnSavePin: 'ЗБЕРЕГТИ PIN',
pinSavedMsg:
'✓ Налаштування PIN збережено!',
pinRequiredErr:
'Введіть PIN-код перед увімкненням захисту!',
pinLockTitle:
'ПУЛЬТ ЗАХИЩЕНО PIN-КОДОМ',
pinLockSub:
'Введіть PIN-код цього пабу для доступу до керування:',
btnUnlockPin: 'УВІЙТИ В ПУЛЬТ',
pinWrongErr:
'Невірний PIN-код! Спробуйте ще раз.'
},

ru: {
tvTitle: 'Рыцарский Турнир — Экран ТВ',
hostTitle:
'Пульт Ведущего — Рыцарский Турнир',
brandTitle: 'РЫЦАРСКИЙ ТУРНИР',
pubBadge: 'ПАБ #',
tourNo: 'ТУРНИР №',
paradePhase: 'ПАРАД РЫЦАРЕЙ',
modePubFull:
'РЕЖИМ: ПАБ (КРЫШКИ И ПРИЗЫ)',
modeCashFull:
'РЕЖИМ: НА ДЕНЬГИ (БАНК)',
modePubShort: 'ПАБ (КРЫШКИ)',
modeCashShort: 'НА ДЕНЬГИ',
restartParade: 'ПАРАД С НАЧАЛА',
hostPanelBtn: 'ПУЛЬТ ВЕДУЩЕГО (/HOST)',
soundOn: 'ЗВУК: ВКЛ',
soundOff: 'ЗВУК: ВЫКЛ',
curCaps: ' КР',
curCash: ' ₽',
paradeDoneKicker:
'ПАРАД ЗАВЕРШЁН · ПЕРВЫЙ РАУНД ПРИЁМА СТАВОК С БОНУСОМ +20% К КОЭФФИЦИЕНТАМ!',
paradeDoneTitle:
'Все 8 рыцарей в строю и выбрали оружие!',
paradeDoneSub:
'Делайте первые ставки с повышенным бонусом до перехода к Турнирной Сетке!',
paradeStepKicker:
'ПАРАД УЧАСТНИКОВ И ВЫБОР ОРУЖИЯ (',
of8: ' ИЗ 8)',
winsLbl: 'Побед: ',
lossesLbl: 'Поражений: ',
cupsLbl: 'Кубков: ',
tourOddsLbl: 'Турнир: x',
tourWinOddsLbl: 'Победа в турнире: x',
ShieldLbl: 'Щит: ',
ridesHorse: 'Выезжает на коне: ',
gallopsToRack:
' · Скачет к оружейной стойке...',
favWepNote: ' (ЕГО ЛЮБИМОЕ ОРУЖИЕ! ★)',
randWepNote:
' (Случайный выбор со стойки)',
picksFromRack: 'Берёт со стойки: ',
andJoinsLine: ' и встаёт в строй!',
pickingWeapon: 'Выбирает оружие...',
contenderNo: 'УЧАСТНИК #',
bonusBet20: 'БОНУС СТАВКА +20%',
qfWest: '1/4 ФИНАЛА (ЗАПАД)',
qfEast: '1/4 ФИНАЛА (ВОСТОК)',
sfHeader: '1/2 ФИНАЛА',
grandFinalHeader:
'ГРАНД-ФИНАЛ ТУРНИРА',
qfShort: '1/4 ФИНАЛА',
sfShort: '1/2 ФИНАЛА',
finalShort: 'ФИНАЛ КУБКА',
stWait: 'ОЖИДАНИЕ',
stDone: 'ЗАВЕРШЁН',
stLive: 'ТЕКУЩИЙ БОЙ',
waitPair: 'Ожидание пары...',
matchNo: 'МАТЧ #',
liveBetsOn: 'LIVE-СТАВКИ В БОЮ: ВКЛ',
preBetsOnly: 'СТАВКИ ДО НАЧАЛА БОЮ',
winInBout: 'ПОБЕДА В БОЮ',
totalBets: 'Принято ставок: ',
waitHostBets:
'Ведущий принимает ставки столов...',
tagTour: '[ТУРНИР]',
tagBout: '[БОЙ]',
badgeBout: 'БОЙ x',
badgeTour: 'ТУР x',
h2hLbl: 'ЛИЧНЫЙ СЧЁТ: ',
champKicker:
'ЧЕМПИОН СНИМАЕТ ШЛЕМ! ИСТИННЫЙ ТИТУЛ РАСКРЫТ:',
champLore:
'В следующем турнире он вновь выйдет как простой Сир!',
shIntact: 'Щит цел',
shCracked: 'Щит треснул!',
shShattered: 'Щит разбит в щепки!',
fatTired: 'Тяжело дышит',
fatFresh: 'Полон сил',
joustPassOf3: 'КОННАЯ СШИБКА ',
boutTitle: 'ПОЕДИНОК',
boutInProgress: 'Бой в разгаре...',
windRight: ' · Ветер вправо →',
windLeft: ' · Ветер влево ←',
windCalm: ' · Штиль',
joustReady: 'Всадники на изготовке...',
joustCharge:
'Разгон по ристалищу...',
joustClash: 'Сшибка копий!',
meleeClash:
'Тяжёлый обмен ударами со щитами...',
k1Short: 'К1: x',
k2Short: 'К2: x',
tablesCashTitle:
'ИГРОКИ И СТОЛЫ (БАНК В КАССЕ):',
tablesPubTitle:
'СТОЛЫ ПАБА (БАЛАНС КРЫШЕК ЗА ЗАКАЗЫ):',
payoutsTitle:
'ПОСЛЕДНИЕ ВЫПЛАТЫ ТОТАЛИЗАТОРА:',
waitPayouts:
'Ожидание расчёта ставок',
prizesTitle:
'ВИТРИНА ПРИЗОВ ПАБА (ОБМЕН КРЫШЕК):',
pubBannerWord: 'ПАБ',

hostHeader: 'ПУЛЬТ ВЕДУЩЕГО',
tvScreenLbl: 'ЭКРАН ТВ: ',
modeLbl: 'РЕЖИМ: ',
scrParade: 'ПАРАД РЫЦАРЕЙ',
scrCombat: 'АРЕНА БОЯ',
scrBracket: 'СЕТКА ТУРНИРА',
ctrlSection:
'УПРАВЛЕНИЕ ЭКРАНОМ И ПОЕДИНКОМ',
btnNextMatch: 'СЛЕДУЮЩИЙ МАТЧ',
btnReplayParade: 'ПАРАД С НАЧАЛА',
liveBtnOn: 'LIVE В БОЮ: ВКЛ',
liveBtnOff: 'LIVE В БОЮ: ВЫКЛ',
btnSwitchScreen:
'ПОКАЗАТЬ ВСЮ СЕТКУ ТУРНИРА',
btnBackToArena:
'ВЕРНУТЬСЯ К АРЕНЕ БОЯ',
betSection:
'ПРИЁМ СТАВОК (НА БОЙ ИЛИ НА ТУРНИР)',
tabMatch: 'НА ТЕКУЩИЙ БОЙ',
tabOutright: 'НА ЧЕМПИОНА ТУРНИРА',
whoBetsLbl: 'КТО СТАВИТ (СТОЛ / ИГРОК):',
whichKnightLbl:
'НА КАКОГО РЫЦАРЯ СТАВКА:',
betAmtLbl: 'СУММА СТАВКИ:',
betAmtPlaceholder: 'Сумма ставки',
btnPlaceBet: 'ПРИНЯТЬ СТАВКУ',
econCashTitle:
'КАССА ТОТАЛИЗАТОРА: ДЕПОЗИТЫ',
econPubTitle:
'КАССА ПАБА: ЗАКАЗЫ И ПРИЗЫ',
creditCashLbl:
'ПОПОЛНИТЬ БАНК ИГРОКА / СТОЛА:',
creditPubLbl:
'НАЧИСЛИТЬ КРЫШКИ ЗА ЗАКАЗ НА БАРЕ:',
addDrinkPub: '+БОКАЛ (+1)',
addFoodPub: '+ЕДА (+3)',
addSetPub: '+СЕТ (+5)',
redeemLbl:
'ВЫДАТЬ ПРИЗ БАРА ВЫБРАННОМУ СТОЛУ:',
btnClaimPrize: 'ВЫДАТЬ ПРИЗ',
addTableLbl:
'ДОБАВИТЬ НОВЫЙ СТОЛ ИЛИ ИГРОКА:',
newTablePlaceholder: 'Название стола или игрока',
btnAddTable: '+ СТОЛ',
settingsSection:
'НАСТРОЙКИ ПАБА И ТУРНИРА',
btnToggleMode: 'РЕЖИМ: ПАБ / ДЕНЬГИ',
btnNewTour: 'НОВЫЙ ТУРНИР (8 ИЗ 24)',
btnNewSeed: 'СМЕНИТЬ СИД ПАБА',
btnOpenTv: 'ОТКРЫТЬ ЭКРАН ТВ',
chooseOpt: 'Выбор...',
paradeDoneHostTitle:
'ПАРАД ЗАВЕРШЁН: РАУНД БОНУС-СТАВОК (+20% К КОЭФАМ!)',
paradeDoneHostSub:
'Примите первые ставки с бонусом и откройте Турнирную Сетку',
paradeHostTitle: 'ПАРАД (',
paradeHostSub:
'Рыцари по очереди выбирают оружие со стойки...',
winnerHost: 'ПОБЕДИТЕЛЬ: ',
finishToBracket:
' · Завершите бой для возврата к сетке',
champHost: 'ЧЕМПИОН: ',
tourDoneHost:
'Турнир завершён! Начните новый.',
btnCloseBonus:
'ЗАКРЫТЬ БОНУС-СТАВКИ -> К СЕТКЕ',
btnSkipParade:
'УСКОРИТЬ ПАРАД -> БОНУС-СТАВКИ',
btnPhaseRunning:
'ИДЁТ ФАЗА БОЯ...',
btnToBracket:
'К СЕТКЕ (ЗАВЕРШИТЬ БОЙ)',
btnNextPhase:
'ПРОДОЛЖИТЬ БОЙ (СЛЕД. ФАЗА)',
btnStartBout:
'ЗАКРЫТЬ СТАВКИ И НАЧАТЬ БОЙ',
bonusTag20: ' [БОНУС +20%]',
bonusTagGift: ' [ПОДАРОК: ',
boutOpt: ' — Бой (x',
tourOpt: ' — Турнир (x',
waitingSub:
'Ожидание выбора или создания паба на пульте ведущего...',
waitingNetLbl:
'АДРЕС ДЛЯ ПОДКЛЮЧЕНИЯ ТВ И ВЕДУЩЕГО:',
noTablesTv: 'Столы ещё не добавлены',
noPrizesTv: 'Призы ещё не настроены',
paradeDoneKickerGift:
'ПАРАД ЗАВЕРШЁН · ПЕРВЫЙ РАУНД СТАВОК С ПОДАРКОМ: ',
paradeDoneSubGift:
'Выигравшие ставки на параде также получают подарок: ',
bonusGiftCard: 'ПОДАРОК: ',
tvNetBarLbl: 'АДРЕС ТВ: ',
selectPubTitle: 'ВЫБЕРИТЕ ИЛИ СОЗДАЙТЕ ПАБ',
btnAddPubInit: '+ ДОБАВИТЬ ПАБ',
newPubNamePlaceholder: 'Название паба',
newPubSeedPlaceholder: 'Сид (необязательно)',
btnCreatePub: 'СОЗДАТЬ ПАБ',
btnCancelPub: 'ОТМЕНА',
btnSelectPub: 'ОТКРЫТЬ',
btnSwitchPub: 'СМЕНИТЬ ПАБ',
btnExportData: 'ЭКСПОРТ ВСЕХ ДАННЫХ (JSON)',
orderGridTitle:
'СЕТКА БОНУСОВ ЗА ПОКУПКУ (ТОВАР / КРЫШЕК)',
orderItemPlaceholder: 'Название товара',
orderCapsPlaceholder: 'Крышек',
btnAddOrderItem: '+ ТОВАР',
noOrderItemsHint:
'Добавьте товары в сетку ниже для начисления крышек',
cashTopupPlaceholder: 'Сумма пополнения',
btnAddCash: '+ ВНЕСТИ',
prizeGridTitle:
'СЕТКА ПРИЗОВ (КРЫШЕК / ПРИЗ)',
prizeCostPlaceholder: 'Крышек',
prizeTitlePlaceholder: 'Название приза',
btnAddPrizeItem: '+ ПРИЗ',
paradeBonusSec:
'БОНУС ЗА СТАВКУ НА ПАРАДЕ',
tabBonus20: '+20% КРЫШЕК',
tabBonusGift: 'ПОДАРОК',
giftNamePlaceholder:
'Укажите подарок (обязательно)',
btnSaveParadeBonus: 'СОХРАНИТЬ БОНУС ПАРАДА',
giftRequiredErr:
'Укажите подарок, иначе сохранить нельзя!',
paradeBonusSaved: 'Бонус парада сохранён!',
paradeDoneHostTitleGift:
'ПАРАД ЗАВЕРШЁН: БОНУС-СТАВКИ (ПОДАРОК: ',
scrWaiting: 'ЭКРАН ОЖИДАНИЯ',
waitingReadySub:
' — Ожидание команды ведущего для запуска парада...',
waitingHostTitle:
'ТВ НА ЭКРАНЕ ОЖИДАНИЯ',
waitingHostSub:
'Настройте столы, бонусы и призы, затем нажмите Начать парад рыцарей',
btnStartParadeCmd:
'НАЧАТЬ ПАРАД РЫЦАРЕЙ',
btnOpenSettings: '⚙ НАСТРОЙКИ',
btnBackToGame: '← К ИГРЕ',
settingsScreenTitle:
'НАСТРОЙКИ ПАБА',
tvSoundOn: '🔊 ЗВУК ТВ: ВКЛ',
tvSoundOff: '🔇 ЗВУК ТВ: ВЫКЛ',
activeBetsLbl:
'АКТИВНЫЕ СТАВКИ (✕ ВЕРНУТЬ):',
noActiveBets:
'Активных ставок пока нет',
btnCancelBet: '✕ ВЕРНУТЬ',
tablesManageLbl:
'СТОЛЫ И БАЛАНС (-1 / +1 / ✕):',
noTablesHost: 'Столы ещё не добавлены',
btnClearTables:
'ОЧИСТИТЬ ВСЕ СТОЛЫ (НОВЫЙ ВЕЧЕР)',
secModeLiveTitle:
'РЕЖИМ СТАВОК И LIVE-СТАВКИ',
secTourCtrlTitle:
'УПРАВЛЕНИЕ ТУРНИРОМ И ВЕЧЕРОМ',
secPubManageTitle:
'ПРОФИЛЬ ПАБА И СИСТЕМА',
renamePubLbl:
'ПЕРЕИМЕНОВАТЬ ТЕКУЩИЙ ПАБ:',
btnSavePubName: 'СОХРАНИТЬ',
btnDeletePub: 'УДАЛИТЬ ЭТОТ ПАБ',
tapAgainConfirm:
'НАЖМИТЕ ЕЩЁ РАЗ!',
tapConfirmShort: 'ТОЧНО?',
stickyTableLbl:
'АКТИВНЫЙ СТОЛ / ИГРОК:',
whichKnightGridLbl:
'НАЖМИТЕ НА КАРТОЧКУ РЫЦАРЯ:',
knightOutBadge: 'ВЫБЫЛ',
colorRed: 'Красный',
colorBlue: 'Синий',
colorGreen: 'Зелёный',
colorPurple: 'Фиолетовый',
colorSteel: 'Стальной',
colorCopper: 'Медный',
errNoTables:
'Столы ещё не добавлены! Сначала добавьте стол в Кассе паба ниже.',
errNoTableSel:
'Сначала выберите стол или игрока в верхней панели!',
errWaitingScreen:
'Приём ставок ещё не открыт! Сначала запустите Парад рыцарей.',
errTourFinished:
'Турнир уже завершён! Запустите новый турнир.',
errBoutDone:
'Этот поединок уже завершён! Перейдите к следующему бою.',
errLiveBetsOff:
'Бой уже идёт, а Live-ставки в бою отключены в настройках паба!',
errPassRunning:
'Дождитесь паузы после конной сшибки для приёма Live-ставки!',
errNoKnightSel:
'Нажмите на карточку рыцаря выше, чтобы выбрать, на кого ставите!',
errKnightElim:
'Этот рыцарь уже выбыл из текущего турнира!',
errBadAmount:
'Введите сумму ставки не меньше 1!',
errLowBalance:
'Недостаточно средств на счету стола! Доступно: ',
errNeedAmt: ', ставка: ',
betPlacedOk: '✓ Ставка принята: ',
setEconCardTitle:
'ЭКОНОМИКА И ПРАВИЛА СТАВОК',
setGameModeTitle:
'Режим экономики заведения',
setGameModeDesc:
'Определяет валюту игры. В режиме «ПАБ» гости получают крышки за заказы в баре и меняют выигранные крышки на призы. В режиме «НА ДЕНЬГИ» ставки идут из денежного банка стола.',
tabModePub: 'ПАБ (КРЫШКИ И ПРИЗЫ)',
tabModeCash: 'НА ДЕНЬГИ (БАНК СТОЛА)',
setLiveBetsTitle:
'Живые ставки между сшибками (Live)',
setLiveBetsDesc:
'Когда включено, после каждой конной сшибки бой встаёт на паузу, чтобы ведущий мог принять дополнительные ставки с обновлёнными коэффициентами.',
switchOn: 'ВКЛ',
switchOff: 'ВЫКЛ',
setParadeBonusTitle:
'Бонус за ставку во время парада',
setParadeBonusDesc:
'Поощряет гостей делать ставки на Чемпиона Турнира во время парада рыцарей (не действует на ставки на 1-й бой).',
setParade20Hint:
'Ставки на Чемпиона Турнира, принятые во время парада, автоматически получают +20% к коэффициенту выплаты.',
setParadeGiftHint:
'Выигравшие ставки на Чемпиона Турнира, сделанные на параде, приносят столу этот подарок от бара помимо выплаты крышек:',
setOrderCardTitle:
'НАЧИСЛЕНИЕ КРЫШЕК ЗА ЗАКАЗЫ',
setOrderCardDesc:
'Добавьте позиции меню бара и сколько крышек даётся за их покупку. Они появятся как быстрые кнопки в Кассе на экране игры.',
setPrizeCardTitle:
'ВИТРИНА ПРИЗОВ ПАБА',
setPrizeCardDesc:
'Укажите призы от заведения и их стоимость в крышках. Витрина отображается внизу экрана ТВ и в Кассе ведущего.',
setTourCardTitle:
'УПРАВЛЕНИЕ ТУРНИРОМ И ВЕЧЕРОМ',
actRestartParadeTitle:
'Перезапустить парад рыцарей',
actRestartParadeDesc:
'Возвращает текущий турнир к началу парада на экране ТВ. Балансы столов и принятые ставки сохраняются.',
btnActRestartParade: 'На парад',
actNewTourTitle:
'Новый турнир (8 из 24)',
actNewTourDesc:
'Отбирает новую восьмёрку бойцов из 24 рыцарей паба (чемпион и финалист остаются защищать титул) и запускает новую сетку.',
btnActNewTour: 'Новый турнир',
actClearTablesTitle:
'Очистить столы для нового вечера',
actClearTablesDesc:
'Удаляет все столы и активные ставки перед началом нового вечера. История побед рыцарей и меню бара сохраняются.',
btnActClearTables: 'Очистить столы',
actNewSeedTitle:
'Сменить пул из 24 рыцарей (Сид)',
actNewSeedDesc:
'Генерирует полностью новый состав из 24 рыцарей для этого паба и обнуляет их статистику побед и титулов.',
btnActNewSeed: 'Новый сид',
setPubCardTitle:
'ПРОФИЛЬ ПАБА И СИСТЕМА',
setRenamePubTitle: 'Название паба',
setRenamePubDesc:
'Отображается в верхней шапке на экране телевизора и на пульте ведущего.',
actSwitchPubTitle:
'Сменить активный паб',
actSwitchPubDesc:
'Вернуться к списку заведений, чтобы выбрать другой паб или создать новый.',
btnActSwitchPub: 'К списку пабов',
actBackupTvTitle:
'Резервная копия и экран ТВ',
actBackupTvDesc:
'Скачать полный JSON-архив всех пабов на телефон или открыть экран ТВ в браузере.',
btnActExport: 'Экспорт JSON',
btnActOpenTv: 'Экран ТВ',
actDeletePubTitle: 'Удалить этот паб',
actDeletePubDesc:
'Безвозвратно удаляет этот паб, его 24 рыцаря и все настройки из памяти устройства.',
btnActDeletePub: 'Удалить паб',
tvBtnFullscreen: '⛶ ФУЛСКРИН',
tvBtnFullscreenOn: '⛶ ФУЛСКРИН: ВКЛ',
tvBtnSound: '🔊 ЗВУК',
tvBtnSoundOn: '🔊 ЗВУК: ВКЛ',
tvBtnSoundOff: '🔇 ЗВУК: ВЫКЛ',
customCapsPubLbl:
'ЛЮБАЯ СУММА КРЫШЕК ВЫБРАННОМУ СТОЛУ:',
capsInputPlaceholder: 'Сумма крышек',
btnAddCapsCustom: '+ НАЧИСЛИТЬ',
btnSubCapsCustom: '- СПИСАТЬ',
secSetTablesTitle:
'СТОЛЫ И БАЛАНС КРЫШЕК',
setTablesCardDesc:
'Введите любую сумму крышек (или денег) для начисления или списания любому столу, либо добавьте новый стол.',
setPinTitle:
'Защита пульта PIN-кодом',
setPinDesc:
'По умолчанию выключено. Когда включено, вход в пульт ведущего с нового телефона требует ввода PIN-кода.',
pinInputPlaceholder:
'Введите PIN (напр. 1234)',
btnSavePin: 'СОХРАНИТЬ PIN',
pinSavedMsg:
'✓ Настройки PIN сохранены!',
pinRequiredErr:
'Введите PIN-код перед включением защиты!',
pinLockTitle:
'ПУЛЬТ ЗАЩИЩЁН PIN-КОДОМ',
pinLockSub:
'Введите PIN-код этого паба для доступа к управлению:',
btnUnlockPin: 'ВОЙТИ В ПУЛЬТ',
pinWrongErr:
'Неверный PIN-код! Попробуйте ещё раз.'
}
};

// get dictionary for active language code
// defaults to english when code is unknown
function getDict(lang) {
return STRINGS[lang] || STRINGS.en;
}

// get single translated string by key
// falls back to english dictionary key
function t(lang, key) {
var d = getDict(lang);
return d[key] !== undefined
? d[key]
: STRINGS.en[key] || key;
}

global.GameI18n = {
STRINGS: STRINGS,
getDict: getDict,
t: t
};
})(window);
