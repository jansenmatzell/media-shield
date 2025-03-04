const fs = require('fs-extra');
const path = require('path');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

// Paths
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const cssDir = path.join(srcDir, 'css');
const jsDir = path.join(srcDir, 'js');
const distCssDir = path.join(distDir, 'css');
const distJsDir = path.join(distDir, 'js');

// Create dist directory
fs.emptyDirSync(distDir);
fs.ensureDirSync(distCssDir);
fs.ensureDirSync(distJsDir);

// Copy HTML files
console.log('Copying HTML files...');
fs.copySync(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'));
fs.copySync(path.join(srcDir, 'pages'), path.join(distDir, 'pages'));

// Copy images
console.log('Copying images...');
if (fs.existsSync(path.join(srcDir, 'images'))) {
  fs.copySync(path.join(srcDir, 'images'), path.join(distDir, 'images'));
}

// Minify CSS files
console.log('Minifying CSS files...');
const cssFiles = fs.readdirSync(cssDir).filter(file => path.extname(file) === '.css');

cssFiles.forEach(file => {
  const input = fs.readFileSync(path.join(cssDir, file), 'utf8');
  const output = new CleanCSS().minify(input);
  fs.writeFileSync(path.join(distCssDir, file), output.styles);
  console.log(`Minified ${file}`);
});

// Minify JS files
console.log('Minifying JavaScript files...');
const jsFiles = fs.readdirSync(jsDir).filter(file => path.extname(file) === '.js');

jsFiles.forEach(file => {
  const input = fs.readFileSync(path.join(jsDir, file), 'utf8');
  const output = UglifyJS.minify(input);
  
  if (output.error) {
    console.error(`Error minifying ${file}:`, output.error);
    return;
  }
  
  fs.writeFileSync(path.join(distJsDir, file), output.code);
  console.log(`Minified ${file}`);
});

console.log('Build completed successfully!');