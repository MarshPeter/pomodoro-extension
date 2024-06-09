
const pomodoroState = {
    timerActive: false,
    currentTimer: null,
    currentValue: 0,
    finishTime: null,
    blockList: [],
}

function speak() {
    chrome.tts.speak("Pomodoro Complete!");
}

function handleTime(finishTime, pomodoroState) {
    let diff = finishTime - Date.now();
    pomodoroState.currentValue = diff;

    if (diff < 0) {
        clearInterval(pomodoroState.currentTimer);
        pomodoroState.timerActive = false;
        speak();
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'retrieveState') {
        if (pomodoroState.timerActive && pomodoroState.currentValue <= 0) {
            clearInterval(pomodoroState.currentTimer);
            pomodoroState.timerActive = false;
            pomodoroState.currentValue = 0;
            pomodoroState.finishTime = null;
        }
        sendResponse({action: 'intervalUpdate', value: pomodoroState.finishTime, blockList: pomodoroState.blockList});
    }
    if (message.action === 'startInterval') {
        const timer = setInterval(() => {handleTime(new Date(message.finishTime), pomodoroState)})
        pomodoroState.currentTimer = timer;
        pomodoroState.finishTime = message.finishTime;
    }
    if (message.action === 'addToBlockList') {
        pomodoroState.blockList.push(message.website);
        console.log(pomodoroState.blockList);
    }
    if (message.action === 'removeFromBlockList') {
        pomodoroState.blockList = pomodoroState.blockList.filter(url => url !== message.website);
        console.log(pomodoroState.blockList);
    }
    if (message.action === 'stopInterval') {
        if (pomodoroState.timerActive) {
            clearInterval(pomodoroState.currentTimer);
            pomodoroState.timerActive = false;
            pomodoroState.currentValue = 0;
            pomodoroState.finishTime = null;
        }
    }
})