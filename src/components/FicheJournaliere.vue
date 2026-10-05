<template>
  <div class="container mx-auto p-1 sm:p-1 md:p-1 bg-white">
    <div data-dial-init class="fixed right-6 bottom-6 group no-print">
    <!-- Menu des actions -->
    <div v-if="isMenuOpen" id="speed-dial-menu-bottom-right" class="flex flex-col items-center mb-4 space-y-2">
        <!-- Bouton Copier -->
        <div class="relative">
        <button 
          @click="startNewDailySheet" 
          @mouseenter="showTooltipCopy = true" 
          @mouseleave="showTooltipCopy = false" 
          type="button" 
          class="menu-button">
          <svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clip-rule="evenodd"/>
</svg>

        </button>
        <div v-if="showTooltipCopy" class="tooltip">
          Nouvelle fiche
          <div class="tooltip-arrow"></div>
        </div>
      </div>
      <!-- Bouton Partager -->
      <div class="relative">
        <button 
          @click="saveDailySheet" 
          @mouseenter="showTooltipShare = true" 
          @mouseleave="showTooltipShare = false" 
          type="button" 
          class="menu-button">
          <svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm3 11a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6H8v-6Zm1-7V5h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M14 17h-4v-2h4v2Z" clip-rule="evenodd"/>
</svg>


        </button>
        <div v-if="showTooltipShare" class="tooltip">
          Sauvegarder
          <div class="tooltip-arrow"></div>
        </div>
      </div>

      

   

    
      <!-- Bouton Imprimer -->
      <div class="relative">
        <button 
          @click="printPage" 
          @mouseenter="showTooltipPrint = true" 
          @mouseleave="showTooltipPrint = false" 
          type="button" 
          class="menu-button">
          <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z"/>
            <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"/>
          </svg>
        </button>
        <div v-if="showTooltipPrint" class="tooltip">
          Imprimer
          <div class="tooltip-arrow"></div>
        </div>
      </div>
    </div>

    <!-- Bouton principal pour ouvrir/fermer le menu -->
    <button @click="toggleMenu" type="button" class="main-button">
      <svg class="w-5 h-5 transition-transform" :class="{ 'rotate-45': isMenuOpen }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
      </svg>
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
    <div class="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
      <div class="text-center sm:text-left">
        <h1 class="text-lg sm:text-xl font-semibold text-gray-900">Fiche de finition</h1>
        <p class="text-xs sm:text-sm text-gray-500">Liste des entrées regroupées par appareil, avec détails des clients et des lots.</p>
      </div>
      <div class="flex flex-wrap justify-center sm:justify-end space-x-1 sm:space-x-2 mt-2 sm:mt-0 no-print">
       <!--  <button @click="startNewDailySheet" class="bg-green-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-green-500">Nouvelle Fiche</button> -->
        <button v-if="isSheetActive && isCurrentSheet" @click="showAddEntryModal = true" class="bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-blue-500">Ajouter une entrée</button>
      <!--   <button v-if="isSheetActive" @click="saveDailySheet" class="bg-yellow-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-yellow-500">Sauvegarder</button>
        <button @click="printPage" class="bg-purple-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-medium hover:bg-purple-500">Aperçu avant impression</button>-->
      </div> 
    </div>

    <div v-if="entries.length > 0" class="mt-6 bg-white shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          
          <tr>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Numéro de plongée</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Nom du Client</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Numéro du Client</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Emplacement</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Poids Total</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider">Détails des Lots</th>
            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 capitalize tracking-wider no-print"></th>
            
         
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
    <template v-for="(entryGroup, appareil) in groupedEntries" :key="appareil">
      <tr class="bg-gray-100">
        <th colspan="7" class="px-2 py-1 font-semibold text-gray-900 text-left">{{ appareil }}</th>
        
      </tr>
      <tr v-for="(entry, index) in entryGroup" :key="entry.id">
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm font-medium text-gray-900">{{ entryGroup[0].appareilNumber }}</td>
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm font-medium text-gray-900">{{ entry.clientName }}</td>
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm text-gray-500">{{ entry.clientNumber }}</td>
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm text-gray-500">{{ entry.emplacement }}</td>
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm text-gray-500">{{ entry.totalWeight }} kg</td>
        <td class="px-2 py-1 whitespace-nowrap text-left text-xs sm:text-sm text-gray-500">
          <ul>
            <li v-for="(lot, lotIndex) in entry.lots" :key="lotIndex">Lot {{ lotIndex + 1 }}: {{ lot.weight }} kg</li>
          </ul>
        </td>
        <td class="px-2 py-1 whitespace-nowrap text-xs sm:text-sm no-print">
          <button @click="editEntry(entry)" class="">
            <svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6b7280" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
