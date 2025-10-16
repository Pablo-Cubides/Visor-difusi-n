import { NextRequest, NextResponse } from 'next/server';
import { loadDynamicCases } from '../_lib/cases';

const predefinedCases = loadDynamicCases();

export async function GET() {
  const promptsList = Object.values(predefinedCases).map(caseData => ({
    id: caseData.id,
    title: caseData.title,
    prompt: caseData.prompt,
    description: caseData.description,
  }));

  return NextResponse.json(promptsList);
}