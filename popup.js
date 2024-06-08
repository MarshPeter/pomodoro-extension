const startPomodoroButton = document.querySelector(".pomo-start-btn");

let pomodoroState = {
    timerActive: false,
    currentTimer: null,
}

currentTimer = startPomodoroButton.addEventListener('mousedown', () => {startPomodoro(pomodoroState)});
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({action: 'retrieveValue'}, (response) => {
        // 0 is falsey 
        console.log("hello");
        if (response.value) {
            console.log("hello 2");
            pomodoroState.timerActive = true;
            pomodoroState.currentTimer = setInterval(() => {handleTime(new Date(response.value), pomodoroState);}, 1000);
        }
    })
})

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

function handleTime(finishTime, pomodoroState) {
    const timer = document.querySelector(".timer__p");
    let diff = finishTime - Date.now();
    let hours = getHours(diff);
    let minutes = getMinutes(diff);
    let seconds = getSeconds(diff);
    timer.innerText = `${hours}:${minutes}:${seconds}`;

    if (diff < 0) {
        timer.innerText = "00:00:00";
        clearInterval(pomodoroState.currentTimer);
        pomodoroState.timerActive = false;
    }
}

function startPomodoro(pomodoroState) {
    if (pomodoroState.timerActive) {
        clearInterval(pomodoroState.currentTimer);
    }
    const minutesSelected = document.querySelector("#pom_duration_min")
    const timeAllotted = minutesSelected.value ? minutesSelected.value : 25;
    const finishTime = getFinishTime(timeAllotted);
    console.log(finishTime instanceof Date);

    pomodoroState.timerActive = true;
    pomodoroState.currentTimer = setInterval(() => {handleTime(finishTime, pomodoroState);}, 1000);
    chrome.runtime.sendMessage({action: 'startInterval', finishTime: finishTime});
}

