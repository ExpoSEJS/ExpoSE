/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Request from '../Network/NetworkRequest';

export default {

    connectAjax: function(NoQuery, networkState) {
        NoQuery.ajax = function(info) {

            let localRequest;

            if (typeof info === 'string') {
                localRequest = new Request(info, argument[1].data);
            } else {
                localRequest = new Request(info.url, info.data);
            }

            networkState.handleRequest(localRequest, info.success);
        };
    },

    setup: function() {
        let NoQuery = function() {
            return {
                html: function() {
                    return 'html';
                },
                submit: function(fn) {
                    return NoQuery;
                },
                val: function() {
                    return 'val';
                },
                click: NoQuery,
                keyup: NoQuery,
                css: NoQuery,
                attr: NoQuery,
                animate: function(detail, r, cb) {
                    if (cb) {
                        cb();
                    }
                    return NoQuery;
                },
                keydown: NoQuery,
                ajaxError: NoQuery,
                mouseout: NoQuery,
                mouseover: NoQuery,
                focus: NoQuery,
                select: NoQuery,
                fadeIn: function(speed, cb) {
                    if (cb) {
                        cb();
                    }
                    return NoQuery;
                },
                fadeOut: function(speed, cb) {
                    if (cb) {
                        cb();
                    }
                    return NoQuery;
                }
            };
        }

        NoQuery.trim = function(v) {
            return v.trim();
        };

        NoQuery.inArray = function(v, a) {
            return a.indexOf(v);
        };

        global.$ = NoQuery;
        global.jQuery = NoQuery;
    }
};
