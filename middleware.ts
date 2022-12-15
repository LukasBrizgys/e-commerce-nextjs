import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
export const config = {
    matcher: [
    '/api/paymentIntent',
    '/api/cart',
    '/api/cartComponent',
    '/api/cartComponent/:componentId',
    '/api/cartComponent/:componentId/quantity/:quantity',
    '/admin/dashboard'
]
};
export const middleware = async(request: NextRequest)  => {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient({req:request, res: res});
    if(request.nextUrl.pathname.startsWith('/api/paymentIntent') ||
        request.nextUrl.pathname.startsWith('/checkout') ||
        request.nextUrl.pathname.startsWith('/api/cart') ||
        request.nextUrl.pathname.startsWith('/api/cartComponent')

    ) {
        const sessionCookie = request.cookies.get('sessionId')?.value;
        if(!sessionCookie) {
            let expiryDate = new Date();
            const month = (expiryDate.getMonth() + 1) % 12;
            expiryDate.setMonth(month);
            const generatedId = crypto.randomUUID();
            res.cookies.set({
                name: 'sessionId',
                value: generatedId,
                path:'/',
                httpOnly:true,
                expires:expiryDate,
                sameSite:'lax' 
            })
            await supabase.from('Cart').insert({
                sessionId: generatedId,
                userId: null,
                createdAt: new Date().toUTCString()
            })

        }
    }
    if(request.nextUrl.pathname.startsWith('/admin/')) {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if(session?.user.role === 'service_role') return res;

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/'
        redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl);
    }
    return res;
}