# 🌙 Dark Mode - Quick Guide

## What's New?

Issue #26 is complete! Dark mode has been added to the entire application with a toggle button.

---

## 🎯 Features

✅ Toggle button in every page  
✅ Remembers your choice  
✅ Automatically detects your system preference  
✅ Smooth transitions  
✅ Works everywhere in the app  

---

## 📍 Where to Find It

Look in the **top-right corner** of any page - you'll see a moon or sun icon:

- 🌙 **Moon Icon** = Light mode active, click to switch to dark
- ☀️ **Sun Icon** = Dark mode active, click to switch to light

---

## 🚀 How to Use

### Switching Modes

1. Look for the toggle button in the top-right of the navbar
2. Click the moon/sun icon
3. Mode switches instantly
4. Your choice is saved automatically

### System Preference

On first visit:
- If you have dark mode enabled in your OS settings → app starts in dark mode
- If you have light mode enabled in your OS settings → app starts in light mode
- You can always override by clicking the toggle button

---

## 📱 Works On

✅ Desktop  
✅ Tablet  
✅ Mobile  
✅ All browsers (Chrome, Firefox, Safari, Edge)  

---

## 💾 How Long Does It Remember?

**Forever!** Your preference is saved in your browser's local storage.

It will remember even:
- After closing the browser
- After restarting your computer
- After weeks of not using the app

---

## 🎨 What Changes in Dark Mode?

- Background turns dark gray
- Text turns light
- Buttons and cards get dark styling
- All charts and tables are visible
- Forms are fully usable

Everything is designed to be **easy on the eyes** in low light conditions.

---

## ⚙️ For Developers

### Use Dark Mode in Your Components

```javascript
import { useDarkMode } from "@/util/DarkModeContext";

export default function MyComponent() {
    const { isDarkMode } = useDarkMode();
    
    return isDarkMode ? <DarkVersion /> : <LightVersion />;
}
```

### TailwindCSS Styling

```jsx
<div className="bg-white dark:bg-gray-800">
    Light and dark mode compatible!
</div>
```

---

## ❓ FAQ

### Q: Where is the dark mode toggle?
**A:** Top-right corner of every page, next to the logout button.

### Q: Will dark mode slow down the app?
**A:** No, it's extremely lightweight and has zero performance impact.

### Q: Can I customize the dark mode colors?
**A:** Yes! Edit `app/globals.css` to change colors.

### Q: What if I want to reset my preference?
**A:** Clear browser data/storage, then reload the app.

---

## 🔧 Troubleshooting

### Toggle button not visible?
- Refresh the page
- Clear browser cache
- Try a different browser

### Dark mode not saving?
- Enable localStorage in browser settings
- Clear browser storage and try again

---

## 📂 Related Files

- **Context:** `util/DarkModeContext.js`
- **Toggle Button:** `util/DarkModeToggle.js`
- **Styles:** `app/globals.css`
- **Full Documentation:** `DARK_MODE_DOCUMENTATION.md`

---

**Dark mode is ready to use! Enjoy! 🌙**
