
// GitHub Pages static export support
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isGithubPages && repoName ? {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  } : {}),
};

export default nextConfig;
