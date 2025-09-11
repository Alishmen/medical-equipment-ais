// Добавляем интерактивность
document.addEventListener('DOMContentLoaded', function() {
    // Переключение вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и контенту
            this.classList.add('active');
            document.getElementById(targetTab + '-content').classList.add('active');
            
            // Показываем уведомление
            showNotification(`Переключено на вкладку: ${this.textContent}`);
        });
    });
    
    // Обработка кнопок систем
    const systemButtons = document.querySelectorAll('.system-button');
    
    systemButtons.forEach(button => {
        button.addEventListener('click', function() {
            const systemName = this.getAttribute('data-system');
            
            // Добавляем эффект клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Здесь можно добавить логику для перехода к конкретной системе
            console.log('Выбрана система:', systemName);
            
            // Показываем уведомление
            showNotification(`Выбрана система: ${systemName}`);
        });
    });
    
    // Обработка кликов по строкам таблицы оборудования
    const equipmentRows = document.querySelectorAll('.equipment-table tbody tr');
    const noSelection = document.getElementById('noSelection');
    const equipmentPassport = document.getElementById('equipmentPassport');
    
    // Данные оборудования загружаются из data.js
    
    equipmentRows.forEach(row => {
        row.addEventListener('click', function() {
            // Убираем выделение с других строк
            equipmentRows.forEach(r => r.classList.remove('selected'));
            // Выделяем текущую строку
            this.classList.add('selected');
            
            // Получаем номер оборудования из первой ячейки
            const equipmentNumber = this.cells[0].textContent;
            const data = equipmentData[equipmentNumber];
            
            if (data) {
                // Заполняем паспорт данными
                document.getElementById('equipmentMO').textContent = data.mo;
                document.getElementById('equipmentSerial').textContent = data.serial;
                document.getElementById('equipmentInv').textContent = data.inv;
                document.getElementById('equipmentLocation').textContent = data.location;
            document.getElementById('equipmentCategory').textContent = data.category;
            document.getElementById('equipmentRegistration').textContent = data.registration;
            document.getElementById('equipmentStartDate').textContent = data.startDate;
            document.getElementById('equipmentExpirationDate').textContent = data.expirationDate;
            document.getElementById('equipmentExtensionDate').textContent = data.extensionDate;
            document.getElementById('equipmentServiceDate').textContent = data.serviceDate;
            document.getElementById('equipmentNextServiceDate').textContent = data.nextServiceDate;
            document.getElementById('equipmentMetrologyDate').textContent = data.metrologyDate;
            document.getElementById('equipmentNextMetrologyDate').textContent = data.nextMetrologyDate;
                
                // Показываем паспорт и скрываем заглушку
                noSelection.style.display = 'none';
                equipmentPassport.style.display = 'flex';
                
                // Показываем уведомление
                showNotification(`Выбрано оборудование: ${data.mo}`);
            }
        });
    });
    
    // Обработка кнопок в паспорте РИС
    document.getElementById('journalBtn').addEventListener('click', function() {
        openModal('journalModal');
    });
    
    document.getElementById('materialsBtn').addEventListener('click', function() {
        openModal('materialsModal');
    });
    
    // Обработка кликов по строкам таблицы ЛИС оборудования
    const lisEquipmentRows = document.querySelectorAll('#lisEquipmentTableBody tr');
    const lisNoSelection = document.getElementById('lisNoSelection');
    const lisEquipmentPassport = document.getElementById('lisEquipmentPassport');
    
    lisEquipmentRows.forEach(row => {
        row.addEventListener('click', function() {
            // Убираем выделение с других строк
            lisEquipmentRows.forEach(r => r.classList.remove('selected'));
            // Выделяем текущую строку
            this.classList.add('selected');
            
            // Получаем номер оборудования из первой ячейки
            const equipmentNumber = this.cells[0].textContent;
            const data = lisEquipmentData[equipmentNumber];
            
            if (data) {
                // Заполняем паспорт данными
                document.getElementById('lisEquipmentMO').textContent = data.mo;
                document.getElementById('lisEquipmentSerial').textContent = data.serial;
                document.getElementById('lisEquipmentInv').textContent = data.inv;
                document.getElementById('lisEquipmentLocation').textContent = data.location;
            document.getElementById('lisEquipmentCategory').textContent = data.category;
            document.getElementById('lisEquipmentRegistration').textContent = data.registration;
            document.getElementById('lisEquipmentStartDate').textContent = data.startDate;
            document.getElementById('lisEquipmentExpirationDate').textContent = data.expirationDate;
            document.getElementById('lisEquipmentExtensionDate').textContent = data.extensionDate;
            document.getElementById('lisEquipmentServiceDate').textContent = data.serviceDate;
            document.getElementById('lisEquipmentNextServiceDate').textContent = data.nextServiceDate;
            document.getElementById('lisEquipmentMetrologyDate').textContent = data.metrologyDate;
            document.getElementById('lisEquipmentNextMetrologyDate').textContent = data.nextMetrologyDate;
                
                // Показываем паспорт и скрываем заглушку
                lisNoSelection.style.display = 'none';
                lisEquipmentPassport.style.display = 'flex';
                
                // Показываем уведомление
                showNotification(`Выбрано оборудование: ${data.mo}`);
            }
        });
    });
    
    // Обработка кнопок в паспорте ЛИС
    document.getElementById('lisJournalBtn').addEventListener('click', function() {
        openModal('journalModal');
    });
    
    document.getElementById('lisMaterialsBtn').addEventListener('click', function() {
        openModal('materialsModal');
    });
    
    // Обработка вкладок в модальных окнах
    setupModalTabs('journalModal');
    setupModalTabs('materialsModal');
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Закрытие модальных окон по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
});

function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1976d2;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
        }, 3000);
    }

// Функции для работы с модальными окнами
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Возвращаем прокрутку страницы
    }
}

function setupModalTabs(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const tabs = modal.querySelectorAll('.modal-tab');
    const panels = modal.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех вкладок и панелей
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Добавляем активный класс к выбранной вкладке и панели
            this.classList.add('active');
            const targetPanel = modal.querySelector(`#${targetTab}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}
