import { NextResponse } from 'next/server';
import { getAllAnalyses, saveAnalysis } from '@/lib/analysisManager';
import { generateAnalysis } from '@/lib/gemini';

export async function GET() {
  try {
    const analyses = getAllAnalyses();
    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { date } = await request.json();
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const analysis = await generateAnalysis(date);
    const saved = saveAnalysis(analysis);
    
    return NextResponse.json({ analysis: saved });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json({ error: 'Failed to generate analysis: ' + error.message }, { status: 500 });
  }
}
