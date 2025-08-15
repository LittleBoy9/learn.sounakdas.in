import React from 'react';
import { Check } from 'lucide-react';

interface MCQOption {
  id: string;
  text: string;
  value: string;
}

interface MCQQuestionProps {
  question: string;
  options: MCQOption[];
  selectionType: 'single' | 'multiple';
  selectedValues: string[];
  correctAnswerIndices?: number[];
  onSelectionChange: (values: string[]) => void;
  mode?: 'base' | 'pro';
  showResults?: boolean;
  onReveal?: () => void;
  className?: string;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  options,
  selectionType,
  selectedValues,
  correctAnswerIndices = [],
  onSelectionChange,
  mode = 'base',
  showResults = false,
  onReveal,
  className = ''
}) => {
  const handleSingleSelection = (value: string) => {
    onSelectionChange([value]);
  };

  const handleMultipleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const handleSelection = (value: string) => {
    if (selectionType === 'single') {
      handleSingleSelection(value);
    } else {
      handleMultipleSelection(value);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);
  const isWrongAnswer = (index: number) => {
    const option = options[index];
    return showResults && isSelected(option.value) && !correctAnswerIndices.includes(index);
  };

  const shouldShowCorrectAnswer = (index: number) => {
    return showResults && correctAnswerIndices.includes(index);
  };

  const getAnswerStatus = () => {
    if (!showResults || correctAnswerIndices.length === 0) return null;

    const selectedIndices = selectedValues.map(value =>
      options.findIndex(opt => opt.value === value)
    ).filter(index => index !== -1);

    if (selectionType === 'single') {
      const isCorrect = selectedIndices.length === 1 && correctAnswerIndices.includes(selectedIndices[0]);
      return isCorrect ? 'correct' : 'incorrect';
    } else {
      const correctSelected = selectedIndices.filter(index => correctAnswerIndices.includes(index));
      const incorrectSelected = selectedIndices.filter(index => !correctAnswerIndices.includes(index));
     // const missedCorrect = correctAnswerIndices.filter(index => !selectedIndices.includes(index));

      if (correctSelected.length === correctAnswerIndices.length && incorrectSelected.length === 0) {
        return 'correct';
      } else {
        return 'incorrect';
      }
    }
  };

  const answerStatus = getAnswerStatus();

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-orange-100 p-8 ${className}`}>
      {/* Question Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mb-3">
          {question}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-orange-50 text-[#ff8800] rounded-full font-medium">
            {selectionType === 'single' ? 'Single Choice' : 'Multiple Choice'}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
            {mode === 'base' ? 'Base Mode' : 'Pro Mode'}
          </span>
          {selectionType === 'multiple' && (
            <span className="text-gray-400">Select all that apply</span>
          )}
        </div>
      </div>

      {/* Answer Status Banner */}
      {showResults && answerStatus && (
        <div className={`mb-6 p-4 rounded-xl border-2 ${
          answerStatus === 'correct'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {answerStatus === 'correct' ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✕</span>
              </div>
            )}
            <span className="font-semibold">
              {answerStatus === 'correct' ? 'Correct Answer!' : 'Incorrect Answer'}
            </span>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            onClick={() => handleSelection(option.value)}
            className={`
              relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md group
              ${showResults ? 'cursor-default' : 'cursor-pointer'}
              ${isSelected(option.value)
                ? 'border-[#ff9900] bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }
              ${shouldShowCorrectAnswer(index)
                ? 'ring-2 ring-green-300 ring-opacity-50 border-green-400 bg-green-50'
                : ''
              }
              ${isWrongAnswer(index)
                ? 'ring-2 ring-red-300 ring-opacity-50 border-red-400 bg-red-50'
                : ''
              }
            `}
          >
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mr-4 transition-colors duration-200
              ${isSelected(option.value)
                ? 'bg-[#ff9900] text-white'
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }
              ${shouldShowCorrectAnswer(index)
                ? 'bg-green-500 text-white ring-2 ring-green-400'
                : ''
              }
              ${isWrongAnswer(index)
                ? 'bg-red-500 text-white ring-2 ring-red-400'
                : ''
              }
            `}>
              {String.fromCharCode(65 + index)}
            </div>

            <div className="flex items-center mr-4">
              {selectionType === 'single' ? (
                <div className={`
                  w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                  ${isSelected(option.value)
                    ? 'border-[#ff9900] bg-[#ff9900]'
                    : 'border-gray-300 group-hover:border-orange-300'
                  }
                `}>
                  {isSelected(option.value) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              ) : (
                <div className={`
                  w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                  ${isSelected(option.value)
                    ? 'border-[#ff9900] bg-[#ff9900] '
                    : 'border-gray-300 group-hover:border-orange-[#ff9900] '
                  }
                `}>
                  {isSelected(option.value) && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className={`
                text-base leading-relaxed transition-colors duration-200
                ${isSelected(option.value)
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-700 group-hover:text-gray-800'
                }
                ${shouldShowCorrectAnswer(index)
                  ? 'text-green-800 font-medium'
                  : ''
                }
                ${isWrongAnswer(index)
                  ? 'text-red-800 font-medium'
                  : ''
                }
              `}>
                {option.text}
              </p>
            </div>

            <div className={`
              absolute inset-0 rounded-xl transition-opacity duration-200
              ${isSelected(option.value)
                ? 'bg-[#ff9900] opacity-5'
                : 'opacity-0'
              }
            `} />

            {shouldShowCorrectAnswer(index) && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
            {isWrongAnswer(index) && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✕</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {mode === 'base' && selectedValues.length > 0 && !showResults && correctAnswerIndices.length > 0 && onReveal && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onReveal}
            className="px-4 py-2 bg-[#ff9900] hover:bg-[#ff8800] text-white rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Reveal Answer
          </button>
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              {selectionType === 'single'
                ? 'Selected Answer:'
                : `Selected Answers (${selectedValues.length}):`}
            </span>
            {!showResults && (
              <button
                onClick={() => onSelectionChange([])}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                Clear Selection
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedValues.map(value => {
              const option = options.find(opt => opt.value === value);
              const optionIndex = options.findIndex(opt => opt.value === value);
              const isCorrectSelection = showResults && correctAnswerIndices.includes(optionIndex);
              const isWrongSelection = showResults && !correctAnswerIndices.includes(optionIndex);
              return (
                <span
                  key={value}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrectSelection
                      ? 'bg-green-100 text-green-800'
                      : isWrongSelection
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}: {option?.text}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQQuestion;
