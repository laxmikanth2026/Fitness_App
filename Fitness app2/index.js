// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    lucide.createIcons();
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const menuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    lucide.createIcons();
});

// Progress Tracking
const progressForm = document.getElementById('progressForm');
const progressChart = document.getElementById('progressChart');
let chart;

// Initialize progress data from localStorage
let progressData = JSON.parse(localStorage.getItem('progressData')) || {
    dates: [],
    weights: [],
    workouts: [],
    calories: []
};

function updateChart() {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(progressChart, {
        type: 'line',
        data: {
            labels: progressData.dates,
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: progressData.weights,
                    borderColor: '#4f46e5',
                    tension: 0.1
                },
                {
                    label: 'Workouts',
                    data: progressData.workouts,
                    borderColor: '#10b981',
                    tension: 0.1
                },
                {
                    label: 'Calories',
                    data: progressData.calories,
                    borderColor: '#ef4444',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Workout selection and calorie calculation
const workoutTypes = document.querySelectorAll('.workout-type');
const workoutDetails = document.querySelectorAll('.workout-details');
const durationInput = document.getElementById('duration');
const caloriesBurned = document.getElementById('caloriesBurned');

// Calories burned per minute for different activities
const caloriesPerMinute = {
    running: 10,
    cycling: 7,
    swimming: 8,
    'jumping-rope': 12,
    'push-ups': 7,
    squats: 8,
    deadlifts: 9,
    'bench-press': 8,
    'sun-salutation': 3,
    warrior: 4,
    'tree-pose': 2,
    cobra: 2
};

// Handle workout type selection
workoutTypes.forEach(type => {
    type.addEventListener('click', () => {
        // Remove selection from all types
        workoutTypes.forEach(t => t.classList.remove('selected'));
        // Add selection to clicked type
        type.classList.add('selected');
        
        // Hide all workout details
        workoutDetails.forEach(detail => detail.classList.add('hidden'));
        // Show selected workout details
        const selectedType = type.dataset.type;
        document.getElementById(`${selectedType}Details`).classList.remove('hidden');
        
        calculateCalories();
    });
});

// Calculate calories whenever duration or exercises change
function calculateCalories() {
    const duration = parseInt(durationInput.value) || 0;
    let totalCalories = 0;
    
    // Get all checked exercises
    const checkedExercises = document.querySelectorAll('input[type="checkbox"]:checked');
    checkedExercises.forEach(exercise => {
        const caloriesForExercise = caloriesPerMinute[exercise.value] || 0;
        totalCalories += caloriesForExercise * duration;
    });
    
    caloriesBurned.textContent = `${totalCalories} kcal`;
}

// Add event listeners for real-time calorie calculation
durationInput.addEventListener('input', calculateCalories);
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', calculateCalories);
});

// Modify the progress form submission
progressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString();
    const weight = parseFloat(document.getElementById('weight').value);
    const duration = parseInt(document.getElementById('duration').value);
    const calories = parseInt(caloriesBurned.textContent);
    
    // Get selected workout type
    const selectedType = document.querySelector('.workout-type.selected');
    const workoutType = selectedType ? selectedType.dataset.type : '';
    
    // Get selected exercises
    const selectedExercises = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    // Update progress data
    progressData.dates.push(date);
    progressData.weights.push(weight);
    progressData.workouts.push(workoutType);
    progressData.calories.push(calories);
    progressData.exercises = progressData.exercises || [];
    progressData.exercises.push(selectedExercises);
    progressData.durations = progressData.durations || [];
    progressData.durations.push(duration);

    // Keep only last 7 days of data
    if (progressData.dates.length > 7) {
        const properties = ['dates', 'weights', 'workouts', 'calories', 'exercises', 'durations'];
        properties.forEach(prop => {
            progressData[prop] = progressData[prop].slice(-7);
        });
    }

    localStorage.setItem('progressData', JSON.stringify(progressData));
    updateChart();
    progressForm.reset();
    
    // Reset UI
    workoutTypes.forEach(type => type.classList.remove('selected'));
    workoutDetails.forEach(detail => detail.classList.add('hidden'));
    caloriesBurned.textContent = '0 kcal';
});

// BMI Calculator
const bmiForm = document.getElementById('bmiForm');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');

function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    
    bmiValue.textContent = bmi;
    bmiCategory.textContent = category;
});

// Meal card hover effect
document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Initialize Lucide icons
lucide.createIcons();