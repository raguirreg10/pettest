// Data Management
let pets = [];
const API_URL = '/api/pets';

// DOM Elements
const petsGrid = document.getElementById('pets-grid');
const emptyState = document.getElementById('empty-state');
const addBtn = document.getElementById('add-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const petForm = document.getElementById('pet-form');
const modalTitle = document.getElementById('modal-title');

// Form Inputs
const idInput = document.getElementById('pet-id');
const nameInput = document.getElementById('pet-name');
const speciesInput = document.getElementById('pet-species');
const ageInput = document.getElementById('pet-age');
const aptDateInput = document.getElementById('pet-apt-date');
const aptReasonInput = document.getElementById('pet-apt-reason');
const aptReasonGroup = document.getElementById('pet-apt-reason-group');

// Show/hide reason dropdown based on date selection
aptDateInput.addEventListener('change', () => {
    if (aptDateInput.value) {
        aptReasonGroup.style.display = 'block';
    } else {
        aptReasonGroup.style.display = 'none';
        aptReasonInput.value = 'Not Specified';
    }
});

// Helper to generate a random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Function to determine pet icon based on species
function getPetIcon(species) {
    const s = species.toLowerCase();
    if (s.includes('dog') || s.includes('puppy')) return 'fa-dog';
    if (s.includes('cat') || s.includes('kitten')) return 'fa-cat';
    if (s.includes('bird') || s.includes('parrot')) return 'fa-dove';
    if (s.includes('fish')) return 'fa-fish';
    if (s.includes('horse')) return 'fa-horse';
    if (s.includes('spider')) return 'fa-spider';
    if (s.includes('frog')) return 'fa-frog';
    if (s.includes('dragon')) return 'fa-dragon';
    if (s.includes('bug') || s.includes('insect')) return 'fa-bug';
    return 'fa-paw';
}

// Fetch Pets from SQLite API
async function fetchPets() {
    try {
        const response = await fetch(API_URL);
        pets = await response.json();
        renderPets();
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
}

// Render Pets
function renderPets() {
    petsGrid.innerHTML = '';
    
    if (pets.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        pets.forEach((pet, index) => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            // Slight staggered animation delay for a dynamic feel
            petCard.style.animationDelay = `${index * 0.05}s`;
            
            petCard.innerHTML = `
                <div class="pet-header">
                    <div class="pet-avatar">
                        <i class="fas ${getPetIcon(pet.species)}"></i>
                    </div>
                    <div class="pet-actions">
                        <button class="icon-btn edit-btn" data-id="${pet.id}" aria-label="Edit pet" title="Edit Pet">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete delete-btn" data-id="${pet.id}" aria-label="Delete pet" title="Delete Pet">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <p><i class="fas fa-info-circle"></i> ${pet.species}</p>
                </div>
                ${pet.appointment_date ? `
                <div class="pet-appointment">
                    <div class="apt-date"><i class="fas fa-calendar-check"></i> ${new Date(pet.appointment_date).toLocaleDateString()}</div>
                    <div class="apt-reason">${pet.appointment_reason || 'Checkup'}</div>
                </div>
                ` : ''}
                <div class="pet-meta">
                    <span class="badge"><i class="fas fa-birthday-cake"></i> ${pet.age} year${pet.age == 1 ? '' : 's'} old</span>
                </div>
            `;
            petsGrid.appendChild(petCard);
        });

        // Add Event Listeners for Edit and Delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => editPet(e.currentTarget.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deletePet(e.currentTarget.dataset.id));
        });
    }
}

// Open Modal for Add
function openAddModal() {
    modalTitle.textContent = 'Add New Pet';
    petForm.reset();
    idInput.value = '';
    aptReasonGroup.style.display = 'none';
    modalBackdrop.classList.remove('hidden');
    setTimeout(() => nameInput.focus(), 100);
}

// Open Modal for Edit
function editPet(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;
    
    modalTitle.textContent = 'Edit Pet';
    idInput.value = pet.id;
    nameInput.value = pet.name;
    speciesInput.value = pet.species;
    ageInput.value = pet.age;
    
    if (pet.appointment_date) {
        aptDateInput.value = pet.appointment_date;
        aptReasonInput.value = pet.appointment_reason || 'Not Specified';
        aptReasonGroup.style.display = 'block';
    } else {
        aptDateInput.value = '';
        aptReasonInput.value = 'Not Specified';
        aptReasonGroup.style.display = 'none';
    }
    
    modalBackdrop.classList.remove('hidden');
    setTimeout(() => nameInput.focus(), 100);
}

// Close Modal
function closeModal() {
    modalBackdrop.classList.add('hidden');
}

// Add/Update Pet
petForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const petData = {
        name: nameInput.value.trim(),
        species: speciesInput.value.trim(),
        age: parseInt(ageInput.value, 10),
        appointment_date: aptDateInput.value || null,
        appointment_reason: aptDateInput.value ? aptReasonInput.value : null
    };
    
    // Auto-capitalize species (e.g. "dog" -> "Dog")
    if (petData.species) {
        petData.species = petData.species.charAt(0).toUpperCase() + petData.species.slice(1);
    }
    
    const id = idInput.value;
    
    try {
        if (id) {
            // Update existing pet
            petData.id = id;
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
        } else {
             // Add new pet
            petData.id = generateId();
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
        }
        await fetchPets();
        closeModal();
    } catch (error) {
        console.error('Error saving pet:', error);
        alert('Failed to save pet. Check console for details.');
    }
});

// Delete Pet
async function deletePet(id) {
    if (confirm('Are you sure you want to remove this lovely pet?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            await fetchPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
            alert('Failed to delete pet.');
        }
    }
}

// Migrate local storage
async function migrateLocalStorage() {
    const localPets = JSON.parse(localStorage.getItem('pets')) || [];
    if (localPets.length > 0) {
        // Only migrate if we don't have any pets in the database yet
        const response = await fetch(API_URL);
        const dbPets = await response.json();
        
        if (dbPets.length === 0) {
            console.log("Migrating", localPets.length, "pets from local storage to SQLite");
            for (const pet of localPets) {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pet)
                });
            }
        }
        // Clear local storage to prevent duplicate migrations next time if DB gets cleared
        localStorage.removeItem('pets');
    }
}


// Event Listeners
addBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on backdrop click
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
        closeModal();
    }
});

// Initial Render
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we need to migrate from local storage first
    await migrateLocalStorage();
    // Then fetch and render
    await fetchPets();
});
