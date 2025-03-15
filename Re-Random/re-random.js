// ==UserScript==
// @name         Geoguessr Re:Random
// @namespace    http://tampermonkey.net/
// @version      2025-03-16
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

        fetch("https://raw.githubusercontent.com/hxttrick/Geoguessr-Scripts/refs/heads/2025-03-16/Re-Random/styles.css")
        .then(response => response.text())
        .then(cssText => {
            const styleEl = document.createElement('style');
            styleEl.innerText = cssText;
            document.head.appendChild(styleEl);
        })

        window.addEventListener("load", () => {
            const ogBtn = document.querySelector(".back-button_round__7idLQ");
            
            const newBtn = ogBtn.cloneNode(true);
            newBtn.addEventListener("click", () => window.location.href = "https://www.geoguessr.com/maps/random");
            newBtn.classList.add("rr-btn");

            const inner = newBtn.firstElementChild;
            inner.textContent = "";
            inner.classList.add("rr-btn-inner");

            const img = document.createElement("img");
            img.src = "https://raw.githubusercontent.com/hxttrick/Geoguessr-Scripts/refs/heads/2025-03-16/Re-Random/dice.svg";
            img.width = 24;
            img.height = 24;

            inner.appendChild(img);
            ogBtn.parentNode.appendChild(newBtn);
        });

    }
})();