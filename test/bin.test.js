const { describe, it } = require("mocha")
const { expect } = require("chai")
const { join } = require("path")
const { initializeRepo, runBin, getConfig } = require("./helpers")

const bin = join(__dirname, "../src/bin.js")

describe("git identity setter", function(){
  describe("should be able to take no args", function(){
    it("should set the local git config author based off of package.json", function(done){
      const pkg = {
        author: "atlassubbed <atlassubbed@gmail.com>"
      }
      initializeRepo(pkg, (err, cwd) => {
        if (err) return done(err);
        runBin(bin, cwd, err => {
          if (err) return done(err);
          getConfig(cwd, (err, config) => {
            if (err) return done(err);
            expect(config["user.name"]).to.equal("atlassubbed")
            expect(config["user.email"]).to.equal("atlassubbed@gmail.com")
            done()
          })
        })
      })
    })
    it("should fail if package.json is not present", function(done){
      initializeRepo(undefined, (err, cwd) => {
        if (err) return done(err);
        runBin(bin, cwd, (err, out) => {
          if (err) return done(err);
          expect(out.toString()).to.equal("no package.json found\n")
          getConfig(cwd, (err, config) => {
            if (err) return done(err);
            expect(config["user.name"]).to.be.undefined
            expect(config["user.email"]).to.be.undefined
            done()
          })
        })
      })
    })
  })
  describe("should be able to take exactly two args", function(){
    it("should set the local config based off of args instead of package.json", function(done){
      const pkg = {
        author: "atlassubbed <atlassubbed@gmail.com>"
      }
      const overrideName = "atlas"
      const overrideEmail = "atlas@atlassubbed.com"
      initializeRepo(pkg, (err, cwd) => {
        if (err) return done(err);
        runBin(`${bin} ${overrideName} ${overrideEmail}`, cwd, err => {
          if (err) return done(err);
          getConfig(cwd, (err, config) => {
            if (err) return done(err);
            expect(config["user.name"]).to.equal(overrideName)
            expect(config["user.email"]).to.equal(overrideEmail)
            done()
          })
        })
      })
    })
    it("should fail if given only one argument", function(done){
      const pkg = {
        author: "atlassubbed <atlassubbed@gmail.com>"
      }
      const overrideName = "atlas"
      initializeRepo(pkg, (err, cwd) => {
        if (err) return done(err);
        runBin(`${bin} ${overrideName}`, cwd, (err, out) => {
          if (err) return done(err);
          expect(out.toString()).to.equal("git-identity <name> <email>\n")
          getConfig(cwd, (err, config) => {
            if (err) return done(err);
            expect(config["user.name"]).to.be.undefined
            expect(config["user.email"]).to.be.undefined
            done()
          })
        })
      })
    })
  })
})
