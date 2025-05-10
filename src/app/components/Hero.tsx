"use client";
import React, { useState } from "react";
import styles from "./Hero.module.css";
import { Choices, Questions } from "../types/Questions";
import { fetchRecommendations } from "../api/algorithm";
import { BuildRecommendation } from "../types/Build";
import PCRecommend from "./PCRecommend";

interface Matrix {
  questionId: number;
  choicesMatrix: number[];
}

export default function Hero() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [payloadMatrix, setPayloadMatrix] = useState<Matrix[]>([]); // Initialize with an empty array
  const [showIntro, setShowIntro] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [recommendations, setRecommendations] = useState<BuildRecommendation[]>(
    []
  );

  const questionsData: Questions[] = [
    {
      id: 1,
      question: "What type of PC do you want?",
      choices: [
        { choice: "Gaming" },
        { choice: "Office" },
        { choice: "Editing" },
        { choice: "General Use" },
      ],
    },
    {
      id: 2,
      question: "How is your budget?",
      choices: [
        { choice: "I'm on a very tight budget" },
        { choice: "I can go for a mid tier pc with my budget" },
        { choice: "I don't care about the price, give me the best" },
      ],
    },
    {
      id: 3,
      question: "How about the case size? Do you want it big or small?",
      choices: [
        { choice: "I want it be just a small case" },
        { choice: "The bigger the bettter" },
      ],
    },
    {
      id: 4,
      question: "Energy efficiency?",
      choices: [{ choice: "Of course" }, { choice: "No" }],
    },
  ];

  const currentQuestion = questionsData[currentQuestionIndex];

  const handleAnswerClick = (
    answer: string,
    choices: Choices[],
    choiceIndex: number,
    questionId: number
  ) => {
    const generatePayloadMatrix = () => {
      const matrix = Array(choices.length).fill(0);
      matrix[choiceIndex] = 1;
      setPayloadMatrix((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.questionId === questionId
        );
        if (existingIndex !== -1) {
          const updatedMatrix = [...prev];
          updatedMatrix[existingIndex] = { questionId, choicesMatrix: matrix };
          return updatedMatrix;
        }

        return [...prev, { questionId, choicesMatrix: matrix }];
      });

      return matrix;
    };
    generatePayloadMatrix();

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });

    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const callRecommendation = async () => {
    setIsLoading(true);
    const allChoicesMatrix = payloadMatrix.flatMap(
      (item) => item.choicesMatrix
    );
    try {
      const result = await fetchRecommendations(allChoicesMatrix);
      setRecommendations(result.recommendations.result);
    } catch (err) {
      console.error("Error while calling recommendation API:", err);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <section className={styles.heroContainer}>
      {recommendations.length === 0 && (
        <div
          key={showIntro ? "intro" : currentQuestionIndex}
          className={`${styles.quizCard} ${styles.fade}`}
        >
          {(() => {
            if (showIntro) {
              return (
                <div className={styles.intro}>
                  <h1 className={styles.introTitle}>
                    {" "}
                    Welcome to the PC Recommender App
                  </h1>
                  <p className={styles.introText}>
                    Just answer a few quick questions, and we&apos;ll generate
                    the perfect PC build tailored to your needs.
                  </p>
                  <button
                    className={styles.startButton}
                    onClick={() => setShowIntro(false)}
                  >
                    🚀 Start Survey
                  </button>
                </div>
              );
            } else if (currentQuestion) {
              return (
                <>
                  <div className={styles.progress}>
                    Question {currentQuestionIndex + 1} of{" "}
                    {questionsData.length}
                  </div>
                  <h2 className={styles.question}>
                    {currentQuestion.question}
                  </h2>
                  <div className={styles.answerCard}>
                    {currentQuestion.choices.map((choice, index) => (
                      <button
                        key={index}
                        className={`${styles.answerButton} ${
                          answers[currentQuestionIndex] === choice.choice
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswerClick(
                            choice.choice,
                            currentQuestion.choices,
                            index,
                            currentQuestion.id
                          )
                        }
                      >
                        {choice.choice}
                      </button>
                    ))}
                  </div>
                  <div className={styles.navigationButtons}>
                    {currentQuestionIndex > 0 && (
                      <button className={styles.navButton} onClick={handleBack}>
                        ⬅ Back
                      </button>
                    )}
                    {answers[currentQuestionIndex] && (
                      <button
                        className={styles.navButton}
                        onClick={() => {
                          if (currentQuestionIndex < questionsData.length - 1) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                          } else
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                        }}
                      >
                        {currentQuestionIndex === questionsData.length - 1
                          ? "Finish"
                          : "Next ➡"}
                      </button>
                    )}
                  </div>
                </>
              );
            } else {
              return (
                <div className={styles.result}>
                  <h2 className={styles.resultTitle}>
                    🎉 You&apos;re All Set!
                  </h2>
                  <p className={styles.resultSummary}>
                    Here’s a recap of your preferences:
                  </p>
                  <ul className={styles.resultList}>
                    {answers.map((ans, i) => (
                      <li key={i + 1}>
                        <span className={styles.resultQuestion}>Q{i + 1}:</span>
                        <span className={styles.resultAnswer}>{ans}</span>
                      </li>
                    ))}
                  </ul>
                  {isLoading ? (
                    <div className={styles.loading}>
                      <div className={styles.loader}></div>
                      <p>Loading recommendations...</p>
                    </div>
                  ) : (
                    <div className={styles.resultButtons}>
                      <button
                        className={styles.restartButton}
                        onClick={() => {
                          setAnswers([]);
                          setCurrentQuestionIndex(0);
                          setShowIntro(false);
                          setPayloadMatrix([]);
                        }}
                      >
                        🔄 Retake Quiz
                      </button>
                      <button
                        className={styles.recommendButton}
                        onClick={callRecommendation}
                      >
                        💻 Recommend me a PC build
                      </button>
                    </div>
                  )}
                </div>
              );
            }
          })()}
        </div>
      )}
      <PCRecommend
        builds={recommendations}
        onReset={() => {
          setAnswers([]);
          setCurrentQuestionIndex(0);
          setShowIntro(false);
          setPayloadMatrix([]);
          setRecommendations([]); // Reset recommendations
        }}
        answers={answers}
        questions={questionsData}
      />
    </section>
  );
}
