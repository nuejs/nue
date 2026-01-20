
async function getData(hostname) {
  const data = await import(`../data/${ hostname }.yaml`)
  return data.default.map((el, i) => {
    return { ...el, index: i + 1 }
  })
}

export async function getItems(hostname) {
  return await getData(hostname)
}

export async function getItem(hostname, id) {
  const items = await getItems(hostname)
  return items.find(el => el.id == id)
}
