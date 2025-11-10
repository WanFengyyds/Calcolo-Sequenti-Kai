# Sequent Solver - Web Version

This is a web-based port of the Sequent Solver application. It provides sequent calculus derivation visualization directly in your browser.
[WebSite](https://calcolo-squenti-kai.netlify.app/)

## Features

- **Interactive Input**: Enter sequents or propositions and see real-time derivation
- **Visual Derivation Tree**: Rendered as a tree structure with rules applied
- **Zoom Controls**: Zoom in/out to view complex derivations
- **Comprehensive Symbol Support**: All logical operators and symbols supported

## How to Run

Simply open `index.html` in any modern web browser. No server or build process required!

### Quick Start

1. Open `index.html` in your browser
2. Enter a sequent or proposition (e.g., `A & B |- C`)
3. The derivation tree will be displayed automatically

## Supported Symbols

- **Atoms**: Capital letters A-Z (except V)
- **True**: `1`, `tt`
- **False**: `0`, `⊥`
- **Not**: `¬`, `!`, `~`
- **And**: `&`, `∧`
- **Or**: `V`, `∨`
- **Implies**: `->`, `→`
- **Sequent**: `|-`, `⊢`

## Examples

Try these examples:

```
A & B |- C
A -> B, B -> C |- A -> C
|- A V ¬A
¬(A & ¬A)
A, B |- A & B
A & (B V C) |- (A & B) V (A & C)
```

## Project Structure

- `index.html` - Main HTML structure
- `style.css` - Styling and layout
- `proposizione.js` - Proposition classes (And, Or, Not, etc.)
- `parser.js` - Input parser
- `sequente.js` - Sequent data structure
- `regole.js` - Derivation rules
- `derivazione.js` - Derivation logic
- `renderer.js` - Canvas rendering for visualization
- `app.js` - Main application logic

Author: [WanFengyyds](https://github.com/WanFengyyds)
Inspired by:[SkiFire13](https://github.com/SkiFire13)
