// DOM Elements
const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    quoteText: document.getElementById('quote'),
    diceContainer: document.querySelector('.dice-container'),
    taskInput: document.getElementById('task-input'),
    hoursValue: document.getElementById('hours-value'),
    minutesValue: document.getElementById('minutes-value'),
    hoursBox: document.querySelector('.hours-box'),
    minutesBox: document.querySelector('.minutes-box'),
    hoursDropdown: document.querySelector('.hours-dropdown'),
    minutesDropdown: document.querySelector('.minutes-dropdown'),
    addTaskBtn: document.getElementById('add-task'),
    tasksList: document.getElementById('tasks-list'),
    recentTasksList: document.getElementById('recent-tasks-list'),
    recentTasksContainer: document.querySelector('.recent-tasks-container'),
    recentTasksToggle: document.querySelector('.recent-tasks-toggle'),
    completedTasksList: document.getElementById('completed-tasks-list'),
    completedTasksContainer: document.querySelector('.completed-tasks-container'),
    completedTasksToggle: document.querySelector('.completed-tasks-toggle'),
    totalHours: document.getElementById('total-hours'),
    totalMinutes: document.getElementById('total-minutes')
};

// Data
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future belong to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt"
];

let tasks = [];
let recentTasks = [];
let totalTime = { hours: 0, minutes: 0 };

// Time Selector Functionality
let selectedHours = 0;
let selectedMinutes = 0;

function updateTimeDisplay() {
    elements.hoursValue.textContent = selectedHours.toString().padStart(2, '0');
    elements.minutesValue.textContent = selectedMinutes.toString().padStart(2, '0');
}

function handleTimeSelection(box, dropdown, value, isHours) {
    box.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Diğer dropdown'ları kapat
        elements.hoursDropdown.classList.remove('active');
        elements.minutesDropdown.classList.remove('active');
        
        // Tıklanan dropdown'ı aç
        dropdown.classList.add('active');
        
        // Dropdown'ın konumunu ayarla
        const rect = box.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 5}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
    });

    dropdown.querySelectorAll('.time-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const newValue = parseInt(option.dataset.value);
            if (isHours) {
                selectedHours = newValue;
            } else {
                selectedMinutes = newValue;
            }
            updateTimeDisplay();
            dropdown.classList.remove('active');
            
            // Update selected state
            dropdown.querySelectorAll('.time-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });
}

// Initialize time selectors
handleTimeSelection(elements.hoursBox, elements.hoursDropdown, selectedHours, true);
handleTimeSelection(elements.minutesBox, elements.minutesDropdown, selectedMinutes, false);

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.time-box') && !e.target.closest('.time-dropdown')) {
        elements.hoursDropdown.classList.remove('active');
        elements.minutesDropdown.classList.remove('active');
    }
});

// Theme Toggle
elements.themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Quote Generator
const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

elements.diceContainer.addEventListener('click', () => {
    elements.quoteText.textContent = getRandomQuote();
    elements.diceContainer.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => elements.diceContainer.style.transform = 'rotate(0deg) scale(1)', 500);
});

// Task Management
const updateTotalTime = () => {
    totalTime = tasks.reduce((total, task) => ({
        hours: total.hours + task.hours,
        minutes: total.minutes + task.minutes
    }), { hours: 0, minutes: 0 });

    totalTime.hours += Math.floor(totalTime.minutes / 60);
    totalTime.minutes = totalTime.minutes % 60;

    elements.totalHours.textContent = totalTime.hours;
    elements.totalMinutes.textContent = totalTime.minutes;
};

