# Troubleshooting: Styles Not Loading

If Tailwind CSS styles are not appearing:

1. **Restart the dev server:**
   ```bash
   npm run dev
   ```

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

3. **Verify CSS is imported:**
   - Check that `src/main.tsx` imports `'./index.css'`
   - Verify `src/index.css` contains the Tailwind directives

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for any CSS loading errors
   - Check if `index.css` is loaded in Network tab

5. **Rebuild:**
   ```bash
   npm run build
   ```
   This will verify Tailwind is working correctly.

## Verification

The build output should show a CSS file being generated (around 17-18 KB). If you see this, Tailwind is working correctly and the issue is likely browser caching.


