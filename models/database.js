// models/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Pool de connexions MariaDB
console.log('Attempting to create database connection pool...');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds timeout
});
console.log('Database connection pool created. Connection will be tested on first query.');

// Fonctions CRUD
export async function getAllTodos() {
  const [rows] = await pool.query('SELECT * FROM todos');
  return rows;
}

export async function getTodoById(id) {
  const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
  return rows[0];
}

export async function createTodo({ name, priority = 1, done = false }) {
  const [result] = await pool.query(
    'INSERT INTO todos (name, priority, done) VALUES (?, ?, ?)',
    [name, priority, done]
  );
  return getTodoById(result.insertId);
}

export async function replaceTodo(id, { name, priority, done }) {
  await pool.query(
    'UPDATE todos SET name = ?, priority = ?, done = ? WHERE id = ?',
    [name, priority, done, id]
  );
  return getTodoById(id);
}

export async function updateTodo(id, data) {
  // Construction dynamique de la requête PATCH
  const fields = [];
  const values = [];
  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.priority !== undefined) {
    fields.push('priority = ?');
    values.push(data.priority);
  }
  if (data.done !== undefined) {
    fields.push('done = ?');
    values.push(data.done);
  }
  if (fields.length === 0) return getTodoById(id);
  values.push(id);
  await pool.query(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`, values);
  return getTodoById(id);
}

export async function deleteTodo(id) {
  await pool.query('DELETE FROM todos WHERE id = ?', [id]);
}

export async function deleteAllTodos() {
  const [result] = await pool.query('DELETE FROM todos');
  return result.affectedRows;
}

export async function getStats() {
  const [total] = await pool.query('SELECT COUNT(*) as total FROM todos');
  const [completed] = await pool.query('SELECT COUNT(*) as completed FROM todos WHERE done = true');
  const [byPriority] = await pool.query(
    `SELECT 
      SUM(priority = 1) as high, 
      SUM(priority = 2) as medium, 
      SUM(priority = 3) as low 
    FROM todos`
  );
  return {
    total: total[0].total,
    completed: completed[0].completed,
    pending: total[0].total - completed[0].completed,
    completionRate: total[0].total > 0 ? Math.round((completed[0].completed / total[0].total) * 100) : 0,
    byPriority: byPriority[0]
  };
}
