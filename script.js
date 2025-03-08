function calculateAge() {
    // Get the date of birth input
    let birthdayInput = document.getElementById("birthday").value;
    
    // Get the time inputs (hour, minute, second)
    let hour = document.getElementById("hour").value || 0; // Default to 0 if empty
    let minute = document.getElementById("minute").value || 0; // Default to 0 if empty
    let second = document.getElementById("second").value || 0; // Default to 0 if empty

    // Check if a valid birthday is entered
    if (!birthdayInput) {
        alert("Please enter your birth date.");
        return;
    }

    // Create a Date object for the user's birthday with time included
    let birthday = new Date(birthdayInput + "T" + hour.padStart(2, '0') + ":" + minute.padStart(2, '0') + ":" + second.padStart(2, '0') + "Z");

    // Get the current date
    let currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    let timeDifference = currentDate - birthday;

    // Calculate years, months, weeks, days, hours, minutes, and seconds
    let ageInYears = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
    let ageInMonths = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30.4375)); // Average month length
    let ageInWeeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
    let ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let ageInHours = Math.floor(timeDifference / (1000 * 60 * 60));
    let ageInMinutes = Math.floor(timeDifference / (1000 * 60));
    let ageInSeconds = Math.floor(timeDifference / 1000);

    // Display the results
    document.getElementById("result").innerHTML = `
        You are ${ageInYears} years, ${ageInMonths} months, ${ageInWeeks} weeks, ${ageInDays} days, 
        ${ageInHours} hours, ${ageInMinutes} minutes, and ${ageInSeconds} seconds old.
    `;

    // Calculate next milestone (10,000 days, 1,000,000,000 seconds, etc.)
    let nextMilestoneDate = getNextMilestoneDate(birthday, ageInDays, ageInSeconds);
    let nextMilestoneMessage = getNextMilestoneMessage(nextMilestoneDate);

    // Display the next milestone
    document.getElementById("nextMilestone").innerHTML = nextMilestoneMessage;
}

function getNextMilestoneDate(birthday, ageInDays, ageInSeconds) {
    // Milestones
    let next10kDays = new Date(birthday.getTime() + 10000 * 24 * 60 * 60 * 1000);
    let next1BillionSeconds = new Date(birthday.getTime() + 1000000000 * 1000);

    // Find the next milestone (either 10,000 days or 1,000,000,000 seconds)
    if (ageInDays < 10000) {
        return next10kDays;
    } else {
        return next1BillionSeconds;
    }
}

function getNextMilestoneMessage(milestoneDate) {
    let day = milestoneDate.getDate().toString().padStart(2, '0');
    let month = (milestoneDate.getMonth() + 1).toString().padStart(2, '0');
    let year = milestoneDate.getFullYear();
    let hour = milestoneDate.getHours().toString().padStart(2, '0');
    let minute = milestoneDate.getMinutes().toString().padStart(2, '0');
    
    return `You turn ${milestoneDate < new Date() ? 'over' : 'exactly'} ${milestoneDate < new Date() ? '10,000 days' : '1 billion seconds'} old on ${day}/${month}/${year} at ${hour}:${minute}, let's celebrate!`;
}