const createTaskElement = (task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const timeDisplay = `${task.hours.toString().padStart(2, '0')}:${task.minutes.toString().padStart(2, '0')}`;
    
    taskElement.innerHTML = `
        <div class="task-content">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <span class="task-time">${timeDisplay}</span>
        </div>
        <div class="task-buttons">
            <button class="complete-btn">
                <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
            </button>
            <button class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    const [completeBtn, deleteBtn] = taskElement.querySelectorAll('button');

    completeBtn.addEventListener('click', () => {
        task.completed = !task.completed;
        
        if (task.completed) {
            // Task tamamlandığında Your Tasks listesinden çıkar
            taskElement.remove();
            // Completed Tasks listesine ekle
            updateCompletedTasksDisplay();
            
            // Havai fişek efekti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Ana patlama
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#e74c3c']
                });

                // İkinci patlama
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#f1c40f', '#e67e22', '#e74c3c', '#2ecc71']
                });
            }, 250);
        } else {
            // Task geri alındığında Your Tasks listesine geri ekle
            elements.tasksList.appendChild(taskElement);
            updateCompletedTasksDisplay();
        }
    });

    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        taskElement.remove();
        updateTotalTime();
        updateCompletedTasksDisplay();
    });

    return taskElement;
};

function updateCompletedTasksDisplay() {
    elements.completedTasksList.innerHTML = '';
    
    const completedTasks = tasks.filter(task => task.completed);
    
    completedTasks.forEach(task => {
        const completedTaskElement = document.createElement('div');
        completedTaskElement.className = 'completed-task-item';
        
        const timeDisplay = `${task.hours.toString().padStart(2, '0')}:${task.minutes.toString().padStart(2, '0')}`;
        
        completedTaskElement.innerHTML = `
            <div class="completed-task-content">
                <span class="completed-task-text">${task.text}</span>
                <span class="completed-task-time">${timeDisplay}</span>
            </div>
            <button class="undo-btn">
                <i class="fas fa-undo"></i>
            </button>
        `;

        const undoBtn = completedTaskElement.querySelector('.undo-btn');
        undoBtn.addEventListener('click', () => {
            task.completed = false;
            elements.tasksList.appendChild(createTaskElement(task));
            updateCompletedTasksDisplay();
        });

        elements.completedTasksList.appendChild(completedTaskElement);
    });
}

function addTask() {
    const taskText = elements.taskInput.value.trim();
    
    if (taskText && (selectedHours > 0 || selectedMinutes > 0)) {
        const task = { 
            text: taskText, 
            hours: selectedHours, 
            minutes: selectedMinutes, 
            completed: false 
        };
        tasks.push(task);
        elements.tasksList.appendChild(createTaskElement(task));
        updateTotalTime();

        // Add to recent tasks
        addToRecentTasks(task);

        // Clear inputs
        elements.taskInput.value = '';
        selectedHours = 0;
        selectedMinutes = 0;
        updateTimeDisplay();
        
        // Reset selected states
        elements.hoursDropdown.querySelectorAll('.time-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        elements.minutesDropdown.querySelectorAll('.time-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    } else {
        alert('Please enter a valid task and time!');
    }
}

function addToRecentTasks(task) {
    // Check if task already exists in recent tasks
    const existingIndex = recentTasks.findIndex(t => 
        t.text === task.text && t.hours === task.hours && t.minutes === task.minutes
    );

    if (existingIndex !== -1) {
        // Remove existing task
        recentTasks.splice(existingIndex, 1);
    }

    // Add new task to the beginning
    recentTasks.unshift(task);

    // Keep only last 5 tasks
    if (recentTasks.length > 5) {
        recentTasks.pop();
    }

    // Update recent tasks display
    updateRecentTasksDisplay();
}

function updateRecentTasksDisplay() {
    elements.recentTasksList.innerHTML = '';
    
    recentTasks.forEach(task => {
        const recentTaskElement = document.createElement('div');
        recentTaskElement.className = 'recent-task-item';
        
        const timeDisplay = `${task.hours.toString().padStart(2, '0')}:${task.minutes.toString().padStart(2, '0')}`;
        
        recentTaskElement.innerHTML = `
            <div class="recent-task-content">
                <span class="recent-task-text">${task.text}</span>
                <span class="recent-task-time">${timeDisplay}</span>
            </div>
            <button class="recent-task-add">
                <i class="fas fa-plus"></i>
            </button>
        `;

        const addButton = recentTaskElement.querySelector('.recent-task-add');
        addButton.addEventListener('click', () => {
            elements.taskInput.value = task.text;
            elements.hoursValue.value = task.hours;
            elements.minutesValue.value = task.minutes;
            elements.recentTasksContainer.classList.remove('active');
        });

        elements.recentTasksList.appendChild(recentTaskElement);
    });
}

// Event Listeners
elements.addTaskBtn.addEventListener('click', addTask);
elements.taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());

// Recent Tasks Toggle
elements.recentTasksToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.recentTasksContainer.classList.toggle('active');
});

// Close recent tasks when clicking outside
document.addEventListener('click', (e) => {
    if (!elements.recentTasksContainer.contains(e.target) && 
        !elements.recentTasksToggle.contains(e.target)) {
        elements.recentTasksContainer.classList.remove('active');
    }
});

// Completed Tasks Toggle
elements.completedTasksToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.completedTasksContainer.classList.toggle('active');
});

// Close completed tasks when clicking outside
document.addEventListener('click', (e) => {
    if (!elements.completedTasksContainer.contains(e.target) && 
        !elements.completedTasksToggle.contains(e.target)) {
        elements.completedTasksContainer.classList.remove('active');
    }
});

// Initialize
elements.quoteText.textContent = getRandomQuote();
updateRecentTasksDisplay(); 