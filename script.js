function calculateAge() {
    // Get the date of birth input
    let birthdayInput = document.getElementById("birthday").value;
    
    // Get the time inputs (hour, minute, second) from dropdowns
    let hour = document.getElementById("hour").value || 0;
    let minute = document.getElementById("minute").value || 0;
    let second = document.getElementById("second").value || 0;

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
        <strong>You are ${ageInYears} years, ${ageInMonths} months, ${ageInWeeks} weeks, ${ageInDays} days, ${ageInHours} hours, ${ageInMinutes} minutes, and ${ageInSeconds} seconds old!</strong>
    `;

    // Calculate and display the next milestone (50th birthday example)
    let nextMilestoneDate = new Date(birthday);
    nextMilestoneDate.setFullYear(nextMilestoneDate.getFullYear() + 50);
    document.getElementById("nextMilestone").innerHTML = `
        Your 50th birthday will be on ${nextMilestoneDate.toLocaleDateString()}.
    `;

    // Show the result and hide the form
    document.getElementById("form-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
}

function goBack() {
    document.getElementById("form-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
}
