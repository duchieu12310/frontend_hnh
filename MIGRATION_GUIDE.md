# Migration Guide: Mantine UI → Tailwind CSS

## Tổng quan

Tài liệu này hướng dẫn cách migrate từ Mantine UI sang Tailwind CSS cho dự án này.

## Đã hoàn thành

✅ **Setup Tailwind CSS**
- `tailwind.config.js` - Cấu hình Tailwind với theme colors tương đương Mantine
- `postcss.config.js` - Cấu hình PostCSS
- `index.css` - Đã thêm Tailwind directives

✅ **Dependencies**
- Đã thêm: `tailwindcss`, `autoprefixer`, `postcss`
- Đã thêm: `react-hot-toast` (thay thế `@mantine/notifications`)
- Đã thêm: `@headlessui/react` (thay thế `@mantine/modals`)
- Đã thêm: `react-hook-form`, `@hookform/resolvers` (thay thế `@mantine/form`)
- Đã thêm: `react-dropzone` (thay thế `@mantine/dropzone`)
- Đã thêm: `react-datepicker` (thay thế `@mantine/dates`)

✅ **Utilities**
- `NotifyUtils.tsx` - Đã migrate sang `react-hot-toast`
- `App.tsx` - Đã thêm `<Toaster />` component

## Component Mapping

### Layout Components

| Mantine | Tailwind Equivalent |
|---------|---------------------|
| `<Container>` | `<div className="container mx-auto px-4">` |
| `<Stack spacing="md">` | `<div className="flex flex-col gap-4">` |
| `<Group spacing="sm">` | `<div className="flex items-center gap-2">` |
| `<Box>` | `<div>` |

### UI Components

| Mantine | Tailwind Equivalent |
|---------|---------------------|
| `<Button>` | `<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">` |
| `<Text>` | `<p>` hoặc `<span>` với classes tương ứng |
| `<Card>` | `<div className="bg-white rounded-lg shadow p-6">` |
| `<Badge>` | `<span className="px-2 py-1 text-xs font-semibold rounded">` |
| `<ActionIcon>` | `<button className="p-2 rounded">` |
| `<Image>` | `<img>` với classes tương ứng |

### Form Components

| Mantine | Tailwind Equivalent |
|---------|---------------------|
| `<TextInput>` | `<input className="w-full px-3 py-2 border rounded">` |
| `<NumberInput>` | `<input type="number" className="...">` |
| `<Select>` | `<select className="...">` |
| `<Checkbox>` | `<input type="checkbox">` |
| `<Radio>` | `<input type="radio">` |

## Styling Migration

### Mantine createStyles → Tailwind

**Trước (Mantine):**
```typescript
const useStyles = createStyles((theme) => ({
  button: {
    backgroundColor: theme.colors.blue[6],
    padding: theme.spacing.md,
    '&:hover': {
      backgroundColor: theme.colors.blue[7],
    },
  },
}));

// Usage
const { classes } = useStyles();
<button className={classes.button}>Click</button>
```

**Sau (Tailwind):**
```typescript
<button className="bg-blue-600 px-4 py-2 hover:bg-blue-700">
  Click
</button>
```

### Theme Colors

Mantine colors đã được map trong `tailwind.config.js`:
- `theme.colors.blue[6]` → `bg-blue-600`
- `theme.colors.teal[6]` → `bg-teal-600`
- `theme.colors.pink[6]` → `bg-pink-600`
- `theme.colors.red[6]` → `bg-red-600`

### Spacing

- `theme.spacing.xs` → `p-2.5` hoặc `gap-2.5`
- `theme.spacing.sm` → `p-3` hoặc `gap-3`
- `theme.spacing.md` → `p-4` hoặc `gap-4`
- `theme.spacing.lg` → `p-5` hoặc `gap-5`
- `theme.spacing.xl` → `p-6` hoặc `gap-6`

## Dark Mode

**Mantine:**
```typescript
const theme = useMantineTheme();
backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
```

**Tailwind:**
```typescript
className="bg-white dark:bg-gray-800"
```

Cần thêm `dark` class vào `<html>` element để enable dark mode.

## Form Handling

**Mantine (@mantine/form):**
```typescript
const form = useForm({
  initialValues: { name: '' },
  validate: { name: (value) => value.length > 0 ? null : 'Required' }
});
```

**Tailwind (react-hook-form):**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

## Modals

**Mantine:**
```typescript
import { useModals } from '@mantine/modals';
const modals = useModals();
modals.openModal({ title: 'Title', children: <Content /> });
```

**Tailwind (@headlessui/react):**
```typescript
import { Dialog } from '@headlessui/react';
<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  <Dialog.Panel>
    <Dialog.Title>Title</Dialog.Title>
    <Content />
  </Dialog.Panel>
</Dialog>
```

## Notifications

**Mantine:**
```typescript
import { showNotification } from '@mantine/notifications';
showNotification({ message: 'Hello' });
```

**Tailwind (react-hot-toast):**
```typescript
import toast from 'react-hot-toast';
toast('Hello');
toast.success('Success');
toast.error('Error');
```

## Migration Checklist

Khi migrate một component:

1. ✅ Xác định tất cả Mantine components được sử dụng
2. ✅ Thay thế bằng HTML elements + Tailwind classes
3. ✅ Migrate `createStyles` → Tailwind utility classes
4. ✅ Update theme references (`theme.colors`, `theme.spacing`)
5. ✅ Migrate form handling (nếu có)
6. ✅ Migrate modals (nếu có)
7. ✅ Test responsive design
8. ✅ Test dark mode (nếu có)
9. ✅ Remove Mantine imports
10. ✅ Test functionality

## Files cần migrate

### Components (51 files)
- `components/ClientFooter/ClientFooter.tsx`
- `components/ClientHeader/ClientHeader.tsx`
- `components/ClientProductCard/ClientProductCard.tsx`
- ... (xem danh sách đầy đủ trong plan)

### Pages (157 files)
- Tất cả files trong `pages/` sử dụng `@mantine/core`

### Utilities
- ✅ `utils/NotifyUtils.tsx` - Đã migrate

## Lưu ý quan trọng

1. **Không xóa Mantine ngay**: Giữ Mantine providers trong `App.tsx` cho đến khi tất cả components đã được migrate
2. **Test từng component**: Migrate và test từng component một
3. **Giữ functionality**: Đảm bảo không mất tính năng khi migrate
4. **Responsive**: Kiểm tra responsive design trên mobile, tablet, desktop
5. **Dark mode**: Test dark mode nếu component hỗ trợ

## Next Steps

1. Migrate components theo thứ tự ưu tiên:
   - Client components trước (ít hơn, dễ hơn)
   - Admin components sau
2. Migrate pages theo module
3. Sau khi migrate xong, xóa Mantine dependencies
4. Update `App.tsx` để xóa Mantine providers











