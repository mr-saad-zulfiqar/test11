const { execSync } = require('child_process');
const fs = require('fs');

// Function to create a commit on a specific date
function createCommitOnDate(date) {
    const commitDate = date.toISOString();
    execSync(`git add . && GIT_COMMITTER_DATE="${commitDate}" GIT_AUTHOR_DATE="${commitDate}" git commit -m "commit on ${commitDate}"`, { stdio: 'ignore' });
}


// Function to generate a random number of commits for a given day
function generateCommitsForDay(date) {
    const commitsCount = Math.floor(Math.random() * (13 - 4 + 1)) + 4; // Random number between 4 and 23
    for (let i = 0; i < commitsCount; i++) {
        fs.writeFileSync('dummy.txt', `Commit number ${i} on ${date.toISOString()}`);
        createCommitOnDate(date);
    }
}


// Function to get random days to skip including weekends
function getRandomDaysToSkip(includeWeekends = false) {
    const daysToSkip = new Set();
    while (daysToSkip.size < 2) {
        // If including weekends, choose a random day of the week
        const day = includeWeekends ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        daysToSkip.add(day);
    }
    return daysToSkip;
}


function main() {
    let startDate = new Date('2021-01-01');
    const endDate = new Date('2021-01-29');
    let dayCounter = 0;
    // Start without skipping weekends
    let daysToSkip = getRandomDaysToSkip();

    while (startDate <= endDate) {
        const dayOfWeek = startDate.getDay();
        
        // Check against daysToSkip
        if (!daysToSkip.has(dayOfWeek)) {
            generateCommitsForDay(startDate);
        }

        // Increment the day counter and check if two weeks have passed
        dayCounter++;
        if (dayCounter % 14 === 0) {
            // Every two weeks, decide whether to include weekends in the skip set
            daysToSkip = getRandomDaysToSkip(true); // Now weekends can be included
        }

        startDate.setDate(startDate.getDate() + 1); // Move to next day
    }
}

main();
