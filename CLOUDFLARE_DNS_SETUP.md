# 🌐 Cloudflare DNS Setup for InnerAnimalMedia.com

## ✅ Current Status
- **Application:** Successfully deployed to Vercel! 🎉
- **Vercel URL:** https://inneranimalmedia-hj2o1yu3u-meauxbilityorg.vercel.app
- **Domain:** inneranimalmedia.com (needs DNS configuration)

---

## 📋 Manual DNS Configuration Steps

### Step 1: Access Cloudflare Dashboard

1. Go to: **https://dash.cloudflare.com/**
2. Log in with your Cloudflare account
3. Select domain: **inneranimalmedia.com**
4. Click on **DNS** in the left sidebar

### Step 2: Add CNAME Record for Root Domain

**Option A: CNAME Record (Recommended)**

1. Click **"Add record"**
2. Configure:
   - **Type:** CNAME
   - **Name:** @ (or leave blank for root domain)
   - **Target:** `cname.vercel-dns.com`
   - **TTL:** Auto
   - **Proxy status:** 🔴 DNS only (turn OFF the orange cloud)
3. Click **Save**

**Option B: A Record (Alternative)**

If CNAME doesn't work for root domain:
1. Click **"Add record"**
2. Configure:
   - **Type:** A
   - **Name:** @ (or leave blank for root domain)
   - **IPv4 address:** `76.76.21.21`
   - **TTL:** Auto
   - **Proxy status:** 🔴 DNS only (turn OFF the orange cloud)
3. Click **Save**

### Step 3: Add CNAME Record for www

1. Click **"Add record"** again
2. Configure:
   - **Type:** CNAME
   - **Name:** www
   - **Target:** `cname.vercel-dns.com`
   - **TTL:** Auto
   - **Proxy status:** 🔴 DNS only (turn OFF the orange cloud)
3. Click **Save**

### Step 4: Remove Conflicting Records (If Any)

If you see any existing A, AAAA, or CNAME records for `@` or `www`, delete them before adding the new ones:
- Click the three dots ⋯ next to the record
- Select **Delete**
- Confirm deletion

---

## 🔧 Vercel Configuration (After DNS Setup)

### Option 1: Use Vercel Dashboard (Easiest)

1. Go to: **https://vercel.com/dashboard**
2. Select your project: **inneranimalmedia**
3. Go to **Settings** → **Domains**
4. Click **"Add"** button
5. Enter: `inneranimalmedia.com`
6. Click **Add**
7. Repeat for `www.inneranimalmedia.com`

### Option 2: Use Vercel CLI (Advanced)

```bash
# In your project directory
cd "C:\Users\conno\OneDrive\Desktop\InnerAnimalMedia"

# Add root domain
vercel domains add inneranimalmedia.com --token=FKD2OehpMeljUwC0c7WUsurt

# Add www subdomain
vercel domains add www.inneranimalmedia.com --token=FKD2OehpMeljUwC0c7WUsurt
```

---

## ✅ Verification

### Check DNS Propagation

Wait 5-15 minutes after adding DNS records, then test:

**Windows:**
```powershell
# Check root domain
nslookup inneranimalmedia.com

# Check www subdomain
nslookup www.inneranimalmedia.com
```

**Expected Results:**
```
Name:    inneranimalmedia.com
Address: 76.76.21.21 (or points to cname.vercel-dns.com)
```

### Check in Browser

1. Visit: **https://inneranimalmedia.com**
2. Visit: **https://www.inneranimalmedia.com**

Both should show your InnerAnimalMedia application! 🎉

---

## 🔐 SSL Certificate

Vercel automatically provides SSL certificates for your domain:
- **Free SSL** via Let's Encrypt
- **Auto-renewal** every 90 days
- **Forced HTTPS** redirect

You don't need to do anything for SSL - it's automatic once DNS is configured!

---

## 🐛 Troubleshooting

### Issue: "Domain Not Found" Error in Browser

**Solution:** DNS hasn't propagated yet
- Wait 15-30 minutes
- Clear your browser cache
- Try incognito/private browsing mode
- Use different DNS: `8.8.8.8` (Google) or `1.1.1.1` (Cloudflare)

### Issue: "This site can't be reached"

**Solution:** Check DNS records
1. Verify CNAME/A records are correct in Cloudflare
2. Make sure **Proxy status is OFF** (gray cloud, not orange)
3. Check for typos in target values

### Issue: Cloudflare Shows Orange Cloud

**Important:** The orange cloud (proxy) must be **OFF** for Vercel domains
- Click the orange cloud icon to turn it gray
- Vercel needs direct DNS access
- SSL/HTTPS will still work via Vercel

### Issue: SSL Certificate Error

**Solution:** Wait for Vercel to provision certificate
- Takes 5-15 minutes after DNS is configured
- Vercel auto-detects valid DNS and issues SSL
- Check Vercel dashboard for SSL status

### Issue: Shows Old Content

**Solution:** Clear cache
```bash
# Force refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

## 📊 Current Configuration Summary

### Your Credentials
- **Cloudflare Zone ID:** 0bab48636c1bea4be4ea61c0c7787c3e
- **Cloudflare Account ID:** ede6590ac0d2fb7daf155b35653457b2
- **Vercel Project ID:** prj_4rOWsKyVlnVE2kHyRT75ZXYLaM3f
- **Vercel Token:** FKD2OehpMeljUwC0c7WUsurt

### DNS Records to Add

| Type  | Name | Target/Value          | Proxy | TTL  |
|-------|------|-----------------------|-------|------|
| CNAME | @    | cname.vercel-dns.com  | OFF   | Auto |
| CNAME | www  | cname.vercel-dns.com  | OFF   | Auto |

**OR (Alternative for root domain):**

| Type  | Name | Target/Value  | Proxy | TTL  |
|-------|------|---------------|-------|------|
| A     | @    | 76.76.21.21   | OFF   | Auto |
| CNAME | www  | cname.vercel-dns.com | OFF | Auto |

---

## 🎯 Quick Start Checklist

- [ ] Log into Cloudflare Dashboard
- [ ] Go to DNS settings for inneranimalmedia.com
- [ ] Delete any existing @ or www records
- [ ] Add CNAME @ → cname.vercel-dns.com (Proxy OFF)
- [ ] Add CNAME www → cname.vercel-dns.com (Proxy OFF)
- [ ] Wait 15 minutes for DNS propagation
- [ ] Go to Vercel Dashboard → Settings → Domains
- [ ] Add inneranimalmedia.com domain
- [ ] Add www.inneranimalmedia.com domain
- [ ] Wait for SSL certificate (auto-issued)
- [ ] Visit https://inneranimalmedia.com
- [ ] 🎉 Celebrate!

---

## 📞 Need Help?

**Cloudflare Support:**
- Dashboard: https://dash.cloudflare.com/
- Docs: https://developers.cloudflare.com/dns/

**Vercel Support:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs/concepts/projects/custom-domains

---

**Your application is deployed and ready!** 🚀  
Just configure the DNS and you'll be live at **inneranimalmedia.com**!

