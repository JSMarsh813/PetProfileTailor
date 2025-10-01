import {
  exactWordsBlocked,
  exactWordsBlockedEverywhere,
  blocklistSubstrings,
} from "@/data/blockList";

// ------------------------------
// TRIE IMPLEMENTATION (for substring blocklist)
// ------------------------------
// Set lookups: O(1) per word.
//Trie search: O(n) per character of input, which is very fast even for thousands of substring entries.
// Efficient for large substring lists (Trie is O(n) per input character).

//Why Trie is efficient here
//  Instead of checking each substring against the string individually (O(n*m) where n is string length and m is number of substrings), a Trie allows us to scan the string once while efficiently checking for all blocklist substrings.
// Works really well when:
// You have thousands of blocklist items.
// You have long input strings (like 2000 chars).

// In short:
// Insert all substrings into the Trie.
// Scan the string character by character, following Trie paths.
// Stop immediately if a match is found.

class TrieNode {
  // Each TrieNode represents a single character.
  constructor() {
    this.children = {}; // Holds the next character nodes, each key is a character, and the value is another trienode
    this.isEnd = false; // Marks the end of a wor
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // insert("cat")
  insert(word) {
    //adds a word (substring) into the Trie
    let node = this.root;
    for (const char of word.toLowerCase()) {
      //We iterate over each character
      // root has no child "c" for "cat"? create a "c" node
      if (!node.children[char]) node.children[char] = new TrieNode();
      // If the character doesn’t exist yet in the current node’s children, we create a new TrieNode

      node = node.children[char];
      // Move down to  the next node (node = node.children[char]) and repeat. aka node = node.children["c"]
      // otherwise we'd just keep overwriting the children at the root
      // replaces the variable "node" with node.children[char]

      // root
      //   └─ c
      //      └─ a
      //         └─ t
      //

      // if it stayed "this.root" we'd just keep overwriting the root so the trie would be flat, not nested

      // root
      //  ├─ a
      //  └─ t
      //  ├─ c
    }
    node.isEnd = true; //After finishing the word, we mark isEnd = true to signify the end of a valid substring.
  }

  searchInString(str) {
    str = str.toLowerCase();
    for (let i = 0; i < str.length; i++) {
      //We scan the string starting from each character (i index)
      let node = this.root;
      let j = i;
      while (j < str.length && node.children[str[j]]) {
        // From i, we traverse down the Trie (j index) as long as there’s a matching child node.
        node = node.children[str[j]];
        if (node.isEnd) return str.slice(i, j + 1); // If we reach a node where isEnd === true, that means we found a substring from the blocklist inside the string
        // returns the substring found (so you know which block triggered the rejection).
        j++;
      }
    }
    return null;
  }
}
// Build Trie once for substrings
const substringTrie = new Trie();
blocklistSubstrings.forEach((item) => substringTrie.insert(item));

// ------------------------------
// SINGLE-PASS CHECK FUNCTION
// ------------------------------

const exactWordBlocklistSet = new Set(exactWordsBlocked);
const blockedEverywhereSet = new Set(exactWordsBlockedEverywhere);

export function checkBlocklists(input, type) {
  // type = "names", "descriptions"
  const normalizedInput = input.toLowerCase();

  // 1. Check forbidden everywhere first
  // the exact word "coon" will always be rejected, but racoon will be accepted

  const words = normalizedInput.split(/\s+/);
  for (const word of words) {
    if (blockedEverywhereSet.has(word)) {
      return { allowed: false, blockedBy: word, type: "banned-everywhere" };
    }
  }

  // 2.  Check exact-word blocklist (only for names)
  // butt will be rejected, but fluffy butt won't
  if (type === "names") {
    let wordStart = 0;
    for (let i = 0; i <= normalizedInput.length; i++) {
      const char = normalizedInput[i] || " ";
      if (char === " " || i === normalizedInput.length) {
        const word = normalizedInput.slice(wordStart, i);
        if (exactWordBlocklistSet.has(word)) {
          return { allowed: false, blockedBy: word, type: "exact-name" };
        }
        wordStart = i + 1;
      }
    }
  }

  // 3. Check substring blocklist (applies to descriptions and names)
  // "vagina" used anywhere "vaginas" ect will lead to a rejection

  const substringMatch = substringTrie.searchInString(normalizedInput);
  if (substringMatch) {
    return { allowed: false, blockedBy: substringMatch, type: "substring" };
  }

  return { allowed: true, blockedBy: null, type: null };
}

// ------------------------------
// USAGE
// ------------------------------

// console.log(checkBlocklists("fluffy butt", "name"));
// // { allowed: true, blockedBy: null, type: null }

// console.log(checkBlocklists("butt", "name"));
// // { allowed: false, blockedBy: "butt", type: "exact-name" }

// console.log(checkBlocklists("this is chinky", "description"));
// // { allowed: false, blockedBy: "chink", type: "banned-everywhere" }

// console.log(checkBlocklists("vaginal content", "description"));
// // { allowed: false, blockedBy: "vag", type: "substring" }

// import { checkBlocklists } from "@/utils/checkBlocklists";
