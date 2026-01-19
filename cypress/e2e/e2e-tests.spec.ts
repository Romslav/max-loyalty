// E2E Tests with Cypress
// File: cypress/e2e/app.spec.ts

describe('Max Loyalty App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/admin/dashboard')
  })

  // Navigation Tests
  describe('Navigation', () => {
    it('should navigate to admin dashboard', () => {
      cy.url().should('include', '/admin/dashboard')
      cy.get('h1').should('contain', 'Admin Dashboard')
    })

    it('should navigate between menu items', () => {
      cy.get('[href="/admin/restaurants"]').click()
      cy.url().should('include', '/admin/restaurants')
      cy.get('h1').should('contain', 'Рестораны')
    })

    it('should open sidebar on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('button[aria-label="Menu"]').click()
      cy.get('nav').should('be.visible')
    })
  })

  // Admin Dashboard Tests
  describe('Admin Dashboard', () => {
    it('should display KPI cards', () => {
      cy.get('h2').should('contain', 'Всего ресторанов')
      cy.get('text').should('contain', '24')
    })

    it('should render tabs', () => {
      cy.get('[role="tab"]').should('have.length', 3)
      cy.get('[role="tab"]').first().should('contain', 'Рестораны')
    })

    it('should switch between tabs', () => {
      cy.get('[role="tab"]').eq(1).click()
      cy.get('[role="tabpanel"]').should('contain', 'STANDARD')
    })

    it('should display restaurant table', () => {
      cy.get('table').should('be.visible')
      cy.get('tbody tr').should('have.length.at.least', 1)
    })
  })

  // Restaurants List Tests
  describe('Restaurants List', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/admin/restaurants')
    })

    it('should display restaurants table', () => {
      cy.get('table').should('be.visible')
      cy.contains('Пицца Ночная').should('be.visible')
    })

    it('should search restaurants', () => {
      cy.get('input[placeholder*="Поиск"]').type('Пицца')
      cy.contains('Пицца Ночная').should('be.visible')
      cy.contains('Burger Dream').should('not.exist')
    })

    it('should filter by tariff', () => {
      cy.get('select').select('PRO')
      cy.get('tbody tr').should('have.length', 2)
    })

    it('should open add modal', () => {
      cy.contains('Добавить').click()
      cy.get('[role="dialog"]').should('be.visible')
      cy.get('[role="dialog"]').should('contain', 'Новый ресторан')
    })

    it('should close modal on cancel', () => {
      cy.contains('Добавить').click()
      cy.contains('Отмена').click()
      cy.get('[role="dialog"]').should('not.exist')
    })
  })

  // Guests List Tests
  describe('Guests List', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/admin/guests')
    })

    it('should display guests', () => {
      cy.get('table').should('be.visible')
      cy.contains('Иван Петров').should('be.visible')
    })

    it('should search by name', () => {
      cy.get('input[placeholder*="Поиск"]').type('Иван')
      cy.contains('Иван Петров').should('be.visible')
    })

    it('should filter by level', () => {
      cy.get('select').select('Gold')
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).should('contain', 'Gold')
      })
    })
  })

  // Guest Card Tests
  describe('Guest Card Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/guest/card')
    })

    it('should display loyalty card', () => {
      cy.contains('Привет').should('be.visible')
      cy.get('[role="img"]').should('have.length.at.least', 1) // QR код
    })

    it('should show card number', () => {
      cy.contains('4A7K2B').should('be.visible')
    })

    it('should display tabs', () => {
      cy.get('[role="tab"]').should('have.length', 3)
    })

    it('should switch to history tab', () => {
      cy.get('[role="tab"]').contains('История').click()
      cy.get('[role="tabpanel"]').should('contain', 'Последние операции')
    })

    it('should display referral info', () => {
      cy.get('[role="tab"]').contains('Реферрал').click()
      cy.contains('500 баллов').should('be.visible')
    })
  })

  // Billing Tests
  describe('Billing Management', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/admin/billing')
    })

    it('should display billing stats', () => {
      cy.contains('Месячный доход').should('be.visible')
      cy.contains('2.34M₽').should('be.visible')
    })

    it('should show invoice table', () => {
      cy.get('[role="tab"]').contains('Счета').click()
      cy.get('table').should('be.visible')
    })

    it('should display tariff cards', () => {
      cy.get('[role="tab"]').contains('Тарифы').click()
      cy.contains('STANDARD').should('be.visible')
      cy.contains('PRO').should('be.visible')
    })
  })

  // Scan Card Tests
  describe('Cashier - Scan Card', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/cashier/scan')
    })

    it('should display scanner interface', () => {
      cy.contains('Сканирование карты').should('be.visible')
      cy.get('input').should('have.length.at.least', 1)
    })

    it('should validate card code', () => {
      cy.get('input[type="text"]').type('INVALID')
      cy.contains('Сканировать').click()
      cy.contains('Ошибка сканирования').should('be.visible')
    })

    it('should accept valid card code', () => {
      cy.get('input[type="text"]').type('4A7K2B')
      cy.contains('Сканировать').click()
      cy.contains('Иван Петров').should('be.visible')
    })

    it('should display guest info on success', () => {
      cy.get('input[type="text"]').type('4A7K2B')
      cy.contains('Сканировать').click()
      cy.contains('Баланс').should('be.visible')
      cy.contains('3850').should('be.visible')
    })
  })

  // Profile Tests
  describe('Guest Profile', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/guest/profile')
    })

    it('should display profile info', () => {
      cy.contains('Мой профиль').should('be.visible')
      cy.contains('Иван').should('be.visible')
    })

    it('should show edit button', () => {
      cy.contains('Редактировать').should('be.visible')
    })

    it('should display loyalty status', () => {
      cy.contains('Gold').should('be.visible')
      cy.contains('3850').should('be.visible')
    })

    it('should navigate between profile tabs', () => {
      cy.get('[role="tab"]').contains('Безопасность').click()
      cy.contains('Пароль').should('be.visible')

      cy.get('[role="tab"]').contains('Уведомления').click()
      cy.contains('Email уведомления').should('be.visible')
    })
  })

  // History Tests
  describe('Guest History', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/guest/history')
    })

    it('should display history table', () => {
      cy.get('table').should('be.visible')
      cy.contains('16.01.2026').should('be.visible')
    })

    it('should filter history', () => {
      cy.get('[role="tab"]').contains('Заказы').click()
      cy.get('tbody tr').should('have.length.at.least', 1)
    })
  })

  // Responsive Design Tests
  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.visit('http://localhost:5173/admin/dashboard')
      cy.get('button[aria-label="Menu"]').should('be.visible')
    })

    it('should be tablet responsive', () => {
      cy.viewport('ipad-2')
      cy.visit('http://localhost:5173/admin/dashboard')
      cy.get('table').should('be.visible')
    })

    it('should be desktop responsive', () => {
      cy.viewport('macbook-15')
      cy.visit('http://localhost:5173/admin/dashboard')
      cy.get('nav').should('be.visible')
    })
  })

  // Performance Tests
  describe('Performance', () => {
    it('should load dashboard in reasonable time', () => {
      cy.visit('http://localhost:5173/admin/dashboard', {
        onBeforeLoad: (win) => {
          win.performance.mark('start')
        },
        onLoad: (win) => {
          win.performance.mark('end')
          win.performance.measure('pageLoad', 'start', 'end')
          const measure = win.performance.getEntriesByName('pageLoad')[0]
          expect(measure.duration).to.be.lessThan(3000)
        },
      })
    })
  })

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle invalid routes', () => {
      cy.visit('http://localhost:5173/invalid-route', {
        failOnStatusCode: false,
      })
      cy.get('h1').should('contain', 'Admin Dashboard')
    })
  })
})
