const params = new URLSearchParams(window.location.search);

const bg = `assets/background/${params.get('bg')}.svg`;
const fg = `assets/icon/${params.get('fg')}.svg`;
const size      = params.get('size');
const fgclr     = params.get('fgclr');
const fgopacity = params.get('fgopacity');
const bgclr     = params.get('bgclr');
const bgclr2    = params.get('bgclr2');
const bgopacity = params.get('bgopacity');
const bgamount  = params.get('bgamount');

const logo = document.getElementById('logo');
const icon = logo.querySelector('.icon');
const pattern = logo.querySelector('.pattern');
const background = logo.querySelector('.background');

(async () => {

    const bgEncoded = await encodeSvg(bg, bgclr);
    const fgEncoded = await encodeSvg(fg, fgclr);

    background.style.backgroundColor = bgclr2;
    
    pattern.style.backgroundImage = `url("data:image/svg+xml,${bgEncoded}")`;
    pattern.style.backgroundSize = `calc(100%/${bgamount})`;
    pattern.style.opacity = bgopacity;
    
    icon.style.backgroundImage = `url("data:image/svg+xml,${fgEncoded}")`; 
    icon.style.scale = size;
    icon.style.opacity = fgopacity;

})();

async function encodeSvg(url, color) {
    const res = await fetch(url);
    const svgString = await res.text();

    return encodeURIComponent(svgString)
            .replace(/currentColor/g, color || 'currentColor')
            .replace(/#/g, '%23')
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
}