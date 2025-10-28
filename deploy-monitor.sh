#!/bin/bash
# =============================================================================
# MEAUXBILITY DEPLOYMENT & MONITORING AUTOMATION
# =============================================================================
# This script automates deployment to all environments and provides
# comprehensive monitoring and health checks for the Meauxbility ecosystem.

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

print_deploy() {
    echo -e "${PURPLE}[DEPLOY]${NC} $1"
}

print_monitor() {
    echo -e "${CYAN}[MONITOR]${NC} $1"
}

# Load environment variables
load_env() {
    if [ -f .env.local ]; then
        export $(cat .env.local | grep -v '^#' | xargs)
        print_success "Environment variables loaded"
    else
        print_warning "No .env.local file found"
    fi
}

# Function to test API connection
test_connection() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local auth_header="$4"
    
    print_monitor "Testing $name connection..."
    
    local curl_cmd="curl -s -f -o /dev/null -w '%{http_code}'"
    if [ -n "$auth_header" ]; then
        curl_cmd="$curl_cmd -H '$auth_header'"
    fi
    
    local status_code=$(eval "$curl_cmd '$url'")
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$name: ✅ OK (Status: $status_code)"
        return 0
    else
        print_error "$name: ❌ FAIL (Status: $status_code)"
        return 1
    fi
}

# Function to deploy to Render
deploy_render() {
    print_deploy "Deploying to Render..."
    
    if [ -z "$RENDER_API_KEY" ] || [ -z "$RENDER_SERVICE_ID" ]; then
        print_error "Render API key or service ID not found"
        return 1
    fi
    
    local deploy_url="https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys"
    
    local response=$(curl -s -X POST "$deploy_url" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"clearCache": "clear"}' \
        -w "%{http_code}")
    
    local status_code="${response: -3}"
    
    if [ "$status_code" = "201" ]; then
        print_success "Render deployment initiated successfully"
        return 0
    else
        print_error "Render deployment failed (Status: $status_code)"
        return 1
    fi
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    print_deploy "Deploying to GitHub Pages..."
    
    if [ -z "$GITHUB_TOKEN" ]; then
        print_error "GitHub token not found"
        return 1
    fi
    
    # Push to main branch
    git add .
    git commit -m "🚀 Automated deployment $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main
    
    print_success "GitHub Pages deployment initiated"
    return 0
}

# Function to update Supabase
update_supabase() {
    print_deploy "Updating Supabase..."
    
    if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
        print_warning "Supabase access token not found, skipping database update"
        return 0
    fi
    
    # Check if supabase CLI is available
    if ! command -v supabase >/dev/null 2>&1; then
        print_warning "Supabase CLI not found, installing..."
        npm install -g supabase
    fi
    
    # Link to project
    supabase link --project-ref ghiulqoqujsiofsjcrqk
    
    # Push database changes
    supabase db push
    
    print_success "Supabase updated successfully"
    return 0
}

# Function to run comprehensive health check
health_check() {
    print_monitor "Running comprehensive health check..."
    echo
    
    local failed_checks=0
    
    # Test Supabase
    if ! test_connection "Supabase" "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"; then
        ((failed_checks++))
    fi
    
    # Test Render
    if ! test_connection "Render" "$RENDER_SERVICE_URL/healthz"; then
        ((failed_checks++))
    fi
    
    # Test GitHub API
    if ! test_connection "GitHub API" "https://api.github.com/repos/meauxbility/SUPABASESUPERCHARGE" "200" "Authorization: token $GITHUB_TOKEN"; then
        ((failed_checks++))
    fi
    
    # Test Stripe (if configured)
    if [ -n "$STRIPE_SECRET_KEY" ]; then
        if ! test_connection "Stripe" "https://api.stripe.com/v1/charges" "200" "Authorization: Bearer $STRIPE_SECRET_KEY"; then
            ((failed_checks++))
        fi
    else
        print_warning "Stripe not configured, skipping test"
    fi
    
    # Test Anthropic (if configured)
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        if ! test_connection "Anthropic" "https://api.anthropic.com/v1/messages" "400" "x-api-key: $ANTHROPIC_API_KEY"; then
            ((failed_checks++))
        fi
    else
        print_warning "Anthropic not configured, skipping test"
    fi
    
    echo
    if [ $failed_checks -eq 0 ]; then
        print_success "All health checks passed! 🎉"
    else
        print_error "$failed_checks health check(s) failed"
    fi
    
    return $failed_checks
}

# Function to monitor performance
performance_monitor() {
    print_monitor "Monitoring performance..."
    echo
    
    # Check Render service performance
    print_status "Render Service Performance:"
    local render_time=$(curl -s -w "%{time_total}" -o /dev/null "$RENDER_SERVICE_URL/healthz")
    echo "Response time: ${render_time}s"
    
    # Check Supabase performance
    print_status "Supabase Performance:"
    local supabase_time=$(curl -s -w "%{time_total}" -o /dev/null "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/")
    echo "Response time: ${supabase_time}s"
    
    # Check GitHub Pages performance
    print_status "GitHub Pages Performance:"
    local github_time=$(curl -s -w "%{time_total}" -o /dev/null "https://meauxbility.github.io/.org/")
    echo "Response time: ${github_time}s"
    
    # Check Spartans Command Center performance
    print_status "Spartans Command Center Performance:"
    local spartans_time=$(curl -s -w "%{time_total}" -o /dev/null "https://inneranimal.github.io/spartans_command_center/")
    echo "Response time: ${spartans_time}s"
    
    echo
    print_success "Performance monitoring complete"
}

