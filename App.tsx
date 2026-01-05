
import React, { useState, useEffect } from 'react';
import { ADVANCED_VOCABULARY } from './data/vocabulary';
import { evaluateSentence } from './services/geminiService';
import { AppState, EvaluationResult } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentWordIndex: 0,
    userSentence: '',
    evaluation: null,
    isLoading: false,
  });

  const currentWord = ADVANCED_VOCABULARY[state.currentWordIndex];

  const handleNextWord = () => {
    setState(prev => ({
      ...prev,
      currentWordIndex: (prev.currentWordIndex + 1) % ADVANCED_VOCABULARY.length,
      userSentence: '',
      evaluation: null
    }));
  };

  const handlePrevWord = () => {
    setState(prev => ({
      ...prev,
      currentWordIndex: (prev.currentWordIndex - 1 + ADVANCED_VOCABULARY.length) % ADVANCED_VOCABULARY.length,
      userSentence: '',
      evaluation: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.userSentence.trim()) return;

    setState(prev => ({ ...prev, isLoading: true }));
    const result = await evaluateSentence(currentWord.word, state.userSentence);
    setState(prev => ({ ...prev, evaluation: result, isLoading: false }));
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, evaluation: null, userSentence: '' }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">E</div>
          <h1 className="text-3xl font-bold text-slate-800 serif-title">Eloquently</h1>
        </div>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Vocabulary Enrichment
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Word Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10 transition-all">
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {currentWord.partOfSpeech}
            </span>
            <span className="text-slate-400 text-sm font-medium">
              Word {state.currentWordIndex + 1} of {ADVANCED_VOCABULARY.length}
            </span>
          </div>

          <h2 className="text-5xl font-bold text-slate-900 mb-2 serif-title">{currentWord.word}</h2>
          <p className="text-lg text-slate-500 italic mb-6">{currentWord.phonetic}</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Meaning</h3>
              <p className="text-xl text-slate-800 leading-relaxed">{currentWord.definition}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Example Usage</h3>
              <p className="text-lg text-slate-700 bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 italic leading-relaxed">
                "{currentWord.example}"
              </p>
            </div>

            {currentWord.etymology && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Etymology</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{currentWord.etymology}</p>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={handlePrevWord}
              className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            <button 
              onClick={handleNextWord}
              className="flex-1 py-3 px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </section>

        {/* Exercise Section */}
        <section className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 serif-title">Refine Your Usage</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">Draft a sentence using <span className="font-bold text-slate-900 underline decoration-indigo-300">"{currentWord.word}"</span> to receive an AI-powered evaluation.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={state.userSentence}
                onChange={(e) => setState(prev => ({ ...prev, userSentence: e.target.value }))}
                placeholder="Type your sentence here..."
                disabled={state.isLoading || state.evaluation !== null}
                className="w-full h-44 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-lg font-medium placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-100"
              />
              
              {!state.evaluation ? (
                <button
                  type="submit"
                  disabled={state.isLoading || !state.userSentence.trim()}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                    state.isLoading || !state.userSentence.trim() ? 'bg-indigo-200 shadow-none cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {state.isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/></svg>
                      Submit for Review
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-4 rounded-2xl font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 border border-indigo-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Try a New Sentence
                </button>
              )}
            </form>
          </div>

          {/* Feedback Display */}
          {state.evaluation && (
            <div className={`bg-white rounded-3xl shadow-sm border-2 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${state.evaluation.score >= 8 ? 'border-emerald-200' : state.evaluation.score < 5 ? 'border-amber-200' : 'border-blue-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-slate-800">Review Results</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">Rating:</span>
                  <span className={`text-3xl font-black ${state.evaluation.score >= 8 ? 'text-emerald-600' : state.evaluation.score < 5 ? 'text-amber-600' : 'text-blue-600'}`}>
                    {state.evaluation.score}/10
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Feedback</h5>
                  <p className="text-slate-800 leading-relaxed font-medium">{state.evaluation.feedback}</p>
                </div>

                {state.evaluation.suggestion && (
                  <div className="mt-4 p-5 bg-amber-50 rounded-2xl border-l-4 border-amber-400">
                    <h5 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Refined Suggestion</h5>
                    <p className="text-amber-950 font-bold italic text-lg leading-relaxed">"{state.evaluation.suggestion}"</p>
                  </div>
                )}
                
                {state.evaluation.isExcellent && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    </div>
                    <span className="text-emerald-800 font-bold text-sm uppercase tracking-tight">Exceptional articulation! Mastered.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm gap-4">
        <p>© {new Date().getFullYear()} Eloquently. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-600 transition-colors">Dictionary API</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Gemini Intelligence</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Learning Path</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
