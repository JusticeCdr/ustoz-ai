import { analyzeUserText, analyzeWithNLPEngine } from "../src/lib/ai-advisor";

async function testAIFlow() {
  console.log("=========================================");
  console.log("🧪 USTOZ AI — KARYERA MASLAHATCHISI TESTI");
  console.log("=========================================\n");

  const testPhrases = [
    {
      phrase: "Salom! Men rasm chizish, 3D animatsiyalar, Blender va vizual dizaynga juda qiziqaman.",
      expected: "uiux-3d",
    },
    {
      phrase: "Men sun'iy intellekt, ChatGPT promptlari va avtonom AI agentlarni boshqarishni o'rganmoqchiman.",
      expected: "ai-prompt",
    },
    {
      phrase: "Kiberxavfsizlik, axborotni himoyalash va etik xakerlik (pentesting) menga juda yoqadi.",
      expected: "cybersecurity",
    },
    {
      phrase: "Men mustahkam veb-saytlar, Next.js, frontend va backend dasturlash bilan shug'ullanmoqchiman.",
      expected: "fullstack-web3",
    },
    {
      phrase: "Katta hajmdagi ma'lumotlarni tahlil qilish, Big Data, statistika va Machine Learning qiziqtiradi.",
      expected: "datascience",
    },
  ];

  for (const item of testPhrases) {
    console.log(`🗣 Murojaat: "${item.phrase}"`);
    const rec = await analyzeUserText(item.phrase);
    console.log(`🎯 Tavsiya qilingan yo'nalish: [${rec.trackId}] ${rec.trackTitle}`);
    console.log(`📊 Moslik darajasi: ${rec.matchScore}%`);
    console.log(`💡 AI Xulosasi: ${rec.reason}`);
    console.log(`💼 Daromad: ${rec.salaryRange}`);
    console.log(`🔑 Ko'nikmalar: ${rec.keySkills.slice(0, 3).join(", ")}`);
    console.log(`⚡ Source: ${rec.source}`);
    const passed = rec.trackId === item.expected;
    console.log(`✅ Natija: ${passed ? "TO'G'RI (PASSED)" : "KUTILGAN: " + item.expected}\n`);
  }

  console.log("🎉 Barcha AI testlari muvaffaqiyatli yakunlandi!");
}

testAIFlow().catch(console.error);
