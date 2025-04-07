// Future JavaScript logic can go here 

// Simple Authentication Simulation
const checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop(); // Get filename (e.g., 'index.html' or 'app.html')

    if (currentPage === 'app.html' && !isLoggedIn) {
        console.log('Not logged in, redirecting to index.html');
        window.location.href = 'index.html';
    } else if (currentPage === 'index.html' && isLoggedIn) {
        console.log('Already logged in, redirecting to app.html');
        window.location.href = 'app.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Run auth check as soon as DOM is ready

    // --- Main Page Elements ---
    const googleSignupButton = document.querySelector('.container .social-signup.google'); // Be more specific
    const appleSignupButton = document.querySelector('.container .social-signup.apple');   // Be more specific
    const createAccountButton = document.querySelector('.container .create-account'); // Be more specific
    const signinButton = document.querySelector('.container .sign-in');             // Be more specific

    // --- Create Account Modal Elements ---
    const createAccountModal = document.getElementById('create-account-modal');
    const createAccountCloseBtn = createAccountModal.querySelector('.close-modal-btn');
    const createAccountForm = document.getElementById('create-account-form');

    // --- Sign In Modal Elements ---
    const signinModal = document.getElementById('sign-in-modal');
    const signinCloseBtn = signinModal.querySelector('.close-modal-btn');
    const signinForm = document.getElementById('sign-in-form');
    const forgotPasswordBtn = signinModal.querySelector('.forgot-password-btn');
    const openSignupLink = signinModal.querySelector('.open-signup-link');
    // Reuse Google/Apple buttons from Sign In modal if needed (or select them specifically)
    const googleSigninBtnModal = signinModal.querySelector('.social-signup.google');
    const appleSigninBtnModal = signinModal.querySelector('.social-signup.apple');


    // --- Helper Functions ---
    const showModal = (modal) => {
        if (modal) modal.classList.remove('hidden');
    };
    const hideModal = (modal) => {
        if (modal) modal.classList.add('hidden');
    };

    // --- Event Listeners for Main Page Buttons ---

    if (googleSignupButton) {
         googleSignupButton.addEventListener('click', () => {
            alert('Initiating Google Sign-up (from main page)...');
            // TODO: Implement actual Google Sign-up logic
        });
    }

    if (appleSignupButton) {
        appleSignupButton.addEventListener('click', () => {
            alert('Initiating Apple Sign-up (from main page)...');
            // TODO: Implement actual Apple Sign-up logic
        });
    }

    // Show Create Account Modal
    if (createAccountButton) {
        createAccountButton.addEventListener('click', () => showModal(createAccountModal));
    }

    // Show Sign In Modal
    if (signinButton) {
        signinButton.addEventListener('click', () => showModal(signinModal));
    }

    // --- Event Listeners for Create Account Modal ---

    // Hide Create Account Modal (Close Button)
    if (createAccountCloseBtn) {
        createAccountCloseBtn.addEventListener('click', () => hideModal(createAccountModal));
    }

    // Hide Create Account Modal (Clicking Overlay)
    if (createAccountModal) {
        createAccountModal.addEventListener('click', (event) => {
            if (event.target === createAccountModal) hideModal(createAccountModal);
        });
    }

    // Handle Create Account Form Submission (Simulate Login on Success)
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            alert('Simulating successful sign up...');
            // TODO: Implement actual form submission (validation, API call)
            localStorage.setItem('isLoggedIn', 'true'); // Simulate login
            window.location.href = 'app.html'; // Redirect to app
        });
    }

    // --- Event Listeners for Sign In Modal ---

     // Hide Sign In Modal (Close Button)
    if (signinCloseBtn) {
        signinCloseBtn.addEventListener('click', () => hideModal(signinModal));
    }

    // Hide Sign In Modal (Clicking Overlay)
    if (signinModal) {
        signinModal.addEventListener('click', (event) => {
            if (event.target === signinModal) hideModal(signinModal);
        });
    }

    // Handle Sign In Form Submission ("Next" button) - Simulate Login
    if (signinForm) {
        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const identifier = signinForm.querySelector('#identifier').value;
            alert(`Simulating login for: ${identifier}...`);
            // TODO: Implement identifier check and password step
            // Simulate successful login after some checks (replace alert)
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'app.html';
        });
    }

    // Handle Forgot Password Button
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            alert('Redirecting to password reset flow (not implemented)...');
            // TODO: Implement password reset logic
        });
    }

    // Handle Google Sign In (from Modal) - Simulate Login
    if (googleSigninBtnModal) {
        googleSigninBtnModal.addEventListener('click', () => {
             alert('Simulating Google Sign-in...');
             localStorage.setItem('isLoggedIn', 'true');
             window.location.href = 'app.html';
        });
    }
    // Handle Apple Sign In (from Modal) - Simulate Login
    if (appleSigninBtnModal) {
        appleSigninBtnModal.addEventListener('click', () => {
             alert('Simulating Apple Sign-in...');
             localStorage.setItem('isLoggedIn', 'true');
             window.location.href = 'app.html';
        });
    }

    // Handle "Sign up" link inside Sign In Modal
    if (openSignupLink) {
        openSignupLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link navigation
            hideModal(signinModal);
            showModal(createAccountModal);
        });
    }

    // --- App Navigation Logic (for app.html) ---
    // Select sidebar links instead of bottom nav buttons
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link'); 
    const appContent = document.getElementById('app-content'); // This selector remains the same
    const appBody = document.querySelector('body'); // Get body to potentially add class
    const createFab = document.getElementById('fab-create'); // Get the FAB
    const logoutButton = document.getElementById('logout-button'); // Get logout button

    // Add class to body if sidebar exists, to apply specific layout styles
    if (document.querySelector('.sidebar')) {
        appBody?.classList.add('app-layout');
    }

    // Function to update content based on section
    const updateAppContent = (sectionName) => {
        if (!appContent) return; // Only run if on app.html

        let contentHTML = ''; // Initialize empty content

        switch (sectionName) {
            case 'home':
                // Existing Marketplace HTML structure
                contentHTML = `
                    <div class="marketplace-header">
                        <h2>Marketplace</h2>
                        <div class="actions">
                            <button class="action-btn person-icon">👤</button> 
                            <button class="action-btn search-icon">🔍</button>
                        </div>
                    </div>
                    <div class="marketplace-filters">
                        <button>Sell</button>
                        <button>Categories</button>
                    </div>
                    <h3 class="section-title">Today's Picks</h3>
                    <div class="product-grid">
                        <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/333/fff?text=Product+1" alt="Product 1">
                            <p class="price">$10</p>
                            <p class="name">Cool Item 1</p>
                        </div>
                        <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/333/fff?text=Product+2" alt="Product 2">
                            <p class="price">$25</p>
                            <p class="name">Another Thing</p>
                        </div>
                         <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/333/fff?text=Product+3" alt="Product 3">
                            <p class="price">$150</p>
                            <p class="name">Expensive Gadget</p>
                        </div>
                         <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/333/fff?text=Product+4" alt="Product 4">
                            <p class="price">$5</p>
                            <p class="name">Cheap Find</p>
                        </div>
                    </div>
                    <h3 class="section-title">Suggested For You</h3>
                     <div class="product-grid">
                        <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/444/fff?text=Product+5" alt="Product 5">
                            <p class="price">$19.99</p>
                            <p class="name">Suggested Item A</p>
                        </div>
                         <div class="product-item">
                            <img src="https://via.placeholder.com/200x200/444/fff?text=Product+6" alt="Product 6">
                            <p class="price">$42</p>
                            <p class="name">Suggested Item B</p>
                        </div>
                    </div>
                `;
                break;
            case 'explore': 
                // Generate Instagram-like Explore grid HTML
                contentHTML = `
                    <div class="explore-grid">
                        <!-- Placeholder Grid Items -->
                        <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+1" alt="Explore Item 1">
                             <!-- Add overlay for icons/stats later if needed -->
                        </div>
                         <div class="explore-item tall">
                             <img src="https://via.placeholder.com/300x600/555/fff?text=Explore+2+(Tall)" alt="Explore Item 2">
                        </div>
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+3" alt="Explore Item 3">
                        </div>
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+4" alt="Explore Item 4">
                        </div>
                         <div class="explore-item wide">
                             <img src="https://via.placeholder.com/600x300/555/fff?text=Explore+5+(Wide)" alt="Explore Item 5">
                        </div>
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+6" alt="Explore Item 6">
                        </div>
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+7" alt="Explore Item 7">
                        </div>
                        <!-- Add many more placeholder items -->
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+8" alt="Explore Item 8">
                        </div>
                         <div class="explore-item">
                             <img src="https://via.placeholder.com/300x300/555/fff?text=Explore+9" alt="Explore Item 9">
                        </div>
                    </div>
                `;
                break;
            case 'messages':
                // Generate Messages list HTML
                contentHTML = `
                    <div class="messages-container">
                        <div class="messages-header">
                             <h2>Messages</h2>
                             <button class="action-btn new-message-icon">➕</button> <!-- Placeholder icon -->
                        </div>
                        <div class="chat-list">
                            <!-- Placeholder Chat Items -->
                            <div class="chat-item">
                                <img class="avatar" src="https://via.placeholder.com/50x50/777/fff?text=U1" alt="User 1 Avatar">
                                <div class="chat-preview">
                                    <p class="chat-name">Fashionista123</p>
                                    <p class="last-message">Okay, sounds good! See you then.</p>
                                </div>
                                <span class="timestamp">1h</span>
                            </div>
                             <div class="chat-item active"> <!-- Example active/unread state -->
                                <img class="avatar" src="https://via.placeholder.com/50x50/888/fff?text=U2" alt="User 2 Avatar">
                                <div class="chat-preview">
                                    <p class="chat-name">StyleSeeker</p>
                                    <p class="last-message">Did you see that new drop?</p>
                                </div>
                                <span class="timestamp">3h</span>
                            </div>
                            <div class="chat-item">
                                <img class="avatar" src="https://via.placeholder.com/50x50/999/fff?text=U3" alt="User 3 Avatar">
                                <div class="chat-preview">
                                    <p class="chat-name">VintageFinds</p>
                                    <p class="last-message">You sent an attachment.</p>
                                </div>
                                <span class="timestamp">Yesterday</span>
                            </div>
                             <!-- Add more placeholder chats -->
                        </div>
                    </div>
                `;
                break;
            case 'profile':
                // Generate Instagram-like Profile HTML
                contentHTML = `
                    <div class="profile-container">
                        <div class="profile-header">
                            <img class="profile-avatar" src="https://via.placeholder.com/150x150/888/fff?text=Me" alt="User Avatar">
                            <div class="profile-info">
                                <div class="profile-title">
                                    <span class="username">my_username</span>
                                    <button class="profile-action-btn">Edit Profile</button>
                                     <button class="profile-action-btn icon-btn">⚙️</button> <!-- Settings icon -->
                                </div>
                                <div class="profile-stats">
                                    <span><strong>12</strong> posts</span>
                                    <span><strong>150</strong> followers</span>
                                    <span><strong>200</strong> following</span>
                                </div>
                                <div class="profile-bio">
                                    <p class="name">My Full Name</p>
                                    <p>This is my bio description. Sharing my style journey!</p>
                                    <a href="#">mylink.com</a>
                                </div>
                            </div>
                        </div>

                        <div class="profile-highlights">
                            <!-- Placeholder Highlights -->
                             <div class="highlight-item">
                                <div class="highlight-circle"><img src="https://via.placeholder.com/60x60/555/fff?text=H1" alt="Highlight 1"></div>
                                <span class="highlight-name">Looks</span>
                            </div>
                             <div class="highlight-item">
                                <div class="highlight-circle"><img src="https://via.placeholder.com/60x60/555/fff?text=H2" alt="Highlight 2"></div>
                                <span class="highlight-name">Trips</span>
                            </div>
                             <div class="highlight-item">
                                <div class="highlight-circle add-highlight">➕</div>
                                <span class="highlight-name">New</span>
                            </div>
                        </div>

                        <div class="profile-content-tabs">
                             <button class="tab-item active" data-tab="posts"><span class="icon">▦</span> POSTS</button>
                             <button class="tab-item" data-tab="saved"><span class="icon">🔖</span> SAVED</button>
                             <button class="tab-item" data-tab="tagged"><span class="icon">👤</span> TAGGED</button>
                        </div>

                        <div class="profile-posts-grid">
                            <!-- Reuse explore grid styling or create specific one -->
                            <div class="explore-item">
                                <img src="https://via.placeholder.com/300x300/666/fff?text=Post+1" alt="Post 1">
                            </div>
                            <div class="explore-item">
                                <img src="https://via.placeholder.com/300x300/666/fff?text=Post+2" alt="Post 2">
                            </div>
                            <div class="explore-item">
                                <img src="https://via.placeholder.com/300x300/666/fff?text=Post+3" alt="Post 3">
                            </div>
                             <!-- Add more placeholder posts -->
                        </div>
                    </div>
                `;
                break;
            default:
                 contentHTML = `<h1>Unknown Section Placeholder</h1>`;
        }
        // Replace content
        appContent.innerHTML = contentHTML;
    };

     // Check if sidebar links exist (i.e., on app.html)
    if (sidebarNavLinks.length > 0) {
        sidebarNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor tag behavior
                
                // Remove active class from all links
                sidebarNavLinks.forEach(i => i.classList.remove('active'));
                // Add active class to the clicked link
                link.classList.add('active');

                const section = link.getAttribute('data-section');
                updateAppContent(section);
            });
        });

        // Initialize with the default active section (home)
        const initialSection = document.querySelector('.sidebar-nav .nav-link.active')?.getAttribute('data-section') || 'home'; 
        updateAppContent(initialSection);
    }

    // Add event listener for the FAB
    if (createFab) {
        createFab.addEventListener('click', () => {
            alert('Open Create Post/Board Modal (Not Implemented)');
            // TODO: Implement logic to show a create modal or navigate to a create page
        });
    }

    // --- Logout Listener ---
     if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            alert('Logging out...');
            window.location.href = 'index.html';
        });
    }

}); 