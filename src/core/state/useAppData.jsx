import {AppDataContext} from "./AppDataContext.data"
import { useContext } from "react";
export function useAppData(){
    const  ctx=useContext(AppDataContext);
    if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}