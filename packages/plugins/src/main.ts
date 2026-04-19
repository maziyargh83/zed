// Load all routes from plugins
const plugins = import.meta.glob("../**/main.tsx", {
  eager: true,
});