</svg>
</button>
          <button @click="deleteEntry(index, entry.id)" class=""><svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6b7280" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
</svg>
</button>
        </td>
      </tr>
    </template>
  </tbody>
      </table>
    </div>
   <!-- Calendar History -->
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
    <div v-if="showAddEntryModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 no-print z-50">
      <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        <h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Modifier l\'Entrée' : 'Ajouter une Nouvelle Entrée' }}</h2>
        <form @submit.prevent="isEditing ? saveEditedEntry() : addEntry()">
          <label class="block mb-2">Nom de l'appareil</label>
          <select v-model="newEntry.appareil" class="border rounded w-full p-2 mb-4" required>
            <option value="" disabled>Sélectionner un appareil</option>
            <option v-for="name in allAppareilNames" :key="name" :value="name">{{ name }}</option>
          </select>
          <label class="block text-sm font-medium text-slate-700 mb-2">Nom du client</label>

<!-- Champ de saisie pour le nom du client -->
<input 
  v-model="newEntry.clientName" 
  type="text" 
  class="pointer-events-auto w-full rounded-lg bg-white text-sm leading-5 text-slate-700 shadow-md ring-1 ring-slate-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 mb-2"
  placeholder="Nom du client" 
  required 
  @input="filterClients" 
/>

<!-- Liste des suggestions -->
<div v-if="filteredClientNames.length > 0" class="relative w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
  <ul class="divide-y divide-gray-200">
    <li 
      v-for="name in filteredClientNames" 
      :key="name" 
      @click="selectClientName(name)" 
      class="flex items-center p-2 text-slate-700 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors duration-200"
    >
      <svg class="mr-2.5 h-5 w-5 flex-none stroke-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      {{ name }}
    </li>
  </ul>
</div>
          <label class="block mt-4 mb-2">Numéro du client</label>
          <input v-model="newEntry.clientNumber" type="text" class="border rounded w-full p-2 mb-2" placeholder="Numéro du client" required />
          <label class="block mt-4 mb-2">Emplacement</label>
          <select v-model="newEntry.emplacement" class="border rounded w-full p-2 mb-4" required>
            <option value="" disabled>Sélectionner un emplacement</option>
            <option v-for="location in parcLocations" :key="location" :value="location">{{ location }}</option>
          </select>
          <label class="block mb-2">Poids des lots (kg)</label>
        <div v-for="(lot, index) in newEntry.lots" :key="index" class="flex items-center mb-2">
          <input 
            v-model.number="lot.weight" 
            type="number" 
            class="lot-input border rounded w-full p-2" 
            placeholder="Poids en kg" 
            @keydown.enter.prevent="addLot" 
          />
          <button type="button" @click="removeLot(index)" class="ml-2 bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
        </div>
        
        <button type="button" @click="addLot" class="bg-green-500 text-white px-4 py-1 rounded mb-4">Ajouter un Lot</button>
        <div class="flex justify-end">
          <button type="button" @click="showAddEntryModal = false" class="bg-gray-500 text-white px-4 py-1 rounded mr-2">Annuler</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-1 rounded">{{ isEditing ? 'Sauvegarder' : 'Ajouter' }}</button>
        </div>
        </form>
      </div>
    </div>
  </div>
  <div data-dial-init class="fixed right-6 bottom-6 group no-print">
    <!-- Menu des actions -->
    <div v-if="isMenuOpen" id="speed-dial-menu-bottom-right" class="flex flex-col items-center mb-4 space-y-2">
        <!-- Bouton Copier -->
        <div class="relative">
        <button 
          @click="startNewDailySheet" 
          @mouseenter="showTooltipCopy = true" 
          @mouseleave="showTooltipCopy = false" 
          type="button" 
          class="menu-button">
          <svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clip-rule="evenodd"/>
