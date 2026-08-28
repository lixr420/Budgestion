const STORAGE_KEY = 'budgestion-state';
import { supabase } from './supabaseClient.js';
const SYNC_KEY = 'budgestion-sync-code';
let syncCode = localStorage.getItem(SYNC_KEY) || '';
const savedState = loadState();
const transactions = savedState.transactions;
const actions = savedState.actions;
const categoryBudgetValues = savedState.categoryBudgets || {};
const vehicleData = savedState.vehicle || {};
const defaultCategories = ['Logement', 'Alimentation', 'Transport', 'Loisirs', 'Salaire', 'Pension', 'Indemnité', 'Allocation familiale', 'Autre'];
const categoryNames = [...new Set([...defaultCategories, ...(Array.isArray(savedState.categories) ? savedState.categories : [])].filter(Boolean))];
const form = document.querySelector('#transaction-form');
const actionLog = document.querySelector('#action-log');
const emptyLog = document.querySelector('#empty-log');
const operationsList = document.querySelector('#operations-list');
const emptyOperations = document.querySelector('#empty-operations');
const budgetChart = document.querySelector('#budget-chart');
const saveStatus = document.querySelector('#save-status');
const currencySelect = document.querySelector('#currency');
const accountBalances = document.querySelector('#account-balances');
const plannedList = document.querySelector('#planned-list');
const emptyPlanned = document.querySelector('#empty-planned');
const plannedIncomeList = document.querySelector('#planned-income-list');
const emptyPlannedIncome = document.querySelector('#empty-planned-income');
const categorySummary = document.querySelector('#category-summary');
const transactionAnalysis = document.querySelector('#transaction-analysis');
const budgetCategorySummary = document.querySelector('#budget-category-summary');
const categoryBudgets = document.querySelector('#category-budgets');
const categoryManagerList = document.querySelector('#category-manager-list');
const vehicleSummary = document.querySelector('#vehicle-summary');
const vehicleDialog = document.querySelector('#vehicle-dialog');
const vehicleForm = document.querySelector('#vehicle-form');
const newCategory = document.querySelector('#new-category');
const addCategory = document.querySelector('#add-category');
const monthlyPlannedTotal = document.querySelector('#monthly-planned-total');
const monthlySpentTotal = document.querySelector('#monthly-spent-total');
const monthlyAvailableTotal = document.querySelector('#monthly-available-total');
const planned = document.querySelector('#planned');
const plannedLabel = document.querySelector('#planned-label');
const plannedDateLabel = document.querySelector('#planned-date-label');
const expenseKindLabel = document.querySelector('#expense-kind-label');
const chartToggle = document.querySelector('#chart-toggle');
const overviewTrack = document.querySelector('.overview');
const overviewPosition = document.querySelector('#overview-position');
const overviewPrev = document.querySelector('#overview-prev');
const overviewNext = document.querySelector('#overview-next');
const overviewViewport = document.querySelector('.overview-viewport');
const formTitle = document.querySelector('#form-title');
const submitTransaction = document.querySelector('#submit-transaction');
const cancelEdit = document.querySelector('#cancel-edit');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const quickTransactionForm = document.querySelector('#quick-transaction-form');
const csvImport = document.querySelector('#csv-import');
const tutorialDialog = document.querySelector('#tutorial-dialog');
const settingsDialog = document.querySelector('#settings-dialog');
const tutorialNext = document.querySelector('#tutorial-next');
const tutorialPrev = document.querySelector('#tutorial-prev');
const tutorialTitle = document.querySelector('#tutorial-title');
const tutorialText = document.querySelector('#tutorial-text');
const tutorialTip = document.querySelector('#tutorial-tip');
const tutorialStepLabel = document.querySelector('#tutorial-step-label');
const tutorialDots = document.querySelectorAll('.tutorial-dots i');
const accentColor = document.querySelector('#accent-color');
const tabOrder = document.querySelector('#tab-order');
const tutorialSteps = [
	['Votre tableau de bord', "Consultez votre solde et vos indicateurs depuis l'onglet Aperçu.", 'Le slider vous permet de parcourir les cinq indicateurs : solde, revenus, dépenses fixes et dépenses variables.'],
	['Ajouter rapidement', "Ajoutez une dépense ou un revenu directement dans l'Aperçu.", 'Choisissez le type, indiquez le montant et la catégorie, puis cliquez sur Ajouter directement.'],
	['Gérer vos opérations', 'Utilisez Transactions pour modifier, catégoriser et planifier vos opérations.', 'Le journal conserve vos actions et les données sont sauvegardées automatiquement après chaque changement.'],
	['Planifier et personnaliser', "Définissez votre budget mensuel, changez la devise et adaptez l'interface.", 'Le bouton Paramètres permet aussi de changer la couleur et de réorganiser les onglets.']
];
const languageSelect = document.querySelector('#language');
const translations = {
	fr: { quickAction: 'ACTION RAPIDE', manageBudget: 'Gérer mon budget', personalManagement: 'GESTION PERSONNELLE', intro: 'Suivez vos revenus, vos dépenses et chaque action en temps réel.', language: 'Langue', currency: 'Devise', overview: 'Aperçu', transactions: 'Transactions', budget: 'Budget', currentBalance: 'Solde actuel', totalIncome: 'Revenus totaux', totalExpenses: 'Dépenses totales', fixedExpenses: 'Dépenses fixes', variableExpenses: 'Dépenses variables', overviewChart: "Vue d'ensemble", accountBalances: 'Soldes des comptes', plannedIncome: 'Revenus planifiés', plannedExpenses: 'Dépenses planifiées', noPlannedIncome: 'Aucun revenu planifié.', noPlannedExpenses: 'Aucune dépense planifiée.', addTransaction: 'Ajouter une opération', type: 'Type', expense: 'Dépense', income: 'Revenu', amount: 'Montant (€)', account: 'Compte', category: 'Catégorie', nature: 'Nature', fixedExpense: 'Dépense fixe', variableExpense: 'Dépense variable', plannedExpense: 'Dépense planifiée', plannedIncome: 'Revenu planifié', plannedDate: 'Date prévue', description: 'Description', addOperation: "Ajouter l'opération", cancel: 'Annuler', actionLog: 'Journal des actions', clear: 'Effacer', actionsWillAppear: 'Vos actions apparaîtront ici.', myOperations: 'Mes opérations', autosave: 'Sauvegarde automatique active', noOperations: 'Aucune opération enregistrée.', transactionAnalysis: 'Analyse des transactions', distribution: 'Répartition', planning: 'PLANIFICATION', monthlyBudget: 'Budget mensuel', budgetDescription: "Définissez votre enveloppe mensuelle pour suivre ce qu'il vous reste à dépenser.", plannedMonthlyBudget: 'Budget prévu mensuel (€)', availableBudget: 'Budget disponible', noEnvelope: 'Aucune enveloppe définie', revenue: 'Revenu', expenseLabel: 'Dépense', noDescription: 'Sans description', entry: 'Entrée', fixed: 'Fixe', variable: 'Variable', planned: 'Planifiée', total: 'Total', noAccount: 'Aucun compte alimenté.', noCategory: 'Aucune catégorie.', operationCount: "Nombre d'opérations" },
	en: { personalManagement: 'PERSONAL FINANCE', intro: 'Track your income, expenses and every action in real time.', language: 'Language', currency: 'Currency', overview: 'Overview', transactions: 'Transactions', budget: 'Budget', currentBalance: 'Current balance', totalIncome: 'Total income', totalExpenses: 'Total expenses', fixedExpenses: 'Fixed expenses', variableExpenses: 'Variable expenses', overviewChart: 'Overview', accountBalances: 'Account balances', plannedIncome: 'Planned income', plannedExpenses: 'Planned expenses', noPlannedIncome: 'No planned income.', noPlannedExpenses: 'No planned expenses.', addTransaction: 'Add a transaction', type: 'Type', expense: 'Expense', income: 'Income', amount: 'Amount (€)', account: 'Account', category: 'Category', nature: 'Nature', fixedExpense: 'Fixed expense', variableExpense: 'Variable expense', plannedExpense: 'Planned expense', plannedIncome: 'Planned income', plannedDate: 'Due date', description: 'Description', addOperation: 'Add transaction', cancel: 'Cancel', actionLog: 'Action log', clear: 'Clear', actionsWillAppear: 'Your actions will appear here.', myOperations: 'My transactions', autosave: 'Automatic saving active', noOperations: 'No transactions recorded.', transactionAnalysis: 'Transaction analysis', distribution: 'Distribution', planning: 'PLANNING', monthlyBudget: 'Monthly budget', budgetDescription: 'Set your monthly allowance to track what you have left to spend.', plannedMonthlyBudget: 'Planned monthly budget (€)', availableBudget: 'Available budget', noEnvelope: 'No allowance set', revenue: 'Income', expenseLabel: 'Expense', noDescription: 'No description', entry: 'Income', fixed: 'Fixed', variable: 'Variable', planned: 'Planned', total: 'Total', noAccount: 'No funded account.', noCategory: 'No category.', operationCount: 'Number of transactions' },
	he: { personalManagement: 'ניהול אישי', intro: 'עקבו אחר ההכנסות, ההוצאות וכל פעולה בזמן אמת.', language: 'שפה', currency: 'מטבע', overview: 'סקירה', transactions: 'עסקאות', budget: 'תקציב', currentBalance: 'יתרה נוכחית', totalIncome: 'סך ההכנסות', totalExpenses: 'סך ההוצאות', fixedExpenses: 'הוצאות קבועות', variableExpenses: 'הוצאות משתנות', overviewChart: 'סקירה כללית', accountBalances: 'יתרות חשבונות', plannedIncome: 'הכנסות מתוכננות', plannedExpenses: 'הוצאות מתוכננות', noPlannedIncome: 'אין הכנסות מתוכננות.', noPlannedExpenses: 'אין הוצאות מתוכננות.', addTransaction: 'הוספת עסקה', type: 'סוג', expense: 'הוצאה', income: 'הכנסה', amount: 'סכום (€)', account: 'חשבון', category: 'קטגוריה', nature: 'אופי', fixedExpense: 'הוצאה קבועה', variableExpense: 'הוצאה משתנה', plannedExpense: 'הוצאה מתוכננת', plannedIncome: 'הכנסה מתוכננת', plannedDate: 'תאריך יעד', description: 'תיאור', addOperation: 'הוספת פעולה', cancel: 'ביטול', actionLog: 'יומן פעולות', clear: 'ניקוי', actionsWillAppear: 'הפעולות יופיעו כאן.', myOperations: 'העסקאות שלי', autosave: 'שמירה אוטומטית פעילה', noOperations: 'אין עסקאות.', transactionAnalysis: 'ניתוח עסקאות', distribution: 'התפלגות', planning: 'תכנון', monthlyBudget: 'תקציב חודשי', budgetDescription: 'הגדירו מסגרת חודשית כדי לעקוב אחר היתרה.', plannedMonthlyBudget: 'תקציב חודשי מתוכנן (€)', availableBudget: 'תקציב זמין', noEnvelope: 'לא הוגדרה מסגרת', revenue: 'הכנסה', expenseLabel: 'הוצאה', noDescription: 'ללא תיאור', entry: 'הכנסה', fixed: 'קבועה', variable: 'משתנה', planned: 'מתוכננת', total: 'סה״כ', noAccount: 'אין חשבון ממומן.', noCategory: 'אין קטגוריה.', operationCount: 'מספר העסקאות' },
	ru: { personalManagement: 'ЛИЧНЫЕ ФИНАНСЫ', intro: 'Отслеживайте доходы, расходы и каждое действие в реальном времени.', language: 'Язык', currency: 'Валюта', overview: 'Обзор', transactions: 'Операции', budget: 'Бюджет', currentBalance: 'Текущий баланс', totalIncome: 'Общий доход', totalExpenses: 'Общие расходы', fixedExpenses: 'Постоянные расходы', variableExpenses: 'Переменные расходы', overviewChart: 'Обзор', accountBalances: 'Балансы счетов', plannedIncome: 'Планируемые доходы', plannedExpenses: 'Планируемые расходы', noPlannedIncome: 'Нет планируемых доходов.', noPlannedExpenses: 'Нет планируемых расходов.', addTransaction: 'Добавить операцию', type: 'Тип', expense: 'Расход', income: 'Доход', amount: 'Сумма (€)', account: 'Счёт', category: 'Категория', nature: 'Вид', fixedExpense: 'Постоянный расход', variableExpense: 'Переменный расход', plannedExpense: 'Планируемый расход', plannedIncome: 'Планируемый доход', plannedDate: 'Дата платежа', description: 'Описание', addOperation: 'Добавить операцию', cancel: 'Отмена', actionLog: 'Журнал действий', clear: 'Очистить', actionsWillAppear: 'Ваши действия появятся здесь.', myOperations: 'Мои операции', autosave: 'Автосохранение включено', noOperations: 'Операций пока нет.', transactionAnalysis: 'Анализ операций', distribution: 'Распределение', planning: 'ПЛАНИРОВАНИЕ', monthlyBudget: 'Месячный бюджет', budgetDescription: 'Укажите месячный лимит и отслеживайте остаток.', plannedMonthlyBudget: 'Планируемый месячный бюджет (€)', availableBudget: 'Доступный бюджет', noEnvelope: 'Лимит не задан', revenue: 'Доход', expenseLabel: 'Расход', noDescription: 'Без описания', entry: 'Доход', fixed: 'Постоянный', variable: 'Переменный', planned: 'Планируемая', total: 'Итого', noAccount: 'Нет пополненных счетов.', noCategory: 'Нет категорий.', operationCount: 'Количество операций' }
};
let language = localStorage.getItem('budgestion-language') || 'fr';
languageSelect.value = language;
const t = key => translations[language][key] || translations.fr[key] || key;

