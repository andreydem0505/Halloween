class ScoreController {
    scoreElement = document.getElementById("score");
    score = Number(this.scoreElement.innerHTML);
    record = this.score;

    increaseScore(value) {
        this.score += value;

        // set record to max value
        if (this.score > this.record) this.record = this.score;

        this.setScore();
    }

    decreaseScore(value) {
        // the game is over, the score is 0
        if (this.score - value <= 0) {

            // clear the screen
            document.body.innerHTML = "";


            // create elements of the final screen
            let div = document.createElement("div");
            let h1 = document.createElement("h1");
            div.className = "game-over";
            h1.innerHTML = "Игра окончена";
            div.appendChild(h1);

            // the record text is appeared if the game was the best one
            if (localStorage.getItem("record") < this.record) {
                let recordH1 = document.createElement("h1");
                recordH1.innerHTML = "Ваш новый рекорд: " + this.record;
                div.appendChild(recordH1);
                localStorage.setItem("record", String(this.record));
            }

            // reload button
            let button = document.createElement("button");
            button.id = "reload-btn";
            button.onclick = () => window.location.reload(false);
            button.innerHTML = "Начать заново";
            div.appendChild(button);

            // donate link
            let donateDiv = document.createElement("div");
            donateDiv.style.marginTop = "100px";
            let donate = document.createElement("a");
            donate.href = "https://andreydem0505.github.io/Halloween/donate.html"
            donate.innerHTML = "Поддержать автора";
            donateDiv.appendChild(donate)
            div.appendChild(donateDiv);

            document.body.appendChild(div);

            // stop all the intervals
            let killId = setTimeout(function() {
                for (let i = killId; i > 0; i--) clearInterval(i)
            }, 100);
        } else
            this.score -= value;
        this.setScore();
    }

    // display the score on the screen
    setScore() {
        this.scoreElement.innerHTML = String(this.score);
    }
}

function moveBasket(x) {
    if (x <= halfWidth)
        basket.style.left = '0';
    else if (x >= window.innerWidth - halfWidth)
        basket.style.left = window.innerWidth - basket.offsetWidth + 'px';
    else
        basket.style.left = x - halfWidth + 'px';
}

// random x coordinate of the pumpkin
function randomPumpkinX(pumpkin) {
    pumpkin.style.left = Math.floor(Math.random() * (window.innerWidth - pumpkinSize)) + "px";
}

function addPumpkin() {
    // create pumpkin
    let pumpkin = document.createElement("img");
    pumpkin.src = "pumpkin.png";
    pumpkin.className = "pumpkin";
    pumpkin.width = pumpkinSize;
    let top = -pumpkinSize;
    randomPumpkinX(pumpkin);
    document.body.insertBefore(pumpkin, basket);

    // add the movement and behavior to the pumpkin
    try {
        setInterval(() => {
            // put the pumpkin down
            top += speed;
            pumpkin.style.top = top + "px";

            // check the final position of the pumpkin
            if (top >= window.innerHeight - 100 && pumpkin.x > basket.x - 20 && pumpkin.x < basket.x + basket.offsetWidth - pumpkinSize + 20) {
                top = -pumpkinSize;
                randomPumpkinX(pumpkin);
                scoreController.increaseScore(1);
            } else if (top >= window.innerHeight - pumpkinSize - speed) {
                top = -pumpkinSize;
                randomPumpkinX(pumpkin);
                scoreController.decreaseScore(1);
            }
        }, 10);
    } catch (e) {}
}

// initialize base elements
let basket = document.getElementById("basket");
const record = localStorage.getItem("record");
document.getElementById("record").innerHTML = "Рекорд: " + (record == null ? "0" : record);
const halfWidth = basket.offsetWidth / 2;
const pumpkinSize = 50;
let speed = 2;
const scoreController = new ScoreController();

document.addEventListener("mousemove", e => moveBasket(e.pageX));

// for the mobile device
document.addEventListener("touchmove", e => moveBasket(e.changedTouches[0].clientX));

document.addEventListener("DOMContentLoaded", () => {
    addPumpkin();
    setInterval(() => addPumpkin(), 10_000);
});