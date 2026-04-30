/**
 * Utility for content validation to prevent gambling, pornography, violence, and links.
 */

const FORBIDDEN_KEYWORDS = [
  // --- KATEGORI JUDI ONLINE (JUDOL) ---
  'slot', 'gacor', 'zeus', 'maxwin', 'depo', 'wd', 'deposit', 'withdraw', 
  'jackpot', 'jp', 'scatter', 'olympus', 'mahjong', 'betting', 'judol', 
  'judi', 'togel', 'casino', 'poker', 'domino', 'qq', 'bandar', ' Pragmatic',

  // --- KATEGORI KONTEN DEWASA/PORNO ---
  'bokep', 'porn', 'sex', 'ngentot', 'sange', 'vcs', 'openbo', 'bo', 
  'lendir', 'semprot', 'jav', 'hentai', 'pornografi', 'colmek', 'coli',

  // --- KATEGORI PENIPUAN/SPAM ---
  'pinjol', 'dana gaib', 'pesugihan', 'investasi bodong', 'crypto scam',
  'hadiah gratis', 'klik link ini', 'menang undian',

  // --- KATEGORI SARA/OFFENSIVE ---
  'anjing', 'babi', 'monyet', 'tolol', 'goblok', 'idiot', 'kontol', 'memek'
];

const URL_REGEX = /https?:\/\/\S+|www\.\S+|\b\w+\.(?:com|net|org|id|gov|edu|me|site|xyz|app|online|io|my\.id)\b/gi;

export const validateContent = (text) => {
  if (!text) return { isValid: true };

  const lowerText = text.toLowerCase();

  // Check for forbidden keywords
  for (const word of FORBIDDEN_KEYWORDS) {
    if (lowerText.includes(word)) {
      return {
        isValid: false,
        reason: `Konten mengandung kata terlarang: "${word}".`
      };
    }
  }

  // Check for links
  if (URL_REGEX.test(text)) {
    return {
      isValid: false,
      reason: 'Konten tidak diperbolehkan mengandung link atau URL.'
    };
  }

  return { isValid: true };
};