function applyTranslations() {
	document.documentElement.lang = language;
	document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
	document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
	if (language === 'fr') {
		document.querySelector('#type option[value="expense"]').textContent = 'Dépenses';
		document.querySelector('#type option[value="income"]').textContent = 'Recettes';
	}
	document.querySelector('#planned-label span').textContent = t(document.querySelector('#type').value === 'income' ? 'plannedIncome' : 'plannedExpense');
	document.querySelector('#chart-toggle').textContent = chartMode === 'bars' ? (language === 'fr' ? 'Vue circulaire' : language === 'en' ? 'Circular view' : language === 'he' ? 'תצוגה מעגלית' : 'Круговой вид') : (language === 'fr' ? 'Vue en colonnes' : language === 'en' ? 'Bar view' : language === 'he' ? 'תצוגת עמודות' : 'Вид столбцами');
}
let editingTransactionIndex = null;
let currency = localStorage.getItem('budgestion-currency') || 'EUR';
let chartMode = localStorage.getItem('budgestion-chart-mode') || 'bars';
let overviewSlide = 0;
const overviewSlides = 5;
let tutorialStep = 0;
let sliderPointerStart = null;
let sliderWheelDistance = 0;
let sliderWheelLocked = false;
let sliderWheelTimer = null;
currencySelect.value = currency;
accentColor.value = localStorage.getItem('budgestion-accent') || 'violet';
tabOrder.value = localStorage.getItem('budgestion-tab-order') || 'overview,transactions,budget';

