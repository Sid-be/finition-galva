const DB_NAME = 'gestionApp';
const DB_VERSION = 2;
let db;

// Initialiser la base de données IndexedDB
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Création d'object store pour les fiches de plongée
      if (!db.objectStoreNames.contains('dailySheets')) {
        db.createObjectStore('dailySheets', { keyPath: 'date' });
      }

      // Création d'object store pour les clients
      if (!db.objectStoreNames.contains('clients')) {
        const clientStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
        clientStore.createIndex('date', 'date', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Base de données initialisée avec succès');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Erreur lors de l'initialisation de la base de données :", event);
      reject(event);
    };
  });
}

// Fonction pour ajouter un client
export function addClient(data) {
  const transaction = db.transaction(['clients'], 'readwrite');
  const objectStore = transaction.objectStore('clients');
  const serializableData = JSON.parse(JSON.stringify(data));
  objectStore.add(serializableData);
}

// Fonction pour récupérer les clients
export function getClients(callback) {
  const transaction = db.transaction(['clients'], 'readonly');
  const objectStore = transaction.objectStore('clients');
  const request = objectStore.getAll();

  request.onsuccess = (event) => {
    callback(event.target.result);
  };

  request.onerror = (event) => {
    console.error('Erreur lors de la récupération des clients', event);
  };
}

// Fonction pour ajouter une fiche de plongée
export function addSheet(sheet) {
  const transaction = db.transaction(['dailySheets'], 'readwrite');
  const sheetStore = transaction.objectStore('dailySheets');
  sheetStore.put(sheet);
  console.log(sheet); // Utilisation de `put` pour éviter les doublons par date
}

// Fonction pour récupérer une fiche de plongée par date
export function getSheet(date, callback) {
  if (!db) {
    console.error("La base de données n'est pas initialisée.");
    return;
  }

  const transaction = db.transaction(['dailySheets'], 'readonly');
  const objectStore = transaction.objectStore('dailySheets');
  const request = objectStore.get(date);

  request.onsuccess = (event) => {
    console.log('Fiche récupérée:', event.target.result);
    callback(event.target.result);
  };

  request.onerror = (event) => {
    console.error("Erreur lors de la récupération de la fiche:", event);
    callback(null);
  };
}

// Fonction pour récupérer toutes les fiches de plongée
export function getAllSheets(callback) {
  const transaction = db.transaction(['dailySheets'], 'readonly');
  const sheetStore = transaction.objectStore('dailySheets');
  const request = sheetStore.getAll();

  request.onsuccess = (event) => {
    callback(event.target.result);
  };

  request.onerror = (event) => {
    console.error('Erreur lors de la récupération des fiches', event);
  };
}