</svg>

        </button>
        <div v-if="showTooltipCopy" class="tooltip">
          Nouvelle fiche
          <div class="tooltip-arrow"></div>
        </div>
      </div>
      <!-- Bouton Partager -->
      <div class="relative">
        <button 
          @click="saveDailySheet" 
          @mouseenter="showTooltipShare = true" 
          @mouseleave="showTooltipShare = false" 
          type="button" 
          class="menu-button">
          <svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm3 11a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6H8v-6Zm1-7V5h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M14 17h-4v-2h4v2Z" clip-rule="evenodd"/>
</svg>


        </button>
        <div v-if="showTooltipShare" class="tooltip">
          Sauvegarder
          <div class="tooltip-arrow"></div>
        </div>
      </div>

      

   

    
      <!-- Bouton Imprimer -->
      <div class="relative">
        <button 
          @click="printPage" 
          @mouseenter="showTooltipPrint = true" 
          @mouseleave="showTooltipPrint = false" 
          type="button" 
          class="menu-button">
          <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z"/>
            <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z"/>
          </svg>
        </button>
        <div v-if="showTooltipPrint" class="tooltip">
          Imprimer
          <div class="tooltip-arrow"></div>
        </div>
      </div>
    </div>

    <!-- Bouton principal pour ouvrir/fermer le menu -->
    <button @click="toggleMenu" type="button" class="main-button">
      <svg class="w-5 h-5 transition-transform" :class="{ 'rotate-45': isMenuOpen }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
      </svg>
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
</template>

<script>
import { initDB, deleteEntryFromSheet, addClient, addSheet, getSheet, getAllSheets, getClients, addLastLocation, getLastLocation,deleteSheetEntry } from '../db.js';

import { useToast } from 'vue-toastification';
import { nextTick } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { PrintWebview } from 'capacitor-print-webview';


