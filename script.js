// Функции для динамической генерации таблиц
function generateEquipmentTable(tableId, dataObject) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    Object.keys(dataObject).forEach(key => {
        const equipment = dataObject[key];
        const row = document.createElement('tr');
        
        // Извлекаем больницу из location (первая часть до запятой)
        const hospital = equipment.location.split(',')[0];
        
        // Извлекаем производителя из serial (первая часть до дефиса)
        const manufacturer = equipment.serial.split('-')[0];
        
        // Определяем тип оборудования из mo (первая часть до дефиса)
        const equipmentType = equipment.mo.split('-')[0];
        
        row.innerHTML = `
            <td>${key}</td>
            <td>${hospital}</td>
            <td>${manufacturer}</td>
            <td>${equipmentType}</td>
            <td>${equipment.mo}</td>
            <td>${equipment.nextMetrologyDate}</td>
        `;
        tbody.appendChild(row);
    });
}

function initializeTables() {
    // Генерируем таблицы из данных
    generateEquipmentTable('equipmentTableBody', equipmentData);
    generateEquipmentTable('lisEquipmentTableBody', lisEquipmentData);
    generateEquipmentTable('otherEquipmentTableBody', otherEquipmentData);
}

// Функция для сортировки таблицы по дате поверки
function sortTableByVerificationDate(tableId, dataObject) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    // Сортируем данные по дате поверки
    const sortedEntries = Object.entries(dataObject).sort((a, b) => {
        const dateA = a[1].nextMetrologyDate;
        const dateB = b[1].nextMetrologyDate;
        
        // Если дата "-", ставим в конец
        if (dateA === '-') return 1;
        if (dateB === '-') return -1;
        
        // Парсим даты для сравнения
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('.');
            return new Date(year, month - 1, day);
        };
        
        return parseDate(dateA) - parseDate(dateB);
    });
    
    // Создаем новый объект с отсортированными данными
    const sortedData = {};
    sortedEntries.forEach(([key, value]) => {
        sortedData[key] = value;
    });
    
    // Перегенерируем таблицу с отсортированными данными
    generateEquipmentTable(tableId, sortedData);
}

// Добавляем интерактивность
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем таблицы
    initializeTables();
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
    
    // Обработка кликов по строкам таблицы оборудования (РИС)
    const equipmentRows = document.querySelectorAll('#equipmentTableBody tr');
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

    // Обработка кликов по строкам таблицы Прочее (эндоскопы)
    const otherEquipmentRows = document.querySelectorAll('#otherEquipmentTableBody tr');
    const otherNoSelection = document.getElementById('otherNoSelection');
    const otherEquipmentPassport = document.getElementById('otherEquipmentPassport');
    
    otherEquipmentRows.forEach(row => {
        row.addEventListener('click', function() {
            // Убираем выделение с других строк
            otherEquipmentRows.forEach(r => r.classList.remove('selected'));
            // Выделяем текущую строку
            this.classList.add('selected');
            
            // Получаем номер оборудования из первой ячейки
            const equipmentNumber = this.cells[0].textContent;
            const data = otherEquipmentData[equipmentNumber];
            
            if (data) {
                // Заполняем паспорт данными
                document.getElementById('otherEquipmentMO').textContent = data.mo;
                document.getElementById('otherEquipmentSerial').textContent = data.serial;
                document.getElementById('otherEquipmentInv').textContent = data.inv;
                document.getElementById('otherEquipmentLocation').textContent = data.location;
                document.getElementById('otherEquipmentCategory').textContent = data.category;
                document.getElementById('otherEquipmentRegistration').textContent = data.registration || '-';
                document.getElementById('otherEquipmentStartDate').textContent = data.startDate;
                document.getElementById('otherEquipmentExpirationDate').textContent = data.expirationDate;
                document.getElementById('otherEquipmentExtensionDate').textContent = data.extensionDate;
                document.getElementById('otherEquipmentServiceDate').textContent = data.serviceDate;
                document.getElementById('otherEquipmentNextServiceDate').textContent = data.nextServiceDate;
                document.getElementById('otherEquipmentMetrologyDate').textContent = data.metrologyDate;
                document.getElementById('otherEquipmentNextMetrologyDate').textContent = data.nextMetrologyDate;
                
                // Показываем паспорт и скрываем заглушку
                otherNoSelection.style.display = 'none';
                otherEquipmentPassport.style.display = 'flex';
                
                // Показываем уведомление
                showNotification(`Выбрано оборудование: ${data.mo}`);
            }
        });
    });
    
    // Обработка кнопок в паспорте Прочее
    document.getElementById('otherJournalBtn').addEventListener('click', function() {
        openModal('journalModal');
    });
    
    document.getElementById('otherMaterialsBtn').addEventListener('click', function() {
        openModal('materialsModal');
    });
    
    // Обработка вкладок в модальных окнах
    setupModalTabs('journalModal');
    setupModalTabs('materialsModal');
    
    // Инициализация журнала нагрузки
    initializeLoadJournal();
    
    // Инициализация календаря
    initializeCalendar();
    
    // Инициализация графиков
    initializeCharts();
    
    // Обработка кнопки сортировки по дате поверки для РИС
    document.getElementById('verificationSearchBtn').addEventListener('click', function() {
        sortTableByVerificationDate('equipmentTableBody', equipmentData);
        showNotification('Таблица РИС отсортирована по дате поверки (ближайшие даты вверху)');
    });
    
    // Обработка кнопки сортировки по дате поверки для ЛИС
    document.getElementById('lisVerificationSearchBtn').addEventListener('click', function() {
        sortTableByVerificationDate('lisEquipmentTableBody', lisEquipmentData);
        showNotification('Таблица ЛИС отсортирована по дате поверки (ближайшие даты вверху)');
    });
    
    // Обработка кнопки сортировки по дате поверки для Прочее
    document.getElementById('otherVerificationSearchBtn').addEventListener('click', function() {
        sortTableByVerificationDate('otherEquipmentTableBody', otherEquipmentData);
        showNotification('Таблица Прочее отсортирована по дате поверки (ближайшие даты вверху)');
    });
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
        if (event.target.classList.contains('verification-search-modal')) {
            closeVerificationSearch();
        }
    });
    
    // Закрытие модальных окон по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
            // Модальное окно поиска поверки удалено - теперь используется сортировка
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

