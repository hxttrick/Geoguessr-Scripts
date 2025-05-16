// ==UserScript==
// @name         Re:Random 2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => build(event.target.URL));
    if ('navigation'in window) {
        navigation.addEventListener('navigate', event => {
            build(event.destination.url);
        });
    } else {
        // Fallback for Firefox/Safari using History API + popstate
        let currentPath = location.pathname;

        function handlePathChange() {
            const newPath = location.pathname;
            if (newPath !== currentPath) {
                currentPath = newPath;
                build(location.href);
            }
        }

        // Observe browser back/forward buttons
        window.addEventListener('popstate', handlePathChange);

        // Monkey-patch pushState and replaceState
        ['pushState', 'replaceState'].forEach(fn => {
            const original = history[fn];
            history[fn] = function (...args) {
                const result = original.apply(this, args);
                handlePathChange(); // trigger on in-app nav
                return result;
            };
        });
    }

    function build(url) {
        document.querySelectorAll('.re-random').forEach(el => el.remove())
        const path = url.split('geoguessr.com')[1].split('?')[0]
        if (path == '/maps') {
            buildMapsMenu()
            return
        }
        if (path.startsWith('/maps/')) {
            buildMap()
            return
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function buildMapsMenu() {
        const nav = await waitForElm('.tag-nav_categoryMenu__AUXWy')
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

    async function buildMap() {
        const nav = await waitForElm('.community-map-page_topActions__X4C20')
        const wrapper = nav.firstChild
        const btn = wrapper.firstChild.cloneNode(true)

        wrapper.style.display = 'flex'
        wrapper.style.gap = '1em'

        btn.classList.value = 're-random'
        btn.querySelector('img').src = 'https://raw.githubusercontent.com/hxttrick/Geoguessr-Scripts/52dadc5a9acaccc02fadc776d3c1b6818a27ab18/Re-Random/dice.svg'
        btn.addEventListener('click', onRandomClick)

        wrapper.appendChild(btn)
    }

    async function onRandomClick(event) {

        const response = await fetch('/api/v3/social/maps/browse/random', { credentials: 'include' })
        const payload = await response.json()

        location.href = `/maps/${payload.id}`
    }

})();