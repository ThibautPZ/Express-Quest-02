const isDwight = (req, res, next) => {
  if (req.email === "dwight@theoffice.com" && req.password === "123456") {
    res.status(201).send("credentials are valid");
  } else {
    res.sendStatus(401);
  }
  next();
};

module.exports = isDwight;
