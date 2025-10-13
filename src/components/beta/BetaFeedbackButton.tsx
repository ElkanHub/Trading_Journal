
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const texts = ["Beta Version - Learn more", "We'd love to get your feedback"];

const BetaFeedbackButton = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/beta" passHref>
      <motion.div
        className="fixed bottom-5 right-5 bg-primary text-primary-foreground p-3 rounded-full shadow-lg cursor-pointer"
        // Add animation here when framer-motion is installed
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default BetaFeedbackButton;
