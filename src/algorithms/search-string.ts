/* Rabin-Karp Substring Search: searches for a substring in a string in
 * O(<string length>) time by comparing string hashes. Returns the start
 * indices of all instances of the substring within the string.
 */

import { Index } from "../util";

// Aliased types for clarity (BDD)
export type Character = string;
// bigint is necessary to store base 128 numbers for long substrings
export type Hash = bigint;

// Based on the most popular letters, numbers, and symbols found on a US standard keyboard:
// 1 space character
// 26 upper case letters
// 26 lower case letters
// 10 digits
// 32 special characters: ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
export const orderedCharacters = ` ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`;
// Max symbol code value is 95, which I'm rounding up to base 128 (2^7)
export const base = 128;

export const getCodeForCharacter = (char: Character) => {
  const code = BigInt(orderedCharacters.indexOf(char));
  // Stryker disable next-line all: prevents assignment of character lookup string to an empty string
  if (code === BigInt(-1)) {
    throw new Error(
      // Stryker disable next-line all
      "Character code must be positive (the character lookup string must not be empty)",
    );
  }
  return code;
};

export const getRabinFingerprintHash = (substring: string): Hash => {
  let hashValue: Hash = BigInt(0);
  for (let i = 0; i < substring.length; i++) {
    hashValue +=
      getCodeForCharacter(substring.at(i)!) *
      BigInt(base ** (substring.length - 1 - i));
  }
  return hashValue;
};

const rollRabinFingerprintHash = (
  substringLength: number,
  hash: Hash,
  startCharacter: Character,
  endCharacter: Character,
): Hash => {
  let resultHash = hash;
  resultHash -=
    getCodeForCharacter(startCharacter) * BigInt(base ** (substringLength - 1));
  resultHash *= BigInt(base);
  resultHash += getCodeForCharacter(endCharacter);
  return resultHash;
};

export const rabinKarpSubstringSearch = (
  sourceString: string,
  substring: string,
  generateHashFunction: (substring: string) => Hash = getRabinFingerprintHash,
  rollHashFunction: (
    substringLength: number,
    hash: Hash,
    startCharacter: Character,
    endCharacter: Character,
  ) => Hash = rollRabinFingerprintHash,
) => {
  let candidates = getRabinKarpSearchCandidates(
    sourceString,
    substring,
    generateHashFunction,
    rollHashFunction,
  );

  // filter out candidates which do not match
  candidates = candidates.filter((candidate) => {
    const candidateSubstring = sourceString.substring(
      candidate,
      candidate + substring.length,
    );
    return candidateSubstring === substring;
  });

  return candidates;
};

export const getRabinKarpSearchCandidates = (
  sourceString: string,
  substring: string,
  generateHashFunction: (substring: string) => Hash = getRabinFingerprintHash,
  rollHashFunction: (
    substringLength: number,
    hash: Hash,
    startCharacter: Character,
    endCharacter: Character,
  ) => Hash = rollRabinFingerprintHash,
) => {
  const targetHash = generateHashFunction(substring);
  const substringLength = substring.length;
  // store the start indices of substrings with matching hashes as we go
  // these are candidates, since there is a possibility of collisions
  // (note: collisions may not)
  const candidates: Array<Index> = [];

  // compute the hash for the first <substring length> letters of the source
  // string
  let hash: Hash = generateHashFunction(sourceString.slice(0, substringLength));
  if (hash === targetHash) {
    // start index of zero if the first substring is a potential match
    candidates.push(0);
  }
  let startCharacter: Character = sourceString.at(0)!;

  // roll the hash as we continue through the rest of the string up until the
  // last possible match position
  const sourceStringLength = sourceString.length;
  for (let i = 1; i < sourceStringLength - substringLength + 1; i++) {
    hash = rollHashFunction(
      substringLength,
      hash,
      startCharacter,
      sourceString.at(i + substringLength - 1)!,
    );
    startCharacter = sourceString.at(i)!;
    if (hash === targetHash) {
      candidates.push(i);
    }
  }

  return candidates;
};
