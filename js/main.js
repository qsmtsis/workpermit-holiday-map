// ============================
// 🌐 CONFIGURATION
// ============================

// URL ของ Google Apps Script Web App
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwrebx44UOwxqLLjxUjl8o1WfrWcAdq2WDVuIAHUBxeEPy5JA6NmQbToi6Di_fthgwZdg/exec';

// ============================
// 🚀 MAIN FUNCTIONS
// ============================

let allWorks = [];
let currentMapImage = null;

// ตรวจสอบเวอร์ชันทันทีที่โหลดหน้า
window.onload = function() {
    checkDeploymentVersion();
    loadApprovedWorks();
};

// ✅ ตรวจสอบว่า Deploy เวอร์ชันใหม่แล้วหรือไม่
function checkDeploymentVersion() {
    console.log('=== Checking deployment version ===');
    
    // เพิ่ม timestamp เพื่อบังคับ Browser Cache
    const timestamp = new Date().getTime();
    
    fetch(`${GAS_API_URL}?action=checkVersion&t=${timestamp}`)
        .then(response => response.json())
        .then(result => {
            console.log('Version check result:', result);
            
            const badge = document.getElementById('versionBadge');
            
            if (result && result.version === "4.0") {
                badge.textContent = `✓ Version ${result.version}`;
                badge.className = 'version-badge';
                console.log('✓ Correct version deployed!');
            } else {
                badge.textContent = `⚠️ v${result.version || 'Unknown'}`;
                badge.className = 'version-badge error';
                console.error('❌ Wrong version! Need to redeploy.');
                
                alert('⚠️ กรุณา Deploy ใหม่!\n\nขั้นตอน:\n1. Apps Script Editor\n2. Deploy > New deployment\n3. Deploy as Web app\n4. Refresh หน้านี้');
            }
        })
        .catch(error => {
            console.error('Version check failed:', error);
            
            const badge = document.getElementById('versionBadge');
            badge.textContent = '❌ Check Failed';
            badge.className = 'version-badge error';
        });
}

function loadApprovedWorks() {
    const filterPlant = document.getElementById('filterPlant').value;
    const filterDate = document.getElementById('filterDate').value;
    const filterSearch = document.getElementById('filterSearch').value;
    
    document.getElementById('tableContainer').innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
        </div>
    `;
    
    console.log('=== Calling getApprovedWorks ===');
    console.log('Filters:', {filterPlant, filterDate, filterSearch});
    
    // เพิ่ม timestamp เพื่อบังคับ Browser Cache
    const timestamp = new Date().getTime();
    
    fetch(`${GAS_API_URL}?action=getWorks&plant=${filterPlant}&date=${filterDate}&search=${filterSearch}&t=${timestamp}`)
        .then(response => response.json())
        .then(works => {
            displayWorks(works);
        })
        .catch(error => {
            console.error('Error loading works:', error);
            handleError(error);
        });
}

// ... (ฟังก์ชันอื่นๆ เช่น displayWorks, loadMap, etc. ย้ายมาจากเดิม) ...
