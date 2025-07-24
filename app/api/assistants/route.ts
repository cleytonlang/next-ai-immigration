import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getAssistantIcon(name: string, instructions?: string): string {
  const lowerName = name.toLowerCase();
  const lowerInstructions = instructions?.toLowerCase() || '';
  
  if (lowerName.includes('imigra') || lowerInstructions.includes('imigra') || 
      lowerName.includes('visa') || lowerInstructions.includes('visa')) {
    return '🛂';
  }
  
  if (lowerName.includes('juríd') || lowerName.includes('juridic') || 
      lowerName.includes('legal') || lowerInstructions.includes('direito') ||
      lowerInstructions.includes('legal') || lowerName.includes('advog')) {
    return '⚖️';
  }
  
  if (lowerName.includes('médic') || lowerName.includes('saúde') ||
      lowerName.includes('health') || lowerInstructions.includes('médic')) {
    return '🏥';
  }
  
  if (lowerName.includes('educação') || lowerName.includes('ensino') ||
      lowerName.includes('education') || lowerInstructions.includes('educação')) {
    return '📚';
  }
  
  if (lowerName.includes('finanç') || lowerName.includes('financ') ||
      lowerInstructions.includes('finanç') || lowerInstructions.includes('money')) {
    return '💰';
  }
  
  if (lowerName.includes('tech') || lowerName.includes('programa') ||
      lowerName.includes('código') || lowerInstructions.includes('programming')) {
    return '💻';
  }
  
  return '🤖';
}

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const assistants = await openai.beta.assistants.list({
      order: 'desc',
      limit: 20,
    });

    const formattedAssistants = assistants.data.map((assistant) => ({
      id: assistant.id,
      name: assistant.name || 'Assistente sem nome',
      description: assistant.description || assistant.instructions?.substring(0, 100) + '...' || 'Sem descrição disponível',
      icon: getAssistantIcon(assistant.name || '', assistant.instructions || ''),
    }));

    return NextResponse.json({ assistants: formattedAssistants });

  } catch (error) {
    console.error('Error fetching assistants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assistants' },
      { status: 500 }
    );
  }
}