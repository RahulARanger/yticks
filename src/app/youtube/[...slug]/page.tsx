import RedirectToYoutubeDomain from "../redirectComponent";

export function withSlug({ params }: { params: { slug: string[] } }) {
    return <RedirectToYoutubeDomain slug={params.slug} />;
}
