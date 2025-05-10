
run-tests:
	bun test # compo
	# bun test --coverage

build-demos:
	@ cd demo && bun build.js

minify:
	@ bun bin/minify.js
	cp -r dist demo/dist
	# @ cd dist && brotli -f hyper.js hyper-jit.js

# http://localhost:8000/test/test.html
serve:
	python3 -m http.server

