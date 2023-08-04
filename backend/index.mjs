import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from 'dotenv'
const { Pool } = pkg;
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const pool = new Pool({
  user: process.env.user,
  database: process.env.database, 
  password: process.env.password,
  port: process.env.port,
  host: process.env.host,
}); 

app.get("/", async (req, res) => {
  const { search } = req.query;
  try {
    let q = "SELECT * FROM todo";
    const values = [];
    if (search) {
      q += " WHERE name ILIKE $1";
      values.push(`%${search}%`);
    }
    const newTodo = await pool.query(q, values);
    res.json({ newTodo: newTodo.rows });
  } catch (error) {
    res.send(error);
  }
});

app.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const newTodo = await pool.query("SELECT * FROM todo WHERE id=$1", [id]);
    res.json({ newTodo: newTodo.rows[0] });
  } catch (error) {
    res.send(error);
  }
})

app.post("/post", async (req, res) => {
  const { name, description } = req.body;
  try {
    const newTodo = await pool.query(
      "INSERT INTO todo (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.json({ newTodo: newTodo.rows[0] });
  } catch (error) {
    res.send(error);
  }
});

app.put("/put/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updateTodo = await pool.query(
      "UPDATE todo SET name=$1, description=$2 WHERE id=$3",
      [name, description, id]
    );
    if (updateTodo.rowCount >= 1) return res.json({ message: "UPDATED" });
  } catch (error) {
    res.json({ error: error });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.body;
  try {
    const deleteTodo = await pool.query("DELETE FROM todo WHERE id=$1", [id]);
    if (deleteTodo.rowCount >= 1) {
      return res.json({ message: "DELETED" });
    } else {
      return res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


app.listen("3000", () => {
  console.log("Server is running on http://localhost:3000/");
});
