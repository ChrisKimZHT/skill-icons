const express = require('express');
const icons = require('./dist/icons.json');
const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];
const shortNames = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
};
const themedIcons = [
  ...Object.keys(icons)
    .filter(i => i.includes('-light') || i.includes('-dark'))
    .map(i => i.split('-')[0]),
];

const ICONS_PER_LINE = 15;
const ONE_ICON = 48;
const SCALE = ONE_ICON / (300 - 44);

function generateSvg(iconNames, perLine) {
  const iconSvgList = iconNames.map(i => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${
            Math.floor(index / perLine) * 300
          })">
          ${i}
        </g>
        `
      )
      .join(' ')}
  </svg>
  `;
}

function parseShortNames(names, theme = 'dark') {
  return names.map(name => {
    if (iconNameList.includes(name))
      return name + (themedIcons.includes(name) ? `-${theme}` : '');
    else if (name in shortNames)
      return (
        shortNames[name] +
        (themedIcons.includes(shortNames[name]) ? `-${theme}` : '')
      );
  });
}

async function handleIcons(req, res) {
  const { i, icons, t, theme, perline } = req.query;

  const iconParam = i || icons;
  if (!iconParam) {
    res.status(400);
    return res.send("You didn't specify any icons!");
  }
  const theme_ = t || theme;
  if (theme_ && theme_ !== 'dark' && theme_ !== 'light') {
    res.status(400);
    return res.send('Theme must be either "light" or "dark"');
  }
  const perLine = perline || ICONS_PER_LINE;
  if (isNaN(perLine) || perLine < -1 || perLine > 50) {
    res.status(400);
    return res.send('Icons per line must be a number between 1 and 50');
  }

  let iconShortNames = [];
  if (iconParam === 'all') iconShortNames = iconNameList;
  else iconShortNames = iconParam.split(',');

  const iconNames = parseShortNames(iconShortNames, theme_ || undefined);
  if (!iconNames) {
    res.status(400);
    return res.send("You didn't format the icons param correctly!");
  }

  const svg = generateSvg(iconNames, perLine);

  res.type('image/svg+xml');
  return res.send(svg);
}

const handleApiIcons = (req, res) => {
  res.type('application/json;charset=UTF-8');
  return res.send(JSON.stringify(iconNameList));
}

const handleApiSvgs = (req, res) => {
  res.type('application/json;charset=UTF-8');
  return res.send(JSON.stringify(icons))
}

const app = express();
app.get("/", (_, res) => res.redirect('https://github.com/ChrisKimZHT/skill-icons'));
app.get("/icons", handleIcons);
app.get("/api/icons", handleApiIcons);
app.get("/api/svgs", handleApiSvgs);
app.listen(9000);