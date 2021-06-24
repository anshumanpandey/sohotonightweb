const fse = require('fs-extra');

const dirs = [
  { src: `node_modules/bootstrap/dist/`, dest: `public/bootstrap.3.3.6/` },
  { src: `node_modules/font-awesome/css`, dest: `public/font-awesome-4.7.0/css` },
  { src: `node_modules/font-awesome/fonts`, dest: `public/font-awesome-4.7.0/fonts` },
]

dirs.forEach(d => {
  fse.copySync(d.src, d.dest, { overwrite: true },function (err) {
    if (err) {
      console.error(err);      
    }
  });
})
console.log("success!");