import React, { useState } from 'react';
import { signIn, signUp } from '../../Services/AuthService'; 
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null); 
    const [message, setMessage] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    const toggleMode = () => {
        setIsSignIn(!isSignIn);
        setError(null);
        setMessage(null);
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);
        
        try {
            let result;
            
            if (isSignIn) {
                result = await signIn(email, password);
            } else {
                result = await signUp(email, password);
            }

            if (result.success) {
                if (isSignIn) {
                    onAuthSuccess(result.userId);
                } else {
                    setMessage(result.message); 
                    setIsSignIn(true);
                    setEmail('');
                    setPassword('');
                }
            }
        } catch (err) {
            setError(err.message || (isSignIn ? "Αποτυχία σύνδεσης." : "Αποτυχία εγγραφής."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">           
            <div className="auth-title-wrapper">
                <h1 className="heading">pBp</h1> 
                <h3>Personal Budget Planner</h3>
            </div>           
            <h3 className="auth-heading">{isSignIn ? 'Σύνδεση' : 'Εγγραφή'}</h3>
            <form onSubmit={handleSubmit} className="auth-form">
                
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                    required 
                    className="auth-input"
                    disabled={isLoading}
                />                
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Κωδικός"
                    required 
                    className="auth-input"
                    disabled={isLoading}
                />                
                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Φόρτωση...' : (isSignIn ? 'Είσοδος' : 'Δημιουργία Λογαριασμού')}
                </button>
            </form>
            
            {error && <div className="auth-error-message">{error}</div>}
            
            {message && <div className="auth-success-message">{message}</div>} 
            
            <button className="toggle-auth-btn" onClick={toggleMode} disabled={isLoading}>
                {isSignIn ? (
                    <>Δεν έχετε λογαριασμό; <span className="large-word"> Εγγραφή </span></> ): (<>Έχετε λογαριασμό;<span className="large-word"> Σύνδεση</span></>)}
            </button>
        </div>
    );
};

export default Auth;