let timeStamp = performance.now();

let checkFlag = false; // Flag to check if the button is already checked

const maxLevel = 75; // Maximum level for an arc

let arcs = [
    {
        'value': 0,
        'multiplier': 1,
        'currentMultiplier': -1,
        'time': 1,
        'unlocked': false,
        'color': '#FF0000',
        'price': 0,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    }, {
        'value': 0,
        'multiplier': 100,
        'currentMultiplier': -1,
        'time': 2.5,
        'unlocked': false,
        'color': '#FFA500',
        'price': 5000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 500,
        'currentMultiplier': -1,
        'time': 5,
        'unlocked': false,
        'color': '#FFFF00',
        'price': 25000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked,
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 15000,
        'currentMultiplier': -1,
        'time': 10,
        'unlocked': false,
        'color': '#a1d873',
        'price': 100000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked,
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 50000,
        'currentMultiplier': -1,
        'time': 15,
        'unlocked': false,
        'color': '#51fab9',
        'price': 1000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 1000000,
        'currentMultiplier': -1,
        'time': 20,
        'unlocked': false,
        'color': '#69b3f8',
        'price': 10000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked,
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 2500000,
        'currentMultiplier': -1,
        'time': 30,
        'unlocked': false,
        'color': '#884de7',
        'price': 100000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked,
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 35000000,
        'currentMultiplier': -1,
        'time': 50,
        'unlocked': false,
        'color': '#a04de7',
        'price': 1000000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 200000000,
        'currentMultiplier': -1,
        'time': 75,
        'unlocked': false,
        'color': '#e74de7',
        'price': 10000000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    },
    {
        'value': 0,
        'multiplier': 2000000000,
        'currentMultiplier': -1,
        'time': 100,
        'unlocked': false,
        'color': '#d4d4d4',
        'price': 100000000000,
        'angle': 0,
        'level': 0, // level 0 = locked, > 0 = unlocked
        'levelUpPrice': -1, // Price to level up, -1 means no level up
    }
]

let totalScore = 0; // Default score
let totalMultiplier = 1; // Default multiplier from Prestige
let totalExpenses = 0; // Total expenses

const filler = Math.PI / 250; // How much to fill each frame

// Set clickvalue
const clickValue = Math.PI / 10; // How much to add on click

// Set default start angle
const startAngle = 0 - Math.PI / 2;

const lineWidth = 45;

const adjust = (color, amount) => {
    color = color.startsWith('#') ? color.slice(1) : color;

    let num = parseInt(color, 16);
    let r = (num >> 16) & 0xFF;
    let g = (num >> 8) & 0xFF;
    let b = num & 0xFF;

    // Adjust each component
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Recombine into hex
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();

};

