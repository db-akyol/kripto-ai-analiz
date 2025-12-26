import { NextResponse } from 'next/server';
import { getAnalysisByDate } from '@/lib/analysisManager';

export async function GET(request, { params }) {
  try {
    const { tarih } = await params;
    const analysis = getAnalysisByDate(tarih);
    
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}
