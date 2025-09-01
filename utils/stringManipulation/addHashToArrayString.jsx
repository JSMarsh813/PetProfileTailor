export default function stylingTagStringWithHash(content) {
  return content.tags.map((tag) => `#${tag.tag}`).join(" ");
}
