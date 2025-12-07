# 4. Communication in Different Environments

## Learning Objectives for this Section
- Communication between different **Windows**
- Communication between different **Tabs** 
- Communication in **DOM isolation** (Shadow DOM)

## 🤔 Scenario 1: `<iframe>` Communication
-   **`<iframe>`**: Parent Window ↔ Child Window
-   **Question**: How to exchange data (securely)?
-  ex> Suppose you have a parent page that embeds a video player inside an `<iframe>`. When the video finishes playing, you want the parent page to display a message like "Video ended!"

## 🤔 Scenario 2: Tab-to-Tab Communication
-   Information exchange between **different tabs/windows**
-   **Question**: How to communicate without `port` concept?
-   ex> Imagine you have two tabs open: one is playing a lecture video, and the other is for taking class notes. When you save your notes in one tab, you want to notify the lecture video tab that the notes have been updated.

## 🤔 Scenario 3: Shadow DOM Communication
-   [**Web Component**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) & [**Shadow DOM**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) (Isolated DOM)
-   **Question**: How to interact between Shadow DOM interior ↔ exterior DOM?
-   ex> Suppose you have a custom `<user-profile>` web component that uses Shadow DOM. When a user clicks the "Edit" button inside the component, you want to show a modal dialog in the main page (outside the Shadow DOM).
