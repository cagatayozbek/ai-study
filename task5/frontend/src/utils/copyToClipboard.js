/**
 * Metni clipboard'a kopyalar
 * @param {string} text - Kopyalanacak metin
 * @returns {Promise<boolean>} Başarı durumu
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Kopyalama başarısız:", err);
    return false;
  }
};

export default copyToClipboard;
