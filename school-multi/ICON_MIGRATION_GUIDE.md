# Icon Migration Guide: Lucide React → Heroicons

## Overview
This guide documents the migration from Lucide React icons to Heroicons v2.

## Installation
```bash
npm install @heroicons/react
```

## Import Syntax

### Lucide React (Old)
```typescript
import { Icon } from 'lucide-react'
<Icon size={24} />
```

### Heroicons (New)
```typescript
import { IconName } from '@heroicons/react/24/outline' // or /24/solid
<IconName className="w-6 h-6" />
```

## Icon Mapping Reference

| Lucide Icon | Heroicons Equivalent | Import Path |
|-------------|---------------------|-------------|
| `Shield` | `ShieldCheckIcon` | `@heroicons/react/24/outline` |
| `Zap` | `BoltIcon` | `@heroicons/react/24/outline` |
| `Users` | `UsersIcon` | `@heroicons/react/24/outline` |
| `BarChart3` | `ChartBarIcon` | `@heroicons/react/24/outline` |
| `GraduationCap` | `AcademicCapIcon` | `@heroicons/react/24/outline` |
| `Globe` | `GlobeAltIcon` | `@heroicons/react/24/outline` |
| `LogOut` | `ArrowRightOnRectangleIcon` | `@heroicons/react/24/outline` |
| `Home` | `HomeIcon` | `@heroicons/react/24/outline` |
| `Mail` | `EnvelopeIcon` | `@heroicons/react/24/outline` |
| `Lock` | `LockClosedIcon` | `@heroicons/react/24/outline` |
| `Layout` | `Squares2X2Icon` | `@heroicons/react/24/outline` |
| `ArrowLeft` | `ArrowLeftIcon` | `@heroicons/react/24/outline` |
| `Database` | `CircleStackIcon` | `@heroicons/react/24/outline` |
| `Download` | `ArrowDownTrayIcon` | `@heroicons/react/24/outline` |
| `Terminal` | `CommandLineIcon` | `@heroicons/react/24/outline` |
| `CheckCircle` | `CheckCircleIcon` | `@heroicons/react/24/outline` |
| `AlertCircle` | `ExclamationCircleIcon` | `@heroicons/react/24/outline` |
| `ExternalLink` | `ArrowTopRightOnSquareIcon` | `@heroicons/react/24/outline` |
| `Lightbulb` | `LightBulbIcon` | `@heroicons/react/24/outline` |
| `XCircle` | `XCircleIcon` | `@heroicons/react/24/outline` |
| `Key` | `KeyIcon` | `@heroicons/react/24/outline` |
| `AlertTriangle` | `ExclamationTriangleIcon` | `@heroicons/react/24/outline` |
| `ArrowRight` | `ArrowRightIcon` | `@heroicons/react/24/outline` |
| `BookOpen` | `BookOpenIcon` | `@heroicons/react/24/outline` |
| `User` | `UserIcon` | `@heroicons/react/24/outline` |
| `Bell` | `BellIcon` | `@heroicons/react/24/outline` |
| `Moon` | `MoonIcon` | `@heroicons/react/24/outline` |
| `Save` | `ArrowDownTrayIcon` or `CheckIcon` | `@heroicons/react/24/outline` |
| `Check` | `CheckIcon` | `@heroicons/react/24/outline` |
| `Trash2` | `TrashIcon` | `@heroicons/react/24/outline` |
| `Info` | `InformationCircleIcon` | `@heroicons/react/24/outline` |
| `FileText` | `DocumentTextIcon` | `@heroicons/react/24/outline` |
| `Eye` | `EyeIcon` | `@heroicons/react/24/outline` |
| `Upload` | `ArrowUpTrayIcon` | `@heroicons/react/24/outline` |
| `Search` | `MagnifyingGlassIcon` | `@heroicons/react/24/outline` |
| `Filter` | `FunnelIcon` | `@heroicons/react/24/outline` |
| `FolderOpen` | `FolderOpenIcon` | `@heroicons/react/24/outline` |
| `X` | `XMarkIcon` | `@heroicons/react/24/outline` |
| `ChevronLeft` | `ChevronLeftIcon` | `@heroicons/react/24/outline` |
| `ChevronRight` | `ChevronRightIcon` | `@heroicons/react/24/outline` |
| `Plus` | `PlusIcon` | `@heroicons/react/24/outline` |
| `Clock` | `ClockIcon` | `@heroicons/react/24/outline` |
| `MapPin` | `MapPinIcon` | `@heroicons/react/24/outline` |
| `Edit` | `PencilIcon` | `@heroicons/react/24/outline` |
| `Phone` | `PhoneIcon` | `@heroicons/react/24/outline` |
| `Bus` | `TruckIcon` (closest match) | `@heroicons/react/24/outline` |
| `Calendar` | `CalendarIcon` | `@heroicons/react/24/outline` |
| `Building` | `BuildingOfficeIcon` | `@heroicons/react/24/outline` |
| `Flag` | `FlagIcon` | `@heroicons/react/24/outline` |
| `Camera` | `CameraIcon` | `@heroicons/react/24/outline` |
| `DollarSign` | `CurrencyDollarIcon` | `@heroicons/react/24/outline` |
| `TrendingUp` | `ArrowTrendingUpIcon` | `@heroicons/react/24/outline` |
| `CreditCard` | `CreditCardIcon` | `@heroicons/react/24/outline` |
| `Receipt` | `ReceiptPercentIcon` | `@heroicons/react/24/outline` |
| `Award` | `TrophyIcon` | `@heroicons/react/24/outline` |
| `HelpCircle` | `QuestionMarkCircleIcon` | `@heroicons/react/24/outline` |
| `LogIn` | `ArrowRightOnRectangleIcon` | `@heroicons/react/24/outline` |
| `Loader2` | `ArrowPathIcon` (with spin animation) | `@heroicons/react/24/outline` |

