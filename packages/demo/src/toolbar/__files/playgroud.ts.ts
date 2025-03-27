export default {
  // @ts-ignore
  filename: 'playgroud.ts',
  source: `
// ref: https://www.typescriptlang.org/play/?&q=68#code/PTAEBUE8AcFNQK4DsCWB7JBnUBDATvDqAO46ShoBmoAJrAMYA2+KSA5qAC4AWOnuSCgCMAVg04AoEKHpoEjGqCHwAtmgJdegjPE4xYAOgkS9cUAGVOeVmwDyeAHIIVyvKAC8oTFZugAPqBIzq4A3Cb6oAAKeGj0sJiYlnzxHqAARGhwSGn+6UxomLA0aWGm8LY0NE4usHiYAKpIdHjgsIKeAIy5AMy5AKy5AOy5AJylEQCCALLxmJCN6O3p3LCMjGg5AR19AGy5AN6gtTF4AFxceAjwAL5hUmAAktQ88AiFFNQZWTk4TXnrhWKoAAbthvNZ2KAUJh7oFYMQuGhQJA5AAaGQregAawoCE451gAA8cCpoIxYKdGChOLUcIwYbCAOrwei-UAqFCE2goSiUWptfhlbCsThIojIRbo340WHEXj8YiwADkGkwZF80M0fE08GBdKuUOwOg+mgKun0mCMsKgcHM9Gs0AVKDWOsE5JwwPgKIQiNAlBQbAQGjk-G4aARothdBpeA5SHgcpQ9G4IP18GpMjkCiUhH4lyQnBQKkMxmkCww2FZgkwaGLheL2GUiCatTjRSU5DKJBQdFQ7FRsMo6iOxNJ5NOxi7jNYNHDSRp2E8Xzam3+ZqBATScaLKAAXkVV+CbHdpE9kXJQGHPW4cEI0J70d6ZGzCrp5aBp0055xkjDpMpZAbXAvB8SEAFpAjQQUVmbRYDAgbhNU1WRr3bVhYSJEkyQpMowOIHs2hsMDpTApB8BifD2FLR5qHFVAMENARQFsAAldEXkENkRVqQp6ELBjNTZCYHAAESMU8Cx48RFi4C1cA0OU2i4YgkSFKFJLqcRfXtWBklhIh4wjfR4PARDsDpdZiGwIc3C7QDoAKak4OMbi8EoHA4lAABRPATgACWlKlIX2CRQC8BB6DiBJzjvNB3SQMIwuOdQAH5zkOBs1TYCkQIhDhbgka4XI09zPImPBOBUvAsUwES+CIEKwvwSr1Bq9KuGpcdct8a4AG0AF0wiKiRXNK+BysLbxavq0BGvkybOEwdqyOLc4j0hPrBsK6iEPidMSo8lIqxzTNSXXdTQAITAHKwFJE2TS8PVgWE7x4TMsGhGkCyOXzhy0GggrYKU-heFA3HDQQaHqq0uwmqqapY+IbveTw4da6af1AAAybzfrwAKmkB8YzAmz7MER66K3gVGKrJurMZxnz-MC48doAMWHTCxwpYxZCwUNAtgUmpop5HqdAAAKK6xfOYXFtFqmAEoPAAPlm0KoWoKWkapgxkrwZW5rCvma3JPW8e1ynbvNk4DEynBssVxKwsu2BOCDBKNeG42Kziwx1jYS2xYMZqyadwqTzACZ2U5E0Hg03j+M4v5y0ENSANrFICAsyBYTeWBKHkEgVkEJ9eE9Z9CmwRSNDZNBRC03hsEjaRWCYBA6AoeMTRa1NGCuJbipjMbQAAYWzmk5YAIXQKecHeObQ+8B4RLW0C2GdngwZoSJmsgNKlDQP3fiGycInH3TJ9p7wZ7QRGAEcB-4TwL+SafZ-n+AcYlw5uE4FRGBrzyqAa4Bx2T4CxLOYgSAgE9XDrCBw4Zzw+mOhgRg5AdLJGAgQR+8QFQl2QepdudB9LX04CvAQihYDUhWG4P+ACKBuBUBAqBSBeYVgVK1GwD8n7nFflfBat8eF4NSIvMhK9zhpCEL8GqkA0gDjCsw6qrDJFzyQLIxibJfgYEgGoN43l2DMCaGBaRgJQBsDwDgXkTl5qfQMPY+REd2H8yUDgGgwjvB8InkLMhQjYC4O8KIjWS9yGr3SNI9RcxHEFSAA
// Type unions are a way of declaring that an object
// could be more than one type.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// If the use of "open" and "closed" vs string is
// new to you, check out: example:literals

// We can mix different types into a union, and
// what we're saying is that the value is one of those types.

// TypeScript will then leave you to figure out how to
// determine which value it could be at runtime.

// Unions can sometimes be undermined by type widening,
// for example:

type WindowStates = "open" | "closed" | "minimized" | string;

// If you hover above, you can see that WindowStates
// becomes a string - not the union. This is covered in
// example:type-widening-and-narrowing

// If a union is an OR, then an intersection is an AND.
// Intersection types are when two types intersect to create
// a new type. This allows for type composition.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces can be composed in responses which have
// both consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// For example:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// A mix of Intersection and Union types becomes really
// useful when you have cases where an object has to
// include one of two values:

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = CreateArtistBioBase & ({ html: string } | { markdown: string });

// Now you can only create a request when you include
// artistID and either html or markdown

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};

`.trim(),
};
