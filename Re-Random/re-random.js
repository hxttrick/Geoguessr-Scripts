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
            img.src = "https://raw.githubusercontent.com/hxttrick/Geoguessr-Scripts/98f1feaa999c67871d6dca4d9b2fe17b6c3367fd/Re-Random/dice.svg";
            img.width = 24;
            img.height = 24;

            inner.appendChild(img);
            ogBtn.parentNode.appendChild(newBtn);
        });

    }
})();