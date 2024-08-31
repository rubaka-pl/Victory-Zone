// Добавление иконки при нажатии на кнопку
const addGameButton = document.getElementById("addGameButton");
const addGameForm = document.getElementById("addGameForm");

const toggleIcon = () => {
  const icon = addGameButton.querySelector("i");
  if (icon.classList.contains("bx-plus-circle")) {
    icon.classList.remove("bx-plus-circle");
    icon.classList.add("bx-minus");
  } else {
    icon.classList.remove("bx-minus");
    icon.classList.add("bx-plus-circle");
  }
};
// Обработчик клика по кнопке "+"
addGameButton.addEventListener("click", () => {
  // Показываем или скрываем форму
  const isFormVisible = addGameForm.style.display === "flex";
  addGameForm.style.display = isFormVisible ? "none" : "flex";

  // Переключаем иконку
  toggleIcon();
});

// Скролл для хедера
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

// Изменение placeholder в поиске при изменении размера окна
document.addEventListener("DOMContentLoaded", function () {
  function updatePlaceholder() {
    const input = document.querySelector(".searchBx input");
    if (window.innerWidth <= 1178) {
      input.setAttribute("placeholder", "Search");
    } else {
      input.setAttribute("placeholder", "Search Games");
    }
  }

  updatePlaceholder();
  window.addEventListener("resize", updatePlaceholder);
});

// Тоггл для навигационного меню
function toggleNavigationMenu() {
  const toggleMenu = document.querySelector(".toggleMenu");
  const nav = document.querySelector(".nav");
  toggleMenu.classList.toggle("active");
  nav.classList.toggle("active");
}

// Закрытие меню при клике на навигационные ссылки
function closeMenuOnNavClick() {
  document.querySelectorAll(".nav a").forEach((e) =>
    e.addEventListener("click", () => {
      document.querySelector(".nav").classList.remove("active");
      document.querySelector(".toggleMenu").classList.remove("active");
    }),
  );
}

document.addEventListener("DOMContentLoaded", closeMenuOnNavClick);

// Прокрутка до якоря
document.addEventListener("DOMContentLoaded", function () {
  function scrollToAnchor(anchor) {
    const element = document.querySelector(anchor);
    if (element) {
      const offset = 110;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  // Прокрутка до якоря при клике на ссылку
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      scrollToAnchor(target);
    });
  });
});

// Форматирование значения цены
document.getElementById("gamePrice").addEventListener("input", function () {
  const value = this.value.replace(/[^0-9.]/g, "");
  this.value = value ? `${value}$` : "";
});

// Чтение/Скрытие дополнительного текста
document.addEventListener("DOMContentLoaded", function () {
  const readMoreLink = document.getElementById("read-more-link");
  const additionalText = document.getElementById("additional-text");

  readMoreLink.addEventListener("click", function (e) {
    e.preventDefault();
    if (additionalText.style.display === "none") {
      additionalText.style.display = "block";
      setTimeout(() => {
        additionalText.classList.add("show");
      }, 10);
      readMoreLink.textContent = "Collapse";
    } else {
      additionalText.classList.remove("show");
      setTimeout(() => {
        additionalText.style.display = "none";
      }, 500);
      readMoreLink.textContent = "Read More";
    }
  });
});

