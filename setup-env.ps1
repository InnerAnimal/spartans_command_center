# ============================================================================
# INNERANIMALMEDIA.COM - Environment Setup Script
# Run this to create .env.local with all API keys
# ============================================================================

Write-Host "🔐 Setting up environment variables for InnerAnimalMedia..." -ForegroundColor Cyan
Write-Host ""

$projectPath = Get-Location
$envFilePath = Join-Path $projectPath ".env.local"

Write-Host "Creating $envFilePath ..." -ForegroundColor Yellow

# Environment variables
$envContent = @"
# =============================================================================
# INNERANIMALMEDIA.COM - ENVIRONMENT VARIABLES
# Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# ⚠️ Keep this file secure and never commit to git!
# =============================================================================

# =============================================================================
# SUPABASE (Database & Authentication) ✅ CONFIGURED
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk2MDA5MCwiZXhwIjoyMDc2NTM2MDkwfQ.kk2kiNNoUkeF6wNeNcL1a6Nuwr7vcbbdVQrrrlkX4J4
SUPABASE_JWT_SECRET=nhw9k1T0CYn2r7YZ9HCr9I9m5ZFq0guTYvvOIh3T9ksIoT9xJb2+AbnmSq/RGg2qmf7HV89vpYHAPD6I//ixew==

# =============================================================================
# CLOUDFLARE (Storage & CDN) ✅ CONFIGURED
# =============================================================================
CLOUDFLARE_ACCOUNT_ID=e8d0359c2ad85845814f446f4dd174ea
CLOUDFLARE_ACCOUNT_ID_INNERANIMALS=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_API_TOKEN=FCYx1bfM_5Tb3KSgGcSbVH0ArbbMGVo0DPGrSekI
CLOUDFLARE_KV_NAMESPACE_ID=5a156c2799884edd9490c09cedcda117
CLOUDFLARE_ZONE_ID=0bab48636c1bea4be4ea61c0c7787c3e
CRAZY_CONNECTED=e8d0359c2ad85845814f446f4dd174ea

# =============================================================================
# STRIPE (Payments) ✅ CONFIGURED
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SJPjpK5HnR8nkDr2uGDyZvrezAHxAjP8v2pn06ItWk7xUG86aWX72VcMA5S9irhqwDWjH7YSixa4QfD8uruEx88003bSI91TX
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_ac1Pc6tHKMtr0THF6MDBgmybnQUOI9Uk

# =============================================================================
# RESEND (Email Service) ✅ CONFIGURED!
# =============================================================================
RESEND_API_KEY=re_U183DFLM_qBKzcYhN2KXEvJf3z8e59ifQ

# =============================================================================
# GOOGLE SERVICES ✅ CONFIGURED
# =============================================================================
GOOGLE_API_KEY=AIzaSyDcrNrKERctNfX5lOToqfJo00hIKuupW90
GOOGLE_CLIENT_ID=688530500057-2a9s2b8db2cogd4tv1vk3sd8jv13qubj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GA4_MEASUREMENT_ID=G-R43YS1Q7J0
GA4_API_SECRET=vVRFTRQ0RkmZhriLnhhbWQ

# =============================================================================
# VERCEL (Deployment) ✅ CONFIGURED
# =============================================================================
VERCEL_TOKEN=FKD2OehpMeljUwC0c7WUsurt
VERCEL_PROJECT_ID=prj_4rOWsKyVlnVE2kHyRT75ZXYLaM3f

# =============================================================================
# AI SERVICES ⚠️ ADD WHEN YOU GET API KEYS
# =============================================================================
# ANTHROPIC_API_KEY=sk-ant-api03-XXXXX
# OPENAI_API_KEY=sk-proj-XXXXX

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================
NEXT_PUBLIC_APP_URL=https://inneranimalmedia.com
NEXT_PUBLIC_API_URL=https://meauxbility-api.meauxbility.workers.dev
NODE_ENV=development
ACCESS_TOKEN_EXPIRY=3600

# =============================================================================
# ADMIN CONTACT
# =============================================================================
ADMIN_EMAIL=meauxbility@gmail.com
ADMIN_PHONE=+13374509998
"@

# Write the file
Set-Content -Path $envFilePath -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host "✅ Environment file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 File Created:" -ForegroundColor Cyan
Write-Host "   • .env.local" -ForegroundColor White
Write-Host ""
Write-Host "✅ Keys Configured:" -ForegroundColor Green
Write-Host "   ✅ Supabase (Database & Auth)" -ForegroundColor Green
Write-Host "   ✅ Cloudflare (Storage & CDN)" -ForegroundColor Green
Write-Host "   ✅ Stripe (Payments)" -ForegroundColor Green
Write-Host "   ✅ Resend (Email)" -ForegroundColor Green
Write-Host "   ✅ Google APIs" -ForegroundColor Green
Write-Host "   ✅ Vercel (Deployment)" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Still Needed:" -ForegroundColor Yellow
Write-Host "   ⚠️  ANTHROPIC_API_KEY (for Claude)" -ForegroundColor Yellow
Write-Host "   ⚠️  OPENAI_API_KEY (for ChatGPT)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Ready to build! Run: npm run dev" -ForegroundColor Green
Write-Host ""

