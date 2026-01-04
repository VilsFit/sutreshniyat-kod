/* ═══════════════════════════════════════════════════════════
   СУТРЕШНИЯТ КОД - JAVASCRIPT ЛОГИКА
   ═══════════════════════════════════════════════════════════ */

// Глобални променливи
let currentSection = 'intro';
let currentCategory = null;
let filteredRecipes = [];

// Инициализация при зареждане
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Сутрешният Код - Зареден!');
    console.log(`📊 Общо рецепти: ${getTotalRecipesCount()}`);
    
    // Показваме Увода по подразбиране
    showSection('intro');
});

/**
 * Извлича общия брой рецепти
 */
function getTotalRecipesCount() {
    let total = 0;
    for (let category in recipesData) {
        total += recipesData[category].length;
    }
    return total;
}

/**
 * Показва секция (Увод, Обеден код, Вечерен код, Информация, За мен)
 */
function showSection(sectionName) {
    // Скриваме всички секции
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Показваме избраната секция
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
    
    // Актуализираме активните бутони в nav
    updateActiveNavButton(sectionName);
    
    // Затваряме dropdown менютата
    closeAllDropdowns();
    
    // Затваряме mobile menu
    closeMobileMenu();
    
    // НЕ правим scroll to top - премахнато!
    // window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Актуализира активния бутон в навигацията
 */
function updateActiveNavButton(sectionName) {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Намираме съответния бутон (трябва да се направи mapping)
    // За простота, не маркираме активен бутон за сега
}

/**
 * Toggle dropdown меню
 */
function toggleDropdown(dropdownId) {
    const menu = document.getElementById(`${dropdownId}-menu`);
    const allMenus = document.querySelectorAll('.dropdown-menu');
    
    // Затваряме всички други менюта
    allMenus.forEach(m => {
        if (m !== menu) {
            m.classList.remove('active');
        }
    });
    
    // Toggle на текущото меню
    if (menu) {
        menu.classList.toggle('active');
    }
}

/**
 * Затваря всички dropdown менюта
 */
function closeAllDropdowns() {
    const allMenus = document.querySelectorAll('.dropdown-menu');
    allMenus.forEach(menu => {
        menu.classList.remove('active');
    });
}

/**
 * Toggle mobile navigation
 */
function toggleMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('mobile-open');
}

/**
 * Затваря mobile menu
 */
function closeMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.remove('mobile-open');
}

/**
 * Показва рецепти от определена категория
 */
function showRecipes(categoryId) {
    // Затваряме dropdown
    closeAllDropdowns();
    
    // Затваряме mobile menu
    closeMobileMenu();
    
    // Показваме recipes section
    showSection('recipes');
    
    // Запазваме текущата категория
    currentCategory = categoryId;
    
    // Намираме категорията
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
        console.error('Категория не е намерена:', categoryId);
        return;
    }
    
    // Актуализираме header
    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-description').textContent = category.description;
    document.getElementById('category-count').textContent = `${category.count} рецепти`;
    
    // Вземаме рецептите за тази категория
    const recipes = recipesData[categoryId] || [];
    
    // Записваме филтрираните рецепти
    filteredRecipes = recipes;
    
    // Рендираме рецептите
    renderRecipes(recipes);
    
    // Reset филтрите
    document.getElementById('search-input').value = '';
    document.getElementById('difficulty-filter').value = '';
    document.getElementById('time-filter').value = '';
}

/**
 * Рендира рецептите в grid
 */