const hexToRgb = (hex, addAlpha = undefined) => {
    // Remove '#' if present
    let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

    // Expand 3-digit hex to 6-digit
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }

    // Parse red, green, and blue components
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b}${addAlpha !== undefined ? `, ${addAlpha}` : ''})`;
}

// Store the button tags
let buttonTags = [];
// Store stat tags
let statTags = [];

let rot = 0;

window.onload = () => {
    // Disable context menu on right click
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); });

    const container = document.querySelector('.container');

    // Create a score bar
    const bar = document.createElement('div');
    bar.className = 'score-bar';

    const colors = arcs.map(arc => arc.color);

    for (let i = 0; i < colors.length * 2; i++) {
        const block = document.createElement('div');

        block.style.width = `calc(${(90 / (colors.length * 2))}% + 2em)`;

        let block_content = document.createElement('span');;

        if (i % 2 === 0) {
            var j = i / 2;
            block_content.className = `score-${j}`;
            block_content.textContent = '0';
            block_content.style.textShadow = `4px 4px 0 ${hexToRgb(adjust(colors[j], 0x30), 0.25)}`;
            block_content.style.color = adjust(colors[j], 0x30);
            block_content.style.fontSize = '3.5rem';
            block_content.style.justifyContent = 'end';
        } else {
            block_content.className = 'multiplier';
            block_content.textContent = '+';
            block_content.style.textShadow = '4 px 4px 0 rgba(255, 255, 255, 0.1)';
            block_content.style.fontSize = '2.4rem';
            block_content.style.justifyContent = 'center';
            block.style.width = '5rem';
        }

        if (i === colors.length * 2 - 1) block_content.textContent = '=';

        block_content.style.display = 'flex';

        block.appendChild(block_content);

        // Add to the score bar
        bar.appendChild(block);
    }

    // Hopefully this will not give me a stroke
    // So we add an element which tracks all expenses
    const expenseTracker = document.createElement('div');
    expenseTracker.className = 'expense-tracker';
    expenseTracker.style.display = 'flex';
    expenseTracker.style.flexDirection = 'row';
    expenseTracker.style.justifyContent = 'space-between';
    expenseTracker.style.width = '20%';
    expenseTracker.style.backgroundColor = 'transparent';
    expenseTracker.style.position = 'absolute';
    expenseTracker.style.top = '8em';
    expenseTracker.style.right = '0';
    expenseTracker.style.zIndex = '1000';
    expenseTracker.style.overflowY = 'auto';
    expenseTracker.style.color = '#fff';
    expenseTracker.style.fontFamily = 'Baloo, sans-serif';
    expenseTracker.style.padding = '0 0.5rem';

    // We add a symbol to the expense tracker
    const expenseHeader = document.createElement('span');
    expenseHeader.textContent = 'Spent:';
    expenseHeader.style.textShadow = '4px 4px 0 rgba(255, 255, 255, 0.1)';
    expenseHeader.style.fontSize = '2rem';

    // And here we complile all expenses
    const expenses = document.createElement('span');
    expenses.className = 'expenses';
    expenses.style.display = 'flex';
    expenses.style.backgroundColor = 'transparent';
    expenses.style.color = '#fff';
    expenses.style.fontFamily = 'Baloo, sans-serif';
    expenses.style.fontSize = '2rem';
    expenses.textContent = "0";

    // Create a button bar on the right side
    const buttonBar = document.createElement('div');
    buttonBar.className = 'button-bar';
    buttonBar.style.display = 'flex';
    buttonBar.style.flexDirection = 'column';
    buttonBar.style.alignItems = 'end';
    buttonBar.style.width = '14%';
    buttonBar.style.backgroundColor = 'transparent';
    buttonBar.style.position = 'absolute';
    buttonBar.style.top = '12rem';
    buttonBar.style.right = '0';
    buttonBar.style.zIndex = '1000';
    buttonBar.style.overflowY = 'auto';
    buttonBar.style.color = '#fff';
    buttonBar.style.fontFamily = 'Baloo, sans-serif';
    buttonBar.style.columnWidth = '100%';
    buttonBar.style.gap = '0.5rem';

    const statsBar = document.createElement('div');
    statsBar.className = 'stats-bar';
    statsBar.style.display = 'flex';
    statsBar.style.flexDirection = 'column';
    statsBar.style.alignItems = 'start';
    statsBar.style.width = '6%';
    statsBar.style.backgroundColor = 'transparent';
    statsBar.style.position = 'absolute';
    statsBar.style.top = '12rem';
    statsBar.style.right = '14%';
    statsBar.style.zIndex = '1000';
    statsBar.style.overflow = 'visible  ';
    statsBar.style.color = '#fff';
    statsBar.style.fontFamily = 'Baloo, sans-serif';
    statsBar.style.columnWidth = '100%';
    statsBar.style.gap = '0.5rem';

    container.appendChild(buttonBar);
    container.appendChild(statsBar);
    container.appendChild(expenseTracker);
    expenseTracker.appendChild(expenseHeader);
    expenseTracker.appendChild(expenses);

    let statsDisplays = [];

    arcs.forEach((arc, index) => {
        const speedDisplay = document.createElement('div');
        speedDisplay.className = `speed-display-${index}`;
        speedDisplay.style.width = '100%';
        speedDisplay.style.fontSize = '1.2rem';
        speedDisplay.style.color = arc.color;
        speedDisplay.style.textShadow = `4px 4px 0 ${hexToRgb(adjust(arc.color, 0x30), 0.25)}`;
        speedDisplay.style.height = "50%";
        speedDisplay.style.display = 'flex';
        speedDisplay.flexDirection = 'row';
        speedDisplay.style.justifyContent = 'space-between';
        speedDisplay.style.padding = '0 0.5em';

        const multDisplay = document.createElement('span');
        multDisplay.className = `multiplier-display-${index}`;
        multDisplay.style.fontSize = '1.2rem';
        multDisplay.style.color = arc.color;
        multDisplay.style.textShadow = `2px 2px 0 ${hexToRgb(adjust(arc.color, 0x30), 0.25)}`;
        multDisplay.style.height = "50%";
        multDisplay.style.display = 'flex';
        multDisplay.flexDirection = 'row';
        multDisplay.style.justifyContent = 'space-between';
        multDisplay.style.padding = '0 0.5em';

        const statBlock = document.createElement('div');
        statBlock.className = `stat-block-${index}`;
        statBlock.style.display = 'flex';
        statBlock.style.flexDirection = 'column';
        statBlock.style.width = '100%';
        statBlock.style.height = '5rem';
        statBlock.style.padding = '0.5rem 0';
        statBlock.style.boxShadow = '4px 6px 0 0 rgba(0, 0, 0, 0.3)';

        statBlock.appendChild(multDisplay);
        statBlock.appendChild(speedDisplay);

        statsDisplays.push(statBlock);
    });


    const buttonList = [];

    // We add the buttons to buy the arcs
    arcs.forEach((arc, index) => {
        const button = document.createElement('button');
        button.className = `arc-button-arc-${index}`;
        button.setAttribute('data-arc-index', index);
        button.innerHTML = 'Buy &mdash; ' + (arc.price == 0 ? "free" : `${shortenNumbers(arc.price)} &pi;`);
        button.style.backgroundColor = 'gray';
        button.style.color = 'black';
        button.style.display = 'inline-block';
        button.style.textShadow = `4px 4px 0 rgba(0, 0, 0, 0.2  )`;
        button.style.fontSize = '1.5rem';
        button.style.fontFamily = 'Baloo, sans-serif';
        button.style.width = 'calc(95% - 1rem)';
        button.style.height = '5rem';
        button.style.margin = '0 0.5rem';
        button.style.border = 'none';
        button.style.borderRadius = '0.5rem';
        button.style.cursor = 'default';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.transition = 'background-color 0.3s, color 0.3s, transform 0.2s';
        button.style.outline = 'none';
        button.style.right = 0;

        button.disabled = true; // Initially disabled

        button.addEventListener('click', () => {
            let price = 0;

            // We disable on max level
            if (arc.level >= maxLevel) {
                button.disabled = true;
                button.style.backgroundColor = 'gray';
                button.style.color = 'black';
                button.style.cursor = 'default';
                button.innerHTML = 'Max Level';
                return;
            }

            if (arc.unlocked) {
                if (totalScore < arc.levelUpPrice) return; // Not enough score to level up
                totalScore -= arc.levelUpPrice;
                arc.level++;
                arc.time *= 0.95; // Decrease time by 5% on level up
                arc.currentMultiplier = arc.multiplier * 1.5; // Increase multiplier by 50% on level

                price = arc.levelUpPrice; // Set price to level up price

                // Add to expenses
                totalExpenses += arc.levelUpPrice;
            }
            if (totalScore >= arc.price) {
                totalScore -= arc.price;
                arc.unlocked = true;
                button.disabled = true; // Disable the button after purchase, for now
                arc.level++;
                
                price = arc.price; // Set price to initial price

                // Add to expenses
                totalExpenses += arc.price;
            }

            if (arc.level === 1) {
                arc.levelUpPrice = Math.floor(Math.max(arc.price, 10) * 0.5);
            }
            else if (arc.level > 1) {
                arc.levelUpPrice = Math.floor(arc.levelUpPrice * 1.5);
            }

            expenses.textContent = shortenNumbers(totalExpenses);

            checkFlag = false;
            button.innerHTML = `Level ${arc.level + 1} &mdash; ${shortenNumbers(arc.levelUpPrice)} &pi;`;

            // Reset all values to default
            arc.value = index === 0 ? totalScore - price : 0;
        });

        buttonList.push(button);
    })

    buttonList.forEach(button => {
        if (!arcs[parseInt(button.getAttribute('data-arc-index'))].unlocked)
            buttonBar.appendChild(button);
    });

    // Add total sum thing
    const totalSum = document.createElement('div');
    totalSum.className = 'total-sum';
    totalSum.style.textShadow = '4px 4px 0 rgba(255, 255, 255, 0.1)';
    totalSum.style.fontSize = '3.5rem';
    totalSum.style.width = 'calc(10% - 1rem)';

    const totalSumLabel = document.createElement('span');
    totalSumLabel.innerHTML = '0.0 <i style="font-size: 2.3rem; opacity: 0.79;">&pi;&thinsp;</i>';

    totalSum.appendChild(totalSumLabel);
    totalSum.style.display = 'flex';
    totalSum.style.justifyContent = 'end';

    bar.appendChild(totalSum);

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    // Canvas for the game
    const canvas = document.createElement('canvas');
    canvas.className = 'game-canvas';

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    container.appendChild(gameContainer);

    gameContainer.appendChild(canvas);

    let rect = gameContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Handle drawing context
    const ctx = canvas.getContext('2d');

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    // Add extra on click
    canvas.addEventListener('click', (event) => {
        arcs.forEach(arc => {
            if (!arc.unlocked) return;
            arc.angle += clickValue / arc.time; // Increment angle based on click value and time
        });
    });


    function draw(now = performance.now()) {
        const deltaTime = (now - timeStamp) / 1000; // convert ms to seconds
        timeStamp = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let angle = startAngle;

        arcs.forEach((arc, index) => {
            if (!arc.unlocked) return;

            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.strokeStyle = arc.color;
            ctx.arc(cx, cy, 75 * (index + 1), angle, angle + arc.angle, false);
            ctx.stroke();

            arc.angle += filler / arc.time;

            if (arc.angle >= 2 * Math.PI) {
                let internalValue = 2 * (arc.currentMultiplier === -1 ? arc.multiplier : arc.currentMultiplier) * totalMultiplier;
                arc.value += internalValue; // Increment value based on multiplier
                arc.angle = 0; // Reset angle after a full circle
                totalScore += internalValue; // Add value to total score
            }

            let currentMultiplierElement = statsDisplays[index].querySelector(`.multiplier-display-${index}`);
            let currentSpeedElement = statsDisplays[index].querySelector(`.speed-display-${index}`);
            if (arc.unlocked &&
                ((currentMultiplierElement == null || !statTags[index] || statTags[index]['mult'] !== arc.currentMultiplier === -1 ? arc.multiplier : arc.currentMultiplier) &&
                    (currentSpeedElement == null || !statTags[index] || statTags[index]['spd'] !== arc.time))) {
                statsBar.appendChild(statsDisplays[index]);
                currentMultiplierElement.innerHTML = `<span>&pi;/2&pi;:</span> <span>${shortenNumbers((arc.currentMultiplier === -1 ? arc.multiplier : arc.currentMultiplier) * 2)}</span>`;
                currentSpeedElement.innerHTML = `<span>Speed:</span> <span">${((filler / arc.time) / deltaTime).toFixed(2)}</span>`;

                statTags[index] = { mult: arc.currentMultiplier === -1 ? arc.multiplier : arc.currentMultiplier, spd: arc.time }; // Store the stat tag for later use
            }

            // Update the score display
            const scoreElement = document.querySelector(`.score-${index}`);
            if (scoreElement) {
                scoreElement.textContent = shortenNumbers(arc.value);
            }
        });

        // Update Buttons to reflect purchase status
        buttonList.forEach(button => {
            let l = parseInt(button.getAttribute('data-arc-index'));
            // Update label text if arc is unlocked
            if (arcs[l].unlocked) {
                if (checkFlag && buttonTags[l] != button.innerHTML) {
                    button.innerHTML = `Level ${arcs[l].level + 1} &mdash; ${shortenNumbers(arcs[l].levelUpPrice)} &pi;`;
                    buttonTags[l] = button.innerHTML; // Store the button tag for later use
                }
            }

            if (!arcs[l].unlocked ? totalScore >= arcs[l].price : totalScore >= arcs[l].levelUpPrice) {
                button.disabled = false; // Enable the button if enough score
                button.style.backgroundColor = arcs[l].color;
                button.style.color = hexToRgb(adjust(arcs[l].color, -0xEF));
                button.style.cursor = 'pointer';
                checkFlag = true; // Set the flag to true after the first check
            }
            else {
                button.disabled = true; // Disable the button if not enough score
                button.style.backgroundColor = 'gray';
                button.style.color = 'black';
                button.style.cursor = 'default';
            }
        });
        totalSumLabel.innerHTML = `${shortenNumbers(totalScore)} <i style="font-size: 2.3rem; opacity: 0.79;">&pi;&thinsp;</i>`;

        rot += 0.01;
        requestAnimationFrame(draw);
    }

    // Add everything to the container
    container.appendChild(bar);

    draw();
    window.addEventListener('resize', () => {
        rect = gameContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        cx = canvas.width / 2;
        cy = canvas.height / 2;
    });
};


// Shorten numbers for display, but integer only, no decimals
function shortenNumbers(num) {
    if (num < 1e3) return Math.floor(num).toString();
    if (num < 1e6) return (num / 1e3).toFixed(0) + 'K';
    if (num < 1e9) return (num / 1e6).toFixed(0) + 'M';
    if (num < 1e12) return (num / 1e9).toFixed(0) + 'B';
    if (num < 1e15) return (num / 1e12).toFixed(0) + 'T';
    if (num < 1e18) return (num / 1e15).toFixed(0) + 'Q';
    if (num < 1e21) return (num / 1e18).toFixed(0) + 'Qn';
    if (num < 1e23) return (num / 1e21).toFixed(0) + 'S';
    if (num < 1e27) return (num / 1e24).toFixed(0) + 'Sp';
    if (num < 1e30) return (num / 1e27).toFixed(0) + 'O';
    return num.toExponential(2).replace('e+', 'e');
}