// Функции для работы с журналом нагрузки
function initializeLoadJournal() {
    // Загружаем данные для первой даты по умолчанию
    loadJournalDataForDate('2025-09-11');
    
    // Обработка кликов по кнопкам дат
    const dateButtons = document.querySelectorAll('.date-btn');
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedDate = this.getAttribute('data-date');
            
            // Убираем активный класс у всех кнопок
            dateButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Загружаем данные для выбранной даты
            loadJournalDataForDate(selectedDate);
            
            // Обновляем календарь
            updateCalendarSelection(selectedDate);
            
            // Показываем уведомление
            showNotification(`Загружен журнал нагрузки на ${this.textContent}`);
        });
    });
}

function loadJournalDataForDate(date) {
    const loadJournalList = document.getElementById('loadJournalList');
    const data = loadJournalData[date];
    
    if (!data) {
        loadJournalList.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">Данные для выбранной даты не найдены</p>';
        return;
    }
    
    // Очищаем список
    loadJournalList.innerHTML = '';
    
    // Генерируем элементы списка
    data.forEach((item, index) => {
        const loadItem = document.createElement('div');
        loadItem.className = 'load-item';
        
        loadItem.innerHTML = `
            <span class="load-number">${index + 1}</span>
            <span class="load-time">${item.time}</span>
            <span class="load-doctor">врач ${item.doctor}</span>
        `;
        
        loadJournalList.appendChild(loadItem);
    });
}

// Переменные для календаря
let currentCalendarDate = new Date(2025, 8, 11); // Сентябрь 2025 (месяц начинается с 0)
const availableDates = ['2025-09-11', '2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15', '2025-09-16', '2025-09-17'];

// Функции для работы с календарем
function initializeCalendar() {
    renderCalendar();
    
    // Обработка навигации по месяцам
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonthYear = document.getElementById('calendarMonthYear');
    
    // Обновляем заголовок календаря
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    calendarMonthYear.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
    
    // Очищаем календарь
    calendarDays.innerHTML = '';
    
    // Получаем первый день месяца и количество дней
    const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1);
    const lastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Понедельник = 0
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDays.appendChild(emptyDay);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Формируем дату в формате YYYY-MM-DD
        const dateString = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Проверяем, есть ли данные для этой даты
        if (availableDates.includes(dateString)) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', function() {
                selectCalendarDate(dateString);
            });
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Добавляем пустые ячейки для дней следующего месяца
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 недель * 7 дней = 42 ячейки
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDays.appendChild(emptyDay);
    }
}

