const { OpenAI } = require("openai");
const Chat = require("./models/chat");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "MyTestBot",
  },
});

const handleChat = async (req, res) => {
  const { message: userMessage, userId } = req.body;

  if (!userMessage || !userId) {
    return res.status(400).json({ error: "يجب إرسال الرسالة ومعرف المستخدم" });
  }

  try {
    // 🧠 الرسالة الحالية فقط بدون سياق قديم
    const messages = [
      { role: "system", content: "أنت مساعد ذكي يتحدث العربية والانجليزية." },
      { role: "user", content: userMessage },
    ];

    // 🤖 إرسال الرسالة إلى موديل الذكاء
    const chatCompletion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages,
    });

    const reply = chatCompletion.choices[0].message.content;

    // 📝 حفظ الرسالة والرد (اختياري لو حابب تحتفظ بالشات في قاعدة البيانات)
    await Chat.create({ userId, message: userMessage, reply });

    // ⬅️ إرسال الرد فقط بدون history
    res.json({ reply });

  } catch (error) {
    console.error("❌ خطأ فعلي:", error.response?.data || error.message);
    res.status(500).json({
      error: "فشل الاتصال بـ OpenRouter API",
      details: error.message,
    });
  }
};

module.exports = { handleChat };
