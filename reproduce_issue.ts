
function isValidOCROutput_Old(text: string): boolean {
    if (!text || text.trim().length === 0) return false;
    // Updated to use the new logic for verification
    const alphanumeric = (text.match(/[\p{L}\p{N}]/gu) || []).length;
    const total = text.replace(/\s/g, '').length; // characters minus whitespace

    // For documents like brochures, alphanumeric ratio can be lower due to symbols/punctuation
    // We allow it if at least 25% of the non-whitespace content is alphanumeric
    console.log(`Current Logic: Alphanumeric: ${alphanumeric}, Total: ${total}, Ratio: ${total > 0 ? alphanumeric / total : 0}`);
    if (total > 0 && (alphanumeric / total) < 0.25) return false;
    return true;
}

function isValidOCROutput_New(text: string): boolean {
    if (!text || text.trim().length === 0) return false;
    // Use Unicode property escapes to match any letter or number in any language
    const alphanumeric = (text.match(/[\p{L}\p{N}]/gu) || []).length;
    const total = text.replace(/\s/g, '').length;

    console.log(`New: ValidChars: ${alphanumeric}, Total: ${total}, Ratio: ${total > 0 ? alphanumeric / total : 0}`);
    if (total > 0 && (alphanumeric / total) < 0.25) return false;
    return true;
}

const arabicText = "عند حُسن ظن إخواننا بنا ، ليس الأمر كذلك. الحقيقة التي أشعر";
const chineseText = "我们需要针对所有的一线和二线语言进行非常好的优化。"; // Chinese
const indonesianText = "Kita perlu mengoptimalkan dengan sangat baik untuk semua bahasa tingkat pertama dan kedua."; // Indonesian
const amharicText = "ለሁሉም የ1ኛ እና 2ኛ ደረጃ ቋንቋዎች በጣም በጥሩ ሁኔታ ማመቻቸት አለብን።"; // Amharic (Ethiopic script - African)
const frenchText = "Nous devons très bien optimiser pour toutes les langues de premier et de second niveau."; // French (European with accents)
const mixedText = "Hello World 123";

console.log("Testing Arabic Text:");
console.log("Current Valid:", isValidOCROutput_Old(arabicText));

console.log("\nTesting Chinese Text:");
console.log("Current Valid:", isValidOCROutput_Old(chineseText));

console.log("\nTesting Indonesian Text:");
console.log("Current Valid:", isValidOCROutput_Old(indonesianText));

console.log("\nTesting Amharic (African) Text:");
console.log("Current Valid:", isValidOCROutput_Old(amharicText));

console.log("\nTesting French (European) Text:");
console.log("Current Valid:", isValidOCROutput_Old(frenchText));

console.log("\nTesting English Text:");
console.log("Current Valid:", isValidOCROutput_Old(mixedText));
