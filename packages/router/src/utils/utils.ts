import { FileNames } from "../constants/file.constants";

export function getPageName(path: string) {
  const name = path.split("/");
  const index = name.findIndex(
    (item) => item == FileNames.lazyPage || item == FileNames.page
  );
  return name.at(index - 1);
}
export function isLazyPage(path: string) {
  return path.includes("lazy");
}
export function isLazyLoader(path: string) {
  return path.includes(FileNames.loader);
}
