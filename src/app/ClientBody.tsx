
"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
// "use client";

// import { useEffect } from "react";
// import { SessionProvider } from "next-auth/react";

// export default function ClientBody({children}: { children: React.ReactNode;}) {
//   useEffect(() => {
//     document.body.className = "antialiased";
//   }, []);

//     return <SessionProvider>{children}</SessionProvider>;

// }