function selectCalendarDate(dateString) {
    // Убираем выделение с предыдущей даты
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Добавляем выделение к выбранной дате
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(day => {
        const dayNumber = day.textContent;
        if (dayNumber && !isNaN(dayNumber)) {
            const formattedDate = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            if (formattedDate === dateString) {
                day.classList.add('selected');
            }
        }
    });
    
    // Обновляем кнопки дат
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-date') === dateString) {
            btn.classList.add('active');
        }
    });
    
    // Загружаем данные для выбранной даты
    loadJournalDataForDate(dateString);
    
    // Показываем уведомление
    const formattedDate = dateString.split('-').reverse().join('.');
    showNotification(`Выбрана дата: ${formattedDate}`);
}

function updateCalendarSelection(dateString) {
    // Убираем выделение с предыдущей даты
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Добавляем выделение к выбранной дате
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(day => {
        const dayNumber = day.textContent;
        if (dayNumber && !isNaN(dayNumber)) {
            const formattedDate = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            if (formattedDate === dateString) {
                day.classList.add('selected');
            }
        }
    });
}

// Переменные для графиков
let hourlyChart = null;
let monthlyChart = null;

// Функции для работы с графиками
function initializeCharts() {
    // Создаем графики
    createHourlyChart('today');
    createMonthlyChart(2024);
    
    // Обработка кнопок переключения периодов
    document.querySelectorAll('.chart-btn[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            
            // Убираем активный класс у всех кнопок периода
            document.querySelectorAll('.chart-btn[data-period]').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Обновляем график
            createHourlyChart(period);
        });
    });
    
    // Обработка кнопок переключения годов
    document.querySelectorAll('.chart-btn[data-year]').forEach(btn => {
        btn.addEventListener('click', function() {
            const year = parseInt(this.getAttribute('data-year'));
            
            // Убираем активный класс у всех кнопок года
            document.querySelectorAll('.chart-btn[data-year]').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Обновляем график
            createMonthlyChart(year);
        });
    });
}

function createHourlyChart(period) {
    const canvas = document.getElementById('hourlyChart');
    const ctx = canvas.getContext('2d');
    const data = chartData.hourly[period];
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Настройки графика
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const maxValue = Math.max(...data.data);
    
    // Рисуем оси
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    
    // Горизонтальная ось
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Вертикальная ось
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // Рисуем столбцы
    const barWidth = chartWidth / data.labels.length * 0.8;
    const barSpacing = chartWidth / data.labels.length;
    
    data.data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        // Градиент для столбца
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#1976d2');
        gradient.addColorStop(1, '#1565c0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Подписи значений
        ctx.fillStyle = '#2c3e50';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 5);
        
        // Подписи осей
        ctx.fillStyle = '#6c757d';
        ctx.font = '9px Arial';
        ctx.fillText(data.labels[index], x + barWidth / 2, canvas.height - padding + 15);
    });
    
    // Обновляем статистику
    document.getElementById('totalHourlyStudies').textContent = data.total;
}

function createMonthlyChart(year) {
    const canvas = document.getElementById('monthlyChart');
    const ctx = canvas.getContext('2d');
    const data = chartData.monthly[year];
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Настройки графика
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const maxValue = Math.max(...data.data.filter(v => v > 0));
    
    // Рисуем оси
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    
    // Горизонтальная ось
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Вертикальная ось
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // Рисуем столбцы
    const barWidth = chartWidth / data.labels.length * 0.8;
    const barSpacing = chartWidth / data.labels.length;
    
    data.data.forEach((value, index) => {
        if (value > 0) {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = canvas.height - padding - barHeight;
            
            // Градиент для столбца
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#4caf50');
            gradient.addColorStop(1, '#388e3c');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Подписи значений
            ctx.fillStyle = '#2c3e50';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);
        }
        
        // Подписи осей
        ctx.fillStyle = '#6c757d';
        ctx.font = '9px Arial';
        ctx.fillText(data.labels[index], padding + index * barSpacing + barWidth / 2, canvas.height - padding + 15);
    });
    
    // Обновляем статистику
    document.getElementById('totalMonthlyStudies').textContent = data.total.toLocaleString();
}

// Старые функции поиска по дате поверки удалены - теперь используется сортировка

// Функции поиска по дате поверки удалены - теперь используется сортировка

function resetTableFilter() {
    // Сбрасываем фильтр и показываем все строки
    const tableRows = document.querySelectorAll('#equipmentTableBody tr');
    tableRows.forEach(row => {
        row.style.display = '';
        row.style.backgroundColor = '';
    });
    showNotification('Фильтр сброшен, показаны все записи');
}

// Функции поиска по дате поверки для ЛИС и Прочее удалены - теперь используется сортировка
