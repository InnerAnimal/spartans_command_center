/**
 * Meauxbility Analytics Tracking System
 * Empowering Communities Through Data-Driven Impact
 * 
 * This tracking system helps us measure our community impact,
 * understand how we're transforming pain into purpose,
 * and optimize our services for spinal cord injury survivors.
 */

class MeauxbilityAnalytics {
    constructor() {
        this.measurementId = 'G-HZEWHZG1WP';
        this.isInitialized = false;
        this.sessionId = this.generateSessionId();
        this.userType = this.detectUserType();
        this.referralSource = this.detectReferralSource();
        
        // Community impact metrics
        this.communityMetrics = {
            pageViews: 0,
            grantApplications: 0,
            donations: 0,
            resourceDownloads: 0,
            communityEngagements: 0,
            adminPortalAccess: 0
        };
        
        this.init();
    }

    /**
     * Initialize Google Analytics and Meauxbility tracking
     */
    init() {
        try {
            // Load Google Analytics
            this.loadGoogleAnalytics();
            
            // Initialize Meauxbility custom tracking
            this.initCustomTracking();
            
            // Track initial page view
            this.trackPageView();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('🎯 Meauxbility Analytics initialized - Measuring community impact!');
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
        }
    }

    /**
     * Load Google Analytics gtag
     */
    loadGoogleAnalytics() {
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'community_impact',
                'custom_parameter_3': 'session_id'
            }
        });
    }

    /**
     * Initialize custom Meauxbility tracking
     */
    initCustomTracking() {
        // Set custom dimensions
        this.setCustomDimensions();
        
        // Track session start
        this.trackEvent('session_start', {
            user_type: this.userType,
            referral_source: this.referralSource,
            session_id: this.sessionId,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Set custom dimensions for community impact tracking
     */
    setCustomDimensions() {
        if (window.gtag) {
            gtag('config', this.measurementId, {
                custom_map: {
                    'custom_parameter_1': 'user_type',
                    'custom_parameter_2': 'community_impact_level',
                    'custom_parameter_3': 'session_id',
                    'custom_parameter_4': 'referral_source'
                },
                user_type: this.userType,
                community_impact_level: this.getCommunityImpactLevel(),
                session_id: this.sessionId,
                referral_source: this.referralSource
            });
        }
    }

    /**
     * Track page views with community context
     */
    trackPageView(pagePath = null, pageTitle = null) {
        const path = pagePath || window.location.pathname;
        const title = pageTitle || document.title;
        
        this.communityMetrics.pageViews++;
        
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: title,
                page_location: window.location.href,
                page_path: path,
                user_type: this.userType,
                community_impact: this.getCommunityImpactLevel(),
                session_id: this.sessionId
            });
        }

        // Track specific page types
        this.trackPageType(path);
    }

    /**
     * Track specific page types for community impact
     */
    trackPageType(path) {
        let pageType = 'general';
        let impactLevel = 'awareness';

        if (path.includes('/admin')) {
            pageType = 'admin_portal';
            impactLevel = 'management';
            this.communityMetrics.adminPortalAccess++;
        } else if (path.includes('/grant')) {
            pageType = 'grant_application';
            impactLevel = 'direct_service';
        } else if (path.includes('/donate')) {
            pageType = 'donation';
            impactLevel = 'support';
        } else if (path.includes('/resources')) {
            pageType = 'resources';
            impactLevel = 'education';
        } else if (path.includes('/about')) {
            pageType = 'about';
            impactLevel = 'awareness';
        }

        this.trackEvent('page_type_view', {
            page_type: pageType,
            impact_level: impactLevel,
            user_type: this.userType
        });
    }

    /**
     * Track community impact events
     */
    trackCommunityImpact(eventName, eventData = {}) {
        const impactData = {
            ...eventData,
            user_type: this.userType,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            community_impact: this.getCommunityImpactLevel()
        };

        // Update community metrics
        this.updateCommunityMetrics(eventName);

        // Track with Google Analytics
        if (window.gtag) {
            gtag('event', eventName, impactData);
        }

        // Track with custom analytics
        this.trackCustomEvent(eventName, impactData);
    }

    /**
     * Track grant application events
     */
    trackGrantApplication(applicationData = {}) {
        this.communityMetrics.grantApplications++;
        
        this.trackCommunityImpact('grant_application_started', {
            event_category: 'community_service',
            event_label: 'grant_application',
            value: 1,
            ...applicationData
        });
    }

    /**
     * Track donation events
     */
    trackDonation(donationData = {}) {
        this.communityMetrics.donations++;
        
        this.trackCommunityImpact('donation_made', {
            event_category: 'community_support',
            event_label: 'donation',
            value: donationData.amount || 0,
            currency: 'USD',
            ...donationData
        });
    }

    /**
     * Track resource downloads
     */
    trackResourceDownload(resourceData = {}) {
        this.communityMetrics.resourceDownloads++;
        
        this.trackCommunityImpact('resource_downloaded', {
            event_category: 'community_education',
            event_label: resourceData.resource_name || 'resource',
            value: 1,
            ...resourceData
        });
    }

    /**
     * Track community engagement
     */
    trackCommunityEngagement(engagementData = {}) {
        this.communityMetrics.communityEngagements++;
        
        this.trackCommunityImpact('community_engagement', {
            event_category: 'community_building',
            event_label: engagementData.engagement_type || 'engagement',
            value: 1,
            ...engagementData
        });
    }

    /**
     * Track admin portal usage
     */
    trackAdminAction(actionData = {}) {
        this.communityMetrics.adminPortalAccess++;
        
        this.trackCommunityImpact('admin_action', {
            event_category: 'admin_management',
            event_label: actionData.action_type || 'admin_action',
            value: 1,
            ...actionData
        });
    }

    /**
     * Generic event tracking
     */
    trackEvent(eventName, eventData = {}) {
        if (window.gtag) {
            gtag('event', eventName, {
                ...eventData,
                user_type: this.userType,
                session_id: this.sessionId
            });
        }
    }

    /**
     * Track custom events for internal analytics
     */
    trackCustomEvent(eventName, eventData) {
        // Send to internal analytics API
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                data: eventData,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                user_agent: navigator.userAgent
            })
        }).catch(error => {
            console.warn('Analytics API not available:', error);
        });
    }

    /**
     * Update community metrics
     */
    updateCommunityMetrics(eventName) {
        switch (eventName) {
            case 'grant_application_started':
                this.communityMetrics.grantApplications++;
                break;
            case 'donation_made':
                this.communityMetrics.donations++;
                break;
            case 'resource_downloaded':
                this.communityMetrics.resourceDownloads++;
                break;
            case 'community_engagement':
                this.communityMetrics.communityEngagements++;
                break;
            case 'admin_action':
                this.communityMetrics.adminPortalAccess++;
                break;
        }
    }

    /**
     * Detect user type based on context
     */
    detectUserType() {
        if (window.location.pathname.includes('/admin')) {
            return 'admin';
        } else if (document.cookie.includes('donor=true')) {
            return 'donor';
        } else if (document.cookie.includes('applicant=true')) {
            return 'applicant';
        } else {
            return 'visitor';
        }
    }

    /**
     * Detect referral source
     */
    detectReferralSource() {
        const referrer = document.referrer;
        const utmSource = new URLSearchParams(window.location.search).get('utm_source');
        
        if (utmSource) {
            return `utm_${utmSource}`;
        } else if (referrer) {
            try {
                const url = new URL(referrer);
                return url.hostname;
            } catch {
                return 'direct';
            }
        } else {
            return 'direct';
        }
    }

    /**
     * Get community impact level
     */
    getCommunityImpactLevel() {
        const totalEngagement = Object.values(this.communityMetrics).reduce((a, b) => a + b, 0);
        
        if (totalEngagement >= 10) return 'high';
        if (totalEngagement >= 5) return 'medium';
        if (totalEngagement >= 1) return 'low';
        return 'awareness';
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'mx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Set up event listeners for automatic tracking
     */
    setupEventListeners() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button, .btn, .cta-button');
            if (button) {
                this.trackEvent('button_click', {
                    button_text: button.textContent?.trim(),
                    button_class: button.className,
                    page_path: window.location.pathname
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            this.trackEvent('form_submit', {
                form_id: form.id || 'unnamed_form',
                form_class: form.className,
                page_path: window.location.pathname
            });
        });

        // Track external links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="http"]');
            if (link && !link.href.includes(window.location.hostname)) {
                this.trackEvent('external_link_click', {
                    link_url: link.href,
                    link_text: link.textContent?.trim(),
                    page_path: window.location.pathname
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', {
                        scroll_percent: scrollPercent,
                        page_path: window.location.pathname
                    });
                }
            }
        });
    }

    /**
     * Get current community metrics
     */
    getCommunityMetrics() {
        return {
            ...this.communityMetrics,
            session_id: this.sessionId,
            user_type: this.userType,
            impact_level: this.getCommunityImpactLevel(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Track page exit
     */
    trackPageExit() {
        this.trackEvent('page_exit', {
            time_on_page: Date.now() - this.sessionStartTime,
            community_metrics: this.communityMetrics
        });
    }
}

// Initialize Meauxbility Analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.meauxbilityAnalytics = new MeauxbilityAnalytics();
});

// Track page exit
window.addEventListener('beforeunload', () => {
    if (window.meauxbilityAnalytics) {
        window.meauxbilityAnalytics.trackPageExit();
    }
});

// Export for use in other scripts
window.MeauxbilityAnalytics = MeauxbilityAnalytics;
