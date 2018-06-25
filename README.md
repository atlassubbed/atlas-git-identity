# atlas-git-identity

A CLI tool which sets a git repository's author based on package.json or arguments.

---

## install

```
npm install -g atlas-git-identity
```

Note: make sure you install this globally (`-g`) unless you're using the API for a local project.

## why

There are few things that are more annoying than Gravatar leaking your identity to nearly everything you touch with your e-hands. Similarly with git, you might be surprised when you look back on some of your commits and realize they've been authored under your *real* name. Some people don't care, but this really bothers me as my real name is so common, it makes everything I do much less interesting.

Do yourself a favor and run:

```
git config --global user.useConfigOnly true
```

After running this, your machine will force you to set a local identity on all of your git projects. At least for me, this extra configuration work when I start a new project is well worth the peace of mind (i.e. my privacy). This CLI tool aims to eliminate the extra work I put on myself.

## examples

#### cli tool

After installing this package, the command below will automatically set your git identity for the current project based on your `package.json`'s `"author"` field:

```
git-identity
```

If you don't have this field, you can also specify your name and email as arguments:

```
git-identity atlassubbed atlassubbed@gmail.com
```

#### api

You can also do all of the above programmatically:

```
const { parseAuthor, setIdentity } = require("atlas-git-identity");

const stringAuthor = "atlassubbed <atlassubbed@gmail.com>"
const author = parseAuthor(stringAuthor)
setIdentity(author, process.cwd(), err => {
  if (!err) console.log("success!")
})
```

We can directly set whichever of the git config "user" fields we want:

```
...
setIdentity({name:"atlassubbed"}, err => {
  if (!err) console.log("success!")
})
```

We can set any number of the git config "user" fields:

```
setIdentity({name: "atlassubbed", signingkey: "123"}, err => {
  if (!err) console.log("success!")
})
```

## caveats

At first, this package automatically ran `git config --global user.useConfigOnly true` to remove that step as well, however it's a bad idea because it may not be desired on some machines. Furthermore, the step only needs to be run once and is entirely optional, so it's not a problem. Please run this command separately if you would like to force a local identity on your git projects.



