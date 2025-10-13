"use client";

import React, { useState, useEffect } from "react";
import { getAboutInfo } from "@/lib/db/beta";

const AboutBeta = () => {
  const [aboutInfo, setAboutInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      const info = await getAboutInfo();
      setAboutInfo(info);
    };

    fetchAboutInfo();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">About the Beta Version</h2>
      <p>
        This is a beta version of our application. We appreciate your feedback!
      </p>
      <p>
        This page is currently under development. Please check back later for
        updates.
      </p>
      <p>
        This page will be used to showcase new features and improvements. And we
        welcome your suggestions!
      </p>
      <p>~The ForexPencil Team</p>
      <div className="space-y-4">
        {aboutInfo.map((info) => (
          <div key={info.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{info.title}</h3>
              {info.isNew && (
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-2">{info.content}</p>
            <p className="text-sm text-muted-foreground">{info.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutBeta;
