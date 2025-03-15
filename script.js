// ==UserScript==
// @name         Geoguessr Re:Random
// @namespace    http://tampermonkey.net/
// @version      2025-03-15
// @description  Bring back random maps!
// @author       Hxttrick
// @match        https://www.geoguessr.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getSvg() {
        const svgCode = `
            <?xml version="1.0" encoding="utf-8"?>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve">
            <style type="text/css">
                .st1{fill:none;stroke:#FFFFFF;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
            </style>
            <g id="Layer_1">
                <g>
                    <polygon class="st1" points="83,27.1 83,68.7 50.7,85.2 45.3,85.2 13,68.7 13,27.1 45,10.8 50.5,10.8"/>
                    <g>
                        <line class="st1" x1="23" y1="46.8" x2="23" y2="43.6"/>
                        <line class="st1" x1="31" y1="58.4" x2="31" y2="55.2"/>
                        <line class="st1" x1="38.9" y1="70.3" x2="38.9" y2="67.1"/>
                        <line class="st1" x1="61" y1="66.4" x2="61" y2="63.2"/>
                        <line class="st1" x1="71.1" y1="48.4" x2="71.1" y2="45.2"/>
                        <line class="st1" x1="49.6" y1="27" x2="46.4" y2="27"/>
                    </g>
                    <g>
                        <polyline class="st1" points="48,74.8 48,43.9 72.5,32.3"/>
                        <line class="st1" x1="48" y1="43.9" x2="23.6" y2="32.3"/>
                    </g>
                </g>
            </g>
            </svg>
        `;
        return encodeURIComponent(svgCode.trim());
    }

    function getMapId() {
        const nextDataEl = document.getElementById('__NEXT_DATA__');
        const nextData = JSON.parse(nextDataEl.textContent);
        return nextData?.props?.pageProps?.map?.id;
    }

    if (window.location.pathname.includes("/maps/random")) {
        window.location.href = `https://www.geoguessr.com/maps/${getMapId()}`
    }
    else {
        window.addEventListener("load", () => {
            const ogBtn = document.querySelector(".back-button_round__7idLQ");
            
            const newBtn = ogBtn.cloneNode(true);
            newBtn.addEventListener("click", () => {
                window.location.href = "https://www.geoguessr.com/maps/random";
            });
            newBtn.style.display = "flex";
            newBtn.style.alignItems = "stretch";
            newBtn.style.marginLeft = ".5rem";

            const inner = newBtn.firstElementChild;
            inner.textContent = "";
            inner.style.flex = "1";
            inner.style.aspectRatio = "1";
            inner.style.display = "grid";
            inner.style.justifyContent = "center";
            inner.style.padding = "0";

            const img = document.createElement("img");
            img.src = `data:image/svg+xml;charset=utf-8,${getSvg()}`;
            img.width = 24;
            img.height = 24;

            inner.appendChild(img);
            ogBtn.parentNode.appendChild(newBtn);
        });

    }
})();