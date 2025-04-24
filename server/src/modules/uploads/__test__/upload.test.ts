import { describe, test } from "node:test"
import { UploadModule } from "../upload.module"
import path from "node:path"
import { dirname } from "dirname"
import fs from "node:fs/promises"
import { openAsBlob, readFile } from "node:fs"
import assert from "node:assert"

const sut = UploadModule.factory()
const imgPaths = [
  path.join(dirname, "/tests/assets/image-test-1.jpg"),
  path.join(dirname, "/tests/assets/image-test-2.jpg"),
  path.join(dirname, "/tests/assets/image-test-3.jpg"),
]
describe("Upload test", () => {
  test("upload service", async () => {
    const blob = await openAsBlob(imgPaths[0])
    const planeFile = new File([blob], "image-test-1.jpg", {
      type: "image/jpeg",
    })

    const { bucketName, fileName, message } = await sut.upload({
      file: planeFile,
      userName: "test",
      bucket: "profile",
    })

    assert.strictEqual(message, "File uploaded successfully")
    assert.strictEqual(bucketName, "bucket-profile")
    assert(fileName)

    await fs.unlink(path.join(dirname, `uploads/${bucketName}/${fileName}`))
  })
  test("download service", async () => {
    const blob = await openAsBlob(imgPaths[1])
    const planeFile = new File([blob], "image-test-2.jpg", {
      type: "image/jpeg",
    })

    const { bucketName, fileName } = await sut.upload({
      file: planeFile,
      userName: "test",
      bucket: "profile",
    })

    const { file, headers } = await sut.download({ fileName, bucketName })

    assert(file)
    assert(headers)

    await fs.unlink(path.join(dirname, `uploads/${bucketName}/${fileName}`))
  })

  test("delete file service", async () => {
    const blob = await openAsBlob(imgPaths[2])
    const planeFile = new File([blob], "image-test-3.jpg", {
      type: "image/jpeg",
    })

    const { bucketName, fileName } = await sut.upload({
      file: planeFile,
      userName: "test",
      bucket: "profile",
    })

    assert(fileName)

    const { message } = await sut.deleteFile({ bucketName, fileName })
    assert.strictEqual(message, "File deleted successfully")

    readFile(path.join(dirname, `uploads/${bucketName}/${fileName}`), (err) => {
      assert(err)
    })
  })
})
