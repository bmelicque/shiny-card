# Shiny Card

## Description

A project to reproduce shader effects used in cards from [Pokémon TCG Pocket](https://tcgpocket.pokemon.com/en-us/), specifically ☆☆ rarity cards.

Those include:

- a two color static background with basic abstract shapes, created here with different layers of Perlin noise
- a iridescent-like effect on the background, created here using a modified [procedural wood texture](https://thebookofshaders.com/edit.php#11/wood.frag)
- some parallax with the main subject
- a shiny gold material for model contours, using shaders to replace the default boring black colours with a gold colour and light reflection
- shiny borders, not reproduced faithfully here; this project uses a combination of Perlin noises
- sparkling effects, using a .png drawns as a top layer.

You can hover/touch the card to make it move and see the different effects.

## Run locally

Clone the repo, then install dependencies running:

`yarn`

Then run the project with:

`yarn dev`
