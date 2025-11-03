
export async function push({ paths }) {
  const tree = createTree()
  await tree.load()


  tree.sites
  const ts = await getLastPushTime()
  const assets = tree.getAll().filter(el => el.file.lastModified > ts)
}


async function getLastPushTime() {

}


