function isValidOCROutput(text) {
    if (!text || text.trim().length === 0) return false;
    // Use Unicode property escapes to match any letter or number in any language
    const alphanumeric = (text.match(/[\p{L}\p{N}]/gu) || []).length;
    const total = text.replace(/\s/g, '').length;

    console.log(`  Chars: ${alphanumeric}/${total}, Ratio: ${(alphanumeric / total).toFixed(2)}`);
    if (total > 0 && (alphanumeric / total) < 0.25) return false;
    return true;
}

const tests = {
    "Arabic": "عند حُسن ظن إخواننا بنا ، ليس الأمر كذلك. الحقيقة التي أشعر",
    "Chinese": "我们需要针对所有的一线和二线语言进行非常好的优化。",
    "Indonesian": "Kita perlu mengoptimalkan dengan sangat baik untuk semua bahasa tingkat pertama dan kedua.",
    "Amharic (African)": "ለሁሉም የ1ኛ እና 2ኛ ደረጃ ቋንቋዎች በጣም በጥሩ ሁኔታ ማመቻቸት አለብን።",
    "French (European)": "Nous devons très bien optimiser pour toutes les langues de premier et de second niveau.",
    "Russian (Cyrillic)": "Нам нужно очень хорошо оптимизировать для всех языков первого и второго уровня.",
    "Hindi (Devanagari)": "हमें सभी प्रथम और द्वितीय स्तर की भाषाओं के लिए बहुत अच्छी तरह से अनुकूलित करने की आवश्यकता है।",
    "Japanese": "すべての第一言語と第二言語を非常によく最適化する必要があります。",
    "Korean": "모든 1차 및 2차 언어에 대해 매우 잘 최적화해야 합니다.",
    "Thai": "เราจำเป็นต้องปรับให้เหมาะสมอย่างดีสำหรับภาษาระดับที่หนึ่งและสองทั้งหมด",
    "English": "Hello World 123"
};

console.log("=== Multi-Language OCR Validation Test ===\n");

for (const [lang, text] of Object.entries(tests)) {
    console.log(`${lang}:`);
    const result = isValidOCROutput(text);
    console.log(`  Result: ${result ? '✅ PASS' : '❌ FAIL'}\n`);
}
