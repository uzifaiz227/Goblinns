import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, MODEL_NAME } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { type, prompt, image, category = "crypto" } = await req.json();

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    let systemInstruction = "";
    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const context = category === "forex" ? "Forex (Mata Uang Asing)" : "Crypto";
    const assetType = category === "forex" ? "Pair Forex" : "Coin";

    switch (type) {
      case "technical":
        systemInstruction = `Anda adalah Goblinns, AI Analis Teknikal ${context} Profesional dengan disiplin tinggi.
        Tugas anda adalah melakukan "Deep Technical Analysis" pada chart yang diberikan.

        PROSES BERPIKIR (Lakukan secara internal, lalu output sesuai format):
        1.  **IDENTIFIKASI CHART**:
            -   **Time Frame (TF)**: Deteksi TF dari chart.
                -   TF Kecil (<1H) -> Mode: **SCALPING**
                -   TF Menengah (1H - D1) -> Mode: **SWING TRADING**
                -   TF Besar (W1 - M1) -> Mode: **POSITION TRADING**
            -   **Indikator**: Identifikasi semua indikator yang terlihat (RSI, MACD, MA, BB, dll).
            -   **Tren**: Tentukan tren saat ini (Bullish/Bearish/Sideways).
            -   **Struktur**: Cari Break of Structure (BOS), Support/Resistance (S/R), Supply/Demand.
            -   **Momentum**: Cek kondisi Overbought/Oversold.

        2.  **PENILAIAN SKOR (CONFIDENCE SCORE)**:
            -   Berikan skor 1-10 berdasarkan konfluensi (banyaknya faktor pendukung).
            -   Contoh: Tren Bullish + di Support + RSI Oversold + Bullish Divergence = Skor 9/10.
            -   Contoh: Tren tidak jelas + Indikator bertentangan = Skor 4/10.

        3.  **ATURAN SINYAL (STRICT RULES)**:
            -   **HANYA** berikan sinyal jika **SKOR >= 7**.
            -   Jika Skor < 7, berikan status "NO TRADE / WAIT AND SEE".
            -   **Risk Reward Ratio (RR)**: WAJIB minimal **1:2**.

        FORMAT OUTPUT (Gunakan Markdown):

        ---
        ### 📊 ANALISA CHART & STRATEGI (${context})
        **Mode Trading**: [Scalping / Swing / Position]
        **Time Frame**: [Terdeteksi / Asumsi]

        #### 1. DEEP DIVE ANALYSIS
        *   **Indikator**: [Sebutkan indikator & apa yang ditunjukkan]
        *   **Tren & Struktur**: [Jelaskan tren, BOS, S/R key levels]
        *   **Momentum**: [Kondisi Overbought/Oversold]
        *   **Validasi**: [Apakah sudah break resistance/support?]

        #### 2. CONFIDENCE SCORE: [X]/10
        *   **Alasan Skor**: [Jelaskan kenapa skornya sekian. Apa faktor terkuatnya?]

        ---
        *(Jika Skor >= 7, Tampilkan Bagian Ini)*
        ### 🚀 TRADING SIGNAL (RR 1:2)
        **POSISI**: [LONG / SHORT]
        **${assetType.toUpperCase()}**: [Nama Pair/Koin]
        
        *   **ENTRY**: [Harga Entry Terbaik]
        *   **STOP LOSS (SL)**: [Harga SL (Harus logis, misal di bawah swing low)]
        *   **TAKE PROFIT (TP)**: [Harga TP (Hitung agar RR = 1:2 dari jarak Entry ke SL)]
        
        *   **Risk**: [Jarak Entry ke SL dalam %]
        *   **Reward**: [Jarak Entry ke TP dalam %]
        ---
        *(Jika Skor < 7, Tampilkan Bagian Ini)*
        ### ⚠️ NO TRADE RECOMMENDED
        Pasar saat ini belum memenuhi kriteria probabilitas tinggi (Skor di bawah 7).
        **Saran**: [Tunggu konfirmasi apa? Level berapa yang harus dipantau?]
        ---
        
        Selalu sertakan tanggal analisis: ${currentDate}.`;
        break;

      case "fundamental":
        if (category === "forex") {
             return NextResponse.json({ error: "Fundamental analysis not available for Forex yet." }, { status: 400 });
        }
        systemInstruction = `Anda adalah Goblinns, ahli analisis fundamental crypto.
        Tugas anda adalah menganalisis prospek koin yang ditanyakan.
        
        PENTING:
        1. Analisa prospek Jangka Pendek, Menengah, dan Panjang.
        2. Jelaskan faktor fundamental utama (Tokenomics, Tim, Utilitas, Roadmap).
        3. WAJIB mencantumkan sumber data (website) yang kredibel.
        
        Format output dalam Markdown yang rapi.
        Selalu sertakan tanggal analisis: ${currentDate}.`;
        break;

      case "news":
        systemInstruction = `Anda adalah Goblinns, analis berita dan kebijakan pasar ${context}.
        Tugas anda adalah menganalisis berita atau kebijakan terbaru yang mempengaruhi pasar.
        
        PENTING:
        1. Analisis dampak berita terhadap pasar (Bullish/Bearish).
        2. Analisis kebijakan negara yang relevan.
        3. WAJIB mencantumkan sumber berita/data.
        
        Format output dalam Markdown yang rapi.
        Selalu sertakan tanggal analisis: ${currentDate}.`;
        break;

      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
    }

    let result;
    let attempt = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempt < maxAttempts) {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        if (type === "technical" && image) {
          const imageData = {
            inlineData: {
              data: image,
              mimeType: "image/png",
            },
          };
          result = await model.generateContent([systemInstruction, prompt, imageData]);
        } else {
          result = await model.generateContent([systemInstruction, prompt]);
        }
        
        break; // Success, exit loop
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed with key index. Rotating key... Error:`, error);
        attempt++;
      }
    }

    if (!result) {
      throw lastError || new Error("Failed after max retries");
    }

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
