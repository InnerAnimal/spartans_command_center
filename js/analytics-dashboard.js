/**
 * Meauxbility Analytics Dashboard
 * Community Impact Visualization
 * 
 * This dashboard displays real-time analytics and community impact metrics
 * to help track our mission effectiveness and community transformation.
 */

class MeauxbilityAnalyticsDashboard {
    constructor() {
        this.apiBase = '/api/analytics';
        this.refreshInterval = 30000; // 30 seconds
        this.isVisible = false;
        this.dashboardElement = null;
        
        this.init();
    }

    /**
     * Initialize the analytics dashboard
     */
    init() {
        this.createDashboard();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    /**
     * Create the analytics dashboard UI
     */
    createDashboard() {
        // Create dashboard container
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.id = 'analytics-dashboard';
        this.dashboardElement.className = 'analytics-dashboard';
        this.dashboardElement.innerHTML = `
            <div class="analytics-header">
                <h3>📊 Community Impact Analytics</h3>
                <div class="analytics-controls">
                    <button id="refresh-analytics" class="btn btn-sm">🔄 Refresh</button>
                    <button id="toggle-analytics" class="btn btn-sm">📈 Toggle</button>
                </div>
            </div>
            <div class="analytics-content">
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Community Impact</h4>
                        <div class="metric" id="lives-transformed">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Lives Transformed</span>
                        </div>
                        <div class="metric" id="grants-awarded">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Grants Awarded</span>
                        </div>
                        <div class="metric" id="total-grant-amount">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Total Grant Amount</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Engagement Metrics</h4>
                        <div class="metric" id="page-views">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Page Views</span>
                        </div>
                        <div class="metric" id="community-engagements">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Community Engagements</span>
                        </div>
                        <div class="metric" id="resource-downloads">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Resource Downloads</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>User Journey</h4>
                        <div class="metric" id="grant-applications">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Grant Applications</span>
                        </div>
                        <div class="metric" id="donations">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Donations</span>
                        </div>
                        <div class="metric" id="volunteer-signups">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Volunteer Signups</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Session Info</h4>
                        <div class="metric" id="session-id">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Session ID</span>
                        </div>
                        <div class="metric" id="user-type">
                            <span class="metric-value">-</span>
                            <span class="metric-label">User Type</span>
                        </div>
                        <div class="metric" id="impact-level">
                            <span class="metric-value">-</span>
                            <span class="metric-label">Impact Level</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-footer">
                    <small>Last updated: <span id="last-updated">-</span></small>
                </div>
            </div>
        `;

        // Add styles
        this.addStyles();

        // Add to page
        document.body.appendChild(this.dashboardElement);
    }

    /**
     * Add CSS styles for the analytics dashboard
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .analytics-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                z-index: 10000;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                transition: all 0.3s ease;
                transform: translateX(100%);
                opacity: 0;
            }

            .analytics-dashboard.visible {
                transform: translateX(0);
                opacity: 1;
            }

            .analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e2e8f0;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .analytics-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .analytics-controls {
                display: flex;
                gap: 8px;
            }

            .btn {
                padding: 6px 12px;
                border: none;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }

            .btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .analytics-content {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .analytics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .analytics-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
            }

            .analytics-card h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding: 4px 0;
            }

            .metric:last-child {
                margin-bottom: 0;
            }

            .metric-value {
                font-weight: 600;
                color: #2563eb;
                font-size: 13px;
            }

            .metric-label {
                color: #6b7280;
                font-size: 12px;
            }

            .analytics-footer {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid #e2e8f0;
                text-align: center;
            }

            .analytics-footer small {
                color: #9ca3af;
                font-size: 11px;
            }

            @media (max-width: 768px) {
                .analytics-dashboard {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
                
                .analytics-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Toggle dashboard visibility
        document.getElementById('toggle-analytics').addEventListener('click', () => {
            this.toggle();
        });

        // Refresh analytics data
        document.getElementById('refresh-analytics').addEventListener('click', () => {
            this.refreshData();
        });

        // Close on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * Toggle dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Show the dashboard
     */
    show() {
        this.dashboardElement.classList.add('visible');
        this.isVisible = true;
        this.refreshData();
    }

    /**
     * Hide the dashboard
     */
    hide() {
        this.dashboardElement.classList.remove('visible');
        this.isVisible = false;
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        setInterval(() => {
            if (this.isVisible) {
                this.refreshData();
            }
        }, this.refreshInterval);
    }

    /**
     * Refresh analytics data
     */
    async refreshData() {
        try {
            // Get community impact metrics
            const communityImpact = await this.fetchData('/community-impact');
            this.updateCommunityImpactMetrics(communityImpact);

            // Get analytics summary
            const summary = await this.fetchData('/summary');
            this.updateSummaryMetrics(summary);

            // Get user journey data
            const userJourney = await this.fetchData('/user-journey');
            this.updateUserJourneyMetrics(userJourney);

            // Update session info
            this.updateSessionInfo();

            // Update last updated timestamp
            document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();

        } catch (error) {
            console.error('Failed to refresh analytics data:', error);
        }
    }

    /**
     * Fetch data from API
     */
    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBase}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Update community impact metrics
     */
    updateCommunityImpactMetrics(data) {
        if (data.community_impact) {
            const impact = data.community_impact;
            
            this.updateMetric('lives-transformed', impact.lives_transformed);
            this.updateMetric('grants-awarded', impact.grants_awarded);
            this.updateMetric('total-grant-amount', `$${impact.total_grant_amount.toLocaleString()}`);
        }
    }

