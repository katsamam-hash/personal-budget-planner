const CATEGORIES_KEY = 'pbp_categories';
const EXPENSES_KEY = 'pbp_expenses';

const getData = (key) => {
    const dataJson = localStorage.getItem(key);
    
    if (!dataJson) {
        return [];
    }
    try {
        const data = JSON.parse(dataJson);       
        return Array.isArray(data) ? data : []; 
    } catch (e) {
        console.error("Error parsing data from localStorage for key:", key, e);
        return [];
    }
};

const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};


export const getAllCategories = () => {
    return getData(CATEGORIES_KEY);
};

export const saveCategory = (categoryData) => {
    const categories = getData(CATEGORIES_KEY);
    
    if (!categoryData.name || categoryData.name.trim().length > 20 || categoryData.name.trim().length === 0) {
        throw new Error("Το όνομα της κατηγορίας πρέπει να είναι 1-20 χαρακτήρες.");
    }
    
    let savedCategory;

    if (categoryData.id) {
        const index = categories.findIndex(c => c.id === categoryData.id);
        if (index > -1) {
            categories[index] = { ...categories[index], ...categoryData };
            savedCategory = categories[index];
        }
    } else {
        savedCategory = {
            id: Date.now().toString(),
            name: categoryData.name,
            fixedCost: categoryData.fixedCost || null,
            currency: categoryData.currency || 'EUR (€)', 
        };
        categories.push(savedCategory);
    }

    saveData(CATEGORIES_KEY, categories);
    return savedCategory;
};

export const deleteCategory = (categoryId) => {
    let categories = getData(CATEGORIES_KEY);
    const initialLength = categories.length;
    
    categories = categories.filter(c => c.id !== categoryId);
    
    saveData(CATEGORIES_KEY, categories);
    return categories.length < initialLength;
};


export const getAllExpenses = () => {
    return getData(EXPENSES_KEY);
};

export const saveExpense = (expenseData) => {
    let expenses = getData(EXPENSES_KEY);
    
    let savedExpense;

    if (expenseData.id) {
        const index = expenses.findIndex(e => e.id === expenseData.id);
        if (index > -1) {
            expenses[index] = { ...expenses[index], ...expenseData };
            savedExpense = expenses[index];
        }
    } else {
        savedExpense = { id: Date.now().toString(), ...expenseData };
        expenses.push(savedExpense);
    }
    
    saveData(EXPENSES_KEY, expenses);
    return savedExpense;
};

export const deleteExpense = (expenseId) => {
    let expenses = getData(EXPENSES_KEY);
    const initialLength = expenses.length;
    
    expenses = expenses.filter(e => e.id !== expenseId); 
    
    saveData(EXPENSES_KEY, expenses);
    return expenses.length < initialLength;
};

export const getSummaryByPeriod = (periodType, dateString) => {
    const expenses = getAllExpenses();
    
    const total = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    return total.toFixed(2); 
};

export const calculateTotals = () => {
    const expenses = getAllExpenses();
    const totals = {
        byDay: {},
        byMonth: {},
        byYear: {},
    };

    expenses.forEach(expense => {
        const [year, month, day] = expense.date.split('-');
        const amount = parseFloat(expense.amount) || 0;

        if (!totals.byYear[year]) {
            totals.byYear[year] = 0;
        }
        totals.byYear[year] += amount;

        const yearMonth = `${year}-${month}`;
        if (!totals.byMonth[yearMonth]) {
            totals.byMonth[yearMonth] = 0;
        }
        totals.byMonth[yearMonth] += amount;

     
        const yearMonthDay = `${year}-${month}-${day}`;
        if (!totals.byDay[yearMonthDay]) {
            totals.byDay[yearMonthDay] = 0;
        }
        totals.byDay[yearMonthDay] += amount;
    });

  
    const formatTotals = (data) => {
        const formatted = {};
        for (const key in data) {
            formatted[key] = data[key].toFixed(2);
        }
        return formatted;
    };

    return {
        byDay: formatTotals(totals.byDay),
        byMonth: formatTotals(totals.byMonth),
        byYear: formatTotals(totals.byYear),
    };
};