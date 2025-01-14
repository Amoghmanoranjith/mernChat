'use client';
import { initializeIndexDb } from "@/utils/indexedDB";
import { useEffect } from "react";

type PropTypes = {
  children: React.ReactNode;
};

export const InitializeIndexedDbWrapper = ({ children }: PropTypes) => {

    useEffect(()=>{
        if(typeof window !== 'undefined'){
            initializeIndexDb();
        }
    },[])
  return children;
};
