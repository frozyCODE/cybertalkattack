import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import CtrlTodo from './controller.js'

const app = express();
const PORT = 3000;

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// ROUTES REST API
// ========================================
app.get('/api/todos', CtrlTodo.readTodos);                // Lire la liste Todo
app.get('/api/todos/:id', CtrlTodo.readTodoId);           // Lire détail un Todo
app.post('/api/todos', CtrlTodo.createTodo);              // Créer un Todo
app.put('/api/todos/:id', CtrlTodo.replaceTodo);          // Modifier (entièrement) un Todo
app.patch('/api/todos/:id', CtrlTodo.partialReplaceTodo); // Modifier un Todo
app.delete('/api/todos/:id', CtrlTodo.deleteTodo);        // Supprimer un Todo

// Utilitaires
app.get('/api/stats', CtrlTodo.getStats);
app.delete('/api/todos', CtrlTodo.deleteAll);
app.get('/', CtrlTodo.getDoc);
// Serve SPA entry at /index
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GESTION DES ERREURS 404
app.use('/*splat', CtrlTodo.defaultRoute);

const docAPI = () => {
  console.log(`✅ Serveur API Todo démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation disponible sur http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponibles :`);
  console.log(`   GET    /api/todos          - Lister toutes les tâches`);
  console.log(`   GET    /api/todos/:id      - Récupérer une tâche`);
  console.log(`   POST   /api/todos          - Créer une nouvelle tâche`);
  console.log(`   PUT    /api/todos/:id      - Remplacer une tâche`);
  console.log(`   PATCH  /api/todos/:id      - Modifier une tâche`);
  console.log(`   DELETE /api/todos/:id      - Supprimer une tâche`);
  console.log(`   GET    /api/stats          - Statistiques`);
  console.log(`   DELETE /api/todos          - Supprimer toutes les tâches`);
}

// ========================================
// DÉMARRAGE DU SERVEUR
// ========================================

app.listen(PORT, docAPI);

export default app;
