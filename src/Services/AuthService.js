const USER_KEY = 'pbp_currentUser'; 
const USERS_LIST_KEY = 'pbp_users';

const getUsers = () => {
    const usersJson = localStorage.getItem(USERS_LIST_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

export const getCurrentUser = () => {
    return localStorage.getItem(USER_KEY);
};

export const signUp = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    if (!email || !email.includes('@')) {
        throw new Error("Παρακαλώ εισάγετε ένα έγκυρο email.");
    }
    if (password.length < 6) {
        throw new Error("Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες.");
    }
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        throw new Error("Αυτό το email είναι ήδη εγγεγραμμένο.");
    }

    const newUser = { 
        email, 
        password, 
        userId: `user-${Date.now()}` 
    };
    users.push(newUser);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    
    return { 
        success: true, 
        message: "Εγγραφή επιτυχής. Παρακαλώ συνδεθείτε."
    }; 
};

export const signIn = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const userId = user.userId;
        localStorage.setItem(USER_KEY, userId); 
        return { 
            success: true, 
            userId: userId
        }; 
    } else {
        throw new Error("Λανθασμένο email ή κωδικός."); 
    }
};

export const signOut = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(USER_KEY); 
    return { success: true };
};