function openDialog(dialog) {
	if (typeof dialog.showModal === 'function') dialog.showModal();
	else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
	if (typeof dialog.close === 'function') dialog.close();
	else dialog.removeAttribute('open');
}

function updateTutorial() {
	const [title, text, tip] = tutorialSteps[tutorialStep];
	tutorialTitle.textContent = title;
	tutorialText.textContent = text;
	tutorialTip.textContent = tip;
	tutorialStepLabel.textContent = `ÉTAPE ${tutorialStep + 1} SUR ${tutorialSteps.length}`;
	tutorialDots.forEach((dot, index) => dot.classList.toggle('active', index === tutorialStep));
	tutorialPrev.disabled = tutorialStep === 0;
	tutorialNext.textContent = tutorialStep === tutorialSteps.length - 1 ? 'Terminer' : 'Suivant';
}

function applyTabOrder() {
	const navigation = document.querySelector('.tabs');
	const orderedNames = tabOrder.value.split(',');
	orderedNames.forEach(name => {
		const tab = navigation.querySelector(`[data-tab="${name}"]`);
		if (tab) navigation.appendChild(tab);
	});
}

function applyAccent() {
	const colors = { violet: ['#7656c8', '#5f42ae', '#f0ebff'], bleu: ['#3978c8', '#285da2', '#e9f2ff'], vert: ['#398f70', '#247056', '#e7f6ef'], corail: ['#d86b58', '#b84d3e', '#fff0ed'] };
	const [accent, deep, soft] = colors[accentColor.value];
	document.documentElement.style.setProperty('--accent', accent);
	document.documentElement.style.setProperty('--accent-deep', deep);
	document.documentElement.style.setProperty('--accent-soft', soft);
}

