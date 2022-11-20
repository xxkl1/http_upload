
const {log, writeFlie, isSameArray, indexListByList, splitListByList} = require('./utils.js')
const http = require('http')
const hostname = 'localhost'
const port = 3000
const responeText = (res, text) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${ text }\n`)
}
const boundaryStart = function (req) {
    let headers = req.headers
    let c = headers['content-type']
    let delimiter = 'boundary='
    let index = c.indexOf(delimiter)
    let start = index + delimiter.length
    let b = c.slice(start)
    return b
}
const indexRNX2 = function (boundary) {
    return indexListByList(boundary, [
        13,
        10,
        13,
        10
    ])
}
const removeHeadAndEnd = function (content, start) {
    let c = content
    let lenStart = start.length + 2
    let lenEnd = lenStart + 4
    c = c.slice(lenStart, c.length - lenEnd)
    c = c.slice(2, c.length - 2)
    return c
}
const messageFromContent = function (content) {
    let index = indexRNX2(content)
    let m = content.slice(0, index)
    return m
}
const fliedataFromContent = function (boundary) {
    let index = indexRNX2(boundary)
    let start = index + 4
    let c = boundary.slice(start)
    return c
}
const filenameFromContent = function (content) {
    let c = content
    let m = messageFromContent(c)
    m = m.toString()
    let l = m.split('\r\n')
    for (let s of l) {
        if (s.startsWith('Content-Disposition')) {
            let delimiter = 'filename='
            let i = s.indexOf(delimiter)
            let start = i + delimiter.length
            let name = s.slice(start + 1, s.length - 1)
            return name
        }
    }
}
const contentList = function (content, boundary) {
    boundary = Buffer.from(boundary)
    let start = Buffer.from([
        13,
        10,
        45,
        45
    ])
    boundary = Buffer.concat([
        start,
        boundary
    ])
    let l = splitListByList(content, boundary)
    return l
}
const wirteFileUpload = function (filename, filedata) {
    writeFlie(`./upload/${ filename }`, filedata)
}
const wirteFileUploadByContent = function (content) {
    let filename = filenameFromContent(content)
    let filedata = fliedataFromContent(content)
    wirteFileUpload(filename, filedata)
}
const generateFile = function (req, buffer) {
    let b = buffer
    let start = boundaryStart(req)
    let c = removeHeadAndEnd(b, start)
    let l = contentList(c, start)
    for (let e of l) {
        wirteFileUploadByContent(e)
    }
}
const responseUpload = function (req, res) {
    let l = []
    req.on('data', function (data) {
        l.push(data)
    })
    req.on('end', function () {
        let b = Buffer.concat(l)
        generateFile(req, b)
        responeText(res, 'upload success')
    })
}
const responseHome = function (res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('home\n')
}
const server = http.createServer((req, res) => {
    let url = req.url
    if (url === '/') {
        responseHome(res)
    } else if (url === '/upload') {
        responseUpload(req, res)
    }
})
server.listen(port, () => {
    console.log(`sever http://${ hostname }:${ port }/`)
})