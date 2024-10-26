<template>
  <div class="container mx-auto p-10 bg-white">
    <!-- Section des boutons et du titre -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Entrées de Plongée</h1>
        <p class="text-sm text-gray-500">
          Liste des entrées regroupées par appareil, avec détails des clients et des lots.
        </p>
      </div>
      <div class="no-print">
        <button
          @click="startNewDailySheet"
          class="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-500 mr-2"
        >
          Nouvelle Fiche
        </button>
        <button
  v-if="isSheetActive && isCurrentSheet"
  @click="showAddEntryModal = true"
  class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500 mr-2"
>
  Ajouter une entrée
</button>
        <button
          v-if="isSheetActive"
          @click="saveDailySheet"
          class="bg-yellow-600 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-500"
        >
          Sauvegarder la Fiche Actuelle
        </button>
        <!-- Bouton Aperçu avant impression -->
        <button
          @click="printPage"
          class="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-500"
        >
          Aperçu avant impression
        </button>
      </div>
    </div>

    <!-- Table des entrées par appareil -->
    <div v-if="entries.length > 0" class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du Client
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numéro du Client
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emplacement
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Poids Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Détails des Lots
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="(entryGroup, appareil) in groupedEntries" :key="appareil">
            <tr class="bg-gray-100">
              <th colspan="5" class="px-6 py-2 font-semibold text-gray-900 text-left">
                {{ appareil }}
              </th>
            </tr>
            <tr v-for="(entry, index) in entryGroup" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ entry.clientName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ entry.clientNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ entry.emplacement }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ entry.totalWeight }} kg
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <ul>
                  <li v-for="(lot, lotIndex) in entry.lots" :key="lotIndex">
                    Lot {{ lotIndex + 1 }}: {{ lot.weight }} kg
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Historique des fiches sous forme de calendrier -->
    <div class="mt-6 no-print">
      <h2 class="text-lg font-semibold mb-4">Historique des Fiches</h2>
      <vue-cal
        style="height: 400px;"
        :events="formattedHistoryDates"
        @cell-click="loadDailySheetFromCalendar"
        :time="false"
        default-view="month"
        locale="fr"
        :disable-views="['years', 'year', 'week', 'day', 'agenda']"
      />
    </div>

    <!-- Modal pour ajouter une nouvelle entrée -->
    <div
      v-if="showAddEntryModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-semibold mb-4">Ajouter une Nouvelle Entrée</h2>

        <!-- Formulaire pour les informations de la nouvelle entrée -->
        <form @submit.prevent="addEntry" @keydown.enter.prevent>
          <label class="block mb-2">Nom de l'appareil</label>
          <select v-model="newEntry.appareil" class="border rounded w-full p-2 mb-4" required>
            <option value="" disabled>Sélectionner un appareil</option>
            <option v-for="name in allAppareilNames" :key="name" :value="name">{{ name }}</option>
          </select>

          <label class="block mb-2">Nom du client</label>
    <input
      v-model="newEntry.clientName"
      @input="updateClientNumbers"
      type="text"
      class="border rounded w-full p-2 mb-2"
      placeholder="Nom du client"
      required
    />
          <ul v-if="filteredClientNames.length" class="border rounded-md bg-white shadow-md max-h-40 overflow-y-auto mt-1">
            <li
              v-for="client in filteredClientNames"
              :key="client"
              @click="selectClientName(client)"
              class="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ client }}
            </li>
          </ul>

          <label class="block mt-4 mb-2">Numéro du client</label>
          <input
            v-model="newEntry.clientNumber"
            @input="checkForPreviousLocation"
            type="text"
            class="border rounded w-full p-2 mb-2"
            placeholder="Numéro du client"
            required
          />

          <label class="block mt-4 mb-2">Emplacement</label>
          <select v-model="newEntry.emplacement" class="border rounded w-full p-2 mb-4" required>
            <option value="" disabled>Sélectionner un emplacement</option>
            <option v-for="location in parcLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>

          <label class="block mb-2">Poids des lots (kg)</label>
          <div
            v-for="(lot, index) in newEntry.lots"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              v-model.number="lot.weight"
              type="number"
              class="border rounded w-full p-2 lot-input"
              placeholder="Poids en kg"
              @keyup.enter="addLotOnEnter"
            />
            <button
              type="button"
              @click="removeLot(index)"
              class="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Supprimer
            </button>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              @click="showAddEntryModal = false"
              class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      entries: [],
      showAddEntryModal: false,
      isSheetActive: false,
      isCurrentSheet: true,
      lastAppareil: '',
      newEntry: {
        appareil: '',
        clientName: '',
        clientNumber: '',
        emplacement: '',
        lots: [{ weight: 0 }],
      },
      currentDate: null,
      historyDates: [],
      allAppareilNames: [
        'S1',
        'S2',
        'S3',
        'S4',
        'S5',
        'S6',
        'DM1',
        'A1',
        'A2',
        'M1',
        'M2',
        'CH',
        'GL01',
        'GL02',
        'G10',
        'G11',
        'G12',
        'G13',
        'G14',
        'G15',
        'G16',
        'G17',
        'G18',
        'G19',
        'G20',
      ],
      parcLocations: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
      ],
      clientData: {},
      lastLocations: {},
    };
  },
  computed: {
    groupedEntries() {
      return this.entries.reduce((groups, entry) => {
        const { appareil } = entry;
        if (!groups[appareil]) {
          groups[appareil] = [];
        }
        groups[appareil].push(entry);
        return groups;
      }, {});
    },
    formattedHistoryDates() {
      return this.historyDates
        .map((date) => {
          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) return null;
          return {
            start: parsedDate.toISOString().split('T')[0],
            end: parsedDate.toISOString().split('T')[0],
            title: 'Fiche',
          };
        })
        .filter((event) => event !== null);
    },
    filteredClientNames() {
      const input = this.newEntry.clientName.toLowerCase();
      return Object.keys(this.clientData).filter(
        (name) => name.toLowerCase().includes(input) && name.toLowerCase() !== input
      );
    },
    filteredClientNumbers() {
      const clientName = this.newEntry.clientName;
      const clientNumbers = this.clientData[clientName] || [];
      const input = this.newEntry.clientNumber;
      return clientNumbers.filter((num) => num.includes(input) && num !== input);
    },
  },
  methods: {
    printPage() {
      window.print();
    },
    startNewDailySheet() {
      this.entries = [];
      this.isSheetActive = true;
      this.currentDate = new Date().toISOString().split('T')[0];
      this.isCurrentSheet = true;
      this.newEntry.appareil = this.lastAppareil || ''; // Définit l'appareil par défaut
      alert('Nouvelle fiche démarrée pour la date : ' + this.currentDate);
    },
    saveDailySheet() {
      if (!this.currentDate) {
        alert('Aucune fiche en cours. Veuillez démarrer une nouvelle fiche.');
        return;
      }
      const dateKey = this.currentDate;
      localStorage.setItem(dateKey, JSON.stringify(this.entries));
      if (!this.historyDates.includes(dateKey)) {
        this.historyDates.push(dateKey);
        localStorage.setItem('historyDates', JSON.stringify(this.historyDates));
      }
      alert('Fiche sauvegardée pour ' + dateKey);
    },
    loadDailySheetFromCalendar(event) {
  // Utilise toISOString pour obtenir le format souhaité
  const selectedDate = event.toISOString().substring(0, 10);
  if (selectedDate) {
    this.loadDailySheet(selectedDate);
  } else {
    console.error("La date sélectionnée n'est pas valide.");
  }
},
    loadDailySheet(date) {
      const savedEntries = localStorage.getItem(date);
      if (savedEntries) {
        this.entries = JSON.parse(savedEntries);
        this.currentDate = date;
        this.isSheetActive = true;
        this.isCurrentSheet = date === new Date().toISOString().split('T')[0]; // Met à jour isCurrentSheet
      alert('Fiche chargée pour la date : ' + date);
    } else {
      this.isSheetActive = false;
      alert('Aucune fiche trouvée pour cette date.');
    }
    },
    checkForPreviousLocation() {
      const clientName = this.newEntry.clientName;
      const clientNumber = this.newEntry.clientNumber;

      // Vérifie si un emplacement est déjà enregistré pour ce client et ce numéro
      if (this.lastLocations[clientName]?.[clientNumber]) {
        this.newEntry.emplacement = this.lastLocations[clientName][clientNumber];
      }
    },
    addEntry() {
      const validLots = this.newEntry.lots.filter((lot) => lot.weight > 0);
      const totalWeight = validLots.reduce((sum, lot) => sum + lot.weight, 0);

      const entry = {
        appareil: this.newEntry.appareil,
        clientName: this.newEntry.clientName,
        clientNumber: this.newEntry.clientNumber,
        emplacement: this.newEntry.emplacement,
        lots: validLots,
        totalWeight,
      };

      this.lastAppareil = this.newEntry.appareil; // Enregistre l’appareil pour la prochaine entrée
      if (!this.lastLocations[entry.clientName]) {
        this.lastLocations[entry.clientName] = {};
      }
      this.lastLocations[entry.clientName][entry.clientNumber] = entry.emplacement;
      this.entries.push(entry);

      // Réinitialise les valeurs pour la prochaine entrée
      this.newEntry = {
        appareil: this.lastAppareil, // Rétablit l’appareil enregistré
        clientName: '',
        clientNumber: '',
        emplacement: '',
        lots: [{ weight: 0 }],
      };
      this.showAddEntryModal = false;
    },
    updateClientNumbers() {
      const clientName = this.newEntry.clientName;
      if (this.clientData[clientName]) {
        // Les numéros de client seront suggérés
      } else {
        this.newEntry.clientNumber = '';
      }
    },
 
    selectClientName(client) {
      this.newEntry.clientName = client;
      this.updateClientNumbers();
    },
    selectClientNumber(number) {
      this.newEntry.clientNumber = number;
      this.checkForPreviousLocation();
    },
    addLotOnEnter(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Empêche le comportement par défaut
        this.addLot();
      }
    },
    addLot() {
      this.newEntry.lots.push({ weight: 0 });
      nextTick(() => {
        const lotInputs = document.querySelectorAll('.lot-input');
        if (lotInputs.length > 0) {
          // Place le focus sur le dernier champ ajouté
          lotInputs[lotInputs.length - 1].focus();
        }
      });
    },
    removeLot(index) {
      this.newEntry.lots.splice(index, 1);
    },
    loadHistoryDates() {
      const dates = localStorage.getItem('historyDates');
      this.historyDates = dates ? JSON.parse(dates) : [];
    },
  },
  mounted() {
    this.loadHistoryDates();
  },
};
</script>

<style>
@import 'vue-cal/dist/vuecal.css';
/* Styles pour l'impression */
@media print {
  /* Masquer les boutons, calendriers et modaux lors de l'impression */
  .no-print {
    display: none !important;
  }

  /* Utiliser le même style de base que l'affichage */
  .container {
    margin: 0 !important;
    padding: 10px !important;
    width: 100%;
  }

  /* Conserver les couleurs, ombrages et bordures */
  body {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    background-color: #ffffff;
    color: #000000;
    font-family: sans-serif;
  }

  /* Utiliser les mêmes bordures et mise en forme pour le tableau */
  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  table th, table td {
    border: 1px solid #e2e8f0;
    padding: 8px;
    text-align: left;
    background-color: #f9fafb;
  }

  table thead th {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  /* Ombrages et bordures pour le texte de titre */
  h1, h2 {
    margin-top: 0;
    padding-top: 0;
    color: #111827;
    font-weight: bold;
  }
}
</style>
