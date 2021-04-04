// ==UserScript==
// @name		eRepublik Stuff++
// @author		Zordacz, edited and partly deobfuscated by Master_rg
// @version		6.12
// @include		https://www.erepublik.com/*
// @exclude     https://www.erepublik.com/en/military/battlefield/*
// @run-at		document-start
// @grant		none
// ==/UserScript==
!function () {
    if (location.href.includes("A/u/t/o/F/i/g/h/t/e/r")) addEventListener("DOMContentLoaded", function () {
        var e = localStorage.waMLog;
        document.head.insertAdjacentHTML("beforeEnd", "<style>#autoFighter{border:0;position:absolute;width:100vw;height:100vh;z-index:999}#status{position:absolute;width:100vw;height:100vh;z-index:9999;transition:background 1s;background:#000}#status div{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;background:" + (!e || e.includes("FUL") ? "#83B70B" : "red") + ";color:#fff;padding:5px;font:700 14px Arial;border-radius:1px;text-shadow:0 0 2px #000;box-shadow:0 0 3px inset #000}</style>"), document.body.innerHTML = '<iframe id="autoFighter" src="/en/military/campaigns" sandbox="allow-same-origin allow-scripts allow-forms"></iframe><div id="status"><div>' + (e || "AUTOFIGHTER ON<br>click anywhere to abort") + "</div></div>", document.title = "AUTOFIGHTER ON", 0 === navigator.maxTouchPoints && setTimeout(() => document.getElementById("status").style.background = "rgba(0,0,0,.6)", 1e3), setInterval(function () {
            window.lastCheck && lastCheck + 9e5 < Date.now() && (document.getElementById("autoFighter").src = "/en/military/campaigns")
        }, 6e4), addEventListener("click", () => location.href = "/")
    });
    else if (top == self || parent.location.href.includes("A/u/t/o/F/i/g/h/t/e/r")) {
        var e = [],
            t = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener("load", function () {
                var t = "{" == this.responseText.trim()[0] ? JSON.parse(this.responseText) : this.responseText;
                for (let n of e) n(t, this.responseURL)
            }), t.apply(this, arguments)
        }, addEventListener("DOMContentLoaded", function () {
            function buildPostFormBody(e, t) {
                for (let n in e)
                    if (e.hasOwnProperty(n) && !1 === t(n, e[n])) break
            }

            function getElementsBySelectorAndApplyCallbackOnThem(selector, callback) {
                var foundElements = document.querySelectorAll(selector);
                return callback && foundElements.forEach((e, n) => callback(e, n)), foundElements
            }

            function insertCSSStyles(e) {
                document.head.insertAdjacentHTML("beforeEnd", "<style>" + e + "</style>")
            }

            function reformatNumberStringToDelimitedNumber(e) {
                return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            function shortenMillionOrBillion(e, t) {
                return e > 999999999 ? (e / 1e9).toFixed(t + 1) + "B" : e > 999999 ? (e / 1e6).toFixed(t) + "M" : reformatNumberStringToDelimitedNumber(+e.toFixed(t))
            }

            /**
             *
             * @param url
             * @param callback Callback
             */
            function fetchUrlAndReturnContentRawOrAsJson(url, callback) {
                fetch(url, {
                    credentials: "same-origin"
                }).then(e => e.text()).then(e => callback && callback("{" == e.trim()[0] ? JSON.parse(e) : e))
            }

            function fetchFormPostCallsAndReturnContentRawOrAsJson(url, body, callback) {
                var o = "";
                buildPostFormBody(body, (e, t) => o += "&" + encodeURIComponent(e) + "=" + encodeURIComponent(t)),
                    fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        credentials: "same-origin",
                        body: o.substring(1)
                    }).then(e => e.text()).then(e => callback && callback("{" == e.trim()[0] ? JSON.parse(e) : e))
            }

            function s(e, t, n) {
                function i() {
                    fe.style = "";
                    var t = e.getBoundingClientRect(),
                        n = e.gravity || "ns";
                    n = "ns" == n ? t.top - fe.offsetHeight - 5 < 0 ? "s" : "n" : n, fe.style["w" == n ? "right" : "left"] = ("ns".includes(n) ? t.left + t.width / 2 - fe.offsetWidth / 2 : "w" == n ? innerWidth - t.left - 5 : t.right + 5).toFixed() + "px", fe.style["n" == n ? "bottom" : "top"] = ("ew".includes(n) ? t.top + t.height / 2 - fe.offsetHeight / 2 : "n" == n ? innerHeight - t.top + 5 : t.bottom + 5).toFixed() + "px", e.matches(":hover") && (fe.style.visibility = "visible")
                }

                e.gravity = t, e.addEventListener("mouseenter", function (t) {
                    var o = e.title || e.orgtitle;
                    fe.innerHTML = "", fe.innerHTML = n ? n(i) : o, e.orgtitle = o, e.title = "", i()
                }), e.addEventListener("mouseleave", () => fe.style = "")
            }

            function assumption_initializeScript() {
                fetchUrlAndReturnContentRawOrAsJson("//download.erepublik.tools/erepstuff/version.json", function (response) {
                    Object.assign(localStorageSettings, response);
                    updateLicenceString();
                    compareScriptVersionWithExternalVersionAndShowUpdateNotification();
                    saveSettingsAsStringInLocalStorage();
                })
            }

            function saveSettingsAsStringInLocalStorage() {
                localStorage.stuff = JSON.stringify(localStorageSettings)
            }

            function assumption_initializeDailyBattleStats() {
                assumption_dailyBattleStats = [0, 0, 0, 0];
                localStorage.statsToday = JSON.stringify(assumption_dailyBattleStats);
                getElementsBySelectorAndApplyCallbackOnThem("#NoKills", e => e.remove());
            }

            function updateMarketPictureCachePerCountryIdAndCallHandler(country_id, handler) {
                cacheMarketPicturePerCountryId[country_id] ? setTimeout(handler) : fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/marketpicture/" + country_id, function (response) {
                    cacheMarketPicturePerCountryId[country_id] = response;
                    handler();
                })
            }

            /**
             *
             * @param industryId {number}
             * @returns {string}
             */
            function getIndustryNameFromIndustryId(industryId) {
                return 1 == industryId ? "food" : 2 == industryId ? "weapons" : 3 == industryId ? "tickets" : 4 == industryId ? "houses" : 7 == industryId ? "frm" : 12 == industryId ? "wrm" : 17 == industryId ? "hrm" : 23 == industryId ? "aircraft" : "arm"
            }

            function g(t, n) {
                e.push(function (e, i) {
                    i.includes(t) && setTimeout(n)
                })
            }

            function getSettingValue(e) {
                return e in localStorageSettings ? localStorageSettings[e] : DEFAULT_SETTINGS[e]
            }

            function h(e) {
                document.body.insertAdjacentHTML("afterBegin", '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);z-index:9999" onclick="this.remove()"><div style="background:red;color:#fff;text-align:center;width:100%;font:bold 15px Arial;padding:5px">' + e + "<br><button>Close</button></div></div>"), setTimeout(() => location.reload(), 6e4)
            }

            function b(e, t, n, i) {
                var o = Date.now() + 1e3 * t;
                !function t() {
                    var a = (o - Date.now()) / 1e3;
                    if (a < 1) n(e);
                    else {
                        var r = Math.floor(a / 3600),
                            l = Math.floor(a % 3600 / 60),
                            s = Math.floor(a % 60);
                        e.textContent = (i ? r ? r + ":" : "" : "-") + (i ? l > 9 ? l : "0" + l : l) + (i ? "" : "m") + ":" + (s > 9 ? s : "0" + s) + (i ? "" : "s"), setTimeout(t, 1e3)
                    }
                }()
            }

            function recalculateXpLeftToLevelUpAndUpdateFrontentDisplay() {
                getElementsBySelectorAndApplyCallbackOnThem("#xpleft span", function (element) {
                    var t = 5e3 - LOCAL_CIITIZEN_DATA.currentExperiencePoints % 5e3;
                    element.textContent = t;
                    element.style.background = t > 500 ? "#6ebce5" : "#FB7E3D"
                })
            }

            function y(e, t, n, i, o) {
                var body = {
                    _token: csrfToken,
                    battleId: n || 0
                };
                e && (body.toCountryId = e), t && (body.inRegionId = t), i && (body.sideCountryId = i), fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/travel/", body, function () {
                    o ? o() : location.reload()
                })
            }

            function x(e, t) {
                return e < 10 && !t ? "0" + e : e
            }

            function k(e, t) {
                var n = Math.max(360 * Math.ceil(((e ? Math.max(reset_health_to_recover - globalNS.userInfo.wellness, 0) : 0) + reset_health_to_recover - food_remaining) / globalNS.userInfo.energyPerInterval) - 360 + 60 * parseInt(elementFoodResetHours.textContent), 0);
                return x(parseInt(n / 3600), t) + (t ? "h " : ":") + x(parseInt(n % 3600 / 60), t) + (t ? "m" : "")
            }

            function _(e) {
                return "<span class='stuffTipsySpan'>" + e + "</span><br>"
            }

            function E() {
                return Math.min(reset_health_to_recover - globalNS.userInfo.wellness, food_remaining) >= smallestFood.use
            }

            function assumption_getAmountOfAvailableEnergyFromFoodInInventory(e) {
                var n = 0;
                return buildPostFormBody(e.inventoryItems.finalProducts.items, (e, t) => n += 1 == t.industryId && t.quality < 8 ? t.amount * t.attributes.energyRestore.value : 0), n
            }

            function T() {
                getElementsBySelectorAndApplyCallbackOnThem(".costperUse,#otherMarket,.travelToMarket", e => e.remove());
                var e = angular.element("#marketplace").scope(),
                    t = [e.settings.isSharedOffer ? e.marketplace[0].country_id : e.settings.countryId, e.settings.industryId, e.settings.isSharedOffer ? e.marketplace[0].customization_level : e.settings.lastQuality],
                    o = t[0] == LOCAL_CIITIZEN_DATA.country ? LOCAL_CIITIZEN_DATA.countryLocationId : LOCAL_CIITIZEN_DATA.country,
                    a = document.getElementById("erepDE"),
                    r = document.querySelector("#marketplace h1");
                a ? a.href = "//erepublik.tools/en/marketplace/items/0/" + t[1] + "/" + t[2] + "/offers" : (insertCSSStyles("#otherMarket,#otherMarket span{padding:0 4px;border-radius:2px;float:right}#otherMarket{background:#83b70b;color:#fff;cursor:pointer;text-shadow:0 0 2px #000}#otherMarket:hover{background:#fb7e3d}#otherMarket span{background:#fb7e3d;margin:0 -4px 0 4px}#erepDE{color:#83b70b;float:right;margin:0 70px 0 10px}#erepDE:hover{color:#fb7e3d}#erepDE span{color:#42a5f5}.costperUse{font-size:11px}.travelToMarket{position:absolute;top:1px;right:10px}"), r && r.insertAdjacentHTML("beforeEnd", '<a id="erepDE" href="//erepublik.tools/en/marketplace/items/0/' + t[1] + "/" + t[2] + '/offers">eRepublik<span>.tools</span></a>')), e.settings.isSharedOffer ? getElementsBySelectorAndApplyCallbackOnThem(".list_products", e => e.insertAdjacentHTML("afterEnd", '<a href="/' + PLATFORM_LANGUAGE_CODE + "/economy/marketplace#" + t[0] + "/" + t[1] + "/" + t[2] + '" class="std_global_btn smallSize blueColor" style="top:15px;left:420px">Show all offers</a>')) : LOCAL_CIITIZEN_DATA.countryLocationId == LOCAL_CIITIZEN_DATA.country && t[0] == LOCAL_CIITIZEN_DATA.country || updateMarketPictureCachePerCountryIdAndCallHandler(o, function () {
                    var e = (((cacheMarketPicturePerCountryId[o][getIndustryNameFromIndustryId(t[1])] || {})["q" + t[2]] || [])[0] || {}).gross;
                    r && r.insertAdjacentHTML("beforeEnd", '<a id="otherMarket">' + EREPUBLIK_VARIABLE.info.countries[o].name + "<span>" + (e ? e.toFixed(2) + LOCAL_CIITIZEN_DATA.currency : "No offers") + "</span></a>"), document.getElementById("otherMarket").addEventListener("click", () => getElementsBySelectorAndApplyCallbackOnThem("#countryId", function (e) {
                        e.value = o, e.dispatchEvent(new Event("change"))
                    }))
                }), e.settings.can_buy || e.settings.my_offer || A("#filters_expanded", t[0]), t[1] < 2 && getElementsBySelectorAndApplyCallbackOnThem("#marketplace .price_sorted tr", function (e) {
                    var n = e.getElementsByClassName("m_price")[0];
                    n.insertAdjacentHTML("beforeEnd", '<span class="stprice costperUse"><br>' + (parseFloat(n.textContent) / industryJSON[t[1]].attributes[t[2]].effect).toFixed(4) + " cc/hp</span>")
                })
            }

            function A(e, countryId) {
                fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/travelData", {
                    check: "getCountryRegions",
                    countryId: countryId,
                    _token: csrfToken
                }, function (response) {
                    var a = [0, 99999];
                    buildPostFormBody(response.regions, function (e, t) {
                        t.canMove && t.countryId == countryId && t.cost < a[1] && (a = [e, t.cost])
                    }),
                    a[0] && (getElementsBySelectorAndApplyCallbackOnThem(e, e => e.insertAdjacentHTML("beforeEnd", '<a class="std_global_btn smallSize blueColor travelToMarket">Travel to market (' + a[1] + "cc)</a>")),
                        getElementsBySelectorAndApplyCallbackOnThem(".travelToMarket", e => e.addEventListener("click", () => y(countryId, a[0]))))
                })
            }

            function S(e, t) {
                insertCSSStyles("#erepDE{color:#83b70b;float:right;margin:0 20px}#erepDE:hover{color:#fb7e3d}#erepDE span{color:#42a5f5}");
                getElementsBySelectorAndApplyCallbackOnThem(e + " h1", e => e.insertAdjacentHTML("beforeEnd", '<a id="erepDE" href="//erepublik.tools/en/marketplace/' + t + '">eRepublik<span>.tools</span></a>'));
            }

            function I() {
                var e = [7, 12, 17, 24].includes(+angular.element("#marketplace").scope().settings.industryId);
                getElementsBySelectorAndApplyCallbackOnThem(".buyField", function (t) {
                    t.value = Math.min(parseInt(LOCAL_CIITIZEN_DATA.currencyAmount / t.dataset.price), t.nextElementSibling.nextElementSibling.getAttribute("maximum"), Math.max(Math.floor((window.freeSpace || 99999999) / (e ? 100 : 1)) - (e ? 1 : 0), 0)), t.dispatchEvent(new Event("input"))
                })
            }

            function updateLicenceString() {
                getElementsBySelectorAndApplyCallbackOnThem(".stuffBtn+.stuffBtn span,#AF_l", (element, method) => element.textContent = method ? "License: FREE" : "FREE".split(" ")[0])
            }

            function compareScriptVersionWithExternalVersionAndShowUpdateNotification() {
                localStorageSettings.version && localStorageSettings.version != GM_info.script.version && getElementsBySelectorAndApplyCallbackOnThem(".stuffBtn,#stuffOptions>:nth-child(1) a:nth-child(3)", function (e, t) {
                    e.style.background = "#F95555", t || (e.childNodes[0].nodeValue = "CLICK TO UPDATE")
                })
            }

            function travelToBattlefieldByBattleIdAndZoneId(battleId, battleZoneId, countryId, i) {
                var body = {
                    _token: csrfToken,
                    battleId: battleId,
                    battleZoneId: battleZoneId
                };
                countryId && (body.sideCountryId = countryId), fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/battlefieldTravel", body, () => i ? 0 : location.href = "/" + PLATFORM_LANGUAGE_CODE + "/military/battlefield/" + battleId)
            }

            function R(e, t) {
                var damage = t ? +e.damage.replace(/,/g, "") : e.bomb ? e.bomb.damage : e.oldEnemy.isNatural ? Math.floor(1.1 * e.user.givenDamage) : e.user.givenDamage,
                    prestigePoints = t ? +e.rewards.prestigePoints.replace(/,/g, "") : e.hits || 1,
                    kills = t ? +e.kills.replace(/,/g, "") : 1;
                assumption_dailyBattleStats[0] += kills;
                assumption_dailyBattleStats[1] += prestigePoints;
                assumption_dailyBattleStats[SERVER_DATA.onAirforceBattlefield ? 3 : 2] += damage;
                localStorage.statsToday = JSON.stringify(assumption_dailyBattleStats);
                personal_stats.forEach(function (e, t) {
                    savedStats[t] = +savedStats[t] + (t ? t < 2 ? prestigePoints : damage : kills);
                    e.textContent = reformatNumberStringToDelimitedNumber(savedStats[t]);
                });
                document.cookie = SERVER_DATA.battleZoneId + "-" + SERVER_DATA.leftBattleId + "=" + savedStats.join("|") + ";max-age=7200;Secure;SameSite=Strict";
                recalculateXpLeftToLevelUpAndUpdateFrontentDisplay();
                window.mercenaryEl && (mercenaryEl.textContent = Math.min(+mercenaryEl.textContent + kills, 25));
                window.freedomFighterEl && (freedomFighterEl.textContent = Math.min(+freedomFighterEl.textContent + kills, 75))
            }

            function B() {
                fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/citizen-profile-json/" + LOCAL_CITIZEN_ID, function (e) {
                    insertCSSStyles("#mercFFcontainer{position:absolute;top:1px;z-index:5;text-align:center;text-shadow:0 0 2px #000}#mercFFcontainer div{color:#fff;padding:3px;font:700 11px Arial;width:40px;display:inline-block}#mercenary{background:#fb7e3d}#freedom_fighter{background:#83b70b}#mercFFdiv{position:absolute;top:1px;right:150px}#mercFFdiv span{cursor:default;padding:3px;color:#fff;font:700 11px Arial;text-shadow:0 0 2px #000;margin:1px 2px;border-radius:5px;float:left;clear:both;width:70px;text-align:center}.mercenaryFF{text-align:center;position:absolute;top:0;width:100%}.mercenaryFF span{cursor:default;color:#fff;padding:3px;font:700 11px Arial;text-shadow:0 0 2px #000;width:14px;border-radius:5px;margin:5px}");
                    var o = e.freedomFighter,
                        a = o.milestone.kills,
                        r = e.achievements[11].mercenaryProgress;
                    if (ACTIVE_BATTLE_ID) {
                        var l = 0,
                            c = document.getElementById("region_name_link").title.split("Region name - ")[1];
                        buildPostFormBody(o.progress.wars.inprogress, function (e, t) {
                            t.region == c && (l = Math.min(t.kills, 75))
                        });
                        var d = SERVER_DATA.isResistance && (SERVER_DATA.leftBattleId == SERVER_DATA.realInvaderId || SERVER_DATA.spectatorOnly);
                        getElementsBySelectorAndApplyCallbackOnThem("#pvp", e => e.insertAdjacentHTML("beforeEnd", '<div id="mercFFcontainer"><div id="mercenary" title="Mercenary kills"><q>' + r.details[SERVER_DATA.leftBattleId].enemies_killed + "</q> - " + r.details[SERVER_DATA.rightBattleId].enemies_killed + "</div>" + (d ? '<div id="freedom_fighter" title="Freedom Fighter kills"><q>' + l + "</q> / <q>" + a + "</q></div>" : "") + "</div>")), d && getElementsBySelectorAndApplyCallbackOnThem("#kills", e => e.value = a - l > 0 ? a - l : 25), mercenaryEl = document.querySelector("#mercenary q"), freedomFighterEl = document.querySelector("#freedom_fighter q:first-child")
                    } else setInterval(() => getElementsBySelectorAndApplyCallbackOnThem(".war_card:not(.mercAdded)", function (e) {
                        e.classList.add("mercAdded");
                        var n = angular.element(e).scope().campaign,
                            i = r.details[n.inv.id].enemies_killed,
                            l = r.details[n.def.id].enemies_killed,
                            c = 0;
                        n.is_rw && buildPostFormBody(o.progress.wars.inprogress, function (e, t) {
                            t.war_id == n.war_id && (c = Math.min(t.kills, 75))
                        }), n.is_dict || n.is_lib || e.querySelector(".war_flags").insertAdjacentHTML("beforeEnd", '<div class="mercenaryFF"><span title="Mercenary kills" style="float:left;background:' + (i ? i < 25 ? "#fb7e3d" : "#83b70b" : "red") + '">' + i + "</span>" + (n.is_rw ? '<span title="Freedom Fighter kills" style="position:relative;top:5px;background:' + (c ? c < a ? "#fb7e3d" : "#83b70b" : "red") + '">' + c + " / " + a + "</span>" : "") + '<span title="Mercenary kills" style="float:right;background:' + (l ? l < 25 ? "#fb7e3d" : "#83b70b" : "red") + '">' + l + "</span></div>"), e.querySelectorAll(".mercenaryFF span").forEach(e => s(e))
                    }), 200), getElementsBySelectorAndApplyCallbackOnThem(".filters_wrapper", function (e) {
                        var t = [o.progress.regions, o.milestone.regions];
                        e.insertAdjacentHTML("beforeEnd", '<div id="mercFFdiv"><span style="background:#fb7e3d" title="' + 25 * (50 - r.progress.current) + ' kills needed">Merc ' + r.progress.current + '/50</span><span style="background:#83b70b" title="' + (t[1] - t[0]) * a + ' kills needed">FF ' + t[0] + "/" + t[1] + " (x" + a + ")</span></div>")
                    });
                    getElementsBySelectorAndApplyCallbackOnThem("#mercFFdiv span,#mercenary,#freedom_fighter", e => s(e))
                })
            }

            function D() {
                function assumption_deleteDeadFriendsFromFriendsListHandler(friendListPage) {
                    fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/citizen-friends/" + LOCAL_CITIZEN_ID + "/" + friendListPage + "/list", function (n) {
                        (new DOMParser).parseFromString(n.content, "text/html").querySelectorAll(".dead").forEach(function (e) {
                            var t = e.id.split("_")[1];
                            assumption_deadFriendsList.includes(t) || assumption_deadFriendsList.push(t)
                        });
                        removeDeadFriendsElement[0].textContent = "Scanning... " + (friendListPage / maxPageFriendsList * 100).toFixed(1) + "%";
                        friendListPage < maxPageFriendsList ? assumption_deleteDeadFriendsFromFriendsListHandler(friendListPage + 1) : function assumption_removeDeadFriend() {
                            assumption_deadFriendsList.length ? (removeDeadFriendsElement[0].textContent = "Removing... " + assumption_deadFriendsList.length + " left",
                                fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/citizen-friends/" + assumption_deadFriendsList.pop() + "/1/remove?_token=" + csrfToken, {}, function () {
                                    friendsElement.textContent = friendsElement.textContent.replace(/\d+/, +friendsElement.textContent.match(/\d+/)[0] - 1);
                                    assumption_removeDeadFriend();
                                })) : (removeDeadFriendsElement[0].textContent = "Done!", removeDeadFriendsElement[0].style.background = "#83B70B")
                        }()
                    })
                }

                insertCSSStyles("#achievment>li{margin:3px 5px}#contributor,#removeDead{background:#83b70b;font:700 11px Arial;text-align:center;border-radius:1px;text-shadow:0 0 2px #000}#contributor{position:absolute;width:152px;padding:3px;color:#fff;cursor:default;z-index:999}#removeDead{width:100%;display:inline-block;cursor:pointer;color:#fff;padding:3px 0}#removeDead:hover{background:#fb7e3d}#erepboxStats{float:right;margin:-4px 10px;width:24px}#erepboxStats:hover{transform:scale(1.2,1.2)}#erepDE{font:800 12px Arial;color:#83b70b;position:absolute;right:50px}#erepDE:hover{color:#fb7e3d}#erepDE span{color:#42a5f5}"), getElementsBySelectorAndApplyCallbackOnThem(".citizen_avatar", e => e.outerHTML = '<a href="//erpk-static-avatars.s3.amazonaws.com/' + e.getAttribute("style").split("smart/")[1].split(")")[0] + '">' + e.outerHTML + "</a>");
                var t = +location.href.split("/")[6],
                    o = 0;
                if (getElementsBySelectorAndApplyCallbackOnThem(".counter", e => o += +e.textContent), getElementsBySelectorAndApplyCallbackOnThem("#career_tab_content", e => e.previousElementSibling.insertAdjacentHTML("beforeEnd", " (" + o + ')<a href="//erepbox.ru/content/profile/profile.php?id=' + t + '"><img id="erepboxStats" src="//erepbox.ru/images/logo.png" title="Click for more stats"></a><a id="erepDE" href="//erepublik.tools/en/society/citizen/' + t + '" title="Click for more stats">eRepublik<span>.tools</span></a>')), getElementsBySelectorAndApplyCallbackOnThem(".rank_name_holder a", function (e) {
                    var t = e.textContent.split("Battalion")[1];
                    t && (e.textContent = "Legend" + t)
                }), localStorageSettings.contributors && localStorageSettings.contributors.includes(t) && getElementsBySelectorAndApplyCallbackOnThem(".citizen_sidebar", e => e.insertAdjacentHTML("afterBegin", '<div id="contributor">Stuff++ Contributor<div>')), location.href.includes("/citizen/profile/" + LOCAL_CITIZEN_ID)) {
                    getElementsBySelectorAndApplyCallbackOnThem(".citizen_activity", function (e) {
                        e.style.padding = 0, e.insertAdjacentHTML("beforeEnd", '<div id="removeDead">Remove dead friends</div>')
                    });
                    var assumption_deadFriendsList = [],
                        friendsElement = document.querySelector(".friends_title a"),
                        maxPageFriendsList = Math.ceil(friendsElement.textContent.match(/\d+/)[0] / 20);
                    getElementsBySelectorAndApplyCallbackOnThem(".view_friends", e => e.remove());
                    var removeDeadFriendsElement = getElementsBySelectorAndApplyCallbackOnThem("#removeDead", element => element.addEventListener("click", function () {
                        assumption_deadFriendsList = [];
                        assumption_deleteDeadFriendsFromFriendsListHandler(1);
                        element.style.background = "#FB7E3D";
                    }))
                } else getElementsBySelectorAndApplyCallbackOnThem("#donate_to_friend div", e => e.remove())
            }

            (localStorage.scriptData || localStorage.ChoosenInfo) && localStorage.clear();
            var EREPUBLIK_VARIABLE = window.erepublik || {},
                LOCAL_CIITIZEN_DATA = EREPUBLIK_VARIABLE.citizen || {},
                PLATFORM_LANGUAGE_CODE = (EREPUBLIK_VARIABLE.settings || {}).culture || "en",
                LOCAL_CITIZEN_DATA_RESIDENCE = LOCAL_CIITIZEN_DATA.residence,
                LOCAL_CITIZEN_DATA_DIVISION = LOCAL_CIITIZEN_DATA.division,
                LOCAL_CITIZEN_ID = LOCAL_CIITIZEN_DATA.citizenId || 0,
                CITIZEN_ID_ZORDACZ = LOCAL_CITIZEN_ID % 397854 == 0,
                DEFAULT_SETTINGS = {
                    work: !0,
                    train: !0,
                    workOvertime: !0,
                    workAsManager: !0,
                    wamCompanies: [],
                    assignEmployees: !0,
                    employeeCompanies: [],
                    buyMMgold: !0,
                    collectWcRewards: !0,
                    returnToResidence: !0,
                    energyRatio: 1.75,
                    maxKills: 25,
                    epicAllIn: !0,
                    prefWeapGround: 7,
                    prefWeapAir: -1,
                    battlePrios: CITIZEN_ID_ZORDACZ ? ["TPrw", "DO", "RW", "anyNoTravel", "epic"] : ["epic", "DO", "TP", "RW", "anyNoTravel"],
                    allowTravel: !0,
                    battleType: CITIZEN_ID_ZORDACZ ? "air" : LOCAL_CITIZEN_DATA_DIVISION < 4 ? "ground" : "both",
                    preferCountries: "",
                    avoidCountries: "",
                    l: {},
                    b: []
                },
                localStorageSettings = JSON.parse(localStorage.stuff || 0) || DEFAULT_SETTINGS,
                U = getSettingValue("prefWeapGround"),
                G = getSettingValue("prefWeapAir"),
                K = getSettingValue("battlePrios"),
                J = getSettingValue("battleType"),
                Q = getSettingValue("allowTravel"),
                Z = getSettingValue("epicAllIn"),
                X = getSettingValue("workAsManager"),
                settingValueWAMCompanies = getSettingValue("wamCompanies"),
                $ = getSettingValue("assignEmployees"),
                ee = getSettingValue("employeeCompanies"),
                listWAMCompaniesLeftToday = JSON.parse(localStorage.wamCompaniesLeftToday || 0) || [],
                assumption_dailyBattleStats = JSON.parse(localStorage.statsToday || "[0,0,0,0]"),
                IS_ON_HOMEPAGE = Environment.isOnHomepage,
                APPLICATION_TOP_VIEW = top == self,
                IS_MILITARY_CAMPAIGNS_PAGE = location.href.includes("military/campaigns"),
                IS_CITIZEN_PROFILE_PAGE = location.href.includes("citizen/profile"),
                ACTIVE_BATTLE_ID = SERVER_DATA.battleId,
                HAS_MAVERICK = "true" == localStorage.hasMaverick;
            localStorageSettings.version = "6.1";
            (!localStorageSettings.autoRefresh && IS_ON_HOMEPAGE || !window.$j && !top.location.href.includes("A/u/t/o/F/i/g/h/t/e/r")) && setTimeout(() => location.href = "/", 6e5);
            var CURRENT_INGAME_DAY = EREPUBLIK_VARIABLE.settings.eDay || localStorageSettings.update || 0,
                de = document.getElementsByClassName("lvl")[0],
                elementFoodResetHours = document.getElementById("foodResetHours"),
                cacheMarketPicturePerCountryId = {};
            if (CURRENT_INGAME_DAY && localStorageSettings.update != CURRENT_INGAME_DAY && (localStorageSettings.update = CURRENT_INGAME_DAY, assumption_initializeDailyBattleStats(), saveSettingsAsStringInLocalStorage(), assumption_initializeScript(), localStorage.wamCompaniesLeftToday = JSON.stringify(settingValueWAMCompanies), localStorage.wamAttempt = "0"), 1)

                if (SERVER_DATA.sessionValidation) setTimeout(assumption_solveBattleCaptcha, 5e3);
                else {
                    document.body.insertAdjacentHTML("beforeEnd", '<div id="stuffTipsy"></div>');
                    var fe = document.getElementById("stuffTipsy");
                    if (insertCSSStyles("#large_sidebar{left:auto!important}#stuffTipsy{visibility:hidden;background:#fff;text-shadow:0 1px 0 rgba(255,255,255,.3);font:200 10px Arial;color:#5a5a5a;text-align:center;padding:5px;border-radius:2px;position:fixed;z-index:999999;box-shadow:0 0 5px gray;pointer-events:none}.stuffTipsySpan{padding:1px 3px;margin:1px 0;color:#fff;background:#83b70b;font:700 11px Arial;text-shadow:0 0 2px #000;border-radius:5px;display:inline-block}"), document.getElementById("login_form") && !localStorageSettings.autoLogin && (getElementsBySelectorAndApplyCallbackOnThem("#remember", e => e.checked = !0), getElementsBySelectorAndApplyCallbackOnThem("#login_form button", function (e) {
                        var t = getElementsBySelectorAndApplyCallbackOnThem("#login_form input[id^=citizen_]");
                        t[0] && t[0].value.length > 2 && t[1] && t[1].value.length > 2 && e.click()
                    })), de ? de.style.left = 0 : LOCAL_CITIZEN_DATA_RESIDENCE.hasResidence && LOCAL_CIITIZEN_DATA.regionLocationId != LOCAL_CITIZEN_DATA_RESIDENCE.regionId && (getElementsBySelectorAndApplyCallbackOnThem(".user_location", e => e.insertAdjacentHTML("beforeEnd", '<a class="std_global_btn smallSize blueColor" id="travelBackHome" style="left:-5px"><span>Travel back home</span></a>')), getElementsBySelectorAndApplyCallbackOnThem("#travelBackHome", e => e.addEventListener("click", () => y(LOCAL_CITIZEN_DATA_RESIDENCE.countryId, LOCAL_CITIZEN_DATA_RESIDENCE.regionId)))), !APPLICATION_TOP_VIEW || !function () {
                        var e;
                        if (insertCSSStyles("#stuffBlock,#stuffOptions>*{display:none;position:fixed}#stuffOptions a,.stuffBtn{cursor:pointer;background:#83b70b;border-radius:1px}#stuffOptions a:hover,#stuffOptions span,.stuffBtn span,.stuffBtn:hover,#AFlaunch:hover{background:#fb7e3d}#stuffOptions span,.stuffBtn{color:#fff;display:inline-block;text-align:center}.stuffBtn{" + (de ? "margin:6px 2px;font:700 11px/13px Arial;padding:2px 0 2px 3px;float:left;border-radius:9px" : "margin:5px 0 -5px;width:100%;font:700 11px/14px Arial;padding:3px 0") + ";text-shadow:0 0 2px #000}.stuffBtn span{float:right;" + (de ? "margin:-2px 0 -2px 2px;padding:2px 3px" : "margin:-3px 0;padding:3px 7px") + "}#AFlaunch{position:fixed;bottom:80px;left:5px;width:100px;height:100px;background:#83b70b;cursor:pointer;border-radius:50px;box-shadow:2px 2px 5px gray;z-index:9}#AFlaunch div{margin:25px 30px;border-style:solid;border-width:25px 0 25px 50px;border-color:transparent transparent transparent #fff}"),
                        CURRENT_INGAME_DAY / 100 < 48) return 1;
                        getElementsBySelectorAndApplyCallbackOnThem(de ? ".misc" : ".user_finances",
                            e => e.insertAdjacentHTML(de ? "afterBegin" : "afterEnd", '<div class="stuffBtn">Stuff++<span>' + GM_info.script.version + "</span></div>" + (localStorageSettings.autoFighter ? "" : '<div class="stuffBtn">' + (de ? "AF" : "AutoFighter") + "<span>" + GM_info.script.version + "</span></div>"))), getElementsBySelectorAndApplyCallbackOnThem(".stuffBtn", (t, o) => t.addEventListener("click", function () {

                            if (!e) {
                                e = 1,
                                    insertCSSStyles("#stuffOptions>*{background:#000;box-shadow:0 1px 4px;cursor:default;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;border-radius:5px;text-shadow:0 0 2px #000}#stuffOptions>*>:first-child{position:absolute;top:-20px;width:100%;text-align:center}#stuffOptions>:first-child>:not(:first-child){width:48%;margin:1%;float:left;background:#242b27}#stuffOptions a{color:#fff;font-weight:700;padding:5px;margin:20px}#stuffBlock{z-index:9999;top:0;width:100%;height:100%;background:rgba(0,0,0,.6)}#stuffOptions label{color:#fff;padding:2px 5px;display:inline-block}#stuffOptions>:first-child label{width:96.7%;font-size:13px}#stuffOptions label:hover{background:#5f5757}#stuffOptions span{padding:2px 0;font-weight:700;width:100%}#stuffOptions input,#stuffOptions select{float:right;margin:2px 0}#stuffOptions>:nth-child(2) input[type=checkbox]{position:relative;top:2px}#stuffOptions input[type=text]{width:280px;text-align:center}#stuffOptions>:nth-child(2) label{width:97.8%;font:13px/22px Arial}#stuffOptions>div>:nth-child(2) a{margin:0px;background:none;color:#83b70b}#stuffOptions>div>:nth-child(2) a:hover{color:#fb7e3d}");
                                var t = '<select class="battlePrio"><option value="epic">Epic battles</option><option value="DO">Daily order</option><option value="TP">TP battles - any</option><option value="TPrw">TP - resistance wars</option><option value="TPdirect">TP - direct battles</option><option value="RW">Resistance wars</option><option value="anyNoTravel">Any no-travel battle</option><option value="anyNoTravelAir">Any no-travel air battle</option><option value="anyNoTravelGround">Any no-travel ground battle</option><option value="anyAir">Any air battle</option><option value="anyGround">Any ground battle</option><option value="any">Any battle</option><option value="none">None</option></select>';
                                document.body.insertAdjacentHTML("beforeEnd", '<div id="stuffBlock"></div><div id="stuffOptions"><div style="width:602px"><div><a href="//docs.google.com/spreadsheets/d/16xovNk2oFMsenzKTCsxsuqqIHEOgEF3S4GeJXSRCqqc/edit?usp=sharing">Stuff++ Website</a><a class="eRSreset">RESET</a><a href="//github.com/krozden/erep/raw/main/erepstuff.deobfuscated.user.js">UPDATE</a><a href="/' + PLATFORM_LANGUAGE_CODE + '/citizen/profile/3450472">Contact</a><a>Close</a></div><div><span>Battlefield</span><label>Improved battlefield<input id="battlefield" type="checkbox"></label><label>Replace BH/SH view with damage top10<input id="topLists" type="checkbox"></label><label>AutoBot<input id="autoBot" type="checkbox"></label><span>Companies</span><label>Company manager<input id="companyManager" type="checkbox"></label><label>Show the best local job offer<input id="showBestJobOffer" type="checkbox"></label><span>Energy</span><label>Automatic energy recovery<input id="energyRecovery" type="checkbox"></label><label>Show remaining time to full health reserve<input id="fullEnergy" type="checkbox"></label><label>Show recoverable energy<input id="maxEnergy" type="checkbox"></label><span>Main page</span><label>Hide medal posts<input id="hideMedals" type="checkbox"></label><label>Improved feeds<input id="improveFeeds" type="checkbox"></label><label>Autorefresh main page every 10 minutes<input id="autoRefresh" type="checkbox"></label><label>Epic battle sensor<input id="epicSensor" type="checkbox"></label><span>Marketplace</span><label>Improved marketplace<input id="improveMarketplace" type="checkbox"></label><label>Autofill maximum item amount<input id="autofillMarket" type="checkbox"></label><label>Direct market links in main menu<input id="marketLinks" type="checkbox"></label></div><div><span>Monetary market</span><label>Autofill maximum gold amount<input id="autofillGold" type="checkbox"></label><span>Profile</span><label>Improved profile page<input id="improveProfile" type="checkbox"></label><label>Influence calculator<input id="influenceCalculator" type="checkbox"></label><span>Storage</span><label>Improved inventory<input id="improveInventory" type="checkbox"></label><label>Display sidebar storage<input id="displayStorage" type="checkbox"></label><span>Wars page</span><label>Compact layout<input id="compactWarsPage" type="checkbox"></label><label>Replace "waiting" with countdown timers<input id="replaceWaitingwithCountdown" type="checkbox"></label><span>Other</span><label>AutoFighter<input id="autoFighter" type="checkbox"></label><label>Display XP needed to level-up<input id="xpLeft" type="checkbox"></label><label>Kills, PP, and damage on sidebar<input id="showStats" type="checkbox"></label><label>Mercenary and Freedom Fighter progress<input id="mercFF" type="checkbox"></label><label>Remove external link warning<input id="externalLinks" type="checkbox"></label><label>Improved player hovercards<input id="playerTooltip" type="checkbox"></label><label>Automatic login<input id="autoLogin" type="checkbox"></label><label>Block pack/promo popups<input id="popupBlocker" type="checkbox"></label><label>Remove True Patriot notifications<input id="closeTPnotifications" type="checkbox"></label></div></div><div style="width:452px"><div><a href="//docs.google.com/spreadsheets/d/16xovNk2oFMsenzKTCsxsuqqIHEOgEF3S4GeJXSRCqqc/edit?usp=sharing">AutoFighter Website</a><a class="eRSreset">RESET</a><a href="/' + PLATFORM_LANGUAGE_CODE + '/citizen/profile/6365664">Contact</a><a>Close</a></div><div style="width:98%;margin:1%;float:left;background:#242B27"><span>Settings<div id="AF_l" style="position:absolute;top:6px;right:10px;color:yellow"></div></span><label>Train<input id="train" type="checkbox"></label><label>Work (for employer)<input id="work" type="checkbox"></label><label>Work overtime<input id="workOvertime" type="checkbox"></label><label>Work as manager (visit companies page for setup)<input id="workAsManager" type="checkbox"></label><label>Assign employees (as above)<input id="assignEmployees" type="checkbox"></label><label>Buy 10g from monetary market<input id="buyMMgold" type="checkbox"></label><label>Collect Weekly Challenge rewards<input id="collectWcRewards" type="checkbox"></label><label>Return to residence<input id="returnToResidence" type="checkbox"></label><label>Don\'t fight until you have<input id="energyRatio" type="range" min="0" max="2.00" step="0.05"><b style="float:right;margin:0 5px"></b></label><label>Maximum kills to do in one go<input id="maxKills" type="number" min="0" style="width:70px;text-align:right"></label><label>Go all-in in epic battles (without EBs)<input id="epicAllIn" type="checkbox"></label><label>Preferred ground weapon<select id="prefWeapGround"><option value="0">No preference</option><option value="-1">Q0</option><option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option><option value="5">Q5</option><option value="6">Q6</option><option value="7">Q7</option><option value="10">Bazooka</option></select></label><label>Preferred air weapon<select id="prefWeapAir"><option value="0">No preference</option><option value="-1">Q0</option><option value="1">Q1</option></select></label><label>Battle priority #1' + t + "</label><label>Battle priority #2" + t + "</label><label>Battle priority #3" + t + "</label><label>Battle priority #4" + t + "</label><label>Battle priority #5" + t + '</label><label>Allow travel if needed<input id="allowTravel" type="checkbox"></label><label>Battle type preference<select id="battleType"><option value="both">No preference</option><option value="ground">Ground ONLY</option><option value="air">Air ONLY</option></select></label><label>Preferred countries<input id="preferCountries" type="text" placeholder="comma-separated country IDs, e.g. 67,68,69"></label><label>Avoided countries<input id="avoidCountries" type="text" placeholder="comma-separated country IDs, e.g. 67,68,69"></label><a href="http://wcsimulator.droppages.com/countryids.html" id="countryIDs">Country IDs</a></div></div></div>'), compareScriptVersionWithExternalVersionAndShowUpdateNotification(), getElementsBySelectorAndApplyCallbackOnThem("#stuffOptions a:last-child,#stuffBlock", e => e.addEventListener("click", () => getElementsBySelectorAndApplyCallbackOnThem("#stuffOptions>*,#stuffBlock", e => e.style.display = "none"))),
                                    getElementsBySelectorAndApplyCallbackOnThem(".eRSreset", e => e.addEventListener("click", function () {
                                        localStorage.clear();
                                        location.href = "/";
                                    })), getElementsBySelectorAndApplyCallbackOnThem("#stuffOptions>*", (e, t) => e.querySelectorAll("input").forEach(function (e) {
                                    var n = "checkbox" == e.type ? "checked" : "value";
                                    t ? e[n] = getSettingValue(e.id) : e.checked = !localStorageSettings[e.id], e.addEventListener("change", function () {
                                        localStorageSettings[e.id] = t ? "text" == e.type ? e.value.replace(/[^0-9,]/g, "") : e[n] : !e.checked, saveSettingsAsStringInLocalStorage()
                                    })
                                })), getElementsBySelectorAndApplyCallbackOnThem("#energyRatio", function (e) {
                                    var t = e.nextSibling;
                                    e.addEventListener("input", function () {
                                        var n = (e.value * reset_health_to_recover).toFixed(0);
                                        t.textContent = n > reset_health_to_recover ? reset_health_to_recover + "hp+" + (n - reset_health_to_recover) + "hp" : n + "hp", t.style.color = e.value < 1.8 && e.value > .5 ? "#83B70B" : "red"
                                    }), e.dispatchEvent(new Event("input"))
                                }), getElementsBySelectorAndApplyCallbackOnThem("#prefWeapGround,#prefWeapAir,#battleType", function (e, t) {
                                    e.value = 2 == t ? J : t ? G : U, e.addEventListener("change", function () {
                                        localStorageSettings[2 == t ? "battleType" : t ? "prefWeapAir" : "prefWeapGround"] = e.value, saveSettingsAsStringInLocalStorage()
                                    })
                                }), getElementsBySelectorAndApplyCallbackOnThem(".battlePrio", function (e, t) {
                                    e.value = K[t], e.addEventListener("change", function () {
                                        localStorageSettings.battlePrios[t] = e.value, saveSettingsAsStringInLocalStorage()
                                    })
                                })
                            }
                            assumption_initializeScript(), getElementsBySelectorAndApplyCallbackOnThem("#stuffOptions>:nth-child(" + (o + 1) + "),#stuffBlock", e => e.style.display = "block")
                        })), compareScriptVersionWithExternalVersionAndShowUpdateNotification(), localStorageSettings.autoFighter || document.body.insertAdjacentHTML("beforeEnd", '<div id="AFlaunch" title="Click to launch AutoFighter"><div></div></div>'), getElementsBySelectorAndApplyCallbackOnThem("#AFlaunch", function (e) {
                            s(e, "e"), e.addEventListener("click", function () {
                                location.href = "/A/u/t/o/F/i/g/h/t/e/r"
                            })
                        }), updateLicenceString()
                    }()) {
                        if (LOCAL_CIITIZEN_DATA.currentExperiencePoints && window.reset_health_to_recover && (localStorageSettings.energyRecovery || function () {
                            function e() {
                                var e = document.querySelector("#AutoBotSwitch");
                                e && "AUTOBOT ON" == e.textContent || globalNS.userInfo.wellness >= reset_health_to_recover || !E() || !smallestFood.use || SERVER_DATA.deployment || t()
                            }

                            function t() {
                                fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/eat?format=json&_token=" + csrfToken + "&buttonColor=blue", e => energy.processResponse(e))
                            }

                            function o() {
                                return "Total hits: " + _(parseInt((globalNS.userInfo.wellness + food_remaining) / 10) + " / " + 2 * reset_health_to_recover / 10) + "Full hits in: " + _(k(!0, !0)) + "Full reserve in: " + _(k(!1, !0)) + "Click the health bar to force eat food"
                            }

                            insertCSSStyles(".col{line-height:19px}"), e();
                            var a = setInterval(e, 3e3);
                            de ? getElementsBySelectorAndApplyCallbackOnThem(".energyBg", function (e) {
                                e.addEventListener("mouseenter", () => getElementsBySelectorAndApplyCallbackOnThem("#wellnessTooltipNbp", function (e) {
                                    e.querySelectorAll(".bullets").forEach(e => e.remove()), e.insertAdjacentHTML("beforeEnd", '<span class="bullets">' + o() + "<div>")
                                })), e.addEventListener("click", t)
                            }) : (getElementsBySelectorAndApplyCallbackOnThem(".health_bg", function (e) {
                                s(e, "w", o), e.addEventListener("click", t)
                            }), getElementsBySelectorAndApplyCallbackOnThem("#DailyConsumtionTrigger", e => e.style.display = "none")), getElementsBySelectorAndApplyCallbackOnThem("#fight_btn", t => t.addEventListener("click", function () {
                                clearInterval(a), a = setInterval(e, 3e3)
                            }))
                        }(), localStorageSettings.xpLeft || (insertCSSStyles("#xpleft{font-size:10px;top:" + (de ? "32px;right:769px;position:absolute" : "14px;color:#777;float:right;position:relative") + "}#xpleft span{padding:1px;color:#fff;border-radius:2px}"), getElementsBySelectorAndApplyCallbackOnThem(de ? ".profileDetails" : ".user_level", e => e.insertAdjacentHTML("beforeEnd", '<div id="xpleft">XP left: <span></span></div>')), de && (getElementsBySelectorAndApplyCallbackOnThem("#DailyConsumtionTrigger", e => e.style.visibility = "hidden"), getElementsBySelectorAndApplyCallbackOnThem(".energyTooltip", e => e.style.top = "42px"), de.style.top = "30px"), recalculateXpLeftToLevelUpAndUpdateFrontentDisplay()), localStorageSettings.maxEnergy || function () {
                            insertCSSStyles(".health_bar strong#maxRecover{line-height:14px;text-align:right;background:none;float:right;right:2px;" + (de ? "position:absolute;z-index:4;font-size:9px;text-shadow:0 0 5px rgba(0,0,0,.85);font-weight:unset" : "") + "}"), getElementsBySelectorAndApplyCallbackOnThem("#current_health", e => e.insertAdjacentHTML("afterEnd", '<strong id="maxRecover"></strong>'));
                            var e = document.getElementById("maxRecover");
                            setInterval(() => e.textContent = food_remaining, 200)
                        }(), localStorageSettings.fullEnergy || setTimeout(function () {
                            insertCSSStyles(".health_bar strong#full_energy{line-height:14px;text-align:left;left:" + (de ? "10px;position:absolute;z-index:4;font-size:9px;text-shadow:0 0 5px rgba(0,0,0,.85);font-weight:unset" : "15px") + ";background:none;float:left}"), getElementsBySelectorAndApplyCallbackOnThem("#current_health", e => e.insertAdjacentHTML("beforeBegin", '<strong id="full_energy"></strong>'));
                            var e = document.getElementById("full_energy");
                            setInterval(() => e.textContent = k(), 200)
                        })), APPLICATION_TOP_VIEW && (localStorageSettings.externalLinks || function () {
                            function t() {
                                getElementsBySelectorAndApplyCallbackOnThem('a[href*="/main/warn/"]', e => e.href = atob(e.href.split("/main/warn/")[1]))
                            }

                            e.push(function (e, n) {
                                /\/eat|\/inventory|\/campaigns/.test(n) || t(), n.includes("main/messages") && setTimeout(t, 300)
                            }), t()
                        }(), localStorageSettings.marketLinks || function () {
                            function e(e, t, n) {
                                return (n ? '<a href="/' + PLATFORM_LANGUAGE_CODE + "/economy/marketplace#" + a + "/" + e + "/" + t + '">' : "<div>") + '<img src="//www.erepublik.net/images/icons/industry/' + e + "/q" + t + '.png">' + (n ? "</a>" : "</div>")
                            }

                            function t(t) {
                                if (!t.target.querySelectorAll("a").length) {
                                    for (var n = t.target.getElementsByTagName("img")[0].src.split("industry/")[1].split("/")[0], i = "", o = 1; o < (n < 3 ? 8 : n < 5 ? 6 : 2); o++) i += e(n, o, 1);
                                    t.target.insertAdjacentHTML("beforeEnd", 3 == n ? i : i + e(1 == n ? 7 : 2 == n ? 12 : 4 == n ? 17 : 24, 1, 1)), location.href.includes("economy/marketplace") && t.target.querySelectorAll("a").forEach(e => e.addEventListener("click", () => setTimeout(() => location.reload(), 200)))
                                }
                            }

                            insertCSSStyles("#marketMenu div,#marketMenu div:hover a{display:inline-block}#marketMenu{position:absolute;top:30px;right:2px}#marketMenu *{width:27px;height:27px}#marketMenu div{line-height:0}#marketMenu a{display:none;float:left;clear:both;background:RGBA(131,183,11,.8);border-radius:5px}#marketMenu a:hover{background:#FB7E3D}#marketMenu img{margin-bottom:-5px}");
                            for (var o = "", a = LOCAL_CIITIZEN_DATA[LOCAL_CITIZEN_DATA_RESIDENCE.hasResidence && LOCAL_CIITIZEN_DATA.regionLocationId != LOCAL_CITIZEN_DATA_RESIDENCE.regionId ? "countryLocationId" : "country"], r = 1; r < 6; r++) o += e(1 == r ? 1 : 2 == r ? 2 : 3 == r ? 23 : 4 == r ? 3 : 4, 1 == r ? 1 : 2 == r ? 7 : 3 == r ? 1 : 4 == r ? 5 : 1);
                            getElementsBySelectorAndApplyCallbackOnThem("#newMenu", e => e.insertAdjacentHTML("beforeEnd", '<div id="marketMenu">' + o + "</div>")), getElementsBySelectorAndApplyCallbackOnThem("#marketMenu", e => e.querySelectorAll("div").forEach(e => e.addEventListener("mouseenter", t)))
                        }(), localStorageSettings.popupBlocker || function () {
                            function e() {
                                localStorage["promoPopupTimestamp_" + t.getFullYear() + "-" + t.getMonth() + "-" + t.getDate()] = 9999999999999
                            }

                            var t = new Date;
                            e(), t.setDate(t.getDate() + 1), e()
                        }(), localStorageSettings.closeTPnotifications || g("citizenNotifications", function () {
                            var e = 0,
                                t = angular.element("#SideNotificationController").scope();
                            for (let n of t.notifications) n.iconURL && n.iconURL.includes("atriot") && e++;
                            for (; e > 0;) t.notifications.active.iconURL.includes("atriot") ? (t.closeNotif(), e -= 1) : t.goNext()
                        })), localStorageSettings.showStats || de || (insertCSSStyles("#NoKills{cursor:pointer;font:700 11px/14px arial;float:left;width:145px;margin:6px 3px 0}#NoKills strong{color:#666}#NoKills span{color:#3c8fa7;float:right}"), getElementsBySelectorAndApplyCallbackOnThem(".user_finances", e => e.insertAdjacentHTML("afterEnd", '<div id="NoKills">' + (assumption_dailyBattleStats[0] || assumption_dailyBattleStats[1] ? "<strong>Kills | PP:</strong><span>" + reformatNumberStringToDelimitedNumber(assumption_dailyBattleStats[0]) + " | " + reformatNumberStringToDelimitedNumber(assumption_dailyBattleStats[1]) + "</span>" : "") + (assumption_dailyBattleStats[2] ? "<br><strong>Ground:</strong><span>" + reformatNumberStringToDelimitedNumber(assumption_dailyBattleStats[2]) + "</span>" : "") + (assumption_dailyBattleStats[3] ? "<br><strong>Air:</strong><span>" + reformatNumberStringToDelimitedNumber(assumption_dailyBattleStats[3]) + "</span>" : "") + "</div>")), getElementsBySelectorAndApplyCallbackOnThem("#NoKills", e => e.addEventListener("click", assumption_initializeDailyBattleStats))), APPLICATION_TOP_VIEW && (IS_ON_HOMEPAGE || /military\/campaigns|\/citizen\/profile|donate-items|\/economy\/marketplace|economy\/myCompanies/.test(location.href)) && !localStorageSettings.displayStorage && fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/inventory-items/", function (e) {
                            !localStorageSettings.displayStorage && (!IS_CITIZEN_PROFILE_PAGE || IS_CITIZEN_PROFILE_PAGE && location.href.includes("citizen/profile/" + LOCAL_CITIZEN_ID)) && function (e) {
                                function c(e, t) {
                                    return e.attributes[t] ? ("energyRestore" == t ? "Energy restore" : "firePower" == t ? "Firepower" : "energyPool" == t ? "Energy pool" : "") + ": " + _(reformatNumberStringToDelimitedNumber(e.attributes[t].value)) : ""
                                }

                                insertCSSStyles("#sideInventory{opacity:0;transition:opacity 1s;position:absolute;line-height:0;max-height:80vh;column-width:39px;column-gap:1px;text-shadow:0 0 2px #000}#sideInventory img{height:39px;width:39px;background:linear-gradient(#eef1ec,#d5decf)}#sideInventory span{font:700 10px/13px arial;color:#fff;background:#83b70b;width:39px;text-align:center;cursor:default;display:block}#sideInventory div{box-shadow:1px 1px 5px gray;page-break-inside:avoid}.col{line-height:19px}#sideInventory q{background:red;display:block;width:100%}#overTime img{box-shadow:0 0 0 3px inset #fb7e3d}#overTime img:hover{filter:brightness(1.1)}" + (de ? "" : "#storageCapacity{float:left;color:#5a5a5a;text-shadow:0 1px 0 rgba(255,255,255,.9);font-size:11px;cursor:default}#storageCapacity img{float:left;margin:-1px 6px 0 2px;width:22px;height:16px}#storageCapacity strong{margin:0 1px}"));
                                var d = assumption_getAmountOfAvailableEnergyFromFoodInInventory(e),
                                    p = 0,
                                    form_body = Object.assign(e.inventoryItems.finalProducts.items, e.inventoryItems.rawMaterials.items, (e.inventoryItems.activeEnhancements || {}).items || []),
                                    f = '<div id="sideInventory">';
                                buildPostFormBody(form_body, function (e, t) {
                                    if ((t.icon || t.active) && !t.isPartial) {
                                        var n = form_body[e + "_partial"],
                                            i = "4_100" == t.id && t.amount > 23 && LOCAL_CIITIZEN_DATA.dailyTasksDone && globalNS.userInfo.wellness > 9,
                                            r = t.isExpirable,
                                            l = r ? t.attributes.expirationInfo.value : 0;
                                        f += "<div" + (t.active && t.active.time_left < 36e3 ? ' data-time-left="' + t.active.time_left + '"' : "") + (i ? ' id="overTime"' : "") + ' title="' + t.name + "<br>" + c(t, "energyRestore") + c(t, "firePower") + c(t, "energyPool") + (t.used ? "1 partially used " + _(t.used.durability.value + " " + t.used.durability.type + " left") : "") + (r ? l.join("<br>") : "") + (i ? _("Click to work overtime for 10hp") : "") + '"><img src="' + (t.icon ? t.icon : "damageBoosters" == t.type ? "/images/modules/pvp/damage_boosters/damage_booster.png" : "speedBoosters" == t.type ? "/images/modules/pvp/speed_boosters/speed_booster.png" : "prestigePointsBoosters" == t.type ? "/images/modules/pvp/prestige_points_boosters/prestige_booster.png" : "eventDamageBoosters" == t.type ? "/images/modules/pvp/allBoosters/eventDamageBoosters.png" : "aircraftDamageBoosters" == t.type ? "/images/modules/pvp/damage_boosters/air_damage_booster.png" : "/images/icons/industry/100/" + t.type + ".png") + '"><span>' + (t.active ? t.active.time_left > 864e3 ? Math.trunc(t.active.time_left / 86400) + "d" : t.active.time_left > 86400 ? Math.trunc(t.active.time_left / 86400) + "d" + Math.trunc(t.active.time_left % 86400 / 3600) + "h" : "<q>" + Math.trunc(t.active.time_left / 3600) + "h" + Math.trunc(t.active.time_left % 3600 / 60) + "m</q>" : t.isRaw ? Math.trunc(10 * (t.amount + (n ? n.amount.split("%")[0] / 100 : 0))) / 10 : r && /[0-9],[0-9]{3}/g.exec(l)[0].replace(",", "") - CURRENT_INGAME_DAY < 8 || 1 == t.industryId && t.quality < 8 && d < 240 * globalNS.userInfo.energyPerInterval ? "<q>" + reformatNumberStringToDelimitedNumber(t.amount) + "</q>" : shortenMillionOrBillion(t.amount, 2)) + "</span></div>"
                                    }
                                    isNaN(t.amount) || (p += t.amount * ("1_10" == e ? 10 : "1_11" == e ? 20 : 0))
                                }), document.body.insertAdjacentHTML("afterBegin", f + "</div>"), getElementsBySelectorAndApplyCallbackOnThem("#sideInventory div", function (e) {
                                    s(e, "e"), e.dataset.timeLeft && b(e.querySelector("q"), +e.dataset.timeLeft, () => e.remove(), 1)
                                }), setTimeout(() => document.getElementById("sideInventory").style.opacity = 1), getElementsBySelectorAndApplyCallbackOnThem("#overTime", e => e.addEventListener("click", () => fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/job-data", function (t) {
                                    var n = 1e3 * t.overTime.nextOverTime - Date.now();
                                    if (n < 0) fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/workOvertime", {
                                        _token: csrfToken,
                                        action_type: "workOvertime"
                                    }, function (t) {
                                        var n = t.status && t.message;
                                        if (humanMsg.displayMsg(n ? "Success!" : "captcha" == t.message ? "Captcha - try to work on the companies page" : "Error: " + t.message), n) {
                                            var i = e.querySelector("span");
                                            i.textContent = +i.textContent - 24, +i.textContent < 1 ? e.remove() : e.removeAttribute("id"), globalNS.updateCurrency(LOCAL_CIITIZEN_DATA.currencyAmount + t.result.netSalary), energy.modifyHealth(globalNS.userInfo.wellness - 10), localStorageSettings.xpLeft || (LOCAL_CIITIZEN_DATA.currentExperiencePoints += 2, recalculateXpLeftToLevelUpAndUpdateFrontentDisplay())
                                        }
                                    });
                                    else {
                                        var i = parseInt(n / 6e4 + 1);
                                        humanMsg.displayMsg("You must wait " + i + " minute" + (i > 1 ? "s" : "") + " before working for 10hp again")
                                    }
                                })));
                                var g = reformatNumberStringToDelimitedNumber(e.inventoryStatus.usedStorage) + " / " + reformatNumberStringToDelimitedNumber(e.inventoryStatus.totalStorage);
                                de ? (getElementsBySelectorAndApplyCallbackOnThem(".currency", e => e.insertAdjacentHTML("afterEnd", '<article id="storageCapacity" class="currency"><span class="amount">' + g + '</span><img src="/images/modules/manager/tab_storage.png" class="icon" style="height:16px"></article>')), getElementsBySelectorAndApplyCallbackOnThem("span.name", e => e.textContent = e.textContent.split(",")[0])) : getElementsBySelectorAndApplyCallbackOnThem(".currency_amount", e => e.insertAdjacentHTML("afterEnd", '<div id="storageCapacity"><img src="/images/modules/manager/tab_storage.png"><strong></strong></div>')), freeSpace = e.inventoryStatus.totalStorage - e.inventoryStatus.usedStorage, s(document.getElementById("storageCapacity"), de ? "s" : "w", () => "Free space: " + _(reformatNumberStringToDelimitedNumber(freeSpace)) + "Total EB hits: " + _(reformatNumberStringToDelimitedNumber(p)) + "Total food HP: " + _(reformatNumberStringToDelimitedNumber(d))), getElementsBySelectorAndApplyCallbackOnThem("#storageCapacity strong", function (e) {
                                    e.textContent = g, e.addEventListener("click", () => getElementsBySelectorAndApplyCallbackOnThem("#InfCalc_hits", function (e) {
                                        e.value = p, e.dispatchEvent(new Event("keyup"))
                                    }))
                                }), !localStorageSettings.autofillMarket && location.href.includes("economy/marketplace") && I()
                            }(e)
                        }), IS_ON_HOMEPAGE) fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/military/campaignsJson/list", function (e) {
                            battleListingScope = {
                                campaigns: {
                                    initialList: e.battles
                                },
                                requestTime: e.time
                            }, !localStorageSettings.epicSensor && APPLICATION_TOP_VIEW && function () {
                                function e(e) {
                                    buildPostFormBody(battleListingScope.campaigns.initialList, function (i, o) {
                                        var a = [],
                                            r = 0;
                                        if (o.is_dict || o.is_lib || buildPostFormBody(o.div, function (e, t) {
                                            var n = t.epic;
                                            (HAS_MAVERICK || t.div == LOCAL_CITIZEN_DATA_DIVISION || t.div > 10) && !t.end && 0 === t.terrain && n && n >= r && (r = n, a = [n, e])
                                        }), a[0] == e) return n = !0, document.getElementById("menu3").insertAdjacentHTML("beforeEnd", '<a id="epicLink" division="' + a[1] + '" href="/' + PLATFORM_LANGUAGE_CODE + "/military/battlefield/" + i + '" style="position:absolute;top:8px;left:225px;width:30px;background:none"><img src="/images/modules/misc/' + (e > 1 ? "epic_battles_icon" : "full_scale_battle") + '.png" style="width:30px"></a>'), document.getElementById("epicLink").addEventListener("click", function () {
                                            event.preventDefault(), travelToBattlefieldByBattleIdAndZoneId(this.href.split("battlefield/")[1], this.getAttribute("division"))
                                        }), document.title = (e > 1 ? "EPIC BATTLE" : "FULL SCALE") + " DETECTED", !1
                                    })
                                }

                                var n = !1;
                                e(2), n || e(1)
                            }()
                        }), g("weekly-challenge-data", function () {
                            insertCSSStyles("#WCSimulator{position:absolute;right:10px;top:1px;font:700 11px/14px arial;text-shadow:0 0 2px #000;color:#fff;padding:0 3px;background:#83b70b;border-radius:1px}#WCSimulator:hover{background:#fb7e3d}"), getElementsBySelectorAndApplyCallbackOnThem("#weeklyChallenge", e => e.insertAdjacentHTML("beforeEnd", '<a href="http://wcsimulator.droppages.com/" target="_blank" id="WCSimulator">WC calculator</a>')), getElementsBySelectorAndApplyCallbackOnThem(".get_milestone_reward").length && !getElementsBySelectorAndApplyCallbackOnThem(".collectAll").length && (getElementsBySelectorAndApplyCallbackOnThem(".player_layer", e => e.insertAdjacentHTML("beforeEnd", '<a href="javascript:" class="std_global_btn collectAll blueColor floatRight iconBtn" style="top:-33px;"><img src="//www.erepublik.net/images/modules/weekly_challenge/collect-all.png" alt="Get all rewards"></a>')), getElementsBySelectorAndApplyCallbackOnThem(".collectAll", e => e.addEventListener("click", function () {
                                angular.element("#weeklyChallenge").scope().getAllReward(), e.remove()
                            })))
                        }), localStorageSettings.improveFeeds || addEventListener("click", function (e) {
                            document.getElementById("citizenFeed").contains(e.target) || e.target.classList.contains("emoji") || e.target.classList.contains("std_global_btn") || getElementsBySelectorAndApplyCallbackOnThem(".commentsWrapper", e => e.parentElement.parentElement.querySelector(".postBtn").click())
                        }), localStorageSettings.hideMedals || (insertCSSStyles("#citizenFeed .postsWrapper .postContainer.autoPost{display:none}"), g("wall-post/retrieve", function () {
                            getElementsBySelectorAndApplyCallbackOnThem(".postContainer:not(.autoPost)").length < 5 && getElementsBySelectorAndApplyCallbackOnThem(".previousposts")[0].click()
                        }));
                        else if (IS_MILITARY_CAMPAIGNS_PAGE) battleListingScope = angular.element("#ListCampaignsController").scope(), APPLICATION_TOP_VIEW && (localStorageSettings.compactWarsPage || insertCSSStyles("#header{position:sticky;top:0;z-index:9;background:#fff}.war_card{width:236px!important;height: 214px!important;margin:0!important}.black_bar{width:100%!important}#ListCampaignsController br{display:none}.timer{bottom:17px!important;color:#fff!important;pointer-events:none}.card_bottom{height:16px!important}.fight_btn{bottom:0!important}.fight_btn img{display:none!important}.country_name{max-width:120px!important}.fight{bottom:23px}.hexagons{height:115px!important}.campaign{visibility:hidden}"), localStorageSettings.replaceWaitingwithCountdown || setInterval(function () {
                            var e = battleListingScope.campaigns.requestTime;
                            getElementsBySelectorAndApplyCallbackOnThem(".timer:not(.countdownAdded)", function (t) {
                                t.classList.add("countdownAdded");
                                var n = angular.element(t).scope().campaign.start - e;
                                n > 0 && b(t, n, e => e.textContent = "00h:00m")
                            })
                        }, 500), localStorageSettings.mercFF || B());
                        else if (ACTIVE_BATTLE_ID) {
                            if (insertCSSStyles("#battleConsole li b,#battleConsole li div,#battleConsole li i,.player_name a,.country_avatar,.region_name_background{pointer-events:none}"), localStorage.hasMaverick = SERVER_DATA.canSwitchDivisions, e.push(function (e, t) {
                                !/fight-shoo|deploy-bomb/.test(t) || e.error || "ENEMY_KILLED" != e.message && "OK" != e.message && !e.data || R(e)
                            }), setTimeout(function () {
                                pomelo.on("onDeployFinished", e => R(e, !0))
                            }, 2e3), localStorageSettings.battlefield || function () {
                                function r() {
                                    fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/military/battle-console",
                                        {
                                            battleId: ACTIVE_BATTLE_ID,
                                            zoneId: SERVER_DATA.zoneId,
                                            action: "battleConsole",
                                            _token: csrfToken
                                        }, function (e) {
                                            p.textContent = e.division[currentDivision - 1].epicBattleProgress, (100 == p.textContent || SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) && p.click()
                                        })
                                }

                                function s() {
                                    var e;
                                    e = SERVER_DATA.battleZoneId, fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/military/battle-console", {
                                        action: "battleStatistics",
                                        battleZoneId: e,
                                        type: "damage",
                                        leftPage: 1,
                                        rightPage: 1,
                                        _token: csrfToken
                                    }, e => getElementsBySelectorAndApplyCallbackOnThem("#topLists", t => t.innerHTML = '<div style="left:0">' + c(e, 1) + '</div><div style="right:0">' + c(e) + "</div>"))
                                }

                                function c(e, n) {
                                    var i = "";
                                    return buildPostFormBody(e[SERVER_DATA[(n ? "left" : "right") + "BattleId"]].fighterData, function (e, t) {
                                        e < 11 && (i += '<a href="/' + PLATFORM_LANGUAGE_CODE + "/citizen/profile/" + t.citizenId + '"><q>' + t.citizenName + "</q><span>" + shortenMillionOrBillion(t.raw_value, 2) + "</span></a>")
                                    }), i
                                }

                                if (insertCSSStyles("#epicPercent{color:#fff;position:absolute;bottom:1px;left:0;background:rgba(0,0,0,.4);font:700 10px/13px Arial;padding:2px 5px;border-radius:0 2px 0 0;cursor:pointer;text-shadow:0 0 2px #000}#epicPercent input{margin:0 5px 0 2px;top:2px;position:relative}#pvp .left_wall span,#pvp .right_wall span{opacity:1}#pvp .battle_progression .epic{display:none}#pvp .percent span{opacity:1;animation:none;-webkit-animation:none}#personal_stats{text-align:center;width:100%;position:absolute;top:4px;color:#fff;font:700 10px/20px Arial;text-shadow: 0 0 2px #000;z-index:1}#influence_added{visibility:hidden}#travelButtons{position:absolute;bottom:17px;left:0;width:100%;height:20px;text-align:center;color:#fff;pointer-events:none;z-index:999}#travelButtons span{background:rgba(0,0,0,.6);margin:200px;padding:10px;border-radius:5px;cursor:pointer;font:700 10px/20px Arial;box-shadow:0 0 5px #fff;pointer-events:visible}#travelButtons span:hover{background:#000}#travelButtons img{vertical-align:middle;margin:0 5px;width:20px}#topLists div{position:absolute;top:25px;z-index:11;border-radius:2px}#topLists a{text-shadow:0 0 2px #000;font:700 9px Arial;color:#fff;display:flex;width:121px;background:rgba(0,0,0,.3);padding:2px}#topLists a:hover{color:#83b70b}#topLists q{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#topLists span{color:#ffd479}"), SERVER_DATA.spectatorOnly || getElementsBySelectorAndApplyCallbackOnThem("#total_damage", function (e) {
                                    var t = e.querySelector("strong");
                                    t.style.visibility = "hidden";
                                    var i = document.cookie.split(SERVER_DATA.battleZoneId + "-" + SERVER_DATA.leftBattleId + "=")[1];
                                    savedStats = (i ? i.split(";")[0] : "0|0").split("|"), savedStats[2] = t.textContent.replace(/,/g, ""), e.insertAdjacentHTML("beforeEnd", '<div id="personal_stats"><q>' + reformatNumberStringToDelimitedNumber(savedStats[0]) + "</q> | <q>" + reformatNumberStringToDelimitedNumber(savedStats[1]) + "</q> | <q>" + reformatNumberStringToDelimitedNumber(savedStats[2]) + "</q></div>"), personal_stats = getElementsBySelectorAndApplyCallbackOnThem("#personal_stats q")
                                }), getElementsBySelectorAndApplyCallbackOnThem("#total_damage .resistance", e => e.remove()), APPLICATION_TOP_VIEW) {
                                    clearInterval(globalSleepInterval), getElementsBySelectorAndApplyCallbackOnThem("#pvp", e => e.insertAdjacentHTML("beforeEnd", (SERVER_DATA.onAirforceBattlefield ? "" : '<label id="epicPercent"><input type="checkbox">Epic progress <span></span>%</label>') + (localStorageSettings.topLists ? "" : '<div id="topLists"></div>') + (SERVER_DATA.isCivilWar ? "" : '<div id="travelButtons"><span><img src="//www.erepublik.net/images/flags_png/L/' + EREPUBLIK_VARIABLE.info.countries[SERVER_DATA.leftBattleId].permalink + '.png">Join</span><span>Join <img src="//www.erepublik.net/images/flags_png/L/' + EREPUBLIK_VARIABLE.info.countries[SERVER_DATA.rightBattleId].permalink + '.png"></span></div>'))), getElementsBySelectorAndApplyCallbackOnThem("#region_name_link", e => e.textContent += (SERVER_DATA.isResistance ? " RW" : "") + " R" + SERVER_DATA.zoneId);
                                    var d, p = document.querySelector("#epicPercent span");
                                    getElementsBySelectorAndApplyCallbackOnThem("#epicPercent input", e => e.addEventListener("change", function () {
                                        this.checked ? (r(), d = setInterval(r, 65e3)) : clearInterval(d)
                                    })), SERVER_DATA.isCivilWar || (getElementsBySelectorAndApplyCallbackOnThem("#travelButtons span", function (e, t) {
                                        e.addEventListener("click", () => travelToBattlefieldByBattleIdAndZoneId(ACTIVE_BATTLE_ID, SERVER_DATA.battleZoneId, t ? SERVER_DATA.rightBattleId : SERVER_DATA.leftBattleId)), SERVER_DATA.spectatorOnly || t || (e.style.visibility = "hidden")
                                    }), getElementsBySelectorAndApplyCallbackOnThem("#trigger_campaignMap", e => e.addEventListener("click", () => document.getElementById("travelButtons").style.zIndex = "99")));
                                    var u = angular.element("#battleFooterbattleSetup").scope(),
                                        f = u.openPopup;
                                    u.openPopup = (() => {
                                    }), setTimeout(() => u.openPopup = f, 2e3), localStorageSettings.topLists || (getElementsBySelectorAndApplyCallbackOnThem(".battle_heroes", e => e.style.display = "none"), s(), setInterval(function () {
                                        SERVER_DATA.points.attacker < 1800 && SERVER_DATA.points.defender < 1800 && s()
                                    }, 3e4)), e.push(function (e, t) {
                                        if (t.includes("battle-stats")) {
                                            var n = e.battle_zone_situation[SERVER_DATA.battleZoneId];
                                            n && (document.title = (n > 1 ? "EPIC BATTLE" : "FULL SCALE") + " DETECTED")
                                        }
                                    })
                                }
                            }(), localStorageSettings.autoBot || SERVER_DATA.spectatorOnly || function () {
                                function timeoutFunction() {
                                    "AUTOBOT ON" == d[0].textContent && (restartTimeout(f.value < 3 && !f.disabled ? 2500 : 1e3), globalNS.userInfo.wellness >= b.value ? fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/military/fight-shoo" + (SERVER_DATA.onAirforceBattlefield ? "oo" : "o") + "t/" + ACTIVE_BATTLE_ID, {
                                        sideId: SERVER_DATA.countryId,
                                        battleId: ACTIVE_BATTLE_ID,
                                        _token: csrfToken
                                    }, function (e) {
                                        if (["UNKNOWN_SIDE", "WRONG_SIDE"].includes(e.message)) location.href = e.url;
                                        else if (["ENEMY_ATTACKED", "LOW_HEALTH"].includes(e.message)) window.globalNS.userInfo.wellness = 0, restartTimeout(0);
                                        else if ("ZONE_INACTIVE" == e.message) t();
                                        else if ("SHOOT_LOCKOUT" == e.message) restartTimeout(450);
                                        else {
                                            var n = e.details,
                                                i = e.user;
                                            battleFX.updateRank(e.rank), window.totalPrestigePoints += e.hits, y.forEach(e => e.textContent = totalPrestigePoints), x.forEach(e => e.textContent = reformatNumberStringToDelimitedNumber(n.currency)), k.forEach(function (e) {
                                                var t = n.current_energy_ratio;
                                                e.style.width = t + "%", e.classList.remove("high", "medium", "low"), e.classList.add(t < 20 ? "low" : t > 60 ? "high" : "medium")
                                            }), i.weaponQuantity >= 0 && _.forEach(e => e.textContent = reformatNumberStringToDelimitedNumber(i.weaponQuantity)), globalNS.updateSideBar(n), h && (m -= e.oldEnemy.isNatural ? Math.floor(1.1 * i.givenDamage) : i.givenDamage, g[0].value = Math.max(0, m / (c ? 1e3 : 1e6)).toFixed()), f.disabled || 1 != (f.value = f.value - 1) || restartTimeout(900), (!u.checked && !food_remaining && globalNS.userInfo.wellness < b.value || !f.disabled && f.value <= 0 || h && m <= 0 || v.checked && !i.epicBattle) && t(), R(e)
                                        }
                                    }) : E() || u.checked ? fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/eat?format=json&_token=" + csrfToken + "&buttonColor=" + (u.checked ? "orange" : "blue"), function (e) {
                                        energy.processResponse(e), restartTimeout(1e3)
                                    }) : t())
                                }

                                function t() {
                                    d[0].textContent = "AUTOBOT OFF", d[0].style.background = "#FB7E3D", h = !1, g[0].value = 0, clearTimeout(TIMEOUT_HANDLE)
                                }

                                function restartTimeout(timeoutInMs) {
                                    clearTimeout(TIMEOUT_HANDLE),
                                        TIMEOUT_HANDLE = setTimeout(timeoutFunction, timeoutInMs)
                                }

                                insertCSSStyles("#AutoBot,#AutoBot img{position:absolute;background:rgba(36,43,39,.6)}#AutoBot{transition:left .3s;width:136px;left:-136px;top:240px;border-radius:3px;color:#fff;font:700 12px/20px Arial;text-align:left;z-index:10;text-shadow:0 0 2px #000}#AutoBot input{width:25px;margin:3px 1px;text-align:center}#AutoBot input[type=number]{width:60px;position:absolute;right:5px;margin:0}#AutoBot div{padding:5px}#AutoBot img{width:36px;height:36px;padding:0 6px;top:40%;right:-48px;cursor:pointer;border-radius:0 3px 3px 0}#AutoBot img:hover{filter:brightness(1.2)}#AutoBotSwitch{cursor:pointer;width:100%;background:#FB7E3D;text-align:center}#AutoBotSwitch:hover{background:#83B70B!important}");
                                var TIMEOUT_HANDLE, c = SERVER_DATA.onAirforceBattlefield;
                                getElementsBySelectorAndApplyCallbackOnThem(".battle_footer", e => e.insertAdjacentHTML("afterEnd", '<div id="AutoBot"><div><label>Kills<input id="kills" type="number" value="25" min="0"></label><br><label>Damage<input id="damage" type="number" placeholder="in ' + (c ? "k" : "M") + '" min="0"></label><br><label><input id="allin" type="checkbox">All-in</label><label><input id="eatEB" type="checkbox">Eat EBs</label><br><label>Min HP<input id="minEnergy" type="number" value="50" step="10" min="0"></label><br><label><input id="stopNoEpic" type="checkbox">Stop if no epic</label><br><label><input id="freezeBattlefield" type="checkbox">Freeze battlefield</label><br></div><p id="AutoBotSwitch">AUTOBOT OFF</p><img src="//www.erepublik.net/images/emoji/emojione/color/1f52b.png"></div>'));
                                var d = getElementsBySelectorAndApplyCallbackOnThem("#AutoBotSwitch", n => n.addEventListener("click", function () {
                                        "AUTOBOT OFF" == n.textContent ? (n.textContent = "AUTOBOT ON", n.style.background = "#83B70B", f.disabled && !p[0].checked && (h = !0, m = +g[0].value * (c ? 1e3 : 1e6)), timeoutFunction()) : t()
                                    })),
                                    p = getElementsBySelectorAndApplyCallbackOnThem("#allin", e => e.addEventListener("change", () => f.disabled = g[0].disabled = e.checked)),
                                    u = document.getElementById("eatEB"),
                                    f = document.getElementById("kills"),
                                    g = getElementsBySelectorAndApplyCallbackOnThem("#damage", e => e.addEventListener("input", () => f.disabled = e.value > 0)),
                                    m = 0,
                                    h = !1,
                                    b = document.getElementById("minEnergy"),
                                    v = document.getElementById("stopNoEpic"),
                                    y = getElementsBySelectorAndApplyCallbackOnThem("#prestige_value"),
                                    x = getElementsBySelectorAndApplyCallbackOnThem("#side_bar_currency_account_value"),
                                    k = getElementsBySelectorAndApplyCallbackOnThem(".left_player .energy_progress"),
                                    _ = getElementsBySelectorAndApplyCallbackOnThem(".weapon_no");
                                document.querySelector("#AutoBot img").addEventListener("click", e => e.target.parentElement.style.left = "0px" == e.target.parentElement.style.left ? "-136px" : "0px"), document.getElementById("freezeBattlefield").addEventListener("click", e => ERPK.initPlayerRateFilter(e.target.checked ? "Off" : "On"))
                            }(), localStorageSettings.mercFF || SERVER_DATA.isCivilWar || !APPLICATION_TOP_VIEW || B(), SERVER_DATA.webDeployEnabled) var ge = setInterval(function () {
                                SERVER_DATA.sessionValidation && (clearInterval(ge), assumption_solveBattleCaptcha())
                            }, 1e3)
                        } else /donate-|accounts|citizen-friends/.test(location.href) && !localStorageSettings.improveProfile ? D() : IS_CITIZEN_PROFILE_PAGE ? g("/citizen-profile-json/", function () {
                            window.hasRunProfileStuff || (window.hasRunProfileStuff = 1, localStorageSettings.improveProfile || D(), localStorageSettings.influenceCalculator || function () {
                                function e() {
                                    o.forEach(function (e, n) {
                                        e.querySelectorAll("span").forEach(e => e.remove());
                                        var i = t.military.militaryData[n ? "aircraft" : "ground"],
                                            o = +e.getElementsByTagName("select")[0].value,
                                            r = document.getElementById("InfCalc_NE").checked,
                                            l = t.loggedIn.hovercardData.fighterInfo[n ? "aviation" : "military"].damagePerHitNoWeapon * (1 + o / 5) * (n ? 1 : 1 + parseInt(document.getElementById("InfCalc_legend").value) / 100) * (1 + parseInt(document.getElementById("InfCalc_booster").value) / 100),
                                            s = 1e6 / l;
                                        e.insertAdjacentHTML("beforeEnd", "<span>Influence</span><span>" + shortenMillionOrBillion(parseInt(l * document.getElementById("InfCalc_hits").value * (r ? 1.1 : 1)), 1) + "</span><span>Hits to next rank</span><span>" + (i.nextRankAt - i.points > 0 ? shortenMillionOrBillion(Math.ceil(10 * (i.nextRankAt - i.points) / l / (document.getElementById("InfCalc_WarStash").checked ? 1.1 : 1)), 1) : "∞") + '</span><span>Cost cc/M</span><span title="Includes food">' + shortenMillionOrBillion(((o ? localStorageSettings.infCalc[n ? 23 : 2][Math.min(o, 7)] / o * s : 0) + s * localStorageSettings.infCalc.cheapestFood * 10) / (r ? 1.1 : 1), 2) + "</span>")
                                    })
                                }

                                insertCSSStyles("#infCalc{font-size:11px;color:#666;margin:0 0 5px;width:577px;text-align:center}#InfCalc_hits,#InfCalc_legend,#InfCalc_booster{padding:4px;text-align:center;width:35px;font-size:11px;margin:0 5px}#infCalc label{margin:0 5px}#InfCalc_NE,#InfCalc_WarStash{margin-left:5px;position:relative;top:2px;text-align:center}.infCalcResults{line-height:0}.infCalcResults span{width:100%;text-align:center;display:block;font:700 12px/15px Arial;color:#595959}.infCalcResults span:nth-child(even){font:400 11px/14px Arial;color:#81827f}.infCalcResults select{margin:2px;font-size:11px;padding:2px 4px;text-align:center;height:23px}.citizen_military_box_wide{width:293px;margin:0 1px 2px}.citizen_military_box_wide .rank_box{right:0}.citizen_military_box_wide .rank_icon{left:7px}.citizen_military_box_wide .regular_rank_img{margin-left:7px}.citizen_military_box_wide .rank_name_holder{width:230px;left:88px}.citizen_military_box .military_box_info{width:85px}.citizen_military_box_wide .top_area{padding:0 15px 0 77px}");
                                var t = angular.element("#str_progress").scope().data;
                                getElementsBySelectorAndApplyCallbackOnThem(".citizen_military_box_wide", e => e.insertAdjacentHTML("afterEnd", '<div class="citizen_military_box infCalcResults"><select></select></div>'))[1].nextSibling.insertAdjacentHTML("afterEnd", '<div id="infCalc" class="citizen_military"><label>Hits <input type="text" id="InfCalc_hits" value="1"></label><label>Natural Enemy <input type="checkbox" id="InfCalc_NE"></label><label title="+10% rank points">War Stash <input type="checkbox" id="InfCalc_WarStash" ' + (t.activePacks.war_stash ? "checked" : "") + '></label><label>Damage Booster<input type="text" id="InfCalc_booster" value="0%"></label><label>Legend Bonus<input type="text" id="InfCalc_legend" value="' + Math.max(100 * t.loggedIn.hovercardData.fighterInfo.military.damagePerHitLegend / t.loggedIn.hovercardData.fighterInfo.military.damagePerHit - 100, 0).toFixed() + '%"></label></div>'), getElementsBySelectorAndApplyCallbackOnThem(".citizen_military_box", e => e.style = "margin:0 1px 2px 1px;width:85px"), localStorageSettings.infCalc = localStorageSettings.infCalc || {
                                    1: {},
                                    2: {},
                                    23: {},
                                    cheapestFood: 0,
                                    selWep: {
                                        0: 7
                                    },
                                    noData: 1
                                };
                                var o = getElementsBySelectorAndApplyCallbackOnThem(".infCalcResults", (t, n) => t.querySelectorAll("select").forEach(function (t) {
                                    for (var i = "", o = 0; o < 8; o++) i += !o || localStorageSettings.infCalc.noData || localStorageSettings.infCalc[n ? 23 : 2][Math.min(o, 7)] ? '<option value="' + (o < 7 ? o : 10) + '" ' + (localStorageSettings.infCalc.selWep[n] == o ? "selected" : "") + ">Q" + o + "</option>" : "";
                                    t.innerHTML = i, t.addEventListener("change", function () {
                                        localStorageSettings.infCalc.selWep[n] = Math.min(this.value, 7), saveSettingsAsStringInLocalStorage(), e()
                                    })
                                }));
                                e(), getElementsBySelectorAndApplyCallbackOnThem("#InfCalc_hits,#InfCalc_legend,#InfCalc_booster", t => t.addEventListener("keyup", e)), getElementsBySelectorAndApplyCallbackOnThem("#InfCalc_NE,#InfCalc_WarStash", t => t.addEventListener("change", e)), localStorageSettings.infCalc.date != CURRENT_INGAME_DAY && updateMarketPictureCachePerCountryIdAndCallHandler(35, function () {
                                    for (var t = 1; t < 4; t++)
                                        for (var n = 1; n < 8; n++) localStorageSettings.infCalc[t < 3 ? t : 23][n] = ((cacheMarketPicturePerCountryId[35][getIndustryNameFromIndustryId(t < 3 ? t : 23)]["q" + n] || [])[1] || {}).gross / (1 == t ? 2 * (n < 7 ? n : 10) : 1);
                                    localStorageSettings.infCalc.cheapestFood = Math.min(999, ...Object.values(localStorageSettings.infCalc[1])), localStorageSettings.infCalc.date = CURRENT_INGAME_DAY, localStorageSettings.infCalc.noData = 0, saveSettingsAsStringInLocalStorage(), e()
                                })
                            }())
                        }) : location.href.includes("economy/marketplace") ? location.href.includes("/offer") ? (localStorageSettings.improveMarketplace || T(), localStorageSettings.autofillMarket || I()) : g("economy/marketplace", function () {
                            localStorageSettings.improveMarketplace || T(), localStorageSettings.autofillMarket || I()
                        }) : location.href.includes("economy/exchange-market") ? (localStorageSettings.autofillGold || function () {
                            function e() {
                                getElementsBySelectorAndApplyCallbackOnThem("button[data-currency=GOLD]", function (e) {
                                    var t = e.previousElementSibling.previousElementSibling;
                                    t.value = Math.min(e.dataset.max, 10, Math.floor(100 * LOCAL_CIITIZEN_DATA.currencyAmount / e.dataset.price) / 100), t.dispatchEvent(new Event("input"))
                                })
                            }

                            insertCSSStyles(".exchange_offers td.ex_citizen{width:200px}.exchange_offers td.ex_buy button{max-width:unset}"), g("exchange/retrieve", e), e()
                        }(), S(".e_cash", "monetary-market/gold/statistics")) : location.href.includes("economy/myCompanies") ? (localStorageSettings.companyManager || function () {
                            insertCSSStyles("#CompanyManager{float:right;display:none}#CompanyManager strong{position:relative;bottom:8px;right:5px;font-size:12px}#CompanyManager span{cursor:pointer;border-radius:3px}#CompanyManager span:hover{opacity:.5}#CompanyManager img{height:30px}#companies_bottom{position:sticky;bottom:0}"), getElementsBySelectorAndApplyCallbackOnThem(".area h4", e => e.insertAdjacentHTML("beforeEnd", '<div id="CompanyManager"><strong>Work as Manager</strong></div>'));
                            var e = document.getElementById("CompanyManager"),
                                t = getElementsBySelectorAndApplyCallbackOnThem(".listing.companies:not(.disabled):not(.cannotWorkAsManager):not(.cannotWorkAsManager-location)", function (t) {
                                    var n = t.querySelector(".area_pic > img"),
                                        i = n.getAttribute("src");
                                    e.querySelector('img[src="' + i + '"]') || e.insertAdjacentHTML("beforeEnd", '<span><img src="' + i + '" title="' + n.title + '"></span>')
                                });
                            e.querySelector("span") && (e.style.display = "block", getElementsBySelectorAndApplyCallbackOnThem("#help_manage", e => e.remove())), getElementsBySelectorAndApplyCallbackOnThem("#CompanyManager span", e => e.addEventListener("click", function (e) {
                                window.pageDetails.recoverable_health.value = food_remaining;
                                var i = getElementsBySelectorAndApplyCallbackOnThem(".owner_work.active").length;
                                t.forEach(function (t) {
                                    t.querySelector('.area_pic > img[src="' + e.target.getAttribute("src") + '"]') && i < Math.floor((globalNS.userInfo.wellness + Math.min(pageDetails.recoverable_health.value, pageDetails.recoverable_health_in_food)) / 10) && t.querySelectorAll(".owner_work").forEach(function (e) {
                                        e.classList.contains("active") || (i++, e.classList.add("active"))
                                    })
                                }), t.forEach(e => calculateProduction(e, !0)), checkHealth(), checkTax(), calculateTotals(), warnForCritical()
                            })), getElementsBySelectorAndApplyCallbackOnThem(".list_group", e => e.style.boxShadow = "none")
                        }(), localStorageSettings.showBestJobOffer || fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/job-market-json/" + LOCAL_CIITIZEN_DATA.countryLocationId + "/1/desc", function (e) {
                            e.jobs && e.jobs[0] && (e.jobs.sort((e, t) => t.netSalary - e.netSalary), getElementsBySelectorAndApplyCallbackOnThem(".employer.fill h4", t => t.insertAdjacentHTML("beforeEnd", '<a href="/' + PLATFORM_LANGUAGE_CODE + "/economy/job-market/" + LOCAL_CIITIZEN_DATA.countryLocationId + '" style="position:absolute;right:21px;">Highest local offer: net ' + e.jobs[0].netSalary + "cc (" + (e.jobs[0].salaryLimit > 0 ? "max  " + reformatNumberStringToDelimitedNumber(e.jobs[0].salaryLimit) + "cc/day" : "no overtime limit") + ")</a>")))
                        }), (X || $) && function () {
                            function e(e) {
                                if (Object.keys(a).length + 1 == o.length || e) {
                                    var i = [],
                                        r = 0,
                                        l = 0;
                                    o.forEach(function (t) {
                                        var n = +t.id.split("_")[1],
                                            o = [];
                                        t.querySelectorAll(".WaMsetupInput").forEach(function (t) {
                                            var n = e ? +t.value : t.checked;
                                            if (n) {
                                                var a = +t.parentElement.id.split("_")[1];
                                                e ? (i.push([a, n]), l += n) : o.push(a), r++
                                            }
                                        }), !e && o.length && i.push([a[n], o])
                                    }), getElementsBySelectorAndApplyCallbackOnThem("#WaMsetup span", t => t.textContent = e ? "Assigned " + l + " employees to " + r + " companies" : "Selected " + r + " companies in " + i.length + " holding(s)"), getElementsBySelectorAndApplyCallbackOnThem("#WaMsetup a", e => e.textContent = r == t.length ? "Deselect all" : "Select all"), e ? localStorageSettings.employeeCompanies = i : localStorage.wamCompaniesLeftToday = JSON.stringify(localStorageSettings.wamCompanies = i), saveSettingsAsStringInLocalStorage()
                                }
                            }

                            insertCSSStyles("#WaMsetup{margin:0 0 -20px;font:200 11px/14px Arial}#WaMsetup span{margin:9px;display:inline-block}input.WaMsetupInput{position:absolute;margin:25px 0}#WaMsetup a{margin:0 5px;padding:5px}"), getElementsBySelectorAndApplyCallbackOnThem(".area h4", e => e.insertAdjacentHTML("afterEnd", '<div id="WaMsetup"><span></span><a class="std_global_btn">AutoFighter WaM Setup</a><a class="std_global_btn">AutoFighter Employee Setup</a></div>'));
                            var t, o = getElementsBySelectorAndApplyCallbackOnThem(".companies_group"),
                                a = {},
                                r = getElementsBySelectorAndApplyCallbackOnThem("#WaMsetup a", (i, s) => i.addEventListener("click", function () {
                                    s || o.forEach(function (t) {
                                        var n = +t.id.split("_")[1];
                                        n && fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/travelData", {
                                            _token: csrfToken,
                                            holdingId: n
                                        }, function (t) {
                                            a[n] = t.preselectRegionId, e(s)
                                        })
                                    }), i.insertAdjacentHTML("afterEnd", '<a class="std_global_btn">Select all</a>'), i.nextSibling.addEventListener("click", function () {
                                        var n = "Select all" == this.textContent;
                                        this.textContent = n ? "Deselect all" : "Select all", s ? t.forEach(e => e.value = n ? e.max : 0) : t.forEach(e => e.checked = n), e(s)
                                    }), getElementsBySelectorAndApplyCallbackOnThem(s ? ".employees_selector" : ".owner_work", function (e) {
                                        var t = +e.parentElement.parentElement.querySelector(".employees_selector").dataset.employee_limit;
                                        e.parentElement.parentElement.insertAdjacentHTML("beforeEnd", '<input class="WaMsetupInput" style="-moz-appearance:' + (s ? "initial;width:30px;left:-35px;text-align:center" : "checkbox;left:-30px") + '" type="' + (s ? "number" : "checkbox") + '" ' + (s ? 'value="0" min="0" max="' + t + '"' : "") + ">")
                                    }), t = getElementsBySelectorAndApplyCallbackOnThem(".WaMsetupInput"), getElementsBySelectorAndApplyCallbackOnThem(".WaMsetupInput", t => t.addEventListener(s ? "input" : "click", () => e(s))), r.forEach(e => e.remove());
                                    var c = [];
                                    if (s)
                                        for (let e of ee) c.push(e);
                                    else
                                        for (let e of settingValueWAMCompanies) c.push(...e[1]);
                                    t.forEach(function (e) {
                                        var t = +e.parentElement.id.split("_")[1];
                                        if (s)
                                            for (let n of c) n[0] == t && (e.value = n[1]);
                                        else e.checked = c.includes(t)
                                    }), e(s)
                                }))
                        }()) : location.href.includes("economy/inventory") && !localStorageSettings.improveInventory ? function () {
                            function a() {
                                p.inputs.quantity = u[0].value;
                                var e = p.settings.countries[p.inputs.selectedCountry].taxes[p.inputs.selectedIndustry],
                                    t = p.inputs.pricePerUnit / ((100 + (e.valueAddedTax + (p.inputs.selectedCountry != LOCAL_CIITIZEN_DATA.country ? e.importTax : 0))) / 100),
                                    i = t * p.inputs.quantity;
                                getElementsBySelectorAndApplyCallbackOnThem("#TaxPerUnit", e => e.innerHTML = (p.inputs.pricePerUnit - t).toFixed(4)), getElementsBySelectorAndApplyCallbackOnThem("#Net_unit", e => e.innerHTML = t.toFixed(4)), getElementsBySelectorAndApplyCallbackOnThem("#Total_net", e => e.innerHTML = '<strong style="top:39px;left:410px">Total Net</strong><b style="top:46px;right:250px">' + reformatNumberStringToDelimitedNumber(i.toFixed(2)) + " " + LOCAL_CIITIZEN_DATA.currency + '</b><small style="top:70px;right:250px;left:auto;width:auto">' + reformatNumberStringToDelimitedNumber((i / localStorageSettings.goldPrice.price).toFixed(2)) + " g</small>")
                            }

                            function r() {
                                document.getElementById("totalFoodHP").innerHTML = "Total food: " + reformatNumberStringToDelimitedNumber(f[0] + f[1]) + "HP"
                            }

                            function s() {
                                u.forEach(function (e) {
                                    e.value = (itemAmounts[p.inputs.selectedIndustry] || {})[p.inputs.selectedQuality] || 0, e.dispatchEvent(new Event("input"))
                                }), getElementsBySelectorAndApplyCallbackOnThem("#marketOffers tr", function (e) {
                                    p.inputs.selectedIndustry == e.dataset.industry_id && p.inputs.selectedQuality == e.dataset.quality && (p.inputs.selectedCountry = e.dataset.country_id, p.$apply(), getElementsBySelectorAndApplyCallbackOnThem(".offers_price input", function (t) {
                                        t.value = e.querySelector(".offer_price strong").textContent, t.dispatchEvent(new Event("input"))
                                    }))
                                })
                            }

                            function c(e, n) {
                                buildPostFormBody(e.items[n].items, function (e, t) {
                                    itemAmounts[t.industryId] = itemAmounts[t.industryId] || {}, itemAmounts[t.industryId][t.quality] = t.used ? t.amount - 1 : t.amount
                                })
                            }

                            insertCSSStyles("#Total_netF,.Total_net,.offer_price{text-align:right}#Total_netF span,.Total_net span,.offer_price span{margin-right:1px;font-size:11px}#Total_net *{position:absolute}tfoot tr{background:#f7fcff}#totalFoodHP{float:right;margin:5px 30px 0;color:#656565}#inventory_overview #sell_offers table td:last-child{padding-left:0}#inventory_overview #sell_offers table .delete_offer{opacity:1}"), localStorageSettings.goldPrice = localStorageSettings.goldPrice || {}, localStorageSettings.goldPrice.date != CURRENT_INGAME_DAY && fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/exchange/retrieve/", {
                                _token: csrfToken,
                                page: 1,
                                currencyId: 62
                            }, function (e) {
                                localStorageSettings.goldPrice.price = JSON.stringify(e).split("data-price='")[1].split("'")[0], localStorageSettings.goldPrice.date = CURRENT_INGAME_DAY, saveSettingsAsStringInLocalStorage()
                            });
                            var p = angular.element("#sell_offers").scope(),
                                u = getElementsBySelectorAndApplyCallbackOnThem(".offers_quantity input", e => e.setAttribute("maxlength", 9)),
                                f = [0, 0];
                            getElementsBySelectorAndApplyCallbackOnThem("#sell_offers", function (e) {
                                e.addEventListener("input", a), e.addEventListener("click", function (e) {
                                    e.target.matches(".sell_selector *") && s(), a()
                                })
                            }), getElementsBySelectorAndApplyCallbackOnThem(".area.storage h4:first-child strong", function (e) {
                                e.insertAdjacentHTML("beforeEnd", ' <q id="freeSpace"></q>'), e.insertAdjacentHTML("afterEnd", '<span id="totalFoodHP"></span>')
                            }), e.push(function (e, t) {
                                if (t.includes("inventory-items")) {
                                    var i = angular.element("#inventoryItems").scope().inventory;
                                    f[0] = assumption_getAmountOfAvailableEnergyFromFoodInInventory(e), itemAmounts = {}, c(i, "finalProducts"), c(i, "rawMaterials"), document.getElementById("freeSpace").innerHTML = "Free space: " + reformatNumberStringToDelimitedNumber(i.status.totalStorage - i.status.usedStorage), r(), s(), a()
                                }
                                if (t.includes("myMarketOffers") && (getElementsBySelectorAndApplyCallbackOnThem("#sell_offers th", function (e, t) {
                                    e.style.width = (t ? 1 == t ? 80 : 2 == t ? 140 : 3 == t ? 60 : 132 : 70) + "px", 4 == t && e.querySelectorAll("a").forEach(e => e.style = "left:10px;margin-right:20px;padding:0 10px")
                                }), getElementsBySelectorAndApplyCallbackOnThem(".relative", function (e, t) {
                                    t || (e.querySelectorAll("span.ng-binding").forEach(e => e.style.display = "none"), e.style.left = "35px", e.querySelectorAll("small").forEach(function (e) {
                                        e.style = "text-align:right;top:30px;left:-50px", e.insertAdjacentHTML("beforeEnd", '<br><span>Tax / unit: </span><span id="TaxPerUnit"></span><br><span>Net / unit: </span><span id="Net_unit"></span><br>')
                                    }))
                                }), getElementsBySelectorAndApplyCallbackOnThem("#sell_offers table", e => e.insertAdjacentHTML("beforeEnd", '<tfoot><tr><td colspan="3"><td id="Total_netF"></td><td colspan="2"></td></tr></tfoot>')), getElementsBySelectorAndApplyCallbackOnThem(".offers_price", e => e.insertAdjacentHTML("afterEnd", '<th id="Total_net"></th>')), a()), /marketplaceActions|myMarketOffers/.test(t)) {
                                    getElementsBySelectorAndApplyCallbackOnThem(".Total_net,.offer_price span", e => e.remove());
                                    var l = 0;
                                    f[1] = 0, getElementsBySelectorAndApplyCallbackOnThem("#marketOffers tr", function (e) {
                                        var t = p.settings.countries[e.dataset.country_id].taxes[e.dataset.industry_id],
                                            n = e.querySelector(".offer_price strong").textContent / ((100 + (t.valueAddedTax + (e.dataset.country_id != LOCAL_CIITIZEN_DATA.country ? t.importTax : 0))) / 100),
                                            i = n * e.dataset.amount;
                                        l += i, e.querySelectorAll(".offer_price").forEach(function (e) {
                                            e.insertAdjacentHTML("beforeEnd", "<span><br>Net: " + n.toFixed(4) + " " + LOCAL_CIITIZEN_DATA.currency + "</span>"), e.insertAdjacentHTML("afterEnd", '<td class="Total_net"><strong>' + reformatNumberStringToDelimitedNumber(i.toFixed(2)) + "</strong> " + LOCAL_CIITIZEN_DATA.currency + "<br><span>" + reformatNumberStringToDelimitedNumber((i / localStorageSettings.goldPrice.price).toFixed(2)) + " g</span></td>")
                                        }), 1 == e.dataset.industry_id && (f[1] += e.dataset.amount * (e.dataset.quality < 7 ? 2 * e.dataset.quality : 20))
                                    }), r(), document.getElementById("Total_netF").innerHTML = "<strong>" + reformatNumberStringToDelimitedNumber(l.toFixed(2)) + "</strong> " + LOCAL_CIITIZEN_DATA.currency + "<br><span>" + reformatNumberStringToDelimitedNumber((l / localStorageSettings.goldPrice.price).toFixed(2)) + " g</span>"
                                }
                            })
                        }() : location.href.includes("/article/") && location.hash.includes("comment") ? (me = !1, e.push(function (e, t) {
                            t.includes("articleComments") && !me && (document.getElementById(location.hash.split("#")[1]) ? (location.hash = location.hash, setTimeout(function () {
                                location.hash = location.hash
                            }, 500), me = !0) : getElementsBySelectorAndApplyCallbackOnThem(".load-more-comments", e => e.click()))
                        })) : location.href.includes("economy/job-market") ? g("job-market-json", function () {
                            document.getElementById("erepDE") || (insertCSSStyles("#erepDE{color:#83b70b;float:right;margin:0 70px 0 10px}#erepDE:hover{color:#fb7e3d}#erepDE span{color:#42a5f5}.netSalary{font-size:11px}.bestNet{color:#83b70b!important}.travelToMarket{position:absolute;top:10px;right:220px}"), getElementsBySelectorAndApplyCallbackOnThem("#job_market h1", e => e.insertAdjacentHTML("beforeEnd", '<a id="erepDE" href="//erepublik.tools/en/marketplace/jobs/0/offers">eRepublik<span>.tools</span></a>'))), getElementsBySelectorAndApplyCallbackOnThem(".netSalary,.travelToMarket", e => e.remove()), getElementsBySelectorAndApplyCallbackOnThem(".bestNet", e => e.classList.remove("bestNet"));
                            var e = [0];
                            getElementsBySelectorAndApplyCallbackOnThem(".salary_sorted tr", function (t) {
                                var n = angular.element(t).scope().job;
                                t.getElementsByClassName("jm_salary")[0].insertAdjacentHTML("beforeEnd", '<span class="stprice netSalary"><br>' + (n.salaryLimit > 0 ? "Max  " + reformatNumberStringToDelimitedNumber(n.salaryLimit) + "cc/day" : "No overtime limit") + "</span>"), n.netSalary > e[0] && (e = [n.netSalary, t])
                            }), e[1] && e[1].querySelector(".jm_net_salary").classList.add("bestNet");
                            var t = angular.element("#job_market").scope();
                            t.data.isFromThisCountry || A("#job_market h1", t.settings.currentCountryId)
                        }) : location.href.includes("tokens-market") && (S("#marketplace", "game-token/statistics/price"), localStorageSettings.autofillMarket || g("economy/gameTokensMarketAjax", function () {
                            getElementsBySelectorAndApplyCallbackOnThem(".quantity_button.maximum", e => e.click())
                        }));
                        var me;
                        IS_MILITARY_CAMPAIGNS_PAGE || localStorageSettings.playerTooltip || function () {
                            function a(e, t) {
                                return '<span style="background:' + (t ? "#83B70B" : "red") + ';padding:0 2px;border-radius:1px;font-weight:700;margin:0 1px">' + e + "</span>"
                            }

                            function l(e, t) {
                                var n = e.location,
                                    i = n[t ? "residenceCountry" : "citizenshipCountry"],
                                    o = i.name + (t ? ", " + n.residenceRegion.name : "");
                                return '<br><img src="//www.erepublik.net/images/flags_png/S/' + i.permalink + '.png">' + (t && o.length > 44 ? o.substring(0, 42) + "…" : o) + (t ? '<span style="font-family:Icons;color:' + (e.city.residenceCityId ? e.city.residenceCity.region_id == n.residenceRegion.id ? "#83B70B" : "#FB7E3D" : "#009cff") + '">&nbsp;&nbsp;</span>' : "")
                            }

                            function c(e) {
                                return '<div style="background:#83B70B;padding:0 2px;border-radius:1px;color:#fff;margin:0 0 2px;font-weight:700;width:19px">' + e + "</div>"
                            }

                            function d(e, t) {
                                var n = e.military.militaryData[t ? "ground" : "aircraft"],
                                    i = !e.citizen.is_organization && e.loggedIn.hovercardData.fighterInfo;
                                return '<div><img src="' + n.icon + '"><div><b style="width:83%;background:linear-gradient(to right,#009cff 0%,#009cff ' + n.progress + "%,#000 " + (n.progress + .1) + '%,#000 100%);display:block;margin:0 0 -15px 30px">' + (t && n.rankNumber > 69 ? "Legend" + n.name.split("Battalion")[1] : n.name) + '<span style=""></span></b><br><brown>' + (e.citizen.is_organization ? "" : t ? "Q7 hit: " + reformatNumberStringToDelimitedNumber(i.military.damagePerHit) + (i.military.damagePerHitLegend > 0 ? " (TP " + reformatNumberStringToDelimitedNumber(i.military.damagePerHitLegend) + ")" : "") : "Q0 hit: " + reformatNumberStringToDelimitedNumber(i.aviation.damagePerHitNoWeapon)) + "</brown></div></div>"
                            }

                            function p(e, t, n) {
                                var i = n ? e.partyData : e.military.militaryUnit;
                                return "<div>" + (i ? '<img src="' + i.avatar + '" style="background:#fff">' : "") + "<div><b>" + (n ? e.isPresident ? "Country President" : e.title.country ? e.title.country : e.isCongressman ? "Congressman" : e.isPartyPresident ? "Party President" : i ? "Member" : "No political activity" : i && i.leader_id == t ? "Commander" : !i || i.second_commander_1 != t && i.second_commander_2 != t ? i && JSON.stringify(i.leaders).includes(t) ? "Captain" : i ? "Soldier" : "" : "Second Commander") + "</b><br><brown>" + (i ? i.name : "No " + (n ? "political party" : "military unit")) + "</brown></div></div>"
                            }

                            function u(e, n, i, o) {
                                var r = "";
                                buildPostFormBody(e.achievements, function (e, t) {
                                    r += /hardworker|supersoldier/.test(t.img) ? "" : '<div style="width:23px;display:inline-block;text-shadow:none"><img src="//www.erepublik.net/images/achievements/icon_' + t.img + (t.count ? "_on" : "_off") + '.gif" style="width:25px;margin:0 0 -5px 0"><span style="float:left;width:25px">' + (t.count > 9999 ? Math.floor(t.count / 1e3) + "k" : t.count) + "</span></div>"
                                });
                                var s = e.citizen,
                                    u = s.name.toString(),
                                    f = e.activePacks,
                                    g = e.citizenAttributes.experience_points % 5e3 / 5e3 * 100,
                                    m = s.level > 69 && s.nextLevelXp - e.citizenAttributes.experience_points < 500 ? "#FB7E3D" : "#83B70B";
                                fe.innerHTML = i.orgTitle = '<div id="eRStooltip"><div style="background:rgb(30,30,30);height:84px"><img src="' + s.avatar + '" style="float:left;width:84px;height:84px;margin:0 2px 0 0;background:#fff;border-radius:5px 0 0 0"><b style="background:linear-gradient(to right,' + m + " 0%," + m + " " + g + "%,rgb(80,80,80) " + (g + .1) + '%,rgb(80,80,80) 100%)">' + s.level + "</b><b" + (e.isDictator ? ' style="background:rgb(204,60,0)"' : "") + ">" + (u.length < 22 ? u : u.substring(0, 20) + "…") + "</b>" + (s.onlineStatus ? '<span style="background:#83B70B;border-radius:10px;height:12px;width:12px;display:inline-block;margin:0 5px -1px;border:1px solid;box-shadow:0 0 3px"></span>' : "") + "<br>" + (s.is_organization ? a("Organization", 1) : "") + (e.friends.isFriend ? a("Friend", 1) : "") + (s.is_alive ? "" : a("Dead")) + ("Permanently" == s.banStatus.type ? a("Permaban") : s.banStatus.type ? a("Tempban") : "") + (localStorageSettings.contributors && localStorageSettings.contributors.includes(+n) ? a("Stuff++ contributor", 1) : "") + (e.isModerator ? a("Mod") : "") + "<br><brown>" + (s.is_organization ? "Created at: " + s.created_at : "eR birthday: " + e.loggedIn.hovercardData.born_on) + "</brown>" + l(e) + l(e, 1) + '</div><div style="position:absolute;top:2px;right:5px;text-align:center;width:20px">' + (f.power_pack ? c("PP") : "") + (f.infantry_kit ? c("IK") : "") + (f.division_switch_pack ? c("MP") : "") + (CITIZEN_ID_ZORDACZ && localStorageSettings.l[s.id] ? c("AF") : "") + '</div><div style="background:rgb(50,50,50);padding:0 5px;height:63px"><div>' + d(e, 1) + d(e) + "</div><div>" + p(e, n, 1) + p(e, n) + '</div></div><div style="height:47px;background:#fff;color:#5a5a5a;border-radius:0 0 5px 5px;text-align:center;font:9px/14px Arial">' + r + "</div></div>", o()
                            }

                            function f() {
                                getElementsBySelectorAndApplyCallbackOnThem('#content a[href*="zen/pro"]:not(.eRStooltipAdded)', function (e) {
                                    e.classList.add("eRStooltipAdded"), s(e, "ns", function (t) {
                                        var n, i = e.href.split("profile/")[1];
                                        return g[i] ? u(g[i], i, e, t) : n = setTimeout(() => fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/citizen-profile-json/" + i, function (n) {
                                            g[i] = n, u(g[i], i, e, t)
                                        }), 300), e.addEventListener("mouseleave", () => clearTimeout(n)), e.orgTitle || "Loading data..."
                                    })
                                })
                            }

                            insertCSSStyles(".citizen_activity a,.pic.tipsyElement a,.user-cmnt-avatar a{display:block}#eRStooltip{color:#fff;width:400px;font:11px/15px Arial;text-shadow:0 0 2px #000;text-align:left;margin:-7px;border:2px solid #000;border-radius:6px;box-shadow:0 0 5px #000}#eRStooltip>div>b{font:700 17px/20px Tahoma;border-radius:1px;padding:1px 2px;margin:0 1px 2px;display:inline-block}#eRStooltip>div>img:not(:first-child){margin:0 2px -4px 1px;width:14px}#eRStooltip>div:not(:last-child)>div{width:50%;float:left}#eRStooltip>div>div>div{height:30px;width:100%;float:left;margin:1px 0;overflow:hidden}#eRStooltip>div>div>div>img{width:30px;height:30px;float:left;margin:0 5px 0 0}#eRStooltip brown{color:#c3bb8c}"), angular.element("body").injector().get("hovercardDirective")[0].restrict = "E", getElementsBySelectorAndApplyCallbackOnThem("[hovercard]", e => angular.element(e).scope().getCitizenData = (() => {
                            })), getElementsBySelectorAndApplyCallbackOnThem("hovercard-details", e => e.remove());
                            var g = {};
                            f(), IS_ON_HOMEPAGE || ACTIVE_BATTLE_ID || location.href.includes("/article/") ? setInterval(f, 1e3) : e.push(() => setTimeout(f, 500))
                        }(), localStorageSettings.autoFighter || function () {
                            var e = getSettingValue("preferCountries").split(",").map(Number),
                                n = getSettingValue("avoidCountries").split(",").map(Number),
                                i = !1;
                            for (let e of ["battlefield", "autoBot", "energyRecovery", "autoLogin"]) localStorageSettings[e] && (localStorageSettings[e] = !1, i = !0);
                            i && (saveSettingsAsStringInLocalStorage(), h("AutoFighter requires the following Stuff++ options:<br>-Improved battlefield<br>-AutoBot<br>-Automatic energy recovery<br>-Automatic login<br><br>They have been enabled for you."), addEventListener("click", () => location.reload())), parent.location.href.includes("A/u/t/o/F/i/g/h/t/e/r") && setTimeout(function () {
                                function i(i, o) {
                                    o.length > 1 && o.push("any"), o = o.filter((e, t, n) => n.indexOf(e) == t && "none" != e && (!LOCAL_CIITIZEN_DATA.dailyOrderDone || "DO" != e));
                                    var r = {},
                                        l = LOCAL_CIITIZEN_DATA.countryLocationId;
                                    for (let e of o) r[e] = [
                                        [],
                                        []
                                    ];
                                    buildPostFormBody(i, function (i, s) {
                                        if (!s.is_dict && !s.is_lib) {
                                            var c = s.inv,
                                                d = s.def,
                                                p = c.id,
                                                u = d.id,
                                                f = s.is_rw && d.id == l || !s.is_rw && (c.id == l || c.ally_list.map(e => e.deployed ? e.id : 0).includes(l)),
                                                g = s.is_rw && d.id == l || !s.is_rw && (d.id == l || d.ally_list.map(e => e.deployed ? e.id : 0).includes(l)),
                                                m = !n.includes(p),
                                                h = !n.includes(u),
                                                b = f && m,
                                                v = g && h,
                                                y = e.includes(p) ? p : e.includes(u) ? u : m ? p : h ? u : 0,
                                                x = y && (p == y && f || u == y && g) ? y : 0;
                                            if (y && buildPostFormBody(s.div, function (e, t) {
                                                var n = 11 == t.div,
                                                    i = t.div == LOCAL_CITIZEN_DATA_DIVISION;
                                                if (!t.end && !t.terrain && (b || v) && (n || HAS_MAVERICK || i) && ("both" == J || "ground" == J && !n || "air" == J && n))
                                                    for (let n of o) {
                                                        let o = a[n](s, f, g, p, u, !1, t);
                                                        if (o > -1 && r[n][0][i ? "unshift" : "push"]([s.id, e, "epic" == n ? b && p == LOCAL_CIITIZEN_DATA.country ? p : v && u == LOCAL_CIITIZEN_DATA.country ? u : x : n.includes("TP") ? LOCAL_CIITIZEN_DATA.country : o > 0 ? o : x]), Q && !n.includes("NoTravel")) {
                                                            let i = a[n](s, f, g, p, u, !0, t);
                                                            i > -1 && r[n][1].push([s.id, e, "epic" == n ? m && p == LOCAL_CIITIZEN_DATA.country ? p : h && u == LOCAL_CIITIZEN_DATA.country ? u : y : n.includes("TP") ? LOCAL_CIITIZEN_DATA.country : i > 0 ? i : y])
                                                        }
                                                    }
                                            }), r[o[0]][0].length) return !1
                                        }
                                    });
                                    for (let e of o) {
                                        var s = r[e][0].concat(r[e][1])[0];
                                        if (s) {
                                            h = !0, localStorage.afKills = "DO" == e ? 25 : "epic" == e && Z ? -1 : getSettingValue("maxKills"), travelToBattlefieldByBattleIdAndZoneId(...s);
                                            break
                                        }
                                    }
                                }

                                var o, a = {
                                    epic: (e, t, n, i, o, a, r) => 2 == r.epic ? 0 : -1,
                                    DO: function (e, t, n, i, o, a) {
                                        var r = LOCAL_CIITIZEN_DATA.dailyOrders;
                                        if (r)
                                            for (let l of r)
                                                if (l.battleId == e.id && (t && l.sideCountryId == i || n && l.sideCountryId == o || a)) return l.sideCountryId;
                                        return -1
                                    },
                                    TP: (e, t, n, i, o, a) => +(o == LOCAL_CIITIZEN_DATA.country && (n || a) || i == LOCAL_CIITIZEN_DATA.country && (t || a)) - 1,
                                    TPrw: (e, t, n, i, o, a) => +((o == LOCAL_CIITIZEN_DATA.country && (n || a) || i == LOCAL_CIITIZEN_DATA.country && (t || a)) && e.is_rw) - 1,
                                    TPdirect: (e, t, n, i, o, a) => +((o == LOCAL_CIITIZEN_DATA.country && (n || a) || i == LOCAL_CIITIZEN_DATA.country && (t || a)) && !e.is_rw) - 1,
                                    anyNoTravel: (e, t, n) => +(n || t) - 1,
                                    anyNoTravelAir: (e, t, n, i, o, a, r) => +((n || t) && 11 == r.div) - 1,
                                    anyNoTravelGround: (e, t, n, i, o, a, r) => +((n || t) && 11 != r.div) - 1,
                                    anyAir: (e, t, n, i, o, a, r) => +(11 == r.div) - 1,
                                    anyGround: (e, t, n, i, o, a, r) => +(11 != r.div) - 1,
                                    RW: (e, t, n, i, o, a, r) => +e.is_rw - 1,
                                    any: () => 0
                                };
                                if (setTimeout(() => location.href = "/" + PLATFORM_LANGUAGE_CODE + "/military/campaigns", 60 * (ACTIVE_BATTLE_ID ? 15 : 5) * 1e3), top.lastCheck = Date.now(), IS_MILITARY_CAMPAIGNS_PAGE) {
                                    var availableEnergy = globalNS.userInfo.wellness + food_remaining;
                                    LOCAL_CIITIZEN_DATA.dailyTasksDone && !LOCAL_CIITIZEN_DATA.hasReward &&
                                    fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/daily-tasks-reward", {
                                        _token: csrfToken
                                    }),
                                    getSettingValue("collectWcRewards") && localStorage.afKills &&
                                    fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/weekly-challenge-collect-all", {
                                        _token: csrfToken
                                    }),
                                        localStorage.removeItem("afKills"),
                                    LOCAL_CIITIZEN_DATA.dailyOrderDone && !LOCAL_CIITIZEN_DATA.hasDailyOrderReward &&
                                    fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/military/group-missions", {
                                        action: "check",
                                        _token: csrfToken
                                    });
                                    var currentHour = parseInt(document.getElementById("live_time").textContent);
                                    if (availableEnergy > 50 && Math.abs((localStorage.workTrainLastAttempt || -9) - currentHour) > 1) {
                                        var settingWork = getSettingValue("work"),
                                            settingWorkOvertime = getSettingValue("workOvertime");
                                        localStorage.workTrainLastAttempt = currentHour.toString(), !LOCAL_CIITIZEN_DATA.dailyTasksDone && getSettingValue("train") &&
                                        (
                                            fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/training-grounds-json", function (e) {
                                                var body = {
                                                    _token: csrfToken
                                                };
                                                for (let n = 0; n < e.grounds.length; n++) body["grounds[" + n + "][id]"] = e.grounds[n].id, body["grounds[" + n + "][train]"] = 1;
                                                fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/train", body)
                                            }),
                                                availableEnergy -= 40
                                        ),
                                        (settingWork || settingWorkOvertime) &&
                                        (
                                            fetchUrlAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/job-data", function (response) {
                                                settingWork && !response.alreadyWorked ? fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/work", {
                                                    _token: csrfToken,
                                                    action_type: "work"
                                                }) : settingWorkOvertime && 1e3 * response.overTime.nextOverTime - Date.now() < 0 && response.overTime.points > 23 &&
                                                    fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/workOvertime", {
                                                        _token: csrfToken,
                                                        action_type: "workOvertime"
                                                    })
                                            }),
                                                availableEnergy -= 10
                                        )
                                    }
                                    if (getSettingValue("buyMMgold") && CURRENT_INGAME_DAY != localStorage.boughtGoldDay)
                                        fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/exchange/retrieve/", {
                                            _token: csrfToken,
                                            personalOffers: 0,
                                            page: 0,
                                            currencyId: 62
                                        }, function (e) {
                                            localStorage.boughtGoldDay = CURRENT_INGAME_DAY;
                                            var t = e.buy_mode.split("purchase_"),
                                                n = [];
                                            for (let e = 1; e < t.length; e++) {
                                                let i = t[e];
                                                parseInt(i.split("data-max='")[1]) >= 10 && n.push(parseInt(i))
                                            }
                                            !function e() {
                                                fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/exchange/purchase/", {
                                                    _token: csrfToken,
                                                    offerId: n.shift(),
                                                    amount: 10,
                                                    page: 0,
                                                    currencyId: 62
                                                }, function (t) {
                                                    /does not exist|more than the offered/.test(t.message) && n.length && setTimeout(e, 2e3)
                                                })
                                            }()
                                        });
                                    else if ((CITIZEN_ID_ZORDACZ && 0 !== navigator.maxTouchPoints && currentHour > 15 || !CITIZEN_ID_ZORDACZ) && X && listWAMCompaniesLeftToday.length && +localStorage.getItem("wamAttempt") < settingValueWAMCompanies.length + 2) {
                                        var u = listWAMCompaniesLeftToday.pop();
                                        if (availableEnergy >= Math.min(10 * u[1].length, 2 * reset_health_to_recover - 10)) {
                                            var f = localStorage.wamAttempt = +localStorage.getItem("wamAttempt") + 1,
                                                g = u[1];
                                            let e = {
                                                action_type: "production",
                                                _token: csrfToken
                                            };
                                            for (let t = 0; t < g.length; t++) e["companies[" + t + "][id]"] = g[t], e["companies[" + t + "][employee_works]"] = 0, e["companies[" + t + "][own_work]"] = 1;
                                            setTimeout(() => y(0, u[0], 0, 0, function () {
                                                setTimeout(() => fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/work", e, function (e) {
                                                    var t = e.status && e.message || "already_worked" == e.message;
                                                    if (t && (localStorage.wamCompaniesLeftToday = JSON.stringify(listWAMCompaniesLeftToday)), CITIZEN_ID_ZORDACZ) {
                                                        var n = (t ? "WORKED SUCCESSFULLY" : JSON.stringify(e).substring(0, 500)) + (f > 1 ? "<br>Attempts: " + f : "");
                                                        localStorage.waMLog = n, top.document.getElementById("status").innerHTML = '<div style="background:' + (t ? "#83B70B" : "red") + '">' + n + "</div>"
                                                    }
                                                    location.href = "/" + PLATFORM_LANGUAGE_CODE + "/military/campaigns"
                                                }), 3e3)
                                            }), 3e3)
                                        }
                                    } else if ($ && ee.length && CURRENT_INGAME_DAY != localStorage.assignedEmployeesDay) {
                                        localStorage.assignedEmployeesDay = CURRENT_INGAME_DAY;
                                        let e = {
                                            action_type: "production",
                                            _token: csrfToken
                                        };
                                        for (let t = 0; t < ee.length; t++) {
                                            let n = ee[t];
                                            e["companies[" + t + "][id]"] = n[0], e["companies[" + t + "][employee_works]"] = n[1], e["companies[" + t + "][own_work]"] = 0
                                        }
                                        setTimeout(() => fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/economy/work", e), 3e3)
                                    } else {
                                        var h = !1,
                                            b = battleListingScope.campaigns.list;
                                        availableEnergy >= reset_health_to_recover * getSettingValue("energyRatio") && +getSettingValue("maxKills") > 0 ? i(b, K) : availableEnergy > 499 && Z && K.includes("epic") && i(b, ["epic"]), !h && getSettingValue("returnToResidence") && LOCAL_CITIZEN_DATA_RESIDENCE.hasResidence && LOCAL_CIITIZEN_DATA.regionLocationId != LOCAL_CITIZEN_DATA_RESIDENCE.regionId && setTimeout(() => y(LOCAL_CITIZEN_DATA_RESIDENCE.countryId, LOCAL_CITIZEN_DATA_RESIDENCE.regionId, 0, 0, () => {
                                        }), 3e4)
                                    }
                                } else ACTIVE_BATTLE_ID && (SERVER_DATA.webDeployEnabled && fetchFormPostCallsAndReturnContentRawOrAsJson("/" + PLATFORM_LANGUAGE_CODE + "/main/profile-update", {
                                    action: "options",
                                    params: '{"optionName":"enable_web_deploy","optionValue":"' + (o ? "on" : "off") + '"}',
                                    _token: csrfToken
                                }), U && !SERVER_DATA.onAirforceBattlefield && currentWeaponId != U ? selectWeapon(U) : G && SERVER_DATA.onAirforceBattlefield && currentWeaponId != G && selectWeapon(G), setTimeout(function () {
                                    var e = +localStorage.afKills;
                                    e < 0 ? (document.getElementById("stopNoEpic").checked = !0, Z && document.getElementById("allin").click()) : globalNS.userInfo.wellness > reset_health_to_recover && (document.getElementById("allin").click(), setInterval(function () {
                                        globalNS.userInfo.wellness < reset_health_to_recover && location.reload()
                                    }, 2e3)), document.getElementById("kills").value = e < 0 ? getSettingValue("maxKills") : e;
                                    var t = document.getElementById("AutoBotSwitch");
                                    t.click(), setInterval(function () {
                                        "AUTOBOT ON" != t.textContent && setTimeout(function () {
                                            getSettingValue("returnToResidence") && LOCAL_CITIZEN_DATA_RESIDENCE.hasResidence && LOCAL_CIITIZEN_DATA.regionLocationId != LOCAL_CITIZEN_DATA_RESIDENCE.regionId ? setTimeout(() => y(LOCAL_CITIZEN_DATA_RESIDENCE.countryId, LOCAL_CITIZEN_DATA_RESIDENCE.regionId, 0, 0, () => location.href = "/" + PLATFORM_LANGUAGE_CODE + "/military/campaigns"), 3e3) : location.href = "/" + PLATFORM_LANGUAGE_CODE + "/military/campaigns"
                                        }, e < 0 ? 12e4 : 0)
                                    }, 2e3)
                                }, 3e3))
                            }, 5e3)
                        }(), getElementsBySelectorAndApplyCallbackOnThem('#menu5 li a[href*="elections"]', function (e) {
                            var t = +document.querySelector(".date").textContent.split(" ")[1];
                            e.href = "/" + PLATFORM_LANGUAGE_CODE + "/main/" + (t > 4 && t < 15 ? "presidential" : t > 14 && t < 25 ? "party" : "congress") + "-elections"
                        })
                    }
                }
        })
    }
}();
