/** @format */

document.addEventListener("DOMContentLoaded", function () {
  // Получить данные при загрузке страницы

  //переменные
  var select = null; // через нее отслеживаю событие
  var selectid = null;
  var table = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  var err = "";
  var users = [];

  // Создание таблицы

  table.id = "usertable";
  table.style.borderCollapse = "collapse";
  table.style.width = "70%";
  table.style.margin = "20px 0";
  table.style.cursor = "pointer";
  document.body.appendChild(table);

  // Создание заголовка таблицы

  var tr = document.createElement("tr");
  const data = ["Фамилия", "Имя", "Отчество"];
  for (item of data) {
    var th = document.createElement("th");
    th.style.border = "1px solid black";
    th.style.padding = "10px";
    th.style.textAlign = "left";

    th.appendChild(document.createTextNode(item));
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  // Создание тела таблицы

  table.appendChild(tbody);

  //Получение пользователей
  async function getUser() {
    const urlget = "http://localhost:3000/users";
    try {
      const response = await fetch(urlget);
      const data = await response.json();
      users = data;
      //   var users = data;
      updateTable();
    } catch (error) {
      err = error.message;
    }
  }

  getUser();

  // Обновление таблицы с данными
  function updateTable() {
    tbody.innerHTML = "";
    // Добавить каждого пользователя в таблицу
    users.forEach(function (user) {
      const row = tbody.insertRow();
      row.id = user.id;
      const data = [user.familya, user.name, user.surname];
      for (item of data) {
        var cell = row.insertCell();
        cell.appendChild(document.createTextNode(item));
        applyCellStyle(cell);
      }

      // Добавляем обработчик события для изменения цвета фона и обновления инпутов при клике
      row.addEventListener("click", function () {
        if (selectid !== null) {
          // Сбрасываем цвет фона для предыдущей выбранной строки
          selectid.style.backgroundColor = "";
        }

        if (selectid !== row) {
          // Устанавливаем цвет фона для новой выбранной строки
          row.style.backgroundColor = "lightgrey";
          selectid = row; // Обновляем текущую выбранную строку

          // Обновляем значения инпутов
          updateInputs(row);
        } else {
          // Если кликнули снова на ту же строку, снимаем выделение и очищаем инпуты
          select = null;
          selectid = null;
          clearInputFields();
        }
      });
    });
  }

  //Добавление пользователя

  async function addUser() {
    const adduser = "http://localhost:3000/users/add";
    const userData = {
      familya: familya.value,
      name: named.value,
      surname: surname.value,
    };

    try {
      const response = await fetch(adduser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.error) {
        err = data.error;
      } else {
        err = "";
        getUser();
        // updateTable(users);
        clearInputFields();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Изменение данных в таблице
  async function updateUser() {
    if (!selectid || !familya.value || !named.value || !surname.value) {
      err = "Выберите пользователя";
      return;
    }
    const updateuser = "http://localhost:3000/users/update";

    if (selectid) {
      const user = {
        id: selectid.dataset.userId,
        familya: familya.value,
        name: named.value,
        surname: surname.value,
      };

      try {
        const response = await fetch(updateuser, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        // updateTable();
        if (data.error) {
          err = data.error;
        } else {
          err = "";
          getUser();
          clearInputFields();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  //удаление пользователя

  async function deleteUser() {
    if (!selectid || !selectid.id) {
      err = "Выберите пользователя";
      return;
    }

    const deleteuser = `http://localhost:3000/users/delete/${selectid.id}`;

    try {
      const response = await fetch(deleteuser, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        err = data.error;
      } else {
        err = "";
        getUser();
        clearInputFields();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Функция для обновления значений инпутов при выборе строки
  function updateInputs(row) {
    var cells = row.cells;
    familya.value = cells[0].textContent;
    named.value = cells[1].textContent;
    surname.value = cells[2].textContent;
    selectid.dataset.userId = row.id;
  }

  //   function updateUser() {
  //     var selectedRow = tbody.getElementsByTagName("tr")[0]; // Первая строка
  //     ["familya", "name", "surname"].forEach(function (id, index) {
  //       selectedRow.cells[index].innerHTML = document.getElementById(id).value;
  //       applyCellStyle(selectedRow.cells[index]);
  //     });
  //     clearInputFields();
  //   }

  function deleteUser() {
    tbody.deleteRow(0); // Удалить первую строку
    clearInputFields();
  }

  function applyCellStyle(cell) {
    cell.style.border = "1px solid black";
    cell.style.padding = "10px";
    cell.style.textAlign = "left";
  }

  function clearInputFields() {
    [familya, named, surname].forEach(function (input) {
      input.value = "";
    });
  }

  // Создание элементов управления после создания таблицы
  var createInput = function (type, placeholder) {
    var input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.marginRight = "10px";
    document.body.appendChild(input);
    return input;
  };

  var createButton = function (id, text, clickHandler) {
    var button = document.createElement("button");
    button.id = id;
    button.appendChild(document.createTextNode(text));
    button.onclick = clickHandler;
    button.style.margin = "10px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
    return button;
  };

  var familya = createInput("text", "Фамилия");
  var named = createInput("text", "Имя");
  var surname = createInput("text", "Отчество");

  var addBtn = createButton("addBtn", "Добавить", addUser);
  var updateBtn = createButton("updateBtn", "Изменить", updateUser);
  var deleteBtn = createButton("deleteBtn", "Удалить", deleteUser);
});
