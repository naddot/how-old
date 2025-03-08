function calculateAge() {
    let birthday = document.getElementById("birthday").value;
    if (!birthday) {
        document.getElementById("result").innerText = "Please enter a valid date.";
        return;
    }

    let birthDate = new Date(birthday);
    let today = new Date();
    let timeDifference = today - birthDate;
    let daysOld = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    document.getElementById("result").innerText = `You are ${daysOld} days old!`;
}
