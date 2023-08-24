const { readFile, writeFile, readFileSync } = require('fs')
const { createServer } = require('http')
const url = require('url')


// const textInput = readFileSync('./txt/input.txt', 'utf-8')
// const textOutput = `This is what we know about avocado: ${textInput} created on ${Date.now()}
// writeFileSync('./txt/output.txt', textOutput)
// console.log('File written')


readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) return console.log('Error: ', err)

  readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2)

    readFile('./txt/append.txt', 'utf-8', (err, data3) => {

      writeFile('./txt/final.txt', `${data2}\n${data3}\n`, 'utf-8', err => {
        console.log('Your file has been written')
      })
    })

  })
})


let overview = readFileSync('./templates/overview.html', 'utf-8')
const templateProduct = readFileSync('./templates/template-product.html', 'utf-8')
const templateCard = readFileSync('./templates/template-card.html', 'utf-8')
const data = readFileSync(`./dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true)

  if (req.url === '/') {
    res.end('<h1>Home Page</h1>')
  }

  else if (req.url === '/api') {
    res.end(data)
  }

  else if (req.url === '/overview') {
    const cardsHtml = dataObj.map(el => templateReplace(templateCard, el)).join('')
    overview = overview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    res.end(overview)
  }

  else if (pathName === '/product') {
    const product = dataObj[query.id]
    const productHtml = templateReplace(templateProduct, product)
    res.end(productHtml)
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Page not found</h1>')
  }

  console.log('server is running')
})

server.listen(1808)

function templateReplace(templateCard, el) {
  const pattern = /{%([^%]+)%}/g
  const matches = templateCard.match(pattern).map(match => match.slice(2, -2))

  if (!el.organic) templateCard = templateCard.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

  matches.forEach(match => {
    templateCard = templateCard.replace(`{%${match}%}`, el[match])
  })

  return templateCard
}
