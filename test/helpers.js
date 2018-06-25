const { exec } = require("child_process")
const { writeFile, mkdir } = require("fs")
const { join } = require("path")
const tmp = require("tmp")

// XXX currently node-tmp doesn't cleanup on CTRL+C, should be fixed soon
tmp.setGracefulCleanup()

const runBin = (bin, cwd, cb) => {
  exec(`node ${bin}`, {cwd}, cb)
}

const initializeRepo = (pkg, cb) => {
  tmp.dir({dir: __dirname, unsafeCleanup: true, keep: false}, (err, cwd) => {
    if (err) return cb(err);
    exec("git init", {cwd}, (err, std) => {
      if (err) return cb(err);
      pkg = JSON.stringify(pkg)
      if (!pkg) return cb(null, cwd);
      writeFile(join(cwd, "package.json"), pkg, err => {
        cb(err, cwd)
      })
    })
  })
}

const getConfig = (cwd, cb) => {
  exec("git config --list --local", {cwd}, (err, std) => {
    if (err) return cb(err);
    cb(null, std.split("\n").reduce((p,c) => {
      const pair = c.split("=");
      p[pair[0]] = pair[1]
      return p;
    },{}))
  })
}

module.exports = { initializeRepo, getConfig, runBin }
