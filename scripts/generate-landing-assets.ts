
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// Check if output directory exists
const outputDir = path.join(process.cwd(), 'public', 'landing', 'screenshots');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function captureScreenshots() {
    console.log('Starting screenshot generation...');

    // Launch browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Viewports to capture
    const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
    ];

    // Views to capture with their selector text
    // Note: The labels must match what is in the UI (English is assumed default)
    const views = [
        { id: 'kanban', label: 'Kanban Board' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'gantt', label: 'Gantt Chart' },
        { id: 'eisenhower', label: 'Eisenhower Matrix' },
        { id: 'pert', label: 'PERT Diagram' },
        { id: 'table', label: 'Table View' }
    ];

    const baseUrl = 'http://localhost:3000/dashboard';

    // Set auth cookie to bypass login (requires a valid session or mock mode)
    // Using the previously added admin-local-mode cookie if applicable, 
    // BUT since we removed the toggle, we might need a real session or just try to hit the page.
    // If Admin Local Mode logic relies on cookie presence only (server/middleware side), it should still work.
    // Let's assume 'admin-local-mode' cookie still works if middleware checks it.
    await context.addCookies([{
        name: 'admin-local-mode',
        value: 'true',
        domain: 'localhost',
        path: '/',
    }]);

    console.log('Navigating to dashboard...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Initial load wait

    // Dismiss any PWA prompt if it appears
    try {
        const dismissBtn = page.getByRole('button', { name: 'Dismiss' });
        if (await dismissBtn.isVisible()) {
            await dismissBtn.click();
            await page.waitForTimeout(500);
        }
    } catch (e) { }

    for (const view of views) {
        console.log(`Switching to view: ${view.id} (${view.label})`);

        // reset viewport to desktop for navigation to be safe
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Open the view mode dropdown
        // The toggle button has role="combobox" and is in the header
        const toggleBtn = page.getByRole('combobox').first();
        await toggleBtn.click();
        await page.waitForTimeout(500); // Wait for popover animation

        // Click the specific view option
        // We us text matching. Note: Labels in `ViewModeToggle` come from `T` (translation). 
        // Assuming English default is active. 
        // If exact text fails, we might need to use icon or softer match.
        // Let's try flexible text matching if strict fails.
        const viewOption = page.getByRole('button', { name: view.label });
        if (await viewOption.isVisible()) {
            await viewOption.click();
        } else {
            console.warn(`Could not find button with name "${view.label}", trying partial match...`);
            // Fallback: try to find by text content roughly
            await page.getByText(view.label, { exact: false }).first().click();
        }

        // Wait for view content to load
        // Calendar and Gantt might take longer
        await page.waitForTimeout(2000);

        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(1000); // Wait for resize re-layout

            const screenshotPath = path.join(outputDir, `${view.id}-${viewport.name}.webp`);
            await page.screenshot({ path: screenshotPath, type: 'png' }); // Saving as png (playwright default) but naming .webp to match existing code refs? 
            // Better to match file extension to actual format or change usage. 
            // The previous code saved as .webp name but png format. I'll keep that quirk or use sharp if available.
            // Since I don't see sharp imported, I'll stick to png format but might rename extension or just keep it png.
            // Wait, the previous code had `path: ...webp` but `type: 'png'`. This creates a PNG file named .webp. 
            // Browsers usually handle this fine but it's technically wrong. 
            // I will use .png extension for correctness if the user accepts, OR just keep .webp name.
            // The requested previous code used .webp. I will stick to it for compatibility with the LandingPage code.

            console.log(`Saved: ${screenshotPath}`);
        }
    }

    await browser.close();
    console.log('Screenshot generation complete!');
}

captureScreenshots().catch(err => {
    console.error('Error generating screenshots:', err);
    process.exit(1);
});
