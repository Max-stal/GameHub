let gamesData = [];
let editingGameId = null;

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  loadGamesData();
});

// Загрузка данных: из localStorage или из games.json при первом запуске
function loadGamesData() {
  const localData = localStorage.getItem('gamesHub_data');
  if (localData) {
    gamesData = JSON.parse(localData);
    renderPageContent();
  } else {
    fetch('games.json')
      .then(res => res.json())
      .then(data => {
        gamesData = data;
        saveToLocalStorage();
        renderPageContent();
      })
      .catch(err => console.error("Ошибка загрузки данных:", err));
  }
}

// Сохранение изменений в localStorage
function saveToLocalStorage() {
  localStorage.setItem('gamesHub_data', JSON.stringify(gamesData));
}

// Рендеринг контента
function renderPageContent() {
  const pageType = document.body.dataset.page;

  if (pageType === 'index') {
    renderGrid('rpgGrid', gamesData.filter(g => g.category === 'rpg'));
    renderGrid('actionGrid', gamesData.filter(g => g.category === 'action'));
    renderGrid('strategyGrid', gamesData.filter(g => g.category === 'strategy'));
  } else if (pageType) {
    const genreGames = gamesData.filter(g => g.category === pageType);
    renderGrid('genreGrid', genreGames);
  }
}

// Генерация карточек (READ) с выпадающим меню в правом верхнем углу
function renderGrid(containerId, games) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (games.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8; grid-column: 1 / -1;">Игры в этой категории отсутствуют.</p>';
    return;
  }

  container.innerHTML = games.map((game, index) => `
    <div class="card" style="--card-index: ${index};">
      <!-- Выпадающее меню в правом верхнем углу карточки -->
      <div class="card-menu">
        <button class="menu-btn" onclick="toggleCardMenu('${game.id}', event)" title="Опции">⋮</button>
        <div id="dropdown-${game.id}" class="dropdown-menu">
          <button class="dropdown-item" onclick="openEditModal('${game.id}', event)">Изменить</button>
          <button class="dropdown-item delete-item" onclick="deleteGame('${game.id}', event)">Удалить</button>
        </div>
      </div>

      <div class="card-image-wrap" onclick="openDetail('${game.id}')">
        <img src="${game.image}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/400x225?text=No+Image'">
      </div>
      <div class="card-info">
        <h3 onclick="openDetail('${game.id}')" style="cursor: pointer;">${game.title}</h3>
        <span class="rating">⭐ ${game.rating}</span>
      </div>
    </div>
  `).join('');
}

// Переключение выпадающего меню
function toggleCardMenu(id, event) {
  if (event) event.stopPropagation();

  const targetDropdown = document.getElementById(`dropdown-${id}`);
  
  // Закрываем все другие открытые меню
  document.querySelectorAll('.dropdown-menu').forEach(d => {
    if (d !== targetDropdown) d.classList.remove('active');
  });

  if (targetDropdown) {
    targetDropdown.classList.toggle('active');
  }
}

