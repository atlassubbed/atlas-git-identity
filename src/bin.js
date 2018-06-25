#!/usr/bin/env node
const { join } = require("path");
const parseArgs = require("minimist")
const { parseAuthor, setIdentity } = require("./index")

// NOTE: force local config w/ "git config --global user.useConfigOnly true"

const getAuthor = cb => {
  const repoRoot = process.cwd();
  const args = parseArgs(process.argv.slice(2))._, num = args.length;
  let author;
  if (num){
    if (num !== 2) return cb("git-identity <name> <email>");
    author = {name: args[0], email: args[1]}
  } else {
    try {
      author = require(join(repoRoot,"package.json")).author
    } catch {
      return cb("no package.json found")
    }
  }
  author = parseAuthor(author);
  if (!author) return cb("author needs name and email")
  cb(null, author, repoRoot)
}

getAuthor((errMsg, author, repoRoot) => {
  if (errMsg) return console.log(errMsg);
  setIdentity(author, repoRoot, err => {
    console.log(err ? err.message : "success")
  })
})
