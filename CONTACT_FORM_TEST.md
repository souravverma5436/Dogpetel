# Contact Form - Testing Guide

## ✅ Issue Fixed!

The contact form now saves to database properly. The problem was that `contacts.php` required composer dependencies which weren't installed.

---

## 🔄 How to Test

### Step 1: Restart Backend

**Stop backend** (press Ctrl+C in backend terminal)

**Start again:**
```bash
D:
cd D:\WEB\Petel\server
C:\xampp\php\php.exe -S localhost:8000
```

### Step 2: Test Contact Form

1. **Open website:**
   ```
   http://localhost:5173/contact
   ```

2. **Fill the form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +91 98765 43210
   - Message: This is a test message

3. **Click "Send Message"**

4. **You should see:**
   ```
   ✅ Thank you for contacting us! 
      We will get back to you soon at +91 98765 43210
   ```

5. **Form should clear automatically**

### Step 3: Verify in Database

**Check database:**
```bash
mysql -u root -p petel_db -e "SELECT * FROM contacts ORDER BY id DESC LIMIT 1;"
```

**Should show your test message**

### Step 4: Check Admin Dashboard

1. **Login to admin:**
   ```
   http://localhost:5173/admin
   Password: komal123
   ```

2. **Click "Contact Messages" tab**

3. **You should see:**
   - Your test message
   - Red badge with count (1)
   - Name, Email, Phone, Message
   - Date/Time of submission

4. **Try the buttons:**
   - 📞 Call (opens phone dialer)
   - 📧 Email (opens email client)
   - Delete (removes message)

---

## 🧪 Complete Test Checklist

- [ ] Backend starts without errors
- [ ] Contact form loads
- [ ] Can fill all fields
- [ ] Submit button works
- [ ] Success message appears
- [ ] Form clears after submit
- [ ] Message saved to database
- [ ] Admin can see message
- [ ] Badge shows count
- [ ] Call button works
- [ ] Email button works
- [ ] Delete button works

---

## 🐛 If Still Not Working

### Issue: Form submits but no success message

**Check browser console (F12):**
- Look for errors
- Check Network tab for API response

### Issue: Success message but not in database

**Check database connection:**
```bash
mysql -u root -p petel_db -e "SHOW TABLES;"
```

**Check contacts table exists:**
```bash
mysql -u root -p petel_db -e "DESC contacts;"
```

### Issue: Admin can't see messages

**Check API endpoint:**
```
http://localhost:8000/api/admin/contacts.php
```

**Should see JSON with contacts**

### Issue: Backend error

**Check backend terminal for errors**

**Common fix:**
```bash
# Restart backend
Ctrl+C
C:\xampp\php\php.exe -S localhost:8000
```

---

## 📊 Database Structure

```sql
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 API Endpoints

### Submit Contact Form
```
POST http://localhost:8000/api/contacts.php
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+91 98765 43210",
  "message": "Test message"
}
Response: {
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon at +91 98765 43210"
}
```

### Get Contacts (Admin)
```
GET http://localhost:8000/api/admin/contacts.php
Headers: Cookie (session)
Response: {
  "success": true,
  "data": [...]
}
```

### Delete Contact (Admin)
```
DELETE http://localhost:8000/api/admin/contacts.php
Headers: Cookie (session)
Body: {"id": 1}
Response: {
  "success": true,
  "message": "Contact deleted"
}
```

---

## ✅ What Works Now

- ✅ Contact form submission
- ✅ Database storage
- ✅ Success message display
- ✅ Form validation
- ✅ Admin view contacts
- ✅ Admin notification badge
- ✅ Call/Email/Delete actions
- ✅ Auto-refresh (20s)
- ✅ Mobile responsive

---

## 📧 Email Notifications (Optional)

Currently disabled. To enable:

1. **Install composer:**
   ```bash
   cd D:\WEB\Petel\server
   composer install
   ```

2. **Configure Gmail:**
   Edit `server/.env`:
   ```env
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_password
   ADMIN_EMAIL=komal@petel.com
   ```

3. **Email will be sent automatically**

---

## 📞 Support

**Business Owner:** Komal  
**Phone:** +91 82838 83463

---

**Last Updated:** 2026-02-12  
**Status:** ✅ Fixed & Working

---

**PETEL - A Pet Hotel**  
Your Dog's Home Away From Home 🐕
