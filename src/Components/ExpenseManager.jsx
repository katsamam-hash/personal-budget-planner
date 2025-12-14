import React, { useState, useEffect, useMemo } from 'react';
import './CalendarApp.css';
import * as ExpenseService from '../Services/ExpenseService'; 

const formatDateToLocalISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ExpenseManager = ({ selectedDate, monthsOfYear, onSwitchToCategories, shouldOpenPopup, onPopupOpened }) => {
    
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]); 
    
    const [showExpensePopup, setShowExpensePopup] = useState(false);
    const [expensetext, setExpenseText] = useState('');
    const [inputHours, setInputHours] = useState('00');
    const [inputMinutes, setInputMinutes] = useState('00');
    const [editingExpense, setEditingExpense] = useState(null);
    const [expenseError, setExpenseError] = useState(null);
    
    const [selectedCategory, setSelectedCategory] = useState(''); 

    const [amountValue, setAmountValue] = useState(''); 
    const [timesValue, setTimesValue] = useState('1'); 
    
    const totalAmount = useMemo(() => {
        const amount = parseFloat(amountValue) || 0;
        const times = parseFloat(timesValue) || 0;
        return (amount * times).toFixed(2);
    }, [amountValue, timesValue]);
    
    useEffect(() => {
        const loadedCategories = ExpenseService.getAllCategories();
        setCategories(loadedCategories);
        setExpenses(ExpenseService.getAllExpenses());
        
        setShowExpensePopup(false);
        setEditingExpense(null);
        setExpenseText('');
        setInputHours('00');
        setInputMinutes('00');
        setExpenseError(null); 
        setAmountValue('');
        setTimesValue('1');
        
        if (loadedCategories.length > 0) {
            setSelectedCategory(loadedCategories[0].id);
        } else {
            setSelectedCategory('');
        }
    }, [selectedDate]); 
    
    useEffect(() => {
        if (selectedCategory && categories.length > 0) {
            const category = categories.find(c => c.id === selectedCategory);
            if (category && category.fixedCost) {
                setAmountValue(String(category.fixedCost));
                setTimesValue('1');
            } else {
                setAmountValue('');
                setTimesValue('1');
            }
        }
    }, [selectedCategory, categories]); 

    useEffect(() => {
        if (shouldOpenPopup) {
            handleOpenPopup();
            onPopupOpened(); 
        }
    }, [shouldOpenPopup]);
    
    const handleOpenPopup = () => {
        setEditingExpense(null);
        setExpenseText('');
        setInputHours('00');
        setInputMinutes('00');
        setExpenseError(null);
        setAmountValue(''); 
        setTimesValue('1'); 
        
        const loadedCategories = ExpenseService.getAllCategories();
        setCategories(loadedCategories); 
        
        if (loadedCategories.length > 0) {
            setSelectedCategory(loadedCategories[0].id);
        } else {
            setSelectedCategory('');
        }
        
        setShowExpensePopup(true);
    };
    
    const handleExpenseSubmit = () => {
        
        if (categories.length === 0 || !selectedCategory) {
            setExpenseError("Παρακαλώ επιλέξτε μια κατηγορία.");
            return;
        }
        
        const finalAmount = parseFloat(totalAmount);
        if (finalAmount <= 0 || isNaN(finalAmount)) {
            setExpenseError("Το υπολογισμένο ποσό πρέπει να είναι θετικός αριθμός.");
            return;
        }

        setExpenseError(null); 
        
        const timeString = `${String(inputHours).padStart(2, '0')}:${String(inputMinutes).padStart(2, '0')}`;
        
        const baseExpenseData = {
            date: formatDateToLocalISO(selectedDate),
            time: timeString,
            text: expensetext,
            amount: finalAmount,
            categoryId: selectedCategory, 
        };
        
        const expenseDataToSave = editingExpense
            ? { ...baseExpenseData, id: editingExpense.id }
            : baseExpenseData;
            
        ExpenseService.saveExpense(expenseDataToSave); 
        
        setExpenses(ExpenseService.getAllExpenses());
        
        setShowExpensePopup(false);
        setEditingExpense(null);
        setExpenseText('');
        setSelectedCategory(''); 
        setAmountValue(''); 
        setTimesValue('1'); 
    };

    const handleEditExpense = (expense) => {
        const [hours, minutes] = expense.time.split(':');
        setInputHours(hours);
        setInputMinutes(minutes);
        setExpenseText(expense.text);
        
        setSelectedCategory(expense.categoryId || ''); 
        
        setAmountValue(expense.amount || ''); 
        setTimesValue('1'); 
        
        setEditingExpense(expense);
        setShowExpensePopup(true);
    };

    const handleDeleteExpense = (expenseId) => {
        ExpenseService.deleteExpense(expenseId);
        setExpenses(ExpenseService.getAllExpenses());
    };

    const handleTimeChange = (e, type) => {
        const value = String(e.target.value).padStart(2, '0');
        if (type === 'hours') {
            setInputHours(value);
        } else {
            setInputMinutes(value);
        }
    };
    
    const expensesForSelectedDate = expenses.filter(
        (expense) => expense.date === formatDateToLocalISO(selectedDate)
    );

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Άγνωστη Κατηγορία';
    };
    
    const getExpenseCurrency = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category && category.currency ? category.currency.split('(')[1].replace(')', '').trim() : '€';
    };


    return (
        <div className="expense-manager">
            
            <div style={{ paddingBottom: '1rem' }}>
            </div>
            
            {showExpensePopup && (
                <div className="expense-popup">
                    
                    <button 
                        type="button" 
                        onClick={() => { setShowExpensePopup(false); onSwitchToCategories(); }} 
                        className="add-category-btn" 
                        style={{ marginBottom: '1rem' }} 
                    >
                        + Προσθήκη Κατηγορίας
                    </button>
                    
                    <div className="category-select-wrapper">
                        {categories.length > 0 ? (
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-select-dropdown"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} {cat.fixedCost ? `(${cat.fixedCost} ${cat.currency})` : ''}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span style={{ color: '#a0a3a6' }}>Δεν υπάρχουν κατηγορίες.</span>
                        )}
                    </div>

                    <div className="calculation-input-group">
                        
                        <div className="calculation-input-box">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                value={amountValue}
                                onChange={(e) => setAmountValue(e.target.value)}
                                className="fixed-cost-input no-arrows"
                            />
                            <span className="input-label">Amount</span>
                        </div>

                        <span className="multiplication-symbol">*</span>
                        
                        <div className="calculation-input-box">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Times"
                                value={timesValue}
                                onChange={(e) => setTimesValue(e.target.value)}
                                className="fixed-cost-input no-arrows"
                            />
                            <span className="input-label">Times</span>
                        </div>
                    </div>
                    <div className="total-amount-display">
                        Total: {totalAmount} {getExpenseCurrency(selectedCategory)}
                    </div>

                    <div className="time-input">
                        <div className="expense-popup-time">Ώρα</div>
                        <input type="number" name="hours" min={0} max={23} className="hours"
                            value={inputHours} onChange={(e) => handleTimeChange(e, 'hours')} />
                        <input type="number" name="minutes" min={0} max={59} className="minutes"
                            value={inputMinutes} onChange={(e) => handleTimeChange(e, 'minutes')} />
                    </div>
                    
                    <textarea
                        placeholder="Προσθέστε σχόλια εδώ!"
                        value={expensetext}
                        onChange={(e) => setExpenseText(e.target.value)}>
                    </textarea>
                    
                    {expenseError && <div className="auth-error-message" style={{textAlign: 'center'}}>{expenseError}</div>}
                    
                    <button className="expense-popup-btn" onClick={handleExpenseSubmit}>
                        {editingExpense ? 'Άλλαξε Έξοδα' : 'Πρόσθεσε Έξοδα'}
                    </button>
                    <button className="close-expense-popup" onClick={() => setShowExpensePopup(false)}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>
            )}

            {!showExpensePopup && (
                <div className="expense-list-container">
                    {expensesForSelectedDate.length > 0 ? (
                        expensesForSelectedDate.map((expense, index) => (
                            <div className="expense" key={index} style={{backgroundColor: '#95b7c7'}}>
                                
                                <div className="expense-date-wrapper">
                                    <div className="expense-display-line">
                                        <span className="expense-date">
                                            {(() => {
                                                const parts = expense.date.split('-'); 
                                                const year = parts[0];
                                                const monthIndex = parseInt(parts[1]) - 1; 
                                                const day = parseInt(parts[2]); 
                                                
                                                return (
                                                    monthsOfYear[monthIndex].substring(0, 3) + " " + 
                                                    day + ", " + 
                                                    year
                                                );
                                            })()}
                                        </span>
                                        <span className="expense-time">
                                            {expense.time}
                                        </span>
                                    </div>
                                    
                                    <div className="date-amount-separator"></div>

                                    <div className="expense-amount-display">
                                        {expense.amount} {getExpenseCurrency(expense.categoryId)}
                                    </div>
                                    
                                </div>
                                
                                <div className="expense-text">
                                    <span style={{fontSize: '0.9rem', color: '#323334', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem'}}>
                                        Κατηγ.: {getCategoryName(expense.categoryId)} 
                                    </span>
                                    {expense.text}
                                </div>
                                
                                <div className="expense-empty-cell"></div> 
                                
                                <div className="expense-buttons">
                                    <i className="bx bxs-edit-alt" onClick={() => handleEditExpense(expense)}></i>
                                    <i className="bx bxs-message-alt-x" onClick={() => handleDeleteExpense(expense.id)}></i>
                                </div>
                            </div>
                        ))
                    ) : (
                         <p style={{ 
                             color: '#a0a3a6', 
                             textAlign: 'center', 
                             marginTop: '1rem', 
                             fontSize: '1.5rem' 
                         }}>
                            Δεν υπάρχουν έξοδα για αυτήν την ημέρα.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpenseManager;