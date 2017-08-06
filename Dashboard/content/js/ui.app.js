
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
      <link rel="stylesheet" href="node_modules/xel/stylesheets/material.theme.css" data-vulcanize>

      <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
      
      <!-- Insert this line after script imports -->
      <script>if (window.module) module = window.module;</script>

      <link rel="stylesheet" href="css/eui.css">
      <link rel="stylesheet" href="css/table.css">

      <main>

        <x-button id="show-sidebar-button" icon="menu" skin="textured">
          <x-icon name="chevron-right"></x-icon>
        </x-button>

        <sidebar id="sidebar">

          <nav id="nav">
          <section>

          <x-button id="hide-sidebar-button" skin="nav">
              <x-icon name="chevron-left"></x-icon>
          </x-button>

          <x-button id="execute_btn" skin="nav">
              <x-icon name="directions-run"></x-icon>
              <x-label>Execute</x-label>
          </x-button>
          <x-button id="test_case_btn" skin="nav">
              <x-icon name="build"></x-icon>
              <x-label>Tests</x-label>
          </x-button>
          <x-button id="error_log_btn" skin="nav">
              <x-icon name="error"></x-icon>
              <x-label>Errors</x-label>
          </x-button>
          <x-button id="output_btn" skin="nav">
              <x-icon name="highlight"></x-icon>
              <x-label>Output</x-label>
          </x-button>
          <x-button id="charts_btn" skin="nav">
              <x-icon name="show-chart"></x-icon>
              <x-label>Charts</x-label>
          </x-button>
          <x-button class="hidden" skin="nav">
              <x-icon name="settings"></x-icon>
              <x-label>Settings</x-label>
          </x-button>
          </section>
          </nav>
        </sidebar>
          <div id="views">

              <div class="centered hidden" id="timer">
                <x-progressbar style="height: 7px"></x-progressbar>
              </div>

              <div id="execute_pane" class="view">
                    <div class="centered">
                        <div class="centered" style="padding: 10px">
                           <x-button id="cancelbtn" class="centered hidden" onclick="runner.kill();"><x-icon name="create"></x-icon><x-label>Kill</x-label></x-button>
  
                           <x-buttons class="centered">
                            <x-button id="runbtn"><x-icon name="create"></x-icon> <x-label>Analyze</x-label></x-button>
                            <x-button id="loadbtn"><x-icon name="file-upload"></x-icon><x-label>Load</x-label></x-button>
                           </x-buttons>
                        </div>
                      </div>
                     <div class="flex table-out table-responsive-vertical shadow-z-1" id="summary">
                        <table class="table table-hover table-mc-light-blue">
                           <thead>
                              <tr>
                                 <th>Metrics</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody id="summary_body">
                              <tr><td>Total Paths</td><td id="total_path_count"></td>
                              <tr><td>Total Runtime</td><td id="total_runtime"></td>
                              <tr><td>Average Test (Mean)</td><td id="average_test_mean"></td>
                              <tr><td>Average Test (Median)</td><td id="average_test_median"></td>
                              <tr><td>Best Case</td><td id="best_case_test"></td>
                              <tr><td>Worst Case</td><td id="word_case_test"></td>
                           </tbody>
                        </table>
                     </div>
                     <div class="table-out table-responsive-vertical shadow-z-1" id="execute_results">
                        <table class="table table-hover table-mc-light-blue">
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
                     <div style="padding: 10px" align="center">
                        <x-button id="savebtn"><x-icon name="save"></x-icon></x-button>
                     </div>
               </div>
               
                     <div id="output_pane" class="table-out hidden table-responsive-vertical shadow-z-1">
                        <table class="table table-hover table-mc-light-blue">
                        <thead>
                           <tr>
                              <th>Output</th>
                           </tr>
                        </thead>
                        <tbody id="output_body">
                        </tbody>
                        </table>
                    </div>

                     <div id="testcases_pane" class="table-out hidden table-responsive-vertical shadow-z-1">
                        <table class="table table-hover table-mc-light-blue">
                        <thead>
                           <tr>
                              <th>Test Case</th>
                              <th>Time</th>
                              <th>Alternatives</th>
                              <th>Error Count</th>
                           </tr>
                        </thead>
                        <tbody id="testcases_body">
                        </tbody>
                     </table>
                    </div>

                     <div id="errors_pane" class="table-out hidden table-responsive-vertical shadow-z-1">
                        <table class="table table-hover table-mc-light-blue">
                          <thead>
                           <tr>
                              <th>Test Case</th>
                              <th>Error</th>
                           </tr>
                        </thead>
                        <tbody id="errors_body">
                        </tbody>
                     </table>
                    </div>

               <div id="analyze_pane" class="hidden">
                     <div style="padding: 10px" align="center">
                        <x-buttons id="graph_buttons" class="hidden">
                          <x-button onclick="graph.savePng();">To SVG</x-button>
                          <x-button onclick="graph.saveTex();">To Tex</x-button>
                        </x-buttons>
                     </div>
                  <div id="graph_content">
                  </div>
               </div>
            </div>
          </div>
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

      this["#execute_btn"].addEventListener("click", (event) => this.setPage(this["#execute_pane"]));
      this["#test_case_btn"].addEventListener("click", (event) => this.setPage(this["#testcases_pane"]));
      this["#error_log_btn"].addEventListener("click", (event) => this.setPage(this["#errors_pane"]));
      this["#output_btn"].addEventListener("click", (event) => this.setPage(this["#output_pane"]));
      this["#charts_btn"].addEventListener("click", (event) => this.setPage(this["#analyze_pane"]));

      this["#runbtn"].addEventListener("click", (event) => this._onClickRun(event));
      this["#loadbtn"].addEventListener("click", (event) => this._onClickLoad(event));
      this["#savebtn"].addEventListener("click", (event) => this._onClickSave(event));

      this.views = [this["#execute_pane"], this["#analyze_pane"], this["#output_pane"], this["#testcases_pane"], this["#errors_pane"]];

      summary(null, this);
    }

    setPage(elem) {
      this.views.forEach(view => this.hide(view));
      this.show(elem);
    }

    _onClickRun(event) {
      runner.runExpoSE(this);
    }

    _onClickLoad(event) {
      output.loadOutput(this);
    }

    _onClickSave(event) {
      output.saveOutput(this);
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

  customElements.define("ui-app", XelDemoElement);
}