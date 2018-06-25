const { describe, it } = require("mocha")
const { expect } = require("chai")
const { parseAuthor } = require("../src/index")

describe("parseAuthor", function(){
  describe("requires an author argument", function(){
    it("should fail if there is an invalid author", function(){
      const badAuthors = [true, 3.14285714286, {}]
      badAuthors.forEach(author => {
        const badAuthor = parseAuthor(author)
        expect(badAuthor).to.be.null
      })
    })

    it("should fail if the author is an array", function(){
      const disallowArrays = parseAuthor([])
      expect(disallowArrays).to.be.null
    })

    it("should fail if there is no author", function(){
      const noAuthor = parseAuthor()
      expect(noAuthor).to.be.null
    })
  })
  describe("allows the author argument to be a string", function(){
    it("should require string to have an email group", function(){
      const author = parseAuthor("atlassubbed")
      expect(author).to.be.null
    })

    it("should require string to have a name", function(){
      const author = parseAuthor("<atlassubbed@gmail.com>")
      expect(author).to.be.null
    })

    it("should require email group to be a non-empty, full string", function(){
      const emptyEmail = parseAuthor("atlassubbed <>")
      const noEmail = parseAuthor("atlassubbed <  \n \t    >")
      expect(emptyEmail).to.be.null
      expect(noEmail).to.be.null
    })

    it("should require name to be a non-empty, full string", function(){
      const emptyName = parseAuthor(" <atlassubbed@gmail.com>")
      const noName = parseAuthor("   \n \t    <atlassubbed@gmail.com>")
      expect(emptyName).to.be.null
      expect(noName).to.be.null
    })

    it("should correctly parse name and email group", function(){
      const author = parseAuthor("atlassubbed <atlassubbed@gmail.com>")
      expect(author).to.deep.equal({name: "atlassubbed", email: "atlassubbed@gmail.com"})
    })

    it("should not require an actually valid email in email group", function(){
      const author = parseAuthor("atlassubbed <not an email>")
      expect(author).to.deep.equal({name: "atlassubbed", email: "not an email"})
    })
  })

  describe("allows 'author' argument to be a proper object", function(){
    it("should require object to have an email field", function(){
      const author = parseAuthor({name: "atlassubbed"})
      expect(author).to.be.null
    })

    it("should require object to have a name field", function(){
      const author = parseAuthor({email: "atlassubbed@gmail.com"})
      expect(author).to.be.null
    })

    it("should require name field to be a non-empty, full string", function(){
      const badNames = [true, [], 22/7, {}, "", "   \n \t   "]
      badNames.forEach(name => {
        const badAuthor = parseAuthor({name, email: "atlassubbed@gmail.com"})
        expect(badAuthor).to.be.null
      })
    })

    it("should require email field to be a non-empty, full string", function(){
      const badEmails = [true, [], 22/7, {}, "", "   \n \t   "]
      badEmails.forEach(email => {
        const badAuthor = parseAuthor({email, name: "atlassubbed"})
        expect(badAuthor).to.be.null
      })
    })

    it("should correctly parse name and email field", function(){
      const authorObj = {email: "atlassubbed@gmail.com", name: "atlassubbed"}
      const author = parseAuthor(authorObj)
      expect(author).to.deep.equal(authorObj)
    })

    it("should not require an actually valid email in email field", function(){
      const authorObj = {email: "not an email", name: "atlassubbed"}
      const author = parseAuthor(authorObj)
      expect(author).to.deep.equal(authorObj)
    })

    it("should return only the name and email fields", function(){
      const details = {
        name: "atlassubbed", 
        email: "atlassubbed@gmail.com",
        other: 2.71828
      }
      const relevantFields = {name: "atlassubbed", email: "atlassubbed@gmail.com"}
      const author = parseAuthor(details)
      expect(author).to.deep.equal(relevantFields)
    })
  })
})
