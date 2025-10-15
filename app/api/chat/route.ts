import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message, expenses, isExpense } = await req.json();

    // Si es un gasto, detectar la categoría
    if (isExpense) {
      const categoryPrompt = `Analiza este gasto y clasifícalo en UNA de estas categorías exactas:
- Transporte
- Alimentación
- Entretenimiento
- Servicios
- Compras
- Salud
- Educación
- Otros

Gasto: "${message}"

Responde SOLO con el nombre de la categoría, nada más. Ejemplo: "Transporte"`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const categoryResult = await model.generateContent(categoryPrompt);
      const categoryResponse = await categoryResult.response;
      const category = categoryResponse.text().trim();

      // Generar respuesta amigable
      const responsePrompt = `El usuario registró un gasto: "${message}"
Categoría detectada: ${category}

Genera una respuesta breve y amigable confirmando el registro (máximo 1-2 oraciones). 
Menciona la categoría de forma natural.`;

      const responseResult = await model.generateContent(responsePrompt);
      const response = await responseResult.response;
      const aiResponse = response.text();

      return NextResponse.json({ 
        response: aiResponse,
        category: category 
      });
    }

    // Si no es un gasto, respuesta general
    const totalGastado = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
    const expensesByCategory = expenses.reduce((acc: any, e: any) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const contextPrompt = `Eres un asistente financiero amigable en español llamado FinanzasBot. Tu trabajo es:
1. Ayudar a registrar gastos cuando el usuario los menciona (ej: "Gasté 10 soles en taxi")
2. Responder preguntas sobre finanzas personales
3. Analizar los gastos del usuario y dar consejos breves y útiles

${expenses.length > 0 ? `Gastos actuales del usuario:
Total gastado: S/${totalGastado.toFixed(2)}
Gastos por categoría: ${Object.entries(expensesByCategory).map(([cat, amt]: any) => `${cat}: S/${amt.toFixed(2)}`).join(', ')}

Últimos gastos:
${expenses.slice(-5).map((e: any) => `- S/${e.amount} en ${e.description} (${e.category})`).join('\n')}` : 'El usuario no ha registrado gastos aún.'}

Mensaje del usuario: "${message}"

Responde de manera amigable y concisa (máximo 2-3 oraciones). Si es un saludo o pregunta general, responde naturalmente. Si están preguntando sobre sus finanzas, usa los datos de arriba.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Error al procesar el mensaje:", error);
    
    if (error.message && error.message.includes("not found")) {
      return NextResponse.json(
        { error: `Tu API key no tiene acceso a los modelos de Gemini. Por favor genera una nueva API key en https://aistudio.google.com/app/apikey` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al procesar el mensaje. Verifica tu API key en https://aistudio.google.com/app/apikey" },
      { status: 500 }
    );
  }
}
