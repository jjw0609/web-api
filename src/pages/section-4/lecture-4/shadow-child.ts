class ShadowChild extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <p id="childMsg">Child component (Shadow DOM)</p>
      <button id="replyBtn">Send message to parent</button>
    `;

    // Listen for CustomEvent from parent
    this.shadowRoot.addEventListener(
      'messageFromParent',
      (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        const msg = customEvent.detail;
        console.log(window.document);
        const childMsg =
          this.shadowRoot!.getElementById('childMsg');
        if (childMsg)
          childMsg.textContent = `Message from parent: ${msg}`;
      },
    );

    // Send CustomEvent to parent when button is clicked
    const replyBtn =
      this.shadowRoot.getElementById('replyBtn');
    if (replyBtn) {
      replyBtn.addEventListener('click', () => {
        const messageToParent = new CustomEvent<string>(
          'messageFromChild',
          {
            detail: 'Hello from child (Shadow DOM)!',
            bubbles: true,
          },
        );
        this.dispatchEvent(messageToParent);
      });
    }
    // You can bundle any technology stack (React, Vue, etc.) into a web component like this.
    // createRoot(this.shadowRoot).render(<ShadowChildApp />);
  }
}

if (!customElements.get('shadow-child')) {
  customElements.define('shadow-child', ShadowChild);
}
