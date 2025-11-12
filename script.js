document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const totalCounter = document.getElementById('total-counter');
  const completedCounter = document.getElementById('completed-counter');
  const remainingCounter = document.getElementById('remaining-counter');
  const searchInput = document.getElementById('search-input');
  
  // Load tasks from localStorage if available
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Initialize the app
  renderTasks();
  updateCounters();
  
  // Add task event listeners
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  // Add search functionality
  searchInput.addEventListener('input', function() {
    renderTasks();
  });
  
  function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
      taskInput.focus();
      return;
    }
    
    // Create new task object
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Update UI
    renderTasks();
    updateCounters();
  }
  
  function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Get search term
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Filter tasks based on search
    let filteredTasks = tasks;
    if (searchTerm) {
      filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filteredTasks.length === 0) {
      if (tasks.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        taskList.innerHTML = '<div class="no-results">No tasks found matching your search</div>';
      }
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Create task elements
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.dataset.id = task.id;
      
      // Highlight search term in task text
      let displayText = task.text;
      if (searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        displayText = task.text.replace(regex, '<span class="search-highlight">$1</span>');
      }
      
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text ${task.completed ? 'completed' : ''}">${displayText}</span>
        <div class="task-actions">
          <button class="task-btn edit-btn">Edit</button>
          <button class="task-btn delete-btn">Delete</button>
        </div>
      `;
      
      taskList.appendChild(taskItem);
      
      // Add event listeners for the task
      const checkbox = taskItem.querySelector('.task-checkbox');
      const editBtn = taskItem.querySelector('.edit-btn');
      const deleteBtn = taskItem.querySelector('.delete-btn');
      const taskText = taskItem.querySelector('.task-text');
      
      checkbox.addEventListener('change', function() {
        task.completed = this.checked;
        taskText.classList.toggle('completed', this.checked);
        saveTasks();
        updateCounters();
        // Re-render to update search highlighting if needed
        renderTasks();
      });
      
      editBtn.addEventListener('click', function() {
        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
          task.text = newText.trim();
          saveTasks();
          renderTasks();
          updateCounters();
        }
      });
      
      deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
          tasks = tasks.filter(t => t.id !== task.id);
          saveTasks();
          updateCounters();
          renderTasks();
        }
      });
    });
  }
  
  function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;
    
    totalCounter.textContent = total;
    completedCounter.textContent = completed;
    remainingCounter.textContent = remaining;
  }
  
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Simulate loading time
  setTimeout(function() {
    document.getElementById('loaderContainer').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }, 3000);
});