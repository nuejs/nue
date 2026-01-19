
async function getData(hostname) {
  const data = await import(`../data/${ hostname }.yaml`)
  return data.default
}

export async function getItems(hostname) {
  const data = await getData(hostname)
  return Object.keys(data).map(key => ({ key, ...data[key]}))
}

export async function getItem(hostname, key) {
  const items = await getItems(hostname)
  return items.find(el => el.key == key)
}
