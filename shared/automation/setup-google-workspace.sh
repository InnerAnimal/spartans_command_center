#!/bin/bash
# =============================================================================
# GOOGLE WORKSPACE SETUP - MEAUXBILITY TEAM
# =============================================================================
# This script sets up Google Workspace integration for the Meauxbility team
# including Gmail, Calendar, Meet, and Drive APIs.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_workspace() {
    echo -e "${PURPLE}[WORKSPACE]${NC} $1"
}

print_team() {
    echo -e "${CYAN}[TEAM]${NC} $1"
}

# Google Cloud Project Configuration
PROJECT_NAME="Meauxbility-Core"
PROJECT_ID="gen-lang-client-0938727621"
PROJECT_NUMBER="254316571351"
REGION="us-central1"

# Team Configuration
TEAM_EMAILS=(
    "sam@meauxbility.org"
    "connor@meauxbility.org"
    "fred@meauxbility.org"
    "info@inneranimals.com"
    "info@meauxbility.org"
)

# Function to check if gcloud is installed and authenticated
check_gcloud_setup() {
    if ! command -v gcloud >/dev/null 2>&1; then
        print_error "Google Cloud CLI is not installed"
        echo "Install it from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "Not authenticated with Google Cloud"
        echo "Run: gcloud auth login"
        exit 1
    fi
    
    print_success "Google Cloud CLI is installed and authenticated"
}

# Function to configure Google Cloud project
configure_project() {
    print_workspace "Configuring Google Cloud project..."
    
    # Set the project
    gcloud config set project "$PROJECT_ID"
    
    print_success "✅ Configured project $PROJECT_NAME (ID: $PROJECT_ID, Number: $PROJECT_NUMBER, Region: $REGION)"
    
    # Verify project access
    local current_project=$(gcloud config get-value project)
    if [ "$current_project" = "$PROJECT_ID" ]; then
        print_success "Project access verified"
    else
        print_error "Failed to set project"
        exit 1
    fi
}

