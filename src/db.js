const DB_NAME = 'gestionApp';
const DB_VERSION = 1;
let db;

// Initialiser la base de données IndexedDB et retourner une promesse
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('date', 'date', { unique: false });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Base de données initialisée');
      resolve(db); // Résoudre la promesse une fois que la base de données est prête
    };

    request.onerror = (event) => {
      console.log('Erreur lors de l\'initialisation de la base de données', event);
      reject(event); // Rejeter la promesse en cas d'erreur
    };
  });
}

// Fonction pour ajouter une entrée à la base de données
export function addClient(data) {
    const transaction = db.transaction(['clients'], 'readwrite');
    const objectStore = transaction.objectStore('clients');
  
    // Sérialiser les données avec JSON pour garantir que tout est clonable
    const serializableData = JSON.parse(JSON.stringify(data));
    objectStore.add(serializableData);
  }

// Fonction pour récupérer les clients depuis la base de données
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


