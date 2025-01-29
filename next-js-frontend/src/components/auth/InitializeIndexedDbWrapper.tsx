"use client";

import { initializeIndexDb } from "@/utils/indexedDB";
import { useEffect } from "react";

export const InitializeIndexedDbWrapper = () => {
  useEffect(() => {
    initializeIndexDb();
  }, []);
  return <></>;
};
