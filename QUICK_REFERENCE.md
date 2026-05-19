# Quick Reference Guide

## 🎯 Quick Start

### For End Users (Member Registration)
1. **Click "Join Now"** button in the navbar
2. **Fill the form** with all required information:
   - Name, Phone, Gender, Date of Birth
   - Choose package duration and category
   - Select training type and preferred time
   - Choose payment method
   - Check the agreement checkbox
3. **Submit** → WhatsApp opens automatically
4. **Done!** Your registration is saved

### For Admin
1. **Press `Ctrl + Shift + A`** to open admin panel
   - OR click the settings ⚙️ icon in navbar
2. **View Users** → See all registrations
3. **Manage Users** → Update status or delete
4. **Manage Pricing** → Update package fees
5. **Close** → Click "Close Admin Panel" button

---

## 📍 File Locations

```
/src/components/
├── JoinForm.jsx          ← Registration form
├── AdminPanel.jsx        ← Admin dashboard
├── Navbar.jsx            ← (Updated) Admin button & Join Now link
└── [other components]

/src/App.jsx              ← (Updated) Added JoinForm, AdminPanel
```

---

## 🔑 Key Access Points

| Feature | Access Method |
|---------|---------------|
| Join Form | "Join Now" button in navbar |
| Admin Panel | `Ctrl + Shift + A` or Settings icon |
| Mobile Join Form | "Join Now" in mobile menu |
| Mobile Admin | "Admin Panel" in mobile menu |

---

## 📊 User Status Types

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | Yellow | New registration, needs approval |
| Active | Green | Member is active |
| Inactive | Red | Member inactive/paused |

---

## 💰 Pricing Management

**Default Prices:**
- Monthly: ₹1,000
- 3 Months: ₹2,500
- 6 Months: ₹4,500
- Yearly: ₹8,000

**To Update:**
1. Open Admin Panel
2. Go to "Pricing" tab
3. Edit the amounts
4. Click "Save Pricing"

---

## 📝 Form Validation Rules

| Field | Rule |
|-------|------|
| Full Name | Required, text only |
| Phone | Required, 10-digit number |
| Gender | Required (Male/Female/Other) |
| DOB | Required, must be valid date |
| Package | Required (Monthly/3M/6M/Yearly) |
| Category | Required (Male/Female/Kids/Couple) |
| Training | Required (Boxing/MMA/Kickboxing/Fitness) |
| Time | Required (Morning/Evening) |
| Payment | Required (Cash/UPI/Card) |
| Terms | Must be checked |

---

## 🎨 Design Features

- **Dark Theme** - Black background with red accents
- **Responsive** - Works on mobile, tablet, desktop
- **Animated** - Smooth transitions with Framer Motion
- **Icons** - Modern Lucide React icons
- **Form States** - Validation, loading, success screens

---

## 💾 Data Locations (Browser Storage)

**localStorage keys:**
- `joinedUsers` - Array of user registration objects
- `pricing` - Object with package prices

**View in browser DevTools:**
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. View `http://localhost:5173` or your domain
4. Check `joinedUsers` and `pricing` keys

---

## 🔗 Form Sections Explained

### Section 1: Basic Info
- Collect member personal information
- Age calculated from date of birth

### Section 2: Plan Selection
- Choose membership duration
- Select category (individual/kids/couple)

### Section 3: Training & Timing
- Pick favorite training type
- Choose preferred session time

### Section 4: Payment
- Select payment method
- Used for invoicing/accounting

### Section 5: Agreement
- Accept academy rules
- Must be checked to proceed

---

## 🚀 WhatsApp Integration

When form submitted:
- **Auto opens WhatsApp** to +918506889718
- **Pre-filled message** with member details:
  - Name
  - Phone number
  - Selected package
  - Training type
  - Preferred timing
  - Payment mode

---

## ❓ Common Tasks

### How to view a registered user's details?
1. Open Admin Panel (Ctrl+Shift+A)
2. Click the **eye icon** (👁️) on the user card
3. View all their information

### How to change a user's status?
1. Open Admin Panel
2. Click the **edit icon** (✏️) on the user
3. Select new status
4. Status updates immediately

### How to remove a user?
1. Open Admin Panel
2. Click the **trash icon** (🗑️)
3. Confirm deletion
4. User removed from list

### How to update pricing?
1. Open Admin Panel
2. Click "Pricing" tab
3. Edit the amounts
4. Click "Save Pricing"

### How to see all user data?
1. Browser DevTools (F12)
2. Application → Local Storage
3. Click `joinedUsers`
4. View the JSON array

---

## 🐛 Troubleshooting

**Issue:** Form not submitting
- ✓ Check all fields are filled
- ✓ Ensure phone number is valid
- ✓ Check terms checkbox
- ✓ Verify browser allows popups (WhatsApp)

**Issue:** Admin panel won't open
- ✓ Try `Ctrl + Shift + A` shortcut
- ✓ Click settings icon in navbar
- ✓ Check browser console for errors

**Issue:** Data not saving
- ✓ Check localStorage is enabled
- ✓ Ensure not in private/incognito mode
- ✓ Check browser storage limit
- ✓ Try clearing cache and reloading

**Issue:** WhatsApp not opening
- ✓ Check if WhatsApp is installed
- ✓ Allow browser popups
- ✓ Use updated browser version
- ✓ Check internet connection

---

## 📞 Contact Info

**WhatsApp Number for Registrations:**
+918506889718

**Used for:**
- Member registrations
- Gym inquiries
- Membership questions

---

## 🎓 Training Types

- **Boxing** - Classic boxing training
- **MMA** - Mixed Martial Arts
- **Kickboxing** - Boxing + kicks
- **Fitness** - General fitness/gym

---

## 👥 Member Categories

- **Male** - Male members
- **Female** - Female members
- **Kids** - Children training
- **Couple** - Couples package

---

## ⏰ Time Slots

- **Morning** - Early morning sessions
- **Evening** - Evening sessions

---

**Last Updated:** May 19, 2024
**Status:** ✅ Production Ready
