import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard page
    await page.goto('/dashboard')
  })

  test('should redirect to login for unauthenticated users', async ({ page }) => {
    // Check that we are redirected to login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display dashboard content for authenticated users', async ({ page }) => {
    // Navigate with welcome param to simulate auth
    await page.goto('/dashboard?welcome=true')
    
    // Check that the dashboard content is displayed
    // Use first() or specific locators to avoid strict mode violations
    await expect(page.getByRole('heading', { name: 'Dai Fashion', exact: true })).toBeVisible()
    await expect(page.getByText('OAuth User').first()).toBeVisible()
    await expect(page.getByText('Logout')).toBeVisible()
  })

  test('should have quick actions', async ({ page }) => {
    // Navigate with welcome param
    await page.goto('/dashboard?welcome=true')

    // Check quick actions are present
    await expect(page.getByText('Quick Actions')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Browse Products' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'View Orders' })).toBeVisible()
  })

  test('should have logout functionality', async ({ page }) => {
    // Navigate with welcome param
    await page.goto('/dashboard?welcome=true')

    // Check logout button is present and clickable
    const logoutButton = page.getByRole('button', { name: 'Logout' })
    await expect(logoutButton).toBeVisible()
    await expect(logoutButton).toBeEnabled()
    
    // Click logout
    await logoutButton.click()
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