document.querySelector('#open-tutorial').addEventListener('click', () => { tutorialStep = 0; updateTutorial(); openDialog(tutorialDialog); });
document.querySelector('#open-settings').addEventListener('click', () => openDialog(settingsDialog));
tutorialNext.addEventListener('click', () => { if (tutorialStep < tutorialSteps.length - 1) { tutorialStep += 1; updateTutorial(); } else closeDialog(tutorialDialog); });
tutorialPrev.addEventListener('click', () => { if (tutorialStep > 0) { tutorialStep -= 1; updateTutorial(); } });
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(document.querySelector(`#${button.dataset.closeDialog}`))));
accentColor.addEventListener('change', () => { localStorage.setItem('budgestion-accent', accentColor.value); applyAccent(); });
tabOrder.addEventListener('change', () => { localStorage.setItem('budgestion-tab-order', tabOrder.value); applyTabOrder(); });
document.querySelector('#reset-settings').addEventListener('click', () => { accentColor.value = 'violet'; tabOrder.value = 'overview,transactions,budget'; localStorage.removeItem('budgestion-accent'); localStorage.removeItem('budgestion-tab-order'); applyAccent(); applyTabOrder(); });
applyAccent();
applyTabOrder();

function formatMoney(value) {
	return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);
}

function parseCsvLine(line, separator) {
	const values = [];
	let value = '';
	let quoted = false;
	for (const character of line) {
		if (character === '"') quoted = !quoted;
		else if (character === separator && !quoted) { values.push(value.trim()); value = ''; }
		else value += character;
	}
	values.push(value.trim());
	return values;
}

function importCsv(text) {
	const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
	if (lines.length < 2) throw new Error('Fichier CSV vide');
	const separator = lines[0].includes(';') ? ';' : ',';
	const headers = parseCsvLine(lines[0], separator).map(header => header.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
	const findColumn = names => headers.findIndex(header => names.some(name => header.includes(name)));
	const amountIndex = findColumn(['montant', 'amount', 'somme', 'debit', 'credit']);
	if (amountIndex < 0) throw new Error('Colonne montant introuvable');
	const typeIndex = findColumn(['type', 'sens', 'nature']);
	const categoryIndex = findColumn(['categorie', 'category']);
	const accountIndex = findColumn(['compte', 'account']);
	const descriptionIndex = findColumn(['description', 'libelle', 'label', 'memo']);
	const dateIndex = findColumn(['date']);
	let imported = 0;
	lines.slice(1).forEach(line => {
		const columns = parseCsvLine(line, separator);
		const rawAmount = (columns[amountIndex] || '').replace(/[^0-9,.-]/g, '').replace(',', '.');
		const amount = Math.abs(Number(rawAmount));
		if (!amount) return;
		const rawType = typeIndex >= 0 ? (columns[typeIndex] || '').toLowerCase() : '';
		const isIncome = rawType.includes('credit') || rawType.includes('income') || rawType.includes('revenu') || Number(rawAmount) > 0;
		transactions.push({ type: isIncome ? 'income' : 'expense', amount, category: categoryIndex >= 0 ? columns[categoryIndex] || 'Autre' : 'Autre', account: accountIndex >= 0 ? columns[accountIndex] || 'Compte courant' : 'Compte courant', expenseKind: isIncome ? null : 'variable', planned: false, plannedDate: '', description: descriptionIndex >= 0 ? columns[descriptionIndex] || '' : '', date: dateIndex >= 0 ? columns[dateIndex] || '' : '' });
		imported += 1;
	});
	if (!imported) throw new Error('Aucune opération valide');
	renderBudget();
	renderOperations();
	logAction('Import CSV effectué', `${imported} opération${imported > 1 ? 's' : ''} importée${imported > 1 ? 's' : ''}`);
}

csvImport.addEventListener('change', event => {
	const [file] = event.target.files;
	if (!file) return;
	const reader = new FileReader();
	reader.addEventListener('load', () => {
		try { importCsv(String(reader.result)); }
		catch (error) { saveStatus.textContent = error.message; }
		csvImport.value = '';
	});
	reader.readAsText(file);
});

applyTranslations();

currencySelect.addEventListener('change', () => {
	currency = currencySelect.value;
	localStorage.setItem('budgestion-currency', currency);
	renderBudget();
	saveState('Devise mise à jour');
});

languageSelect.addEventListener('change', () => {
	language = languageSelect.value;
	localStorage.setItem('budgestion-language', language);
	applyTranslations();
	renderBudget();
	renderOperations();
	renderActions();
});

function moveOverview(direction) {
	overviewSlide = (overviewSlide + direction + overviewSlides) % overviewSlides;
	overviewTrack.style.transform = `translateX(-${overviewSlide * 100}%)`;
	overviewPosition.textContent = `${overviewSlide + 1} / ${overviewSlides}`;
}

overviewPrev.addEventListener('click', () => moveOverview(-1));
overviewNext.addEventListener('click', () => moveOverview(1));

overviewViewport.addEventListener('pointerdown', event => {
	sliderPointerStart = event.clientX;
	overviewViewport.setPointerCapture(event.pointerId);
});

overviewViewport.addEventListener('pointerup', event => {
	if (sliderPointerStart === null) return;
	const pointerDistance = event.clientX - sliderPointerStart;
	if (Math.abs(pointerDistance) > 45) moveOverview(pointerDistance < 0 ? 1 : -1);
	sliderPointerStart = null;
});

overviewViewport.addEventListener('pointercancel', () => { sliderPointerStart = null; });

overviewViewport.addEventListener('wheel', event => {
	const horizontalDistance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
	if (!horizontalDistance) return;
	event.preventDefault();
	if (sliderWheelLocked) return;
	sliderWheelDistance += horizontalDistance;
	if (Math.abs(sliderWheelDistance) >= 45) {
		moveOverview(sliderWheelDistance > 0 ? 1 : -1);
		sliderWheelDistance = 0;
		sliderWheelLocked = true;
		clearTimeout(sliderWheelTimer);
		sliderWheelTimer = setTimeout(() => { sliderWheelLocked = false; }, 550);
	}
}, { passive: false });

function loadState() {
	try {
		const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return {
			transactions: Array.isArray(state?.transactions) ? state.transactions : [],
			actions: Array.isArray(state?.actions) ? state.actions.map(action => ({ ...action, date: new Date(action.date) })) : [],
			categoryBudgets: state?.categoryBudgets && typeof state.categoryBudgets === 'object' ? state.categoryBudgets : {},
			categories: Array.isArray(state?.categories) ? state.categories : null,
			vehicle: state?.vehicle && typeof state.vehicle === 'object' ? state.vehicle : {}
		};
	} catch {
		return { transactions: [], actions: [] };
	}
}

function saveState(message = 'Sauvegarde automatique effectuée') {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, actions, categoryBudgets: categoryBudgetValues, categories: categoryNames, vehicle: vehicleData }));
		saveStatus.textContent = `${message} · ${new Date().toLocaleTimeString('fr-FR')}`;
	} catch {
		saveStatus.textContent = 'Sauvegarde locale indisponible';
	}
	pushToSupabase();}

