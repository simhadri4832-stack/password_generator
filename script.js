const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");
const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});

function randomCharacter(text) {
    return text[Math.floor(Math.random() * text.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePassword() {
    const length = Number(lengthInput.value);

    const selectedSets = [];

    if (uppercase.checked) selectedSets.push(characterSets.uppercase);
    if (lowercase.checked) selectedSets.push(characterSets.lowercase);
    if (numbers.checked) selectedSets.push(characterSets.numbers);
    if (symbols.checked) selectedSets.push(characterSets.symbols);

    if (selectedSets.length === 0) {
        passwordInput.value = "";
        strengthText.textContent = "Select an option";
        strengthFill.style.width = "0%";
        message.textContent = "Please select at least one character type.";
        return;
    }

    if (length < selectedSets.length) {
        passwordInput.value = "";
        message.textContent = "Increase the password length.";
        return;
    }

    let allCharacters = selectedSets.join("");
    let password = [];

    // Make sure each selected character type is represented.
    selectedSets.forEach(set => {
        password.push(randomCharacter(set));
    });

    while (password.length < length) {
        password.push(randomCharacter(allCharacters));
    }

    password = shuffleArray(password).join("");

    passwordInput.value = password;
    message.textContent = "New password generated successfully!";
    updateStrength(password);
}

function updateStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
        strengthText.textContent = "Weak";
        strengthFill.style.width = "30%";
        strengthFill.style.background = "#ff7675";
    } else if (score <= 4) {
        strengthText.textContent = "Medium";
        strengthFill.style.width = "65%";
        strengthFill.style.background = "#fdcb6e";
    } else {
        strengthText.textContent = "Strong";
        strengthFill.style.width = "100%";
        strengthFill.style.background = "#00b894";
    }
}

copyBtn.addEventListener("click", async () => {
    if (!passwordInput.value) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        copyBtn.textContent = "✓";
        message.textContent = "Password copied to clipboard!";

        setTimeout(() => {
            copyBtn.textContent = "📋";
        }, 1500);
    } catch (error) {
        passwordInput.select();
        document.execCommand("copy");
        message.textContent = "Password copied!";
    }
});

generateBtn.addEventListener("click", generatePassword);

[uppercase, lowercase, numbers, symbols].forEach(option => {
    option.addEventListener("change", () => {
        if (passwordInput.value) {
            generatePassword();
        }
    });
});

// Generate one password when the page loads.
generatePassword();
