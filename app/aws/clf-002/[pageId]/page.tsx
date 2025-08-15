"use client";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import MCQQuestion from "@/app/components/aws/MCQQuestion";


const sampleQuestions = [
  {
    id: 'q1',
    question: 'Which AWS service is used for object storage?',
    options: [
      { id: 'q1o1', text: 'Amazon EC2', value: '1' },
      { id: 'q1o2', text: 'Amazon S3', value: '2' },
      { id: 'q1o3', text: 'Amazon RDS', value: '3' },
      { id: 'q1o4', text: 'Amazon EBS', value: '4' }
    ],
    selectionType: 'single' as const,
    correctAnswerIndices: [1]
  },
  {
    id: 'q2',
    question: 'Which AWS services are serverless?',
    options: [
      { id: 'q2o1', text: 'AWS Lambda', value: '1' },
      { id: 'q2o2', text: 'Amazon DynamoDB', value: '2' },
      { id: 'q2o3', text: 'Amazon EC2', value: '3' },
      { id: 'q2o4', text: 'Amazon S3', value: '4' }
    ],
    selectionType: 'multiple' as const,
    correctAnswerIndices: [0, 1]
  }
];

type AnswerState = Record<string, string[]>;

function initAnswers(questions: typeof sampleQuestions): AnswerState {
  return Object.fromEntries(questions.map(q => [q.id, []]));
}

const Page = () => {
  const questions = sampleQuestions;

  // build empty answers dynamically
  const emptyAnswers = useMemo(() => initAnswers(questions), [questions]);

  const [answers, setAnswers] = useState<AnswerState>(emptyAnswers);
  const [mode, setMode] = useState<"base" | "pro">("base");
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [showProResults, setShowProResults] = useState(false);

  useEffect(() => {
    setAnswers(emptyAnswers);
    setRevealedQuestions(new Set());
    setShowProResults(false);
  }, [emptyAnswers]);

  const handleAnswerChange = (questionId: string, values: string[]) => {
    const q = questions.find(q => q.id === questionId);
    if (!q) return;

    let next = values;
    if (q.selectionType === "multiple" && values.length > 2) {
      next = values.slice(0, 2); // Enforce max 2 selections
    }

    if (q.selectionType === "single") {
      next = next.slice(0, 1); // Enforce only one selection for single choice
    }

    setAnswers(prev => ({ ...prev, [questionId]: next }));
  };

  const handleReveal = (questionId: string) => {
    setRevealedQuestions(prev => new Set(prev).add(questionId));
  };

  const handleSubmitAll = () => setShowProResults(true);

  const resetQuiz = () => {
    setAnswers(emptyAnswers);
    setRevealedQuestions(new Set());
    setShowProResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    const total = questions.length;

    for (const q of questions) {
      const userValues = answers[q.id] ?? [];
      const correctIdxs = new Set(q.correctAnswerIndices);

      const userIdxs = new Set(
        userValues
          .map(v => q.options.findIndex(o => o.value === v)) // Ensure value comparison is correct (number)
          .filter(i => i !== -1)
      );

      if (q.selectionType === "single") {
        if (userIdxs.size === 1 && correctIdxs.has(Array.from(userIdxs)[0])) {
          correct++;
        }
      } else {
        const sameSize = userIdxs.size === correctIdxs.size;
        const allIn = sameSize && Array.from(userIdxs).every(i => correctIdxs.has(i));
        if (allIn) correct++;
      }
    }

    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const allQuestionsAnswered = questions.every(q => (answers[q.id] ?? []).length > 0);
  const score = showProResults ? calculateScore() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Interactive MCQ Component
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beautifully designed multiple choice questions with support for both single and multiple selection modes
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => { setMode("base"); resetQuiz(); }}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  mode === "base" ? "bg-[#ff9900] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}>
                Base Mode
              </button>
              <button onClick={() => { setMode("pro"); resetQuiz(); }}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  mode === "pro" ? "bg-[#ff9900] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}>
                Pro Mode
              </button>
            </div>
            <button onClick={resetQuiz} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors duration-200">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              {mode === "base" ? "🎯 Base Mode: Answer each question and reveal the correct answer immediately" : "🏆 Pro Mode: Answer all questions first, then submit to see your overall score"}
            </p>
          </div>
        </div>

        {mode === "pro" && showProResults && score && (
          <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-[#ff9900] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <div className="text-6xl font-bold mb-4">
                <span className={score.percentage >= 70 ? "text-green-500" : score.percentage >= 50 ? "text-[#ff9900]" : "text-red-500"}>{score.percentage}%</span>
              </div>
              <p className="text-xl text-gray-600 mb-4">
                You got <span className="font-bold text-orange-600">{score.correct}</span> out of <span className="font-bold">{score.total}</span> questions correct
              </p>
              <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${
                score.percentage >= 70 ? "bg-green-100 text-green-800" : score.percentage >= 50 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
              }`}>
                {score.percentage >= 70 ? "🎉 Excellent!" : score.percentage >= 50 ? "👍 Good Job!" : "📚 Keep Learning!"}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {questions.map((q, index) => (
            <div key={q.id} className="relative">
              <div className="absolute -top-4 left-8 z-10">
                <div className="bg-[#ff9900] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Question {index + 1}
                </div>
              </div>

              <MCQQuestion
                question={q.question}
                options={q.options}
                selectionType={q.selectionType}
                selectedValues={answers[q.id] ?? []}
                correctAnswerIndices={q.correctAnswerIndices}
                onSelectionChange={(vals) => handleAnswerChange(q.id, vals)}
                mode={mode}
                showResults={mode === "base" ? revealedQuestions.has(q.id) : showProResults}
                onReveal={() => handleReveal(q.id)}
              />
            </div>
          ))}
        </div>

        {mode === "pro" && !showProResults && (
          <div className="mt-12 text-center">
            <button onClick={handleSubmitAll} disabled={!allQuestionsAnswered} className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${allQuestionsAnswered ? "bg-[#ff9900] hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
              {allQuestionsAnswered ? "Submit All Answers" : `Answer All Questions (${Object.values(answers).filter(a => a.length > 0).length}/${questions.length})`}
            </button>
          </div>
        )}

        {!showProResults && (
          <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Answers</h3>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">Question {index + 1}:</span>
                    <span className="ml-2 text-gray-600 truncate">
                      {q.question.length > 60 ? q.question.substring(0, 60) + "..." : q.question}
                    </span>
                  </div>
                  <div className="ml-4 text-right">
                    {(answers[q.id] ?? []).length > 0 ? (
                      <div className="space-y-1">
                        {(answers[q.id] ?? []).map((value) => {
                          const idx = q.options.findIndex(o => o.value === value);
                          const opt = idx >= 0 ? q.options[idx] : undefined;
                          return (
                            <div key={value} className="text-sm font-medium text-orange-600">
                              {idx >= 0 ? `${String.fromCharCode(65 + idx)}: ${opt?.text}` : value}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Not answered</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