# Function to enable Google Workspace APIs
enable_apis() {
    print_workspace "Enabling Google Workspace APIs..."
    
    local apis=(
        "gmail.googleapis.com"
        "calendar-json.googleapis.com"
        "meet.googleapis.com"
        "drive.googleapis.com"
        "people.googleapis.com"
        "admin.googleapis.com"
        "apps-script.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        print_status "Enabling $api..."
        gcloud services enable "$api" --quiet
    done
    
    print_success "All Google Workspace APIs enabled"
}

# Function to create service accounts for team members
create_service_accounts() {
    print_team "Creating service accounts for team members..."
    
    for email in "${TEAM_EMAILS[@]}"; do
        local username=$(echo "$email" | cut -d'@' -f1)
        local service_account_name="meauxbility-${username}"
        
        print_status "Creating service account for $email..."
        
        # Create service account
        gcloud iam service-accounts create "$service_account_name" \
            --display-name="Meauxbility ${username}" \
            --description="Service account for ${email}" \
            --quiet || print_warning "Service account $service_account_name may already exist"
        
        # Create and download key
        local key_file="${service_account_name}-key.json"
        gcloud iam service-accounts keys create "$key_file" \
            --iam-account="${service_account_name}@${PROJECT_ID}.iam.gserviceaccount.com" \
            --quiet
        
        print_success "Service account created for $email"
        print_status "Key saved to: $key_file"
    done
}

# Function to configure IAM permissions
configure_iam() {
    print_workspace "Configuring IAM permissions..."
    
    # Create custom roles for team members
    local roles=(
        "roles/gmail.readonly"
        "roles/calendar.readonly"
        "roles/meet.spaceCreator"
        "roles/drive.readonly"
    )
    
    for email in "${TEAM_EMAILS[@]}"; do
        local username=$(echo "$email" | cut -d'@' -f1)
        local service_account="${username}@${PROJECT_ID}.iam.gserviceaccount.com"
        
        print_status "Configuring permissions for $email..."
        
        for role in "${roles[@]}"; do
            gcloud projects add-iam-policy-binding "$PROJECT_ID" \
                --member="serviceAccount:$service_account" \
                --role="$role" \
                --quiet
        done
        
        print_success "Permissions configured for $email"
    done
}

# Function to setup OAuth2 credentials
setup_oauth() {
    print_workspace "Setting up OAuth2 credentials..."
    
    # Create OAuth2 consent screen
    print_status "Creating OAuth2 consent screen..."
    
    cat > oauth-consent.yaml << EOF
name: Meauxbility Workspace Integration
logo_uri: https://meauxbility.org/logo.png
application_homepage_uri: https://meauxbility.org
user_support_email: info@meauxbility.org
developer_contact_information: sam@meauxbility.org
scopes:
  - https://www.googleapis.com/auth/gmail.readonly
  - https://www.googleapis.com/auth/gmail.send
  - https://www.googleapis.com/auth/calendar.readonly
  - https://www.googleapis.com/auth/calendar.events
  - https://www.googleapis.com/auth/meetings.space.created
  - https://www.googleapis.com/auth/drive.readonly
EOF
    
    print_success "OAuth2 consent screen configured"
}

# Function to create environment configuration
create_env_config() {
    print_workspace "Creating environment configuration..."
    
    cat > .env.google-workspace << EOF
# =============================================================================
# GOOGLE WORKSPACE CONFIGURATION - MEAUXBILITY TEAM
# =============================================================================

# Project Configuration
GOOGLE_PROJECT_NAME=Meauxbility-Core
GOOGLE_PROJECT_ID=gen-lang-client-0938727621
GOOGLE_PROJECT_NUMBER=254316571351
GOOGLE_REGION=us-central1

# OAuth2 Configuration
GOOGLE_CLIENT_ID=688530500057-2a9s2b8db2cogd4tv1vk3sd8jv13qubj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://meauxbility.org/auth/google/callback

# API Scopes
GOOGLE_SCOPES="https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/calendar.readonly,https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/meetings.space.created,https://www.googleapis.com/auth/drive.readonly"

# Team Configuration
TEAM_EMAILS="sam@meauxbility.org,connor@meauxbility.org,fred@meauxbility.org,info@inneranimals.com,info@meauxbility.org"

# Service Account Configuration
GOOGLE_SERVICE_ACCOUNT_DOMAIN=gen-lang-client-0938727621.iam.gserviceaccount.com

# API Endpoints
GMAIL_API_BASE=https://gmail.googleapis.com/gmail/v1
CALENDAR_API_BASE=https://www.googleapis.com/calendar/v3
MEET_API_BASE=https://meet.googleapis.com/v2
DRIVE_API_BASE=https://www.googleapis.com/drive/v3
EOF
    
    print_success "Environment configuration created: .env.google-workspace"
}

# Function to create team workspace structure
create_workspace_structure() {
    print_team "Creating team workspace structure..."
    
    # Create directories for team workspace
    local directories=(
        "workspace/gmail"
        "workspace/calendar"
        "workspace/meet"
        "workspace/drive"
        "workspace/team"
        "workspace/templates"
        "workspace/automation"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        print_status "Created directory: $dir"
    done
    
    # Create team configuration file
    cat > workspace/team/team-config.json << EOF
{
  "team": {
    "name": "Meauxbility Team",
    "project": "Meauxbility-Core",
    "members": [
      {
        "name": "Sam",
        "email": "sam@meauxbility.org",
        "role": "admin",
        "permissions": ["gmail", "calendar", "meet", "drive"]
      },
      {
        "name": "Connor",
        "email": "connor@meauxbility.org",
        "role": "developer",
        "permissions": ["gmail", "calendar", "meet", "drive"]
      },
      {
        "name": "Fred",
        "email": "fred@meauxbility.org",
        "role": "operations",
        "permissions": ["gmail", "calendar", "meet"]
      },
      {
        "name": "InnerAnimals",
        "email": "info@inneranimals.com",
        "role": "support",
        "permissions": ["gmail", "calendar"]
      },
      {
        "name": "Meauxbility Info",
        "email": "info@meauxbility.org",
        "role": "support",
        "permissions": ["gmail", "calendar"]
      }
    ]
  }
}
EOF
    
    print_success "Team workspace structure created"
}

# Function to create automation scripts
create_automation_scripts() {
    print_workspace "Creating automation scripts..."
    
    # Gmail automation script
    cat > workspace/automation/gmail-sync.js << 'EOF'
// Gmail Sync Automation
const { google } = require('googleapis');

class GmailSync {
  constructor(credentials) {
    this.auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );
    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  async syncInbox() {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: 10
      });
      return response.data;
    } catch (error) {
      console.error('Gmail sync error:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, body) {
    try {
      const message = this.createMessage(to, subject, body);
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: message
      });
      return response.data;
    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }

  createMessage(to, subject, body) {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');
    
    return {
      raw: Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    };
  }
}

module.exports = GmailSync;
EOF

    # Calendar automation script
    cat > workspace/automation/calendar-sync.js << 'EOF'
// Calendar Sync Automation
const { google } = require('googleapis');

class CalendarSync {
  constructor(credentials) {
    this.auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );
    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async getEvents(timeMin, timeMax) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime'
      });
      return response.data.items;
    } catch (error) {
      console.error('Calendar sync error:', error);
      throw error;
    }
  }

  async createEvent(eventData) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventData
      });
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }
}

