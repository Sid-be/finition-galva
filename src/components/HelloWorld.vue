<template>
  <div class="container mx-auto p-4 sm:p-6 md:p-10 bg-white">
    <!-- Section des boutons et du titre -->
    <div class="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
      <div class="text-center sm:text-left">
        <h1 class="text-lg sm:text-xl font-semibold text-gray-900">Entrées de Plongée</h1>
        <p class="text-xs sm:text-sm text-gray-500">
          Liste des entrées regroupées par appareil, avec détails des clients et des lots.
        </p>
      </div>
      <div class="flex flex-wrap justify-center sm:justify-end space-x-1 sm:space-x-2 mt-2 sm:mt-0 no-print">
        <button
          @click="startNewDailySheet"
          class="bg-green-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-green-500"
        >
          Nouvelle Fiche
        </button>
        <button
          v-if="isSheetActive && isCurrentSheet"
          @click="showAddEntryModal = true"
          class="bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-blue-500"
        >
          Ajouter une entrée
        </button>
        <button
          v-if="isSheetActive"
          @click="saveDailySheet"
          class="bg-yellow-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-yellow-500"
        >
          Sauvegarder
        </button>
        <!-- Bouton Aperçu avant impression -->
        <button
          @click="printPage"
          class="bg-purple-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-purple-500"
        >
          Aperçu avant impression
        </button>
      </div>
    </div>

    <!-- Table des entrées par appareil avec défilement horizontal -->
    <div v-if="entries.length > 0" class="mt-6 bg-white shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du Client
            </th>
            <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numéro du Client
            </th>
            <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emplacement
            </th>
            <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Poids Total
            </th>
            <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Détails des Lots
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="(entryGroup, appareil) in groupedEntries" :key="appareil">
            <tr class="bg-gray-100">
              <th colspan="5" class="px-2 py-2 font-semibold text-gray-900 text-left">
                {{ appareil }}
              </th>
            </tr>
            <tr v-for="(entry, index) in entryGroup" :key="index">
              <td class="px-2 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                {{ entry.clientName }}
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                {{ entry.clientNumber }}
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                {{ entry.emplacement }}
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                {{ entry.totalWeight }} kg
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
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
    <div class="mt-6 no-print relative z-0">
      <h2 class="text-lg font-semibold mb-4">Historique des Fiches</h2>
      <vue-cal
        style="height: 400px; z-index: 0;"
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
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print z-50"
    >
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        <h2 class="text-lg font-semibold mb-4">Ajouter une Nouvelle Entrée</h2>

        <!-- Formulaire pour les informations de la nouvelle entrée -->
        <form @submit.prevent="addEntry" @keydown.enter.prevent>
          <label class="block mb-2">Nom de l'appareil</label>
          <select v-model="newEntry.appareil" class="border rounded w-full p-2 mb-4" required>
            <option value="" disabled>Sélectionner un appareil</option>
            <option v-for="name in allAppareilNames" :key="name" :value="name">{{ name }}</option>
          </select>

          <label class="block mb-2">Nom du client</label>
        <div class="relative p-4">
          <div class="absolute bottom-0 left-0 right-0 top-8 bg-slate-900/[0.03] z-0"></div>
          <div class="pointer-events-auto relative z-10 rounded-lg bg-white text-[0.8125rem] leading-5 text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
            <div class="flex items-center px-3.5 py-2.5 text-slate-400">
              <svg class="mr-2 h-5 w-5 stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                v-model="newEntry.clientName"
                @input="filterClients"
                type="text"
                class="bg-transparent outline-none text-slate-700 w-full"
                placeholder="Nom du client"
                required
              />
            </div>

            <!-- Suggestions de clients -->
            <div v-if="filteredClientNames.length" class="border-t border-slate-400/20 px-3.5 py-3">
              <div v-for="client in filteredClientNames" :key="client" @click="selectClientName(client)" class="flex items-center rounded-md p-1.5 cursor-pointer hover:bg-indigo-100 transition">
                <svg class="mr-2.5 h-5 w-5 flex-none stroke-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
                <span>{{ client }}</span>
              </div>
            </div>
          </div>
        </div>

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
import { initDB, addClient, addSheet, getSheet, getClients } from '../db.js';
import { useToast } from 'vue-toastification';
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
      filteredClientNames: [],
      newEntry: {
        appareil: '',
        clientName: '',
        clientNumber: '',
        emplacement: '',
        lots: [{ weight: 0 }],
      },
      currentDate: null,
      historyDates: [],
      allAppareilNames: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'DM1', 'A1', 'A2', 'M1', 'M2', 'CH', 'GL01', 'GL02', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20'],
      parcLocations: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
      clientData: {}, // Liste de tous les clients chargés depuis IndexedDB
      lastLocations: JSON.parse(localStorage.getItem('lastLocations')) || {},
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
      return this.historyDates.map((date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return null;
        return {
          start: parsedDate.toISOString().split('T')[0],
          end: parsedDate.toISOString().split('T')[0],
          title: 'Fiche',
        };
      }).filter((event) => event !== null);
    },
  },
  methods: {
    printPage() {
      window.print();
    },
    async filterClients() {
      const searchInput = this.newEntry.clientName.toLowerCase();
      if (searchInput.length > 1) {
        this.filteredClientNames = Object.keys(this.clientData).filter(clientName => clientName.toLowerCase().includes(searchInput));
      } else {
        this.filteredClientNames = [];
      }
    },
    selectClientName(clientName) {
      this.newEntry.clientName = clientName;
      this.filteredClientNames = [];
      if (this.clientData[clientName]) {
        this.newEntry.clientNumber = this.clientData[clientName][0];
        this.checkForPreviousLocation();
      }
    },
    checkForPreviousLocation() {
      const clientName = this.newEntry.clientName;
      const clientNumber = this.newEntry.clientNumber;
      if (this.lastLocations[clientName]?.[clientNumber]) {
        this.newEntry.emplacement = this.lastLocations[clientName][clientNumber];
      }
    },
    async startNewDailySheet() {
      try {
        await initDB();
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        this.newEntry.appareil = '';
        this.currentSheet = { date: formattedDate, entries: [] };
        this.isSheetActive = true;
        this.isCurrentSheet = true;
        this.entries = [];
        this.toast.success('Nouvelle fiche démarrée pour la date : ' + formattedDate);
      } catch (error) {
        this.toast.error("Erreur d'initialisation de la base de données : " + error);
      }
    },
    async saveDailySheet() {
      if (!this.currentSheet?.date) {
        this.toast.warning('Aucune fiche en cours. Veuillez démarrer une nouvelle fiche.');
        return;
      }
      try {
        await addSheet(this.currentSheet);
        this.toast.success('Fiche sauvegardée pour ' + this.currentSheet.date);
      } catch (error) {
        this.toast.error("Erreur lors de l'enregistrement de la fiche.");
      }
    },
    loadDailySheetFromCalendar(event) {
      const selectedDate = event.toISOString().split('T')[0];
      if (selectedDate) {
        this.loadDailySheet(selectedDate);
      }
    },
    async loadDailySheet(date) {
      getSheet(date, (sheet) => {
        if (sheet) {
          this.currentSheet = sheet;
          this.entries = sheet.entries || [];
          this.isSheetActive = true;
          this.isCurrentSheet = date === new Date().toISOString().split('T')[0];
          this.toast.success('Fiche chargée pour la date : ' + date);
        } else {
          this.isSheetActive = false;
          this.toast.warning('Aucune fiche trouvée pour cette date.');
        }
      });
    },
    addLot() {
      this.newEntry.lots.push({ weight: 0 });
      nextTick(() => {
        const lotInputs = document.querySelectorAll('.lot-input');
        if (lotInputs.length > 0) {
          lotInputs[lotInputs.length - 1].focus();
        }
      });
    },
    addLotOnEnter(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.addLot();
      }
    },
    addEntry() {
      const clientExists = Object.keys(this.clientData).includes(this.newEntry.clientName);
      if (!clientExists) {
        const newClient = { name: this.newEntry.clientName, number: this.newEntry.clientNumber };
        addClient(newClient);
        this.clientData[this.newEntry.clientName] = [this.newEntry.clientNumber];
        this.toast.success(`Client ${newClient.name} ajouté avec succès`);
      }

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

      if (!this.lastLocations[entry.clientName]) {
        this.lastLocations[entry.clientName] = {};
      }
      this.lastLocations[entry.clientName][entry.clientNumber] = entry.emplacement;
      localStorage.setItem('lastLocations', JSON.stringify(this.lastLocations));

      this.entries.push(entry);
      this.currentSheet.entries.push(entry);

      const currentAppareil = this.newEntry.appareil;

      this.newEntry = {
        appareil: currentAppareil,
        clientName: '',
        clientNumber: '',
        emplacement: '',
        lots: [{ weight: 0 }],
      };
      this.showAddEntryModal = false;
    },
    async loadClients() {
      this.clientData = await getClients() || {};
    },
    loadHistoryDates() {
      const dates = localStorage.getItem('historyDates');
      this.historyDates = dates ? JSON.parse(dates) : [];
    },
  },
  async mounted() {
    this.toast = useToast();
    await initDB();
    await this.loadClients();
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