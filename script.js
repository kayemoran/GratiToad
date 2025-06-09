// Menu functionality
const hamburgerMenu = document.getElementById('hamburger-menu');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('active');
    hamburgerMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenuFunc() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    hamburgerMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

hamburgerMenu.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFunc);
menuOverlay.addEventListener('click', closeMenuFunc);

// Close menu when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
        closeMenuFunc();
    }
});

// API Configuration
const API_BASE_URL = 'http://localhost:8080';

// Funktion för att skicka ny fras till backend
async function savePhrase(phraseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/phrases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(phraseData)
        });

        if (response.ok) {
            const message = await response.text();
            console.log('Success:', message);
            return { success: true, message: message };
        } else {
            const errorMessage = await response.text();
            console.error('Error:', errorMessage);
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('Network error:', error);
        return { success: false, message: 'Nätverksfel: Kunde inte ansluta till servern' };
    }
}

// Funktion för att hämta alla fraser från backend
async function getAllPhrases() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/phrases`);

        if (response.ok) {
            const phrases = await response.json();
            return { success: true, data: phrases };
        } else {
            const errorMessage = await response.text();
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('Network error:', error);
        return { success: false, message: 'Kunde inte hämta fraser' };
    }
}

// Funktion för att ta bort en fras
async function deletePhrase(id) {
    if (!confirm('Är du säker på att du vill ta bort denna fras?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/phrases/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Phrase deleted successfully');
            // Ladda om fraser efter borttagning
            loadAndDisplayPhrases();
            showMessage('Frasen togs bort framgångsrikt!', 'success');
        } else {
            const errorMessage = await response.text();
            showMessage(`Fel vid borttagning: ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Nätverksfel vid borttagning av fras', 'error');
    }
}

// Funktion för att visa meddelanden
function showMessage(message, type) {
    // Skapa eller hitta meddelande-element
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.className = 'message-container';
        document.querySelector('.container').appendChild(messageDiv);
    }

    messageDiv.textContent = message;
    messageDiv.className = `message-container ${type}`;
    messageDiv.style.display = 'block';

    // Dölj meddelandet efter 5 sekunder
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 500000);
}

// Funktion för att ladda och visa alla fraser
async function loadAndDisplayPhrases() {
    let phrasesContainer = document.getElementById('phrasesContainer');

    // Skapa container om den inte finns
    if (!phrasesContainer) {
        phrasesContainer = document.createElement('div');
        phrasesContainer.id = 'phrasesContainer';
        phrasesContainer.className = 'phrases-container';
        document.querySelector('.container').appendChild(phrasesContainer);
    }

    const result = await getAllPhrases();

    if (result.success) {
        displayPhrases(result.data, phrasesContainer);
    } else {
        phrasesContainer.innerHTML = `<p class="error">Kunde inte ladda fraser: ${result.message}</p>`;
    }
}
/*
// Funktion för att visa fraser i HTML
function displayPhrases(phrases, container) {
    if (!Array.isArray(phrases) || phrases.length === 0) {
        container.innerHTML = '<p>Inga fraser att visa.</p>';
        return;
    }

    const html = phrases.map(phrase => `
        <div class="phrase-item" data-id="${phrase.id}">
            <p class="phrase-text">${escapeHtml(phrase.phrase || '')}</p>
            <p class="phrase-sentiment">Värde: ${phrase.value || 'N/A'}</p>
            <p class="phrase-user">Användare: ${phrase.user ? phrase.user.user : 'N/A'}</p>
            <div class="phrase-actions">
                <button onclick="deletePhrase(${phrase.id})" class="delete-btn">Ta bort</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}
*/

// Hjälpfunktion för att escapea HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Huvudformulär-hantering
document.getElementById('sentimentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const textInput = document.getElementById('textInput');
    const userSentimentSelect = document.getElementById('userSentiment');
    const submitButton = document.querySelector('.submit-btn');

    const phrase = textInput.value.trim();
    const userSentiment = userSentimentSelect.value;

    // Validera input
    if (!phrase) {
        showMessage('Vänligen skriv in en text', 'error');
        return;
    }

    if (!userSentiment) {
        showMessage('Vänligen välj hur du känner dig', 'error');
        return;
    }

    // Visa loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sparar...';

    // Skapa phrase object enligt din entity-struktur
    const phraseData = {
        phrase: phrase,              // Matchar din entity
        value: parseInt(userSentiment),  // Matchar din entity
        user: {                      // Skickar User-objekt
            user_id: 1               // Sätter till användare 1 (Anna) som standard
        }
    };

    try {
        // Skicka till backend
        const result = await savePhrase(phraseData);

        if (result.success) {
            showMessage('Frasen sparades framgångsrikt!', 'success');

            // Rensa formuläret
            textInput.value = '';
            userSentimentSelect.value = '';

            // Uppdatera listan med fraser
            loadAndDisplayPhrases();

            // Visa sentiment resultat
            showSentimentResult(userSentiment);

        } else {
            showMessage(`Fel: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error saving phrase:', error);
        showMessage('Ett oväntat fel inträffade', 'error');
    }

    // Återställ knappen
    submitButton.disabled = false;
    submitButton.textContent = 'Share';
});

// Funktion för att visa sentiment resultat
function showSentimentResult(userSentiment) {
    const result = document.getElementById('result');
    const resultText = document.getElementById('sentimentResult');

    let resultMessage = '';
    const rating = parseInt(userSentiment);

    if (rating >= 2) {
        resultMessage = `✨ (+${userSentiment})! GratiToad jumps with joy! 🐸💚`;
    } else if (rating === 1) {
        resultMessage = `😊 (+${userSentiment}). GratiToad looks happy! 🐸`;
    } else if (rating === 0) {
        resultMessage = `😐 (${userSentiment}). GratiToad is intrigued 🐸`;
    } else if (rating === -1) {
        resultMessage = `😔 (${userSentiment}). A new anxiety mosquito starts buzzing`;
    } else if (rating <= -2) {
        resultMessage = `😢 (${userSentiment}). A fat anxiety mosquito is flying around`;
    }

    resultText.className = `result-text ${rating >= 0 ? 'positive' : 'negative'}`;
    resultText.innerHTML = resultMessage;
    result.classList.add('show');
}

// Ladda fraser när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    // Ladda befintliga fraser
    loadAndDisplayPhrases();
});