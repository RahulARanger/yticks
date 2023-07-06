import { ReactNode } from "react";
import Script from "next/script";

export default function PyodideLayer({ children }: { children: ReactNode }) {
    return (
        <>
            {/* <Script
                src={`https://cdn.jsdelivr.net/pyodide/v0.23.3/${
                    process.env.NEXT_PUBLIC_IS_DEV ? "debug" : "full"
                }/pyodide.js`}
            ></Script> */}
            {children}
        </>
    );
}
