import React, { useState } from 'react'; 
import CalendarApp from "./Components/CalendarApp"; 
import './Components/CalendarApp.css'; 
import Auth from './Components/Authentification/Auth';
import * as AuthService from './Services/AuthService'; 

const App = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

    const handleAuthSuccess = (userId) => {
        setCurrentUser(userId);
    };

    const handleSignOut = async () => {
        await AuthService.signOut();
        setCurrentUser(null);
    };

    return (
        <div className="container"> 
            {currentUser ? (
                <CalendarApp onSignOut={handleSignOut} />
            ) : (
                <Auth onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    )  
}

export default App