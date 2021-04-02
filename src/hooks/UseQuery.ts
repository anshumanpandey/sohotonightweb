import { useLocation } from "react-router-dom";

export const UseQuery = () => {
  return new URLSearchParams(useLocation().search);
}
