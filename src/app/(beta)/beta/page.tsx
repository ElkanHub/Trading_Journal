
"use client";

import { useState } from 'react';
import AboutBeta from '@/components/beta/AboutBeta';
import Feedback from '@/components/beta/Feedback';

const BetaPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="container mx-auto p-4">
      <div className="flex border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'about' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About Beta Version
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'feedback' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Leave a Feedback
        </button>
      </div>
      <div className="py-4">
        {activeTab === 'about' ? <AboutBeta /> : <Feedback />}
      </div>
    </div>
  );
};

export default BetaPage;
