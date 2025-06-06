import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieConfirm = req.cookies.get("confirm_access")?.value;
  const cookieCheckUser = req.cookies.get("refreshToken")?.value;  
  const pathname = req.nextUrl.pathname;
  if (pathname === "/confirm-email"  &&  !cookieConfirm ) {
    return NextResponse.redirect(new URL('/not-found', req.url));
  }
  if(pathname.startsWith("/user") || pathname.startsWith('/seller') || pathname.startsWith('/seller-register')&& !cookieCheckUser ){
    return NextResponse.redirect(new URL('/not-found', req.url));
  }
  if ((pathname === "/checkout" || pathname === "/cart" || pathname === "/cart/checkout" ) && !cookieCheckUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (cookieCheckUser && (pathname === "/login" || pathname === "/register" || pathname === "/confirm-email" || pathname === '/forget-password'  )) {
    return NextResponse.redirect(new URL('/', req.url)); 
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/confirm-email", "/login", "/register", '/forget-password', "/user/:path*" ,"/checkout" , "/cart" ,"/cart/checkout", "/seller", "/seller-register"], 
};