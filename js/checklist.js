// checklist.js

import { state } from './state.js';
import { addRelevantNPCs, removeRelevantNPCs } from './npc.js';

export function populateChecklist() {
    if (!state.selectedAdventureData) {
        console.error("populateChecklist: No selected adventure data available.");
        return;
    }

    const plotPoints = state.selectedAdventureData.plotPoints || [];
    const checklist = document.getElementById('checklistItems');
    checklist.innerHTML = '';  // Clear previous content

    plotPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point.name;
        li.classList.add('checklist-item');

        li.addEventListener('click', function () {
            this.classList.toggle('completed');
            if (this.classList.contains('completed')) {
                addRelevantNPCs(point.npcs);
            } else {
                removeRelevantNPCs(point.npcs);
            }
        });

        checklist.appendChild(li);
    });
}

export function clearChecklist() {
    const checklist = document.getElementById('checklistItems');
    checklist.innerHTML = ''; // Clear plot points
}
