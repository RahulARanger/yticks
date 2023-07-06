export function redirectToDocs(slug?: string[], args?: string) {
  return `https://developers.google.com/youtube/${(slug || []).join("/")}${
    args || ""
  }`;
}
