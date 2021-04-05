const sass = require("sass");
const fs = require("fs");

// Default directories and filenames. Change if necessary.
const SOURCE_DIR = "./_src";
const OUTPUT_DIR = "./_build";
const SCSS_DIR = "./_src/assets/scss";
const SCSS_FILE = "main.scss";
const CSS_OUTPUT_DIR = "./_build/assets/css";
const CSS_FILE = "main.css";

let firstBuildRan = false;

compileSass = () => {
  const result = sass.renderSync({
    file: `${SCSS_DIR}/${SCSS_FILE}`,
    sourceMap: false,
    outputStyle: "compressed",
  });

  try {
    fs.mkdirSync(`${CSS_OUTPUT_DIR}`, {
      recursive: true,
    });
    fs.writeFileSync(`${CSS_OUTPUT_DIR}/${CSS_FILE}`, result.css);
    console.log(`SCSS compiled in ${(result.stats.duration / 1000).toFixed(2)} seconds`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = (eleventyConfig) => {
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // https://www.11ty.dev/docs/events/#beforebuild
  // beforeWatch doesnt run on stand-alone builds or the first time --serve is kicked off.
  // Using a combination of both for performance.
  eleventyConfig
    .on("beforeBuild", () => {
      if (!firstBuildRan) {
        compileSass();
        firstBuildRan = true;
      }
    })
    .on("beforeWatch", (changedFiles) => {
      if (changedFiles.includes(`${SCSS_DIR}/${SCSS_FILE}`)) {
        compileSass();
      }
    });

  eleventyConfig.addWatchTarget(`${SCSS_DIR}/`);

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk"],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: SOURCE_DIR,
      output: OUTPUT_DIR,
    },
  };
};
