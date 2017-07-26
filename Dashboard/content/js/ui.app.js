
// @copyright
//   © 2016-2017 Jarosław Foksa

"use strict";

{
  let {html} = Xel.utils.element;
  let {isDOMWhitespace, replaceAll} = Xel.utils.string;

  let theme = document.querySelector('link[href*=".theme.css"]').getAttribute("href");
  let counter = 0;

  let shadowTemplate = html`
    <template>
      <link rel="stylesheet" href="xel/stylesheets/galaxy.theme.css" data-vulcanize>

      <!-- Javascript -->
      <script src="js/jquery.js" charset="utf-8">
      summary(null); </script>
      <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
      
      <!-- Insert this line after script imports -->
      <script>if (window.module) module = window.module;</script>
      
      <script>
         const output = require('./js/output');
         const runner = require('./js/runner');
         const summary = require('./js/summary');
         const view = require('./js/view');
         const graph = require('./js/graph');
      </script>

      <link rel="stylesheet" href="css/eui.css"/>
      <main>

        <x-button id="show-sidebar-button" icon="menu" skin="textured">
          <x-icon name="menu"></x-icon>
        </x-button>

        <sidebar id="sidebar">
                  <header id="header">
            <h1 id="logo">ExpoSE</h1>

          <x-button id="hide-sidebar-button" skin="textured">
              <x-icon name="chevron-left"></x-icon>
            </x-button>
          </header>

          <nav id="nav">
          <section>
          <x-button skin="nav">
              <x-icon name="build"></x-icon>
              <x-label>Test Case</x-label>
          </x-button>
          <x-button skin="nav">
              <x-icon name="error"></x-icon>
              <x-label>Error Log</x-label>
          </x-button>
          <x-button skin="nav">
              <x-icon name="highlight"></x-icon>
              <x-label>Output</x-label>
          </x-button>
          <x-button skin="nav">
              <x-icon name="show-chart"></x-icon>
              <x-label>Charts</x-label>
          </x-button>
          <x-button skin="nav">
              <x-icon name="settings"></x-icon>
              <x-label>Settings</x-label>
          </x-button>
          </section>
          </nav>
        </sidebar>
          <div id="views">

              <div id="execute_pane" class="view">
                     <header class="toolbar toolbar-header">
                        <div align="center" style="padding: 10px">
                           <x-buttons>
                            <x-button id="cancelbtn" onclick="runner.kill();"><x-icon name="create"></x-icon><x-label>Kill</x-label></x-button>
                            <x-button id="runbtn" onclick="runner.runExpoSE();"><x-icon name="create"></x-icon> <x-label>Analyze</x-label></x-button>
                            <x-button id="loadbtn" onclick="output.loadOutput();"><x-icon name="file-upload"></x-icon><x-label>Load</x-label></x-button>
                           </x-buttons>
                           <div id="timer" class="nav-group-item">
                           </div>
                        </div>
                     </header>
                     <div class="" id="summary">
                        <table>
                           <thead>
                              <tr>
                                 <th>Metrics</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="summary_body">
                           </tbody>
                        </table>
                     </div>
                     <hr/>
                     <div class="flex" id="execute_results">
                        <table class="table-striped">
                           <thead>
                              <tr>
                                 <th>File Name</th>
                                 <th>Coverage (%)</th>
                                 <th>Found Blocks</th>
                                 <th>Total Blocks</th>
                              </tr>
                           </thead>
                           <tbody id="results_body">
                           </tbody>
                        </table>
                     </div>
                  <footer class="toolbar toolbar-footer">
                     <div style="padding: 10px" align="center">
                        <x-button onclick="output.saveOutput();"><x-icon name="save"></x-icon></x-button>
                     </div>
                  </footer>
               </div>
               <x-card id="output_pane">
                  <div id="execution_output">
                     <table class="table-striped">
                        <thead>
                           <tr>
                              <th>Output</th>
                           </tr>
                        </thead>
                        <tbody id="output_body">
                        </tbody>
                     </table>
                  </div>
               </x-card>
               <x-card id="testcases_pane">
                  <div id="testcases_output">
                     <table class="table-striped">
                        <thead>
                           <tr>
                              <th>Replay</th>
                              <th>Test Case</th>
                              <th>Time</th>
                              <th>Error Count</th>
                           </tr>
                        </thead>
                        <tbody id="testcases_body">
                        </tbody>
                     </table>
                  </div>
               </x-card>
               <x-card id="errors_pane" class="pane">
                  <div id="execution_errors">
                     <table class="table-striped">
                        <thead>
                           <tr>
                              <th>Replay</th>
                              <th>Test Case</th>
                              <th>Error</th>
                           </tr>
                        </thead>
                        <tbody id="errors_body">
                        </tbody>
                     </table>
                  </div>
               </x-card>
               <x-card id="analyze_pane" class="pane">
                  <header class="toolbar toolbar-header">
                     <div style="padding: 10px" align="center">
                        <button class="btn btn-large btn-default" onclick="graph.savePng();">To PNG</button>
                        <button class="btn btn-large btn-default" onclick="graph.saveTex();">To Tex</button>
                     </div>
                  </header>
                  <div id="graph_content">
                  </div>
               </x-card>
            </div>
          </div>

          <script>
            $(function() { summary(null); });
          </script>
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

      this["#hide-sidebar-button"].addEventListener("click", (event) => this._onHideNavButtonClick(event));
      this["#show-sidebar-button"].addEventListener("click", (event) => this._onShowNavButtonClick(event));
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

        this["#sidebar"].style.marginLeft = "0";
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

        this["#sidebar"].style.marginLeft = toMarginLeft;
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

  customElements.define("ui-app", XelDemoElement);
}