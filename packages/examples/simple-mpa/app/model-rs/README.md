
# Rust Model
This contains the source code for the high-performance Rust computation engine.
Nue automatically skips the `model-rs` folder during standard website generation.

## Compilation
Built using:

`wasm-pack build --target web`

Post-compilation, the generated `.js` and `.wasm` files are relocated to `model/wasm`.
See the `Makefile` at the project root for details.