export default {
  name: 'FicheJournaliere',
  components: { VueCal },
  data() {
    return {
      isMenuOpen: false,
      showTooltipShare: false,
      showTooltipPrint: false,
      showTooltipDownload: false,
      showTooltipCopy: false,
      
      entries: [],
      appareilNumbers: {}, // Associe chaque nom d'appareil à son numéro
      nextAppareilNumber: 1,
      autoSaveInterval: null,
      showAddEntryModal: false,
      isSheetActive: false,
      isCurrentSheet: true,
      filteredClientNames: [],
      newEntry: { appareil: '', clientName: '', clientNumber: '', emplacement: '', lots: [{ weight: 0 }] },
      currentDate: null,
      historyDates: [],
      allAppareilNames: ['H10', 'H11', 'H12','H13', 'H14', 'H15','H16', 'H17', 'H18','H19', 'H20', 'H21','H22', 'H23', 'H24', 'H25', 'H26','H27', 'H28', 'H29','H30','ZC','CAM','S1', 'S2', 'S3', 'S4', 'S5', 'S6' ,'S7', 'S8', 'S9' ,'S10','S10', 'DM1', 'A1', 'A2', 'M1', 'M2', 'CH', 'GL01', 'GL02', 'G10', 'G11', 'G12','G13', 'G14', 'G15','G16', 'G17', 'G18','G19', 'G20', 'G21','G22', 'G23', 'G24', 'G25', 'G26','G27', 'G28', 'G29','G30'],
      parcLocations: ['Ap-A', 'Ap-B', 'Ap-C', 'Ap-D','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','H-A1', 'H-A2', 'H-A3', 'H-A4', 'H-A5', 'H-A6', 'H-B1', 'H-B2', 'H-B3', 'H-B4', 'H-B5', 'H-B6', 'H-C1', 'H-C2', 'H-C3', 'H-C4', 'H-C5', 'H-C6', 'H-D1', 'H-D2', 'H-D3', 'H-D4', 'H-D5', 'H-D6'],
      clientData: {},
    };
  },
  computed: {
    groupedEntries() {
    // Exemple de regroupement par appareil
    return this.entries.reduce((groups, entry) => {
      const { appareil } = entry;
      if (!groups[appareil]) groups[appareil] = [];
      groups[appareil].push(entry);
      return groups;
    }, {});
  },
  formattedHistoryDates() {
  return this.historyDates.map(date => {
    const localDate = new Date(date);
    const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    return { start: formattedDate, end: formattedDate, title: 'Fiche' };
  });
},
  },
  methods: {
    async printPage() {
  try {
    await PrintWebview.print();
  } catch (error) {
    console.error("Erreur lors de l'impression :", error);
  }
},
  
  
  toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    removeLot(index) {
      // Vérifie que l'index est valide
      if (index >= 0 && index < this.newEntry.lots.length) {
        this.newEntry.lots.splice(index, 1); // Supprime le lot à l'index spécifié
      }
    },
    async deleteEntry(index, entryId) {
      if (index >= 0 && index < this.entries.length) {
        const appareil = this.entries[index].appareil;
        const sheetDate = this.currentSheet.date;
        this.entries.splice(index, 1);
        this.currentSheet.entries = this.entries;

        try {
          // Supprimer l'entrée de la base de données
          await deleteEntryFromSheet(entryId, sheetDate);
          this.toast.success("Entrée supprimée avec succès.");

          if (!this.entries.some(entry => entry.appareil === appareil)) {
            delete this.appareilNumbers[appareil];
            this.recalculateAppareilNumbers(); // Recalculer après suppression
          }

          // Si la fiche est maintenant vide, la supprimer entièrement
          if (this.entries.length === 0) {
            await this.deleteSheet(sheetDate);
            this.currentSheet = null;
            this.isSheetActive = false;
            this.toast.info("La fiche est vide et a été supprimée.");
          }
        } catch (error) {
          this.toast.error("Erreur lors de la suppression de l'entrée ou de la fiche de la base de données.");
          console.error("Erreur lors de la suppression de l'entrée ou de la fiche de la base de données :", error);
        }
      } else {
        this.toast.error("Erreur : impossible de supprimer l'entrée.");
      }
    },

    recalculateAppareilNumbers() {
      this.nextAppareilNumber = 1;
      const newAppareilNumbers = {};

      // Réassigne des numéros séquentiels aux appareils restants
      this.entries.forEach(entry => {
        if (!newAppareilNumbers[entry.appareil]) {
          newAppareilNumbers[entry.appareil] = this.nextAppareilNumber++;
        }
        entry.appareilNumber = newAppareilNumbers[entry.appareil];
      });

      this.appareilNumbers = newAppareilNumbers;
    },

  async deleteSheet(sheetDate) {
    try {
      await deleteSheetEntry(sheetDate);
      this.toast.success("Fiche supprimée avec succès.");
    } catch (error) {
      this.toast.error("Erreur lors de la suppression de la fiche.");
      console.error("Erreur lors de la suppression de la fiche :", error);
    }
  },
    editEntry(entry) {
      console.log(entry)
    if (!entry) {
      console.error("L'entrée à éditer est indéfinie ou nulle.");
      this.toast.error("Erreur : l'entrée sélectionnée est invalide.");
      return;
    }
    
    // Si `entry` est défini, effectuer une copie profonde pour éviter toute modification accidentelle
    this.newEntry = JSON.parse(JSON.stringify(entry));
    this.isEditing = true;
    this.showAddEntryModal = true; // Ouvre la modale d'édition
  },
  
  saveEditedEntry() {
  // Recalculer le poids total basé sur les lots mis à jour
  const validLots = this.newEntry.lots.filter(lot => lot.weight > 0);
  const totalWeight = validLots.reduce((sum, lot) => sum + lot.weight, 0);
  this.newEntry.totalWeight = totalWeight;

  // Trouver l'index de l'entrée actuelle dans `entries`
  const entryIndex = this.entries.findIndex(
    e => e.clientName === this.newEntry.clientName && e.clientNumber === this.newEntry.clientNumber
  );

  if (entryIndex !== -1) {
    // Mettre à jour l'entrée modifiée dans `entries` et `currentSheet`
    this.entries[entryIndex] = JSON.parse(JSON.stringify(this.newEntry));
    this.currentSheet.entries[entryIndex] = this.entries[entryIndex];

    // Réinitialiser les variables d'état
    this.isEditing = false;
    this.newEntry = { appareil: '', clientName: '', clientNumber: '', emplacement: '', lots: [{ weight: 0 }] };
    this.showAddEntryModal = false;

    this.toast.success('Entrée mise à jour avec succès.');
  } else {
    this.toast.error("Erreur : l'entrée n'a pas été trouvée dans la liste.");
  }
},

  cancelEdit() {
    // Réinitialiser l'état d'édition
    this.isEditing = false;
    this.newEntry = { appareil: '', clientName: '', clientNumber: '', emplacement: '', lots: [{ weight: 0 }] };
    this.showAddEntryModal = false;
  },
    filterClients() {
      const searchInput = this.newEntry.clientName.toLowerCase();
      this.filteredClientNames = searchInput.length > 1
        ? Object.keys(this.clientData).filter(clientName => clientName.toLowerCase().includes(searchInput))
        : [];
    },
    selectClientName(clientName) {
      this.newEntry.clientName = clientName;
      this.filteredClientNames = [];
      if (this.clientData[clientName]) {
        this.newEntry.clientNumber = this.clientData[clientName][0];
        this.checkForPreviousLocation();
      }
    },
    async checkForPreviousLocation() {
      const { clientName, clientNumber } = this.newEntry;
      const clientId = `${clientName}-${clientNumber}`;
      const lastLocation = await getLastLocation(clientId);
      if (lastLocation) {
        this.newEntry.emplacement = lastLocation;
      }
    },
    getLocalDateString(dateInput = new Date()) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 1 à 12
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
    async startNewDailySheet() {
      this.$emit('start-new-sheet');
  try {
    await initDB();
    const formattedDate = this.getLocalDateString(); // Utiliser la date locale

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
    this.$emit('save-sheet');
      if (!this.currentSheet?.date) {
        this.toast.warning('Aucune fiche en cours. Veuillez démarrer une nouvelle fiche.');
        return;
      }
      try {
        const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const sheetClone = { ...this.currentSheet, date: formattedDate };
    await addSheet(sheetClone);
        await this.loadHistoryDates();
        this.toast.success('Sauvegarde automatique réussie pour la date : ' + this.currentSheet.date);
      } catch (error) {
        this.toast.error("Erreur lors de la sauvegarde automatique.");
        console.error("Erreur lors de la sauvegarde incrémentielle :", error);
      }
    },
    loadDailySheetFromCalendar(event) {
  const selectedDate = this.getLocalDateString(new Date(event));
  if (selectedDate) {
    this.loadDailySheet(selectedDate);
  }
},

  async loadDailySheet(date) {
  try {
    // Utilise la date passée en paramètre pour formater en date locale
    const formattedDate = this.getLocalDateString(new Date(date));

    const sheet = await getSheet(formattedDate);

    if (sheet) {
      this.currentSheet = sheet;
      this.entries = sheet.entries || [];
      this.isSheetActive = true;
      this.isCurrentSheet = formattedDate === this.getLocalDateString(new Date());
      this.toast.success('Fiche chargée pour la date : ' + formattedDate);
    } else {
      this.currentSheet = null;
      this.entries = [];
      this.isSheetActive = false;
      this.isCurrentSheet = false;
      this.toast.warning('Aucune fiche enregistrée pour cette date.');
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la fiche : ", error);
    this.toast.error("Une erreur est survenue lors du chargement de la fiche.");
  }
},
    addLot() {
      this.newEntry.lots.push({ weight: 0 });
      nextTick(() => {
        const lotInputs = document.querySelectorAll('.lot-input');
        if (lotInputs.length > 0) lotInputs[lotInputs.length - 1].focus();
      });
    },
   
    async addEntry() {
      let appareilNumber;
      if (this.appareilNumbers[this.newEntry.appareil] !== undefined) {
    // Si l'appareil existe déjà, utilise son numéro
    appareilNumber = this.appareilNumbers[this.newEntry.appareil];
  } else {
    // Si l'appareil est nouveau, assigne le prochain numéro et incrémente
    appareilNumber = this.nextAppareilNumber++;
    this.appareilNumbers[this.newEntry.appareil] = appareilNumber;
  }
    const clientExists = Object.keys(this.clientData).includes(this.newEntry.clientName);
    if (!clientExists) {
      const newClient = { name: this.newEntry.clientName, number: this.newEntry.clientNumber };
      addClient(newClient);
      this.clientData[this.newEntry.clientName] = [this.newEntry.clientNumber];
      this.toast.success(`Client ${newClient.name} ajouté avec succès`);
    }

    const validLots = this.newEntry.lots.filter(lot => lot.weight > 0);
    const totalWeight = validLots.reduce((sum, lot) => sum + lot.weight, 0);
    const entry = {
      appareilNumber,
      appareil: this.newEntry.appareil,
      clientName: this.newEntry.clientName,
      clientNumber: this.newEntry.clientNumber,
      emplacement: this.newEntry.emplacement,
      lots: validLots,
      totalWeight,
    };
    const clientId = `${entry.clientName}-${entry.clientNumber}`;
    await addLastLocation(clientId, entry.emplacement);
    // Ajout de l'entrée dans la fiche courante uniquement, pas dans les sauvegardes
    this.entries.push(entry);
    this.currentSheet.entries = this.entries;  // mettre à jour la fiche courante sans duplication
    
    // Remettre l'entrée par défaut pour un nouvel ajout
    this.recalculateAppareilNumbers(); // Actualise les numéros des appareils


    const currentAppareil = this.newEntry.appareil;
    this.newEntry = { appareil: currentAppareil, clientName: '', clientNumber: '', emplacement: '', lots: [{ weight: 0 }] };
    this.showAddEntryModal = false;
  },
  async loadClients() {
      const clients = await getClients();
      if (clients) {
        this.clientData = clients.reduce((acc, client) => {
          acc[client.name] = client.number;
          return acc;
        }, {});
      }
    },
    async loadHistoryDates() {
      // Les fiches sont stockees dans IndexedDB. On lit donc la source reelle,
      // et non plus localStorage qui n'est plus alimente depuis la migration.
      try {
        const sheets = await getAllSheets();
        this.historyDates = sheets.map((sheet) => sheet.date).filter(Boolean);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique des fiches :", error);
        this.historyDates = [];
      }
    },
    async loadTodaySheet() {
    const today = new Date();
    // Formatter la date en AAAA-MM-JJ pour la recherche
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await this.loadDailySheet(formattedDate);
  },
  },
  async mounted() {
    nextTick(() => {
      const calendarElement = document.querySelector('.vuecal');
      if (calendarElement) {
        calendarElement.style.zIndex = '1';
      }
    });
  

    this.toast = useToast();
    await initDB();
    await this.loadClients();
    await this.loadHistoryDates();
    await this.loadTodaySheet();
    this.autoSaveInterval = setInterval(() => {
      if (this.isSheetActive) {
        this.saveDailySheet();
      }
    }, 300000);
  },
  beforeUnmount() {
    // Nettoyer l'intervalle lors de la destruction du composant
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }
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
  /* Conteneur principal */
  .container, .min-h-screen {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
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
.main-button {
  
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #5b5959;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  transition: background-color 0.3s;
  z-index: 50;

}
.main-button:hover {
  background-color: #2e2e2e;
}
.rotate-45 {
  transform: rotate(45deg);
}

/* Boutons du menu */
.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  color: #6b7280;
  border-radius: 50%;
  background-color: #e5e5e5;
  border: 1px solid #d1d5db;
  transition: background-color 0.3s, color 0.3s;
  z-index: 50;
}
.menu-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

/* Icônes */
.icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}
.tooltip {
  position: absolute;
  bottom: 50%; /* Centre verticalement le tooltip par rapport au bouton */
  right: 110%; /* Place le tooltip à gauche du bouton */
  transform: translateY(50%); /* Ajuste l'alignement vertical */
  padding: 0.5rem;
  background-color: #1f2937;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  opacity: 0.9;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.3s ease;
  z-index: 60;
}

.tooltip-arrow {
  position: absolute;
  top: 40%; /* Centre verticalement la flèche par rapport au tooltip */
  right: 3px; /* Positionne la flèche à droite du bord droit du tooltip */
  transform: translateY(-50%); /* Ajuste pour un centrage parfait */
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #1f2937;
  z-index: 60; /* Assurez-vous que la couleur correspond au fond du tooltip */
}
</style>