function logAction(message, details = '') {
	actions.unshift({ message, details, date: new Date() });
	renderActions();
	saveState();
}

function renderActions() {
	emptyLog.hidden = actions.length > 0;
	actionLog.innerHTML = actions.map(({ message, details, date }) => `
		<li><strong>${message}</strong><span>${details}</span><time>${date.toLocaleTimeString('fr-FR')}</time></li>
	`).join('');
}

function renderBudget() {
	const income = transactions.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0);
	const expense = transactions.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0);
	const fixed = transactions.filter(item => item.type === 'expense' && item.expenseKind === 'fixed').reduce((total, item) => total + item.amount, 0);
	const variable = transactions.filter(item => item.type === 'expense' && item.expenseKind === 'variable').reduce((total, item) => total + item.amount, 0);
	document.querySelector('#income-total').textContent = formatMoney(income);
	document.querySelector('#expense-total').textContent = formatMoney(expense);
	document.querySelector('#fixed-total').textContent = formatMoney(fixed);
	document.querySelector('#variable-total').textContent = formatMoney(variable);
	document.querySelector('#balance').textContent = formatMoney(income - expense);
	renderChart(income, expense);
	renderInsights();
	renderCategoryBudgets();
}

function renderCategoryBudgets() {
	let plannedTotal = 0;
	let spentTotal = 0;
	categoryBudgets.innerHTML = categoryNames.map(category => {
		const spent = transactions.filter(item => item.type === 'expense' && item.category === category).reduce((total, item) => total + item.amount, 0);
		const budget = Number(categoryBudgetValues[category]) || 0;
		plannedTotal += budget;
		spentTotal += spent;
		const remaining = budget - spent;
		const percentage = budget ? Math.min(spent / budget * 100, 100) : 0;
		return `<div class="category-budget-row"><div class="category-budget-title"><strong>${category}</strong><span>${formatMoney(spent)} dépensés</span></div><label>Enveloppe<input class="category-budget-input" data-category="${category}" type="number" min="0" step="0.01" value="${budget || ''}" placeholder="0,00" /></label><div class="category-budget-status"><div class="budget-progress"><i style="width: ${percentage}%"></i></div><span class="${remaining < 0 ? 'over-budget' : ''}">${budget ? (remaining >= 0 ? `${formatMoney(remaining)} restants` : `${formatMoney(Math.abs(remaining))} dépassés`) : 'Aucune enveloppe'}</span></div></div>`;
	}).join('');
	categoryBudgets.querySelectorAll('.category-budget-input').forEach(input => input.addEventListener('input', event => {
		categoryBudgetValues[event.target.dataset.category] = event.target.value;
		saveState('Budget par catégorie enregistré');
		renderCategoryBudgets();
	}));
	monthlyPlannedTotal.textContent = formatMoney(plannedTotal);
	monthlySpentTotal.textContent = formatMoney(spentTotal);
	monthlyAvailableTotal.textContent = formatMoney(plannedTotal - spentTotal);
	monthlyAvailableTotal.classList.toggle('over-budget', plannedTotal - spentTotal < 0);
	renderCategoryManager();
}

