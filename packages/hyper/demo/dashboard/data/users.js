
export function random() {
  return Math.round(Math.random() * 100)
}

export function sample(am, fn) {
  return new Array(am).fill(0).map((el, i) => fn(i))
}

export function enrich(users) {
  return users.map((user, i) => {
    const am = user.commits

    const more = {
      activity: sample(60, i => random()),
      avatar: user.avatar || `avatar-${i + 1}.png`,
      inserts: am * 10 * random(),
      deletes: am * 3 * random(),
      max: 100 + i * 50,
    }
    return { ...user, ...more }
  })
}