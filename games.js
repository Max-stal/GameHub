let gamesData = [];

document.addEventListener('DOMContentLoaded', () => {
  initModal();
  fetch('games.json')
    .then(res => res.json())
    .then(data => {
      gamesData = data;
      renderPageContent();
    })
    .catch(err => console.error("Ошибка загрузки данных:", err));
});

// Рендеринг списков (LIST) в зависимости от страницы
function renderPageContent() {
  const pageType = document.body.dataset.page; // rpg, action, strategy, index

  if (pageType === 'index') {
    renderGrid('rpgGrid', gamesData.filter(g => g.category === 'rpg'));
    renderGrid('actionGrid', gamesData.filter(g => g.category === 'action'));
    renderGrid('strategyGrid', gamesData.filter(g => g.category === 'strategy'));
  } else if (pageType) {
    const genreGames = gamesData.filter(g => g.category === pageType);
    renderGrid('genreGrid', genreGames);
  }
}

// Генерация HTML карточек
function renderGrid(containerId, games) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = games.map(game => `
    <div class="card" onclick="openDetail('${game.id}')" style="cursor: pointer;">
      <img src="${game.image}" alt="${game.title}">
      <div class="card-info">
        <h3>${game.title}</h3>
        <span class="rating">⭐ ${game.rating}</span>
      </div>
    </div>
  `).join('');
}

// Встраивание HTML модалки (DETAIL)
function initModal() {
  const modalHTML = `
    <div id="gameModal" class="modal">
      <div class="modal-content">
        <span class="close-btn" id="closeModal">&times;</span>
        <img id="modalImg" src="" alt="" class="modal-img">
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
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('closeModal').onclick = closeModal;
  window.onclick = (e) => {
    if (e.target === document.getElementById('gameModal')) closeModal();
  };
}

// Показ модалки с деталями (DETAIL)
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

function closeModal() {
  document.getElementById('gameModal').style.display = 'none';
}