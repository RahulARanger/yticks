import { redirect } from "next/navigation";
import { redirectToDocs } from "./redirectComponent";

export function GET(_: Request) {
    redirect(redirectToDocs());
}
