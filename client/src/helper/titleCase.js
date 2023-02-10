export default function titleCase(tag) {
    return tag.split(" ").map(text => text[0].toUpperCase() + text.slice(1)).join(" ")
} 
