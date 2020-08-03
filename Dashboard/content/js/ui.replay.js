
// @copyright
//   © 2016-2017 Jarosław Foksa

"use strict";

{
  // html helper taken from xel source as it is no longer exposed
  let templateElement = document.createElement("template");
  let html = (strings, ...expressions) => {
    let parts = [];

    for (let i = 0; i < strings.length; i += 1) {
      parts.push(strings[i]);
      if (expressions[i] !== undefined) parts.push(expressions[i]);
    }

    let innerHTML = parts.join("");
    templateElement.innerHTML = innerHTML;
    let fragment = document.importNode(templateElement.content, true);

    if (fragment.children.length === 1) {
      return fragment.firstElementChild;
    }
    else {
      return fragment;
    }
  };

  let shadowTemplate = html`
    <template>
      <link rel="stylesheet" href="node_modules/xel/themes/material.css" data-vulcanize>

      <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
      
      <!-- Insert this line after script imports -->
      <script>if (window.module) module = window.module;</script>

      <link rel="stylesheet" href="css/eui.css">
      <link rel="stylesheet" href="css/table.css">

      <main>
               <div class="replay-out">
                     <div id="output_pane" class="table-out table-responsive-vertical shadow-z-1">
                        <table class="table table-hover table-mc-light-blue">
                        <thead>
                           <tr>
                              <th>Output</th>
                           </tr>
                        </thead>
                        <tbody id="output_body">
                        </tbody>
                        </table>
                    </div> </div>
      </main>
    </template>
  `;

  class XelDemoElement extends HTMLElement {
    static get observedAttributes() {
      return ["name"];
    }

    constructor() {
      super();

      this._shadowRoot = this.attachShadow({mode: "closed"});
      this._shadowRoot.append(document.importNode(shadowTemplate.content, true));

      for (let element of this._shadowRoot.querySelectorAll("[id]")) {
        this["#" + element.id] = element;
      }

      const replay = require('./js/replay');
      const cwindow = require('electron').remote.getCurrentWindow();
      replay(this, cwindow.replayFile, cwindow.replayInput);
    }

    setPage(elem) {
      this.views.forEach(view => this.hide(view));
      this.show(elem);
    }

    _onClickRun(event) {
      runner.runExpoSE(this);
    }


    attributeChangedCallback(name) {
      if (name === "name") {
        this._update();
      }
    }

    _onHideNavButtonClick(event) {
      if (event.button === 0) {
        this._hideSidebar();
      }
    }

    _onShowNavButtonClick(event) {
      if (event.button === 0) {
        this._showSidebar();
      }
    }

    show(elem) {
      elem.classList.remove('hidden');
    }

    hide(elem) {
      elem.classList.add('hidden');
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    _showSidebar() {
      return new Promise(async (resolve) => {
        this["#sidebar"].hidden = false;

        let {width, height, marginLeft} = getComputedStyle(this["#sidebar"]);
        let fromMarginLeft = (marginLeft === "0px" && width !== "auto" ? `-${width}` : marginLeft);
        let toMarginLeft = "0px";

        let animation = this["#sidebar"].animate(
          {
            marginLeft: [fromMarginLeft, toMarginLeft]
          },
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
          }
        );

        this["#views"].animate(
          {
            marginLeft: [0, width]
          },
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
          }
        );

        this["#sidebar"].style.marginLeft = "0";
        this["#views"].style.marginLeft = width;
        this._currentAnimation = animation;
      });
    }

    _hideSidebar() {
      return new Promise(async (resolve) => {
        this["#sidebar"].hidden = false;

        let {width, height, marginLeft} = getComputedStyle(this["#sidebar"]);
        let fromMarginLeft = (marginLeft === "0px" && width !== "auto" ? "0px" : marginLeft);
        let toMarginLeft = `-${width}`;

        let animation = this["#sidebar"].animate(
          {
            marginLeft: [fromMarginLeft, toMarginLeft]
          },
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
          }
        );

        this["#views"].animate(
          {
            marginLeft: [width, 0]
          },
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
          }
        );

        this["#sidebar"].style.marginLeft = toMarginLeft;
        this["#views"].style.marginLeft = 0;
        this._currentAnimation = animation;

        await animation.finished;

        if (this._currentAnimation === animation) {
          this["#sidebar"].hidden = true;
        }
      });
    }

    get compact() {
      return this.hasAttribute("compact");
    }
    set compact(compact) {
      compact ? this.setAttribute("compact", "") : this.removeAttribute("compact");
    }
  }

  customElements.define("ui-replay", XelDemoElement);
}