import { darkThemePath } from './config.js';

document.addEventListener('DOMContentLoaded', () => {

    const darkToggle = document.getElementById('dark-css');

    // Vérifie si le toggle existe
    if (!darkToggle) {
        console.error('Erreur : #dark-css introuvable dans le DOM.');
        return;
    }

    // Charge les préférences depuis chrome.storage pour savoir si le style est activé
    chrome.storage.sync.get(['darkEnabled'], (result) => {
        darkToggle.checked = result.darkEnabled || false;
    });

    // Écoute le changement sur le toggle et met à jour les préférences
    darkToggle.addEventListener('change', () => {
        const isEnabled = darkToggle.checked;
        chrome.storage.sync.set({ darkEnabled: isEnabled });

        toggleCSS(darkThemePath, isEnabled);
    });
    
    

    // Fonction pour injecter ou retirer un style CSS
    function toggleCSS(cssFile, enable) {
        // Recherche l'onglet actif
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            // Gestion des erreurs liées à tabs.query
            if (chrome.runtime.lastError) {
                console.error('Erreur dans chrome.tabs.query :', chrome.runtime.lastError);
                return;
            }

            const tab = tabs[0];
            if (!tab) {
                console.error('Aucun onglet actif trouvé.');
                return;
            }

            try {
                const action = enable ? chrome.scripting.insertCSS : chrome.scripting.removeCSS;
                action({
                    target: { tabId: tab.id },
                    files: [cssFile]  
                });
            }
            catch (error) {
                console.error(`Erreur lors de l${enable ? "'injection" : "a suppression"} du style : ${cssFile}`, error);
            }
        });
    }
});
