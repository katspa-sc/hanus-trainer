function determineReadingMode(text) {
    if (orozcoCheckbox.checked) {
        return processOrozcoMode(text);
    } else {
        return processRegularMode(text);
    }
}

function processOrozcoMode(text) {
    // Process text for Orozco mode
    if (text.includes("_") && text.length === 3) {
        const [first, second] = text.split(" ");
        if (first === "_") {
            const mappedSecond = second
                .split("") // Split into characters
                .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
                .join(" "); // Join back into a string
            return `drugie ${mappedSecond}`;
        } else if (second === "_") {
            const mappedFirst = first
                .split("") // Split into characters
                .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
                .join(" "); // Join back into a string
            return `${mappedFirst} pierwsze`;
        } else {
            return text; // Fallback to the original text
        }
    } else {
        // Map all characters in the text using the single_letter_map
        return text
            .split("") // Split into characters
            .map(char => single_letter_map[char] || char) // Map each character or leave it unchanged
            .join(" "); // Join back into a string
    }
}

function processRegularMode(text) {
    // Preprocess the text to add hyphens after letters without a prime sign
    return text
        .split(" ") // Split into individual moves
        .map(move => {
            if (move.endsWith("'") || move.endsWith("2")) {
                return move; // Keep moves with a prime or "2" unchanged
            }
            return `${move}-`; // Add a hyphen after moves without a prime or "2"
        })
        .join(" "); // Join back into a string with spaces
}

function speakText(text, rate = 1.0, readComm = false) {
    const enableTTS = localStorage.getItem("enableTTS") === "true";

    if (!enableTTS) {
        console.log("TTS is disabled.");
        return; // Exit if TTS is disabled
    }

    if ('speechSynthesis' in window) {
        if (!utterance) {
            // Create the utterance instance only once
            utterance = new SpeechSynthesisUtterance();
            utterance.rate = rate; // Adjust speed if needed
        }

        // Stop any ongoing speech before speaking new text
        window.speechSynthesis.cancel();

        // Get the language from the text box or use a default
        const language = localStorage.getItem("ttsLanguage") || "pl-PL";
        utterance.lang = language;

        // Determine the reading mode and process the text
        const processedText = determineReadingMode(text);

        // Handle readComm mode if enabled
        if (readComm) {
            utterance.rate = rate;

            // Preprocess the text to replace special characters with words
            const replacements = {
                ":": " POTEM",
                "'": " PRIIM",
                "/": " SLESZ"
            };

            // Dynamically construct the regex from the keys of the replacements map
            const regex = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");

            // Replace all matches using the replacements map and add a comma after each replacement
            let processedText = text.replace(regex, match => replacements[match] + ",");

            // Add "setap" at the front if there is at least one occurrence of ":"
            if (text.includes(":")) {
                processedText = "setap " + processedText;
            }

            // Split moves with a comma and ensure spaces are preserved
            processedText = processedText.split(" ").join(", ");

            // Trim double commas
            processedText = processedText.replace(/,,+/g, ","); // Replace multiple commas with a single comma

            // Replace ", priim" with " priim"
            processedText = processedText.replace(/, PRIIM/g, " PRIIM");

            // Ensure spaces are preserved between moves
            processedText = processedText.replace(/, /g, ", ");

            // Remove any leading commas
            processedText = processedText.replace(/^, /, ""); // Remove leading commas

            // Update the text and speak
            utterance.text = processedText;
        } else {
            utterance.text = processedText; // Use the processed text
        }

        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Text-to-Speech is not supported in this browser.');
    }
}