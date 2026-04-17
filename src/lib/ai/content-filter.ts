// Kata kunci krisis yang harus dideteksi
const CRISIS_KEYWORDS = [
  "bunuh diri", "ingin mati", "tidak ingin hidup",
  "menyakiti diri", "self-harm", "suicide",
  "mengakhiri hidup", "tidak ada harapan",
  "overdose", "gantung diri", "capek hidup", "akhiri hidup ini", "mati", "depresi"
];

export function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  );
}

export const CRISIS_RESPONSE = `
🆘 **Saya memahami bahwa kamu sedang merasakan beban yang sangat berat.**

Perasaanmu valid dan kamu tidak sendirian. Saya sangat menyarankan untuk segera menghubungi bantuan profesional:

📞 **Hotline Kesehatan Mental:**
- Into The Light Indonesia: **119 ext 8**
- LSM Jangan Bunuh Diri: **021-9696-9293**
- Yayasan Pulih: **021-788-42580**

Tenaga profesional terlatih siap mendengarkan dan membantu kamu 24 jam.

💙 Kamu berharga, dan ada orang-orang yang peduli padamu.
`;