function renderRecipes(recipes) {
    const grid = document.getElementById('recipes-grid');
    
    if (!recipes || recipes.length === 0) {
        grid.innerHTML = `
            <div class="no-recipes">
                <p>Няма намерени рецепти.</p>
            </div>
        `;
        return;
    }
    
    // Генерираме HTML за всяка рецепта
    const html = recipes.map(recipe => `
        <div class="recipe-card" onclick="openRecipeModal(${recipe.id})">
            <div class="recipe-card-image">
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : '🥗'}
            </div>
            <div class="recipe-card-body">
                <h3 class="recipe-card-title">${recipe.name}</h3>
                <div class="recipe-card-meta">
                    <span class="recipe-card-difficulty">${recipe.difficulty}</span>
                    <span>⏱ ${recipe.prepTime}</span>
                </div>
                <div class="recipe-card-stats">
                    <div class="recipe-stat">
                        <span class="recipe-stat-label">Калории</span>
                        <span class="recipe-stat-value">${recipe.calories}</span>
                    </div>
                    <div class="recipe-stat">
                        <span class="recipe-stat-label">Протеин</span>
                        <span class="recipe-stat-value">${recipe.protein}g</span>
                    </div>
                    <div class="recipe-stat">
                        <span class="recipe-stat-label">Порции</span>
                        <span class="recipe-stat-value">${recipe.servings}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    
    // Добавяме анимация на картите
    const cards = grid.querySelectorAll('.recipe-card');
    cards.forEach((card, index) => {
        card.style.animation = `cardFadeIn 0.5s ease-out ${index * 0.05}s both`;
    });
}

// CSS анимация за картите (добавяме динамично)
const style = document.createElement('style');
style.textContent = `
    @keyframes cardFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

/**
 * Филтрира рецептите според търсенето и филтрите
 */
function filterRecipes() {
    if (!currentCategory) return;
    
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const timeFilter = document.getElementById('time-filter').value;
    
    const recipes = recipesData[currentCategory] || [];
    
    let filtered = recipes.filter(recipe => {
        // Търсене по име
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm);
        
        // Филтър по трудност
        const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter;
        
        // Филтър по време
        let matchesTime = true;
        if (timeFilter === 'fast') {
            matchesTime = parseInt(recipe.prepTime) <= 5;
        } else if (timeFilter === 'medium') {
            const time = parseInt(recipe.prepTime);
            matchesTime = time > 5 && time <= 15;
        } else if (timeFilter === 'slow') {
            matchesTime = parseInt(recipe.prepTime) > 15;
        }
        
        return matchesSearch && matchesDifficulty && matchesTime;
    });
    
    filteredRecipes = filtered;
    renderRecipes(filtered);
}

/**
 * Отваря модал с детайли за рецепта
 */
function openRecipeModal(recipeId) {
    // Намираме рецептата
    let recipe = null;
    for (let category in recipesData) {
        recipe = recipesData[category].find(r => r.id === recipeId);
        if (recipe) break;
    }
    
    if (!recipe) {
        console.error('Рецепта не е намерена:', recipeId);
        return;
    }
    
    // Генерираме съдържанието на модала
    const modalContent = document.getElementById('modal-recipe-content');
    modalContent.innerHTML = `
        <h2 class="modal-recipe-title">${recipe.name}</h2>
        
        ${recipe.why ? `
        <div class="modal-recipe-why">
            <h3 style="margin-bottom: 0.5rem; color: var(--primary-green);">💡 Защо работи:</h3>
            <p>${recipe.why}</p>
        </div>
        ` : ''}
        
        <div class="modal-recipe-stats">
            <div class="modal-stat-item">
                <span class="modal-stat-label">Подготовка</span>
                <span class="modal-stat-value">${recipe.prepTime}</span>
            </div>
            ${recipe.cookTime ? `
            <div class="modal-stat-item">
                <span class="modal-stat-label">Готвене</span>
                <span class="modal-stat-value">${recipe.cookTime}</span>
            </div>
            ` : ''}
            <div class="modal-stat-item">
                <span class="modal-stat-label">Порции</span>
                <span class="modal-stat-value">${recipe.servings}</span>
            </div>
            <div class="modal-stat-item">
                <span class="modal-stat-label">Трудност</span>
                <span class="modal-stat-value">${recipe.difficulty}</span>
            </div>
            <div class="modal-stat-item">
                <span class="modal-stat-label">Калории</span>
                <span class="modal-stat-value">${recipe.calories}</span>
            </div>
            <div class="modal-stat-item">
                <span class="modal-stat-label">Протеин</span>
                <span class="modal-stat-value">${recipe.protein}g</span>
            </div>
            <div class="modal-stat-item">
                <span class="modal-stat-label">Въглехидрати</span>
                <span class="modal-stat-value">${recipe.carbs}g</span>
            </div>
            <div class="modal-stat-item">
                <span class="modal-stat-label">Мазнини</span>
                <span class="modal-stat-value">${recipe.fats}g</span>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: var(--cream-dark); border-radius: var(--radius-md);">
            <p style="color: var(--gray-medium); font-style: italic; text-align: center;">
                Пълните инструкции и съставки ще бъдат добавени скоро! 📖
            </p>
        </div>
    `;
    
    // Показваме модала
    const modal = document.getElementById('recipe-modal');
    modal.classList.add('active');
    
    // Предотвратяваме scroll на body
    document.body.style.overflow = 'hidden';
}

/**
 * Затваря модала с рецептата
 */
function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.classList.remove('active');
    
    // Възстановяваме scroll на body
    document.body.style.overflow = 'auto';
}

// Затваряме dropdown при клик извън него
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.remove('active');
            }
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC за затваряне на модал
    if (e.key === 'Escape') {
        closeRecipeModal();
        closeAllDropdowns();
    }
});

console.log('✨ JavaScript зареден успешно!');
