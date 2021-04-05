const sass = require("sass");
const fs = require("fs");

const SOURCE_DIR = "_src";
const OUTPUT_DIR = "_build";

compileSass = () => {
  const result = sass.renderSync({
    file: `${SOURCE_DIR}/assets/scss/main.scss`,
    sourceMap: false,
    outputStyle: "compressed",
  });

  try {
    fs.mkdirSync(`${OUTPUT_DIR}/assets/css`, {
      recursive: true,
    });
    fs.writeFileSync(`${OUTPUT_DIR}/assets/css/main.css`, result.css);
    console.log(`SCSS compiled in ${(result.stats.duration / 1000).toFixed(2)} seconds`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = (eleventyConfig) => {
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // https://www.11ty.dev/docs/events/#beforebuild
  eleventyConfig.on("beforeBuild", () => {
    compileSass();
  });

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
