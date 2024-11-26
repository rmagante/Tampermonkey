// ==UserScript==
// @name         Right-Click Search on Example with Multiple Options
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add a right-click menu with multiple search options for highlighted text on example.com
// @author       rmagante
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    const menuId = 'custom-search-menu';

    // Function to remove the custom menu
    const removeCustomMenu = () => {
        const existingMenu = document.getElementById(menuId);
        if (existingMenu) existingMenu.remove();
    };

    // Add custom menu when text is selected
    document.addEventListener('contextmenu', (event) => {
        const selectedText = window.getSelection().toString().trim();

        // Remove any existing menu
        removeCustomMenu();

        if (selectedText) {
            // Create a container for the custom menu
            const customMenu = document.createElement('div');
            customMenu.id = menuId;
            customMenu.style.position = 'fixed';
            customMenu.style.top = `${event.clientY}px`;
            customMenu.style.left = `${event.clientX}px`;
            customMenu.style.zIndex = 9999;
            customMenu.style.backgroundColor = '#FFF';
            customMenu.style.border = '1px solid #CCC';
            customMenu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            customMenu.style.padding = '5px';
            customMenu.style.fontFamily = 'Arial, sans-serif';
            customMenu.style.fontSize = '14px';

            // Add individual search options
            const addSearchOption = (label, urlTemplate) => {
                const option = document.createElement('div');
                option.textContent = label;
                option.style.padding = '5px 10px';
                option.style.cursor = 'pointer';
                option.style.transition = 'background-color 0.2s';
                option.style.borderBottom = '1px solid #EEE';
                option.addEventListener('mouseover', () => (option.style.backgroundColor = '#f0f0f0'));
                option.addEventListener('mouseout', () => (option.style.backgroundColor = '#FFF'));
                option.addEventListener('click', () => {
                    const query = encodeURIComponent(selectedText);
                    const searchUrl = urlTemplate.replace('{selected_text}', query);
                    GM_openInTab(searchUrl, { active: true });
                    removeCustomMenu(); // Clean up after use
                });
                customMenu.appendChild(option);
            };

            // Add search options
            addSearchOption(`Search "abc" for "${selectedText}"`, 'https://www.example.com/abc/{selected_text}');
            addSearchOption(`Search "def" for "${selectedText}"`, 'https://www.example.com/def/{selected_text}');

            // Append the custom menu to the body
            document.body.appendChild(customMenu);

            // Automatically remove the menu on clicking outside
            document.addEventListener(
                'click',
                (e) => {
                    if (!customMenu.contains(e.target)) removeCustomMenu();
                },
                { once: true }
            );

            // Prevent the native context menu from being obstructed
            event.preventDefault();
        }
    });
})();
