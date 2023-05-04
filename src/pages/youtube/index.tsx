import { withRouter } from "next/router";
import { Component } from "react";
import { WithRouterProps } from "next/dist/client/with-router";

class YoutubeRedirectedURL extends Component<WithRouterProps, {}> {
    render() {
        return <>Redirecting to docs...</>;
    }

    componentDidUpdate(): void {
        const router = this.props.router;
        const slug = (router.query.slug as string[]) || [];
        const actual = window.location.href;
        const args = actual.slice(actual.lastIndexOf("#"));
        router.push(
            `https://developers.google.com/youtube/${slug.join("/")}${args}`
        );
    }
}

export default withRouter(YoutubeRedirectedURL);
