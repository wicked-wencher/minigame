// Game Elements
const allBlock = document.getElementsByClassName("move_box");
const block = document.getElementsByClassName("block");
const scoreShow = document.getElementById("score");

// Screens
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const screen3 = document.getElementById("screen3");
const screen4 = document.getElementById("screen4");
const leaderboard = document.getElementById("leaderboard");

// Game State
let position = 0;
let speed = 28;
let level = 1;
let t;
let clear = false;
let score = 0;
let status = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Initialize game
const start = () => {
  document.getElementById("start").style.display = "none";
  screen1.classList.add("hidden");
  screen2.classList.add("visible");
  t = setInterval(move, speed);
  
  for (let i = 0; i < 24; i++) {
    block[i].addEventListener("click", () => play(i));
  }
  
  moveColor();
};

// Game Logic
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const move = () => {
  if (clear) {
    clearInterval(t);
    return;
  }
  if (position === 104) {
    position = 0;
    moveColor();
  }
  position += 1;
  allBlock[0].style.transform = `translateY(${-position}px)`;
};

const moveColor = () => {
  if (status[0][0] + status[0][1] + status[0][2] + status[0][3] === 1) {
    stop(2);
  }
  
  for (let i = 0; i < 5; i++) {
    status[i] = status[i + 1];
  }
  
  let a = [0, 1, 2, 3];
  shuffle(a);
  status[5] = [0, 0, 0, 0];
  status[5][a[0]] = 1;
  colorBlock();
};

const colorBlock = () => {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const cellStatus = status[i][j];
      
      block[index].innerHTML = "";
      block[index].className = "block";
      
      if (cellStatus === 0) {
        block[index].classList.add("white");
      } else if (cellStatus === 1) {
        block[index].classList.add("black");
        block[index].innerHTML = "<i class='fas fa-virus'></i>";
      } else {
        block[index].classList.add("green");
        block[index].innerHTML = "<i class='fas fa-virus-slash'></i>";
      }
    }
  }
};

function play(i) {
  const row = Math.floor(i / 4);
  const column = i % 4;

  if (status[row][column] === 1) {
    status[row][column] = 2;
    score += level;
    updateLevel();
    scoreShow.textContent = score;
    colorBlock();
  } else if (status[row][column] === 0) {
    stop(1);
  }
}

function updateLevel() {
  if (score >= 7 && score <= 25) level = 2;
  else if (score > 25 && score <= 60) level = 3;
  else if (score > 60 && score <= 100) level = 4;
  else if (score > 100 && score <= 150) level = 5;
  else if (score > 150 && score <= 220) level = 6;
  else if (score > 220 && score <= 300) level = 7;
  else if (score > 300 && score <= 500) level = 8;
  else if (score > 500 && score <= 1000) level = 9;
  else if (score > 1000) level = 10;

  document.getElementById("level").textContent = level;
  const prevSpeed = speed;
  speed = 28 - level;
  
  if (speed < prevSpeed) {
    clearInterval(t);
    t = setInterval(move, speed);
  }
}

// Leaderboard Functions
async function saveScore() {
  const username = prompt("Enter your name for the leaderboard:", "Player");
  if (!username) return;

  try {
    const response = await fetch('http://localhost:3000/add-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score, level })
    });

    if (!response.ok) throw new Error('Failed to save score');
    const data = await response.json();
    console.log('Score saved:', data);
  } catch (error) {
    console.error('Error saving score:', error);
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch('http://localhost:3000/leaderboard');
    const data = await response.json();
    
    leaderboard.innerHTML = '';
    
    if (data.length === 0) {
      leaderboard.innerHTML = '<p>No scores yet!</p>';
      return;
    }
    
    const header = document.createElement('h2');
    header.textContent = 'Top Scores';
    leaderboard.appendChild(header);
    
    const list = document.createElement('ol');
    list.className = 'leaderboard-list';
    
    data.forEach((entry, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'leaderboard-entry';
      
      listItem.innerHTML = `
        <span class="leaderboard-rank">${index + 1}.</span>
        <span class="leaderboard-name">${entry.username}</span>
        <span class="leaderboard-score">${entry.score}</span>
        <span class="leaderboard-level">Lvl ${entry.level}</span>
      `;
      
      list.appendChild(listItem);
    });
    
    leaderboard.appendChild(list);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    leaderboard.innerHTML = '<p class="error">Error loading leaderboard</p>';
  }
}

// Screen Navigation
function showLeaderboard() {
  screen2.classList.remove("visible");
  screen4.classList.add("show");
  fetchLeaderboard();
  //smooth scroll
  screen4.scrollIntoView({ behavior: 'smooth' });
}

function showGameScreen() {
  //screen4.classList.remove("show");
  //screen2.classList.add("visible");
  //screen2.classList.add("visible"); // Show the game screen
  screen4.classList.remove("show"); // Hide the leaderboard screen
  screen1.classList.remove("hidden"); // Show the welcome screen
  screen1.classList.add("visible"); // Ensure the welcome screen is visible
  screen2.classList.remove("visible"); // Hide the game screen if it's currently visible

  screen1.scrollIntoView({ behavior: 'smooth' });
}

function stop(value) {
  clear = true;
  document.getElementById("final").textContent = score;
  screen3.classList.add("show");
  
  document.getElementById("message").textContent = 
    value === 1 ? "Clicked the white tile" : "Virus Missed";
  
  saveScore();
}
//
// Event Listeners
document.getElementById("showLeaderboardBtn").addEventListener("click", showLeaderboard);
document.getElementById("backToGameBtn").addEventListener("click", showGameScreen);

// Initialize
window.onload = fetchLeaderboard;