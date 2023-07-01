"use client";
import { usePathname, useRouter } from "next/navigation";
import { Component } from "react";

class YoutubeRedirectedURL extends Component<{ hit: () => void }> {
    render() {
        return <>Redirecting to docs...</>;
    }

    componentDidUpdate(): void {
        return this.props.hit();
    }
}

export default function RedirectToYoutubeDomain({ slug }: { slug?: string[] }) {
    const router = useRouter();
    const path = usePathname();

    function onHit() {
        const args = path.slice(path.lastIndexOf("#"));
        router.push(
            `https://developers.google.com/youtube/${(slug || []).join(
                "/"
            )}${args}`
        );
        return;
    }

    return <YoutubeRedirectedURL hit={onHit} />;
}
