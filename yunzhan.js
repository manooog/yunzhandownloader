import { log, error } from "node:console"
import {
  createWriteStream,
  mkdir,
  exists,
  mkdirSync,
  existsSync,
} from "node:fs"
import { resolve } from "node:path"
import fetch from "node-fetch"
import { URL } from "node:url"
import { writeFile } from "node:fs/promises"
import { execSync } from "node:child_process"

let succCount = 0

const dir = resolve(new URL(import.meta.url).pathname, "../yunzhan365")

if (existsSync(dir)) {
  execSync(`rm -r ${dir}`)
}
mkdirSync(dir, { recursive: true })

function getUrl(id) {
  return `https://book.yunzhan365.com/kfqs/vhzg/files/mobile/${id}.jpg`
}

async function fetchPic(currentNum) {
  log("fetch", currentNum)

  const res = await fetch(getUrl(currentNum)).catch((err) => {
    error(err)

    return null
  })

  log("done", currentNum, res.ok)
  if (res && res.ok && res.body) {
    succCount += 1

    res.body
      .pipe(createWriteStream(resolve(dir, `${currentNum}.jpg`)))
      .on("finish", () => {
        log("save", currentNum)
      })

    await fetchPic(currentNum + 1)
  }
}

fetchPic(1)
  .then(() => {
    log("done", succCount)
  })
  .catch((err) => {
    error(err)
  })
