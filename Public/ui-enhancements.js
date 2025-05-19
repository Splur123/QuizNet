// QuizNet loading and UI enhancements

// Add loading spinner when submitting forms or loading quizzes
document.addEventListener('DOMContentLoaded', function() {
  // Add loading behavior to all forms
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      
      if (submitBtn) {
        // Replace button text with loading spinner
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 10px;"></div> Loading...';
        submitBtn.disabled = true;
        
        // Re-enable after a timeout in case of network issues
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 8000); // 8 second timeout
      }
    });
  });

  // Add smooth transitions to quiz cards when they load
  const quizCards = document.querySelectorAll('.quiz-card');
  quizCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 100)); // Stagger the animations
  });
  
  // Add hover sound effect for buttons if browser supports Web Audio API
  if (window.AudioContext || window.webkitAudioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        // Create a subtle hover sound
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0, audioCtx.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      });
    });
  }
});

// Add dark mode toggle functionality
const addDarkModeToggle = () => {
  // Create toggle button
  const darkModeToggle = document.createElement('div');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
  darkModeToggle.setAttribute('role', 'button');
  darkModeToggle.setAttribute('tabindex', '0');
  
  // Create SVG icon
  darkModeToggle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10v-20zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/>
    </svg>
  `;
  
  document.body.appendChild(darkModeToggle);
  
  // Toggle dark mode class
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Save preference to local storage
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('quiznet-light-mode', isLightMode ? 'true' : 'false');
  });
  
  // Check for saved preference
  const savedMode = localStorage.getItem('quiznet-light-mode');
  if (savedMode === 'true') {
    document.body.classList.add('light-mode');
  }
};

// Call the function when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addDarkModeToggle);
} else {
  addDarkModeToggle();
}
