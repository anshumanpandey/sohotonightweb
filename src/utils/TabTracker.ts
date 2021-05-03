import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useTabTracker = () => {
    const params = useLocation<{ tabIdx: string }>();
    const [onTabChangeCb, setOnTabChangeCb] = useState<undefined | ((idx: string) => void)>()

    useEffect(() => {
        const query = new URLSearchParams(params.search)
        const tabIdx = query.get("tabIdx")
        if (tabIdx) {
            onTabChangeCb && onTabChangeCb(tabIdx)
        }
    }, [params, onTabChangeCb])

    return {
        setOnTabChangeCb
    }
}