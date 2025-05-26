// 전역 상태 관리
let currentExpandedSections = new Set();
let kindergartenSectionsRendered = false;

// 섹션 토글 함수
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        
        // 유치원 섹션인 경우 하위 섹션 렌더링
        if (sectionId === 'kindergarten' && !kindergartenSectionsRendered) {
            renderKindergartenSections();
            kindergartenSectionsRendered = true;
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
        const sectionElement = createKindergartenSection(sectionTitle, sectionData);
        container.appendChild(sectionElement);
    });
}

// 유치원 개별 섹션 생성
function createKindergartenSection(title, data) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'mb-4 border border-gray-200 rounded-lg overflow-hidden';
    
    const sectionId = `kindergarten-section-${title.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    sectionElement.innerHTML = `
        <button 
            onclick="toggleKindergartenSubSection('${sectionId}')" 
            class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 bg-white"
        >
            <div class="flex items-center">
                <div class="w-8 h-8 bg-${data.color}-100 rounded-md flex items-center justify-center mr-3">
                    <i class="${data.icon} text-${data.color}-600 text-sm"></i>
                </div>
                <span class="font-medium text-gray-900">${title}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-200" id="${sectionId}-arrow"></i>
        </button>
        
        <div id="${sectionId}-content" class="hidden bg-gray-50 border-t border-gray-200">
            ${data.items.map(item => `
                <div class="px-6 py-3 border-b border-gray-100 last:border-b-0">
                    <a 
                        href="${item.url}" 
                        target="_blank"
                        class="flex items-center text-gray-700 hover:text-blue-600 hover:bg-white p-2 rounded-md transition-all duration-200 group"
                    >
                        <i class="fas fa-file-alt text-gray-400 group-hover:text-blue-500 mr-3 text-sm"></i>
                        <span class="text-sm">${item.title}</span>
                        <i class="fas fa-external-link-alt text-gray-300 group-hover:text-blue-400 ml-auto text-xs"></i>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    return sectionElement;
}

// 유치원 하위 섹션 토글
function toggleKindergartenSubSection(sectionId) {
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
    
    if (!searchTerm.trim()) {
        // 검색어가 없으면 전체 표시
        renderKindergartenSections();
        return;
    }
    
    // 검색 결과 필터링
    const filteredData = {};
    Object.entries(kindergartenData).forEach(([sectionTitle, sectionData]) => {
        const matchingItems = sectionData.items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            sectionTitle.toLowerCase().includes(searchTerm)
        );
        
        if (matchingItems.length > 0 || sectionTitle.toLowerCase().includes(searchTerm)) {
            filteredData[sectionTitle] = {
                ...sectionData,
                items: sectionTitle.toLowerCase().includes(searchTerm) ? sectionData.items : matchingItems
            };
        }
    });
    
    // 검색 결과 렌더링
    container.innerHTML = '';
    if (Object.keys(filteredData).length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-search text-2xl mb-2"></i>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    Object.entries(filteredData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createKindergartenSection(sectionTitle, sectionData);
        container.appendChild(sectionElement);
        
        // 검색 결과가 있는 섹션은 자동으로 열기
        const sectionId = `kindergarten-section-${sectionTitle.replace(/[^a-zA-Z0-9]/g, '')}`;
        setTimeout(() => {
            const content = document.getElementById(`${sectionId}-content`);
            const arrow = document.getElementById(`${sectionId}-arrow`);
            if (content && arrow) {
                content.classList.remove('hidden');
                arrow.style.transform = 'rotate(180deg)';
            }
        }, 100);
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학교업무 도움자료 페이지가 로드되었습니다.');
});
