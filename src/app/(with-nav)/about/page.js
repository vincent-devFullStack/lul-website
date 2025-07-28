"use client";

import "../../../styles/pages/about.css";
import { useEffect, useRef, useState, useCallback } from "react";

export default function About() {
  const leftPageRef = useRef(null);
  const [leftContent, setLeftContent] = useState("");
  const [rightContent, setRightContent] = useState("");

  const fullText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique auctor maximus. Proin a tincidunt eros. Donec iaculis mi ut eros hendrerit, ac venenatis orci elementum. Nullam id justo ante. Integer bibendum, nulla ac maximus imperdiet, ante quam suscipit tellus, sit amet fringilla diam ante eu est. Aenean nec imperdiet odio.

Nulla justo lorem, consequat eget quam nec, pulvinar tincidunt quam. Nulla ut auctor massa, ut molestie mauris. Donec auctor justo ultrices leo placerat, a pulvinar lacus pulvinar. Ut sagittis purus ut magna aliquet, ac sodales odio gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst.

Suspendisse neque orci, sollicitudin nec ex vitae, pharetra feugiat nisl. Maecenas gravida augue lacus. Fusce gravida ante ut aliquam congue. Cras pellentesque lorem vitae enim fringilla pellentesque. Vivamus semper dui a purus fringilla tincidunt. Sed sit amet volutpat massa.

Curabitur quis feugiat nisi. Duis interdum eros tellus, sed molestie libero cursus non. Donec malesuada ipsum vel sem varius sagittis. Donec at venenatis augue, vel mattis orci. Nunc accumsan odio neque, sit amet rhoncus tellus pretium ac. Praesent at nulla blandit, laoreet purus vel, faucibus nulla.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.`;

  const splitTextContent = useCallback(() => {
    if (!leftPageRef.current || !fullText) return;

    const words = fullText.split(" ");
    const leftPage = leftPageRef.current;

    const testElement = document.createElement("div");
    testElement.style.cssText = `
      position: absolute;
      visibility: hidden;
      width: ${leftPage.offsetWidth - 60}px;
      font-size: 1.125rem;
      line-height: 1.6;
      color: #4B5563;
      padding: 0;
      margin: 0;
      margin-bottom: 1rem;
    `;
    document.body.appendChild(testElement);

    const availableHeight = leftPage.offsetHeight - 280;

    let leftText = "";
    let i = 0;

    while (i < words.length) {
      const testText = leftText + (leftText ? " " : "") + words[i];
      testElement.textContent = testText;

      if (testElement.offsetHeight > availableHeight) {
        if (leftText === "") {
          leftText = words[i];
          i++;
        }
        break;
      }

      leftText = testText;
      i++;
    }

    const rightText = words.slice(i).join(" ");

    document.body.removeChild(testElement);

    setLeftContent(leftText);
    setRightContent(rightText);
  }, [fullText]);

  useEffect(() => {
    const timer = setTimeout(splitTextContent, 200);
    window.addEventListener("resize", splitTextContent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", splitTextContent);
    };
  }, [splitTextContent]);

  return (
    <div className="about-container">
      <div className="about-content about-left" ref={leftPageRef}>
        <div className="page-content">
          <h1 className="book-title" id="about-title">
            À propos de moi
          </h1>

          <div className="image-placeholder">
            <div className="placeholder-content">[Image à venir]</div>
          </div>

          <p className="book-text">{leftContent}</p>
        </div>
      </div>

      <div className="about-content about-right">
        <div className="page-content">
          <p className="book-text">{rightContent}</p>
        </div>
      </div>
    </div>
  );
}
