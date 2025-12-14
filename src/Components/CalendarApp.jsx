import React, { useState } from 'react';
import './CalendarApp.css'; 
import { signOut } from '../Services/AuthService';
import ExpenseManager from './ExpenseManager';
import CategoryManager from './CategoryManager'; 
import SummaryView from './SummaryView'; 

const CalendarApp = ({ onSignOut }) => {
    
    
    const daysOfWeek = ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ']
    const monthsOfYear = [
        'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
        'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
    ]

  
    const currentDate = new Date()
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); 

    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [currentYear, setCurrentDate] = useState(currentDate.getFullYear())
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentView, setCurrentView] = useState('calendar'); 
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);    
    const [shouldOpenPopup, setShouldOpenPopup] = useState(false); 

    
    const handleCategoryIconClick = () => {
        setShouldOpenPopup(false); 
        setCurrentView('categories');
        setIsSummaryOpen(false); 
    };

    const handleBackToExpensePopup = () => {
        setShouldOpenPopup(true);
        setCurrentView('calendar');
        setIsSummaryOpen(false);
    };
    
    const handleAddIconClick = () => {
        setCurrentView('calendar');
        setShouldOpenPopup(true); 
        setIsSummaryOpen(false);
    };
    
    const handleSummaryIconClick = () => {
        setIsSummaryOpen(true);
        setCurrentView('calendar'); 
    };

    const prevMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentDate(newYear);
        setSelectedDate(new Date(newYear, newMonth, 1));
    }
    
    const nextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentDate(newYear);
        setSelectedDate(new Date(newYear, newMonth, 1));
    }

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day))
    }
    
  
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const renderCalendar = () => (
         <div className="calendar-app">
            <div className="calendar-title-wrapper">
                <h1 className="heading">pBp</h1>
                <h3>Personal Budget Planner</h3>
                
             
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, display: 'flex', columnGap: '1rem' }}> 
                    
                       <i className="bx bx-show-alt" 
                       onClick={handleSummaryIconClick} 
                       style={{ 
                           fontSize: '3rem', 
                           color: '#83b3d1', 
                           cursor: 'pointer',
                           padding: '1rem',
                           backgroundColor: '#373f47',
                           borderRadius: '50%'
                       }}
                    ></i>
                    
                
                    <i className="bx bx-plus" 
                       onClick={handleAddIconClick} 
                       style={{ 
                           fontSize: '3rem', 
                           color: '#83b3d1', 
                           cursor: 'pointer',
                           padding: '1rem',
                           backgroundColor: '#373f47',
                           borderRadius: '50%'
                       }}
                    ></i>
                    
                 
                    <i className="bx bx-log-out" 
                       onClick={onSignOut} 
                       style={{ 
                           fontSize: '3rem', 
                           color: '#ddd', 
                           cursor: 'pointer',
                           padding: '1rem',
                           backgroundColor: '#373f47',
                           borderRadius: '50%'
                       }}
                    ></i>
                </div>

                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[currentMonth]},</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <i className="bx bx-chevron-left" onClick={prevMonth}></i>
                        <i className="bx bx-chevron-right" onClick={nextMonth}></i>
                    </div>
                </div>
                
                 <div className="weekdays">
                    {daysOfWeek.map((day => <span key={day}>{day}</span>))}
                 </div>
                 
                 <div className="days">
                    {Array.from({length: firstDayOfMonth}).map((_, index) => (
                        <span key={`empty-${index}`} className="empty"></span>
                    ))}
                    {Array.from({length: daysInMonth}).map((_, index) => {
                        const day = index + 1;
                        const isToday = (
                            day === today.getDate() && 
                            currentMonth === today.getMonth() && 
                            currentYear === today.getFullYear()
                        );
                        const isSelected = (
                            day === selectedDate.getDate() && 
                            currentMonth === selectedDate.getMonth() && 
                            currentYear === selectedDate.getFullYear()
                        );

                        let className = '';
                        if (isToday) {
                            className = 'current-day';
                        }
                        if (isSelected) {
                            className += (className ? ' ' : '') + 'current-day-selected';
                        }

                        return (
                            <span 
                                key={day} 
                                className={className.trim()}
                                onClick={() => handleDayClick(day)}
                            >                    
                                {day}
                            </span>
                        );
                    })}
                 </div>
            </div>
            
            <ExpenseManager 
                selectedDate={selectedDate} 
                monthsOfYear={monthsOfYear}
                onSwitchToCategories={handleCategoryIconClick}
                shouldOpenPopup={shouldOpenPopup} 
                onPopupOpened={() => setShouldOpenPopup(false)} 
            />
            
            
            {isSummaryOpen && (
                <SummaryView 
                    onBack={() => setIsSummaryOpen(false)} 
                    monthsOfYear={monthsOfYear}
                />
            )}
            
        </div>
    );
    
    return (
        <div className="container"> 
            {currentView === 'calendar' && renderCalendar()}
            {currentView === 'categories' && 
                <CategoryManager 
                    onBackToCalendar={handleBackToExpensePopup} 
                />
            }
        </div>
    );
}

export default CalendarApp