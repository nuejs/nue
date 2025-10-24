

test('push test', async () => {
  const resp = await fetch('https://push.nuejs.com/acme/www/index.html', {
    headers: { 'Authorization': 'Bearer acme-test-123' },
    body: '<h1>Hello Worldi!</h1>',
    method: 'POST',
  })

  console.info(resp)
  console.info(await resp.text())
})

test('upload site.json', async () => {
  const resp = await fetch('https://push.nuejs.com/acme/www/site.json', {
    headers: { Authorization: 'Bearer acme-test-123' },
    body: '{ "chain": [ "www", "blog" ] }',
    method: 'POST',
  })

  console.info(resp)
  console.info(await resp.text())
})

