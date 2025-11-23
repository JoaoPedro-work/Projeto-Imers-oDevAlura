// Variável para armazenar todos os dados das barbearias
let allBarberias = [];
let currentFilter = { text: '', minRating: 0, services: [] };
let currentSort = 'none'; // 'none', 'avaliacoes-desc', 'preco-asc', 'nome-asc'

const modal = document.getElementById('barberModal');
const grid = document.getElementById('barber-grid');

/**
 * Funções de Inicialização
 */
async function loadBarberias() {
    try {
        const response = await fetch('barbearias.json');
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }
        
        allBarberias = await response.json();
        
        // Inicializa a renderização e os filtros de serviço
        renderServiceFilters();
        filterAndRender(); // Renderiza tudo inicialmente
        
    } catch (error) {
        console.error('Erro ao carregar os dados das barbearias:', error);
        grid.innerHTML = 
            '<p style="color:#d90429; text-align:center; padding: 20px; grid-column: 1 / -1;">' +
            'Não foi possível carregar os dados. Verifique o arquivo <b>barbearias.json</b>.' +
            '</p>';
    }
}

/**
 * 1. Renderiza os Checkboxes de Serviço na Sidebar
 */
function renderServiceFilters() {
    const serviceFiltersDiv = document.getElementById('service-filters');
    serviceFiltersDiv.innerHTML = '';
    
    // Pega todos os serviços únicos de todas as barbearias
    const allServices = new Set();
    allBarberias.forEach(barberia => {
        barberia.servicosExtra.forEach(service => allServices.add(service));
    });

    allServices.forEach(service => {
        const inputId = `service-${service.replace(/\s/g, '_')}`;
        const filterHtml = `
            <label for="${inputId}">
                <input type="checkbox" id="${inputId}" value="${service}" onchange="updateServiceFilters()">
                ${service}
            </label>
        `;
        serviceFiltersDiv.insertAdjacentHTML('beforeend', filterHtml);
    });
}

/**
 * 2. Atualiza a lista de serviços ativos no filtro
 */
function updateServiceFilters() {
    currentFilter.services = [];
    document.querySelectorAll('#service-filters input:checked').forEach(checkbox => {
        currentFilter.services.push(checkbox.value);
    });
    filterAndRender();
}

/**
 * 3. Função de Ordenação (chamada pelos botões)
 */
function sortAndRender(sortType) {
    currentSort = sortType;
    filterAndRender();

    // Atualiza o estado visual dos botões de ordenação
    document.querySelectorAll('.filter-group button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="sortAndRender('${sortType}')"]`)?.classList.add('active');
}

/**
 * 4. Função de Filtro Rápido por Avaliação
 */
function filterByRating(minRating) {
    currentFilter.minRating = minRating;
    
    // Garante que o estado do botão 'Mostrar Todos' seja mantido
    document.querySelectorAll('.filter-group button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="filterByRating(${minRating})"]`)?.classList.add('active');

    filterAndRender();
}

/**
 * 5. Filtra, Ordena e Renderiza (Função Principal)
 */
function filterAndRender() {
    // 1. Coleta o filtro de texto
    currentFilter.text = document.getElementById('search-input').value.toLowerCase().trim();
    
    // 2. Aplica todos os filtros
    let filteredList = allBarberias.filter(barberia => {
        const textMatch = 
            barberia.nome.toLowerCase().includes(currentFilter.text) ||
            barberia.localizacao.toLowerCase().includes(currentFilter.text) ||
            barberia.precoMedio.toLowerCase().includes(currentFilter.text);

        const ratingMatch = barberia.avaliacoes >= currentFilter.minRating;

        // Verifica se a barbearia tem TODOS os serviços selecionados
        const servicesMatch = currentFilter.services.every(selectedService => 
            barberia.servicosExtra.includes(selectedService)
        );

        return textMatch && ratingMatch && servicesMatch;
    });

    // 3. Aplica a ordenação
    if (currentSort !== 'none') {
        filteredList.sort((a, b) => {
            if (currentSort === 'avaliacoes-desc') {
                return b.avaliacoes - a.avaliacoes; // Melhor avaliação primeiro
            } else if (currentSort === 'preco-asc') {
                // Remove R$, , e converte para número para ordenar
                const precoA = parseFloat(a.precoMedio.replace('R$', '').replace(',', '.'));
                const precoB = parseFloat(b.precoMedio.replace('R$', '').replace(',', '.'));
                return precoA - precoB; // Mais barato primeiro
            } else if (currentSort === 'nome-asc') {
                return a.nome.localeCompare(b.nome);
            }
            return 0;
        });
    }

    // 4. Renderiza a lista final
    renderCards(filteredList);
}

/**
 * 6. Função de Renderização dos Cards
 */
function renderCards(barberias) {
    grid.innerHTML = ''; 

    if (barberias.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: #555; padding: 50px;">Nenhuma barbearia encontrada com os critérios atuais.</p>';
        return;
    }

    barberias.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Evento de clique para o modal
        card.addEventListener('click', () => openModal(item.id)); 

        // Cria os badges de serviço
        const serviceBadges = item.servicosExtra.map(service => 
            `<span class="service-badge">${service}</span>`
        ).join('');

        card.innerHTML = `
            <img src="${item.imagemUrl}" alt="Foto da ${item.nome}">
            <div class="card-info">
                <h3>${item.nome}</h3>
                <div class="rating">
                    <i class="fas fa-star"></i> ${item.avaliacoes}
                </div>
                <p><strong>Local:</strong> ${item.localizacao}</p>
                <p><strong>Preço Médio:</strong> <span>${item.precoMedio}</span></p>
                <div class="services">${serviceBadges}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Funções do Modal
 */
function openModal(barberiaId) {
    const item = allBarberias.find(b => b.id === barberiaId);
    if (!item) return;

    // Cria os badges para o modal
    const serviceList = item.servicosExtra.map(service => `<li>${service}</li>`).join('');

    modalBody.innerHTML = `
        <h2>${item.nome}</h2>
        <img src="${item.imagemUrl}" alt="Imagem de ${item.nome}">
        
        <p class="rating" style="font-size: 1.3em;">
            <i class="fas fa-star" style="color: gold;"></i> Avaliação Média: <strong>${item.avaliacoes}</strong>
        </p>

        <p><strong>Localização:</strong> ${item.localizacao}</p>
        <p><strong>Preço Médio do Corte:</strong> <span style="color: #2c3e50; font-weight: bold;">${item.precoMedio}</span></p>
        
        <hr>

        <p><strong>Descrição:</strong> ${item.descricaoCompleta}</p>
        
        <hr>
        
        <h4>Serviços Extras Oferecidos:</h4>
        <ul style="margin-left: 20px;">${serviceList}</ul>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Fecha o modal ao clicar fora ou apertar ESC
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.style.display === 'block') {
        closeModal();
    }
});

// INÍCIO: Chama a função para carregar os dados quando a página estiver pronta
document.addEventListener('DOMContentLoaded', loadBarberias);