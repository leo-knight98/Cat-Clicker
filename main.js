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
    name: ["Cursor", "Scratcher", "Litter box", "Cat food"],
    image: ["img/cursor.png", "img/scratcher.png", "img/litter.png", "img/cat_food.jpg"],
    count:[0, 0, 0, 0],
    income:[1, 10, 25, 120],
    cost:[15, 100, 520, 1000],

    purchase: function(index) {
        if(game.score >= this.cost[index]) {
            game.score -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.15);
            display.updateScore();
            display.updateShop();
            display.updateUpgrades();
        }
    },
};

let upgrade = {
    name: ["Stone fingers", "Iron fingers", "Stone clicker"],
    description: ["Cursors are twice as efficient", "Cursors are twice as efficient", "The mouse is twice as efficient"],
    image: ["img/cursor.png", "img/cursor.png", "img/cursor.png"],
    type: ["building", "building", "click"],
    cost: [300, 500, 300],
    buildingIndex: [0, 0, -1],
    bonus: [2, 2, 2],
    requirement: [1, 5, 1],
    purchased: [false, false, false],

    purchase: function(index) {
        if(!this.purchased[index] && game.score >= this.cost[index]) {
            if(this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
                display.updateScore();
            } else if(this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
                game.score -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
                display.updateScore();
            }
        }
    },
};

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

    updateUpgrades: function() {
        document.getElementById('upgradeContainer').innerHTML = "";
        for(let i = 0; i < upgrade.name.length; i++) {
            if(!upgrade.purchased[i]) {
                if((upgrade.type[i] == "building") && (building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i])) {
                    document.getElementById('upgradeContainer').innerHTML += "<img src='"+upgrade.image[i]+"' title='" + upgrade.name[i] + " &#10; " + upgrade.description[i] + " &#10; " + upgrade.cost[i] + " cats' onclick='upgrade.purchase("+i+")' />"
                } else if(upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById('upgradeContainer').innerHTML += "<img src='"+upgrade.image[i]+"' title='" + upgrade.name[i] + " &#10; " + upgrade.description[i] + " &#10; " + upgrade.cost[i] + " cats' onclick='upgrade.purchase("+i+")' />"
                }
            }
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
        buildingCost: building.cost, 
        upgradePurchased: upgrade.purchased
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

        if(typeof gameSave.upgradePurchased !== undefined) {
            for(let i = 0; i < gameSave.upgradePurchased.length; i++) {
                upgrade.purchased[i] = gameSave.upgradePurchased[i];
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
            buildingCount: [0, 0, 0, 0],
            buildingIncome: [1, 10, 25, 100],
            buildingCost: [15, 100, 520, 1000],
            upgradePurchased: [false, false, false]
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

document.getElementById("clicker").addEventListener('click', function() {
    game.totalClicks++;
    game.addToScore(game.clickValue);
}, false);

window.onload = function() {
    loadGame();
    display.updateScore();
    display.updateShop();
    display.updateUpgrades();
}

setInterval(function() {
    game.addToScore(game.getScorePerSecond());
    game.totalScore += game.getScorePerSecond();
    display.updateScore(); 
}, 1000)

setInterval(function() {
    display.updateScore();
    display.updateUpgrades();
}, 10000)