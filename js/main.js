// ============================
// 🌐 CONFIGURATION
// ============================

// ⚠️ วาง URL ของ Google Apps Script ที่ Deploy แล้วตรงนี้!
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwrebx44UOwxqLLjxUjl8o1WfrWcAdq2WDVuIAHUBxeEPy5JA6NmQbToi6Di_fthgwZdg/exec';

// ============================
// 🚀 GLOBAL VARIABLES
// ============================

let allWorks = [];
let currentMapImage = null;

// ============================
// 🚀 INITIALIZATION
// ============================

// ตรวจสอบเวอร์ชันและโหลดข้อมูลเมื่อหน้าโหลด
window.onload = function() {
    console.log('=== Page Loaded ===');
    checkDeploymentVersion();
    loadApprovedWorks();
};

// ============================
// 📡 API CALLS
// ============================

// ✅ ตรวจสอบเวอร์ชันของ Backend
function checkDeploymentVersion() {
    console.log('=== Checking deployment version ===');
    
    // เพิ่ม timestamp เพื่อป้องกัน Browser Cache
    const timestamp = new Date().getTime();
    
    // เรียก API พร้อมพารามิเตอร์
    fetch(`${GAS_API_URL}?action=checkVersion&t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Version check result:', result);
            
            const badge = document.getElementById('versionBadge');
            
            if (result && result.success && result.version === "4.0") {
                badge.textContent = `✓ Backend v${result.version}`;
                badge.className = 'version-badge';
                console.log('✓ Correct backend version!');
            } else {
                badge.textContent = `⚠️ Backend v${result.version || 'Unknown'}`;
                badge.className = 'version-badge error';
                console.error('❌ Wrong backend version!');
                
                alert('⚠️ Backend API ต้องการอัปเดต!\n\nโปรดแจ้งผู้ดูแลนระบบ');
            }
        })
        .catch(error => {
            console.error('Version check failed:', error);
            
            const badge = document.getElementById('versionBadge');
            badge.textContent = '❌ Check Failed';
            badge.className = 'version-badge error';
        });
}

// 📋 โหลดข้อมูลงานที่อนุมัติ
function loadApprovedWorks() {
    const filterPlant = document.getElementById('filterPlant').value;
    const filterDate = document.getElementById('filterDate').value;
    const filterSearch = document.getElementById('filterSearch').value;
    
    // แสดงสถานะการโหลด
    document.getElementById('tableContainer').innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
        </div>
    `;
    
    console.log('=== Calling getWorks API ===');
    console.log('Filters:', {filterPlant, filterDate, filterSearch});
    
    // เพิ่ม timestamp เพื่อป้องกัน Browser Cache
    const timestamp = new Date().getTime();
    
    // เรียก API พร้อมพารามิเตอร์
    fetch(`${GAS_API_URL}?action=getWorks&plant=${filterPlant}&date=${filterDate}&search=${filterSearch}&t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(works => {
            displayWorks(works);
        })
        .catch(error => {
            console.error('Error loading works:', error);
            handleError(error);
        });
}

// ... (ฟังก์ชันอื่นๆ เหมือนเดิม: displayWorks, loadMap, etc.) ...

// ============================
// 🛠 ตัวจัดการข้อผิดพลาด
// ============================

function handleError(error) {
    console.error('=== handleError called ===');
    console.error('Error:', error);
    
    const tableContainer = document.getElementById('tableContainer');
    
    tableContainer.innerHTML = `
        <div class="error-detail">
            <h3>❌ เกิดข้อผิดพลาดในการเรียกข้อมูล</h3>
            <p style="margin: 10px 0; color: #4a5568;">${error.message || 'Unknown error'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border-radius: 8px; border: 1px solid #fbbf24;">
                <strong>💡 วิธีแก้ไข:</strong>
                <p style="margin-top: 8px;">1. ตรวจสอบว่า Backend API อัปเดตเป็น v4.0 แล้ว</p>
                <p style="margin-top: 5px;">2. ลองรีเฟรชหน้าเว็บ (Ctrl+F5)</p>
                <p style="margin-top: 5px;">3. ลองเปิดใน Incognito Window</p>
            </div>
        </div>
    `;
}
