// ==UserScript==
// @name         Club Icon Extractor
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  Extract club icon data!
// @author       Hxttrick
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const LOCALHOST_PORT = 5500; // Change this to whatever you host the site on

    await tryBuild();

    onUrlChange(async () => await tryBuild());

    async function tryBuild() {
        if (location.pathname.startsWith('/clubs/')) await run();
    }

    async function run() {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const root = await pollForElement('.club-preview_avatarAndInfo__lvJX6 .logo-icon_root__wtQj7');

        await sleep(50);

        root.nextElementSibling.addEventListener('click', openWebsite);
        root.nextElementSibling.style.cursor = 'pointer';


        const [fg, bg] = [...root.querySelectorAll('svg')].map(el => el.id);
        
        const size      = getComputedStyle(root).getPropertyValue('--logo-size');
        const fgclr     = getComputedStyle(root).getPropertyValue('--logo-color');
        const fgopacity = getComputedStyle(root).getPropertyValue('--logo-opacity');
        const bgclr     = getComputedStyle(root).getPropertyValue('--background-icon-color');
        const bgclr2    = getComputedStyle(root).getPropertyValue('--background-color');
        const bgopacity = getComputedStyle(root).getPropertyValue('--background-icon-opacity');
        const bgamount  = getComputedStyle(root).getPropertyValue('--background-icon-row-amount');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function sleep(ms) {
            return new Promise(res => setTimeout(res, ms));
        }

        async function pollForElement(selector, interval) {
            let element;

            while (!(element = document.querySelector(selector)))
                await sleep(interval);

            return element;
        }

        function buildEncodedUrl(base, params) {
            const query = Object.entries(params)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            return `${base}?${query}`;
        }


        function openWebsite() {
            const url = buildEncodedUrl(`http://localhost:${LOCALHOST_PORT}`, {
                bg: bg,
                fg: fg,
                size: size,
                fgclr: fgclr,
                fgopacity: fgopacity,
                bgclr: bgclr,
                bgclr2: bgclr2,
                bgopacity: bgopacity,
                bgamount: bgamount
            });

            window.open(url, '_blank');
        }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }

    function onUrlChange(callback) {
        window.addEventListener('popstate', callback);

        ['pushState', 'replaceState'].forEach((method) => {
            const original = history[method];
            history[method] = function (...args) {
                const result = original.apply(this, args);
                callback();
                return result;
            };
        });
    }

})();