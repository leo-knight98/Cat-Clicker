window.onload = function() {
    const SCORE_ELEMENT = document.getElementById('score');
    const PER_SECOND = document.getElementById('cats-per-second');
    const CAT = document.getElementById('cat-img');
    const BUY_CURSOR = document.getElementById('buy_cursor');
    const CURSOR_COST = document.getElementById('cursor-cost');
    const CURSOR_AMOUNT = document.getElementById('cursors');
    const BUY_SCRATCHER = document.getElementById('buy_scratcher');
    const SCRATCHER_COST = document.getElementById('scratcher-cost');
    const SCRATCHER_AMOUNT = document.getElementById('scratchers');
    const BUY_LITTER_BOX = document.getElementById('buy_litter_box');
    const BOX_COST = document.getElementById('box-cost');
    const BOX_AMOUNT = document.getElementById('boxes');
    const SAVE = document.getElementById('save');

    let score = 0;
    let scorePerSecond = 0;
    let name = "Timmy";
    let amount = 1;
    let cursorCost = 15;
    let cursorAmount = 0;
    let scratcherCost = 100;
    let scratcherAmount = 0;
    let boxCost = 520;
    let boxAmount = 0;

    SCORE_ELEMENT.innerHTML = score;
    PER_SECOND.innerHTML = scorePerSecond;
    
    CAT.addEventListener('click', function() {
        score = score + amount;
        SCORE_ELEMENT.innerHTML = score;
    });

    BUY_CURSOR.addEventListener('click', function() {
        if(score >= cursorCost) {
            score = score - cursorCost;
            SCORE_ELEMENT.innerHTML = score;
            cursorCost = Math.round(cursorCost * 1.15);
            cursorAmount = cursorAmount + 1;

            CURSOR_COST.innerHTML = cursorCost;
            CURSOR_AMOUNT.innerHTML = cursorAmount;
            updateScorePerSecond()
        }
    });

    BUY_SCRATCHER.addEventListener('click', function() {
        if(score >= scratcherCost) {
            score = score - scratcherCost;
            SCORE_ELEMENT.innerHTML = score;
            scratcherCost = Math.round(scratcherCost * 1.15);
            scratcherAmount = scratcherAmount + 1;

            SCRATCHER_COST.innerHTML = scratcherCost;
            SCRATCHER_AMOUNT.innerHTML = scratcherAmount;
            updateScorePerSecond()
        }
    });

    BUY_LITTER_BOX.addEventListener('click', function() {
        if(score >= boxCost) {
            score = score - boxCost;
            SCORE_ELEMENT.innerHTML = score;
            boxCost = Math.round(boxCost * 1.15);
            boxAmount = boxAmount + 1;

            BOX_COST.innerHTML = boxCost;
            BOX_AMOUNT.innerHTML = boxAmount;
            updateScorePerSecond()
        }
    });

    function updateScorePerSecond() {
        scorePerSecond = cursorAmount + (scratcherAmount * 5) + (boxAmount * 25);
        PER_SECOND.innerHTML = scorePerSecond;
    }

    setInterval(function() {
        score = score + (amount * cursorAmount);
        score = score + ((amount * 5) * scratcherAmount) + ((amount * 25) * boxAmount); 
        SCORE_ELEMENT.innerHTML = score;
        document.title = score + " cats - Cat clicker!"
    }, 1000);

    SAVE.addEventListener('click', saveGame());

    function saveGame() {
        let gameSave = {
            score: score,
            amount: amount,
            cursorCost: cursorCost,
            cursorAmount: cursorAmount,
            scratcherAmount: scratcherAmount,
            scratcherCost: scratcherCost,
            boxAmount: boxAmount,
            boxCost: boxCost
        };

        localStorage.setItem('gameSave', JSON.stringify(gameSave));
    }

    setInterval(function() {
        saveGame()
    }, 30000);
}

