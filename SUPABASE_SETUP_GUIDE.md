# Supabase Setup Guide

## 🔑 Get Your API Keys

### 1. Access Your Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Sign in to your account
- Select project: `crhhvryclvthhzfyyrla`

### 2. Navigate to API Settings
- Click on **Settings** (left sidebar)
- Click on **API** (submenu)

### 3. Copy the Required Keys

You'll see these sections:

#### **Project Configuration**
- **URL**: `https://crhhvryclvthhzfyyrla.supabase.co` ✅ (already set)

#### **Project API keys**
- **anon public** key → Copy this entire key
- **service_role** key → Copy this entire key (starts with `eyJ...`)

### 4. Update Your .env.local File

Replace the placeholder values with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL="https://crhhvryclvthhzfyyrla.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="paste_your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="paste_your_service_role_key_here"
```

### 5. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 6. Test the Connection
```bash
curl http://localhost:3000/api/supabase-test
```

### 7. Create Database Tables

After successful connection, run the SQL schema:

1. Go to your Supabase dashboard
2. Click on **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy the contents of `database-schema.sql` file
5. Click **Run** to execute

### 8. Final Test
```bash
# Test reports API
curl http://localhost:3000/api/reports

# Test volunteers API  
curl http://localhost:3000/api/volunteers
```

## ✅ Expected Results

After setup, you should see:
- Supabase connection: ✅ Connected
- Tables created: ✅ reports, volunteers
- APIs working: ✅ All endpoints functional

## 🚨 Troubleshooting

If you get "Invalid API key" error:
- Double-check you copied the complete keys (no missing characters)
- Ensure you're using the correct project
- Restart the development server after updating .env.local

## 📞 Need Help?

If you need assistance finding the keys:
1. In Supabase dashboard → Settings → API
2. Look for "Project API keys" section
3. The keys are long strings starting with `eyJ...`
4. Copy them exactly as shown
