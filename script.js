class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60;
        this.timerId = null;
        this.isRunning = false;
        this.mode = 'pomodoro'; // pomodoro, shortBreak, longBreak
        // DOM Elements
        this.timeDisplay = document.querySelector('.time-text');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.circle = document.querySelector('.progress-ring__circle');
        // Circle config
        this.radius = this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
        // Configuration
        this.modes = {
            pomodoro: { time: 25 * 60, color: '#A5D6A7' },
            shortBreak: { time: 5 * 60, color: '#90CAF9' },
            longBreak: { time: 15 * 60, color: '#CE93D8' }
        };
        this.init();
    }
    init() {
        this.updateDisplay();
        this.setProgress(100); // Start full
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });
    }
    switchMode(newMode) {
        this.mode = newMode;
        this.pauseTimer();
        this.timeLeft = this.modes[newMode].time;
        // Update UI
        this.modeBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${newMode}"]`).classList.add('active');
        // Update Color
        document.documentElement.style.setProperty('--primary-color', this.modes[newMode].color);
        this.updateDisplay();
        this.setProgress(100);
    }
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    startTimer() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';
        this.startBtn.style.opacity = '0.9';
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            const totalTime = this.modes[this.mode].time;
            const progress = (this.timeLeft / totalTime) * 100;
            this.setProgress(progress);
            if (this.timeLeft <= 0) {
                this.completeTimer();
            }
        }, 1000);
    }
    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.startBtn.textContent = 'Start';
        this.startBtn.style.opacity = '1';
    }
    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.modes[this.mode].time;
        this.updateDisplay();
        this.setProgress(100);
    }
    completeTimer() {
        this.pauseTimer();
        // Play sound or notification here
        alert('Time is up!'); // Simple alert for now, can be replaced with audio
        this.resetTimer();
    }
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.title = `${this.timeDisplay.textContent} - Focus Flow`;
    }
    setProgress(percent) {
        const offset = this.circumference - (percent / 100) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const app = new PomodoroTimer();
});
