let game = {
    score: 0,
    totalScore: 0,
    totalClicks: 0,
    clickValue: 1,
    version: 0.000,

    addToScore: function(amount) {
        this.score += amount;
        this.totalScore += amount;
        display.updateScore();
    },

    getScorePerSecond: function() {
        let scorePerSecond = 0;
        for(let i = 0; i < building.name.length; i++) {
            scorePerSecond += building.income[i] * building.count[i]; 
        }
        return scorePerSecond;
    },
};

let building = {
    name: ["Cursor", "Scratcher", "Litter_box"],
    image: ["img/cursor.png", "img/scratcher.png", "img/litter.png"],
    count:[0, 0, 0],
    income:[1, 10, 25],
    cost:[15, 100, 520],

    purchase: function(index) {
        if(game.score >= this.cost[index]) {
            game.score -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.15);
            display.updateScore();
            display.updateShop();
        }
    },
}

let display = {
    updateScore: function() {
        document.getElementById('score').innerHTML = game.score;
        document.getElementById('cats-per-second').innerHTML = game.getScorePerSecond();
        document.title = game.score + ' cats - Cat clicker!'
    },

    updateShop: function() {
        document.getElementById('shopContainer').innerHTML = ""
        for(let i = 0; i < building.name.length; i++) {
            
            document.getElementById('shopContainer').innerHTML += "<div class='table' onclick='building.purchase("+i+")'><div class='image'><img src="+ building.image[i] + " /></div><div class='item-cost'><p>" + building.name[i]+ "</p><p><span>"+building.cost[i]+"</span> cats</p></div><div id='amount'><p>"+building.count[i]+"</p></div></div>";
        }
    },
};

function saveGame() {
    let gameSave = {
        score: game.score,
        totalScore: 0,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost
    };
    window.localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() { 
    if(window.localStorage.getItem("gameSave") !== null) {
        let gameSave = JSON.parse(window.localStorage.getItem("gameSave"));
        if(typeof gameSave.score !== undefined) game.score = gameSave.score;
        if(typeof gameSave.totalScore !== undefined) game.amount = gameSave.totalScore;
        if(typeof gameSave.totalClicks !== undefined) game.totalClicks = gameSave.totalClicks;
        if(typeof gameSave.clickValue !== undefined) game.clickValue = gameSave.clickValue;
        if(typeof gameSave.version !== undefined) game.version = gameSave.version;
        if(typeof gameSave.buildingCount !== undefined) {
            for(let i = 0; i < gameSave.buildingCount.length; i++) {
                building.count[i] = gameSave.buildingCount[i];
            }
        }
        if(typeof gameSave.buildingIncome !== undefined) {
            for(let i = 0; i < gameSave.buildingIncome.length; i++) {
                building.income[i] = gameSave.buildingIncome[i];
            }
        }
        if(typeof gameSave.buildingCost !== undefined) {
            for(let i = 0; i < gameSave.buildingCost.length; i++) {
                building.cost[i] = gameSave.buildingCost[i];
            }
        }
    }
}

function resetGame() {
    if(confirm("Are you sure you want to reset your game")) {
        let gameSave = {
            score: 0,
            totalScore: 0,
            totalClicks: 0,
            clickValue: 1,
            version: 0.000,
            buildingCount: [0, 0, 0],
            buildingIncome: [1, 10, 25],
            buildingCost: [15, 100, 520]
        };
        window.localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
}

document.addEventListener('keydown', function(event){
    if(event.ctrlKey && event.key == 's') {
        event.preventDefault();
        saveGame();
    }
}, false);

window.onload = function() {
    loadGame();
    display.updateScore();
    display.updateShop();
}

setInterval(function() {
    game.addToScore(game.getScorePerSecond());
    game.totalScore += game.getScorePerSecond();
    display.updateScore(); 
}, 1000)