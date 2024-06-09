const startPomodoroButton = document.querySelector(".pomo-start-btn");
const blockListAddButton = document.querySelector("#blockListAdd");

let pomodoroState = {
    timerActive: false,
    currentTimer: null,
    blockList: [],
}

startPomodoroButton.addEventListener('mousedown', () => {startPomodoro(pomodoroState)});
blockListAddButton.addEventListener('mousedown', () => {addToBlockList(pomodoroState)});

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({action: 'retrieveState'}, (response) => {
        // 0 is falsey 
        console.log("hello");
        if (response.value) {
            console.log("hello 2");
            pomodoroState.timerActive = true;
            pomodoroState.currentTimer = setInterval(() => {handleTime(new Date(response.value), pomodoroState);}, 1000);
        }
        pomodoroState.blockList = response.blockList;
        generateUrlList(pomodoroState);
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
        chrome.runtime.sendMessage({action: 'stopInterval'})
    }
    const minutesSelected = document.querySelector("#pom_duration_min")
    const timeAllotted = minutesSelected.value ? minutesSelected.value : 25;
    const finishTime = getFinishTime(timeAllotted);
    console.log(finishTime instanceof Date);

    pomodoroState.timerActive = true;
    pomodoroState.currentTimer = setInterval(() => {handleTime(finishTime, pomodoroState);}, 1000);
    chrome.runtime.sendMessage({action: 'startInterval', finishTime: finishTime});
}

function generateUrlList(pomodoroState) {

    const blockListURLContainer = document.querySelector(".url-listing__container");

    while (blockListURLContainer.firstChild) {
        blockListURLContainer.removeChild(blockListURLContainer.lastChild);
    }

    for (let url of pomodoroState.blockList) {
        const listItem = createListingNode(url, pomodoroState);
        blockListURLContainer.appendChild(listItem);
    }
}

function createListingNode(url, pomodoroState) {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const btn = document.createElement('button');
    li.classList.add("url-listing");
    p.classList.add("url-listing-p");
    p.textContent = url;
    btn.type = "button";
    btn.classList.add("delete-btn");
    btn.textContent = "X";

    btn.addEventListener('mousedown', () => {
        chrome.runtime.sendMessage({action: 'removeFromBlockList', website: url});
        pomodoroState.blockList = pomodoroState.blockList.filter(url);
    });

    li.appendChild(p);
    li.appendChild(btn);

    return li;
}

function addToBlockList(pomodoroState) {
    const input = document.querySelector('#newBlocklistURLInput');
    if (input.value === "") {
        return;
    }

    if (!pomodoroState.blockList.includes(input.value)) {
        chrome.runtime.sendMessage({action: 'addToBlockList', website: input.value});
        pomodoroState.blockList.push(input.value);
        generateUrlList(pomodoroState);
    }

    input.value = "";
}
