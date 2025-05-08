import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

/**
 * API route for serving OpenAPI documentation
 */
export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
} 