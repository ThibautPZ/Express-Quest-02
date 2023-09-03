const database = require("./database");
const getUsers = (req, res) => {
  const initialSql =
    "select id, firstname, lastname, email, city, language from users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }

  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  if (req.query.firstname != null) {
    where.push({
      column: "firstname",
      value: `%${req.query.firstname}%`,
      operator: "LIKE",
    });
  }

  if (req.query.lastname != null) {
    where.push({
      column: "lastname",
      value: `%${req.query.lastname}%`,
      operator: "LIKE",
    });
  }

  if (req.query.max_length_email != null) {
    where.push({
      column: "LENGTH(email)",
      value: req.query.max_length_email,
      operator: "<",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([movies]) => {
      if (movies.length !== 0) {
        res.json(movies);
      } else {
        res.send(
          "La recherche n'a retrouvé aucun utilisateur correspondant aux paramètres spécifiés. ( ´･･)ﾉ(._.`)"
        );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query(
      "select id, firstname, lastname, email, city, language from users where id = ?",
      [id]
    )
    .then(([users]) => {
      if (users[0] != null) {
        res.status(200).json(users[0]);
      } else {
        res.status(404).send("🥥 Nut found");
      }
    });
};

const addUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const changeUser = (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
      [firstname, lastname, email, city, language, hashedPassword, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("🥥 Nut found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error changing the user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("🥥 Nut found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);

      res
        .status(500)
        .send("Error deleting the user. He'll live another day...");
    });
};

const getUserByEmailWithPasswordAndPassToNextWithFriesAndALargeSodaPlease = (
  req,
  res,
  next
) => {
  const email = req.body.email;
  // const password = req.body.password;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.status(401).send("User not Found");
      }
    })

    .catch((err) => {
      console.error(err);

      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  changeUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNextWithFriesAndALargeSodaPlease,
};
