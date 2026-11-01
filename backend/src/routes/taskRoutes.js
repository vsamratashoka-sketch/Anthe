import express from "express";
import db from "../db.js";

const router = express.Router();

//Getting todos
router.get("/", (req, res) => {
  const { id } = req.user;
  try {
    const getTasks = db.prepare(`SELECT * FROM todo WHERE user_id = ? `);
    const result = getTasks.all(id);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});

//Adding todos
router.post("/add", (req, res) => {
  const { todo } = req.body;
  const { id } = req.user;
  console.log(id, todo)
  if (!todo) {
    return res.status(400).send("Todo is missing");
  };

  try {
    const insertTodo = db.prepare(
      `INSERT INTO todo (user_id, task) VALUES (?,?) `
    );
    const result = insertTodo.run(id, todo);

    if (result.changes === 0) {
      return res
        .status(500)
        .send("Nothing was changed, server error. Try again");
    }
    res.status(201).send({
      todo,
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});

//updating todos
router.put("/:id/update", (req, res) => {
  const id  = req.params.id;
  const { todo } = req.body;
  if ( !todo) {
    return res.status(400).send("New task is missing");
  }
  try {
    const updateTodo = db.prepare(
      `UPDATE  todo SET task = ? WHERE id = ? AND user_id = ?`,
    );
    const result = updateTodo.run(todo, id, req.user.id);
    if (result.changes === 0) {
      return res
        .status(404)
        .send("Todo not found");
    }
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});

//deleting todos
router.delete('/":id/delete', (req, res) => {
  const  id  = req.params.id;
  try {
    const deleteTodo = db.prepare(
      `DELETE FROM todo WHERE id = ? AND user_id = ?`,
    );
    const result = deleteTodo.run(id, req.user.id);
    if (result.changes === 0) {
      return res
        .status(404)
        .send("Todo not found");
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send("Try again, something went wrong");
  }
});
export default router;
