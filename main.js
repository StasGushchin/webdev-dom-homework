        "use strict";
  // Загрузка
  let loader = false;
  const addForm = document.querySelector(".add-form")
  const formRender = () => {
    if (loader) {
      addForm.innerHTML = "<p>Загрузка...</p>"
      
    } else {
      addForm.innerHTML = `<input
          id="name-input"
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"
        />
        <textarea
          id="comment-input"
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш коментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button id="add-button" class="add-form-button">Написать</button>
        </div>`
        addEventButton();
    }
  }
  formRender();

  
  const buttonLike = document.getElementById("like");
  const commentsElement = document.getElementById ("comments");

  let users = [];

// Получение данных из API
const getApi = () => {
  loader = true;
  formRender();
const fetchPromiseGet = fetch("https://wedev-api.sky.pro/api/v1/stas/comments",
  {
    method: "GET",
  }).then((response) => {
    return response.json();
  })
    .then((responseData) => {
      users = responseData.comments;
      renderUsers();
      loader = false;
      formRender();
  })
  
  return fetchPromiseGet;
}
getApi();

const postApi = (nameInputElement, commentInputElement) => {
  
  const fetchPromisePost = fetch("https://wedev-api.sky.pro/api/v1/stas/comments",
  {
    method: "POST",
    body: JSON.stringify({
      text: commentInputElement.value,
      name: nameInputElement.value
    })
  }).then(() => {
    getApi()
  })
  
  
  return fetchPromisePost;
}

// Массив данных
// const users = [
//   {
//     name: "Глеб Фокин",
//     date: "12.02.22 12:18",
//     text: "Это будет первый комментарий на этой странице",
//     likes: 3,
//     isLiked: false
//   },
//   {
//     name: "Варвара Н.",
//     date: "13.02.22 19:22",
//     text: "Мне нравится как оформлена эта страница! ❤",
//     likes: 75,
//     isLiked: true
//   }
// ];

// Установка формата даты ДД.ММ.ГГГГ ЧЧ:ММ
const date = function (date) {
const months = ["01", "02", "03", "04", "05", "06",
"07", "08", "09", "10", "11", "12"];
let commentDate = new Date(date);
  let currentDate = commentDate.getDate() + "." + months[commentDate.getMonth()] + "." + commentDate.getFullYear();
  let hour = commentDate.getHours();
  let minute = commentDate.getMinutes();
  let second = commentDate.getSeconds();
    if (minute < 10) {
      minute = "0" + minute;
    }
    let currentTime = hour + ":" + minute;

    let fullDate = `${currentDate} ${currentTime}`;
    return fullDate
}

// Добавление комментрия клавишей Enter
document.addEventListener("keyup", (event) => {
    if (event.code === 'Enter') {
      document.getElementById("add-button").click();
      return;
    }
  });

// Кнопка лайка
const getLikeClass = (element) => {
  return element ? "like-button -active-like" : "like-button"
}

// Добавить лайк
function addLike () {
  const likeElements = document.querySelectorAll('.like-button')
  likeElements.forEach((element, index) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      const user = users[index];
      if (user.isLiked === true) {
        user.isLiked = false;
        user.likes -= 1;
        renderUsers();
      } else {
        user.isLiked = true;
        user.likes += 1;
        renderUsers();
      }
    })
  })
}

// Ответ на комментарий
const answer = () => {
const commentAnswers = document.querySelectorAll('.comment');
commentAnswers.forEach((textElement, index) => {
  textElement.addEventListener('click', (event) => {
    let textValue = textElement.textContent;
    return commentInputElement.value = `${users[index].text} ${users[index].author.name}`;
  });
});
};

// Рендер функция
const renderUsers = () => {
  const userHtml = users.map((user, index) => {
    return `<li id="last-element" class="comment">

    <div class="comment-header">
        <div>${user.author.name}</div>
        <div>${date(user.date)}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${user.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${user.likes}</span>
          <button class="${getLikeClass(user.isLiked)}"></button>
        </div>
      </div>
    </li>`
  }).join("");
  commentsElement.innerHTML = userHtml;
  addLike();
  answer();
};

renderUsers()

// Функция клика, валидация
function addEventButton () {
  const buttonElement = document.getElementById("add-button");
  const nameInputElement = document.getElementById("name-input");
  const commentInputElement = document.getElementById("comment-input");

  buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  commentInputElement.classList.remove("error");
  if (nameInputElement.value === "" || commentInputElement.value === "") {
    nameInputElement.classList.add("error");
    commentInputElement.classList.add("error");
    buttonElement.classList.add("disabled-button");
    return;
  } else {
    buttonElement.classList.remove("disabled-button");
  }

// Добавляем новый комментарий
  // users.push({
  //   name: nameInputElement.value
  //   .replaceAll("<", "&lt;")
  //   .replaceAll(">", "&gt;"),
  //   date: date(),
  //   text: commentInputElement.value
  //   .replaceAll("<", "&lt;")
  //   .replaceAll(">", "&gt;"),
  //   likes: 0
  // })
  postApi(nameInputElement, commentInputElement);
  renderUsers();
  
});
}

console.log("It works!");