/**
 * Meauxbility Event Tracking System
 * Community Impact Event Handlers
 * 
 * This system tracks specific events that demonstrate
 * our community impact and mission effectiveness.
 */

class MeauxbilityEventTracker {
    constructor(analytics) {
        this.analytics = analytics;
        this.setupEventHandlers();
    }

    /**
     * Set up all event handlers for community impact tracking
     */
    setupEventHandlers() {
        this.setupGrantApplicationEvents();
        this.setupDonationEvents();
        this.setupResourceEvents();
        this.setupCommunityEngagementEvents();
        this.setupAdminEvents();
        this.setupAccessibilityEvents();
        this.setupMissionImpactEvents();
    }

    /**
     * Grant Application Event Handlers
     */
    setupGrantApplicationEvents() {
        // Track grant application form interactions
        this.trackFormFieldInteractions('grant-application-form', 'grant_application');
        
        // Track grant application steps
        this.trackMultiStepForm('grant-application', [
            'personal_info',
            'injury_details',
            'mobility_needs',
            'financial_situation',
            'supporting_documents',
            'review_submission'
        ]);

        // Track grant application completion
        this.trackFormCompletion('grant-application-form', 'grant_application_completed', {
            event_category: 'community_service',
            impact_level: 'direct_service'
        });
    }

    /**
     * Donation Event Handlers
     */
    setupDonationEvents() {
        // Track donation amount selection
        document.addEventListener('click', (event) => {
            const amountButton = event.target.closest('[data-donation-amount]');
            if (amountButton) {
                const amount = amountButton.dataset.donationAmount;
                this.analytics.trackEvent('donation_amount_selected', {
                    event_category: 'community_support',
                    donation_amount: amount,
                    currency: 'USD'
                });
            }
        });

        // Track donation form interactions
        this.trackFormFieldInteractions('donation-form', 'donation');

        // Track donation completion
        this.trackFormCompletion('donation-form', 'donation_completed', {
            event_category: 'community_support',
            impact_level: 'financial_support'
        });

        // Track recurring donation setup
        document.addEventListener('change', (event) => {
            if (event.target.name === 'recurring_donation') {
                this.analytics.trackEvent('recurring_donation_toggled', {
                    event_category: 'community_support',
                    is_recurring: event.target.checked
                });
            }
        });
    }

    /**
     * Resource Download Event Handlers
     */
    setupResourceEvents() {
        // Track resource downloads
        document.addEventListener('click', (event) => {
            const downloadLink = event.target.closest('[data-resource-download]');
            if (downloadLink) {
                const resourceType = downloadLink.dataset.resourceDownload;
                const resourceName = downloadLink.textContent?.trim();
                
                this.analytics.trackResourceDownload({
                    resource_type: resourceType,
                    resource_name: resourceName,
                    event_category: 'community_education'
                });
            }
        });

        // Track resource page views
        this.trackResourcePageViews();
    }

    /**
     * Community Engagement Event Handlers
     */
    setupCommunityEngagementEvents() {
        // Track newsletter signups
        this.trackFormCompletion('newsletter-signup', 'newsletter_signup', {
            event_category: 'community_building',
            impact_level: 'engagement'
        });

        // Track social media interactions
        document.addEventListener('click', (event) => {
            const socialLink = event.target.closest('[data-social-platform]');
            if (socialLink) {
                const platform = socialLink.dataset.socialPlatform;
                this.analytics.trackCommunityEngagement({
                    engagement_type: 'social_media_click',
                    platform: platform,
                    event_category: 'community_building'
                });
            }
        });

        // Track contact form interactions
        this.trackFormFieldInteractions('contact-form', 'contact');
        this.trackFormCompletion('contact-form', 'contact_form_submitted', {
            event_category: 'community_building',
            impact_level: 'engagement'
        });

        // Track volunteer interest
        this.trackFormCompletion('volunteer-form', 'volunteer_interest', {
            event_category: 'community_building',
            impact_level: 'volunteer_engagement'
        });
    }

    /**
     * Admin Portal Event Handlers
     */
    setupAdminEvents() {
        // Track admin login
        this.trackFormCompletion('admin-login', 'admin_login', {
            event_category: 'admin_management',
            impact_level: 'management'
        });

        // Track admin actions
        document.addEventListener('click', (event) => {
            const adminAction = event.target.closest('[data-admin-action]');
            if (adminAction) {
                const actionType = adminAction.dataset.adminAction;
                this.analytics.trackAdminAction({
                    action_type: actionType,
                    event_category: 'admin_management'
                });
            }
        });

        // Track admin dashboard views
        this.trackAdminDashboardSections();
    }

    /**
     * Accessibility Event Handlers
     */
    setupAccessibilityEvents() {
        // Track accessibility tool usage
        document.addEventListener('click', (event) => {
            const accessibilityTool = event.target.closest('[data-accessibility-tool]');
            if (accessibilityTool) {
                const toolType = accessibilityTool.dataset.accessibilityTool;
                this.analytics.trackEvent('accessibility_tool_used', {
                    event_category: 'accessibility',
                    tool_type: toolType,
                    impact_level: 'accessibility_support'
                });
            }
        });

        // Track high contrast mode toggle
        document.addEventListener('change', (event) => {
            if (event.target.id === 'high-contrast-toggle') {
                this.analytics.trackEvent('high_contrast_toggled', {
                    event_category: 'accessibility',
                    is_enabled: event.target.checked
                });
            }
        });

        // Track font size adjustments
        document.addEventListener('click', (event) => {
            const fontSizeButton = event.target.closest('[data-font-size]');
            if (fontSizeButton) {
                const fontSize = fontSizeButton.dataset.fontSize;
                this.analytics.trackEvent('font_size_changed', {
                    event_category: 'accessibility',
                    font_size: fontSize
                });
            }
        });
    }

