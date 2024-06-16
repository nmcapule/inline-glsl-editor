import { LitElement, css, html } from "lit";
import { customElement, query, queryAsync, state } from "lit/decorators.js";
import GlslCanvas from "glslCanvas";

const initialCode = `/// hello world!

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main(){
  gl_FragColor = vec4(cos(u_time), 0.5, 0.3, 1.0);
}
`;

@customElement("shader-editor")
export class ShaderEditor extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }

    #code-editor {
      color: black;
      display: block;
      width: 100%;
      min-height: 3em;
      background-color: #fafafa;
      border: 1px solid #efefef;
      border-radius: 8px;
      padding: 8px;
    }

    #shader-canvas {
      width: 360px;
      height: 240px;
      background-color: #0a0a0a;
      border: 1px solid #efefef;
    }
  `;

  @query("#code-editor")
  private _codeEditor: HTMLElement;

  @queryAsync("#shader-canvas")
  private _shaderCanvas: Promise<HTMLCanvasElement>;

  @state()
  private _glslSandbox: GlslCanvas;

  constructor() {
    super();
    this._setUpGlslCanvas();
  }

  private async _setUpGlslCanvas() {
    this._glslSandbox = new GlslCanvas(await this._shaderCanvas);
    this._glslSandbox.load(initialCode);
  }

  render() {
    return html`
      <canvas id="shader-canvas"></canvas>
      <pre
        id="code-editor"
        contenteditable="true"
        @input=${this._updateCode}
        .innerText=${initialCode}
      ></pre>
    `;
  }

  get code() {
    return this._codeEditor.innerText;
  }

  private _updateCode(ev: InputEvent) {
    console.log(this.code);
    this._glslSandbox.load(this.code);
  }
}