// Инициализация модальных окон
function initModals() {
  const modalHTML = `
    <!-- Модалка просмотра деталей (READ) -->
    <div id="gameModal" class="modal">
      <div class="modal-content">
        <span class="close-btn" id="closeDetailModal">&times;</span>
        <img id="modalImg" src="" alt="" class="modal-img">
        <div class="modal-neon-line"></div>
        <div class="modal-info">
          <h2 id="modalTitle"></h2>
          <p class="modal-rating">Рейтинг: <span id="modalRating"></span></p>
          <div class="meta-info" style="margin-bottom: 1rem;">
            <p><strong>Жанр:</strong> <span id="modalGenre"></span></p>
            <p><strong>Разработчик:</strong> <span id="modalDev"></span></p>
          </div>
          <p id="modalDesc" class="description"></p>
        </div>
      </div>
    </div>

    <!-- Модалка формы (CREATE & UPDATE) -->
    <div id="crudModal" class="modal">
      <div class="modal-content crud-modal-content">
        <span class="close-btn" id="closeCrudModal">&times;</span>
        <h2 id="crudModalTitle">Добавить игру</h2>
        <form id="crudForm">
          <div class="form-group">
            <label for="gameTitle">Название игры *</label>
            <input type="text" id="gameTitle" required placeholder="Например: Witcher 4">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="gameCategory">Категория *</label>
              <select id="gameCategory" required>
                <option value="rpg">RPG</option>
                <option value="action">Action</option>
                <option value="strategy">Strategy</option>
              </select>
            </div>
            <div class="form-group">
              <label for="gameRating">Рейтинг (0-10) *</label>
              <input type="number" id="gameRating" step="0.1" min="0" max="10" required placeholder="8.5">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="gameGenre">Жанр *</label>
              <input type="text" id="gameGenre" required placeholder="Action-RPG">
            </div>
            <div class="form-group">
              <label for="gameYear">Год выхода</label>
              <input type="number" id="gameYear" placeholder="2024">
            </div>
          </div>
          <div class="form-group">
            <label for="gameDev">Разработчик *</label>
            <input type="text" id="gameDev" required placeholder="CD Projekt RED">
          </div>
          <div class="form-group">
            <label for="gameImage">Ссылка на обложку *</label>
            <input type="text" id="gameImage" required placeholder="images/game.jpg">
          </div>
          <div class="form-group">
            <label for="gameDesc">Описание *</label>
            <textarea id="gameDesc" rows="3" required placeholder="Описание игры..."></textarea>
          </div>
          <button type="submit" class="submit-crud-btn" id="crudSubmitBtn">Сохранить</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('closeDetailModal').onclick = () => closeModal('gameModal');
  document.getElementById('closeCrudModal').onclick = () => closeModal('crudModal');

  // Закрытие выпадающего меню и модалок при клике мимо
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.card-menu')) {
      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
    }
    if (e.target === document.getElementById('gameModal')) closeModal('gameModal');
    if (e.target === document.getElementById('crudModal')) closeModal('crudModal');
  });

  document.getElementById('crudForm').addEventListener('submit', handleFormSubmit);
}

// ------------------- R E A D -------------------
function openDetail(id) {
  const game = gamesData.find(g => g.id === id);
  if (!game) return;

  document.getElementById('modalImg').src = game.image;
  document.getElementById('modalTitle').textContent = game.title;
  document.getElementById('modalRating').textContent = `⭐ ${game.rating} / 10`;
  document.getElementById('modalGenre').textContent = game.genre;
  document.getElementById('modalDev').textContent = `${game.developer} (${game.year || ''})`;
  document.getElementById('modalDesc').textContent = game.description;

  document.getElementById('gameModal').style.display = 'flex';
}

// ------------------- C R E A T E -------------------
function openAddModal() {
  editingGameId = null;
  document.getElementById('crudModalTitle').textContent = 'Добавить новую игру';
  document.getElementById('crudSubmitBtn').textContent = 'Создать';
  document.getElementById('crudForm').reset();
  document.getElementById('crudModal').style.display = 'flex';
}

// ------------------- U P D A T E -------------------
function openEditModal(id, event) {
  if (event) event.stopPropagation();

  const game = gamesData.find(g => g.id === id);
  if (!game) return;

  editingGameId = id;
  document.getElementById('crudModalTitle').textContent = 'Редактировать игру';
  document.getElementById('crudSubmitBtn').textContent = 'Сохранить изменения';

  document.getElementById('gameTitle').value = game.title;
  document.getElementById('gameCategory').value = game.category;
  document.getElementById('gameRating').value = game.rating;
  document.getElementById('gameGenre').value = game.genre;
  document.getElementById('gameYear').value = game.year || '';
  document.getElementById('gameDev').value = game.developer;
  document.getElementById('gameImage').value = game.image;
  document.getElementById('gameDesc').value = game.description;

  document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
  document.getElementById('crudModal').style.display = 'flex';
}

// Обработка отправки формы (CREATE / UPDATE)
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('gameTitle').value.trim(),
    category: document.getElementById('gameCategory').value,
    rating: parseFloat(document.getElementById('gameRating').value),
    genre: document.getElementById('gameGenre').value.trim(),
    year: parseInt(document.getElementById('gameYear').value) || new Date().getFullYear(),
    developer: document.getElementById('gameDev').value.trim(),
    image: document.getElementById('gameImage').value.trim(),
    description: document.getElementById('gameDesc').value.trim()
  };

  if (editingGameId) {
    const index = gamesData.findIndex(g => g.id === editingGameId);
    if (index !== -1) {
      gamesData[index] = { ...gamesData[index], ...formData };
    }
  } else {
    const newGame = {
      id: 'game_' + Date.now(),
      ...formData
    };
    gamesData.unshift(newGame);
  }

  saveToLocalStorage();
  renderPageContent();
  closeModal('crudModal');
}

// ------------------- D E L E T E -------------------
function deleteGame(id, event) {
  if (event) event.stopPropagation();

  document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));

  const game = gamesData.find(g => g.id === id);
  if (!game) return;

  if (confirm(`Вы действительно хотите удалить игру "${game.title}"?`)) {
    gamesData = gamesData.filter(g => g.id !== id);
    saveToLocalStorage();
    renderPageContent();
  }
}

// Закрытие модалок
function closeModal(modalId = 'gameModal') {
  const targetModal = document.getElementById(modalId);
  if (targetModal) targetModal.style.display = 'none';
}