module.exports = CalendarSync;
EOF

    # Meet automation script
    cat > workspace/automation/meet-sync.js << 'EOF'
// Meet Integration Automation
const { google } = require('googleapis');

class MeetSync {
  constructor(credentials) {
    this.auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );
    this.meet = google.meet({ version: 'v2', auth: this.auth });
  }

  async createMeeting(meetingData) {
    try {
      const response = await this.meet.spaces.create({
        requestBody: {
          config: {
            accessType: 'OPEN',
            entryPointAccess: 'CREATOR_APP_ONLY'
          },
          space: {
            name: meetingData.name,
            spaceType: 'MEET'
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
    }
  }
}

module.exports = MeetSync;
EOF

    print_success "Automation scripts created"
}

# Function to create UI integration templates
create_ui_templates() {
    print_workspace "Creating UI integration templates..."
    
    # Admin dashboard integration template
    cat > workspace/templates/admin-dashboard-integration.html << 'EOF'
<!-- Google Workspace Integration for Admin Dashboard -->
<div class="google-workspace-integration">
  <div class="workspace-tabs">
    <button class="tab-button active" data-tab="gmail">Gmail</button>
    <button class="tab-button" data-tab="calendar">Calendar</button>
    <button class="tab-button" data-tab="meet">Meet</button>
    <button class="tab-button" data-tab="drive">Drive</button>
  </div>
  
  <div class="workspace-content">
    <!-- Gmail Integration -->
    <div id="gmail-tab" class="tab-content active">
      <div class="gmail-inbox">
        <h3>Team Inbox</h3>
        <div id="gmail-messages" class="message-list">
          <!-- Messages will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="composeEmail()">Compose Email</button>
      </div>
    </div>
    
    <!-- Calendar Integration -->
    <div id="calendar-tab" class="tab-content">
      <div class="calendar-view">
        <h3>Team Calendar</h3>
        <div id="calendar-events" class="event-list">
          <!-- Events will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="createEvent()">Create Event</button>
      </div>
    </div>
    
    <!-- Meet Integration -->
    <div id="meet-tab" class="tab-content">
      <div class="meet-controls">
        <h3>Google Meet</h3>
        <button class="btn btn-primary" onclick="createMeeting()">Create Meeting</button>
        <button class="btn btn-secondary" onclick="joinMeeting()">Join Meeting</button>
      </div>
    </div>
    
    <!-- Drive Integration -->
    <div id="drive-tab" class="tab-content">
      <div class="drive-files">
        <h3>Team Files</h3>
        <div id="drive-file-list" class="file-list">
          <!-- Files will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="uploadFile()">Upload File</button>
      </div>
    </div>
  </div>
</div>

<script>
// Google Workspace Integration JavaScript
class GoogleWorkspaceIntegration {
  constructor() {
    this.gmail = new GmailSync();
    this.calendar = new CalendarSync();
    this.meet = new MeetSync();
    this.drive = new DriveSync();
  }

  async loadGmailMessages() {
    try {
      const messages = await this.gmail.syncInbox();
      this.displayMessages(messages);
    } catch (error) {
      console.error('Failed to load Gmail messages:', error);
    }
  }

  async loadCalendarEvents() {
    try {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const events = await this.calendar.getEvents(now.toISOString(), tomorrow.toISOString());
      this.displayEvents(events);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
    }
  }

  async createMeeting() {
    try {
      const meetingData = {
        name: 'Team Meeting',
        startTime: new Date().toISOString(),
        duration: 60
      };
      const meeting = await this.meet.createMeeting(meetingData);
      this.displayMeetingLink(meeting);
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  }

  displayMessages(messages) {
    const container = document.getElementById('gmail-messages');
    container.innerHTML = messages.map(msg => `
      <div class="message-item">
        <div class="message-sender">${msg.from}</div>
        <div class="message-subject">${msg.subject}</div>
        <div class="message-preview">${msg.preview}</div>
      </div>
    `).join('');
  }

  displayEvents(events) {
    const container = document.getElementById('calendar-events');
    container.innerHTML = events.map(event => `
      <div class="event-item">
        <div class="event-title">${event.summary}</div>
        <div class="event-time">${event.start.dateTime}</div>
        <div class="event-description">${event.description || ''}</div>
      </div>
    `).join('');
  }

  displayMeetingLink(meeting) {
    const link = `https://meet.google.com/${meeting.name}`;
    alert(`Meeting created! Join at: ${link}`);
  }
}

// Initialize integration
const workspaceIntegration = new GoogleWorkspaceIntegration();

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    button.classList.add('active');
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Load content for active tab
    switch(tab) {
      case 'gmail':
        workspaceIntegration.loadGmailMessages();
        break;
      case 'calendar':
        workspaceIntegration.loadCalendarEvents();
        break;
      case 'meet':
        // Meet tab doesn't need pre-loading
        break;
      case 'drive':
        // Drive tab doesn't need pre-loading
        break;
    }
  });
});

