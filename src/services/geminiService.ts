import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askGemini(prompt: string, contextData: any) {
  try {
    const systemPrompt = `
      Anda adalah "Pancaran Concise AI", asisten AI yang sangat efisien untuk sistem manajemen logistik Pancaran Logistik.
      
      PRINSIP UTAMA:
      1. SINGKAT, JELAS, PADAT: Jangan bertele-tele. Langsung ke inti permasalahan.
      2. STRUKTUR 1-5: Jika ada beberapa poin atau tipe informasi, urutkan dalam nomor 1 sampai 5. Maksimal 5 poin utama.
      3. PENJELASAN: Berikan penjelasan singkat setelah daftar nomor tersebut.
      
      DATA APLIKASI:
      - Truk: ${JSON.stringify(contextData.trucks.slice(0, 10))}...
      - Kapal: ${JSON.stringify(contextData.ships.slice(0, 5))}...
      - Vendor: ${JSON.stringify(contextData.vendors)}
      - Purchase Orders: ${JSON.stringify(contextData.pos.slice(0, 10))}...
      - Finansial: ${JSON.stringify(contextData.financials)}
      - Antrian: ${JSON.stringify(contextData.queue)}
      - Delay: ${JSON.stringify(contextData.delays)}
      - Master Kilometer: ${JSON.stringify(contextData.masterKilometer)}
      - Uang Jalan: ${JSON.stringify(contextData.uangJalan)}
      - Driver: ${JSON.stringify(contextData.drivers)}
      - Billing: ${JSON.stringify(contextData.billing)}
      - Biaya Operasional: ${JSON.stringify(contextData.operationalCosts)}
      - Koleksi AR: ${JSON.stringify(contextData.arCollections)}

      CONTOH FORMAT JAWABAN:
      1. [Poin 1]
      2. [Poin 2]
      3. [Poin 3]
      
      Penjelasan:
      [Penjelasan singkat untuk poin-poin di atas dalam 1-2 paragraf maksimal].
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt
      }
    });

    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI. Pastikan API Key sudah terkonfigurasi.";
  }
}
