/// <reference types="cypress" />

import mockIngredientData from '../fixtures/ingredients.json';

const MODALS_CONTAINER = '#modals';

describe('Stellar Burger — Интеграционные тесты конструктора (data-testid)', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.intercept('GET', '**/api/ingredients', {
      body: {
        success: mockIngredientData.success,
        data: mockIngredientData.data
      }
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  context('Проверка отображения и добавления ингредиентов', () => {
    it('должен успешно отображать ингредиенты на странице', () => {
      // Исправили синтаксис утверждения длины массива в Cypress
      cy.get('[data-testid="ingredient-link"]').should(
        'have.length.at.least',
        1
      );
    });

    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-testid="ingredient-link"]')
        .contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();

      cy.get('[data-testid="default-top-bun"]').should('not.exist');
      cy.get('[data-testid="default-bottom-bun"]').should('not.exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-testid="ingredient-link"]')
        .contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();

      cy.get('[data-testid="default-main"]').should('not.exist');
    });
  });

  context('Проверка работы модальных окон', () => {
    beforeEach(() => {
      cy.get('[data-testid="ingredient-link"]')
        .contains('Краторная булка N-200i')
        .click({ force: true });
    });

    it('должен открывать модальное окно с деталями ингредиента', () => {
      // Проверяем, что модалка видна И содержит название кликнутого ингредиента
      cy.get('[data-testid="ingredient-details"]')
        .should('be.visible')
        .and('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно при клике на крестик', () => {
      // Находим кнопку и кликаем строго по её содержимому (иконке), принудительно вызывая событие
      cy.get('[data-testid="close-button"]').find('svg').click({ force: true });
      cy.get('[data-testid="ingredient-details"]').should('not.exist');
      // Элементы ингредиентов внутри конструктора больше не должны существовать в DOM
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
      // Дефолтные заглушки-подсказки снова вернулись на экран
      cy.get('[data-testid="default-top-bun"]').should('be.visible');
      cy.get('[data-testid="default-main"]').should('be.visible');
    });

    it('должен закрывать модальное окно при клике на оверлей', () => {
      cy.get('[data-testid="overlay-div"]').click({ force: true });
      cy.get('[data-testid="ingredient-details"]').should('not.exist');
    });
  });

  context('Проверка полного цикла создания заказа', () => {
    it('должен успешно собрать бургер, пройти авторизацию и оформить заказ', () => {
      cy.intercept('GET', '**/api/auth/user', {
        body: {
          success: true,
          user: { email: 'julilisichkina@yandex.ru', name: 'yulia' }
        }
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        body: {
          success: true,
          name: 'Космический Бургер',
          order: { number: 54791 }
        }
      }).as('postOrder');

      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      cy.setCookie('accessToken', 'mock-access-token');

      cy.visit('/');
      cy.wait('@getIngredients');

      cy.get('[data-testid="ingredient-link"]')
        .contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.get('[data-testid="ingredient-link"]')
        .contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();

      cy.get('[data-testid="order-button"]').click();
      cy.wait('@postOrder');

      cy.get(MODALS_CONTAINER).contains('54791').should('be.visible');
      cy.get('[data-testid="close-button"]').click({ force: true });

      cy.get('[data-testid="default-top-bun"]').should('be.visible');
      cy.get('[data-testid="default-main"]').should('be.visible');
    });
  });
});
