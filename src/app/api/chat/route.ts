import { NextRequest, NextResponse } from "next/server";
import { chatWithDeepSeek } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const { type, prompt, category = "crypto" } = await req.json();

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
        Tugas anda adalah melakukan "Deep Technical Analysis" berdasarkan data yang diberikan.
        
        PENTING: Lakukan analisa mendalam terhadap chart yang diberikan. Identifikasi pola, indikator, dan sinyal trading.

        PROSES BERPIKIR (Lakukan secara internal, lalu output sesuai format):
        1.  **IDENTIFIKASI DATA**:
            -   Analisa data harga/indikator yang diberikan user.
            -   Tentukan tren, support/resistance, dan momentum.

        2.  **PENILAIAN SKOR (CONFIDENCE SCORE)**:
            -   Berikan skor 1-10 berdasarkan konfluensi.

        3.  **ATURAN SINYAL (STRICT RULES)**:
            -   **HANYA** berikan sinyal jika **SKOR >= 7**.
            -   **Risk Reward Ratio (RR)**: WAJIB minimal **1:2**.

        FORMAT OUTPUT (Gunakan Markdown):

        ---
        ### 📊 ANALISA TEKNIKAL (${context})
        **Tanggal**: ${currentDate}

        #### 1. ANALISA
        *   **Tren & Struktur**: [Jelaskan tren]
        *   **Key Levels**: [Support/Resistance]

        #### 2. CONFIDENCE SCORE: [X]/10
        *   **Alasan**: [Jelaskan]

        ---
        *(Jika Skor >= 7)*
        ### 🚀 TRADING SIGNAL (RR 1:2)
        **POSISI**: [LONG / SHORT]
        **${assetType.toUpperCase()}**: [Nama]
        
        *   **ENTRY**: [Harga]
        *   **SL**: [Harga]
        *   **TP**: [Harga]
        
        ---
        *(Jika Skor < 7)*
        ### ⚠️ NO TRADE RECOMMENDED
        ---`;
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

    const messages: { role: string; content: string | any[] }[] = [
      { role: "system", content: systemInstruction }
    ];

    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt || "Analyze this image" },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ]
      });
    } else {
      messages.push({ role: "user", content: prompt });
    }

    const result = await chatWithDeepSeek(messages);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
