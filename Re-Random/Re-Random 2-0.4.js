// ==UserScript==
// @name         Re:Random 2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Play a random map!
// @author       Hxttrick
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Build on refresh
    build(new URL(window.location).pathname)

    // Build on path change
    onPathChange(newPath => build(newPath))

    // Attach keybind
    window.addEventListener('keydown', e => {
        if (!(new URL(window.location).pathname).startsWith('/maps/')) return
        if (e.key.toLowerCase() !== 'r') return
        onRandomClick();
    });


    // - - - - - Helper functions - - - - - //
    function onPathChange(callback) {
        let currentPath = location.pathname;

        function handlePathChange() {
            const newPath = location.pathname;
            if (newPath !== currentPath) {
                currentPath = newPath
                callback(newPath)
            }
        }

        // Listen for browser navigation (back/forward)
        window.addEventListener('popstate', handlePathChange);

        // Monkey-patch pushState and replaceState
        ['pushState', 'replaceState'].forEach(fn => {
            const original = history[fn]
            history[fn] = function (...args) {
                const result = original.apply(this, args)
                handlePathChange() // detect path change after state change
                return result
            };
        });
    }

    function pollForElm(selector) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector)
                if (element) {
                    clearInterval(interval);
                    requestAnimationFrame(() => resolve(element))
                }
            }, 100)
            });
    }

    // Build the correct buttons depending on current path
    function build(path) {
        console.log(path)
        document.querySelectorAll('.re-random').forEach(el => el.remove())
        if (path == '/maps') {
            buildMapsMenu()
            return
        }
        if (path.startsWith('/maps/')) {
            buildMap()
            return
        }
    }

    // Classic maps menu
    async function buildMapsMenu() {
        const nav = await pollForElm('.tag-nav_categoryMenu__AUXWy')
        const btn = nav.querySelector('.tag-nav_menuItem__KbKxV').cloneNode(true)
        const divider = nav.previousElementSibling.cloneNode(true)

        divider.classList.add('re-random')

        btn.classList.value = 'tag-nav_menuItem__KbKxV re-random'
        btn.firstChild.textContent = 'Random'
        btn.firstChild.style.setProperty('color', 'hsla(0, 0%, 100%, .8)', 'important');
        btn.onclick = onRandomClick

        nav.appendChild(btn)
        btn.before(divider)
    }

    // Inside a community map
    async function buildMap() {
        let selector = '.community-map-page_topActions__X4C20'
        const nav = await pollForElm(selector)
        const wrapper = await pollForElm(selector += '> div')
        const btn = (await pollForElm(selector += '> div')).cloneNode(true)

        wrapper.style.display = 'flex'
        wrapper.style.gap = '1em'

        btn.classList.value = 're-random'
        btn.querySelector('img').src = 'https://raw.githubusercontent.com/hxttrick/Geoguessr-Scripts/52dadc5a9acaccc02fadc776d3c1b6818a27ab18/Re-Random/dice.svg'
        btn.addEventListener('click', onRandomClick)

        wrapper.appendChild(btn)
    }

    // Random button functionality
    async function onRandomClick(event) {
        const response = await fetch('/api/v3/social/maps/browse/random', { credentials: 'include' })
        const payload = await response.json()

        location.href = `/maps/${payload.id}`
    }

})();