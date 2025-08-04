console.log('Popup script loaded');

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is loaded');
});

// toggling between register and login window logic
const regInsteadBtn = document.getElementById('reg-instead');
const loginInsteadBtn = document.getElementById('login-instead');
const loginWindow = document.getElementById('login');
const registerWindow = document.getElementById('register');
const mainWindow = document.getElementById('main');

if (regInsteadBtn) {
    regInsteadBtn.addEventListener('click', () => {
        loginWindow.style.display = 'none';
        registerWindow.style.display = 'block';
    });
}
if (loginInsteadBtn) {
    loginInsteadBtn.addEventListener('click', () => {
        registerWindow.style.display = 'none';
        loginWindow.style.display = 'block';
    });
}

// login button logic
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            const body = {
                "email": email,
                "password": password
            }
            const url = 'http://localhost:5000/api/auth/login'
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if(data.success) {
                await chrome.storage.local.set({'auth_token': data.token});
                loginWindow.style.display = 'none';
                registerWindow.style.display = 'none';
                mainWindow.style.display = 'block';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Try again');
        }
    });
}

// register logic
const regBtn = document.getElementById('reg-btn');
if (regBtn) {
    regBtn.addEventListener('click', async () => {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            const body = {
                "username": username,
                "email": email,
                "password": password
            }
            const url = 'http://localhost:5000/api/auth/register'
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if(data.success) {
                await chrome.storage.local.set({'auth_token': data.token});
                loginWindow.style.display = 'none';
                registerWindow.style.display = 'none';
                mainWindow.style.display = 'block';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Try again');
        }
    });
}

const summarizeButton = document.getElementById('summarize-btn');
if (summarizeButton) {
    summarizeButton.addEventListener('click', async () => {
        const data = await chrome.storage.local.get('auth_token');
        if(!data.auth_token) {
            alert('Please login first');
            return;
        }
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if(!tab) {
                alert('No active tab');
                return;
            }
            const response = await chrome.tabs.sendMessage(tab.id, {action: "getText"});
            if (!response || !response.text) {
                alert('Could not extract text');
                return;
            }
            const summaryResponse = await fetch('http://localhost:5000/api/summaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.auth_token}`
                },
                body: JSON.stringify({
                    url: tab.url,
                    title: tab.title,
                    originalText: response.text.substring(0, 5000)
                })
            });
            const summaryData = await summaryResponse.json();
            
            if (summaryData.success) {
                document.getElementById('summary').textContent = summaryData.summary.summary;
            } else {
                alert(summaryData.message || 'Failed to save summary');
            }
            
        } catch (error) {
            console.error('Summarize error:', error);
            alert('Failed to summarize page');
        }
    });
}
const viewSummariesButton = document.getElementById('view-summaries');
if (viewSummariesButton) {
    viewSummariesButton.addEventListener('click', async () => {
        const data = await chrome.storage.local.get('auth_token');
        if (!data.auth_token) {
            alert('Please login first');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/summaries', {
                headers: {
                    'Authorization': `Bearer ${data.auth_token}`
                }
            });
            
            const summariesData = await response.json();
            
            if (summariesData.success) {
                displaySummaries(summariesData.summaries);
                document.getElementById('summaries-container').style.display = 'block';
            } else {
                alert('Failed to load summaries');
            }
        } catch (error) {
            console.error('Summaries error:', error);
            alert('Failed to load summaries');
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Clear the stored auth token
            await chrome.storage.local.remove('auth_token');
            
            // Hide main window and show login window
            mainWindow.style.display = 'none';
            loginWindow.style.display = 'block';
            
            // Clear any displayed data
            document.getElementById('summary').textContent = '';
            document.getElementById('summaries-container').style.display = 'none';
            document.getElementById('summaries-container').innerHTML = '';
            
            // Clear form fields
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-password').value = '';
            
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Try again');
        }
    });
}

function displaySummaries(summaries) {
    const container = document.getElementById('summaries-container');
    
    if (summaries.length === 0) {
        container.innerHTML = '<p>No summaries yet. Create your first one!</p>';
        return;
    }
    
    const html = summaries.map(summary => `
        <div class="summary-item">
            <h4>${summary.title || 'Untitled'}</h4>
            <p><strong>URL:</strong> ${summary.url}</p>
            <p><strong>Summary:</strong> ${summary.summary}</p>
            <small>Created: ${new Date(summary.createdAt).toLocaleDateString()}</small>
            <button class="delete-btn" data-id="${summary._id}">Delete</button>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Add event listeners to delete buttons
    const deleteButtons = container.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const summaryId = button.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this summary?')) {
                await deleteSummary(summaryId);
            }
        });
    });
}

async function deleteSummary(summaryId) {
    const data = await chrome.storage.local.get('auth_token');
    if (!data.auth_token) {
        alert('Please login first');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:5000/api/summaries/${summaryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${data.auth_token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Summary deleted successfully');
            // Refresh the summaries list
            const viewSummariesButton = document.getElementById('view-summaries');
            if (viewSummariesButton) {
                viewSummariesButton.click();
            }
        } else {
            alert(result.message || 'Failed to delete summary');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete summary');
    }
}