function renderCategoryManager() {
	categoryManagerList.innerHTML = categoryNames.map((category, index) => `<div class="category-manager-row"><input value="${category}" data-category-index="${index}" aria-label="Nom de la catégorie ${category}" /><button class="rename-category" data-category-index="${index}" type="button">Renommer</button></div>`).join('');
	categoryManagerList.querySelectorAll('.rename-category').forEach(button => button.addEventListener('click', () => {
		const index = Number(button.dataset.categoryIndex);
		const input = categoryManagerList.querySelector(`input[data-category-index="${index}"]`);
		const nextName = input.value.trim();
		const previousName = categoryNames[index];
		if (!nextName || nextName === 'Salaire' || categoryNames.some((category, categoryIndex) => categoryIndex !== index && category.toLowerCase() === nextName.toLowerCase())) { input.value = previousName; return; }
		categoryNames[index] = nextName;
		if (categoryBudgetValues[previousName] !== undefined) {
			categoryBudgetValues[nextName] = categoryBudgetValues[previousName];
			delete categoryBudgetValues[previousName];
		}
		transactions.forEach(item => { if (item.category === previousName) item.category = nextName; });
		saveState('Catégorie renommée');
		renderBudget();
		renderOperations();
		renderCategoryOptions();
	}));
}

function renderCategoryOptions() {
	['category', 'quick-category'].forEach(id => {
		const select = document.querySelector(`#${id}`);
		const currentValue = select.value;
		select.innerHTML = categoryNames.map(category => `<option>${category}</option>`).join('');
		select.value = categoryNames.includes(currentValue) ? currentValue : categoryNames[0];
	});
}

addCategory.addEventListener('click', () => {
	const name = newCategory.value.trim();
	if (!name || name === 'Salaire' || categoryNames.some(category => category.toLowerCase() === name.toLowerCase())) return;
	categoryNames.push(name);
	newCategory.value = '';
	saveState('Catégorie ajoutée');
	renderCategoryOptions();
	renderCategoryBudgets();
});


const vehicleFields = {
	model: '#vehicle-model',
	plate: '#vehicle-plate',
	mileage: '#vehicle-mileage',
	insurer: '#vehicle-insurer',
	policy: '#vehicle-policy',
	premium: '#vehicle-premium',
	premiumFrequency: '#vehicle-premium-frequency',
	renewal: '#vehicle-renewal',
	fuelBudget: '#vehicle-fuel',
	inspection: '#vehicle-inspection'
};
const premiumMonths = { monthly: 1, quarterly: 3, yearly: 12 };
const premiumLabels = { monthly: 'mois', quarterly: 'trimestre', yearly: 'an' };

function formatDay(value) {
	return value ? new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR') : '';
}

function fillVehicleForm() {
	Object.entries(vehicleFields).forEach(([key, selector]) => {
		const field = document.querySelector(selector);
		if (vehicleData[key] !== undefined) field.value = vehicleData[key];
		else if (field.tagName === 'SELECT') field.value = 'monthly';
		else field.value = '';
	});
}

function renderVehicle() {
	const premium = Number(vehicleData.premium) || 0;
	const monthlyInsurance = premium / (premiumMonths[vehicleData.premiumFrequency] || 1);
	const fuel = Number(vehicleData.fuelBudget) || 0;
	const rows = [];
	if (vehicleData.model) rows.push(['Véhicule', vehicleData.model + (vehicleData.plate ? ` · ${vehicleData.plate}` : '')]);
	else if (vehicleData.plate) rows.push(['Immatriculation', vehicleData.plate]);
	if (vehicleData.mileage) rows.push(['Kilométrage', `${Number(vehicleData.mileage).toLocaleString('fr-FR')} km`]);
	if (vehicleData.insurer) rows.push(['Assurance', vehicleData.insurer + (vehicleData.policy ? ` · ${vehicleData.policy}` : '')]);
	if (premium) rows.push(['Prime', `${formatMoney(premium)} / ${premiumLabels[vehicleData.premiumFrequency] || 'mois'}`]);
	if (vehicleData.renewal) rows.push(["Échéance de l'assurance", formatDay(vehicleData.renewal)]);
	if (fuel) rows.push(['Budget carburant', `${formatMoney(fuel)} / mois`]);
	if (vehicleData.inspection) rows.push(['Prochain contrôle technique', formatDay(vehicleData.inspection)]);
	if (monthlyInsurance || fuel) rows.push(['Coût mensuel estimé', formatMoney(monthlyInsurance + fuel)]);
	vehicleSummary.innerHTML = rows.length
		? rows.map(([label, value]) => `<div class="insight-row"><span>${label}</span><strong>${value}</strong></div>`).join('')
		: '<p class="empty">Aucune information enregistrée.</p>';
}

document.querySelector('#edit-vehicle').addEventListener('click', () => { fillVehicleForm(); openDialog(vehicleDialog); });

vehicleForm.addEventListener('submit', event => {
	event.preventDefault();
	Object.entries(vehicleFields).forEach(([key, selector]) => {
		const value = document.querySelector(selector).value.trim();
		if (value) vehicleData[key] = value;
		else delete vehicleData[key];
	});
	saveState('Informations véhicule enregistrées');
	renderVehicle();
	logAction('Véhicule mis à jour', vehicleData.model || vehicleData.insurer || 'Informations enregistrées');
	closeDialog(vehicleDialog);
});

document.querySelector('#vehicle-reset').addEventListener('click', () => {
	Object.keys(vehicleFields).forEach(key => delete vehicleData[key]);
	fillVehicleForm();
	saveState('Informations véhicule effacées');
	renderVehicle();
	closeDialog(vehicleDialog);
});

