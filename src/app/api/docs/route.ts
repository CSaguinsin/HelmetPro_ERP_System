import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

/**
 * API route for serving OpenAPI documentation
 * Using Edge runtime to reduce function size
 */
export const runtime = 'edge';

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
} 