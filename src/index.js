const { exec } = require("child_process");

const isObj = obj => obj && typeof obj === "object" && !Array.isArray(obj);
const isFullStr = str => str && typeof str === "string" && str.trim();
const contains = (arr, el) => arr.indexOf(el) > -1;
const getInfo = obj => {
  let i = 0, res = {};
  for (let k in obj)
    if (contains(["name","email"],k) && isFullStr(obj[k]))
      res[k] = obj[k].trim(), i++;
  return i === 2 ? res : null
}

const parseAuthor = a => {
  if (!a) return null
  if (isFullStr(a)){
    const match = a.match(/(?<name>.*)<(?<email>.*)>/);
    return match ? getInfo(match.groups) : null
  }
  return isObj(a) ? getInfo(a) : null;
}

const setIdentity = (author, cwd, cb) => {
  let cmd = "";
  for (let field in author)
    cmd += `git config user.${field} ${author[field]} && `;
  if (!cmd) return cb(new Error("no fields provided"));
  exec(cmd.slice(0,-4), {cwd}, (err, stdout, stderr) => {
    err ? cb(err) : cb(null);
  })
}

module.exports = { setIdentity, parseAuthor }