    /**
     * Update summary metrics
     */
    updateSummaryMetrics(data) {
        if (data.summary) {
            const summary = data.summary;
            
            this.updateMetric('page-views', summary.page_views);
            this.updateMetric('community-engagements', summary.community_engagements);
            this.updateMetric('resource-downloads', summary.resource_downloads);
        }
    }

    /**
     * Update user journey metrics
     */
    updateUserJourneyMetrics(data) {
        if (data.user_journey) {
            const journey = data.user_journey;
            
            this.updateMetric('grant-applications', journey.action_stage.grant_applications);
            this.updateMetric('donations', journey.action_stage.donations);
            this.updateMetric('volunteer-signups', journey.action_stage.volunteer_signups);
        }
    }

    /**
     * Update session info
     */
    updateSessionInfo() {
        if (window.meauxbilityAnalytics) {
            const metrics = window.meauxbilityAnalytics.getCommunityMetrics();
            
            this.updateMetric('session-id', metrics.session_id.substring(0, 12) + '...');
            this.updateMetric('user-type', metrics.user_type);
            this.updateMetric('impact-level', metrics.impact_level);
        }
    }

    /**
     * Update a specific metric
     */
    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value || '-';
        }
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, eventData) {
        if (window.meauxbilityAnalytics) {
            window.meauxbilityAnalytics.trackEvent(eventName, eventData);
        }
    }

    /**
     * Get current metrics
     */
    getCurrentMetrics() {
        if (window.meauxbilityAnalytics) {
            return window.meauxbilityAnalytics.getCommunityMetrics();
        }
        return null;
    }
}

// Initialize analytics dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only show dashboard for admin users or in development
    if (window.location.pathname.includes('/admin') || window.location.hostname === 'localhost') {
        window.meauxbilityAnalyticsDashboard = new MeauxbilityAnalyticsDashboard();
        
        // Add keyboard shortcut to toggle dashboard (Ctrl+Shift+A)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'A') {
                event.preventDefault();
                window.meauxbilityAnalyticsDashboard.toggle();
            }
        });
    }
});

// Export for use in other scripts
window.MeauxbilityAnalyticsDashboard = MeauxbilityAnalyticsDashboard;
