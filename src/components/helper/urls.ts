export function getChannelURL(channelID: string): string {
  return `https://www.youtube.com/channel/${channelID}`;
}

export function hashTag(tag: string): string {
  return `https://www.youtube.com/hashtag/${tag}`;
}
