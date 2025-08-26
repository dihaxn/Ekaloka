import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard page
    await page.goto('/dashboard')
  })

  test('should show access denied for unauthenticated users', async ({ page }) => {
    // Check that the access denied message is displayed
    await expect(page.getByText('Access Denied')).toBeVisible()
    await expect(page.getByText('Please log in to access the dashboard.')).toBeVisible()
  })

  test('should display dashboard content for authenticated users', async ({ page }) => {
    // This test would require authentication setup
    // For now, we'll just check the basic structure
    
    // Mock authentication by setting localStorage
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }))
    })

    // Reload the page to trigger the auth check
    await page.reload()

    // Check that the dashboard content is displayed
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Welcome back, Test User!')).toBeVisible()
    await expect(page.getByText('Logout')).toBeVisible()
  })

  test('should have search functionality', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }))
    })

    await page.reload()

    // Check search input is present
    const searchInput = page.getByPlaceholder('Search products...')
    await expect(searchInput).toBeVisible()

    // Check search button is present
    const searchButton = page.getByRole('button', { name: 'Search' })
    await expect(searchButton).toBeVisible()
  })

  test('should display products section', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }))
    })

    await page.reload()

    // Check products section is present
    await expect(page.getByText('Products')).toBeVisible()
  })

  test('should have logout functionality', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }))
    })

    await page.reload()

    // Check logout button is present and clickable
    const logoutButton = page.getByRole('button', { name: 'Logout' })
    await expect(logoutButton).toBeVisible()
    await expect(logoutButton).toBeEnabled()
  })
})
