import fs from 'fs';
import path from 'path';

export interface CaseData {
  id: string;
  prompt: string;
  description: string;
  step_files: string[];
  total_steps: number;
}

const STATIC_CASES_DIR = path.join(process.cwd(), 'public', 'static', 'cases');

export function loadDynamicCases(): Record<string, CaseData> {
  const cases: Record<string, CaseData> = {};

  if (!fs.existsSync(STATIC_CASES_DIR)) {
    console.warn(`${STATIC_CASES_DIR} does not exist`);
    return {};
  }

  const caseFolders = fs.readdirSync(STATIC_CASES_DIR).filter(folder =>
    fs.statSync(path.join(STATIC_CASES_DIR, folder)).isDirectory()
  );

  for (const caseFolder of caseFolders) {
    const casePath = path.join(STATIC_CASES_DIR, caseFolder);
    const caseId = caseFolder;
    const promptFile = path.join(casePath, 'prompt.txt');
    const descriptionFile = path.join(casePath, 'description.txt');

    let prompt = '';
    if (fs.existsSync(promptFile)) {
      prompt = fs.readFileSync(promptFile, 'utf-8').trim();
    }

    let description = '';
    if (fs.existsSync(descriptionFile)) {
      description = fs.readFileSync(descriptionFile, 'utf-8').trim();
    }

    const stepFiles: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const stepFile = path.join(casePath, `step_${i}.png`);
      if (fs.existsSync(stepFile)) {
        stepFiles.push(stepFile);
      } else {
        break;
      }
    }

    if (prompt && stepFiles.length > 0) {
      cases[caseId] = {
        id: caseId,
        prompt,
        description: description || `Caso educativo: ${prompt.slice(0, 100)}...`,
        step_files: stepFiles,
        total_steps: stepFiles.length,
      };
      console.log(`Loaded case '${caseId}' with ${stepFiles.length} steps`);
    } else {
      console.log(`Skipping incomplete case '${caseId}': prompt=${!!prompt}, steps=${stepFiles.length}`);
    }
  }

  return cases;
}