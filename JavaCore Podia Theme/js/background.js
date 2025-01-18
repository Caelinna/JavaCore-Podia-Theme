import { darkThemePath, javaCoreThemePath,courseUrlPattern } from './config.js';

// Fonction utilitaire pour injecter les CSS
function injectCSS(tabId, styles) {
    styles.forEach((style) => {
        try {
            chrome.scripting.insertCSS({
                target: { tabId },
                files: [style]
            });
        } catch (error) {
            console.error(`Erreur lors de l'injection du style ${style}:`, error);
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (!tabId) {
        console.error('Erreur : tabId est invalide.');
        return;
    }

    // Vérifie si la page est complètement chargée et correspond à l'URL
    if (changeInfo.status === 'complete' && courseUrlPattern.test(tab.url)) {
        
        // Récupère l'état des préférences
        chrome.storage.sync.get(['darkEnabled'], (result) => {

            if (chrome.runtime.lastError) {
                console.error('Erreur lors de la récupération des préférences :', chrome.runtime.lastError);
                return;
            }

            const stylesToInject = [javaCoreThemePath];
            if (result.darkEnabled) {
                stylesToInject.push(darkThemePath);
            }
            injectCSS(tabId, stylesToInject);
        });
    }
});