// db.js
import { openDB } from 'idb';

const DB_NAME = 'gestionApp';
const DB_VERSION = 3;

let db = null;

export async function initDB() {
  try {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('dailySheets')) {
          db.createObjectStore('dailySheets', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('lastLocations')) {
          db.createObjectStore('lastLocations', { keyPath: 'clientId' });
        }
      },
    });
    console.log('IndexedDB initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    throw error;
  }
}

export async function addClient(client) {
  try {
    const tx = db.transaction('clients', 'readwrite');
    await tx.objectStore('clients').add(client);
    await tx.done;
    console.log('Client added successfully');
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
}

export async function getClients() {
  try {
    const tx = db.transaction('clients', 'readonly');
    const clients = await tx.objectStore('clients').getAll();
    await tx.done;
    return clients;
  } catch (error) {
    console.error('Error retrieving clients:', error);
    throw error;
  }
}

export async function addSheet(sheet) {
  try {
    const tx = db.transaction('dailySheets', 'readwrite');
    const sheetClone = JSON.parse(JSON.stringify(sheet)); // Convert sheet to a cloneable object
    await tx.objectStore('dailySheets').put(sheetClone);
    await tx.done;
    console.log('Daily sheet added successfully');
  } catch (error) {
    console.error('Error adding daily sheet:', error);
    throw error;
  }
}

export async function getSheet(date) {
  try {
    const tx = db.transaction('dailySheets', 'readonly');
    const sheet = await tx.objectStore('dailySheets').get(date);
    await tx.done;
    return sheet;
  } catch (error) {
    console.error('Error retrieving daily sheet:', error);
    throw error;
  }
}

export async function getAllSheets() {
  try {
    const tx = db.transaction('dailySheets', 'readonly');
    const sheets = await tx.objectStore('dailySheets').getAll();
    await tx.done;
    return sheets;
  } catch (error) {
    console.error('Error retrieving all daily sheets:', error);
    throw error;
  }
}

export async function deleteSheetEntry(sheetDate) {
  try {
    const tx = db.transaction("dailySheets", "readwrite");
    await tx.objectStore("dailySheets").delete(sheetDate);
    await tx.done;
    console.log("Fiche supprimée de la base de données");
  } catch (error) {
    console.error("Erreur lors de la suppression de la fiche de la base de données :", error);
    throw error;
  }
}

// Nouvelle fonction deletePlongee pour supprimer une plongée spécifique dans dailySheets
export async function deletePlongee(plongeeId, sheetDate) {
  try {
    const tx = db.transaction("dailySheets", "readwrite");
    const sheet = await tx.objectStore("dailySheets").get(sheetDate);

    if (sheet && sheet.plongees) {
      // Filtre les plongées pour supprimer celle avec plongeeId
      sheet.plongees = sheet.plongees.filter(plongee => plongee.id !== plongeeId);
      await tx.objectStore("dailySheets").put(sheet); // Mets à jour le dailySheet sans la plongée supprimée
    }

    await tx.done;
    console.log(`Plongée avec l'ID ${plongeeId} supprimée de la date ${sheetDate}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la plongée de la base de données :", error);
    throw error;
  }
}

export async function addLastLocation(clientId, location) {
  try {
    const tx = db.transaction('lastLocations', 'readwrite');
    await tx.objectStore('lastLocations').put({ clientId, location });
    await tx.done;
    console.log('Last location added successfully');
  } catch (error) {
    console.error('Error adding last location:', error);
    throw error;
  }
}

export async function getLastLocation(clientId) {
  try {
    const tx = db.transaction('lastLocations', 'readonly');
    const locationData = await tx.objectStore('lastLocations').get(clientId);
    await tx.done;
    return locationData ? locationData.location : null;
  } catch (error) {
    console.error('Error retrieving last location:', error);
    throw error;
  }
}
export async function deleteEntryFromSheet(entryId, sheetDate) {
  try {
    const tx = db.transaction("dailySheets", "readwrite");
    const sheet = await tx.objectStore("dailySheets").get(sheetDate);

    if (sheet && sheet.entries) {
      // Filtre les entrées pour supprimer celle avec entryId
      sheet.entries = sheet.entries.filter(entry => entry.id !== entryId);
      await tx.objectStore("dailySheets").put(sheet); // Mets à jour le dailySheet sans l'entrée supprimée
    }

    await tx.done;
    console.log(`Entrée avec l'ID ${entryId} supprimée de la fiche du ${sheetDate}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entrée de la base de données :", error);
    throw error;
  }
}

export async function closeDB() {
  try {
    if (db) {
      db.close();
      console.log('IndexedDB connection closed');
    }
  } catch (error) {
    console.error('Error closing IndexedDB connection:', error);
  }
}