## Size Conversion

| Lucide `size` prop | Heroicons `className` |
|-------------------|----------------------|
| `size={16}` | `className="w-4 h-4"` |
| `size={18}` | `className="w-5 h-5"` |
| `size={20}` | `className="w-5 h-5"` |
| `size={24}` | `className="w-6 h-6"` |
| `size={32}` | `className="w-8 h-8"` |
| `size={48}` | `className="w-12 h-12"` |

## Migration Examples

### Example 1: Simple Icon
```typescript
// Before (Lucide)
import { Shield } from 'lucide-react'
<Shield size={24} />

// After (Heroicons)
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
<ShieldCheckIcon className="w-6 h-6" />
```

### Example 2: Icon with Color
```typescript
// Before (Lucide)
import { Check } from 'lucide-react'
<Check size={20} color="#10b981" />

// After (Heroicons)
import { CheckIcon } from '@heroicons/react/24/outline'
<CheckIcon className="w-5 h-5 text-green-500" />
```

### Example 3: Solid vs Outline
```typescript
// Outline (default)
import { UserIcon } from '@heroicons/react/24/outline'
<UserIcon className="w-6 h-6" />

// Solid
import { UserIcon } from '@heroicons/react/24/solid'
<UserIcon className="w-6 h-6" />
```

## Files to Update

### High Priority (User-Facing)
- [x] `src/pages/LandingPage.tsx` ✅ DONE
- [ ] `src/components/auth/LoginActions.tsx`
- [ ] `src/components/layout/Sidebar.tsx`
- [ ] `src/components/layout/MainLayout.tsx`
- [ ] `src/pages/admin/AdminDashboard.tsx`

### Medium Priority
- [ ] `src/pages/admin/students/StudentsList.tsx`
- [ ] `src/pages/admin/students/StudentForm.tsx`
- [ ] `src/pages/admin/students/StudentDetail.tsx`
- [ ] `src/pages/admin/teachers/TeachersList.tsx`
- [ ] `src/pages/admin/teachers/TeacherForm.tsx`
- [ ] `src/pages/admin/teachers/TeacherDetail.tsx`

### Low Priority
- [ ] `src/pages/SettingsPage.tsx`
- [ ] `src/pages/NotificationsPage.tsx`
- [ ] `src/pages/DocumentsPage.tsx`
- [ ] `src/pages/CalendarPage.tsx`
- [ ] `src/pages/admin/FinancePage.tsx`
- [ ] `src/pages/admin/AcademicPage.tsx`
- [ ] `src/pages/admin/TransportPage.tsx`

## Automated Migration Script

You can use this find-and-replace pattern:

```bash
# Find all Lucide imports
grep -r "from 'lucide-react'" src/

# Replace imports (manual review recommended)
# Use the mapping table above
```

## Benefits of Heroicons

1. ✅ **Official Tailwind CSS icons** - Perfect integration with Tailwind
2. ✅ **Smaller bundle size** - Tree-shakeable
3. ✅ **Consistent design** - All icons follow the same design system
4. ✅ **Two variants** - Outline and Solid versions
5. ✅ **Well-maintained** - Actively developed by Tailwind Labs

## Notes

- Heroicons uses `className` instead of `size` prop
- Use Tailwind classes for sizing: `w-{size} h-{size}`
- Import from `/24/outline` for outline icons or `/24/solid` for solid icons
- Some Lucide icons don't have exact Heroicons equivalents (use closest match)

---

**Migration Status**: In Progress  
**Last Updated**: December 8, 2025