# Function to check storage usage
storage_monitor() {
    print_monitor "Checking storage usage..."
    echo
    
    # Check Google Cloud Storage (if configured)
    if [ -n "$GOOGLE_CLOUD_PROJECT_ID" ]; then
        print_status "Google Cloud Storage Usage:"
        gcloud config set project "$GOOGLE_CLOUD_PROJECT_ID" >/dev/null 2>&1
        gsutil du -sh gs://meauxbility-* 2>/dev/null || print_warning "Google Cloud not configured or accessible"
    else
        print_warning "Google Cloud not configured"
    fi
    
    # Check local storage
    print_status "Local Storage Usage:"
    du -sh . 2>/dev/null || print_warning "Unable to check local storage"
    
    echo
    print_success "Storage monitoring complete"
}

# Function to generate deployment report
generate_report() {
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    print_status "Generating deployment report: $report_file"
    
    {
        echo "MEAUXBILITY DEPLOYMENT REPORT"
        echo "============================"
        echo "Generated: $(date)"
        echo
        
        echo "ENVIRONMENT STATUS:"
        echo "=================="
        echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
        echo "Render URL: $RENDER_SERVICE_URL"
        echo "GitHub Token: ${GITHUB_TOKEN:0:10}..."
        echo "Stripe Key: ${STRIPE_SECRET_KEY:0:10}..."
        echo "Anthropic Key: ${ANTHROPIC_API_KEY:0:10}..."
        echo
        
        echo "HEALTH CHECK RESULTS:"
        echo "===================="
        health_check
        echo
        
        echo "PERFORMANCE METRICS:"
        echo "==================="
        performance_monitor
        echo
        
        echo "STORAGE USAGE:"
        echo "============="
        storage_monitor
        echo
        
    } > "$report_file"
    
    print_success "Report generated: $report_file"
}

# Function to setup automated monitoring
setup_monitoring() {
    print_status "Setting up automated monitoring..."
    
    # Create monitoring script
    cat > monitor-continuous.sh << 'EOF'
#!/bin/bash
# Continuous monitoring script

while true; do
    echo "🔄 Running health check at $(date)"
    ./deploy-monitor.sh health-check
    
    if [ $? -ne 0 ]; then
        echo "❌ Health check failed, sending alert..."
        # Add alerting logic here (email, Slack, etc.)
    fi
    
    echo "⏰ Waiting 5 minutes before next check..."
    sleep 300
done
EOF
    
    chmod +x monitor-continuous.sh
    
    # Create cron job for daily reports
    cat > setup-cron.sh << 'EOF'
#!/bin/bash
# Setup cron jobs for monitoring

# Add daily health check at 9 AM
(crontab -l 2>/dev/null; echo "0 9 * * * cd $(pwd) && ./deploy-monitor.sh health-check >> logs/health-check.log 2>&1") | crontab -

# Add weekly performance report
(crontab -l 2>/dev/null; echo "0 10 * * 1 cd $(pwd) && ./deploy-monitor.sh report >> logs/weekly-report.log 2>&1") | crontab -

echo "✅ Cron jobs configured"
EOF
    
    chmod +x setup-cron.sh
    
    # Create logs directory
    mkdir -p logs
    
    print_success "Automated monitoring configured"
}

# Main function
main() {
    echo "🚀 MEAUXBILITY DEPLOYMENT & MONITORING"
    echo "======================================"
    echo
    
    # Load environment
    load_env
    
    # Parse command line arguments
    case "${1:-all}" in
        "deploy")
            print_deploy "Starting deployment process..."
            deploy_render
            deploy_github_pages
            update_supabase
            print_success "Deployment complete!"
            ;;
        "health-check")
            health_check
            ;;
        "monitor")
            performance_monitor
            storage_monitor
            ;;
        "report")
            generate_report
            ;;
        "setup-monitoring")
            setup_monitoring
            ;;
        "all")
            print_deploy "Running full deployment and monitoring..."
            deploy_render
            deploy_github_pages
            update_supabase
            health_check
            performance_monitor
            storage_monitor
            generate_report
            print_success "Full deployment and monitoring complete!"
            ;;
        *)
            echo "Usage: $0 {deploy|health-check|monitor|report|setup-monitoring|all}"
            echo
            echo "Commands:"
            echo "  deploy           - Deploy to all environments"
            echo "  health-check     - Run comprehensive health checks"
            echo "  monitor          - Monitor performance and storage"
            echo "  report           - Generate deployment report"
            echo "  setup-monitoring - Setup automated monitoring"
            echo "  all              - Run everything (default)"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