    /**
     * Mission Impact Event Handlers
     */
    setupMissionImpactEvents() {
        // Track mission statement engagement
        document.addEventListener('click', (event) => {
            const missionElement = event.target.closest('[data-mission-element]');
            if (missionElement) {
                const elementType = missionElement.dataset.missionElement;
                this.analytics.trackCommunityEngagement({
                    engagement_type: 'mission_engagement',
                    element_type: elementType,
                    event_category: 'mission_impact'
                });
            }
        });

        // Track success story interactions
        document.addEventListener('click', (event) => {
            const successStory = event.target.closest('[data-success-story]');
            if (successStory) {
                const storyId = successStory.dataset.successStory;
                this.analytics.trackEvent('success_story_viewed', {
                    event_category: 'mission_impact',
                    story_id: storyId,
                    impact_level: 'inspiration'
                });
            }
        });

        // Track impact metrics views
        this.trackImpactMetricsViews();
    }

    /**
     * Track form field interactions
     */
    trackFormFieldInteractions(formSelector, formType) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        form.addEventListener('focus', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                this.analytics.trackEvent('form_field_focused', {
                    event_category: 'form_interaction',
                    form_type: formType,
                    field_name: event.target.name || event.target.id,
                    field_type: event.target.type || event.target.tagName.toLowerCase()
                });
            }
        });

        form.addEventListener('blur', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                this.analytics.trackEvent('form_field_completed', {
                    event_category: 'form_interaction',
                    form_type: formType,
                    field_name: event.target.name || event.target.id,
                    field_type: event.target.type || event.target.tagName.toLowerCase(),
                    has_value: event.target.value.length > 0
                });
            }
        });
    }

    /**
     * Track multi-step form progress
     */
    trackMultiStepForm(formSelector, steps) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        let currentStep = 0;
        const stepElements = steps.map(step => document.querySelector(`[data-step="${step}"]`));

        // Track step navigation
        document.addEventListener('click', (event) => {
            const nextButton = event.target.closest('[data-next-step]');
            const prevButton = event.target.closest('[data-prev-step]');
            
            if (nextButton && currentStep < steps.length - 1) {
                currentStep++;
                this.analytics.trackEvent('form_step_completed', {
                    event_category: 'form_progress',
                    form_type: formSelector.replace('-', '_'),
                    step_name: steps[currentStep - 1],
                    step_number: currentStep,
                    total_steps: steps.length
                });
            } else if (prevButton && currentStep > 0) {
                currentStep--;
                this.analytics.trackEvent('form_step_revisited', {
                    event_category: 'form_progress',
                    form_type: formSelector.replace('-', '_'),
                    step_name: steps[currentStep],
                    step_number: currentStep + 1,
                    total_steps: steps.length
                });
            }
        });
    }

    /**
     * Track form completion
     */
    trackFormCompletion(formSelector, eventName, eventData = {}) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        form.addEventListener('submit', (event) => {
            // Prevent default to allow custom handling
            event.preventDefault();
            
            // Track completion
            this.analytics.trackEvent(eventName, {
                ...eventData,
                form_id: form.id || formSelector,
                form_class: form.className,
                page_path: window.location.pathname
            });

            // Allow form to continue with normal submission
            setTimeout(() => {
                form.submit();
            }, 100);
        });
    }

    /**
     * Track resource page views
     */
    trackResourcePageViews() {
        const resourcePages = document.querySelectorAll('[data-resource-page]');
        resourcePages.forEach(page => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const resourceType = entry.target.dataset.resourcePage;
                        this.analytics.trackEvent('resource_page_viewed', {
                            event_category: 'community_education',
                            resource_type: resourceType,
                            impact_level: 'education'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(page);
        });
    }

    /**
     * Track admin dashboard sections
     */
    trackAdminDashboardSections() {
        const dashboardSections = document.querySelectorAll('[data-dashboard-section]');
        dashboardSections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionName = entry.target.dataset.dashboardSection;
                        this.analytics.trackAdminAction({
                            action_type: 'dashboard_section_viewed',
                            section_name: sectionName,
                            event_category: 'admin_management'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(section);
        });
    }

    /**
     * Track impact metrics views
     */
    trackImpactMetricsViews() {
        const impactMetrics = document.querySelectorAll('[data-impact-metric]');
        impactMetrics.forEach(metric => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const metricType = entry.target.dataset.impactMetric;
                        this.analytics.trackEvent('impact_metric_viewed', {
                            event_category: 'mission_impact',
                            metric_type: metricType,
                            impact_level: 'awareness'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(metric);
        });
    }

    /**
     * Track custom community events
     */
    trackCustomEvent(eventName, eventData = {}) {
        this.analytics.trackCommunityImpact(eventName, {
            ...eventData,
            timestamp: new Date().toISOString(),
            page_path: window.location.pathname
        });
    }

    /**
     * Track user journey milestones
     */
    trackUserJourneyMilestone(milestone, data = {}) {
        this.analytics.trackEvent('user_journey_milestone', {
            event_category: 'user_journey',
            milestone: milestone,
            ...data
        });
    }

    /**
     * Track accessibility improvements
     */
    trackAccessibilityImprovement(improvement, data = {}) {
        this.analytics.trackEvent('accessibility_improvement', {
            event_category: 'accessibility',
            improvement_type: improvement,
            impact_level: 'accessibility_support',
            ...data
        });
    }
}

// Initialize event tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.meauxbilityAnalytics) {
        window.meauxbilityEventTracker = new MeauxbilityEventTracker(window.meauxbilityAnalytics);
    }
});

// Export for use in other scripts
window.MeauxbilityEventTracker = MeauxbilityEventTracker;
