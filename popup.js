const startPomodoroButton = document.querySelector(".pomo-start-btn");

let pomodoroState = {
    timerActive: false,
    currentTimer: null,
}

currentTimer = startPomodoroButton.addEventListener('mousedown', () => {startPomodoro(pomodoroState)});

function getFinishTime(minutes) {
    return new Date(Date.now() + minutes * 60000);
}

function getSeconds(durationRemaining) {
    return Math.floor(durationRemaining / 1000) % 60;
}

function getMinutes(durationRemaining) {
    return Math.floor(durationRemaining / (1000 * 60)) % 60;
}

function getHours(durationRemaining) {
    return Math.floor(durationRemaining / (1000 * 60 * 60)) % 60;
}

function handleTime(finishTime) {
    const timer = document.querySelector(".timer__p");
    let diff = finishTime - Date.now();
    let hours = getHours(diff);
    let minutes = getMinutes(diff);
    let seconds = getSeconds(diff);
    timer.innerText = `${hours}:${minutes}:${seconds}`;
}

function startPomodoro(pomodoroState) {
    if (pomodoroState.timerActive) {
        clearInterval(pomodoroState.currentTimer);
    }
    const minutesSelected = document.querySelector("#pom_duration_min")
    const timeAllotted = minutesSelected.value ? minutesSelected.value : 25;
    const finishTime = getFinishTime(timeAllotted);

    pomodoroState.timerActive = true;
    pomodoroState.currentTimer = setInterval(() => {handleTime(finishTime);}, 1000);
}

