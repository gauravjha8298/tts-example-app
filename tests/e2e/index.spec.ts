import { test, expect } from "@playwright/test"

test('should load the text area with a default input text', async ({ page }) => {
    const defaultText = "The ElevenLabs voice generator can deliver high-quality, human-like speech in 32 languages. Perfect for audiobooks, video voiceovers, commercials, and more.";
    await page.goto('http://localhost:3000');
    const textAreaElement = await page.locator('textarea#tts-text-area');
    await expect(textAreaElement).toBeVisible();

    const textAreaValue = await textAreaElement.inputValue();
    expect(textAreaValue).toBe(defaultText);
});

test('should load the Voice Selector page and display the select element', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const selectElement = await page.locator('select');
  await expect(selectElement).toBeVisible();
});

test('should show loading spinner while fetching voices and then dissappear', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Verify that the spinner is visible (while the loading is happening)
    const spinner = await page.locator('body > main > div > div > div > div > div > span > svg');
    await expect(spinner).toBeVisible(); // Check that spinner is visible
  
    // Wait for the voices to be loaded and the spinner to disappear
    await page.waitForSelector('body > main > div > div > div > div > div > span > svg', { state: 'hidden' });  
});

test('should update selected voice when an option is selected', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const select = await page.locator('select');
    await select.selectOption({ label: 'Roger' });
    const selectedValue = await select.inputValue();
    expect(selectedValue).toBe('CwhRBWXzGAHq8TQ4Fs17');
});


test('should trigger API call when the Play button is clicked', async ({ page }) => {
    // Mock API call or spy
    await page.goto('http://localhost:3000');

    // Wait for the select element to be loaded first so that a voice is selected automatically
    const selectElement = await page.locator('select');
    await expect(selectElement).toBeVisible();

    const playButton = await page.locator('button#synthesizeTTSBtn');
    await playButton.click();
});
  
  
  
