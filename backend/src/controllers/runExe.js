import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runExe(archivo, patron) {
  return new Promise((resolve, reject) => {
    const exePath = path.resolve(__dirname, "../../bin/kmp.exe");

    const child = spawn(exePath, [], {
      windowsHide: true
    });

    let output = "";
    let errorOutput = "";

    child.stdin.write(`${archivo}\n${patron}\n`);
    child.stdin.end();

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`EXE exited with code ${code}: ${errorOutput}`));
      }

      resolve(output.trim());
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}
