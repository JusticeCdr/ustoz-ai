/**
 * Interactive Code Runner and Evaluator for HTML, CSS, and Python
 */

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs?: number;
}

/**
 * Execute Python code via server API with client-side fallback
 */
export async function runPythonCode(code: string): Promise<CodeExecutionResult> {
  const startTime = Date.now();

  try {
    const res = await fetch("/api/code/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "python", code }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        output: data.output || "",
        error: data.error,
        executionTimeMs: Date.now() - startTime,
      };
    }
  } catch (netErr) {
    console.warn("Server runner unavailable, using client-side fallback:", netErr);
  }

  // Client-side Python Evaluator fallback
  return runPythonClientFallback(code, startTime);
}

/**
 * In-browser client-side Python interpreter fallback
 * Supports: print(), variables, strings, f-strings, arithmetic, if/else, for loops, def
 */
function runPythonClientFallback(code: string, startTime: number): CodeExecutionResult {
  try {
    const outputLines: string[] = [];
    const lines = code.split("\n");
    const scope: Record<string, any> = {};

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      // Handle print statement
      if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
        const inside = trimmed.slice(6, -1);
        const printedVal = evaluatePythonExpression(inside, scope);
        outputLines.push(String(printedVal));
        continue;
      }

      // Handle variable assignment: var_name = value
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        scope[varName] = evaluatePythonExpression(expr, scope);
        continue;
      }

      // Handle simple for loop: for x in list:
      const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
      if (forMatch) {
        const iterVar = forMatch[1];
        const iterTarget = evaluatePythonExpression(forMatch[2], scope);

        // Collect indented lines
        const loopBody: string[] = [];
        let j = i + 1;
        while (j < lines.length && (lines[j].startsWith("    ") || lines[j].startsWith("\t"))) {
          loopBody.push(lines[j].trim());
          j++;
        }
        i = j - 1;

        if (Array.isArray(iterTarget)) {
          for (const item of iterTarget) {
            scope[iterVar] = item;
            for (const bodyLine of loopBody) {
              if (bodyLine.startsWith("print(") && bodyLine.endsWith(")")) {
                const inside = bodyLine.slice(6, -1);
                outputLines.push(String(evaluatePythonExpression(inside, scope)));
              }
            }
          }
        }
        continue;
      }

      // Handle simple if statement: if cond:
      const ifMatch = trimmed.match(/^if\s+(.+):$/);
      if (ifMatch) {
        const cond = evaluateCondition(ifMatch[1], scope);
        const ifBody: string[] = [];
        const elseBody: string[] = [];
        let inElse = false;
        let j = i + 1;

        while (j < lines.length && (lines[j].startsWith("    ") || lines[j].startsWith("\t") || lines[j].trim().startsWith("else:"))) {
          const l = lines[j].trim();
          if (l === "else:") {
            inElse = true;
          } else if (inElse) {
            elseBody.push(l);
          } else {
            ifBody.push(l);
          }
          j++;
        }
        i = j - 1;

        const bodyToExec = cond ? ifBody : elseBody;
        for (const bl of bodyToExec) {
          if (bl.startsWith("print(") && bl.endsWith(")")) {
            const inside = bl.slice(6, -1);
            outputLines.push(String(evaluatePythonExpression(inside, scope)));
          }
        }
        continue;
      }
    }

    return {
      success: true,
      output: outputLines.length > 0 ? outputLines.join("\n") : "(Dastur bajarildi)",
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: `SyntaxError / Xatolik: ${err.message}`,
      executionTimeMs: Date.now() - startTime,
    };
  }
}

function evaluateCondition(condStr: string, scope: Record<string, any>): boolean {
  let expr = condStr.trim();
  Object.keys(scope).forEach((k) => {
    const val = typeof scope[k] === "string" ? `"${scope[k]}"` : scope[k];
    const regex = new RegExp(`\\b${k}\\b`, "g");
    expr = expr.replace(regex, String(val));
  });

  try {
    // eslint-disable-next-line no-eval
    return Boolean(eval(expr));
  } catch {
    return false;
  }
}

function evaluatePythonExpression(expr: string, scope: Record<string, any>): any {
  let clean = expr.trim();

  // Handle f-string: f"Salom, {ism}!"
  if (clean.startsWith('f"') || clean.startsWith("f'")) {
    const quote = clean[1];
    let content = clean.slice(2, clean.lastIndexOf(quote));
    return content.replace(/\{([^}]+)\}/g, (_, inner) => {
      const varName = inner.trim();
      return scope[varName] !== undefined ? String(scope[varName]) : varName;
    });
  }

  // Handle regular strings: "Hello"
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    return clean.slice(1, -1);
  }

  // Handle Python list literal: ["a", "b"]
  if (clean.startsWith("[") && clean.endsWith("]")) {
    try {
      return JSON.parse(clean.replace(/'/g, '"'));
    } catch {
      return clean.slice(1, -1).split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
    }
  }

  // Handle Numbers
  if (!isNaN(Number(clean))) {
    return Number(clean);
  }

  // Handle Variable in scope
  if (scope[clean] !== undefined) {
    return scope[clean];
  }

  // Arithmetic expression
  let evalCode = clean;
  Object.keys(scope).forEach((k) => {
    const val = typeof scope[k] === "string" ? `"${scope[k]}"` : scope[k];
    const regex = new RegExp(`\\b${k}\\b`, "g");
    evalCode = evalCode.replace(regex, String(val));
  });

  try {
    // eslint-disable-next-line no-eval
    return eval(evalCode);
  } catch {
    return clean;
  }
}

/**
 * Generate full HTML Document with styling for Live Preview (HTML & CSS)
 */
export function buildLivePreviewDoc(htmlCode: string, cssCode: string = ""): string {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #080d24;
      color: #e2e8f0;
      padding: 24px;
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    h1, h2, h3 {
      color: #ffffff;
      margin-bottom: 12px;
      font-weight: 800;
    }
    p {
      color: #94a3b8;
      margin-bottom: 16px;
    }
    button {
      font-family: inherit;
      cursor: pointer;
    }
    input {
      font-family: inherit;
    }
    /* Injected User CSS */
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`;
}
