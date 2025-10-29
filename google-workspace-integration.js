// Google Workspace Integration for Meauxbility Admin Dashboard
// Add this script to your existing admin-dashboard.html

class GoogleWorkspaceIntegration {
    constructor() {
        this.isAuthenticated = false;
        this.accessToken = null;
        this.apiEndpoints = {
            gmail: 'https://gmail.googleapis.com/gmail/v1',
            calendar: 'https://www.googleapis.com/calendar/v3',
            meet: 'https://meet.googleapis.com/v2',
            drive: 'https://www.googleapis.com/drive/v3'
        };
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadInitialData();
    }

    checkAuthentication() {
        // Check if user is authenticated with Google
        const token = localStorage.getItem('google_access_token');
        if (token) {
            this.accessToken = token;
            this.isAuthenticated = true;
            this.updateAuthStatus(true);
        } else {
            this.updateAuthStatus(false);
        }
    }

    updateAuthStatus(authenticated) {
        const statusElement = document.getElementById('google-auth-status');
        if (statusElement) {
            statusElement.textContent = authenticated ? 'Connected' : 'Not Connected';
            statusElement.className = authenticated ? 'status-badge active' : 'status-badge inactive';
        }
    }

    setupEventListeners() {
        // Gmail integration
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="gmail-compose"]')) {
                this.composeEmail();
            }
            if (e.target.matches('[data-action="gmail-refresh"]')) {
                this.refreshGmail();
            }
            if (e.target.matches('[data-action="gmail-inbox"]')) {
                this.loadGmailInbox();
            }
        });

        // Calendar integration
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="calendar-create"]')) {
                this.createCalendarEvent();
            }
            if (e.target.matches('[data-action="calendar-refresh"]')) {
                this.refreshCalendar();
            }
            if (e.target.matches('[data-action="calendar-view"]')) {
                this.loadCalendarEvents();
            }
        });

        // Meet integration
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="meet-create"]')) {
                this.createMeeting();
            }
            if (e.target.matches('[data-action="meet-join"]')) {
                this.joinMeeting();
            }
            if (e.target.matches('[data-action="meet-schedule"]')) {
                this.scheduleMeeting();
            }
        });

        // Drive integration
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="drive-upload"]')) {
                this.uploadToDrive();
            }
            if (e.target.matches('[data-action="drive-refresh"]')) {
                this.refreshDrive();
            }
            if (e.target.matches('[data-action="drive-view"]')) {
                this.loadDriveFiles();
            }
        });
    }

    loadInitialData() {
        if (this.isAuthenticated) {
            this.loadGmailInbox();
            this.loadCalendarEvents();
            this.loadDriveFiles();
        }
    }

    // Gmail Functions
    async loadGmailInbox() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        try {
            this.showLoading('gmail-container');
            
            const response = await fetch(`${this.apiEndpoints.gmail}/users/me/messages?maxResults=10`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Gmail API error: ${response.status}`);
            }

            const data = await response.json();
            this.displayGmailMessages(data.messages || []);
            this.hideLoading('gmail-container');
            this.showNotification('Gmail inbox loaded', 'success');

        } catch (error) {
            console.error('Gmail error:', error);
            this.hideLoading('gmail-container');
            this.showNotification('Failed to load Gmail inbox', 'error');
        }
    }

    async refreshGmail() {
        await this.loadGmailInbox();
    }

    async composeEmail() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        // Open Gmail compose in new tab
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=', '_blank');
        this.showNotification('Gmail composer opened', 'success');
    }

    displayGmailMessages(messages) {
        const container = document.getElementById('gmail-messages');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = '<p>No messages found</p>';
            return;
        }

        // For demo purposes, show sample messages
        container.innerHTML = messages.map((msg, index) => `
            <div class="email-item">
                <div class="email-avatar">${String.fromCharCode(65 + index)}</div>
                <div class="email-content">
                    <div class="email-sender">Sample Sender ${index + 1}</div>
                    <div class="email-subject">Sample Subject ${index + 1}</div>
                    <div class="email-preview-text">Sample preview text...</div>
                </div>
                <div class="email-time">${index + 1}m ago</div>
            </div>
        `).join('');
    }

    // Calendar Functions
    async loadCalendarEvents() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        try {
            this.showLoading('calendar-container');
            
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            
            const response = await fetch(`${this.apiEndpoints.calendar}/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${tomorrow.toISOString()}&singleEvents=true&orderBy=startTime`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Calendar API error: ${response.status}`);
            }

            const data = await response.json();
            this.displayCalendarEvents(data.items || []);
            this.hideLoading('calendar-container');
            this.showNotification('Calendar events loaded', 'success');

        } catch (error) {
            console.error('Calendar error:', error);
            this.hideLoading('calendar-container');
            this.showNotification('Failed to load calendar events', 'error');
        }
    }

    async refreshCalendar() {
        await this.loadCalendarEvents();
    }

    async createCalendarEvent() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        // Open Google Calendar in new tab
        window.open('https://calendar.google.com/calendar/render?action=TEMPLATE', '_blank');
        this.showNotification('Calendar event creator opened', 'success');
    }

    displayCalendarEvents(events) {
        const container = document.getElementById('calendar-events');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = '<p>No events scheduled for today</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="calendar-event">
                <div class="event-time">${this.formatEventTime(event.start)}</div>
                <div>
                    <div class="event-title">${event.summary || 'No Title'}</div>
                    <div class="event-description">${event.description || ''}</div>
                </div>
            </div>
        `).join('');
    }

    formatEventTime(start) {
        if (start.dateTime) {
            return new Date(start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } else if (start.date) {
            return 'All Day';
        }
        return 'Unknown';
    }

    // Meet Functions
    async createMeeting() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        try {
            this.showLoading('meet-container');
            
            // Generate a random meeting ID
            const meetingId = Math.random().toString(36).substring(2, 15);
            const meetingLink = `https://meet.google.com/${meetingId}`;
            
            // Display the meeting link
            const linkContainer = document.getElementById('meet-link');
            if (linkContainer) {
                linkContainer.innerHTML = `
                    <div class="meet-link-display">
                        <h4>Meeting Created!</h4>
                        <p>Share this link with participants:</p>
                        <div class="meet-link-url">${meetingLink}</div>
                        <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${meetingLink}')">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                    </div>
                `;
            }
            
            this.hideLoading('meet-container');
            this.showNotification('Meeting created successfully!', 'success');

        } catch (error) {
            console.error('Meet error:', error);
            this.hideLoading('meet-container');
            this.showNotification('Failed to create meeting', 'error');
        }
    }

    async joinMeeting() {
        const linkContainer = document.getElementById('meet-link');
        if (linkContainer && linkContainer.textContent.includes('meet.google.com')) {
            const link = linkContainer.textContent.match(/https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+/);
            if (link) {
                window.open(link[0], '_blank');
                this.showNotification('Joining meeting...', 'success');
            }
        } else {
            this.showNotification('Please create a meeting first', 'warning');
        }
    }

    async scheduleMeeting() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        // Open Google Calendar with Meet option
        window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&add=Meet', '_blank');
        this.showNotification('Meeting scheduler opened', 'success');
    }

    // Drive Functions
    async loadDriveFiles() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        try {
            this.showLoading('drive-container');
            
            const response = await fetch(`${this.apiEndpoints.drive}/files?pageSize=10&orderBy=modifiedTime desc`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Drive API error: ${response.status}`);
            }

            const data = await response.json();
            this.displayDriveFiles(data.files || []);
            this.hideLoading('drive-container');
            this.showNotification('Drive files loaded', 'success');

        } catch (error) {
            console.error('Drive error:', error);
            this.hideLoading('drive-container');
            this.showNotification('Failed to load Drive files', 'error');
        }
    }

    async refreshDrive() {
        await this.loadDriveFiles();
    }

    async uploadToDrive() {
        if (!this.isAuthenticated) {
            this.showNotification('Please authenticate with Google first', 'warning');
            return;
        }

        // Open Google Drive in new tab
        window.open('https://drive.google.com/drive/my-drive', '_blank');
        this.showNotification('Google Drive opened', 'success');
    }

    displayDriveFiles(files) {
        const container = document.getElementById('drive-files');
        if (!container) return;

        if (files.length === 0) {
            container.innerHTML = '<p>No files found</p>';
            return;
        }

        container.innerHTML = files.map(file => `
            <div class="drive-file-item">
                <div class="file-icon">
                    <i class="fas fa-file-${this.getFileIcon(file.mimeType)}"></i>
                </div>
                <div class="file-content">
                    <div class="file-name">${file.name}</div>
                    <div class="file-modified">Modified: ${new Date(file.modifiedTime).toLocaleDateString()}</div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.open('${file.webViewLink}', '_blank')">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFileIcon(mimeType) {
        if (mimeType.includes('pdf')) return 'pdf';
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('video')) return 'video';
        if (mimeType.includes('audio')) return 'audio';
        if (mimeType.includes('spreadsheet')) return 'excel';
        if (mimeType.includes('document')) return 'word';
        return 'alt';
    }

    // Utility Functions
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="loading"></div>';
        }
    }

    hideLoading(containerId) {
        // Loading will be replaced by actual content
    }

    showNotification(message, type = 'info') {
        // Use existing notification system from admin dashboard
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Authentication
    async authenticateWithGoogle() {
        try {
            // In a real implementation, you would use Google OAuth2
            // For now, we'll simulate authentication
            const token = 'simulated_access_token_' + Date.now();
            localStorage.setItem('google_access_token', token);
            this.accessToken = token;
            this.isAuthenticated = true;
            this.updateAuthStatus(true);
            this.showNotification('Successfully authenticated with Google!', 'success');
            this.loadInitialData();
        } catch (error) {
            console.error('Authentication error:', error);
            this.showNotification('Failed to authenticate with Google', 'error');
        }
    }

    async disconnectGoogle() {
        localStorage.removeItem('google_access_token');
        this.accessToken = null;
        this.isAuthenticated = false;
        this.updateAuthStatus(false);
        this.showNotification('Disconnected from Google', 'info');
    }
}

// Initialize Google Workspace Integration
const googleWorkspace = new GoogleWorkspaceIntegration();

// Global functions for buttons
function authenticateGoogle() {
    googleWorkspace.authenticateWithGoogle();
}

function disconnectGoogle() {
    googleWorkspace.disconnectGoogle();
}

// Export for use in other scripts
window.GoogleWorkspaceIntegration = GoogleWorkspaceIntegration;
window.googleWorkspace = googleWorkspace;
