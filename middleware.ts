import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limit store (for MVP)
// In production, use Redis/Upstash
const rateLimitStore = new Map<string, { count: number, resetAt: number }>();

export function middleware(request: NextRequest) {
    const req = request as any;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10; // limits per minute

    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
        return NextResponse.next();
    }

    if (record.count >= maxRequests) {
        return NextResponse.json(
            { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
            { status: 429 }
        );
    }

    record.count++;
    return NextResponse.next();
}

// Only apply to sensitive API routes
export const config = {
    matcher: ['/api/generate/:path*', '/api/enhance/:path*', '/api/analyze/:path*'],
};
