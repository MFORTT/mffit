// Get the workout form and history display
const workoutForm = document.getElementById('workout-form');
const workoutType = document.getElementById('workout-type');
const dynamicFields = document.getElementById('dynamic-fields');
const workoutHistory = document.getElementById('workout-history');

// Show/hide fields based on workout type
workoutType.addEventListener('change', function() {
    // Hide all workout-specific fields
    const allFields = document.querySelectorAll('.workout-fields');
    allFields.forEach(field => field.style.display = 'none');
    
    // Get selected workout type
    const selectedType = this.value;
    
    if (selectedType) {
        // Show date field
        document.getElementById('date-field').style.display = 'block';
        
        // Show relevant workout fields
        const fieldsToShow = document.getElementById(`${selectedType}-fields`);
        if (fieldsToShow) {
            fieldsToShow.style.display = 'block';
        }
        
        // Show common fields (notes and submit)
        document.getElementById('common-fields').style.display = 'block';
    } else {
        // Hide date and common fields if no type selected
        document.getElementById('date-field').style.display = 'none';
        document.getElementById('common-fields').style.display = 'none';
    }
});

// Handle form submission
workoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedType = workoutType.value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value;
    
    // Create workout object based on type
    let workoutData = {
        type: selectedType,
        date: date,
        notes: notes,
        timestamp: new Date().getTime()
    };
    
    // Add type-specific data
    switch(selectedType) {
        case 'weights':
            workoutData.exercise = document.getElementById('weights-exercise').value;
            workoutData.weight = document.getElementById('weight').value;
            workoutData.reps = document.getElementById('reps').value;
            workoutData.sets = document.getElementById('sets').value;
            break;
        case 'running':
            workoutData.activity = document.getElementById('running-activity').value;
            workoutData.distance = document.getElementById('distance').value;
            workoutData.time = document.getElementById('run-time').value;
            break;
        case 'hiit':
            workoutData.workout = document.getElementById('hiit-workout').value;
            workoutData.duration = document.getElementById('duration').value;
            break;
        case 'cardio':
            workoutData.activity = document.getElementById('cardio-activity').value;
            workoutData.duration = document.getElementById('cardio-duration').value;
            workoutData.calories = document.getElementById('calories').value;
            break;
        case 'yoga':
            workoutData.classType = document.getElementById('yoga-type').value;
            workoutData.duration = document.getElementById('yoga-duration').value;
            workoutData.difficulty = document.getElementById('difficulty').value;
            break;
        case 'other':
            workoutData.activity = document.getElementById('other-activity').value;
            workoutData.details = document.getElementById('other-details').value;
            break;
    }
    
    // Save to localStorage
    saveWorkout(workoutData);
    
    // Reset form
    workoutForm.reset();
    document.getElementById('date-field').style.display = 'none';
    document.getElementById('common-fields').style.display = 'none';
    const allFields = document.querySelectorAll('.workout-fields');
    allFields.forEach(field => field.style.display = 'none');
    
    // Refresh history display
    displayWorkouts();
});

// Save workout to localStorage
function saveWorkout(workout) {
    let workouts = getWorkouts();
    workouts.push(workout);
    localStorage.setItem('mffit-workouts', JSON.stringify(workouts));
}

// Get workouts from localStorage
function getWorkouts() {
    const workouts = localStorage.getItem('mffit-workouts');
    return workouts ? JSON.parse(workouts) : [];
}

// Display workouts
function displayWorkouts() {
    const workouts = getWorkouts();
    
    if (workouts.length === 0) {
        workoutHistory.innerHTML = '<p class="no-workouts">No workouts logged yet. Start tracking your fitness journey!</p>';
        return;
    }
    
    // Sort by date (most recent first)
    workouts.sort((a, b) => b.timestamp - a.timestamp);
    
    let html = '';
    workouts.forEach(workout => {
        html += `<div class="workout-item" data-type="${workout.type}">`;
        html += `<h3>${formatWorkoutType(workout.type)} - ${formatDate(workout.date)}</h3>`;
        html += '<ul>';
        
        // Add type-specific details
        switch(workout.type) {
            case 'weights':
                if (workout.exercise) html += `<li><strong>Exercise:</strong> ${workout.exercise}</li>`;
                if (workout.weight) html += `<li><strong>Weight:</strong> ${workout.weight} lbs</li>`;
                if (workout.reps) html += `<li><strong>Reps:</strong> ${workout.reps}</li>`;
                if (workout.sets) html += `<li><strong>Sets:</strong> ${workout.sets}</li>`;
                break;
            case 'running':
                if (workout.activity) html += `<li><strong>Activity:</strong> ${workout.activity}</li>`;
                if (workout.distance) html += `<li><strong>Distance:</strong> ${workout.distance} miles</li>`;
                if (workout.time) html += `<li><strong>Time:</strong> ${workout.time}</li>`;
                break;
            case 'hiit':
                if (workout.workout) html += `<li><strong>Workout:</strong> ${workout.workout}</li>`;
                if (workout.duration) html += `<li><strong>Duration:</strong> ${workout.duration} minutes</li>`;
                break;
            case 'cardio':
                if (workout.activity) html += `<li><strong>Activity:</strong> ${workout.activity}</li>`;
                if (workout.duration) html += `<li><strong>Duration:</strong> ${workout.duration} minutes</li>`;
                if (workout.calories) html += `<li><strong>Calories:</strong> ${workout.calories}</li>`;
                break;
            case 'yoga':
                if (workout.classType) html += `<li><strong>Class Type:</strong> ${workout.classType}</li>`;
                if (workout.duration) html += `<li><strong>Duration:</strong> ${workout.duration} minutes</li>`;
                if (workout.difficulty) html += `<li><strong>Difficulty:</strong> ${workout.difficulty}</li>`;
                break;
            case 'other':
                if (workout.activity) html += `<li><strong>Activity:</strong> ${workout.activity}</li>`;
                if (workout.details) html += `<li><strong>Details:</strong> ${workout.details}</li>`;
                break;
        }
        
        if (workout.notes) {
            html += `<li><strong>Notes:</strong> ${workout.notes}</li>`;
        }
        
        html += '</ul>';
        html += '</div>';
    });
    
    workoutHistory.innerHTML = html;
}

// Format workout type for display
function formatWorkoutType(type) {
    const types = {
        'weights': 'Weights/Strength Training',
        'running': 'Running',
        'hiit': 'HIIT',
        'cardio': 'Cardio',
        'yoga': 'Yoga',
        'other': 'Other'
    };
    return types[type] || type;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load workouts on page load
document.addEventListener('DOMContentLoaded', displayWorkouts);
