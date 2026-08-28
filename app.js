const STORAGE_KEY = 'budgestion-state';
const savedState = loadState();
const transactions = savedState.transactions;
const actions = savedState.actions;
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
const monthlyBudget = document.querySelector('#monthly-budget');
const availableBudget = document.querySelector('#available-budget');
const budgetProgressBar = document.querySelector('#budget-progress-bar');
const budgetProgressLabel = document.querySelector('#budget-progress-label');
const planned = document.querySelector('#planned');
const plannedLabel = document.querySelector('#planned-label');
const plannedDateLabel = document.querySelector('#planned-date-label');
const expenseKindLabel = document.querySelector('#expense-kind-label');
const chartToggle = document.querySelector('#chart-toggle');
const overviewTrack = document.querySelector('.overview');
const overviewPosition = document.querySelector('#overview-position');
const overviewPrev = document.querySelector('#overview-prev');
const overviewNext = document.querySelector('#overview-next');
const formTitle = document.querySelector('#form-title');
const submitTransaction = document.querySelector('#submit-transaction');
const cancelEdit = document.querySelector('#cancel-edit');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const quickAddTransaction = document.querySelector('#quick-add-transaction');
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
	document.querySelector('#planned-label span').textContent = t(document.querySelector('#type').value === 'income' ? 'plannedIncome' : 'plannedExpense');
	document.querySelector('#chart-toggle').textContent = chartMode === 'bars' ? (language === 'fr' ? 'Vue circulaire' : language === 'en' ? 'Circular view' : language === 'he' ? 'תצוגה מעגלית' : 'Круговой вид') : (language === 'fr' ? 'Vue en colonnes' : language === 'en' ? 'Bar view' : language === 'he' ? 'תצוגת עמודות' : 'Вид столбцами');
}
let editingTransactionIndex = null;
let currency = localStorage.getItem('budgestion-currency') || 'EUR';
let chartMode = localStorage.getItem('budgestion-chart-mode') || 'bars';
let overviewSlide = 0;
const overviewSlides = 5;
monthlyBudget.value = localStorage.getItem('budgestion-monthly-budget') || '';
currencySelect.value = currency;
applyTranslations();

function formatMoney(value) {
	return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);
}

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

function loadState() {
	try {
		const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return {
			transactions: Array.isArray(state?.transactions) ? state.transactions : [],
			actions: Array.isArray(state?.actions) ? state.actions.map(action => ({ ...action, date: new Date(action.date) })) : []
		};
	} catch {
		return { transactions: [], actions: [] };
	}
}

function saveState(message = 'Sauvegarde automatique effectuée') {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, actions }));
		saveStatus.textContent = `${message} · ${new Date().toLocaleTimeString('fr-FR')}`;
	} catch {
		saveStatus.textContent = 'Sauvegarde locale indisponible';
	}
}

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
	renderMonthlyBudget(expense);
}

function renderMonthlyBudget(expense) {
	const budget = Number(monthlyBudget.value) || 0;
	const remaining = budget - expense;
	availableBudget.textContent = formatMoney(remaining);
	availableBudget.classList.toggle('negative', remaining < 0);
	const percentage = budget ? Math.min(expense / budget * 100, 100) : 0;
	budgetProgressBar.style.width = `${percentage}%`;
	budgetProgressLabel.textContent = budget ? `${Math.round(percentage)}% ${language === 'fr' ? "de l'enveloppe utilisée" : language === 'en' ? 'of allowance used' : language === 'he' ? 'מהמסגרת נוצלה' : 'лимита использовано'}` : t('noEnvelope');
}

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

quickAddTransaction.addEventListener('click', () => {
	const transactionsTab = document.querySelector('.tab[data-tab="transactions"]');
	transactionsTab.click();
	document.querySelector('#amount').focus();
});

monthlyBudget.addEventListener('input', () => {
	localStorage.setItem('budgestion-monthly-budget', monthlyBudget.value);
	renderBudget();
});

renderBudget();
renderOperations();
logAction('Application ouverte', 'Journal prêt à enregistrer vos opérations');
