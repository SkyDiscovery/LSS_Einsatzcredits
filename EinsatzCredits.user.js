// ==UserScript==
// @name         EinsatzCredits
// @namespace    http://tampermonkey.net/
// @version      1.200
// @description  Dieses Script zeigt zu jedem Einsatz an, wie viele Credits man im Durchschnitt bekommt
// @author       itsDreyter
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // array with credits..
    var aCredits = [
        110, 170, 370, 340, 200, 1400, 600, 210, 220, 250, 600, 240, 310, 980, 1000, 1010, 1100, 340, 700, 650, 2500, 2400, 2700, 1200, 900, 1000, 3510, 700, 1400, 2470, 1900, 400, 1310, 1200, 3710, 3810, 3310, 110, 110, 110, 110, 10010, 3720, 10010,
        0, 0, 0, 0, 0, 0, 0, 3620, 310, 1410, 0, 870, 0, 0, 0, 14010, 100, 100, 120, 120, 150, 150, 150, 120, 120, 120, 120, 120, 2000, 700, 500, 10020, 800, 500, 130, 1800, 2000, 400, 400, 2500, 1800, 200, 3000, 3000, 500, 2500, 250, 370, 0, 3000,
        400, 4000, 2900, 2500, 300, 17000, 900, 1500, 2000, 2200, 2000, 2200, 1800, 1800, 0, 0, 0, 350, 850, 1500, 900, 0, 1600, 100, 550, 100, 2200, 2500, 600, 1100, 1600, 1700, 2000, 2200, 700, 800, 600, 2000, 5000, 5100, 4000, 4100, 8000, 8100,
        1500, 3500, 1600, 3600, 1500, 400, 400, 150, 4200, 200, 100, 100, 150, 1200, 750, 100, 100, 0, 0, 0, 370, 120, 150, 900, 1400, 1400, 0, 0, 1200, 1400, 600, 600, 600, 4000, 600, 700, 1020, 900, 2100, 4600, 2900, 0, 0, 0, 0, 0, 0, 0, 5630, 2230,
        100, 80, 150, 310, 1900, 2000, 1000, 1000, 1000, 2000, 2500, 750, 5500, 9000, 300, 610, 3500, 5100, 10200, 16010, 4000, 150, 0, 0, 0, 11200, 3000, 4000, 500, 500, 500, 500, 500, 17000, 14000, 4400, 4000, 7000, 5000, 5000, 2000, 4000, 1000,
        4000, 3500, 4500, 4000, 1500, 2000, 1700, 2000, 3000, 2500, 200, 2100, 1200, 1000, 1200, 1400, 1400, 2000, 3000, 1000, 1200, 1400, 1400, 2000, 3000, 10010, 2500, 2800, 370, 220, 1000, 2500, 900, 1500, 400, 400, 150, 4200, 200, 200, 6050,
        1600, 1600, 0, 7000, 2000, 350, 2500, 2800, 1500, 0, 1000, 4000, 100, 150, 1020, 300, 110, 400, 800, 7000, 300, 0, 12000, 1100, 2020, 0, 1500, 2500, 1500, 500, 6000, 700, 6500, 13000, 8000, 6000, 1000, 1000, 1000, 1100, 0, 900, 1900, 4400,
        5400, 1500, 200, 1000, 11500, 1800, 2500, 1500, 10000, 7000, 0, 3500, 1200, 700, 2000, 3000, 10000, 10000, 6000, 6000, 500, 370, 340, 0, 0, 0, 2500, 2500, 1010, 1200, 6500, 6000, 10000, 100, 17000, 4000, 7500, 4500, 0, 1700, 1700, 500, 4000,
        9000, 500, 500, 500, 500, 500, 500, 550, 2800, 7500, 1800, 1000, 300, 300, 0, 0, 300, 600, 0, 4400, 900, 900, 900, 900, 600, 1100, 5100, 5500, 6500, 2500, 8500, 1000, 0, 1900, 3000, 3000, 3000, 3000, 0, 3200, 2700, 5050, 1600, 400, 110, 110,
        980, 980, 3700, 400, 980, 110, 5900, 3000, 2500, 3000, 200, 0, 0, 400, 4500, 0, 800, 400, 1300, 8600, 0, 0, 0, 1500, 3100, 7000, 0, 1700, 6000, 5800, 6000, 400, 400, 2000, 8000, 0, 1600, 1000, 2200, 1000, 400, 2000, 3000, 100, 2100, 2200, 2000
        ];

    // initial call of adding info
    initial_setup();

    // extend missionMarkerAdd -----------------------------------------------------------------------
    var original_func = missionMarkerAdd;

    // this function is always called, when a new mission is added
    missionMarkerAdd = function(e) {
        original_func.apply(this, arguments);

        update(e);
    }

    // this function shows the credits information at initial loading of the page
    function update(e)
    {
        var Missions = $('.missionSideBarEntry');
        var added = false;

        // check all missions
        for (var i = 0; i < Missions.length; i++)
        {
            var childs = Missions[i].firstElementChild.firstElementChild.children;

            for (var i_c = 0; i_c < childs.length; i_c++)
            {
                if (childs[i_c].className != 'missionCredits') continue;

                var id = 'missionCredits_' + Missions[i].getAttribute('mission_id');

                if (e.id != Missions[i].getAttribute('mission_id')) continue;

                if (e.mtid == undefined) continue;

                var child = childs[i_c];
                Missions[i].firstElementChild.firstElementChild.removeChild(child);

                child.innerHTML = 'Durchschnittl. ' + get_credits_for_type(e.mtid) + ' Credits';
                Missions[i].firstElementChild.firstElementChild.appendChild(child);
                added = true;
            }

            if (added == false)
            {
                for (var i2 = 0; i2 < Missions[i].firstElementChild.firstElementChild.children.length; i2++)
                {
                    if ( Missions[i].firstElementChild.firstElementChild.children[i2].className != 'missionCredits') continue;
                    if ( Missions[i].firstElementChild.firstElementCHild.children[i2].className == 'missionCredits') added = true;

                    //Missions[i].firstElementChild.firstElementChild.removeChild(Missions[i].firstElementChild.firstElementChild.children[i2]);
                }

                if (added == false)
                {
                    var div_elem = document.createElement('div');
                    var html_str = '';

                    if (get_credits_for_type(Missions[i].getAttribute('mission_type_id')) == 0) html_str = 'RD-Vergütung';
                    else html_str = 'Durchschnittl. ' + get_credits_for_type(Missions[i].getAttribute('mission_type_id')) + ' Credits';

                    div_elem.innerHTML = html_str;
                    div_elem.setAttribute("class", "missionCredits");
                    div_elem.setAttribute("id", "missionCredits_" + Missions[i].getAttribute('mission_id'));
                    Missions[i].firstElementChild.firstElementChild.appendChild(div_elem);
                }

            }

        }
    }

    function initial_setup()
    {
        // clear all
        $('.missionCredits').remove();

        // get complete mission list
        var Missions = $('.missionSideBarEntry');

        // add info to every mission
        for (var i = 0; i < Missions.length; i++)
        {
            // init credits
            var credits = 0;

            // init html string
            var html_str = '';

            // get credits for mission type
            credits = get_credits_for_type(Missions[i].getAttribute('mission_type_id'));

            // create div element
            if (credits == 0) html_str = 'RD-Vergütung';
            else html_str = 'Durchschnittl. ' + credits + ' Credits';

            var div_elem = document.createElement('div');
            div_elem.innerHTML = html_str;
            div_elem.setAttribute("class", "missionCredits");
            div_elem.setAttribute("id", "missionCredits_" + Missions[i].getAttribute('mission_id'));

            // add div element
            Missions[i].firstElementChild.firstElementChild.appendChild(div_elem);
        }
    }

    // returns the credits for a specific mission type
    function get_credits_for_type(type)
    {
        return aCredits[type];
    }

})();
