type SlashPath = "/" | `/${string}`;

type NormalizePrefix<P extends SlashPath> = P extends "/" ? "" : P;

type PrefixedPath<
  Prefix extends SlashPath,
  Path extends SlashPath,
> = Path extends "/" ? Prefix : `${NormalizePrefix<Prefix>}${Path}`;

export const withPrefix =
  <const Prefix extends SlashPath>(prefix: Prefix) =>
  <const Path extends SlashPath>(path: Path): PrefixedPath<Prefix, Path> => {
    const normalizedPrefix = (prefix as string) === "/" ? "" : prefix;
    const normalizedPath = (path as string) === "/" ? "" : path;

    return (normalizedPrefix + normalizedPath || "/") as PrefixedPath<
      Prefix,
      Path
    >;
  };
