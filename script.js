// 전역 상태 관리
let currentExpandedSections = new Set(); // This might not be used or needed if toggle handles state
let kindergartenSectionsRendered = false;
let elementarySectionsRendered = false;

// 섹션 토글 함수
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        
        if (sectionId === 'kindergarten' && !kindergartenSectionsRendered) {
            renderKindergartenSections();
            kindergartenSectionsRendered = true;
        } else if (sectionId === 'elementary' && !elementarySectionsRendered) {
            renderElementarySections();
            elementarySectionsRendered = true;
        }
    } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// 유치원 하위 섹션 렌더링
function renderKindergartenSections() {
    const container = document.getElementById('kindergarten-sections');
    container.innerHTML = '';
    
    Object.entries(kindergartenData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'kindergarten', 'toggleKindergartenSubSection');
        container.appendChild(sectionElement);
    });
}

// 초등학교 하위 섹션 렌더링
function renderElementarySections() {
    const container = document.getElementById('elementary-sections');
    container.innerHTML = '';
    
    Object.entries(elementaryData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'elementary', 'toggleElementarySubSection');
        container.appendChild(sectionElement);
    });
}

// 공용 상세 섹션 생성 함수 (유치원, 초등학교 등)
function createDetailedSectionHTML(title, data, typePrefix, toggleFunctionName) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-xs'; // Added shadow-xs for subtle depth
    
    const sectionId = `${typePrefix}-section-${title.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`; // Allow Korean characters in ID generation
    
    sectionElement.innerHTML = `
        <button 
            onclick="${toggleFunctionName}('${sectionId}')" 
            class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 bg-white"
        >
            <div class="flex items-center">
                <div class="w-8 h-8 bg-${data.color}-100 rounded-md flex items-center justify-center mr-3">
                    <i class="${data.icon} text-${data.color}-600 text-sm"></i>
                </div>
                <span class="font-medium text-gray-800">${title}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-200" id="${sectionId}-arrow"></i>
        </button>
        
        <div id="${sectionId}-content" class="hidden bg-gray-50 border-t border-gray-200">
            ${data.items.map(item => `
                <div class="px-4 py-2 border-b border-gray-100 last:border-b-0">
                    <a 
                        href="${item.url}" 
                        target="_blank"
                        class="flex items-center text-gray-700 hover:text-${data.color}-600 hover:bg-white p-2 rounded-md transition-all duration-200 group"
                    >
                        <i class="fas fa-file-alt text-gray-400 group-hover:text-${data.color}-500 mr-3 text-sm"></i>
                        <span class="text-sm flex-grow">${item.title}</span>
                        <i class="fas fa-external-link-alt text-gray-300 group-hover:text-${data.color}-400 ml-2 text-xs flex-shrink-0"></i>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    return sectionElement;
}

// 유치원 하위 섹션 토글
function toggleKindergartenSubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

// 초등학교 하위 섹션 토글
function toggleElementarySubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

// 공용 하위 섹션 토글 함수
function toggleDetailedSubSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// 유치원 검색 기능
function searchKindergarten() {
    const searchTerm = document.getElementById('kindergarten-search').value.toLowerCase();
    const container = document.getElementById('kindergarten-sections');
    
    searchDetailedItems(searchTerm, kindergartenData, container, 'kindergarten', 'toggleKindergartenSubSection');
}

// 초등학교 검색 기능
function searchElementary() {
    const searchTerm = document.getElementById('elementary-search').value.toLowerCase();
    const container = document.getElementById('elementary-sections');

    searchDetailedItems(searchTerm, elementaryData, container, 'elementary', 'toggleElementarySubSection');
}

// 공용 검색 로직 함수
function searchDetailedItems(searchTerm, dataObject, containerElement, typePrefix, toggleFunctionName) {
    if (!searchTerm.trim()) {
        containerElement.innerHTML = ''; // Clear previous results
         Object.entries(dataObject).forEach(([sectionTitle, sectionData]) => {
            const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, toggleFunctionName);
            containerElement.appendChild(sectionElement);
        });
        // Ensure all sub-sections are initially collapsed after clearing search
        setTimeout(() => {
            Object.keys(dataObject).forEach(sectionTitle => {
                const sectionId = `${typePrefix}-section-${sectionTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`;
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && !content.classList.contains('hidden')) { // Only collapse if it was open
                    content.classList.add('hidden');
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }, 0); // Use timeout to ensure DOM is updated
        return;
    }
    
    const filteredData = {};
    Object.entries(dataObject).forEach(([sectionTitle, sectionData]) => {
        const matchingItems = sectionData.items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            sectionTitle.toLowerCase().includes(searchTerm)
        );
        
        if (matchingItems.length > 0 || sectionTitle.toLowerCase().includes(searchTerm)) {
            filteredData[sectionTitle] = {
                ...sectionData,
                items: sectionTitle.toLowerCase().includes(searchTerm) && matchingItems.length === 0 ? sectionData.items : matchingItems
            };
        }
    });
    
    containerElement.innerHTML = '';
    if (Object.keys(filteredData).length === 0) {
        containerElement.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-search text-2xl mb-2"></i>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    Object.entries(filteredData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, toggleFunctionName);
        containerElement.appendChild(sectionElement);
        
        const sectionId = `${typePrefix}-section-${sectionTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`;
        // Automatically open sections with search results
        // Check if the section title itself matches or if it has matching items
        const sectionTitleMatches = sectionTitle.toLowerCase().includes(searchTerm);
        const itemsMatch = sectionData.items.some(item => item.title.toLowerCase().includes(searchTerm));

        if (sectionTitleMatches || itemsMatch) {
             setTimeout(() => { // Ensure element is in DOM
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && arrow) {
                    content.classList.remove('hidden');
                    arrow.style.transform = 'rotate(180deg)';
                }
            }, 50); // Small delay for rendering
        }
    });
}


// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학교업무 도움자료 페이지가 로드되었습니다.');
    // Any other initializations can go here
});

