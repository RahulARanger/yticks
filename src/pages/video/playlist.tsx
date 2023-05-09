import Header from "@/components/header";
import { Component, ReactNode } from "react";
import Head from "next/head";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

class Playlist extends Component<WithRouterProps> {
    render(): ReactNode {
        return (
            <Head>
                <title>Search Playlist by ID</title>
            </Head>
        );
    }
}

export default withRouter(Playlist);
