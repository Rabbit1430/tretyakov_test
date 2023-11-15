/** @format */

import express from "express";
import mysql from "mysql2";

const app = express();
app.use(express.json());

//Введите данные от mysql

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dima325671()))",
  database: "gallery_test",
});

database.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("Соединение с Mysql установлено");
});

//задание номер 1
app.post("/backend1", (req, res) => {
  setTimeout(() => {
    res.send("backend 1 выполнен");
  }, 5000);
});

app.post("/backend2", (req, res) => {
  setTimeout(() => {
    res.send("backend 2 выполнен");
  }, 15000);
});

app.post("/backend3", (req, res) => {
  setTimeout(() => {
    res.send("backend 3 выполнен");
  }, 10000);
});

//задание номер 2

class Users {
  static GetUser(res) {
    database.query("SELECT * FROM people", (error, answer) => {
      if (error) {
        res.status(500).json({ error: "Пользователи не получены" });
      } else {
        res.json(answer);
      }
    });
  }
  static addUser(user, res) {
    const familya = user.familya;
    const name = user.name;
    const surname = user.surname;
    database.query(
      "INSERT INTO people (familya, name, surname) VALUES (?, ?, ?)",
      [familya, name, surname],
      (error, answer) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({ error: "Повторяется ФИО" });
          } else {
            // res.status(500).json({ error: "Не добавляется запись" });
            console.log(error);
          }
        } else {
          res.json({ message: "User добавлен" });
        }
      }
    );
  }

  static updateUser(user, res) {
    const id = user.id;
    const familya = user.familya;
    const name = user.name;
    const surname = user.surname;

    database.query(
      "UPDATE people SET familya= ?, name= ?, surname= ? WHERE id =?",
      [familya, name, surname, id],
      (error, answer) => {
        if (error) {
          res.status(500).json({ error: "Не могу обновить user" });
        } else {
          res.json({ message: "User обновлен" });
        }
      }
    );
  }

  static delUser(id, res) {
    database.query("DELETE FROM people WHERE id = ?", id, (error, answer) => {
      if (error) {
        res.status(500).json({ error: "Не могу удалить user " });
      } else {
        res.json({ message: "User удален" });
      }
    });
  }
}

app.get("/users", (req, res) => {
  Users.GetUser(res);
});

app.post("/users/add", (req, res) => {
  const user = req.body;
  Users.addUser(user, res);
});

app.put("/users/update", (req, res) => {
  const user = req.body;
  Users.updateUser(user, res);
});

app.delete("/users/delete/:id", (req, res) => {
  const userid = req.params.id;
  Users.delUser(userid, res);
});

app.listen(3000, () => {
  console.log("Сервер запущен");
});
