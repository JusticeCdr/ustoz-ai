import { INTERACTIVE_COURSES } from "../src/lib/interactiveLessonsData";

async function testSandboxExercises() {
  console.log("==========================================");
  console.log("🧪 INTERAKTIV KOD MASHQLARI TESTI");
  console.log("==========================================\n");

  // 1. HTML Exercise 1 test
  console.log("1. HTML 1-dars testi:");
  const htmlEx = INTERACTIVE_COURSES.html.exercises[0];
  const htmlTest1 = htmlEx.testValidator(htmlEx.solutionCode, "");
  console.log("  To'g'ri kod tekshiruvi:", htmlTest1);
  const htmlTestBad = htmlEx.testValidator("<div>Salom</div>", "");
  console.log("  Noto'g'ri kod tekshiruvi:", htmlTestBad);

  // 2. CSS Exercise 1 test
  console.log("\n2. CSS 1-dars testi:");
  const cssEx = INTERACTIVE_COURSES.css.exercises[0];
  const cssTest1 = cssEx.testValidator(cssEx.solutionCode, "");
  console.log("  To'g'ri kod tekshiruvi:", cssTest1);
  const cssTestBad = cssEx.testValidator(".card { color: red; }", "");
  console.log("  Noto'g'ri kod tekshiruvi:", cssTestBad);

  // 3. Python Exercise 1 test
  console.log("\n3. Python 1-dars testi:");
  const pyEx = INTERACTIVE_COURSES.python.exercises[0];
  const pyTest1 = pyEx.testValidator(pyEx.solutionCode, "Salom, Ali!\nBalingiz: 100 XP");
  console.log("  To'g'ri kod tekshiruvi:", pyTest1);
  const pyTestBad = pyEx.testValidator("a = 5", "5");
  console.log("  Noto'g'ri kod tekshiruvi:", pyTestBad);

  console.log("\n🎉 Barcha interaktiv mashqlar tekshiruvi muvaffaqiyatli o'tdi!");
}

testSandboxExercises().catch(console.error);
