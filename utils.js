
const fs = require('fs')
const log = console.log.bind(console)
const writeFlie = function (path, content) {
    fs.writeFileSync(path, content)
}
const readFlie = function (path, format = 'utf8') {
    return fs.readFileSync(path, format)
}
const isSameArray = function (l1, l2) {
    let s1 = JSON.stringify(l1)
    let s2 = JSON.stringify(l2)
    return s1 === s2
}
const indexListByList = function (list, listQuery) {
    for (let i = 0; i < list.length; i++) {
        let start = i
        for (let y = 0; y < listQuery.length; y++) {
            let indexList = start + y
            if (listQuery[y] !== list[indexList]) {
                break
            }
            let isLast = y === listQuery.length - 1
            if (isLast) {
                return start
            }
        }
    }
    return -1
}
const splitListByList = function (l1, l2) {
    const l = []
    let lSearch = l1
    while (1) {
        if (lSearch.length === 0) {
            break
        }
        let index = indexListByList(lSearch, l2)
        if (index === -1) {
            l.push(lSearch)
            break
        } else {
            let left = lSearch.slice(0, index)
            let rightStart = index + l2.length
            let right = lSearch.slice(rightStart)
            if (left.length > 0) {
                l.push(left)
            }
            lSearch = right
        }
    }
    return l
}
module.exports = {
    log,
    writeFlie,
    readFlie,
    isSameArray,
    indexListByList,
    splitListByList
}