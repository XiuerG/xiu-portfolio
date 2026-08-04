/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "xiu-portfolio";

const nextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        images: { unoptimized: true },
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
        env: {
          NEXT_PUBLIC_BASE_PATH: `/${repoName}`,
        },
      }
    : {
        env: {
          NEXT_PUBLIC_BASE_PATH: "",
        },
      }),
};

export default nextConfig;
