"use client";

import { useState } from "react";
import { CONTACT, PROMISE, SERVICES } from "@/lib/content";
import pill from "@/components/ui/Pill.module.css";
import styles from "./BriefForm.module.css";

/** Project brief form with Tatva's contact details. It confirms on screen; sending it to the studio is wired up later. */
export default function BriefForm() {
  const [sent, setSent] = useState(false);
  return (
    <section className={styles.brief} id="brief">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.lead} data-reveal="">
          <p className="cap">Start a project</p>
          <h2>Have an idea that needs to become something real?</h2>
          <p>{PROMISE}</p>
          <dl className={styles.contact}>
            <div>
              <dt>Phone</dt>
              <dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{CONTACT.location}</dd>
            </div>
            <div>
              <dt>Follow</dt>
              <dd>
                <a href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
                {" · "}
                <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              </dd>
            </div>
          </dl>
        </div>
        <form
          className={styles.form}
          data-reveal=""
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label>
            What do you need?
            <select id="f-service" defaultValue={SERVICES[1].title}>
              {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            Industry
            <select id="f-industry" defaultValue="Pharma">
              {["Pharma", "Food & FMCG", "Industrial", "Retail", "Other"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label>
            Quantity (approx.)
            <input id="f-qty" type="text" placeholder="e.g. 5,000 pieces" autoComplete="off" />
          </label>
          <label>
            Needed by
            <select id="f-when" defaultValue="In 1 to 3 months">
              {["Within a month", "In 1 to 3 months", "In 3 months or more"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className={styles.full}>
            Name and phone or email
            <input id="f-contact" type="text" required placeholder="Your name, how to reach you" autoComplete="off" />
          </label>
          <button className={`${pill.pill} ${styles.full} ${styles.submit}`} type="submit">
            Send brief
          </button>
          {sent && (
            <p className={`${styles.full} ${styles.sent}`}>Thank you. Your brief is noted. On the live site this is sent to the studio.</p>
          )}
        </form>
      </div>
    </section>
  );
}
