// 1. Chargement des modules requis
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// 2. Chargement des variables d'environnement (depuis le fichier .env)
dotenv.config();

// 3. Connexion à la base de données MongoDB
connectDB();

// 4. Initialisation de l'application Express
const app = express();

// ==========================================
// 5. Middlewares de Sécurité & Configuration
// ==========================================

// En-têtes HTTP sécurisés pour protéger contre plusieurs attaques
app.use(helmet());

// Autoriser les requêtes cross-origin (CORS)
app.use(cors());

// Middleware pour analyser le corps des requêtes en format JSON
app.use(express.json());

// Middleware pour analyser les données envoyées depuis des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 6. Déclaration des Routes de l'API
// ==========================================

// Route de test pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Gestion des Tâches' });
});

// Routes pour l'authentification et les utilisateurs
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth/', require('./routes/authRoutes'));
app.use('/api/auth/', require('./routes/authRoutes'));

// Routes pour la gestion des tâches
app.use('/api/tache', require('./routes/tacheRoutes'));

// ==========================================
// 7. Gestion des Erreurs (Fallback)
// ==========================================

// Gestion des routes inexistantes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée (Route inexistante)' });
});

// Gestionnaire global d'erreurs serveur (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur interne est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================
// 8. Démarrage du Serveur
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV || 'development'} sur le port ${PORT}`);
});