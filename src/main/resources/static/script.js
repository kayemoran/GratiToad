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
            credentials: "include",
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
        return { success: false, message: 'Network error: Could not connect to server' };
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
        return { success: false, message: 'Could not fetch phrases' };
    }
}

// Funktion för att ta bort en fras
async function deletePhrase(id) {
    if (!confirm('Are you sure you want to delete this phrase?')) {
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
            showMessage('Phrase deleted successfully!', 'success');
        } else {
            const errorMessage = await response.text();
            showMessage(`Error during removal: ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error during phrase removal', 'error');
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

// Funktion för att ladda och visa alla fraser + redigera spara
async function loadAndDisplayPhrases() {
    try {
        const response = await fetch("http://localhost:8080/api/phrases");
        const phrases = await response.json();

        const container = document.getElementById("phrasesContainer");
        container.innerHTML = "";

        phrases.forEach(phrase => {
            const div = document.createElement("div");
            div.classList.add("phrase-item");

            // Lägg till både text, redigerings- och radera-knapp
            div.innerHTML = `
                <p>${phrase.phrase} (Sentiment: ${phrase.value})</p>
                <button class="edit-btn" data-id="${phrase.id}">✏️ Redigera</button>
                <button class="delete-btn" data-id="${phrase.id}">🗑️ Radera</button>
            `;
            container.appendChild(div);
        });

        // Lägg till event listeners för redigering
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => openEditModal(btn.dataset.id));
        });

        // Lägg till event listeners för radering
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                await deletePhrase(btn.dataset.id); // din befintliga delete-funktion
                loadAndDisplayPhrases(); // uppdatera listan efter radering
            });
        });

    } catch (error) {
        console.error("Kunde inte hämta fraser:", error);
    }
}

// Kör funktionen vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    loadAndDisplayPhrases();
});

// Funktion för att visa fraser i HTML
function displayPhrases(phrases, container) {
    if (!Array.isArray(phrases) || phrases.length === 0) {
        container.innerHTML = '<p>No phrases to show.</p>';
        return;
    }

    const html = phrases.map(phrase => `
        <div class="phrase-item" data-id="${phrase.id}">
            <p class="phrase-text">${escapeHtml(phrase.phrase || '')}</p>
            <p class="phrase-sentiment">Value: ${phrase.value || 'N/A'}</p>
            <p class="phrase-user">User: ${phrase.user ? phrase.user.user : 'N/A'}</p>
            <div class="phrase-actions">
                <button onclick="deletePhrase(${phrase.id})" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

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
        showMessage('Kindly write your text', 'error');
        return;
    }

    if (!userSentiment) {
        showMessage('Kindly grade how you feel', 'error');
        return;
    }

    // Visa loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';

    // Skapa phrase object enligt din entity-struktur
    const phraseData = {
        phrase: phrase,              // Matchar din entity
        value: parseInt(userSentiment),  // Matchar din entity
        user: {                      // Skickar User-objekt
            userId: 1               // Sätter till användare 1 (Anna) som standard
        }
    };

    try {
        // Skicka till backend
        const result = await savePhrase(phraseData);

        if (result.success) {
            showMessage('The phrase was saved successfully!', 'success');

            // Rensa formuläret
            textInput.value = '';
            userSentimentSelect.value = '';

            // Uppdatera listan med fraser
            loadAndDisplayPhrases();

            // Visa sentiment resultat
            showSentimentResult(userSentiment);

        } else {
            showMessage(`Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error saving phrase:', error);
        showMessage('An unexpected error occurred', 'error');
    }

    // Återställ knappen
    submitButton.disabled = false;
    submitButton.textContent = 'Share';
});
//Funktion för redigering av fraser
function renderPhrases(phrases) {
    const container = document.getElementById("phrasesContainer");
    container.innerHTML = "";

    phrases.forEach(phrase => {
        const phraseDiv = document.createElement("div");
        phraseDiv.classList.add("phrase-item");
        phraseDiv.innerHTML = `
            <p>${phrase.phrase} <span class="value">(${phrase.value})</span></p>
            <button class="edit-btn" data-id="${phrase.id}">Edit</button>
            <button class="delete-btn" data-id="${phrase.id}">Delete</button>
        `;
        container.appendChild(phraseDiv);
    });

    // Knyt event för redigering
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditModal(btn.dataset.id));
    });

    // Knyt event för radering
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deletePhrase(btn.dataset.id));
    });
}

let currentEditId = null;

function openEditModal(id) {
    fetch(`http://localhost:8080/api/phrases/${id}`)
        .then(res => res.json())
        .then(phrase => {
            currentEditId = phrase.id;
            document.getElementById("editText").value = phrase.phrase;
            document.getElementById("editValue").value = phrase.value;
            document.getElementById("editModal").classList.add("show");
        });
}

// Stäng modal
document.getElementById("closeEditModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.remove("show");
});
document.getElementById("editForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const updatedPhrase = {
        phrase: document.getElementById("editText").value,
        value: parseInt(document.getElementById("editValue").value),
        user: { userId: 1 } // tillfälligt hårdkodat
    };

    const response = await fetch(`http://localhost:8080/api/phrases/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPhrase)
    });

    if (response.ok) {
        alert("Fras uppdaterad!");
        document.getElementById("editModal").classList.remove("show");
        loadAndDisplayPhrases(); // ladda om listan
    } else {
        alert("Något gick fel vid uppdatering.");
    }
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
    const howToUseLink = document.querySelector('a[href="#howToUse"]');
    if (howToUseLink) {
        howToUseLink.addEventListener('click', function(e) {
            e.preventDefault(); // Förhindra default länk-beteende
            showInstructions();
        });
    }
});

//SPA navigation handling
const mainContent = document.getElementById('main-content');
const aboutSection = document.getElementById('about');
aboutSection.style.display = 'none';
const howtouseSection = document.getElementById('how-to-use');
howtouseSection.style.display = 'none';
const favoriteSection = document.getElementById('favorite');
favoriteSection.style.display = 'none';
const contactSection = document.getElementById('contact');
contactSection.style.display = 'none';


function showSection(sectionId) {
    if (sectionId === 'about') {
        aboutSection.style.display = 'block';

        howtouseSection.style.display = 'none';
        mainContent.style.display = 'none';
        favoriteSection.style.display = 'none';
        contactSection.style.display = 'none';
    }
    else if (sectionId === 'how-to-use') {
        howtouseSection.style.display = 'block';

        mainContent.style.display = 'none';
        favoriteSection.style.display = 'none';
        contactSection.style.display = 'none';
    }
    else if (sectionId === 'favorite') {
        aboutSection.style.display = 'none';
        howtouseSection.style.display = 'none';
        mainContent.style.display = 'none';
        contactSection.style.display = 'none';

        favoriteSection.style.display = 'block';
        loadAndDisplayPhrases(); // <-- Ladda fraser när du visar "favorite"
    } else if (sectionId === 'contact') {
        contactSection.style.display = 'block';

        aboutSection.style.display = 'none';
        howtouseSection.style.display = 'none';
        mainContent.style.display = 'none';
        favoriteSection.style.display = 'none';

    } else {
        howtouseSection.style.display = 'none';
        contactSection.style.display = 'none';
        aboutSection.style.display = 'none';
        favoriteSection.style.display = 'none';
        mainContent.style.display = 'block';
    }
}

//Event listeners to side menu links
document.querySelectorAll('.side-menu ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
        closeMenuFunc();
    });
});
showSection('main-content');