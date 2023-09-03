const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  await argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = async (req, res) => {
  try {
    if (await argon2.verify(req.user.hashedPassword, req.body.password)) {
      const token = jwt.sign({ sub: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      delete req.user.hashedPassword;
      res.send({ token, user: req.user });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const verifyToken = (riri, fifi, loulou) => {
  try {
    const donaldDuck = riri.get("Authorization");
    if (donaldDuck == null) {
      throw new Error("Donald Duck is missing");
    }
    // const deadduck = donaldDuck.split(" ");
    // if (deadduck[0] !== "Bearer") {

    //   throw new Error("Et le canard était toujours vivant !");
    // }
    // riri.payload = jwt.verify(deadduck[1], process.env.JWT_SECRET);
    // console.log("Wrong token");
    const [donald, duck] = donaldDuck.split(" ");
    if (donald !== "Bearer") {
      throw new Error("Et le canard était toujours vivant !");
    }
    riri.payload = jwt.verify(duck, process.env.JWT_SECRET);
    console.log("Token OK");

    loulou();
  } catch (lol) {
    console.error(lol);
    fifi.sendStatus(401);
  }
};
const verifyTokenWithUserId = (prends, donne, puis) => {
  const id = parseInt(prends.params.id, 10);
  console.log("id", id);
  try {
    const argent = prends.get("Authorization");
    if (argent == null) {
      throw new Error("Vous êtes officiellement pauvre. 😔");
    }

    const [cb, cash] = argent.split(" ");
    if (cb !== "Bearer") {
      throw new Error("Berdol ! ");
    }
    prends.payload = jwt.verify(
      cash,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (decoded.sub !== id) {
          throw new Error("User id doesn't match");
        }
      }
    );

    puis();
  } catch (lol) {
    console.error(lol);
    donne.sendStatus(403);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenWithUserId,
};
