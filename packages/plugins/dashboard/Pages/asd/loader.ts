import { notFound } from "@memtori/router";

const fetchPosts = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return "hello 2222";
  } catch (error) {
    throw notFound();
  }
};
export const loader = (par) => {
  return fetchPosts();
};
