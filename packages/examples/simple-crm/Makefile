
generate-mock:
	bun mock-generator/generate.js

build-rust:
	cd rust && wasm-pack build --target web
	cd rust && mv pkg/*.js pkg/*.wasm ../app/model