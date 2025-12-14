import React, { useState, useEffect } from 'react';
import * as ExpenseService from '../Services/ExpenseService'; 
import './CategoryManager.css'; 

const CategoryManager = ({ onBackToCalendar }) => {
    
  
    const [categories, setCategories] = useState([]);
    
    const [name, setName] = useState('');
    const [fixedCost, setFixedCost] = useState(''); 
    const [editingCategory, setEditingCategory] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setCategories(ExpenseService.getAllCategories());
    };
    
    const resetForm = () => {
        setName('');
        setFixedCost('');
        setEditingCategory(null);
        setError(null);
    };
    
    const handleSaveCategory = (e) => {
        e.preventDefault();
        setError(null);

        const categoryData = {
            id: editingCategory ? editingCategory.id : null,
            name: name.trim(),
            fixedCost: fixedCost ? parseFloat(fixedCost) : null,
            currency: 'EUR (€)', 
        };

        try {
            ExpenseService.saveCategory(categoryData); 
            loadCategories();
            resetForm(); 
            
        } catch (err) {
            setError(err.message); 
        }
    };
    
    const handleEditClick = (category) => {
        setName(category.name);
        setFixedCost(category.fixedCost || '');
        setEditingCategory(category);
        
        document.querySelector('.category-manager').scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (categoryId) => {
        if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν την κατηγορία;')) {
            ExpenseService.deleteCategory(categoryId);
            loadCategories();
        }
    };

    return (
        <div className="category-manager">
           
            <div className="category-header">
                <i className="bx bx-arrow-back" onClick={onBackToCalendar}></i>
                <h2 className="category-heading">Διαχείριση Κατηγοριών</h2>
            </div>
            
            <div className="category-list-wrapper">
            
                <div className="category-form-popup">
                    <h3 style={{ color: '#ddd' }}>
                        {editingCategory ? 'Επεξεργασία Κατηγορίας' : 'Δημιουργία Νέας'}
                    </h3>
                    
                    <form onSubmit={handleSaveCategory} className="category-form-inner">
                        <input 
                            type="text" 
                            placeholder="Όνομα Κατηγορίας (max 20 χαρακτήρες)" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={20}
                            required
                            className="form-input"
                        />
                        
                        <div className="fixed-cost-input-wrapper">
                            <input 
                                type="number" 
                                placeholder="Εισάγετε Κόστος (προαιρετικό)"
                                value={fixedCost}
                                onChange={(e) => setFixedCost(e.target.value)}
                                className="form-input cost-input"
                                step="0.01"
                            />
                            <span className="currency-symbol">€</span> 
                        </div>
                       
                        <button type="submit" className="form-submit-btn">
                            {editingCategory ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Κατηγορίας'}
                        </button>
                        {editingCategory && (
                            <button type="button" onClick={resetForm} className="form-cancel-btn">
                                Ακύρωση Επεξεργασίας
                            </button>
                        )}
                    </form>
                    {error && <div className="category-error">{error}</div>}
                </div>


                <h3 className="list-heading">Υπάρχουσες Κατηγορίες</h3>
                <div className="category-list">
                    {categories.length === 0 ? (
                        <p className="no-categories">Δεν έχουν οριστεί κατηγορίες ακόμα.</p>
                    ) : (
                        categories.map(category => (
                            <div key={category.id} className="category-item">
                                <span className="category-name">{category.name}</span>
                                <span className="category-cost">
                                    {category.fixedCost ? `${category.fixedCost} EUR (€)` : 'Μη-Πάγιο'}
                                </span>
                                <div className="category-actions">
                                    <i className="bx bxs-edit-alt" onClick={() => handleEditClick(category)}></i>
                                    <i className="bx bxs-trash" onClick={() => handleDeleteClick(category.id)}></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;