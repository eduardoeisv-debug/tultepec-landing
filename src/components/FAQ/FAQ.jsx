import { useState } from "react";
import { faqs } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useReveal();

  return (
    <section className="faq" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2>Para entender mejor la tradición</h2>
        </div>

        <div className="faq__layout">
          <div className="faq__list reveal">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} key={item.question}>
                  <button
                    className="faq-item__question"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    {item.question}
                    <span className="faq-item__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div className="faq-item__answer" style={{ maxHeight: isOpen ? "240px" : "0px" }}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="faq__visual reveal" aria-hidden="true">
            <img src="/images/san-juan-de-dios/03.jfif" alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
