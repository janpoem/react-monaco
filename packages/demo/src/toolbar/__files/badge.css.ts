export default {
  // @ts-ignore
  filename: 'badge.scss',
  source: `
$badge-background: #111;
$badge-color: #fff;
$badge-min-size: 11px;
$badge-max-size: 25px;

body {
\tfont-family: 'Allerta Stencil', sans-serif;
\tpadding: 0;
\tmargin: 70px 10px;
\tbackground: #efefef;
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tmin-height: calc(99vh - 140px);
}

.badge {
  position: relative;
\tletter-spacing: 0.08em;
  color: $badge-color;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;
  transform: rotate(-14deg);
  text-align: center;
  filter: drop-shadow(0.25em 0.7em 0.95em rgba(0,0,0, 0.8));
\t/* min-size + (max-size - min-size) * ( (100vw - min-width) / ( max-width - min-width) ) */
\tfont-size: calc(#{$badge-min-size} + #{($badge-max-size - $badge-min-size) / 1px} * ( (100vw - 420px) / ( 860) ));
\t
\t@media screen and (max-width: 420px) {
\t\t\tfont-size: $badge-min-size;
\t}
\t
\t@media screen and (min-width: 1280px) {
\t\t\tfont-size: $badge-max-size;
\t}
\t
\t
\t&::before {
    content: "";
    position: absolute;
\t\ttop: 50%;
    left: 50%;
\t\ttransform: translate(-50%, -50%);
    display: block;
    width: 10em;
\t\theight: 10em;
    border-radius: 100%;
    background: $badge-background;
    opacity: 0.8;
    transition: opacity 0.3s linear;
  }

  &:hover {
    color: $badge-color;
    text-decoration: none;
    transform: rotate(-10deg) scale(1.05);

    &::before {
      opacity: 0.9;
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    z-index: 0;
    width: 10em;
    height: 10em;
  }

  span {
    display: block;
    background: $badge-background;
    border-radius: 0.4em;
    padding: 0.4em 1em;
    z-index: 1;
    min-width: 11em;
    border: 1px solid;
    text-transform: uppercase;
  }
}
`.trim(),
};
