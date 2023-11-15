/** @format */

document.addEventListener("DOMContentLoaded",  function () {
  // Получить данные при загрузке страницы


  //задание 1
async function task() {
  try {
    await Promise.all([
      sendpost("http://localhost:3000/backend1"),
      sendpost("http://localhost:3000/backend2"),
      sendpost("http://localhost:3000/backend3"),
    ]);
    allSuccess();
  } catch (error) {
    console.error("Ошибка:", error.message);
  }

  async function sendpost(url) {
    const response = await fetch(url, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.text();
      console.log("Данные с сервера:", data);
    } else {
      throw new Error("Ошибка в запросе на сервер");
    }
  }

  function allSuccess() {
    alert("УРА!");
  }
}
task()



//задание 2


  //переменные
  var select = null; 
  var selectid = null;
  var h1 = document.createElement("h1");
  var h2 = document.createElement("h1");
  var table = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  var err = "";
  var users = [];

  //  таблица
 
  h1.textContent ="Таблица"
  h2.textContent ="Поля"
  
  document.body.appendChild(h1);

  table.id = "usertable";
  table.style.borderCollapse = "collapse";
  table.style.width = "70%";
  table.style.margin = "20px 0";
  table.style.cursor = "pointer";
  document.body.appendChild(table);

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

  table.appendChild(tbody);

  document.body.appendChild(h2);

  //Ошибки 
  var errordiv = document.createElement("div");
  document.body.appendChild(errordiv);


  function errordivtext() {

    errordiv.textContent = err;
    errordiv.style.color='red'
  }

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
      errordivtext();
    }
  }

  getUser();

  // Обновление таблицы 
  function updateTable() {
    tbody.innerHTML = "";
    users.forEach(function (user) {
      const row = tbody.insertRow();
      row.id = user.id;
      const data = [user.familya, user.name, user.surname];
      for (item of data) {
        var cell = row.insertCell();
        cell.appendChild(document.createTextNode(item));
        cellstyle(cell);
      }

      // изменения цвета фона и аптейд инпутов при клике
      row.addEventListener("click", function () {
        if (selectid !== null) {
          
          selectid.style.backgroundColor = "";
        }

        if (selectid !== row) {
          
          row.style.backgroundColor = "lightgrey";
          selectid = row; 
          err = "";
      errordivtext();

       
          updateInputs(row);
        } else {
         
          select = null;
          selectid = null;
          clearInput();
        }
      });
    });
  }

  //Добавление пользователя

  async function addUser() {
    if (!selectid || !familya.value || !named.value || !surname.value) {
      err = "Выберите пользователя или заполните поля";
      errordivtext();
      return;
    }
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
        clearInput();
      }
    } catch (error) {
      console.error(error);
      err = error.message;
      errordivtext();
    }
  }

  // Изменить ФИО
  async function updateUser() {
    if (!selectid || !familya.value || !named.value || !surname.value) {
      err = "Выберите пользователя";
      errordivtext();
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
          clearInput();
        }
      } catch (error) {
        console.error(error);
        err = error.message;
       errordiv();
      }
    }
  }

  //удаление пользователя

  async function deleteUser() {
    if (!selectid || !selectid.id) {
      err = "Выберите пользователя";
      errordivtext();
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
        clearInput();
      }
    } catch (error) {
      console.error(error);
    }
  }

  //подстановка данных в инпуты
  function updateInputs(row) {
    var cells = row.cells;
    familya.value = cells[0].textContent;
    named.value = cells[1].textContent;
    surname.value = cells[2].textContent;
    selectid.dataset.userId = row.id;
  }



  function cellstyle(cell) {
    cell.style.border = "1px solid black";
    cell.style.padding = "10px";
    cell.style.textAlign = "left";
  }

  function clearInput() {
    const dataint = [familya, named, surname]
   for (int of dataint) {
      int.value = "";
    };
  }

 

  // Инпуты
  var createInput = function (type, placeholder) {
    var input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.marginRight = "10px";
    document.body.appendChild(input);
    return input;
  };

//кнопки
  var createButton = function (id, text, clicked) {
    var button = document.createElement("button");
    button.id = id;
    button.appendChild(document.createTextNode(text));
    button.onclick = clicked;
    button.style.margin = "10px";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
    return button;
  };

  var familya = createInput("text", "Фамилия");
  var named = createInput("text", "Имя");
  var surname = createInput("text", "Отчество");

createButton("addBtn", "Добавить", addUser);
   createButton("updateBtn", "Изменить", updateUser);
  createButton("deleteBtn", "Удалить", deleteUser);




  //задание 3

;
  

  var task3 = document.createElement("div");
task3.classList.add("task3");
let count = 8 // число квадратов

var kvadrat = document.createElement("div");
kvadrat.classList.add("kvadrat");
kvadrat.style.width = "100px";
kvadrat.style.height = "100px";
kvadrat.style.display = "flex";
kvadrat.style.alignItems = "center";
kvadrat.style.justifyContent = "center";
kvadrat.style.border = "1px solid black";

var newkvadrat = kvadrat;

for (var i = 0; i < count; i++) {
    var mykvadrat = document.createElement("div");
    mykvadrat.classList.add("kvadrat");
    mykvadrat.style.width = "85%";
    mykvadrat.style.height = "85%";
    mykvadrat.style.border = "1px solid black";
    mykvadrat.style.display = "flex";
    mykvadrat.style.alignItems = "center";
    mykvadrat.style.justifyContent = "center";
    
    newkvadrat.appendChild(mykvadrat);
    newkvadrat = mykvadrat; 
}

task3.appendChild(kvadrat);
document.body.appendChild(task3);
  
  
  



});