function renderInsights() {
	const accounts = [...new Set(transactions.map(item => item.account || 'Compte courant'))];
	accountBalances.innerHTML = accounts.length ? accounts.map(account => {
			const value = transactions.filter(item => (item.account || 'Compte courant') === account).reduce((total, item) => total + (item.type === 'income' ? item.amount : -item.amount), 0);
			return `<div class="insight-row"><span>${account}</span><strong>${formatMoney(value)}</strong></div>`;
		}).join('') : `<p class="empty">${t('noAccount')}</p>`;

	const plannedItems = transactions.filter(item => item.type === 'expense' && item.planned);
	emptyPlanned.hidden = plannedItems.length > 0;
	plannedList.innerHTML = plannedItems.map(item => `<div class="insight-row"><span>${item.category}<small>${item.plannedDate ? ` · ${new Date(`${item.plannedDate}T00:00:00`).toLocaleDateString('fr-FR')}` : ''}</small></span><strong>${formatMoney(item.amount)}</strong></div>`).join('');
	const plannedIncome = transactions.filter(item => item.type === 'income' && item.planned);
	emptyPlannedIncome.hidden = plannedIncome.length > 0;
	plannedIncomeList.innerHTML = plannedIncome.map(item => `<div class="insight-row"><span>${item.category}<small>${item.plannedDate ? ` · ${new Date(`${item.plannedDate}T00:00:00`).toLocaleDateString('fr-FR')}` : ''}</small></span><strong>${formatMoney(item.amount)}</strong></div>`).join('');

	const categories = transactions.reduce((summary, item) => {
		summary[item.category] = (summary[item.category] || 0) + (item.type === 'expense' ? item.amount : 0);
		return summary;
	}, {});
	categorySummary.innerHTML = Object.entries(categories).length ? Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([category, value]) => `<div class="insight-row"><span>${category}</span><strong>${formatMoney(value)}</strong></div>`).join('') : `<p class="empty">${t('noCategory')}</p>`;
	const incomeCount = transactions.filter(item => item.type === 'income').length;
	const expenseCount = transactions.filter(item => item.type === 'expense').length;
	transactionAnalysis.innerHTML = `<div class="insight-row"><span>${t('operationCount')}</span><strong>${transactions.length}</strong></div><div class="insight-row"><span>${t('income')}</span><strong>${incomeCount}</strong></div><div class="insight-row"><span>${t('expense')}</span><strong>${expenseCount}</strong></div>`;
	budgetCategorySummary.innerHTML = Object.entries(categories).length ? Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([category, value]) => `<div class="insight-row"><span>${category}</span><strong>${formatMoney(value)}</strong></div>`).join('') : '';
}

function renderChart(income, expense) {
	if (chartMode === 'circle') {
		renderCircularChart(income, expense);
		return;
	}
	const maximum = Math.max(income, expense, 1);
	budgetChart.innerHTML = [
		['income', 'Revenus', income],
		['expense', 'Dépenses', expense]
	].map(([type, label, value]) => `
		<div class="chart-column">
			<strong>${formatMoney(value)}</strong>
			<div class="chart-track"><div class="chart-bar ${type}" style="height: ${Math.max(value / maximum * 100, value ? 4 : 0)}%"></div></div>
			<span>${label}</span>
		</div>
	`).join('');
}

function renderCircularChart(income, expense) {
	const total = income + expense;
	const incomeRatio = total ? income / total : 0;
	const expenseRatio = total ? expense / total : 0;
	budgetChart.innerHTML = `
		<div class="circle-chart" style="--income-degrees: ${incomeRatio * 360}deg" role="img" aria-label="Répartition : ${formatMoney(income)} de revenus et ${formatMoney(expense)} de dépenses">
			<div class="circle-chart-center"><strong>${formatMoney(total)}</strong><span>Total</span></div>
		</div>
		<div class="chart-legend">
			<div><i class="legend-swatch income"></i><span>Revenus</span><strong>${formatMoney(income)} (${Math.round(incomeRatio * 100)}%)</strong></div>
			<div><i class="legend-swatch expense"></i><span>Dépenses</span><strong>${formatMoney(expense)} (${Math.round(expenseRatio * 100)}%)</strong></div>
		</div>
	`;
}

function renderOperations() {
	emptyOperations.hidden = transactions.length > 0;
	operationsList.innerHTML = transactions.map((item, index) => `
		<article class="operation ${item.type}">
			<div><strong>${item.type === 'income' ? t('revenue') : t('expenseLabel')} · ${item.category || 'Autre'}</strong><span>${item.account || 'Compte courant'} · ${item.type === 'expense' ? (item.expenseKind === 'fixed' ? t('fixed') : t('variable')) : t('entry')}${item.planned ? ` · ${t('planned')}` : ''}${item.description ? ` · ${item.description}` : ''}</span></div>
			<strong class="operation-amount">${item.type === 'income' ? '+' : '-'}${formatMoney(item.amount)}</strong>
			<button class="edit-operation" type="button" data-index="${index}">Modifier</button>
		</article>
	`).join('');
	operationsList.querySelectorAll('.edit-operation').forEach(button => {
		button.addEventListener('click', () => startEditing(Number(button.dataset.index)));
	});
}

