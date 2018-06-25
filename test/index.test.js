const { describe, it } = require("mocha")
const { expect } = require("chai")
const rewire = require("rewire")
const helpers = rewire("../src/index")

let revert;

describe("parseAuthor", function(){
  describe("requires an author argument", function(){
    it("should fail if there is an invalid author", function(){
      const badAuthors = [true, 3.14285714286, {}]
      badAuthors.forEach(author => {
        const badAuthor = helpers.parseAuthor(author)
        expect(badAuthor).to.be.null
      })
    })

    it("should fail if the author is an array", function(){
      const disallowArrays = helpers.parseAuthor([])
      expect(disallowArrays).to.be.null
    })

    it("should fail if there is no author", function(){
      const noAuthor = helpers.parseAuthor()
      expect(noAuthor).to.be.null
    })
  })
  describe("allows the author argument to be a string", function(){
    it("should require string to have an email group", function(){
      const author = helpers.parseAuthor("atlassubbed")
      expect(author).to.be.null
    })

    it("should require string to have a name", function(){
      const author = helpers.parseAuthor("<atlassubbed@gmail.com>")
      expect(author).to.be.null
    })

    it("should require email group to be a non-empty, full string", function(){
      const emptyEmail = helpers.parseAuthor("atlassubbed <>")
      const noEmail = helpers.parseAuthor("atlassubbed <  \n \t    >")
      expect(emptyEmail).to.be.null
      expect(noEmail).to.be.null
    })

    it("should require name to be a non-empty, full string", function(){
      const emptyName = helpers.parseAuthor(" <atlassubbed@gmail.com>")
      const noName = helpers.parseAuthor("   \n \t    <atlassubbed@gmail.com>")
      expect(emptyName).to.be.null
      expect(noName).to.be.null
    })

    it("should correctly parse name and email group", function(){
      const author = helpers.parseAuthor("atlassubbed <atlassubbed@gmail.com>")
      expect(author).to.deep.equal({name: "atlassubbed", email: "atlassubbed@gmail.com"})
    })

    it("should not require an actually valid email in email group", function(){
      const author = helpers.parseAuthor("atlassubbed <not an email>")
      expect(author).to.deep.equal({name: "atlassubbed", email: "not an email"})
    })
  })

  describe("allows 'author' argument to be a proper object", function(){
    it("should require object to have an email field", function(){
      const author = helpers.parseAuthor({name: "atlassubbed"})
      expect(author).to.be.null
    })

    it("should require object to have a name field", function(){
      const author = helpers.parseAuthor({email: "atlassubbed@gmail.com"})
      expect(author).to.be.null
    })

    it("should require name field to be a non-empty, full string", function(){
      const badNames = [true, [], 22/7, {}, "", "   \n \t   "]
      badNames.forEach(name => {
        const badAuthor = helpers.parseAuthor({name, email: "atlassubbed@gmail.com"})
        expect(badAuthor).to.be.null
      })
    })

    it("should require email field to be a non-empty, full string", function(){
      const badEmails = [true, [], 22/7, {}, "", "   \n \t   "]
      badEmails.forEach(email => {
        const badAuthor = helpers.parseAuthor({email, name: "atlassubbed"})
        expect(badAuthor).to.be.null
      })
    })

    it("should correctly parse name and email field", function(){
      const authorObj = {email: "atlassubbed@gmail.com", name: "atlassubbed"}
      const author = helpers.parseAuthor(authorObj)
      expect(author).to.deep.equal(authorObj)
    })

    it("should not require an actually valid email in email field", function(){
      const authorObj = {email: "not an email", name: "atlassubbed"}
      const author = helpers.parseAuthor(authorObj)
      expect(author).to.deep.equal(authorObj)
    })

    it("should return only the name and email fields", function(){
      const details = {
        name: "atlassubbed", 
        email: "atlassubbed@gmail.com",
        other: 2.71828
      }
      const relevantFields = {name: "atlassubbed", email: "atlassubbed@gmail.com"}
      const author = helpers.parseAuthor(details)
      expect(author).to.deep.equal(relevantFields)
    })
  })
})

describe("setIdentity", function(){

  beforeEach(function(){
    revert && revert();
  })

  it("should throw error if given no fields", function(){
    let calledExec = 0;
    revert = helpers.__set__("exec", (cmd, opts) => {
      calledExec++;
    })
    helpers.setIdentity({}, "some dir", err => {
      expect(err).to.be.an("error")
      expect(err.message).to.equal("no fields provided")
    })
    expect(calledExec).to.equal(0)
  })
  it("should use the provided cwd when running the git command", function(done){
    const cwd = "some dir"
    revert = helpers.__set__("exec", (cmd, opts) => {
      expect(opts.cwd).to.equal(cwd)
      done();
    })
    helpers.setIdentity({name: "atlassubbed"}, cwd, () => {})
  })
  it("should try and set provided field in git user config if given one field", function(done){
    const name = "atlassubbed"
    revert = helpers.__set__("exec", (cmd, opts) => {
      expect(cmd).to.equal(`git config user.name ${name}`)
      done();
    })
    helpers.setIdentity({name}, "some dir", () => {})
  })
  it("should try and set all provided fields in git user config if given multiple fields", function(done){
    const name = "atlassubbed", email = "atlassubbed@gmail.com"
    revert = helpers.__set__("exec", (cmd, opts) => {
      expect(cmd).to.equal(`git config user.name ${name} && git config user.email ${email}`)
      done()
    })
    helpers.setIdentity({name, email}, "some dir", () => {})
  })
  it("should properly relay command errors to the provided callback", function(done){
    const msg = "cmd failed"
    revert = helpers.__set__("exec", (cmd, opts, cb) => {
      cb(new Error(msg))
    })
    helpers.setIdentity({name: "atlassubbed"}, "some dir", err => {
      expect(err).to.be.an("error")
      expect(err.message).to.equal(msg)
      done()
    })
  })
  it("should provide relay no error on success", function(done){
    const msg = "cmd failed"
    revert = helpers.__set__("exec", (cmd, opts, cb) => {
      cb(null, "stderr", "stdout")
    })
    helpers.setIdentity({name: "atlassubbed"}, "some dir", (err, res) => {
      expect(err).to.be.null
      expect(res).to.be.undefined;
      done()
    })
  })
})
