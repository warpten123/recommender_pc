"use client";
import React from "react";
import styles from "./PCRecommend.module.css";
import { BuildRecommendation } from "../types/Build";

interface PCRecommendProps {
  builds: BuildRecommendation[];
  onReset: () => void;
  answers: string[];
  questions: { id: number; question: string }[];
}

export default function PCRecommend({
  builds,
  onReset,
  answers,
  questions,
}: Readonly<PCRecommendProps>) {
  if (!builds || builds.length === 0) return null;

  return (
    <div className={styles.recommendContainer}>
      <h2 className={styles.recommendTitle}>💻 Recommended PC Builds</h2>
      <div className={styles.userPrefs}>
        <h3>Your Preferences:</h3>
        <ul>
          {questions.map((q, i) => (
            <li key={q.id}>
              <strong>{q.question}</strong> <span>— {answers[i]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardsWrapper}>
        {builds.map((build, index) => (
          <div key={index + 1} className={styles.card}>
            <h3 className={styles.cardTitle}>Build #{index + 1}</h3>
            <p className={styles.cardPrice}> ₱{build.build_price}</p>
            <ul className={styles.specList}>
              {Object.entries(build.build_specs).map(([part, detail]) => (
                <li key={part}>
                  <strong>{part}:</strong> {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className={styles.againButton} onClick={onReset}>
        🔁 Recommend Again
      </button>
    </div>
  );
}
