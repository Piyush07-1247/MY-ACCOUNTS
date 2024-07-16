const navigateTo = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    updateSummary(); // Ensure summary is updated on every navigation
}

const updateSummary = () => {
    const totalFdAmount = savings.reduce((sum, acc) => sum + acc.fixedDeposit, 0);
    const availableSavings = savings.reduce((sum, acc) => sum + acc.savingsAmount, 0);
    const idealAvailableCcLimit = creditCards.reduce((sum, cc) => sum + (cc.limit / 2 - cc.amountSpent), 0);

    document.getElementById('total-fd-amount').textContent = totalFdAmount;
    document.getElementById('available-savings').textContent = availableSavings;
    document.getElementById('ideal-available-cc-limit').textContent = idealAvailableCcLimit;
}

let fixedDeposits = JSON.parse(localStorage.getItem('fixedDeposits')) || [];
let savings = JSON.parse(localStorage.getItem('savings')) || [];
let creditCards = JSON.parse(localStorage.getItem('creditCards')) || [];

const saveData = () => {
    localStorage.setItem('fixedDeposits', JSON.stringify(fixedDeposits));
    localStorage.setItem('savings', JSON.stringify(savings));
    localStorage.setItem('creditCards', JSON.stringify(creditCards));
}

const renderCreditCardEntries = () => {
    const container = document.getElementById('credit-card-entries');
    container.innerHTML = '';
    creditCards.forEach((cc, index) => {
        const entry = document.createElement('div');
        entry.classList.add('entry');
        entry.innerHTML = `
            <h3>${cc.name}</h3>
            <p>Credit Card Limit: ${cc.limit}</p>
            <p>Ideal Credit Card Limit: ${cc.limit / 2}</p>
            <p>Credit Card Amount Spent: ${cc.amountSpent}</p>
            <p>Credit Card Amount Bill: ${cc.amountBill}</p>
            <p>Available Limit: ${cc.limit - cc.amountSpent}</p>
            <p>Ideal Available Limit: ${cc.limit / 2 - cc.amountSpent}</p>
            <button class="edit" onclick="editCreditCardEntry(${index})">Edit</button>
            <button onclick="deleteCreditCardEntry(${index})">Delete</button>
        `;
        container.appendChild(entry);
    });
    updateSummary();
}

const renderSavingsEntries = () => {
    const container = document.getElementById('savings-entries');
    container.innerHTML = '';
    savings.forEach((acc, index) => {
        const entry = document.createElement('div');
        entry.classList.add('entry');
        entry.innerHTML = `
            <h3>${acc.name}</h3>
            <p>Savings Amount Available: ${acc.savingsAmount}</p>
            <p>Fixed Deposit: ${acc.fixedDeposit} (Maturity: ${acc.maturityDate})</p>
            <button class="edit" onclick="editSavingsEntry(${index})">Edit</button>
            <button onclick="deleteSavingsEntry(${index})">Delete</button>
        `;
        container.appendChild(entry);
    });
    updateSummary();
}

const addCreditCardEntry = () => {
    const name = document.getElementById('cc-name').value;
    const limit = parseFloat(document.getElementById('cc-limit').value);
    const amountSpent = parseFloat(document.getElementById('cc-amount-spent').value);
    const amountBill = parseFloat(document.getElementById('cc-amount-bill').value);

    if (name && limit && amountSpent !== null && amountBill !== null) {
        creditCards.push({
            name,
            limit,
            amountSpent,
            amountBill
        });
        saveData();
        renderCreditCardEntries();
        document.getElementById('cc-name').value = '';
        document.getElementById('cc-limit').value = '';
        document.getElementById('cc-amount-spent').value = '';
        document.getElementById('cc-amount-bill').value = '';
    }
}

const addSavingsEntry = () => {
    const name = document.getElementById('savings-name').value;
    const savingsAmount = parseFloat(document.getElementById('savings-amount').value);
    const fixedDeposit = parseFloat(document.getElementById('fd-amount').value);
    const maturityDate = document.getElementById('fd-maturity-date').value;

    if (name && savingsAmount && fixedDeposit && maturityDate) {
        savings.push({
            name,
            savingsAmount,
            fixedDeposit,
            maturityDate
        });
        saveData();
        renderSavingsEntries();
        document.getElementById('savings-name').value = '';
        document.getElementById('savings-amount').value = '';
        document.getElementById('fd-amount').value = '';
        document.getElementById('fd-maturity-date').value = '';
    }
}

const editCreditCardEntry = (index) => {
    const cc = creditCards[index];
    const newName = prompt('Enter new name:', cc.name);
    const newLimit = prompt('Enter new limit:', cc.limit);
    const newAmountSpent = prompt('Enter new amount spent:', cc.amountSpent);
    const newAmountBill = prompt('Enter new amount bill:', cc.amountBill);
    
    if (newName !== null && newLimit !== null && newAmountSpent !== null && newAmountBill !== null) {
        cc.name = newName;
        cc.limit = parseFloat(newLimit);
        cc.amountSpent = parseFloat(newAmountSpent);
        cc.amountBill = parseFloat(newAmountBill);
        saveData();
        renderCreditCardEntries();
    }
}

const deleteCreditCardEntry = (index) => {
    creditCards.splice(index, 1);
    saveData();
    renderCreditCardEntries();
}

const editSavingsEntry = (index) => {
    const acc = savings[index];
    const newName = prompt('Enter new name:', acc.name);
    const newSavingsAmount = prompt('Enter new savings amount:', acc.savingsAmount);
    const newFixedDeposit = prompt('Enter new fixed deposit:', acc.fixedDeposit);
    const newMaturityDate = prompt('Enter new maturity date:', acc.maturityDate);
    
    if (newName !== null && newSavingsAmount !== null && newFixedDeposit !== null && newMaturityDate !== null) {
        acc.name = newName;
        acc.savingsAmount = parseFloat(newSavingsAmount);
        acc.fixedDeposit = parseFloat(newFixedDeposit);
        acc.maturityDate = newMaturityDate;
        saveData();
        renderSavingsEntries();
    }
}

const deleteSavingsEntry = (index) => {
    savings.splice(index, 1);
    saveData();
    renderSavingsEntries();
}

const clearUserData = () => {
    if (confirm("Are you sure you want to clear all data?")) {
        localStorage.removeItem('fixedDeposits');
        localStorage.removeItem('savings');
        localStorage.removeItem('creditCards');
        fixedDeposits = [];
        savings = [];
        creditCards = [];
        renderCreditCardEntries();
        renderSavingsEntries();
        updateSummary();
    }
}

// Initialize the first page as active and render stored data
navigateTo('summary-page');
renderCreditCardEntries();
renderSavingsEntries();