// Динамическое добавление карточек
document.addEventListener("DOMContentLoaded", function () {
  // Функция инициализации фильтров и карточек
  function initializeFiltersAndCards() {
    let filterItems = document.querySelectorAll(".list");
    let gameCards = document.querySelectorAll(".card");

    filterItems.forEach((filterItem) => {
      filterItem.addEventListener("click", function () {
        filterItems.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");

        let dataFilter = this.getAttribute("data-filter");
        console.log("Filter applied:", dataFilter);

        gameCards.forEach((card) => {
          if (card.getAttribute("data-item") === dataFilter || dataFilter === "all") {
            card.classList.remove("hide");
            card.classList.add("active");
          } else {
            card.classList.add("hide");
            card.classList.remove("active");
          }
        });
      });
    });
  }

  // Функция для сохранения карточек в localStorage
  function saveCardsToLocalStorage() {
    const cards = [];
    document.querySelectorAll(".cardBx .card").forEach((card) => {
      const name = card.querySelector(".content h4").textContent;
      const image = card.querySelector("img").src;
      const price = card.querySelector(".info span").textContent;
      const platform = card.getAttribute("data-item");
      const progressBarWidth = parseFloat(
        card.querySelector(".progress-line span").style.width,
      );
      const slots = Math.round((progressBarWidth / 100) * 480);
      cards.push({ name, image, price, platform, slots });
    });
    localStorage.setItem("gameCards", JSON.stringify(cards));
  }

  // Функция для добавления карточки игры
  function addGameCard(game) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-item", game.platform);

    // Создаем контейнер для прогресс-бара
    const progressLine = document.createElement("div");
    progressLine.classList.add("progress-line");
    const progressBar = document.createElement("span");
    const totalSlots = 500;
    const progressPercentage = (game.slots / totalSlots) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressLine.appendChild(progressBar);

    // HTML
    card.innerHTML = `
      <img src="${game.image}" alt="game">
      <div class="content">
        <div class="overlay">
          <h4 class="overlay_text">${game.name}</h4>
        </div>
        <h4>${game.name}</h4>
        ${progressLine.outerHTML}
        <div class="info">
          <p>Pricing<br><span>${game.price}</span></p>
          <a href="#">Play Now</a>
        </div>
      </div>
    `;

    // Добавляем карточку в контейнер
    document.querySelector(".cardBx").appendChild(card);
  }

  // Функция для загрузки карточек из localStorage
  function loadCardsFromLocalStorage() {
    const storedCards = localStorage.getItem("gameCards");
    if (storedCards) {
      JSON.parse(storedCards).forEach((game) => {
        addGameCard(game); // Добавляем карточку на страницу
      });
      initializeFiltersAndCards(); // Инициализируем фильтры после загрузки карточек
    }
  }

  // Обработчик отправки формы
  document.getElementById("addGameForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    addGameForm.style.display = "none";
     toggleIcon(); // Сброс иконки кнопки

    const game = {
      name: document.getElementById("gameName").value,
      image: document.getElementById("gameImage").value,
      price: document.getElementById("gamePrice").value,
      platform: document.getElementById("gamePlatform").value,
      slots: parseInt(document.getElementById("gameSlots").value, 10),
    };

    addGameCard(game);

    document.getElementById("addGameForm").reset();
    document.getElementById("addGameForm").style.display = "none";
    saveCardsToLocalStorage();
  });

  // Инициализация фильтров и карточек при загрузке страницы
  loadCardsFromLocalStorage();
  initializeFiltersAndCards();

  // Наблюдение за изменениями в cardBx
  const observer = new MutationObserver(() => initializeFiltersAndCards());
  observer.observe(document.querySelector(".cardBx"), {
    childList: true,
    subtree: true,
  });
});

// Турниры
const tournaments = [
  {
    imgSrc: "img/tournament1.webp",
    matches: 50,
    description:
      "The world of Counter-Strike: Global Offensive is ablaze with action! Top teams are clashing in intense tactical battles, where every shot counts. Do you have what it takes to lead your team to victory and prove your skills in this legendary shooter?",
  },
  {
    imgSrc: "img/tournament2.webp",
    matches: 30,
    description:
      "Join the fray in Apex Legends, where strategic teamwork meets fast-paced action. Legends from all over the Outlands are battling for glory, with squads fighting to be the last ones standing in this thrilling tournament.",
  },
  {
    imgSrc: "img/tournament3.webp",
    matches: 75,
    description:
      "The battlefield is heating up in Call of Duty: Warzone! Players are dropping into Verdansk for intense battle royale action, where only the strongest survive. Will you be the one to claim victory in this high-stakes competition?",
  },
  {
    imgSrc: "img/tournament4.webp",
    matches: 60,
    description:
      "The Ancient calls for champions in Dota 2! Heroes from around the world are competing in this legendary tournament, where every decision could mean the difference between victory and defeat. Who will answer the call and emerge victorious?",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const boxContainer = document.querySelector(".boxBx");

  tournaments.forEach((tournament) => {
    const box = document.createElement("div");
    box.classList.add("box");

    box.innerHTML = `
      <img src="${tournament.imgSrc}" alt="tournament">
      <div class="content">
        <h4><span>${tournament.matches}</span> Matches in progress..</h4>
        <p style="height: 150px; overflow: hidden; color: #fff">${tournament.description}</p>
        <div class="btn">
          <a href="#" class="watch">Watch</a>
          <a href="#" class="join">Join Now</a>
        </div>
      </div>
    `;

    boxContainer.appendChild(box);
  });
});
