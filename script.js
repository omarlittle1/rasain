// --- 1. TEMA / DARK MODE LOGIC ---
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// --- 2. PENCARIAN & FILTER LOGIC ---
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
let currentCategory = 'all';
let searchQuery = '';

function filterMenu() {
    const menuCards = document.querySelectorAll('.menu-card');
    let visibleCardsCount = 0;

    menuCards.forEach(card => {
        const name = card.getAttribute('data-name');
        const category = card.getAttribute('data-category');
        const matchesSearch = name.includes(searchQuery);
        const matchesCategory = currentCategory === 'all' || category === currentCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCardsCount++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('noMatchMessage').classList.toggle('hidden', visibleCardsCount > 0);
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterMenu();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('bg-amber-700', 'text-white'));
        filterButtons.forEach(b => b.classList.add('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-600', 'dark:text-neutral-300'));
        e.target.classList.remove('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-600', 'dark:text-neutral-300');
        e.target.classList.add('bg-amber-700', 'text-white');
        currentCategory = e.target.getAttribute('data-category');
        filterMenu();
    });
});

// --- 3. MODAL DETAIL RESEP POP-UP ---
const modal = document.getElementById('recipeModal');
function openModal(title, description, imgSrc) {
    document.getElementById('modalTitle').innerText = decodeURIComponent(title);
    document.getElementById('modalDescription').innerText = decodeURIComponent(description);
    const imgEl = document.getElementById('modalImage');
    
    if (imgSrc) { 
        imgEl.src = imgSrc; 
        imgEl.style.display = 'block'; 
    } else { 
        imgEl.style.display = 'none'; 
    }

    modal.classList.remove('hidden'); 
    modal.classList.add('flex');
    setTimeout(() => { 
        modal.classList.remove('opacity-0'); 
        modal.querySelector('.transform').classList.remove('scale-95'); 
    }, 10);
}

function closeModal() {
    modal.classList.add('opacity-0'); 
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => { 
        modal.classList.remove('flex'); 
        modal.classList.add('hidden'); 
    }, 300);
}

// --- 4. MODAL INPUT RESEP BARU ---
const addModal = document.getElementById('addRecipeModal');
function openAddRecipeModal() {
    addModal.classList.remove('hidden'); 
    addModal.classList.add('flex');
    setTimeout(() => { 
        addModal.classList.remove('opacity-0'); 
        addModal.querySelector('.transform').classList.remove('scale-95'); 
    }, 10);
}

function closeAddRecipeModal() {
    addModal.classList.add('opacity-0'); 
    addModal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => { 
        addModal.classList.remove('flex'); 
        addModal.classList.add('hidden'); 
    }, 300);
    document.getElementById('recipeForm').reset();
}

// --- 5. LOGIKA SIMPAN RESEP BARU DENGAN UPLOAD FOTO ---
function saveRecipe(e) {
    e.preventDefault();
    const title = document.getElementById('formTitle').value;
    const category = document.getElementById('formCategory').value;
    const desc = document.getElementById('formDesc').value;
    const ingredients = document.getElementById('formIngredients').value;
    const steps = document.getElementById('formSteps').value;
    const imageFile = document.getElementById('formImage').files[0];

    if (!imageFile) {
        alert("Harap unggah foto masakan terlebih dahulu!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const finalImgSrc = event.target.result; 

        const fullDescription = `Bahan-bahan:\n${ingredients}\n\nLangkah-langkah:\n${steps}`;

        const safeTitle = encodeURIComponent(title);
        const safeDescription = encodeURIComponent(fullDescription);

        const menuGrid = document.getElementById('menuGrid');
        const newCard = document.createElement('div');
        newCard.className = 'menu-card bg-amber-50 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300';
        newCard.setAttribute('data-name', title.toLowerCase());
        newCard.setAttribute('data-category', category);

        newCard.innerHTML = `
            <div class="relative overflow-hidden aspect-video">
                <img src="${finalImgSrc}" alt="${title}" class="w-full h-full object-cover">
                <span class="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-bold">Resep User</span>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold dark:text-white card-title">${title}</h3>
                    <button onclick="deleteRecipe(this)" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 transition text-xs" title="Hapus Resep">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 card-desc">${desc}</p>
                <div class="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
                    <button onclick="openModal('${safeTitle}', '${safeDescription}', '${finalImgSrc}')" 
                            class="text-amber-700 dark:text-amber-400 font-semibold text-sm hover:underline">Lihat Detail</button>
                </div>
            </div>
        `;

        menuGrid.appendChild(newCard);
        closeAddRecipeModal();
        filterMenu(); 
    };

    reader.readAsDataURL(imageFile); 
}

// --- 6. LOGIKA HAPUS RESEP ---
function deleteRecipe(buttonElement) {
    if (confirm("Apakah kamu yakin ingin menghapus resep ini?")) {
        const card = buttonElement.closest('.menu-card');
        card.remove();
        filterMenu(); 
    }
}