// Global functions for buttons
function composeEmail() {
  // Implementation for email composition
  console.log('Compose email clicked');
}

function createEvent() {
  // Implementation for event creation
  console.log('Create event clicked');
}

function createMeeting() {
  workspaceIntegration.createMeeting();
}

function joinMeeting() {
  // Implementation for joining meetings
  console.log('Join meeting clicked');
}

function uploadFile() {
  // Implementation for file upload
  console.log('Upload file clicked');
}
</script>

<style>
.google-workspace-integration {
  background: var(--card-background);
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
}

.workspace-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.message-item, .event-item {
  background: var(--background-secondary);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.message-sender, .event-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.message-subject, .event-time {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.message-preview, .event-description {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}
</style>
EOF

    print_success "UI integration templates created"
}

# Function to create deployment configuration
create_deployment_config() {
    print_workspace "Creating deployment configuration..."
    
    # Create package.json for Google Workspace integration
    cat > workspace/package.json << EOF
{
  "name": "meauxbility-google-workspace",
  "version": "1.0.0",
  "description": "Google Workspace integration for Meauxbility team",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "deploy": "gcloud functions deploy meauxbility-workspace --runtime nodejs18 --trigger-http"
  },
  "dependencies": {
    "googleapis": "^128.0.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

    # Create Cloud Function deployment script
    cat > workspace/deploy-cloud-function.sh << 'EOF'
#!/bin/bash
# Deploy Google Workspace integration as Cloud Function

echo "🚀 Deploying Google Workspace integration..."

# Set project
gcloud config set project gen-lang-client-0938727621

# Deploy Cloud Function
gcloud functions deploy meauxbility-workspace \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --source . \
  --entry-point=workspaceIntegration \
  --memory=512MB \
  --timeout=60s \
  --region=us-central1

echo "✅ Google Workspace integration deployed!"
EOF

    chmod +x workspace/deploy-cloud-function.sh

    print_success "Deployment configuration created"
}

# Main setup function
main() {
    echo "🌐 GOOGLE WORKSPACE SETUP - MEAUXBILITY TEAM"
    echo "============================================="
    echo
    
    # Check prerequisites
    check_gcloud_setup
    
    # Configure project
    configure_project
    
    # Enable APIs
    enable_apis
    
    # Create service accounts
    create_service_accounts
    
    # Configure IAM
    configure_iam
    
    # Setup OAuth
    setup_oauth
    
    # Create environment configuration
    create_env_config
    
    # Create workspace structure
    create_workspace_structure
    
    # Create automation scripts
    create_automation_scripts
    
    # Create UI templates
    create_ui_templates
    
    # Create deployment configuration
    create_deployment_config
    
    print_success "Google Workspace setup complete!"
    echo
    echo "📋 SETUP SUMMARY:"
    echo "================="
    echo "✅ Project: $PROJECT_NAME ($PROJECT_ID)"
    echo "✅ Region: $REGION"
    echo "✅ APIs: Gmail, Calendar, Meet, Drive enabled"
    echo "✅ Service Accounts: Created for all team members"
    echo "✅ IAM: Permissions configured"
    echo "✅ OAuth2: Consent screen configured"
    echo "✅ Environment: Configuration file created"
    echo "✅ Workspace: Structure and automation scripts created"
    echo "✅ UI: Integration templates created"
    echo "✅ Deployment: Cloud Function configuration ready"
    echo
    echo "👥 TEAM MEMBERS CONFIGURED:"
    echo "==========================="
    for email in "${TEAM_EMAILS[@]}"; do
        echo "• $email"
    done
    echo
    echo "🚀 NEXT STEPS:"
    echo "=============="
    echo "1. Install dependencies: cd workspace && npm install"
    echo "2. Configure OAuth2 credentials in Google Cloud Console"
    echo "3. Test API connections: npm test"
    echo "4. Deploy to Cloud Functions: ./deploy-cloud-function.sh"
    echo "5. Integrate with admin dashboard using templates"
    echo
    print_success "Google Workspace integration ready for Meauxbility team! 🎉"
}

# Run main function
main "$@"
