# Railway Environment Variables Setup

## 🚨 IMPORTANT: Variables are NOT set yet!

You need to add 5 environment variables in Railway dashboard.

---

## 📋 Variables to Add

Copy these exactly:

```
DB_HOST = mysql.railway.internal
DB_NAME = railway
DB_USER = root
DB_PASS = bJAYXAWosDimtjepRwNXOGsaIXSCtKRmzZm
ADMIN_PASSWORD = komal123
```

---

## 🎯 Where to Add Them

1. **Go to Railway Dashboard**: https://railway.app/
2. **Click on your project** (Dogpetel)
3. **Click on the WEB SERVICE** (NOT the MySQL service)
4. **Click "Variables" tab** at the top
5. **Click "New Variable"** button
6. **Add each variable** one by one
7. **Railway will auto-redeploy** after you save

---

## ✅ How to Verify

After Railway finishes redeploying (2-3 minutes):

**Step 1: Check variables are set**
```
https://web-production-463ec.up.railway.app/api/debug-env.php
```
Should show all variables as SET (not "NOT SET")

**Step 2: Run database setup**
```
https://web-production-463ec.up.railway.app/api/setup.php
```
Should show: `"success": true, "tables": 5`

**Step 3: Test website**
```
https://web-production-463ec.up.railway.app
```
- Pricing page should show 33 packages
- Contact form should work
- Admin login should work

---

## 🔍 Common Mistakes

❌ **WRONG**: Adding variables to MySQL service
✅ **CORRECT**: Add variables to WEB service (Dogpetel)

❌ **WRONG**: DB_HOST = nozomi.proxy.rlwy.net
✅ **CORRECT**: DB_HOST = mysql.railway.internal

❌ **WRONG**: DB_NAME = petel_db
✅ **CORRECT**: DB_NAME = railway

---

## 📞 Need Help?

If you're stuck, take a screenshot of your Railway dashboard showing:
1. The service name you're editing
2. The Variables tab
3. Any error messages

---
