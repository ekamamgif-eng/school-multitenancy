# School Management - Quick Reference Guide

## 🎯 Quick Access URLs

| Feature | URL | Access Level |
|---------|-----|--------------|
| Super Admin Dashboard | `/super-admin` | Super Admin Only |
| View School Details | `/super-admin/schools/:id` | Super Admin Only |
| Add New School | `/super-admin/schools/add` | Super Admin Only |
| Edit School | `/super-admin/schools/:id/edit` | Super Admin Only |

---

## 📊 User Flow Diagrams

### Flow 1: Viewing Schools

```
┌─────────────────┐
│  Super Admin    │
│  Logs In        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dashboard      │
│  /super-admin   │
├─────────────────┤
│ • Statistics    │
│ • School List   │
│ • Quick Actions │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│  View Details   │  │     Manage      │
│  Button Click   │  │  Button Click   │
└────────┬────────┘  └────────┬────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│ School Detail   │  │  Edit School    │
│ Page            │  │  Form           │
└─────────────────┘  └─────────────────┘
```

### Flow 2: Creating a New School

```
┌─────────────────┐
│  Dashboard      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Click "+ Add    │
│  New School"    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  School Form                    │
│  /super-admin/schools/add       │
├─────────────────────────────────┤
│  1. Basic Information           │
│     • School Name *             │
│     • Subdomain *               │
│     • School Type               │
│     • NPSN                      │
│     • Accreditation             │
│                                 │
│  2. Contact Information         │
│     • Email, Phone, Website     │
│     • Address, City, Province   │
│                                 │
│  3. Principal Information       │
│     • Name, Email, Phone        │
│                                 │
│  4. Subscription & Limits       │
│     • Status *                  │
│     • Plan, Expiry Date         │
│     • Max Students/Teachers     │
│                                 │
│  5. Active Modules              │
│     ☑ Academic Management       │
│     ☑ Payment Management        │
│     ☐ Meeting & Minutes         │
│     ☐ Library Management        │
│     ☐ Transport Management      │
│     ☐ Attendance System         │
│                                 │
│  6. Notes                       │
│     [Text area]                 │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Click "Create  │
│  School"        │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  Validation     │  │  Validation  │
│  Success        │  │  Failed      │
└────────┬────────┘  └──────┬───────┘
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  School Created │  │ Show Errors  │
│  Redirect to    │  │ Stay on Form │
│  Detail Page    │  └──────────────┘
└─────────────────┘
```

### Flow 3: Editing a School

```
┌─────────────────┐
│  School Detail  │
│  Page           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click "Edit    │
│  School"        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  School Form (Edit Mode)        │
│  /super-admin/schools/:id/edit  │
├─────────────────────────────────┤
│  • Form pre-populated           │
│  • Subdomain field disabled     │
│  • All other fields editable    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Modify Fields  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click "Update  │
│  School"        │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  Validation     │  │  Validation  │
│  Success        │  │  Failed      │
└────────┬────────┘  └──────┬───────┘
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  School Updated │  │ Show Errors  │
│  Redirect to    │  │ Stay on Form │
│  Detail Page    │  └──────────────┘
└─────────────────┘
```

### Flow 4: Deleting a School

```
┌─────────────────┐
│  School Detail  │
│  Page           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click "Delete" │
│  Button         │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Confirmation Dialog            │
│  "Are you sure you want to      │
│   delete [School Name]?         │
│   This action cannot be undone."│
└────────┬────────────────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  User Confirms  │  │ User Cancels │
└────────┬────────┘  └──────┬───────┘
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  School Deleted │  │ Stay on Page │
│  Redirect to    │  │ No Action    │
│  Dashboard      │  └──────────────┘
└─────────────────┘
```

---

## 🔑 Key Features by Page

### Dashboard (`/super-admin`)
✅ View platform statistics  
✅ See all schools at a glance  
✅ Quick navigation to school details  
✅ Add new school button  
✅ Quick actions menu  

### School Detail (`/super-admin/schools/:id`)
✅ Comprehensive school information  
✅ Real-time statistics (students, teachers, payments)  
✅ Status badges (Active, Trial, Suspended, Inactive)  
✅ Edit and delete actions  
✅ Back to dashboard navigation  

### School Form (`/super-admin/schools/add` or `/edit`)
✅ Multi-section form  
✅ Required field validation  
✅ Subdomain uniqueness check  
✅ Module selection checkboxes  
✅ Date pickers for expiry dates  
✅ Real-time validation feedback  

---

## ✅ Validation Checklist

### Required Fields
- [ ] School Name
- [ ] Subdomain
- [ ] Status

### Subdomain Rules
- [ ] Lowercase only
- [ ] Alphanumeric + hyphens
- [ ] No spaces
- [ ] Must be unique
- [ ] Cannot be changed after creation

### Optional but Recommended
- [ ] Email (for communication)
- [ ] Phone (for contact)
- [ ] Principal information (for accountability)
- [ ] Subscription plan (for billing)

---

## 🎨 Status Badges

| Status | Color | Meaning |
|--------|-------|---------|
| **Active** | 🟢 Green | School is operational |
| **Trial** | 🔵 Blue | School is in trial period |
| **Suspended** | 🟡 Yellow | School access is temporarily suspended |
| **Inactive** | 🔴 Red | School is not operational |

---

## 📦 Available Modules

| Module | Description |
|--------|-------------|
| **Academic Management** | Student records, classes, grades |
| **Payment Management** | Fee collection, payment tracking |
| **Meeting & Minutes** | Meeting scheduling, AI-powered minutes |
| **Library Management** | Book inventory, borrowing system |
| **Transport Management** | Vehicle tracking, routes |
| **Attendance System** | Student/teacher attendance tracking |

---

## 🚨 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Subdomain already exists" | Duplicate subdomain | Choose a different subdomain |
| "Invalid subdomain format" | Special characters or uppercase | Use only lowercase, numbers, hyphens |
| "School name is required" | Empty name field | Enter a school name |
| "Failed to load school details" | Network/database error | Check connection, try again |
| "Permission denied" | Not logged in as Super Admin | Log in with Super Admin account |

---

## 🔒 Security Notes

1. **Authentication Required**: All school management features require Super Admin login
2. **Role-Based Access**: Only users with `role: 'super_admin'` can access these pages
3. **Audit Trail**: All create/update operations record `created_by` and `updated_by`
4. **Input Sanitization**: All inputs are validated and sanitized
5. **Confirmation Dialogs**: Destructive actions (delete) require confirmation

---

## 📱 Responsive Design

All pages are fully responsive and work on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

---

## 🎯 Quick Tips

1. **Use descriptive subdomains**: e.g., `sma-negeri-1-jakarta` instead of `school1`
2. **Fill in contact info**: Makes it easier to communicate with schools
3. **Set realistic limits**: Max students/teachers should match subscription plan
4. **Enable relevant modules**: Only activate modules the school will use
5. **Add notes**: Use the notes field for important reminders or special cases

---

## 📞 Need Help?

- **Documentation**: See `SCHOOL_MANAGEMENT_DOCUMENTATION.md` for detailed technical docs
- **Database Setup**: Run the migration script in `database/migrations/add_school_management_columns.sql`
- **Support**: Contact your system administrator

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0
