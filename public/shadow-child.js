class ShadowChild extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <p id="childMsg">Child component (Shadow DOM)</p>
      <button id="replyBtn">Send message to parent</button>
    `;

    // Listen for CustomEvent from parent
    this.shadowRoot.addEventListener('messageFromParent', (event) => {
      const msg = event.detail;
      console.log(window.document);
      this.shadowRoot.getElementById('childMsg').textContent = `Message from parent: ${msg}`;
    });

    // Send CustomEvent to parent when button is clicked
    this.shadowRoot.getElementById('replyBtn').addEventListener('click', () => {
      const messageToParent = new CustomEvent('messageFromChild', {
        detail: 'Hello from child (Shadow DOM)!',
        bubbles: true,
      });
      this.dispatchEvent(messageToParent);
    });
    /**
     * Any technology stack(React, Vue, etc.) can be bundled as a web component.
     */
    // createRoot(this.shadowRoot).render(<ShadowChildApp />);
  }
}

customElements.define('shadow-child', ShadowChild); 