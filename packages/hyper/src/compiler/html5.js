
export const JS = '_ $e document window location localStorage sessionStorage alert Array Boolean Date Error false in Infinity instanceof isFinite isNaN JSON Math NaN new null Number Object parseFloat parseInt String true typeof undefined history navigator screen scrollTo scrollBy innerWidth innerHeight outerWidth outerHeight console'.split(' ')

export const EVENTS = 'click submit change input focus blur keydown keyup keypress mouseover mouseout mousedown mouseup mousemove mouseenter mouseleave wheel scroll resize load unload beforeunload error abort touchstart touchend touchmove touchcancel drag dragstart dragend dragenter dragleave dragover drop animationstart animationend animationiteration transitionend contextmenu dblclick pointerdown pointermove cut copy paste'.split(' ')

export const BOOLEAN = 'disabled checked selected hidden readonly required autofocus autoplay async controls defer loop multiple muted nowrap open reversed scoped seamless sorted translate visibility pointer-events draggable contenteditable'.split(' ')


export const HTML5_TAGS = 'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd label legend li link main map mark meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr slot portal'.split(' ')


export const SVG_TAGS = 'animate animateMotion animateTransform circle clipPath defs desc ellipse\
 feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting\
 feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR\
 feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting\
 feSpotLight feTile feTurbulence filter foreignObject g hatch hatchPath image line linearGradient\
 marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg\
 switch symbol text textPath title tspan use view'.split(' ')

export const SELF_CLOSING = 'img br hr input meta link area base col embed keygen param source track wbr'.split(' ')



/*
export const ATTR = 'class id style lang dir title accesskey tabindex href src alt type value name for rel target action method placeholder pattern min max step width height poster media sizes srcset content role form download'.split(' ')

export const SVG_ATTR = 'x y cx cy r rx ry d points fill stroke stroke-width transform dx dy text-anchor viewBox preserveAspectRatio clip-path xmlns opacity font-size mask filter'.split(' ')

 ATTR.push(...SVG_ATTR)
*/

const RE = /(^|[\-\+\*\/\!\s\(\[]+)([\$a-z_]\w*)(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g

export function addContext(expr, imports=[]) {
  return expr.replace(RE, (match, prefix, varname) => {
    if (varname == '$event') varname = '$e'
    if (varname == 'this') varname = '_'
    return prefix + ([...imports, ...JS].includes(varname) ? varname : '_.' + varname)
  }).trim()
}



