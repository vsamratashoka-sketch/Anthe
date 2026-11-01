import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Please provide  both username and password");
  }

  try {
    const usrnmCheck = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    if (usrnmCheck) {
      return res.status(409).send("User already exists");
    }
    const hashedPasswd = await bcrypt.hash(password, 10);
    const insertUsr = db.prepare(
      `INSERT INTO users (username, password) VALUES (?,?)`,
    );
    const result = insertUsr.run(username, hashedPasswd);

    const token = jwt.sign({id: Number(result.lastInsertRowid)}, process.env.JWT_SECRET,  {
      expiresIn: "24h",
    });
    res.status(201).send({
      username,
      token,
    });
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Please provide  both username and password");
  }

  try {
    const usrnmCheck = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    if (!usrnmCheck) {
      return res.status(401).send(`User doesn't exists`);
    }

    const checkPasswd = bcrypt.compare(password, usrnmCheck.password);
    if (checkPasswd === false) {
      return res.status(401).send("Wrong password");
    }
    const token = jwt.sign({ id: Number(usrnmCheck.id)}, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).send({
      username,
      token,
    });
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});

export default router;
