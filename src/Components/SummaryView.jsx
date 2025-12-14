import React, { useState, useEffect, useMemo } from 'react';
import * as ExpenseService from '../Services/ExpenseService'; 
import './SummaryView.css'; 

const SummaryView = ({ onBack, monthsOfYear }) => {
    
    const [allTotals, setAllTotals] = useState(null);
    const [filterType, setFilterType] = useState('month'); 
    const [filterValue, setFilterValue] = useState(''); 
    const [totalResult, setTotalResult] = useState('0.00');

   
    const getNewestKey = (totals, type) => {
        let keys = [];
        if (type === 'day') {
            keys = Object.keys(totals.byDay).sort().reverse();
        } else if (type === 'month') {
            keys = Object.keys(totals.byMonth).sort().reverse();
        } else if (type === 'year') {
            keys = Object.keys(totals.byYear).sort().reverse();
        }
        return keys.length > 0 ? keys[0] : '';
    };

  
    useEffect(() => {
        const totals = ExpenseService.calculateTotals();
        setAllTotals(totals);

        
        setFilterValue(getNewestKey(totals, 'month'));
    }, []);

  
    useEffect(() => {
        if (!allTotals || !filterValue) {
            setTotalResult('0.00');
            return;
        }

        let key = filterValue;
        let totalsMap = {};

        if (filterType === 'day') {
            totalsMap = allTotals.byDay;
        } else if (filterType === 'month') {
            totalsMap = allTotals.byMonth;
        } else if (filterType === 'year') {
            totalsMap = allTotals.byYear;
        }
        
        const result = totalsMap[key] || '0.00';
        setTotalResult(result);

    }, [filterType, filterValue, allTotals]);


       const getFilterOptions = () => {
        if (!allTotals) return [];

        let keys = [];
        if (filterType === 'day') {
            keys = Object.keys(allTotals.byDay).sort().reverse();
        } else if (filterType === 'month') {
            keys = Object.keys(allTotals.byMonth).sort().reverse();
        } else if (filterType === 'year') {
            keys = Object.keys(allTotals.byYear).sort().reverse();
        }
        
        return keys.map(key => {
            let label = key;
            if (filterType === 'month') {
                const [year, monthIndex] = key.split('-');
                const monthName = monthsOfYear[parseInt(monthIndex, 10) - 1];
                label = `${monthName}, ${year}`;
            }
            if (filterType === 'day') {
                const [year, monthIndex, day] = key.split('-');
                const monthNameShort = monthsOfYear[parseInt(monthIndex, 10) - 1].substring(0, 3);
                label = `${monthNameShort} ${day}, ${year}`;
            }
            return { value: key, label };
        });
    };
    
  
    const handleFilterTypeChange = (newType) => {
        setFilterType(newType);
      
        if (allTotals) {
            setFilterValue(getNewestKey(allTotals, newType));
        } else {
            setFilterValue('');
        }
    };


    return (
        <div className="summary-overlay">
            <div className="summary-popup">
                
                <h2>Συνοπτική Προβολή Εξόδων</h2>
                
                <div className="filter-type-buttons">
                    <button 
                        className={filterType === 'day' ? 'active' : ''}
                        onClick={() => handleFilterTypeChange('day')}>
                        Ημέρα
                    </button>
                    <button 
                        className={filterType === 'month' ? 'active' : ''}
                        onClick={() => handleFilterTypeChange('month')}>
                        Μήνας
                    </button>
                    <button 
                        className={filterType === 'year' ? 'active' : ''}
                        onClick={() => handleFilterTypeChange('year')}>
                        Έτος
                    </button>
                </div>

                <div className="filter-select-wrapper">
                    {getFilterOptions().length > 0 ? (
                        <select 
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="filter-select-dropdown"
                            size={Math.min(10, getFilterOptions().length)} 
                        >
                            {getFilterOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span style={{ color: '#a0a3a6' }}>Δεν υπάρχουν δεδομένα εξόδων.</span>
                    )}
                </div>

                <div className="total-summary-result">
                    Σύνολο: <span>{totalResult} €</span>
                </div>
                
                <button className="close-summary-popup" onClick={onBack}>
                    <i className="bx bx-x"></i>
                </button>
            </div>
        </div>
    );
}

export default SummaryView;