function startEditing(index) {
	const transaction = transactions[index];
	editingTransactionIndex = index;
	document.querySelector('#type').value = transaction.type;
	document.querySelector('#amount').value = transaction.amount;
	document.querySelector('#account').value = transaction.account || 'Compte courant';
	document.querySelector('#category').value = transaction.category || 'Autre';
	document.querySelector('#expense-kind').value = transaction.expenseKind || 'variable';
	planned.checked = Boolean(transaction.planned);
	plannedDateLabel.hidden = !planned.checked;
	expenseKindLabel.hidden = transaction.type !== 'expense';
	plannedLabel.querySelector('span').textContent = transaction.type === 'expense' ? t('plannedExpense') : t('plannedIncome');
	document.querySelector('#planned-date').value = transaction.plannedDate || '';
	document.querySelector('#description').value = transaction.description || '';
	formTitle.textContent = 'Modifier une opération';
	submitTransaction.textContent = 'Enregistrer les modifications';
	cancelEdit.hidden = false;
	document.querySelector('#transaction-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function stopEditing() {
	editingTransactionIndex = null;
	formTitle.textContent = 'Ajouter une opération';
	submitTransaction.textContent = "Ajouter l'opération";
	cancelEdit.hidden = true;
	form.reset();
	plannedLabel.querySelector('span').textContent = t('plannedExpense');
	expenseKindLabel.hidden = false;
	plannedDateLabel.hidden = true;
}

form.addEventListener('submit', event => {
	event.preventDefault();
	const type = document.querySelector('#type').value;
	const amount = Number(document.querySelector('#amount').value);
	const category = document.querySelector('#category').value;
	const account = document.querySelector('#account').value;
	const expenseKind = document.querySelector('#expense-kind').value;
	const isPlanned = planned.checked;
	const plannedDate = isPlanned ? document.querySelector('#planned-date').value : '';
	const description = document.querySelector('#description').value.trim();
	const wasEditing = editingTransactionIndex !== null;
	const transaction = { type, amount, category, account, expenseKind: type === 'expense' ? expenseKind : null, planned: isPlanned, plannedDate, description };
	if (wasEditing) {
		transactions[editingTransactionIndex] = transaction;
	} else {
		transactions.push(transaction);
	}
	saveState(transactions.length % 5 === 0 ? `Groupe de ${transactions.length} opérations enregistré` : 'Opération enregistrée');
	renderBudget();
	renderOperations();
	logAction(wasEditing ? 'Opération modifiée' : (type === 'income' ? 'Revenu ajouté' : 'Dépense ajoutée'), `${formatMoney(amount)} · ${category}${description ? ` · ${description}` : ''}`);
	stopEditing();
});

document.querySelector('#type').addEventListener('change', event => {
	const isExpense = event.target.value === 'expense';
	expenseKindLabel.hidden = !isExpense;
	plannedLabel.querySelector('span').textContent = isExpense ? t('plannedExpense') : t('plannedIncome');
	if (!isExpense) {
		planned.checked = false;
		plannedDateLabel.hidden = true;
	}
});

planned.addEventListener('change', () => {
	plannedDateLabel.hidden = !planned.checked;
});

cancelEdit.addEventListener('click', stopEditing);

chartToggle.addEventListener('click', () => {
	chartMode = chartMode === 'bars' ? 'circle' : 'bars';
	localStorage.setItem('budgestion-chart-mode', chartMode);
	chartToggle.textContent = chartMode === 'bars' ? 'Vue circulaire' : 'Vue en colonnes';
	renderBudget();
});

chartToggle.textContent = chartMode === 'bars' ? 'Vue circulaire' : 'Vue en colonnes';

document.querySelector('#clear-log').addEventListener('click', () => {
	actions.length = 0;
	renderActions();
	saveState('Journal effacé');
});

tabs.forEach(tab => tab.addEventListener('click', () => {
		tabs.forEach(item => item.classList.toggle('active', item === tab));
		panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.tab));
	}));

quickTransactionForm.addEventListener('submit', event => {
	event.preventDefault();
	const type = document.querySelector('#quick-type').value;
	const amount = Number(document.querySelector('#quick-amount').value);
	const category = document.querySelector('#quick-category').value;
	transactions.push({ type, amount, category, account: 'Compte courant', expenseKind: type === 'expense' ? 'variable' : null, planned: false, plannedDate: '', description: '' });
	saveState(transactions.length % 5 === 0 ? `Groupe de ${transactions.length} opérations enregistré` : 'Opération enregistrée');
	renderBudget();
	renderOperations();
	logAction(type === 'income' ? 'Revenu ajouté depuis l’aperçu' : 'Dépense ajoutée depuis l’aperçu', `${formatMoney(amount)} · ${category}`);
	quickTransactionForm.reset();
});

renderBudget();
renderOperations();
renderCategoryOptions();
renderVehicle();
logAction('Application ouverte', 'Journal prêt à enregistrer vos opérations');

async function pushToSupabase() {
	if (!syncCode) return;
	const { error } = await supabase.from('app_state').upsert({
		sync_code: syncCode,
		data: { transactions, actions, categoryBudgets: categoryBudgetValues, categories: categoryNames, vehicle: vehicleData },
		updated_at: new Date().toISOString()
	});
	if (error) console.error('Erreur de synchronisation :', error.message);
}

async function pullFromSupabase() {
	if (!syncCode) return;
	const { data, error } = await supabase.from('app_state').select('data').eq('sync_code', syncCode).maybeSingle();
	if (error) { console.error('Erreur de récupération :', error.message); return; }
	if (data) {
		transactions.length = 0;
		transactions.push(...data.data.transactions);
		actions.length = 0;
		actions.push(...data.data.actions.map(a => ({ ...a, date: new Date(a.date) })));
		Object.assign(categoryBudgetValues, data.data.categoryBudgets);
		Object.assign(vehicleData, data.data.vehicle);
		renderBudget();
		renderOperations();
		renderActions();
	}
}
document.querySelector('#apply-sync-code').addEventListener('click', () => {
	const input = document.querySelector('#sync-code-input').value.trim();
	if (!input) return;
	syncCode = input;
	localStorage.setItem(SYNC_KEY, syncCode);
	pullFromSupabase();
	pushToSupabase();
});
if (syncCode) pullFromSupabase();